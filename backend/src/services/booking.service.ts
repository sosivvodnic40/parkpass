import { dbIsReady, query } from '../db/pool';
import { addMockBooking, mockBookingRegistry } from './mock-store';
import { updateBookingStatus } from './admin.service';
import { getParkBySlug, getTicketDbId } from './park.service';
import type { ApiBooking } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToBooking(row: any): ApiBooking {
  return {
    id: row.id,
    parkSlug: row.park_slug,
    parkName: row.park_name,
    ticketName: row.ticket_name ?? 'Standard',
    visitDate: row.visit_date instanceof Date
      ? row.visit_date.toISOString().slice(0, 10)
      : String(row.visit_date).slice(0, 10),
    guests: Number(row.guests_adult ?? row.guests ?? 1),
    totalAmount: Number(row.total_amount),
    status: row.status,
    qrCode: row.qr_code ?? '',
    createdAt: row.created_at instanceof Date
      ? row.created_at.toISOString()
      : String(row.created_at),
  };
}

export async function listBookingsForUser(userId: string): Promise<ApiBooking[]> {
  if (dbIsReady()) {
    const { rows } = await query(
      `SELECT b.*, p.slug AS park_slug, p.name AS park_name, tt.name AS ticket_name
       FROM bookings b
       JOIN parks p ON p.id = b.park_id
       JOIN ticket_types tt ON tt.id = b.ticket_type_id
       WHERE b.user_id = $1
       ORDER BY b.created_at DESC`,
      [userId],
    );
    return rows.map(rowToBooking);
  }
  return mockBookingRegistry
    .filter((b) => b.userId === userId)
    .map(({ userId: _, ...b }) => b);
}

export async function createBooking(input: {
  userId: string;
  parkSlug: string;
  parkName?: string;
  ticketId: string;
  ticketName?: string;
  visitDate?: string;
  guests: number;
  totalAmount: number;
}): Promise<ApiBooking> {
  const visitDate = input.visitDate ?? new Date().toISOString().slice(0, 10);
  const qrCode = `PP-${Date.now().toString(36).toUpperCase()}`;

  if (dbIsReady()) {
    const park = await getParkBySlug(input.parkSlug);
    if (!park) throw new Error('PARK_NOT_FOUND');

    const ticket = await getTicketDbId(input.parkSlug, input.ticketId);
    if (!ticket) throw new Error('TICKET_NOT_FOUND');

    const { rows: parkRows } = await query('SELECT id FROM parks WHERE slug = $1', [input.parkSlug]);

    const { rows } = await query(
      `INSERT INTO bookings (
        user_id, park_id, ticket_type_id, visit_date, guests_adult,
        total_amount, status, qr_code, payment_ref
      ) VALUES ($1,$2,$3,$4,$5,$6,'paid',$7,$8)
      RETURNING *`,
      [
        input.userId,
        parkRows[0].id,
        ticket.id,
        visitDate,
        input.guests,
        input.totalAmount,
        qrCode,
        `pay-${Date.now()}`,
      ],
    );

    await query(`UPDATE users SET loyalty_points = loyalty_points + $1 WHERE id = $2`, [
      Math.floor(input.totalAmount),
      input.userId,
    ]);

    return {
      id: rows[0].id,
      parkSlug: input.parkSlug,
      parkName: park.name,
      ticketName: ticket.name,
      visitDate,
      guests: input.guests,
      totalAmount: input.totalAmount,
      status: 'paid',
      qrCode,
      createdAt: new Date(rows[0].created_at).toISOString(),
    };
  }

  const booking: ApiBooking & { userId: string } = {
    userId: input.userId,
    id: `b${mockBookingRegistry.length + 1}`,
    parkSlug: input.parkSlug,
    parkName: input.parkName ?? input.parkSlug,
    ticketName: input.ticketName ?? 'Standard',
    visitDate,
    guests: input.guests,
    totalAmount: input.totalAmount,
    status: 'paid',
    qrCode,
    createdAt: new Date().toISOString(),
  };
  addMockBooking(booking);
  return booking;
}

function normalizeQrInput(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed) as { code?: string };
      if (parsed.code) return parsed.code.trim().toUpperCase();
    } catch {
      /* plain text */
    }
  }
  return trimmed.toUpperCase();
}

export type BookingVerifyResult = {
  valid: boolean;
  reason?: string;
  booking?: ApiBooking;
};

export async function verifyBookingByQr(qrCode: string): Promise<BookingVerifyResult> {
  const code = normalizeQrInput(qrCode);
  if (!code) return { valid: false, reason: 'EMPTY_CODE' };

  if (dbIsReady()) {
    const { rows } = await query(
      `SELECT b.*, p.slug AS park_slug, p.name AS park_name, tt.name AS ticket_name
       FROM bookings b
       JOIN parks p ON p.id = b.park_id
       JOIN ticket_types tt ON tt.id = b.ticket_type_id
       WHERE UPPER(b.qr_code) = $1
       LIMIT 1`,
      [code],
    );
    if (!rows.length) return { valid: false, reason: 'NOT_FOUND' };

    const booking = rowToBooking(rows[0]);
    if (booking.status === 'cancelled') {
      return { valid: false, reason: 'CANCELLED', booking };
    }
    if (booking.status === 'completed') {
      return { valid: false, reason: 'ALREADY_USED', booking };
    }
    if (booking.status !== 'paid' && booking.status !== 'pending') {
      return { valid: false, reason: 'INVALID_STATUS', booking };
    }

    const today = new Date().toISOString().slice(0, 10);
    if (booking.visitDate !== today) {
      return { valid: false, reason: 'WRONG_DATE', booking };
    }

    return { valid: true, booking };
  }

  const found = mockBookingRegistry.find(
    (b) => b.qrCode.toUpperCase() === code,
  );
  if (!found) return { valid: false, reason: 'NOT_FOUND' };

  const { userId: _, ...booking } = found;
  if (booking.status === 'cancelled') {
    return { valid: false, reason: 'CANCELLED', booking };
  }
  if (booking.status === 'completed') {
    return { valid: false, reason: 'ALREADY_USED', booking };
  }

  const today = new Date().toISOString().slice(0, 10);
  if (booking.visitDate !== today) {
    return { valid: false, reason: 'WRONG_DATE', booking };
  }

  return { valid: true, booking };
}

export async function checkInBookingByQr(qrCode: string): Promise<BookingVerifyResult> {
  const check = await verifyBookingByQr(qrCode);
  if (!check.valid || !check.booking) return check;

  const updated = await updateBookingStatus(check.booking.id, 'completed');
  return { valid: true, booking: updated ?? check.booking };
}
