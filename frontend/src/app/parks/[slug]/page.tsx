import Image from 'next/image';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import BookingBar from '@/components/BookingBar';
import FavoriteButton from '@/components/FavoriteButton';
import { getPark, getAttractions, getTickets } from '@/lib/api';
import { worldHubByCategory } from '@/lib/worlds';
import { checkoutPath } from '@/lib/checkout-path';

export default async function ParkDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const park = await getPark(params.slug);
  if (!park) notFound();

  if (park.category === 'star-wars') {
    redirect('/worlds/star-wars');
  }
  if (park.category === 'harry-potter') {
    redirect('/worlds/harry-potter');
  }
  if (park.category === 'marvel') {
    redirect('/worlds/marvel');
  }
  if (park.category === 'jurassic') {
    redirect('/worlds/jurassic');
  }

  const isStarWars = park.category === 'star-wars';
  const worldHub = worldHubByCategory[park.category];
  const accent = isStarWars ? '#FFE81F' : park.theme.primaryColor;

  const [attractions, tickets] = await Promise.all([
    getAttractions(params.slug),
    getTickets(params.slug),
  ]);

  return (
    <main className={`pb-20 ${isStarWars ? 'bg-[#0a0a12] text-white' : 'bg-brand-bg'}`}>
      <section className="relative h-[440px] md:h-[520px]">
        <Image
          src={park.coverImage}
          alt={park.name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div
          className={`absolute inset-0 ${
            isStarWars
              ? 'bg-gradient-to-t from-[#0a0a12] via-[#0a0a12]/50 to-transparent'
              : 'image-overlay'
          }`}
        />
        {isStarWars && (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,232,31,0.12)_0%,transparent_50%)]" />
        )}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-6xl mx-auto">
          {park.badge && (
            <span
              className={`inline-block text-xs font-bold px-4 py-1.5 rounded-full mb-4 shadow-lg ${
                isStarWars ? 'bg-[#FFE81F] text-[#0a0a12]' : 'bg-brand-coral text-white'
              }`}
            >
              {park.badge}
            </span>
          )}
          {worldHub && (
            <Link
              href={worldHub.href}
              className="inline-block text-sm font-semibold mb-3 hover:underline"
              style={{ color: isStarWars ? '#FFE81F' : accent }}
            >
              ← {worldHub.label}
            </Link>
          )}
          <h1
            className={`font-display text-4xl md:text-6xl font-bold text-white ${
              isStarWars ? 'text-[#FFE81F]' : ''
            }`}
          >
            {park.name}
          </h1>
          <p className="text-white/80 text-lg mt-2">{park.region}</p>
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <p className={`font-semibold text-lg ${isStarWars ? 'text-amber-300' : 'text-amber-300'}`}>
              ★ {park.ratingAvg} · {park.reviewCount.toLocaleString('ru-RU')} отзывов · {park.zones} зон
            </p>
            <FavoriteButton slug={park.slug} variant="hero" />
          </div>
        </div>
      </section>

      <BookingBar
        slug={park.slug}
        priceFrom={park.priceFrom}
        accentColor={accent}
      />

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-14 space-y-20">
        <section className={`p-8 md:p-10 rounded-2xl ${isStarWars ? 'bg-white/5 border border-white/10' : 'card'}`}>
          <h2 className={`text-2xl font-bold mb-4 ${isStarWars ? 'text-[#FFE81F]' : 'section-title'}`}>
            О парке
          </h2>
          <p className={`leading-relaxed text-lg max-w-3xl ${isStarWars ? 'text-stone-400' : 'text-brand-muted'}`}>
            {park.description}
          </p>
        </section>

        <section>
          <h2 className={`mb-8 ${isStarWars ? 'font-display text-3xl text-[#FFE81F]' : 'section-title'}`}>
            Билеты и тарифы
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {tickets.map((t, i) => (
              <div
                key={t.id}
                className={`p-8 flex flex-col relative rounded-2xl ${
                  isStarWars
                    ? i === 1
                      ? 'border border-[#FFE81F] bg-[#FFE81F]/5'
                      : 'border border-white/10 bg-white/5'
                    : `card ${i === 1 ? 'ring-2 ring-brand-accent shadow-card-hover md:scale-[1.02]' : ''}`
                }`}
              >
                {i === 1 && (
                  <span
                    className={`absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-4 py-1.5 rounded-full ${
                      isStarWars ? 'bg-[#FFE81F] text-[#0a0a12]' : 'bg-gradient-to-r from-brand-accent to-brand-navy text-white'
                    }`}
                  >
                    Популярный
                  </span>
                )}
                <h3 className={`text-xl font-bold ${isStarWars ? 'text-white' : 'text-brand-navy'}`}>{t.name}</h3>
                <p className={`text-4xl font-bold tabular-nums mt-5 ${isStarWars ? 'text-[#FFE81F]' : 'text-brand-navy'}`}>
                  {t.price} <span className={`text-lg font-medium ${isStarWars ? 'text-stone-500' : 'text-brand-muted'}`}>€</span>
                </p>
                <ul className="mt-8 space-y-3 flex-1">
                  {t.features.map((f) => (
                    <li key={f} className={`text-sm flex gap-2 ${isStarWars ? 'text-stone-400' : 'text-brand-muted'}`}>
                      <span className={isStarWars ? 'text-[#FFE81F]' : 'text-brand-accent'}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={checkoutPath(park.slug, { ticket: t.id })}
                  className={`mt-8 text-center py-3.5 rounded-xl font-semibold ${
                    i === 1
                      ? isStarWars
                        ? 'bg-[#FFE81F] text-[#0a0a12] hover:bg-[#fff176]'
                        : 'btn-primary'
                      : isStarWars
                        ? 'border border-white/20 hover:border-[#FFE81F]'
                        : 'btn-outline'
                  }`}
                >
                  Выбрать
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className={`mb-8 ${isStarWars ? 'font-display text-2xl' : 'section-title'}`}>Аттракционы</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {attractions.map((a) => (
              <article
                key={a.id}
                className={`group transition-all rounded-2xl overflow-hidden ${
                  isStarWars
                    ? 'bg-white/5 border border-white/10 hover:border-[#FFE81F]/30'
                    : 'card hover:shadow-card-hover'
                }`}
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={a.imageUrl}
                    alt={a.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="400px"
                  />
                  <span className="absolute top-3 left-3 bg-black/60 text-white text-xs font-medium px-2 py-1 rounded-lg">
                    ~{a.avgWaitMin} мин
                  </span>
                </div>
                <div className="p-5">
                  <span className={`text-xs font-bold uppercase tracking-wide ${isStarWars ? 'text-[#FFE81F]' : 'text-brand-accent'}`}>
                    {a.category}
                  </span>
                  <h3 className={`font-bold text-lg mt-1 ${isStarWars ? 'text-white' : 'text-brand-navy'}`}>{a.name}</h3>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
