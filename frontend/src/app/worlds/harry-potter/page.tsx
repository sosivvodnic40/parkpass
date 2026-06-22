import Image from 'next/image';
import Link from 'next/link';
import { getPark, getTickets, getReviews } from '@/lib/api';
import { checkoutPath, hpCheckoutPath } from '@/lib/checkout-path';
import {
  hpColors,
  hpGallery,
  hpHeroDragon,
  hpExperiences,
  HP_PARK_SLUG,
} from '@/lib/harry-potter-images';
import HpSparkles from '@/components/hp/HpSparkles';
import HpSparkleDivider from '@/components/hp/HpSparkleDivider';
import ParkReviews from '@/components/ParkReviews';

const C = hpColors;

export default async function HarryPotterWorldPage() {
  const park = await getPark(HP_PARK_SLUG);
  const [tickets, reviews] = await Promise.all([
    getTickets(HP_PARK_SLUG),
    getReviews(HP_PARK_SLUG),
  ]);

  const stats = park
    ? [
        { val: String(park.ratingAvg), label: 'рейтинг' },
        { val: park.reviewCount.toLocaleString('ru-RU'), label: 'отзывов' },
        { val: `от ${park.priceFrom} €`, label: 'цена' },
        { val: String(park.zones), label: 'зоны' },
      ]
    : [];

  return (
    <main className="hp-page min-h-screen overflow-x-hidden">
      {/* Bento gallery — как в Figma */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <p
          className="hp-display text-center text-xs tracking-[0.4em] uppercase mb-6"
          style={{ color: C.gold }}
        >
          ✦ Волшебный мир · Universal Orlando ✦
        </p>

        <div className="grid grid-cols-1 md:grid-cols-5 md:grid-rows-2 gap-3 auto-rows-[minmax(200px,1fr)] md:h-[520px]">
          <div
            className="col-span-1 md:col-span-3 md:row-span-2 relative rounded-2xl overflow-hidden group min-h-[280px] md:min-h-0"
            style={{ border: `1px solid ${C.gold}20` }}
          >
            <Image
              src={hpGallery[0].src}
              alt={hpGallery[0].alt}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 60vw"
              priority
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to top,
                  rgba(11,13,20,0.95) 0%,
                  rgba(42,20,70,0.4) 40%,
                  rgba(11,13,20,0.1) 70%)`,
              }}
            />
            <div className="absolute bottom-6 left-6 right-6 z-10">
              <p
                className="hp-display text-xs tracking-[0.35em] uppercase mb-2"
                style={{ color: C.gold }}
              >
                {hpGallery[0].badge}
              </p>
              <h2 className="hp-display text-2xl md:text-3xl font-bold mb-2" style={{ color: C.text }}>
                {hpGallery[0].title}
              </h2>
              <p className="text-sm" style={{ color: 'rgba(240,232,216,0.7)' }}>
                {hpGallery[0].subtitle}
              </p>
            </div>
          </div>

          {[hpGallery[1], hpGallery[2]].map((item) => (
            <div
              key={item.label}
              className="col-span-1 md:col-span-2 relative rounded-2xl overflow-hidden group min-h-[200px] md:min-h-0"
              style={{ border: `1px solid ${C.gold}20` }}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="40vw"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to top, rgba(11,13,20,0.75) 0%, transparent 60%)',
                }}
              />
              <div className="absolute bottom-4 left-4 z-10">
                <span className="text-sm font-medium" style={{ color: C.text }}>
                  {item.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hero с драконом справа */}
      <section className="relative overflow-hidden py-24 md:py-32 min-h-[600px]">
        <div className="absolute right-0 top-0 h-full w-[65%]">
          <Image
            src={hpHeroDragon}
            alt="Дракон Гринготтса"
            fill
            className="object-cover object-left opacity-85"
            sizes="65vw"
            priority
          />
        </div>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(to right,
              ${C.bg} 0%,
              ${C.bg} 28%,
              rgba(11,13,20,0.88) 42%,
              rgba(11,13,20,0.44) 55%,
              transparent 75%)`,
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `linear-gradient(to top, ${C.bg} 0%, transparent 18%)` }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 75% 50%, rgba(180,80,10,0.2) 0%, transparent 55%)',
          }}
        />
        <HpSparkles count={18} />

        <div className="relative max-w-7xl mx-auto px-6 z-10">
          <div className="flex items-center gap-2 mb-6">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2" aria-hidden>
              <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
            </svg>
            <p className="hp-display text-xs tracking-[0.35em] uppercase" style={{ color: C.gold }}>
              Волшебный мир · Хогсмид
            </p>
          </div>

          <h1 className="hp-display text-5xl md:text-7xl font-black leading-[1.05] mb-6 max-w-3xl">
            Ваше волшебство
            <br />
            <span style={{ color: C.gold }}>начинается здесь</span>
          </h1>

          <p
            className="text-base md:text-lg max-w-xl mb-10 leading-relaxed"
            style={{ color: 'rgba(240,232,216,0.7)' }}
          >
            Хогвартс Экспресс, Полёт над замком и мастерская волшебных палочек — забронируйте без
            скрытых сборов.
          </p>

          <HpSparkleDivider />

          <div className="flex flex-wrap gap-10 my-8">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="hp-display text-2xl font-bold" style={{ color: C.gold }}>
                  {s.val}
                </div>
                <div
                  className="text-xs tracking-widest uppercase mt-0.5"
                  style={{ color: 'rgba(240,232,216,0.45)' }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href={hpCheckoutPath()}
              className="hp-btn-gold inline-flex items-center gap-2 px-8 py-3 rounded-xl text-base font-semibold shadow-none"
            >
              Забронировать
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Link>
            <Link
              href="#tickets"
              className="inline-flex items-center px-6 py-3 rounded-xl text-base font-medium transition-opacity hover:opacity-80"
              style={{ border: `1px solid ${C.gold}35`, color: C.text }}
            >
              Тарифы
            </Link>
            <Link
              href="/parks"
              className="px-4 py-3 text-base font-medium transition-opacity hover:opacity-70"
              style={{ color: 'rgba(240,232,216,0.7)' }}
            >
              Все парки
            </Link>
          </div>
        </div>
      </section>

      {/* Must-See — 4 колонки */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <p
          className="hp-display text-xs font-bold tracking-[0.4em] uppercase mb-3"
          style={{ color: C.gold }}
        >
          Must-See
        </p>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <h2 className="hp-display text-3xl md:text-4xl font-black">Легенды волшебного мира</h2>
          <p className="text-sm max-w-xs leading-relaxed" style={{ color: 'rgba(240,232,216,0.55)' }}>
            Четыре зоны, которые нельзя пропустить в Хогсмиде.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {hpExperiences.map((t) => (
            <article
              key={t.id}
              className="rounded-2xl overflow-hidden group transition-all hover:-translate-y-0.5"
              style={{
                background: C.surface,
                border: `1px solid ${C.gold}18`,
                boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
              }}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={t.img}
                  alt={t.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="280px"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(to top, rgba(11,13,20,0.6) 0%, transparent 50%)',
                  }}
                />
                <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full px-2.5 py-1 backdrop-blur-sm"
                  style={{ background: 'rgba(11,13,20,0.75)', border: `1px solid ${C.gold}30` }}
                >
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2" aria-hidden>
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span className="text-xs font-medium" style={{ color: C.text }}>
                    {t.duration}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <p
                  className="hp-display text-[10px] tracking-widest uppercase mb-1"
                  style={{ color: C.gold }}
                >
                  {t.zone}
                </p>
                <h3 className="hp-display font-bold mb-1">{t.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(240,232,216,0.55)' }}>
                  {t.subtitle}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Билеты */}
      <section id="tickets" className="py-20 relative overflow-hidden hp-tickets-bg scroll-mt-24">
        <HpSparkles count={35} />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p
              className="hp-display text-xs font-bold tracking-[0.45em] uppercase mb-3"
              style={{ color: C.gold }}
            >
              Билеты
            </p>
            <h2 className="hp-display text-4xl md:text-5xl font-black mb-3">Выберите свой путь</h2>
            <p className="text-sm" style={{ color: 'rgba(240,232,216,0.5)' }}>
              Без скрытых сборов · QR сразу после оплаты
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {tickets.map((t, i) => {
              const highlight = i === 1;
              return (
                <div
                  key={t.id}
                  className="rounded-2xl p-7 flex flex-col gap-6 transition-transform hover:-translate-y-0.5"
                  style={{
                    background: highlight
                      ? `linear-gradient(160deg, ${C.highlightFrom} 0%, ${C.highlightTo} 100%)`
                      : C.surface,
                    border: highlight ? `1px solid ${C.gold}50` : `1px solid ${C.gold}15`,
                    boxShadow: highlight ? '0 0 40px rgba(201,146,42,0.12)' : 'none',
                  }}
                >
                  <div>
                    <div className="min-h-[26px] mb-3">
                      {highlight && (
                        <span
                          className="hp-display inline-block text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded"
                          style={{
                            background: `linear-gradient(135deg, ${C.goldLight}, ${C.gold})`,
                            color: '#1a0e00',
                          }}
                        >
                          РЕКОМЕНДУЕМ
                        </span>
                      )}
                    </div>
                    <h3 className="hp-display text-xl font-bold mb-2">{t.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="hp-display text-5xl font-black" style={{ color: C.gold }}>
                        {t.price}
                      </span>
                      <span className="text-lg" style={{ color: 'rgba(240,232,216,0.45)' }}>
                        €
                      </span>
                    </div>
                  </div>

                  <ul className="flex flex-col gap-2.5 flex-1">
                    {t.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-2.5 text-sm"
                        style={{ color: 'rgba(240,232,216,0.75)' }}
                      >
                        <span className="text-xs" style={{ color: C.gold }}>
                          ✦
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={checkoutPath(HP_PARK_SLUG, { ticket: t.id, guests: 2 })}
                    className={`block w-full py-3 rounded-xl font-semibold text-sm text-center transition-all shadow-none ${
                      highlight ? 'hp-btn-gold hp-display' : ''
                    }`}
                    style={
                      highlight
                        ? undefined
                        : {
                            border: `1px solid ${C.gold}30`,
                            color: C.text,
                            background: 'transparent',
                          }
                    }
                  >
                    Выбрать
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {park && (
        <ParkReviews
          parkSlug={HP_PARK_SLUG}
          parkName={park.name}
          initialReviews={reviews}
          theme="hp"
        />
      )}
    </main>
  );
}
