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
    <main className="pb-20">
      {/* Hero */}
      <section className="relative h-[420px] md:h-[480px]">
        <img
          src={park.coverImage}
          alt={park.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 max-w-6xl mx-auto">
          {park.badge && (
            <span className="inline-block bg-brand-accent text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
              {park.badge}
            </span>
          )}
          <h1 className="text-3xl md:text-5xl font-bold text-white">{park.name}</h1>
          <p className="text-stone-200 mt-2">{park.region}</p>
          <div className="flex flex-wrap items-center gap-4 mt-3">
            <p className="text-amber-400 font-medium">
              ★ {park.ratingAvg} · {park.reviewCount.toLocaleString('ru-RU')} отзывов · {park.zones} зон
            </p>
            <FavoriteButton slug={park.slug} />
          </div>
        </div>
      </section>

      <BookingBar
        slug={park.slug}
        priceFrom={park.priceFrom}
        accentColor={park.theme.primaryColor}
      />

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 space-y-16">
        {/* About */}
        <section>
          <h2 className="text-2xl font-bold text-brand-navy mb-4">О парке</h2>
          <p className="text-brand-muted leading-relaxed max-w-3xl">{park.description}</p>
        </section>

        {/* Tickets */}
        <section>
          <h2 className="text-2xl font-bold text-brand-navy mb-6">Билеты и тарифы</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {tickets.map((t, i) => (
              <div
                key={t.id}
                className={`card p-6 flex flex-col ${
                  i === 1 ? 'ring-2 ring-brand-accent relative' : ''
                }`}
              >
                {i === 1 && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-accent text-white text-xs font-bold px-3 py-1 rounded-full">
                    Популярный
                  </span>
                )}
                <h3 className="text-xl font-bold text-brand-navy">{t.name}</h3>
                <p className="text-3xl font-bold tabular-nums mt-4 text-brand-navy">
                  {t.price} <span className="text-lg font-medium text-brand-muted">€</span>
                </p>
                <ul className="mt-6 space-y-2 flex-1">
                  {t.features.map((f) => (
                    <li key={f} className="text-sm text-brand-muted flex gap-2">
                      <span className="text-brand-accent">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/checkout?park=${park.slug}&ticket=${t.id}`}
                  className={`mt-6 text-center py-3 rounded-[10px] font-semibold transition ${
                    i === 1 ? 'btn-primary' : 'btn-outline'
                  }`}
                >
                  Выбрать
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Attractions */}
        <section>
          <h2 className="text-2xl font-bold text-brand-navy mb-6">Аттракционы</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {attractions.map((a) => (
              <article key={a.id} className="card group hover:shadow-card-hover transition-shadow">
                <div className="h-40 overflow-hidden">
                  <img
                    src={a.imageUrl}
                    alt={a.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <span className="text-xs font-medium text-brand-accent">{a.category}</span>
                  <h3 className="font-bold text-brand-navy mt-1">{a.name}</h3>
                  <p className="text-sm text-amber-600 mt-2">Очередь ~{a.avgWaitMin} мин</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Reviews placeholder */}
        <section className="card p-8">
          <h2 className="text-2xl font-bold text-brand-navy mb-4">Отзывы гостей</h2>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-5xl font-bold text-brand-navy">{park.ratingAvg}</span>
            <div>
              <p className="text-amber-500 text-lg">★★★★★</p>
              <p className="text-brand-muted text-sm">
                на основе {park.reviewCount.toLocaleString('ru-RU')} отзывов
              </p>
            </div>
          </div>
          <p className="text-brand-muted text-sm italic">
            «Незабываемый день для всей семьи! Бронирование через ParkPass заняло 2 минуты.»
          </p>
        </section>
      </div>
    </main>
  );
}
