import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import JurassicCheckoutWizard from '@/components/checkout/JurassicCheckoutWizard';
import { getPark, getTickets } from '@/lib/api';
import { jpColors, JP_PARK_SLUG } from '@/lib/jurassic-images';
import '../jurassic.css';

const C = jpColors;

export default async function JurassicBookPage() {
  const park = await getPark(JP_PARK_SLUG);
  if (!park) notFound();
  const tickets = await getTickets(JP_PARK_SLUG);

  return (
    <Suspense
      fallback={
        <main className="jp-page min-h-screen flex items-center justify-center" style={{ background: C.bg, color: 'rgba(236,253,245,0.5)' }}>
          Загрузка бронирования…
        </main>
      }
    >
      <JurassicCheckoutWizard park={park} tickets={tickets} />
    </Suspense>
  );
}
