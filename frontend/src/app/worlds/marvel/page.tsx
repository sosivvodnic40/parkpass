import Image from 'next/image';
import Link from 'next/link';
import { getPark, getTickets, getReviews } from '@/lib/api';
import { mvCheckoutPath } from '@/lib/checkout-path';
import {
  mvColors,
  mvGallery,
  mvHeroCharacter,
  mvExperiences,
  MV_PARK_SLUG,
} from '@/lib/marvel-images';
import MvParticles from '@/components/mv/MvParticles';
import MvDivider from '@/components/mv/MvDivider';
import ParkReviews from '@/components/ParkReviews';
import './marvel.css';

const C = mvColors;

const TRUST = ['Без скрытых сборов', 'QR мгновенно', 'Безопасная оплата'];

export default async function MarvelWorldPage() {
  const park = await getPark(MV_PARK_SLUG);
  const [tickets, reviews] = await Promise.all([
    getTickets(MV_PARK_SLUG),
    getReviews(MV_PARK_SLUG),
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
    <main className="mv-page min-h-screen overflow-x-hidden">
      {/* Bento gallery */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <p className="mv-eyebrow mv-eyebrow--center mb-8">
          <span aria-hidden>★</span>
          Вселенная Marvel · Диснейленд
          <span aria-hidden>★</span>
        </p>

        <div className="mv-bento-grid">
          <div className="mv-bento-card mv-bento-card--main group">
            <Image
              src={mvGallery[0].src}
              alt={mvGallery[0].alt}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 60vw"
              priority
            />
            <div
              className="absolute inset-0 z-[1]"
              style={{
                background: `linear-gradient(to top,
                  rgba(10,14,26,0.95) 0%,
                  rgba(226,54,54,0.2) 45%,
                  transparent 72%)`,
              }}
            />
            <div className="absolute bottom-6 left-6 right-6 z-10">
              <p className="mv-eyebrow mb-2">{mvGallery[0].badge}</p>
              <h2 className="mv-display text-2xl md:text-4xl font-bold mb-2">{mvGallery[0].title}</h2>
              <p className="text-sm max-w-lg leading-relaxed" style={{ color: 'rgba(240,244,248,0.75)' }}>
                {mvGallery[0].subtitle}
              </p>
            </div>
          </div>

          {[mvGallery[1], mvGallery[2]].map((item) => (
            <div key={item.label} className="mv-bento-card mv-bento-card--side group min-h-[200px]">
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
                  background: 'linear-gradient(to top, rgba(10,14,26,0.8) 0%, transparent 55%)',
                }}
              />
              <div className="absolute bottom-4 left-4 z-10">
                <span className="text-sm font-semibold tracking-wide">{item.label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hero */}
      <section className="mv-hero">
        <div className="absolute right-0 top-0 h-full w-full md:w-[68%] z-0">
          <Image
            src={mvHeroCharacter}
            alt="Команда героев — Avengers Campus"
            fill
            className="object-cover object-[center_20%] md:object-left opacity-95"
            sizes="70vw"
            priority
          />
        </div>
        <div className="mv-hero-glow" />
        <MvParticles count={20} />

        <div className="relative max-w-7xl mx-auto px-6 z-10">
          <p className="mv-eyebrow mb-6">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 2l2.4 7.2H22l-6 4.6 2.3 7.2L12 16.4l-6.3 4.6 2.3-7.2-6-4.6h7.6L12 2z" />
            </svg>
            Вселенная Marvel · Avengers Campus
          </p>

          <h1 className="mv-display text-5xl md:text-7xl lg:text-8xl font-black mb-6 max-w-3xl">
            Стань частью
            <br />
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: `linear-gradient(135deg, ${C.redLight}, ${C.red} 50%, ${C.blue})`,
              }}
            >
              команды героев
            </span>
          </h1>

          <p className="text-base md:text-lg max-w-xl mb-6 leading-relaxed" style={{ color: 'rgba(240,244,248,0.72)' }}>
            Летайте с Железным Человеком, тренируйтесь с Мстителями и исследуйте Ваканду — всё в
            одном парке.
          </p>

          <div className="mv-trust-row">
            {TRUST.map((t) => (
              <span key={t} className="mv-trust-pill">
                {t}
              </span>
            ))}
          </div>

          <MvDivider />

          <div className="mv-stats my-8">
            {stats.map((s) => (
              <div key={s.label} className="mv-stat">
                <div className="mv-stat-value">{s.val}</div>
                <div className="mv-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href={mvCheckoutPath()} className="mv-btn-primary px-8 py-3.5 rounded-xl text-base">
              Забронировать
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Link>
            <Link href="#tickets" className="mv-btn-secondary text-base">
              Тарифы
            </Link>
            <Link href="/parks" className="mv-btn-secondary text-base opacity-80">
              Все парки
            </Link>
          </div>
        </div>
      </section>

      {/* Attractions */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-24">
        <div className="mv-section-head flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="mv-eyebrow mb-3">Must-See</p>
            <h2 className="mv-section-title">Легендарные аттракционы</h2>
          </div>
          <p className="text-sm max-w-sm leading-relaxed md:text-right" style={{ color: C.textMuted }}>
            Четыре зоны, которые нельзя пропустить в Avengers Campus.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {mvExperiences.map((t) => (
            <article key={t.id} className="mv-exp-card group">
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
                      'linear-gradient(to top, rgba(10,14,26,0.75) 0%, rgba(4,118,208,0.08) 40%, transparent 55%)',
                  }}
                />
                <div className="absolute bottom-3 left-3">
                  <span className="mv-exp-badge">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    {t.duration}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <p className="mv-zone-tag mb-1.5">{t.zone}</p>
                <h3 className="mv-display text-lg font-bold mb-2">{t.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: C.textMuted }}>
                  {t.subtitle}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Tickets */}
      <section id="tickets" className="py-20 md:py-28 relative overflow-hidden mv-tickets-bg scroll-mt-24">
        <MvParticles count={40} />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="mv-eyebrow justify-center mb-4">Билеты</p>
            <h2 className="mv-display text-4xl md:text-6xl font-black mb-4">Выберите свой путь</h2>
            <p className="text-sm" style={{ color: C.textMuted }}>
              Без скрытых сборов · QR сразу после оплаты
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto items-stretch">
            {tickets.map((t) => {
              const featured = t.name === 'Hero Pass';
              return (
                <div
                  key={t.id}
                  className={`mv-ticket-card ${featured ? 'mv-ticket-card--featured' : ''}`}
                >
                  <div>
                    <div className="min-h-[28px] mb-4">
                      {featured && <span className="mv-badge-popular">ПОПУЛЯРНЫЙ</span>}
                    </div>
                    <h3 className="mv-display text-2xl font-bold mb-3">{t.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span
                        className="mv-display text-5xl font-black"
                        style={{
                          color: featured ? C.red : C.text,
                          textShadow: featured ? '0 0 24px rgba(226,54,54,0.35)' : undefined,
                        }}
                      >
                        {t.price}
                      </span>
                      <span className="text-lg font-medium" style={{ color: C.textMuted }}>
                        €
                      </span>
                    </div>
                  </div>

                  <ul className="mv-feature-list flex flex-col gap-3 flex-1">
                    {t.features.map((f) => (
                      <li key={f}>
                        <span className="mv-feature-star" aria-hidden>
                          ★
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={mvCheckoutPath({ ticket: t.id, guests: 2 })}
                    className={featured ? 'mv-btn-primary py-3.5 rounded-xl mv-display text-sm tracking-wider' : 'mv-btn-ghost'}
                  >
                    {featured ? 'Выбрать Hero Pass' : 'Выбрать'}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {park && (
        <ParkReviews
          parkSlug={MV_PARK_SLUG}
          parkName={park.name}
          initialReviews={reviews}
          theme="mv"
        />
      )}
    </main>
  );
}
