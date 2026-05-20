'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function SearchBar({ compact = false }: { compact?: boolean }) {
  const [guests, setGuests] = useState('2');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');

  const href = `/parks?${new URLSearchParams({
    ...(destination && { city: destination }),
    ...(guests && { guests }),
  })}`;

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="Куда"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="input-field flex-1 min-w-[120px]"
        />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-field w-auto" />
        <select value={guests} onChange={(e) => setGuests(e.target.value)} className="input-field w-auto">
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>{n} {n === 1 ? 'гость' : n < 5 ? 'гостя' : 'гостей'}</option>
          ))}
        </select>
        <Link href={href} className="btn-primary shrink-0">Найти</Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-search p-2 md:p-3 flex flex-col md:flex-row gap-2 md:gap-0 md:divide-x divide-brand-border">
      <div className="flex-1 px-4 py-2">
        <label className="text-xs font-semibold text-brand-muted block mb-1">Куда едем</label>
        <input
          type="text"
          placeholder="Город или парк"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="w-full text-brand-text font-medium outline-none placeholder:text-stone-400"
        />
      </div>
      <div className="flex-1 px-4 py-2">
        <label className="text-xs font-semibold text-brand-muted block mb-1">Дата визита</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full text-brand-text font-medium outline-none"
        />
      </div>
      <div className="md:w-36 px-4 py-2">
        <label className="text-xs font-semibold text-brand-muted block mb-1">Гости</label>
        <select
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          className="w-full text-brand-text font-medium outline-none bg-transparent"
        >
          <option value="1">1 гость</option>
          <option value="2">2 гостя</option>
          <option value="3">3 гостя</option>
          <option value="4">4 гостя</option>
          <option value="5">5+ гостей</option>
        </select>
      </div>
      <div className="p-2 flex items-end">
        <Link href={href} className="btn-primary w-full md:w-auto h-[52px] px-8">
          Найти парки
        </Link>
      </div>
    </div>
  );
}
