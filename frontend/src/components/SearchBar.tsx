'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function SearchBar({ compact = false }: { compact?: boolean }) {
  const [guests, setGuests] = useState('2');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');

  const href = `/parks?${new URLSearchParams({
    ...(destination && { city: destination }),
  })}`;

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2 bg-white p-3 rounded-2xl shadow-card border border-brand-border">
        <input
          type="text"
          placeholder="Куда"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="input-field flex-1 min-w-[140px] border-0 shadow-none"
        />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-field w-auto" />
        <select value={guests} onChange={(e) => setGuests(e.target.value)} className="input-field w-auto">
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>{n} гост{n === 1 ? 'ь' : n < 5 ? 'я' : 'ей'}</option>
          ))}
        </select>
        <Link href={href} className="btn-primary shrink-0">Найти</Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-search border border-white/50 p-2 md:p-3">
      <div className="flex flex-col lg:flex-row lg:items-stretch gap-2 lg:gap-0 lg:divide-x divide-brand-border">
        <div className="flex-[1.2] px-4 py-3 lg:py-4">
          <label className="text-[11px] font-bold text-brand-accent uppercase tracking-wider">Куда едем</label>
          <input
            type="text"
            placeholder="Orlando, Dubai, Paris..."
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full text-brand-text font-medium text-lg mt-1 outline-none placeholder:text-stone-400"
          />
        </div>
        <div className="flex-1 px-4 py-3 lg:py-4">
          <label className="text-[11px] font-bold text-brand-accent uppercase tracking-wider">Дата</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full text-brand-text font-medium mt-1 outline-none bg-transparent"
          />
        </div>
        <div className="lg:w-40 px-4 py-3 lg:py-4">
          <label className="text-[11px] font-bold text-brand-accent uppercase tracking-wider">Гости</label>
          <select
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="w-full text-brand-text font-medium mt-1 outline-none bg-transparent cursor-pointer"
          >
            <option value="1">1 гость</option>
            <option value="2">2 гостя</option>
            <option value="3">3 гостя</option>
            <option value="4">4 гостя</option>
            <option value="5">5+ гостей</option>
          </select>
        </div>
        <div className="p-2 lg:p-3 flex items-stretch">
          <Link
            href={href}
            className="btn-primary w-full lg:w-auto lg:min-w-[160px] h-full min-h-[56px] flex items-center justify-center text-base"
          >
            Найти парки
          </Link>
        </div>
      </div>
    </div>
  );
}
