'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function BookingBar({
  slug,
  priceFrom,
  accentColor,
}: {
  slug: string;
  priceFrom: number;
  accentColor: string;
}) {
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState('');

  const checkoutUrl = `/checkout?park=${slug}&guests=${guests}${date ? `&date=${date}` : ''}`;

  return (
    <div className="sticky top-16 z-40 bg-white border-b border-brand-border shadow-[0_-4px_24px_rgba(0,0,0,.06)]">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-3 items-center">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input-field w-auto text-sm"
          />
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="input-field w-auto text-sm"
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n} гост{n === 1 ? 'ь' : n < 5 ? 'я' : 'ей'}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-brand-muted">от</p>
            <p className="text-2xl font-bold tabular-nums text-brand-navy">
              {priceFrom} <span className="text-base font-medium">€</span>
            </p>
          </div>
          <Link
            href={checkoutUrl}
            className="inline-flex items-center justify-center px-8 h-12 rounded-[10px] font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: accentColor }}
          >
            Забронировать
          </Link>
        </div>
      </div>
    </div>
  );
}
