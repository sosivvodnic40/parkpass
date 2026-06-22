'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getMyBookings, type Booking } from '@/lib/api';
import { getToken, getUser, type User } from '@/lib/auth';
import BookingQrCard from '@/components/BookingQrCard';

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
    const token = getToken();
    if (!u || !token) {
      router.replace('/auth');
      return;
    }
    setUser(u);
    getMyBookings(token).then(setBookings).catch(() => setBookings([]));
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
            {(user.role === 'admin' || user.role === 'park_manager') && (
              <Link href="/admin" className="inline-block mt-4 text-sm font-semibold text-brand-accent hover:underline">
                Админ-панель →
              </Link>
            )}
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
              <Link href="/parks" className="btn-primary inline-block mt-4">
                Найти парки
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map((b) => (
                <div key={b.id} className="card p-5 flex flex-col md:flex-row gap-6 md:items-start md:justify-between">
                  <div className="flex-1">
                    <p className="font-bold text-brand-navy">{b.parkName}</p>
                    <p className="text-sm text-brand-muted">
                      {b.visitDate} · {b.guests} гостей · {b.status}
                      {b.ticketName ? ` · ${b.ticketName}` : ''}
                    </p>
                  </div>
                  {b.status !== 'cancelled' && b.qrCode ? (
                    <BookingQrCard booking={b} className="md:items-end" />
                  ) : (
                    <p className="text-xl font-bold tabular-nums self-center">{b.totalAmount} €</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
