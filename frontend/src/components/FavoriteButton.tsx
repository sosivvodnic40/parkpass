'use client';

import { useEffect, useState } from 'react';
import { getFavorites, toggleFavorite } from '@/lib/auth';

export default function FavoriteButton({
  slug,
  variant = 'default',
}: {
  slug: string;
  variant?: 'default' | 'hero';
}) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(getFavorites().includes(slug));
  }, [slug]);

  const base =
    variant === 'hero'
      ? 'px-4 py-2 rounded-xl border border-white/30 bg-white/10 backdrop-blur text-white text-sm font-medium hover:bg-white/20 transition'
      : 'px-4 py-2 rounded-xl border border-brand-border bg-white text-sm font-medium hover:border-brand-accent hover:text-brand-accent transition';

  return (
    <button
      type="button"
      onClick={() => setActive(toggleFavorite(slug).includes(slug))}
      className={base}
      aria-label="Избранное"
    >
      {active ? '♥ В избранном' : '♡ В избранное'}
    </button>
  );
}
