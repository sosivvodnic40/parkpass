import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import CheckoutWizard from '@/components/checkout/CheckoutWizard';
import HarryPotterCheckoutWizard from '@/components/checkout/HarryPotterCheckoutWizard';
import JurassicCheckoutWizard from '@/components/checkout/JurassicCheckoutWizard';
import MarvelCheckoutWizard from '@/components/checkout/MarvelCheckoutWizard';
import { getPark, getTickets } from '@/lib/api';
import { getCheckoutTheme } from '@/lib/checkout-themes';
import { HP_PARK_SLUG } from '@/lib/harry-potter-images';
import { JP_PARK_SLUG } from '@/lib/jurassic-images';
import { MV_PARK_SLUG } from '@/lib/marvel-images';
import { SW_PARK_SLUG } from '@/lib/star-wars-images';
import '@/app/worlds/star-wars/star-wars.css';
import '@/app/worlds/harry-potter/harry-potter.css';
import '@/app/worlds/marvel/marvel.css';
import '@/app/worlds/jurassic/jurassic.css';

export default async function ThemedCheckoutPage({
  params,
}: {
  params: { slug: string };
}) {
  const park = await getPark(params.slug);
  if (!park) notFound();

  const tickets = await getTickets(params.slug);
  const isHarryPotter = park.category === 'harry-potter' || params.slug.startsWith('harry-potter');
  const isMarvel = park.category === 'marvel' || params.slug.startsWith('marvel-');
  const isJurassic = park.category === 'jurassic' || params.slug.startsWith('jurassic-');
  const theme = getCheckoutTheme(park.category, park.theme);

  const fallbackBg = isHarryPotter ? '#0b0d14' : isMarvel ? '#0a0e1a' : isJurassic ? '#0a120c' : '#050508';
  const fallback = (
    <main
      className="min-h-screen flex items-center justify-center"
      style={{ background: fallbackBg, color: 'rgba(245,245,244,0.5)' }}
    >
      Загрузка...
    </main>
  );

  return (
    <Suspense fallback={fallback}>
      {isHarryPotter ? (
        <HarryPotterCheckoutWizard park={park} tickets={tickets} />
      ) : isMarvel ? (
        <MarvelCheckoutWizard park={park} tickets={tickets} />
      ) : isJurassic ? (
        <JurassicCheckoutWizard park={park} tickets={tickets} />
      ) : (
        <CheckoutWizard park={park} tickets={tickets} theme={theme} />
      )}
    </Suspense>
  );
}

export function generateStaticParams() {
  return [
    { slug: SW_PARK_SLUG },
    { slug: HP_PARK_SLUG },
    { slug: MV_PARK_SLUG },
    { slug: JP_PARK_SLUG },
  ];
}
