import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import BookingBar from '@/components/BookingBar';
import FavoriteButton from '@/components/FavoriteButton';
import { getPark, getAttractions, getTickets } from '@/lib/api';

export default async function ParkDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const park = await getPark(params.slug);
  if (!park) notFound();

  const [attractions, tickets] = await Promise.all([
    getAttractions(params.slug),
    getTickets(params.slug),
  ]);

  return (
    <main className="pb-20 bg-brand-bg">
      <section className="relative h-[440px] md:h-[520px]">
        <Image
          src={park.coverImage}
          alt={park.name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="image-overlay" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-6xl mx-auto">
          {park.badge && (
            <span className="inline-block bg-brand-coral text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4 shadow-lg">
              {park.badge}
            </span>
          )}
          <h1 className="font-display text-4xl md:text-6xl font-bold text-white">{park.name}</h1>
          <p className="text-white/80 text-lg mt-2">{park.region}</p>
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <p className="text-amber-300 font-semibold text-lg">
              ★ {park.ratingAvg} · {park.reviewCount.toLocaleString('ru-RU')} отзывов · {park.zones} зон
            </p>
            <FavoriteButton slug={park.slug} variant="hero" />
          </div>
        </div>
      </section>

      <BookingBar
        slug={park.slug}
        priceFrom={park.priceFrom}
        accentColor={park.theme.primaryColor}
      />

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-14 space-y-20">
        <section className="card p-8 md:p-10">
          <h2 className="section-title text-2xl mb-4">О парке</h2>
          <p className="text-brand-muted leading-relaxed text-lg max-w-3xl">{park.description}</p>
        </section>

        <section>
          <h2 className="section-title mb-8">Билеты и тарифы</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {tickets.map((t, i) => (
              <div
                key={t.id}
                className={`card p-8 flex flex-col relative ${
                  i === 1 ? 'ring-2 ring-brand-accent shadow-card-hover md:scale-[1.02]' : ''
                }`}
              >
                {i === 1 && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-accent to-brand-navy text-white text-xs font-bold px-4 py-1.5 rounded-full">
                    Популярный
                  </span>
                )}
                <h3 className="text-xl font-bold text-brand-navy">{t.name}</h3>
                <p className="text-4xl font-bold tabular-nums mt-5 text-brand-navy">
                  {t.price} <span className="text-lg font-medium text-brand-muted">€</span>
                </p>
                <ul className="mt-8 space-y-3 flex-1">
                  {t.features.map((f) => (
                    <li key={f} className="text-sm text-brand-muted flex gap-2">
                      <span className="text-brand-accent font-bold">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/checkout?park=${park.slug}&ticket=${t.id}`}
                  className={`mt-8 text-center py-3.5 rounded-xl font-semibold ${
                    i === 1 ? 'btn-primary' : 'btn-outline'
                  }`}
                >
                  Выбрать
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="section-title mb-8">Аттракционы</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {attractions.map((a) => (
              <article key={a.id} className="card group hover:shadow-card-hover transition-all">
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
                  <span className="text-xs font-bold text-brand-accent uppercase tracking-wide">
                    {a.category}
                  </span>
                  <h3 className="font-bold text-brand-navy text-lg mt-1">{a.name}</h3>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="card p-8 md:p-10 bg-gradient-to-br from-brand-bg to-white">
          <h2 className="section-title text-2xl mb-6">Отзывы гостей</h2>
          <div className="flex flex-wrap items-center gap-8">
            <span className="text-6xl font-display font-bold text-brand-navy">{park.ratingAvg}</span>
            <div>
              <p className="text-amber-500 text-2xl tracking-widest">★★★★★</p>
              <p className="text-brand-muted mt-1">
                {park.reviewCount.toLocaleString('ru-RU')} отзывов
              </p>
            </div>
          </div>
          <blockquote className="mt-8 pl-4 border-l-4 border-brand-accent text-brand-muted italic text-lg">
            «Незабываемый день для всей семьи! Бронирование через ParkPass заняло 2 минуты.»
          </blockquote>
        </section>
      </div>
    </main>
  );
}
