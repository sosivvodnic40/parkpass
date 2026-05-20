import Image from 'next/image';
import Link from 'next/link';
import ParkCard from '@/components/ParkCard';
import { getParks } from '@/lib/api';
import { images } from '@/lib/images';

export default async function DisneyHubPage() {
  const parks = await getParks({ category: 'disney' });

  return (
    <main>
      <section className="relative h-[420px] md:h-[480px] overflow-hidden">
        <Image
          src={images.disney.hub}
          alt="Disney Parks"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1e1b4b]/90 via-[#312e81]/70 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-6xl mx-auto px-6 w-full">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur text-white text-sm font-semibold mb-4">
              ✨ Disney · Disneyland
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-white max-w-2xl">
              Волшебство Disney по всему миру
            </h1>
            <p className="text-white/80 text-lg mt-4 max-w-xl">
              Париж, Калифорния, Орландо, Токио, Гонконг — сравните цены и забронируйте магию.
            </p>
            <Link
              href="/worlds/star-wars"
              className="inline-flex mt-8 items-center gap-2 px-6 py-3 rounded-xl bg-[#FFE81F] text-[#1a1a2e] font-bold hover:bg-[#fff176] transition"
            >
              ★ Перейти в Star Wars: Galaxy&apos;s Edge →
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="section-label">Disney Parks</p>
          <h2 className="section-title mt-2 mb-10">
            {parks.length} парков Disney
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {parks.map((p) => (
              <ParkCard key={p.id} park={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-gradient-to-br from-[#0a0a12] to-[#1e1b4b] text-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="relative w-full md:w-1/2 h-64 rounded-2xl overflow-hidden">
            <Image
              src={images.starWars.outpost}
              alt="Star Wars"
              fill
              className="object-cover"
              sizes="600px"
            />
          </div>
          <div className="flex-1">
            <p className="text-[#FFE81F] font-bold tracking-widest uppercase text-sm">Отдельный мир</p>
            <h2 className="font-display text-3xl font-bold mt-2">Star Wars: Galaxy&apos;s Edge</h2>
            <p className="text-stone-400 mt-4 leading-relaxed">
              Планета Батуус ждёт. Millennium Falcon, Rise of the Resistance и световые мечи —
              на отдельной странице с космическим оформлением.
            </p>
            <Link
              href="/worlds/star-wars"
              className="inline-block mt-6 px-8 py-3 rounded-xl border-2 border-[#FFE81F] text-[#FFE81F] font-bold hover:bg-[#FFE81F] hover:text-[#0a0a12] transition"
            >
              Исследовать Батуу
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
