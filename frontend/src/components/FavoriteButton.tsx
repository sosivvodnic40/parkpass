'use client';

import { useEffect, useState } from 'react';
import { getFavorites, toggleFavorite } from '@/lib/auth';

export default function FavoriteButton({ slug }: { slug: string }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(getFavorites().includes(slug));
  }, [slug]);

  return (
    <button
      type="button"
      onClick={() => setActive(toggleFavorite(slug).includes(slug))}
      className="px-4 py-2 rounded-[10px] border border-brand-border bg-white text-sm font-medium hover:border-brand-accent transition"
      aria-label="Избранное"
    >
      {active ? '♥ В избранном' : '♡ В избранное'}
    </button>
  );
}
