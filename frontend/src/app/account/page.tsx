'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUser, type User } from '@/lib/auth';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

interface Booking {
  id: string;
  parkName: string;
  visitDate: string;
  guests: number;
  totalAmount: number;
  status: string;
  qrCode: string;
}

const tierLabels: Record<string, string> = {
  bronze: 'Bronze',
  silver: 'Silver',
  gold: 'Gold',
  platinum: 'Platinum',
};

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const u = getUser();
    if (!u) {
      router.replace('/auth');
      return;
    }
    setUser(u);
    fetch(`${API}/api/v1/bookings/demo`)
      .then((r) => r.json())
      .then(setBookings)
      .catch(() => setBookings([]));
  }, [router]);

  if (!user) return null;

  return (
    <main className="py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-brand-navy mb-8">Личный кабинет</h1>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="card p-6 md:col-span-2">
            <p className="text-sm text-brand-muted">Профиль</p>
            <p className="text-xl font-bold text-brand-navy mt-1">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-brand-muted">{user.email}</p>
          </div>
          <div className="card p-6 bg-gradient-to-br from-brand-accent/10 to-brand-navy/5">
            <p className="text-sm text-brand-muted">Клуб ParkPass</p>
            <p className="text-2xl font-bold text-brand-accent mt-1 capitalize">
              {tierLabels[user.clubTier] ?? user.clubTier}
            </p>
            <p className="text-sm text-brand-muted mt-2">{user.loyaltyPoints} баллов</p>
          </div>
        </div>

        <section>
          <h2 className="text-xl font-bold text-brand-navy mb-4">История бронирований</h2>
          {bookings.length === 0 ? (
            <div className="card p-8 text-center text-brand-muted">
              <p>Бронирований пока нет</p>
              <Link href="/parks" className="btn-primary inline-block mt-4">Найти парки</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((b) => (
                <div key={b.id} className="card p-5 flex flex-wrap justify-between gap-4 items-center">
                  <div>
                    <p className="font-bold text-brand-navy">{b.parkName}</p>
                    <p className="text-sm text-brand-muted">
                      {b.visitDate} · {b.guests} гостей · {b.status}
                    </p>
                    <p className="text-xs text-brand-muted mt-1 font-mono">QR: {b.qrCode}</p>
                  </div>
                  <p className="text-xl font-bold tabular-nums">{b.totalAmount} €</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
