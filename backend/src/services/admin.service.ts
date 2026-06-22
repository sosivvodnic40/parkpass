import { dbIsReady, query } from '../db/pool';
import { listUsers } from './auth.service';
import { catalogParks } from '../data/catalog';
import { mockBookingRegistry } from './mock-store';
import type { ApiAdminStats, ApiBooking, ApiUser, UserRole } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToAdminBooking(row: any): ApiBooking {
  return {
    id: row.id,
    parkSlug: row.park_slug,
    parkName: row.park_name,
    ticketName: row.ticket_name ?? 'Standard',
    visitDate: String(row.visit_date).slice(0, 10),
    guests: Number(row.guests_adult ?? 1),
    totalAmount: Number(row.total_amount),
    status: row.status,
    qrCode: row.qr_code ?? '',
    createdAt: row.created_at instanceof Date
      ? row.created_at.toISOString()
      : String(row.created_at),
  };
}

export async function listAllBookings(filters?: {
  parkSlug?: string;
  status?: string;
  from?: string;
  to?: string;
}): Promise<ApiBooking[]> {
  if (dbIsReady()) {
    const clauses = ['1=1'];
    const params: unknown[] = [];
    let i = 1;

    if (filters?.parkSlug) {
      clauses.push(`p.slug = $${i++}`);
      params.push(filters.parkSlug);
    }
    if (filters?.status) {
      clauses.push(`b.status = $${i++}`);
      params.push(filters.status);
    }
    if (filters?.from) {
      clauses.push(`b.visit_date >= $${i++}`);
      params.push(filters.from);
    }
    if (filters?.to) {
      clauses.push(`b.visit_date <= $${i++}`);
      params.push(filters.to);
    }

    const { rows } = await query(
      `SELECT b.*, p.slug AS park_slug, p.name AS park_name, tt.name AS ticket_name
       FROM bookings b
       JOIN parks p ON p.id = b.park_id
       JOIN ticket_types tt ON tt.id = b.ticket_type_id
       WHERE ${clauses.join(' AND ')}
       ORDER BY b.created_at DESC
       LIMIT 200`,
      params,
    );
    return rows.map(rowToAdminBooking);
  }

  let result = mockBookingRegistry.map(({ userId: _, ...b }) => b);
  if (filters?.parkSlug) result = result.filter((b) => b.parkSlug === filters.parkSlug);
  if (filters?.status) result = result.filter((b) => b.status === filters.status);
  if (filters?.from) result = result.filter((b) => b.visitDate >= filters.from!);
  if (filters?.to) result = result.filter((b) => b.visitDate <= filters.to!);
  return result;
}

export async function updateBookingStatus(
  bookingId: string,
  status: string,
): Promise<ApiBooking | null> {
  const allowed = ['pending', 'paid', 'cancelled', 'completed'];
  if (!allowed.includes(status)) throw new Error('INVALID_STATUS');

  if (dbIsReady()) {
    const { rows } = await query(
      `UPDATE bookings SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING id`,
      [status, bookingId],
    );
    if (!rows.length) return null;
    const all = await listAllBookings();
    return all.find((b) => b.id === bookingId) ?? null;
  }

  const booking = mockBookingRegistry.find((b) => b.id === bookingId);
  if (!booking) return null;
  booking.status = status;
  const { userId: _, ...rest } = booking;
  return rest;
}

export async function getAdminStats(): Promise<ApiAdminStats> {
  if (dbIsReady()) {
    const { rows: userRows } = await query<{ count: string }>(
      'SELECT COUNT(*)::text AS count FROM users',
    );
    const { rows: parkRows } = await query<{ count: string }>(
      'SELECT COUNT(*)::text AS count FROM parks WHERE is_active = true',
    );
    const { rows: bookingRows } = await query<{ count: string; revenue: string }>(
      `SELECT COUNT(*)::text AS count, COALESCE(SUM(total_amount), 0)::text AS revenue FROM bookings`,
    );
    const { rows: statusRows } = await query<{ status: string; count: string }>(
      `SELECT status, COUNT(*)::text AS count FROM bookings GROUP BY status`,
    );
    const { rows: parkStats } = await query<{
      park_slug: string;
      park_name: string;
      count: string;
      revenue: string;
    }>(
      `SELECT p.slug AS park_slug, p.name AS park_name,
              COUNT(b.id)::text AS count,
              COALESCE(SUM(b.total_amount), 0)::text AS revenue
       FROM parks p
       LEFT JOIN bookings b ON b.park_id = p.id
       GROUP BY p.id, p.slug, p.name
       ORDER BY COUNT(b.id) DESC`,
    );

    const recentBookings = await listAllBookings();
    const bookingsByStatus: Record<string, number> = {};
    for (const row of statusRows) {
      bookingsByStatus[row.status] = Number(row.count);
    }

    return {
      usersTotal: Number(userRows[0]?.count ?? 0),
      parksTotal: Number(parkRows[0]?.count ?? 0),
      bookingsTotal: Number(bookingRows[0]?.count ?? 0),
      revenueTotal: Number(bookingRows[0]?.revenue ?? 0),
      bookingsByStatus,
      bookingsByPark: parkStats.map((p) => ({
        parkSlug: p.park_slug,
        parkName: p.park_name,
        count: Number(p.count),
        revenue: Number(p.revenue),
      })),
      recentBookings: recentBookings.slice(0, 10),
    };
  }

  const all = mockBookingRegistry.map(({ userId: _, ...b }) => b);
  const users = await listUsers();
  const bookingsByStatus: Record<string, number> = {};
  for (const b of all) {
    bookingsByStatus[b.status] = (bookingsByStatus[b.status] ?? 0) + 1;
  }

  const bookingsByPark = catalogParks.map((p) => {
    const parkBookings = all.filter((b) => b.parkSlug === p.slug);
    return {
      parkSlug: p.slug,
      parkName: p.name,
      count: parkBookings.length,
      revenue: parkBookings.reduce((s, b) => s + b.totalAmount, 0),
    };
  });

  return {
    usersTotal: users.length,
    parksTotal: catalogParks.length,
    bookingsTotal: all.length,
    revenueTotal: all.reduce((s, b) => s + b.totalAmount, 0),
    bookingsByStatus,
    bookingsByPark,
    recentBookings: all.slice(0, 10),
  };
}

export async function getVisitorsReport(from?: string, to?: string) {
  const bookings = await listAllBookings({ from, to, status: 'paid' });
  const totalGuests = bookings.reduce((s, b) => s + b.guests, 0);
  const byDate: Record<string, number> = {};
  for (const b of bookings) {
    byDate[b.visitDate] = (byDate[b.visitDate] ?? 0) + b.guests;
  }
  return {
    period: { from: from ?? null, to: to ?? null },
    totalBookings: bookings.length,
    totalGuests,
    guestsByDate: Object.entries(byDate)
      .map(([date, guests]) => ({ date, guests }))
      .sort((a, b) => a.date.localeCompare(b.date)),
  };
}

export async function getBookingsReport(from?: string, to?: string) {
  const bookings = await listAllBookings({ from, to });
  return {
    period: { from: from ?? null, to: to ?? null },
    total: bookings.length,
    revenue: bookings.reduce((s, b) => s + b.totalAmount, 0),
    byStatus: bookings.reduce<Record<string, number>>((acc, b) => {
      acc[b.status] = (acc[b.status] ?? 0) + 1;
      return acc;
    }, {}),
    items: bookings,
  };
}

export type { ApiUser, UserRole };
