import Image from 'next/image';
import Link from 'next/link';
import { getPark, getAttractions, getTickets, getReviews } from '@/lib/api';
import {
  starWarsImages,
  starWarsExperiences,
  attractionImageById,
  SW_PARK_SLUG,
} from '@/lib/star-wars-images';
import StarCosmos from '@/components/StarCosmos';
import ParkReviews from '@/components/ParkReviews';
import {
  SwContainer,
  SwSection,
  SwDivider,
  SwSectionHeader,
} from '@/components/sw/SwLayout';
import { checkoutPath } from '@/lib/checkout-path';

function MediaCard({
  image,
  alt,
  children,
  className = '',
  minHeight = 'min-h-[280px]',
}: {
  image: string;
  alt: string;
  children?: React.ReactNode;
  className?: string;
  minHeight?: string;
}) {
  return (
    <article
      className={`group relative rounded-3xl overflow-hidden border border-white/10 hover:border-[#FFE81F]/35 transition-colors ${minHeight} ${className}`}
    >
      <Image
        src={image}
        alt={alt}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/50 to-[#050508]/10" />
      {children}
    </article>
  );
}

export default async function StarWarsWorldPage() {
  const park = await getPark(SW_PARK_SLUG);
  const [attractions, tickets, reviews] = await Promise.all([
    getAttractions(SW_PARK_SLUG),
    getTickets(SW_PARK_SLUG),
    getReviews(SW_PARK_SLUG),
  ]);

  return (
    <main className="sw-page min-h-screen overflow-x-hidden">
      {/* Hero */}
      <section className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden sw-grain">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={starWarsImages.hero}
            alt="Мандалорец и Грогу"
            fill
            className="object-cover object-[65%_25%] md:object-[60%_20%] sw-hero-bg"
            priority
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/70 to-[#050508]/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050508]/90 via-[#050508]/30 to-transparent" />
        <div className="absolute inset-0 sw-stars opacity-40 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-[#050508] via-[#050508]/80 to-transparent" />

        <SwContainer className="relative z-10 pb-16 md:pb-24 pt-[7.5rem] md:pt-32">
          <div className="sw-glass inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8">
            <span className="w-2 h-2 rounded-full bg-[#FFE81F] shadow-[0_0_8px_#FFE81F]" />
            <span className="text-[#FFE81F] text-xs font-bold tracking-[0.25em] uppercase">
              Galaxy&apos;s Edge · Батуу
            </span>
          </div>

          <h1 className="font-display text-[2.75rem] sm:text-6xl md:text-7xl lg:text-[5.25rem] font-bold max-w-3xl leading-[1.05] sw-title-glow">
            Ваша галактика
            <br />
            <span className="text-[#FFE81F]">начинается здесь</span>
          </h1>

          <p className="text-stone-400 text-base md:text-lg mt-6 max-w-lg leading-relaxed">
            Millennium Falcon, Rise of the Resistance и мастерская световых мечей —
            забронируйте без скрытых сборов.
          </p>

          {park && (
            <div className="flex flex-wrap gap-3 mt-8">
              {[
                { label: 'Рейтинг', value: `★ ${park.ratingAvg}` },
                { label: 'Отзывы', value: park.reviewCount.toLocaleString('ru-RU') },
                { label: 'От', value: `${park.priceFrom} €` },
                { label: 'Зоны', value: `${park.zones}` },
              ].map((s) => (
                <div key={s.label} className="sw-glass px-4 py-2.5 rounded-xl">
                  <p className="text-[10px] uppercase tracking-wider text-stone-500">{s.label}</p>
                  <p className="text-sm font-bold text-white mt-0.5">{s.value}</p>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-3 mt-10">
            <Link
              href="#tickets"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-[#050508] bg-[#FFE81F] hover:bg-[#fff176] transition-all shadow-none"
            >
              Забронировать
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </Link>
            <Link
              href="/parks"
              className="sw-glass inline-flex items-center px-6 py-4 rounded-xl font-semibold text-stone-300 hover:text-[#FFE81F] transition"
            >
              Все парки
            </Link>
          </div>
        </SwContainer>

        <div className="relative z-10 flex justify-center pb-8 sw-scroll-hint">
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
            <div className="w-1 h-2 rounded-full bg-[#FFE81F]" />
          </div>
        </div>
      </section>

      <StarCosmos>
        <SwDivider />

        {/* Батуу */}
        <SwSection>
          <SwContainer>
            <div className="grid lg:grid-cols-2 gap-5 lg:gap-6 items-stretch">
              <MediaCard
                image={starWarsImages.batuuAerial}
                alt="Black Spire Outpost"
                minHeight="min-h-[320px] lg:min-h-[420px]"
              >
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-10">
                  <p className="text-[#FFE81F] text-xs font-bold uppercase tracking-[0.2em] mb-2">
                    Black Spire Outpost
                  </p>
                  <h2 className="font-display text-2xl md:text-3xl font-bold leading-tight">
                    Планета Батуу
                  </h2>
                  <p className="text-stone-400 text-sm mt-2 max-w-sm leading-relaxed">
                    Каменные шпили, рынки и стоянка Falcon — полное погружение.
                  </p>
                </div>
              </MediaCard>

              <div className="flex flex-col gap-5 lg:gap-6 min-h-[320px] lg:min-h-0">
                <MediaCard
                  image={starWarsImages.heroChewbacca}
                  alt="Чубакка и Millennium Falcon"
                  minHeight="min-h-[200px] lg:min-h-0 lg:flex-1"
                >
                  <p className="absolute bottom-5 left-5 right-5 z-10 text-sm font-semibold text-white">
                    Galaxy&apos;s Edge · WDW & Anaheim
                  </p>
                </MediaCard>
                <MediaCard
                  image={starWarsImages.falconDock}
                  alt="Falcon"
                  minHeight="min-h-[160px] lg:h-44 lg:min-h-0 shrink-0"
                />
              </div>
            </div>
          </SwContainer>
        </SwSection>

        <SwDivider />

        {/* Аттракционы */}
        <SwSection>
          <SwContainer>
            <SwSectionHeader
              label="Must-see"
              title="Легенды галактики"
              subtitle="Четыре зоны, которые нельзя пропустить на Батуус"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {starWarsExperiences.map((ex, i) => (
                <MediaCard
                  key={ex.title}
                  image={ex.image}
                  alt={ex.title}
                  minHeight={i === 0 ? 'min-h-[340px] sm:col-span-2' : 'min-h-[260px]'}
                >
                  <span className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-lg bg-[#0c0c14]/80 border border-white/10 text-[#FFE81F] text-xs font-bold">
                    {ex.wait}
                  </span>
                  <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 z-10">
                    <h3 className="text-xl md:text-2xl font-bold leading-tight">{ex.title}</h3>
                    <p className="text-stone-400 text-sm mt-2 leading-relaxed line-clamp-2">
                      {ex.desc}
                    </p>
                  </div>
                </MediaCard>
              ))}
            </div>
          </SwContainer>
        </SwSection>

        <SwDivider />

        {/* Карусель */}
        <SwSection className="!py-10 md:!py-14">
          <SwContainer>
            <SwSectionHeader title="Зоны Батуус" subtitle="Актуальное время ожидания" />
            <div className="sw-carousel flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory -mx-1 px-1">
              {attractions.map((a) => (
                <article
                  key={a.id}
                  className="snap-start shrink-0 w-[min(100%,280px)] sm:w-[300px] rounded-2xl overflow-hidden border border-white/10 bg-[#0c0c14]/90"
                >
                  <div className="relative h-44 w-full">
                    <Image
                      src={attractionImageById[a.id] ?? a.imageUrl}
                      alt={a.name}
                      fill
                      className="object-cover"
                      sizes="300px"
                    />
                    <span className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-md text-xs font-bold text-[#FFE81F] bg-[#0c0c14]/90 border border-white/10">
                      ~{a.avgWaitMin} мин
                    </span>
                  </div>
                  <div className="p-4 text-left">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFE81F]/90">
                      {a.category}
                    </span>
                    <h3 className="font-semibold mt-1.5 leading-snug text-white">{a.name}</h3>
                  </div>
                </article>
              ))}
            </div>
          </SwContainer>
        </SwSection>

        <SwDivider />

        {/* Билеты */}
        <SwSection id="tickets">
          <SwContainer>
            <SwSectionHeader
              label="Билеты"
              title="Выберите свой путь"
              subtitle="Без скрытых сборов · QR сразу после оплаты"
              center
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tickets.map((t, i) => (
                <div
                  key={t.id}
                  className={`flex flex-col rounded-3xl p-6 md:p-8 ${
                    i === 1
                      ? 'border border-[#FFE81F]/35 bg-[#0c0c14]/90'
                      : 'border border-white/10 bg-[#0c0c14]/80'
                  }`}
                >
                  <div className="h-7 mb-3 flex items-center">
                    {i === 1 && (
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#FFE81F] px-2 py-1 rounded bg-[#FFE81F]/15">
                        Рекомендуем
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-white leading-tight">{t.name}</h3>

                  <p className="mt-5 flex items-baseline gap-1.5">
                    <span className="text-4xl md:text-[2.75rem] font-bold text-[#FFE81F] tabular-nums leading-none">
                      {t.price}
                    </span>
                    <span className="text-stone-500 text-base">€</span>
                  </p>

                  <ul className="mt-6 space-y-3 flex-1 list-none p-0 m-0">
                    {t.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-stone-400 leading-snug">
                        <span className="text-[#FFE81F] shrink-0 leading-none mt-0.5">✦</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={checkoutPath(SW_PARK_SLUG, { ticket: t.id })}
                    className={`mt-8 block w-full text-center py-3.5 rounded-xl font-bold transition shadow-none ${
                      i === 1
                        ? 'bg-[#FFE81F] text-[#050508] hover:bg-[#fff176]'
                        : 'border border-white/25 text-white hover:border-[#FFE81F]/40 hover:text-[#FFE81F] bg-transparent'
                    }`}
                  >
                    Выбрать
                  </Link>
                </div>
              ))}
            </div>
          </SwContainer>
        </SwSection>
      </StarCosmos>

      {park && (
        <ParkReviews
          parkSlug={SW_PARK_SLUG}
          parkName={park.name}
          initialReviews={reviews}
          theme="sw"
        />
      )}

      <div className="relative h-8 pointer-events-none bg-[#050508]" aria-hidden />
    </main>
  );
}
