import Image from 'next/image';
import Link from 'next/link';
import '@/app/worlds/star-wars/star-wars.css';
import { starWarsImages } from '@/lib/star-wars-images';

const links = [
  { href: '/worlds/star-wars', label: "Galaxy's Edge" },
  { href: '/worlds/star-wars', label: 'О вселенной' },
  { href: '/parks?category=star-wars', label: 'Все локации' },
  { href: '/parks', label: 'Каталог парков' },
];

export default function StarWarsFooter() {
  return (
    <footer className="relative mt-0 text-white overflow-hidden bg-[#050508]">
      {/* Переход и звёздное небо */}
      <div className="sw-footer-top-glow absolute top-0 left-0 right-0 z-[1]" aria-hidden />
      <div className="absolute inset-0 sw-footer-nebula pointer-events-none z-[2]" aria-hidden />
      <div className="absolute inset-0 sw-footer-stars opacity-70 pointer-events-none z-[3]" aria-hidden />
      <div className="absolute inset-0 sw-footer-stars-2 opacity-50 pointer-events-none z-[3]" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050508]/40 to-[#050508] pointer-events-none z-[4]" aria-hidden />

      <div className="relative z-10 max-w-6xl mx-auto px-5 md:px-8 pt-16 md:pt-20 pb-6">
        <div className="sw-glow-line mb-12 md:mb-14" />

        <div className="grid md:grid-cols-12 gap-10 md:gap-8 items-start">
          <div className="md:col-span-5">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <span className="w-10 h-10 rounded-xl bg-[#FFE81F] text-[#050508] flex items-center justify-center font-bold text-sm shadow-[0_0_28px_rgba(255,232,31,0.45)]">
                P
              </span>
              <span className="text-xl font-bold">
                Park<span className="text-[#FFE81F] group-hover:text-[#fff176] transition">Pass</span>
              </span>
            </Link>
            <p className="text-stone-400 text-sm mt-4 max-w-sm leading-relaxed">
              Бронирование Star Wars: Galaxy&apos;s Edge — Орландо и Анахайм. Честные цены,
              мгновенный QR-билет.
            </p>
            <Link
              href="/worlds/star-wars#tickets"
              className="inline-flex mt-6 px-6 py-2.5 rounded-xl text-sm font-bold text-[#050508] bg-[#FFE81F] border-2 border-[#c9b800] hover:bg-[#fff176] transition shadow-none"
            >
              Забронировать на Батуу
            </Link>
          </div>

          <div className="md:col-span-3">
            <p className="text-[#FFE81F] text-xs font-bold uppercase tracking-[0.2em] mb-4 drop-shadow-[0_0_12px_rgba(255,232,31,0.3)]">
              Навигация
            </p>
            <ul className="space-y-2.5 text-sm">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-stone-400 hover:text-[#FFE81F] transition"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="text-[#FFE81F] text-xs font-bold uppercase tracking-[0.2em] mb-4 drop-shadow-[0_0_12px_rgba(255,232,31,0.3)]">
              Galaxy&apos;s Edge
            </p>
            <div className="relative h-36 rounded-2xl overflow-hidden border border-[#FFE81F]/20 shadow-[0_0_40px_rgba(255,232,31,0.08)]">
              <Image
                src={starWarsImages.falconDock}
                alt="Millennium Falcon"
                fill
                className="object-cover"
                sizes="400px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/30 to-transparent" />
              <p className="absolute bottom-3 left-3 text-xs text-stone-300">
                Hollywood Studios · Disneyland
              </p>
            </div>
          </div>
        </div>

        <div className="sw-glow-line mt-12 mb-6 opacity-50" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <p>© 2026 ParkPass · Дипломный проект</p>
          <div className="flex gap-4">
            <Link href="/parks" className="hover:text-[#FFE81F] transition">
              Каталог
            </Link>
            <Link href="/auth" className="hover:text-[#FFE81F] transition">
              Вход
            </Link>
            <a
              href="https://github.com/sosivvodnic40/parkpass"
              className="hover:text-[#FFE81F] transition"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
