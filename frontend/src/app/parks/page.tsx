import Link from 'next/link';
import ParkCard from '@/components/ParkCard';
import SearchBar from '@/components/SearchBar';
import { getParks, getCategories } from '@/lib/api';

const categoryLabels: Record<string, string> = {
  disney: 'Disneyland & Disney',
  'star-wars': 'Star Wars',
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
    <main className="py-10 md:py-14">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="mb-10">
          <p className="section-label">Каталог</p>
          <h1 className="section-title mt-1">
            {activeCategory ? categoryLabels[activeCategory] ?? 'Парки' : 'Все парки'}
          </h1>
          <p className="text-brand-muted mt-2">
            {parks.length} {parks.length === 1 ? 'парк' : parks.length < 5 ? 'парка' : 'парков'} · честные цены
          </p>
        </div>

        <div className="mb-10">
          <SearchBar compact />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-72 shrink-0">
            <div className="card p-5 sticky top-24">
              <p className="font-bold text-brand-navy mb-4">Фильтры</p>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/parks"
                    className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                      !activeCategory
                        ? 'bg-brand-accent text-white'
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
                      className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                        activeCategory === c.id
                          ? 'bg-brand-accent text-white'
                          : 'text-brand-muted hover:bg-brand-bg'
                      }`}
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="flex-1 grid sm:grid-cols-2 gap-6">
            {parks.length === 0 ? (
              <div className="col-span-2 card p-12 text-center">
                <p className="text-brand-muted">Парки не найдены</p>
                <Link href="/parks" className="btn-primary inline-block mt-4">
                  Сбросить фильтры
                </Link>
              </div>
            ) : (
              parks.map((p) => <ParkCard key={p.id} park={p} />)
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
