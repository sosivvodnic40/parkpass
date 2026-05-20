import Image from 'next/image';
import Link from 'next/link';
import { getPark, getAttractions, getTickets } from '@/lib/api';
import { images } from '@/lib/images';

const experiences = [
  {
    title: 'Millennium Falcon',
    desc: 'Станьте пилотом, стрелком или инженером на легендарном корабле.',
    image: images.starWars.falcon,
    wait: '~65 мин',
  },
  {
    title: 'Rise of the Resistance',
    desc: 'Эпическое сражение с Первым орденом — лучший dark ride в мире.',
    image: images.starWars.resistance,
    wait: '~95 мин',
  },
  {
    title: "Oga's Cantina",
    desc: 'Космический бар с экзотическими напитками и живой музыкой.',
    image: images.starWars.cantina,
    wait: '~30 мин',
  },
  {
    title: "Savi's Workshop",
    desc: 'Создайте собственный световой меч у мастеров Джеди.',
    image: images.starWars.lightsaber,
    wait: 'По записи',
  },
];

export default async function StarWarsWorldPage() {
  const park = await getPark('star-wars-galaxys-edge');
  const attractions = await getAttractions('star-wars-galaxys-edge');
  const tickets = await getTickets('star-wars-galaxys-edge');

  return (
    <main className="bg-[#0a0a12] text-white min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-end overflow-hidden">
        <Image
          src={images.starWars.hero}
          alt="Star Wars Galaxy's Edge"
          fill
          className="object-cover opacity-60"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a12] via-[#0a0a12]/60 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,232,31,0.08)_0%,transparent_70%)]" />

        {/* Stars effect */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `radial-gradient(2px 2px at 20px 30px, white, transparent),
              radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
              radial-gradient(1px 1px at 90px 40px, white, transparent),
              radial-gradient(2px 2px at 160px 120px, rgba(255,232,31,0.6), transparent)`,
            backgroundSize: '200px 200px',
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-6 pb-16 pt-32 w-full">
          <p className="text-[#FFE81F] font-bold tracking-[0.3em] uppercase text-sm mb-4">
            Star Wars · Galaxy&apos;s Edge
          </p>
          <h1 className="font-display text-5xl md:text-7xl font-bold max-w-3xl leading-[1.05]">
            Добро пожаловать на{' '}
            <span className="text-[#FFE81F]">Батуу</span>
          </h1>
          <p className="text-stone-300 text-lg md:text-xl mt-6 max-w-2xl leading-relaxed">
            Отдалённая планета на краю галактики. Просыпайтесь в роли смельчака,
            пилотируйте Falcon и присоединяйтесь к Сопротивлению.
          </p>
          <div className="flex flex-wrap gap-4 mt-10">
            <Link
              href="/parks/star-wars-galaxys-edge"
              className="inline-flex items-center px-8 py-4 rounded-xl font-bold text-[#0a0a12] bg-[#FFE81F] hover:bg-[#fff176] transition shadow-[0_0_40px_rgba(255,232,31,0.3)]"
            >
              Забронировать визит
            </Link>
            <Link
              href="/parks?category=disney"
              className="inline-flex items-center px-8 py-4 rounded-xl font-semibold border-2 border-white/30 hover:border-[#FFE81F] hover:text-[#FFE81F] transition"
            >
              Все парки Disney
            </Link>
          </div>
          {park && (
            <p className="mt-8 text-stone-400 text-sm">
              ★ {park.ratingAvg} · {park.reviewCount.toLocaleString('ru-RU')} отзывов · от{' '}
              {park.priceFrom} €
            </p>
          )}
        </div>
      </section>

      {/* Experiences grid */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-[#FFE81F] font-bold tracking-widest uppercase text-sm mb-2">
            Аттракционы
          </h2>
          <p className="font-display text-3xl md:text-4xl font-bold mb-12">
            Легенды галактики
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {experiences.map((ex) => (
              <div
                key={ex.title}
                className="group relative rounded-2xl overflow-hidden border border-white/10 hover:border-[#FFE81F]/40 transition-all duration-300"
              >
                <div className="relative h-56">
                  <Image
                    src={ex.image}
                    alt={ex.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="600px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a12] to-transparent" />
                </div>
                <div className="absolute bottom-0 p-6 w-full">
                  <span className="text-[#FFE81F] text-xs font-bold uppercase tracking-wider">
                    Очередь {ex.wait}
                  </span>
                  <h3 className="text-xl font-bold mt-1">{ex.title}</h3>
                  <p className="text-stone-400 text-sm mt-2">{ex.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All attractions from API */}
      <section className="py-16 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-2xl font-bold mb-8">Все зоны Батуус</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {attractions.map((a) => (
              <article
                key={a.id}
                className="rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:border-[#FFE81F]/30 transition"
              >
                <div className="relative h-36">
                  <Image src={a.imageUrl} alt={a.name} fill className="object-cover" sizes="400px" />
                </div>
                <div className="p-4">
                  <span className="text-[#FFE81F] text-xs font-bold">{a.category}</span>
                  <h3 className="font-semibold mt-1">{a.name}</h3>
                  <p className="text-stone-500 text-sm mt-1">~{a.avgWaitMin} мин</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Tickets */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent to-[#12121f]">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-center mb-12">
            Выберите свой путь
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {tickets.map((t, i) => (
              <div
                key={t.id}
                className={`rounded-2xl p-8 border ${
                  i === 1
                    ? 'border-[#FFE81F] bg-[#FFE81F]/5 shadow-[0_0_30px_rgba(255,232,31,0.15)]'
                    : 'border-white/10 bg-white/5'
                }`}
              >
                {i === 1 && (
                  <span className="text-[#FFE81F] text-xs font-bold uppercase tracking-wider">
                    Рекомендуем
                  </span>
                )}
                <h3 className="text-xl font-bold mt-2">{t.name}</h3>
                <p className="text-4xl font-bold text-[#FFE81F] mt-4 tabular-nums">
                  {t.price} <span className="text-lg text-stone-400">€</span>
                </p>
                <ul className="mt-6 space-y-2 text-sm text-stone-400">
                  {t.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="text-[#FFE81F]">◆</span> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/checkout?park=star-wars-galaxys-edge&ticket=${t.id}`}
                  className={`mt-8 block text-center py-3 rounded-xl font-bold transition ${
                    i === 1
                      ? 'bg-[#FFE81F] text-[#0a0a12] hover:bg-[#fff176]'
                      : 'border border-white/20 hover:border-[#FFE81F]'
                  }`}
                >
                  Выбрать
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="py-16 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-stone-400 mb-6">Galaxy&apos;s Edge доступен в двух курортах Disney</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/parks/disneyland-california"
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition"
            >
              Disneyland California
            </Link>
            <Link
              href="/parks/walt-disney-world"
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition"
            >
              Walt Disney World — Hollywood Studios
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
