'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

function CheckoutRedirect() {
  const params = useSearchParams();
  const router = useRouter();
  const park = params.get('park');

  useEffect(() => {
    if (!park) return;
    const q = new URLSearchParams();
    const ticket = params.get('ticket');
    const guests = params.get('guests');
    const date = params.get('date');
    if (ticket) q.set('ticket', ticket);
    if (guests) q.set('guests', guests);
    if (date) q.set('date', date);
    const qs = q.toString();
    router.replace(`/checkout/${park}${qs ? `?${qs}` : ''}`);
  }, [park, params, router]);

  if (!park) {
    return (
      <main className="py-12 max-w-lg mx-auto px-6 text-center">
        <h1 className="text-2xl font-bold text-brand-navy mb-4">Бронирование</h1>
        <p className="text-brand-muted">Выберите парк и билет в каталоге.</p>
      </main>
    );
  }

  return <p className="text-brand-muted py-12 text-center">Переход к оформлению...</p>;
}

export default function LegacyCheckoutPage() {
  return (
    <Suspense fallback={<p className="text-brand-muted py-12 text-center">Загрузка...</p>}>
      <CheckoutRedirect />
    </Suspense>
  );
}
