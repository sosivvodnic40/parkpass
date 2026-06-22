import Image from 'next/image';
import Link from 'next/link';
import { getPark, getTickets, getReviews } from '@/lib/api';
import { jpCheckoutPath } from '@/lib/checkout-path';
import {
  jpColors,
  jpGallery,
  jpHeroDino,
  jpExperiences,
  JP_PARK_SLUG,
} from '@/lib/jurassic-images';
import JpParticles from '@/components/jp/JpParticles';
import JpDivider from '@/components/jp/JpDivider';
import ParkReviews from '@/components/ParkReviews';
import './jurassic.css';

const C = jpColors;
const TRUST = ['Без скрытых сборов', 'QR мгновенно', 'Безопасная оплата'];

export default async function JurassicWorldPage() {
  const park = await getPark(JP_PARK_SLUG);
  const [tickets, reviews] = await Promise.all([
    getTickets(JP_PARK_SLUG),
    getReviews(JP_PARK_SLUG),
  ]);

  const stats = park
    ? [
        { val: String(park.ratingAvg), label: 'рейтинг' },
        { val: park.reviewCount.toLocaleString('ru-RU'), label: 'отзывов' },
        { val: `от ${park.priceFrom} €`, label: 'цена' },
        { val: String(park.zones), label: 'зон' },
      ]
    : [];

  return (
    <main className="jp-page min-h-screen overflow-x-hidden">
      <section className="max-w-7xl mx-auto px-6 py-10">
        <p className="jp-eyebrow jp-eyebrow--center mb-8">
          <span aria-hidden>★</span>
          Вселенная Jurassic World · Universal
          <span aria-hidden>★</span>
        </p>

        <div className="jp-bento-grid">
          <div className="jp-bento-card jp-bento-card--main group">
            <Image
              src={jpGallery[0].src}
              alt={jpGallery[0].alt}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 60vw"
              priority
            />
            <div
              className="absolute inset-0 z-[1]"
              style={{
                background: `linear-gradient(to top,
                  rgba(10,18,12,0.95) 0%,
                  rgba(34,197,94,0.2) 45%,
                  transparent 72%)`,
              }}
            />
            <div className="absolute bottom-6 left-6 right-6 z-10">
              <p className="jp-eyebrow mb-2">{jpGallery[0].badge}</p>
              <h2 className="jp-display text-2xl md:text-4xl font-bold mb-2">{jpGallery[0].title}</h2>
              <p className="text-sm max-w-lg leading-relaxed" style={{ color: 'rgba(236,253,245,0.75)' }}>
                {jpGallery[0].subtitle}
              </p>
            </div>
          </div>

          {[jpGallery[1], jpGallery[2]].map((item) => (
            <div key={item.label} className="jp-bento-card jp-bento-card--side group min-h-[200px]">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="40vw"
              />
              <div
                className="absolute inset-0 z-[1]"
                style={{
                  background: 'linear-gradient(to top, rgba(10,18,12,0.8) 0%, transparent 55%)',
                }}
              />
              <div className="absolute bottom-4 left-4 z-10">
                <span className="text-sm font-semibold tracking-wide">{item.label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="jp-hero">
        <div className="absolute right-0 top-0 h-full w-full md:w-[68%] z-0">
          <Image
            src={jpHeroDino}
            alt="Динозавры Jurassic World"
            fill
            className="object-cover object-[center_30%] md:object-left opacity-95"
            sizes="70vw"
            priority
          />
        </div>
        <div className="jp-hero-glow" />
        <JpParticles count={20} />

        <div className="relative max-w-7xl mx-auto px-6 z-10">
          <p className="jp-eyebrow mb-6">
            <span aria-hidden>🦕</span>
            Jurassic World · Islands of Adventure
          </p>

          <h1 className="jp-display text-5xl md:text-7xl lg:text-8xl font-black mb-6 max-w-3xl">
            Стань частью
            <br />
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: `linear-gradient(135deg, ${C.greenLight}, ${C.green} 50%, ${C.amber})`,
              }}
            >
              приключения
            </span>
          </h1>

          <p className="text-base md:text-lg max-w-xl mb-6 leading-relaxed" style={{ color: 'rgba(236,253,245,0.72)' }}>
            VelociCoaster, River Adventure и встречи с рапторами — забронируйте без скрытых сборов.
          </p>

          <div className="jp-trust-row">
            {TRUST.map((t) => (
              <span key={t} className="jp-trust-pill">
                {t}
              </span>
            ))}
          </div>

          <JpDivider />

          <div className="jp-stats my-8">
            {stats.map((s) => (
              <div key={s.label} className="jp-stat">
                <div className="jp-stat-value">{s.val}</div>
                <div className="jp-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href={jpCheckoutPath()} className="jp-btn-primary px-8 py-3.5 rounded-xl text-base">
              Забронировать
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Link>
            <Link href="#tickets" className="jp-btn-secondary text-base">
              Тарифы
            </Link>
            <Link href="/parks" className="jp-btn-secondary text-base opacity-80">
              Все парки
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20 md:py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <p className="jp-eyebrow mb-3">Must-See</p>
            <h2 className="jp-display text-3xl md:text-4xl font-black">Легендарные аттракционы</h2>
          </div>
          <p className="text-sm max-w-sm leading-relaxed md:text-right" style={{ color: C.textMuted }}>
            Четыре зоны, которые нельзя пропустить в Jurassic World.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {jpExperiences.map((t) => (
            <article key={t.id} className="jp-exp-card group">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={t.img}
                  alt={t.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="280px"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(10,18,12,0.75) 0%, rgba(217,119,6,0.08) 40%, transparent 55%)',
                  }}
                />
                <div className="absolute bottom-3 left-3">
                  <span className="jp-exp-badge">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    {t.duration}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <p className="jp-zone-tag mb-1.5">{t.zone}</p>
                <h3 className="jp-display text-lg font-bold mb-2">{t.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: C.textMuted }}>
                  {t.subtitle}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="tickets" className="py-20 md:py-28 relative overflow-hidden jp-tickets-bg scroll-mt-24">
        <JpParticles count={40} />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="jp-eyebrow justify-center mb-4">Билеты</p>
            <h2 className="jp-display text-4xl md:text-6xl font-black mb-4">Выберите свой путь</h2>
            <p className="text-sm" style={{ color: C.textMuted }}>
              Без скрытых сборов · QR сразу после оплаты
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto items-stretch">
            {tickets.map((t) => {
              const featured = t.name === 'Explorer Pass';
              return (
                <div
                  key={t.id}
                  className={`jp-ticket-card ${featured ? 'jp-ticket-card--featured' : ''}`}
                >
                  <div>
                    <div className="min-h-[28px] mb-4">
                      {featured && <span className="jp-badge-popular">ПОПУЛЯРНЫЙ</span>}
                    </div>
                    <h3 className="jp-display text-2xl font-bold mb-3">{t.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span
                        className="jp-display text-5xl font-black"
                        style={{
                          color: featured ? C.green : C.text,
                          textShadow: featured ? '0 0 24px rgba(34,197,94,0.35)' : undefined,
                        }}
                      >
                        {t.price}
                      </span>
                      <span className="text-lg font-medium" style={{ color: C.textMuted }}>
                        €
                      </span>
                    </div>
                  </div>

                  <ul className="jp-feature-list flex flex-col gap-3 flex-1">
                    {t.features.map((f) => (
                      <li key={f}>
                        <span className="jp-feature-claw" aria-hidden>
                          🦖
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={jpCheckoutPath({ ticket: t.id, guests: 2 })}
                    className={
                      featured
                        ? 'jp-btn-primary py-3.5 rounded-xl jp-display text-sm tracking-wider'
                        : 'jp-btn-ghost'
                    }
                  >
                    {featured ? 'Выбрать Explorer Pass' : 'Выбрать'}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {park && (
        <ParkReviews
          parkSlug={JP_PARK_SLUG}
          parkName={park.name}
          initialReviews={reviews}
          theme="jp"
        />
      )}
    </main>
  );
}
