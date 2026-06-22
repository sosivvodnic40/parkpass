import { createBooking, type Booking } from '@/lib/api';
import { getToken } from '@/lib/auth';

export type SubmitBookingResult =
  | { ok: true; booking: Booking }
  | { ok: false; reason: 'no_auth' | 'api_error' };

export async function submitBooking(body: {
  parkSlug: string;
  parkName: string;
  ticketId: string;
  ticketName?: string;
  visitDate?: string;
  guests: number;
  totalAmount: number;
}): Promise<SubmitBookingResult> {
  const token = getToken();
  if (!token) return { ok: false, reason: 'no_auth' };
  const booking = await createBooking(token, body);
  if (!booking) return { ok: false, reason: 'api_error' };
  return { ok: true, booking };
}

export function authRedirectPath(): string {
  if (typeof window === 'undefined') return '/auth';
  const next = window.location.pathname + window.location.search;
  return `/auth?next=${encodeURIComponent(next)}`;
}

export async function confirmCheckoutBooking(
  router: { push: (url: string) => void },
  body: Parameters<typeof submitBooking>[0],
  onSuccess: (booking: Booking) => void,
  onError: (message: string) => void,
): Promise<void> {
  const result = await submitBooking(body);
  if (!result.ok) {
    if (result.reason === 'no_auth') {
      router.push(authRedirectPath());
    } else {
      onError('Не удалось сохранить бронь. Запустите backend на порту 4000 (127.0.0.1:4000).');
    }
    return;
  }
  onSuccess(result.booking);
}
