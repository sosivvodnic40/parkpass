'use client';

import { QRCodeSVG } from 'qrcode.react';
import type { Booking } from '@/lib/api';
import { buildBookingQrPayload } from '@/lib/booking-qr';

type Props = {
  booking: Pick<
    Booking,
    'qrCode' | 'parkSlug' | 'parkName' | 'visitDate' | 'guests' | 'ticketName' | 'totalAmount'
  >;
  accent?: string;
  textColor?: string;
  mutedColor?: string;
  className?: string;
};

export default function BookingQrCard({
  booking,
  accent = '#2563eb',
  textColor = '#0f172a',
  mutedColor = '#64748b',
  className = '',
}: Props) {
  const payload = buildBookingQrPayload(booking);

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <div
        className="rounded-2xl p-4 bg-white shadow-sm border border-black/5"
        aria-label="QR-код билета"
      >
        <QRCodeSVG value={payload} size={200} level="M" includeMargin />
      </div>
      <div className="text-center space-y-1">
        <p className="font-mono text-sm font-bold tracking-wider" style={{ color: textColor }}>
          {booking.qrCode}
        </p>
        <p className="text-xs" style={{ color: mutedColor }}>
          {booking.parkName} · {booking.visitDate} · {booking.guests} гост.
          {booking.ticketName ? ` · ${booking.ticketName}` : ''}
        </p>
        <p className="text-sm font-semibold tabular-nums" style={{ color: accent }}>
          {booking.totalAmount} €
        </p>
        <p className="text-[11px] max-w-xs" style={{ color: mutedColor }}>
          Покажите QR-код или назовите код на входе. Контролёр отсканирует билет в админ-панели.
        </p>
      </div>
    </div>
  );
}
