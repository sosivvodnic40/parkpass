'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import ParkCard from '@/components/ParkCard';
import { getFavorites } from '@/lib/auth';
import type { Park } from '@/lib/api';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export default function FavoritesPage() {
  const [parks, setParks] = useState<Park[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const slugs = getFavorites();
    if (slugs.length === 0) {
      setLoading(false);
      return;
    }
    fetch(`${API}/api/v1/parks`)
      .then((r) => r.json())
      .then((json: { data: Park[] }) => {
        setParks(json.data.filter((p) => slugs.includes(p.slug)));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-brand-navy mb-2">Избранное</h1>
        <p className="text-brand-muted mb-8">Сохранённые парки для быстрого бронирования</p>

        {loading ? (
          <p className="text-brand-muted">Загрузка...</p>
        ) : parks.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-brand-muted mb-4">Пока нет избранных парков</p>
            <Link href="/parks" className="btn-primary">Смотреть каталог</Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {parks.map((p) => (
              <ParkCard key={p.id} park={p} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
