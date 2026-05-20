import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import ParkCard from '@/components/ParkCard';
import { getParks, getCategories } from '@/lib/api';

const trust = [
  { title: 'Прозрачная цена', desc: 'Без скрытых сборов' },
  { title: 'Мгновенное подтверждение', desc: 'Билеты на email сразу' },
  { title: 'Кэшбэк до 12%', desc: 'На следующий визит' },
];

const steps = [
  { n: '01', title: 'Выберите парк', desc: 'Сравните цены, отзывы и тематические зоны.' },
  { n: '02', title: 'Забронируйте', desc: 'Оплатите онлайн — билеты придут мгновенно.' },
  { n: '03', title: 'Наслаждайтесь', desc: 'Предъявите QR-код на входе и начните приключение.' },
];

export default async function HomePage() {
  const parks = await getParks();
  const categories = await getCategories().catch(() => []);
  const featured = parks.filter((p) => p.isFeatured);
  const main = featured[0];
  const others = featured.slice(1);

  return (
    <main>
      {/* Hero — как figma.site */}
      <section className="relative min-h-[560px] md:min-h-[600px] flex items-end pb-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1597466590660-f9a0a6e1c6e8?w=1920&q=80)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/50 to-brand-navy/30" />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 md:px-6 pt-28 pb-32">
          <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold text-white leading-tight max-w-2xl">
            Парк мечты — один клик
          </h1>
          <p className="text-stone-200 text-lg md:text-xl mt-4 max-w-xl">
            Сравните билеты и забронируйте без скрытых сборов
          </p>
          <div className="mt-10 max-w-4xl -mb-16 relative z-20">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="bg-brand-bg pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-6">
          {trust.map((t) => (
            <div key={t.title} className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent font-bold shrink-0">
                ✓
              </div>
              <div>
                <p className="font-semibold text-brand-navy">{t.title}</p>
                <p className="text-sm text-brand-muted">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured — асимметричная сетка */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-brand-accent font-semibold text-sm mb-1">Популярные направления</p>
          <h2 className="text-3xl font-bold text-brand-navy mb-8">Лучшие парки недели</h2>

          {parks.length === 0 ? (
            <p className="text-brand-muted">Запустите backend: cd backend && npm run dev</p>
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
      <section className="py-16 bg-brand-bg">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-brand-muted text-sm font-medium mb-1">Тип парка</p>
          <h2 className="text-3xl font-bold text-brand-navy mb-8">Найдите свой формат</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/parks?category=${c.id}`}
                className="card group hover:shadow-card-hover transition-shadow"
              >
                <div className="h-28 overflow-hidden">
                  <img
                    src={c.image}
                    alt={c.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <p className="font-semibold text-sm text-brand-navy">{c.name}</p>
                  <p className="text-xs text-brand-muted mt-1">{c.count} парков →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-brand-muted text-sm font-medium mb-1">Просто и быстро</p>
          <h2 className="text-3xl font-bold text-brand-navy mb-12 text-center">
            Три шага до незабываемого дня
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div key={s.n} className="text-center p-8 rounded-2xl bg-brand-bg border border-brand-border">
                <span className="text-4xl font-bold text-brand-accent/30">{s.n}</span>
                <h3 className="text-xl font-bold text-brand-navy mt-4 mb-2">{s.title}</h3>
                <p className="text-brand-muted text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-brand-navy text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ваш следующий парк ждёт</h2>
          <p className="text-stone-400 mb-8">
            Более 50 парков, честные цены, мгновенные билеты.
          </p>
          <Link href="/parks" className="btn-primary text-lg px-10">
            Смотреть все парки
          </Link>
        </div>
      </section>
    </main>
  );
}
