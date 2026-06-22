import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import MarvelCheckoutWizard from '@/components/checkout/MarvelCheckoutWizard';
import { getPark, getTickets } from '@/lib/api';
import { mvColors, MV_PARK_SLUG } from '@/lib/marvel-images';
import '../marvel.css';

const C = mvColors;

export default async function MarvelBookPage() {
  const park = await getPark(MV_PARK_SLUG);
  if (!park) notFound();
  const tickets = await getTickets(MV_PARK_SLUG);

  const fallback = (
    <main
      className="mv-page min-h-screen flex items-center justify-center"
      style={{ background: C.bg, color: 'rgba(240,244,248,0.5)' }}
    >
      Загрузка бронирования…
    </main>
  );

  return (
    <Suspense fallback={fallback}>
      <MarvelCheckoutWizard park={park} tickets={tickets} />
    </Suspense>
  );
}
