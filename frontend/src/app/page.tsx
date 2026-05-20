import Image from 'next/image';
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import ParkCard from '@/components/ParkCard';
import { getParks, getCategories } from '@/lib/api';
import { images } from '@/lib/images';

const trust = [
  {
    icon: '💎',
    title: 'Прозрачная цена',
    desc: 'Итоговая сумма сразу — без скрытых сборов',
  },
  {
    icon: '⚡',
    title: 'Мгновенное подтверждение',
    desc: 'QR-билет на email за секунды',
  },
  {
    icon: '🎁',
    title: 'Кэшбэк до 12%',
    desc: 'Баллы клуба ParkPass на следующий визит',
  },
];

const steps = [
  { n: '01', title: 'Выберите парк', desc: 'Сравните цены, отзывы и зоны' },
  { n: '02', title: 'Забронируйте', desc: 'Оплата онлайн — билет мгновенно' },
  { n: '03', title: 'Наслаждайтесь', desc: 'QR-код на входе — и вперёд!' },
];

export default async function HomePage() {
  const parks = await getParks();
  const categories = await getCategories().catch(() => []);
  const featured = parks.filter((p) => p.isFeatured);
  const main = featured[0];
  const others = featured.slice(1);

  return (
    <main>
      {/* Hero — split layout с коллажем */}
      <section className="relative overflow-hidden bg-hero-mesh">
        <div className="max-w-6xl mx-auto px-4 md:px-6 pt-8 pb-4 md:pt-12">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center min-h-[520px]">
            <div className="relative z-10 py-8">
              <span className="inline-block px-4 py-1.5 rounded-full bg-brand-accent/10 text-brand-accent text-sm font-semibold mb-6">
                Агрегатор №1 для парков мира
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-brand-navy leading-[1.1] tracking-tight">
                Парк мечты —{' '}
                <span className="text-brand-accent italic">один клик</span>
              </h1>
              <p className="text-brand-muted text-lg mt-5 max-w-md leading-relaxed">
                Сравните билеты в Magic Kingdom, Universal, Ferrari World и десятки других парков.
              </p>
              <div className="mt-8">
                <SearchBar />
              </div>
            </div>

            <div className="relative h-[400px] lg:h-[480px] hidden md:block">
              <div className="absolute top-0 right-0 w-[72%] h-[85%] rounded-3xl overflow-hidden shadow-float">
                <Image
                  src={images.hero.main}
                  alt="Тематический парк"
                  fill
                  className="object-cover"
                  priority
                  sizes="50vw"
                />
              </div>
              <div className="absolute bottom-8 left-0 w-[48%] h-[42%] rounded-2xl overflow-hidden shadow-card border-4 border-white">
                <Image src={images.hero.side1} alt="Аттракцион" fill className="object-cover" sizes="25vw" />
              </div>
              <div className="absolute top-16 left-[8%] w-[40%] h-[38%] rounded-2xl overflow-hidden shadow-card border-4 border-white">
                <Image src={images.hero.side2} alt="Замок" fill className="object-cover" sizes="20vw" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="border-y border-brand-border bg-white">
        <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">
          {trust.map((t) => (
            <div
              key={t.title}
              className="flex gap-4 p-4 rounded-2xl hover:bg-brand-bg transition-colors"
            >
              <span className="text-3xl">{t.icon}</span>
              <div>
                <p className="font-bold text-brand-navy">{t.title}</p>
                <p className="text-sm text-brand-muted mt-1">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Disney hub */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <p className="section-label">✨ Disney</p>
              <h2 className="section-title mt-2">Парки Disneyland по всему миру</h2>
            </div>
            <Link href="/parks/disney" className="btn-outline shrink-0">
              Все парки Disney →
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { name: 'Disneyland Paris', img: images.disney.paris, href: '/parks/disneyland-paris', price: 99 },
              { name: 'Disneyland California', img: images.disney.california, href: '/parks/disneyland-california', price: 124 },
              { name: 'Walt Disney World', img: images.disney.orlando, href: '/parks/walt-disney-world', price: 129 },
            ].map((d) => (
              <Link
                key={d.href}
                href={d.href}
                className="group relative h-56 rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition"
              >
                <Image src={d.img} alt={d.name} fill className="object-cover group-hover:scale-105 transition duration-500" sizes="400px" />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/90 to-transparent" />
                <div className="absolute bottom-0 p-5 text-white">
                  <p className="font-bold text-lg">{d.name}</p>
                  <p className="text-sm text-white/70 mt-1">от {d.price} € / чел.</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Star Wars promo */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto relative rounded-3xl overflow-hidden min-h-[280px] flex items-center">
          <Image src={images.starWars.hero} alt="Star Wars" fill className="object-cover" sizes="1200px" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a12] via-[#0a0a12]/80 to-transparent" />
          <div className="relative z-10 p-8 md:p-12 max-w-xl text-white">
            <p className="text-[#FFE81F] font-bold tracking-[0.2em] uppercase text-xs mb-3">Отдельный мир</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold">Star Wars: Galaxy&apos;s Edge</h2>
            <p className="text-stone-400 mt-3 text-sm leading-relaxed">
              Батуу, Millennium Falcon, Rise of the Resistance — космическая страница с уникальным дизайном.
            </p>
            <Link
              href="/worlds/star-wars"
              className="inline-block mt-6 px-8 py-3 rounded-xl bg-[#FFE81F] text-[#0a0a12] font-bold hover:bg-[#fff176] transition"
            >
              Войти на Батуу →
            </Link>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <p className="section-label">Популярные направления</p>
          <h2 className="section-title mt-2 mb-10">Лучшие парки недели</h2>

          {parks.length === 0 ? (
            <p className="text-brand-muted p-8 card">Запустите backend: cd backend && npm run dev</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {main && (
                <div className="md:row-span-2">
                  <ParkCard park={main} large />
                </div>
              )}
              <div className="flex flex-col gap-6">
                {others.map((p) => (
                  <ParkCard key={p.id} park={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-brand-navy text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image src={images.cta} alt="" fill className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-brand-navy/90" />
        <div className="relative max-w-6xl mx-auto px-6">
          <p className="text-teal-300 font-semibold text-sm uppercase tracking-wide">Тип парка</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-2 mb-10">
            Найдите свой формат
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/parks?category=${c.id}`}
                className="group relative h-44 rounded-2xl overflow-hidden border border-white/10 hover:border-teal-400/50 transition-all"
              >
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="200px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-0 p-4">
                  <p className="font-bold text-sm">{c.name}</p>
                  <p className="text-teal-200/80 text-xs mt-1">{c.count} парков →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="section-label">Просто и быстро</p>
          <h2 className="section-title mt-2 mb-14">Три шага до незабываемого дня</h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            {steps.map((s) => (
              <div
                key={s.n}
                className="relative p-8 rounded-3xl bg-brand-bg border border-brand-border overflow-hidden group hover:shadow-card-hover transition-shadow"
              >
                <span className="absolute -top-4 -right-2 font-display text-[7rem] font-bold text-brand-accent/10 leading-none select-none">
                  {s.n}
                </span>
                <h3 className="text-xl font-bold text-brand-navy relative">{s.title}</h3>
                <p className="text-brand-muted text-sm mt-3 relative">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 overflow-hidden">
        <Image src={images.cta} alt="" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/95 to-brand-accent/80" />
        <div className="relative max-w-3xl mx-auto px-6 text-center text-white">
          <h2 className="font-display text-3xl md:text-5xl font-bold">Ваш следующий парк ждёт</h2>
          <p className="text-white/80 text-lg mt-4 mb-10">
            Честные цены · мгновенные билеты · кэшбэк клуба
          </p>
          <Link href="/parks" className="btn-coral text-lg px-12 py-4 shadow-float">
            Смотреть все парки
          </Link>
        </div>
      </section>
    </main>
  );
}
