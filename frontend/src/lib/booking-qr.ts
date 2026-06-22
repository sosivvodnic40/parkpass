import type { Booking } from '@/lib/api';

/** Данные внутри QR — сканирует контролёр на входе в парк */
export type BookingQrPayload = {
  type: 'parkpass-ticket';
  v: 1;
  code: string;
  park: string;
  parkName: string;
  date: string;
  guests: number;
  ticket?: string;
};

export function buildBookingQrPayload(booking: Pick<
  Booking,
  'qrCode' | 'parkSlug' | 'parkName' | 'visitDate' | 'guests' | 'ticketName'
>): string {
  const payload: BookingQrPayload = {
    type: 'parkpass-ticket',
    v: 1,
    code: booking.qrCode,
    park: booking.parkSlug,
    parkName: booking.parkName,
    date: booking.visitDate,
    guests: booking.guests,
    ticket: booking.ticketName,
  };
  return JSON.stringify(payload);
}

/** Из QR-строки (JSON) или текстового кода PP-… */
export function extractQrCodeFromInput(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed) as { code?: string };
      if (parsed.code) return parsed.code.trim().toUpperCase();
    } catch {
      /* plain text fallback */
    }
  }
  return trimmed.toUpperCase();
}
