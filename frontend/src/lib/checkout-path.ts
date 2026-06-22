import { HP_PARK_SLUG } from '@/lib/harry-potter-images';
import { JP_PARK_SLUG } from '@/lib/jurassic-images';
import { MV_PARK_SLUG } from '@/lib/marvel-images';

export function checkoutPath(
  slug: string,
  params?: { ticket?: string; guests?: number; date?: string },
) {
  const q = new URLSearchParams();
  if (params?.ticket) q.set('ticket', params.ticket);
  if (params?.guests != null) q.set('guests', String(params.guests));
  if (params?.date) q.set('date', params.date);
  const qs = q.toString();
  return `/checkout/${slug}${qs ? `?${qs}` : ''}`;
}

/** Короткий URL бронирования Хогсмида (Express по умолчанию) */
export function hpCheckoutPath(params?: { ticket?: string; guests?: number; date?: string }) {
  return checkoutPath(HP_PARK_SLUG, {
    ticket: params?.ticket ?? 't2',
    guests: params?.guests ?? 2,
    date: params?.date,
  });
}

/** Отдельная страница бронирования Marvel (Hero Pass по умолчанию) */
export function mvCheckoutPath(params?: { ticket?: string; guests?: number; date?: string }) {
  const q = new URLSearchParams();
  if (params?.ticket) q.set('ticket', params.ticket);
  else q.set('ticket', 't2');
  if (params?.guests != null) q.set('guests', String(params.guests));
  else q.set('guests', '2');
  if (params?.date) q.set('date', params.date);
  const qs = q.toString();
  return `/worlds/marvel/book${qs ? `?${qs}` : ''}`;
}

/** Бронирование Jurassic World (Explorer Pass по умолчанию) */
export function jpCheckoutPath(params?: { ticket?: string; guests?: number; date?: string }) {
  const q = new URLSearchParams();
  if (params?.ticket) q.set('ticket', params.ticket);
  else q.set('ticket', 't2');
  if (params?.guests != null) q.set('guests', String(params.guests));
  else q.set('guests', '2');
  if (params?.date) q.set('date', params.date);
  const qs = q.toString();
  return `/worlds/jurassic/book${qs ? `?${qs}` : ''}`;
}
