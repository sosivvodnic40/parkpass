import { API_BASE } from '@/lib/config';
import { safeFetch } from '@/lib/api';
import { authHeaders } from '@/lib/auth';

export type AdminStats = {
  usersTotal: number;
  parksTotal: number;
  bookingsTotal: number;
  revenueTotal: number;
  bookingsByStatus: Record<string, number>;
  bookingsByPark: { parkSlug: string; parkName: string; count: number; revenue: number }[];
  recentBookings: {
    id: string;
    parkName: string;
    visitDate: string;
    totalAmount: number;
    status: string;
  }[];
};

export type AdminBooking = {
  id: string;
  parkSlug: string;
  parkName: string;
  ticketName?: string;
  visitDate: string;
  guests: number;
  totalAmount: number;
  status: string;
  qrCode: string;
  createdAt?: string;
};

export type AdminReview = {
  id: string;
  parkSlug: string;
  parkName: string;
  userName: string;
  rating: number;
  title: string | null;
  body: string | null;
  visitDate: string | null;
  isVerified: boolean;
  isApproved: boolean;
  createdAt: string;
};

export type AdminUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  clubTier: string;
  loyaltyPoints: number;
};

async function adminFetch<T>(path: string, init?: RequestInit): Promise<{ data?: T; error?: string; status: number }> {
  const res = await safeFetch(`${API_BASE}/api/v1/admin${path}`, {
    ...init,
    headers: { ...authHeaders(), ...init?.headers },
    cache: 'no-store',
  });
  if (!res) return { error: 'Сервер недоступен', status: 0 };
  if (res.status === 403) return { error: 'Недостаточно прав', status: 403 };
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    return { error: (json as { error?: string }).error ?? 'Ошибка API', status: res.status };
  }
  const data = (await res.json()) as T;
  return { data, status: res.status };
}

export async function fetchAdminStats() {
  return adminFetch<AdminStats>('/stats');
}

export async function fetchAdminBookings(params?: { parkSlug?: string; status?: string }) {
  const q = new URLSearchParams();
  if (params?.parkSlug) q.set('parkSlug', params.parkSlug);
  if (params?.status) q.set('status', params.status);
  const qs = q.toString();
  const res = await adminFetch<{ data: AdminBooking[] }>(`/bookings${qs ? `?${qs}` : ''}`);
  return { ...res, data: res.data?.data };
}

export async function patchBookingStatus(id: string, status: string) {
  return adminFetch<AdminBooking>(`/bookings/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function fetchAdminReviews(params?: { parkSlug?: string; approved?: boolean }) {
  const q = new URLSearchParams();
  if (params?.parkSlug) q.set('parkSlug', params.parkSlug);
  if (params?.approved !== undefined) q.set('approved', String(params.approved));
  const qs = q.toString();
  const res = await adminFetch<{ data: AdminReview[] }>(`/reviews${qs ? `?${qs}` : ''}`);
  return { ...res, data: res.data?.data };
}

export async function patchAdminReview(
  id: string,
  body: Partial<{ isApproved: boolean; isVerified: boolean; rating: number }>,
) {
  return adminFetch<AdminReview>(`/reviews/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export async function deleteAdminReview(id: string) {
  return adminFetch<{ ok: boolean }>(`/reviews/${id}`, { method: 'DELETE' });
}

export async function fetchAdminUsers() {
  const res = await adminFetch<{ data: AdminUser[] }>('/users');
  return { ...res, data: res.data?.data };
}

export async function patchUserRole(id: string, role: string) {
  return adminFetch<AdminUser>(`/users/${id}/role`, {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  });
}

export type AdminPark = {
  slug: string;
  name: string;
  description: string;
  location: string;
  priceFrom: number;
  coverImage: string;
  badge: string | null;
  ratingAvg: number;
  reviewCount: number;
  tickets: { id: string; name: string; price: number; features: string[] }[];
};

export type BookingVerifyResponse = {
  valid: boolean;
  reason?: string;
  message: string;
  booking?: AdminBooking;
};

export async function fetchAdminParks() {
  const res = await adminFetch<{ data: AdminPark[] }>('/parks');
  return { ...res, data: res.data?.data };
}

export async function patchAdminPark(
  slug: string,
  body: Partial<{
    name: string;
    description: string;
    priceFrom: number;
    coverImage: string;
    badge: string | null;
    ratingAvg: number;
    reviewCount: number;
  }>,
) {
  return adminFetch<AdminPark>(`/parks/${slug}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export async function patchAdminTicket(
  parkSlug: string,
  ticketCode: string,
  body: Partial<{ name: string; price: number; features: string[] }>,
) {
  return adminFetch<{ id: string; name: string; price: number; features: string[] }>(
    `/parks/${parkSlug}/tickets/${ticketCode}`,
    {
      method: 'PATCH',
      body: JSON.stringify(body),
    },
  );
}

export async function verifyBookingQr(qrCode: string, checkIn = false) {
  return adminFetch<BookingVerifyResponse>('/bookings/verify', {
    method: 'POST',
    body: JSON.stringify({ qrCode, checkIn }),
  });
}
