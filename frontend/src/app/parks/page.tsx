import Link from 'next/link';
import ParkCard from '@/components/ParkCard';
import SearchBar from '@/components/SearchBar';
import { getParks, getCategories } from '@/lib/api';

const categoryLabels: Record<string, string> = {
  magical: 'Волшебные миры',
  thrills: 'Экстрим',
  water: 'Водные приключения',
  family: 'Семейный отдых',
  speed: 'Скорость и гонки',
};

export default async function ParksPage({
  searchParams,
}: {
  searchParams: { category?: string; city?: string };
}) {
  const parks = await getParks({
    category: searchParams.category,
    city: searchParams.city,
  });
  const categories = await getCategories().catch(() => []);
  const activeCategory = searchParams.category;

  return (
    <main className="py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <h1 className="text-3xl md:text-4xl font-bold text-brand-navy mb-2">
          {activeCategory
            ? categoryLabels[activeCategory] ?? 'Каталог парков'
            : 'Все парки'}
        </h1>
        <p className="text-brand-muted mb-8">
          {parks.length} {parks.length === 1 ? 'парк' : parks.length < 5 ? 'парка' : 'парков'} доступно
        </p>

        <div className="mb-10">
          <SearchBar compact />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar filters */}
          <aside className="lg:w-64 shrink-0">
            <div className="card p-5 sticky top-24">
              <p className="font-semibold text-brand-navy mb-4">Тип парка</p>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/parks"
                    className={`block px-3 py-2 rounded-lg text-sm ${
                      !activeCategory
                        ? 'bg-brand-accent/10 text-brand-accent font-medium'
                        : 'text-brand-muted hover:bg-brand-bg'
                    }`}
                  >
                    Все парки
                  </Link>
                </li>
                {categories.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/parks?category=${c.id}`}
                      className={`block px-3 py-2 rounded-lg text-sm ${
                        activeCategory === c.id
                          ? 'bg-brand-accent/10 text-brand-accent font-medium'
                          : 'text-brand-muted hover:bg-brand-bg'
                      }`}
                    >
                      {c.name} ({c.count})
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1 grid sm:grid-cols-2 gap-6">
            {parks.length === 0 ? (
              <p className="text-brand-muted col-span-2">
                Парки не найдены.{' '}
                <Link href="/parks" className="text-brand-accent underline">
                  Сбросить фильтры
                </Link>
              </p>
            ) : (
              parks.map((p) => <ParkCard key={p.id} park={p} />)
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
