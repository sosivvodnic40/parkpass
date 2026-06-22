'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { universes } from '@/lib/images';
import StarWarsFooter from '@/components/StarWarsFooter';
import { isHarryPotterRoute, isJurassicRoute, isMarvelRoute, isStarWarsRoute } from '@/lib/theme-routes';
import JurassicFooter from '@/components/JurassicFooter';
import MarvelFooter from '@/components/MarvelFooter';
import HarryPotterFooter from '@/components/HarryPotterFooter';

function DefaultFooter() {
  return (
    <footer className="bg-brand-navy text-white mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center font-bold">
              P
            </span>
            <span className="text-xl font-bold">
              Park<span className="text-teal-300">Pass</span>
            </span>
          </div>
          <p className="text-stone-400 text-sm max-w-sm leading-relaxed">
            Агрегатор тематических кино-вселенных: Star Wars, Harry Potter, Marvel и Jurassic World.
          </p>
        </div>
        <div>
          <p className="font-semibold mb-4 text-teal-200 text-sm">Парки</p>
          <ul className="space-y-2.5 text-sm text-stone-400">
            {universes.map((u) => (
              <li key={u.id}>
                <Link href={u.href} className="hover:text-white transition">
                  {u.emoji} {u.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-semibold mb-4 text-teal-200 text-sm">Сервис</p>
          <ul className="space-y-2.5 text-sm text-stone-400">
            <li>
              <Link href="/parks" className="hover:text-white transition">
                Каталог
              </Link>
            </li>
            <li>
              <Link href="/auth" className="hover:text-white transition">
                Вход
              </Link>
            </li>
            <li>
              <Link href="/account" className="hover:text-white transition">
                Личный кабинет
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-stone-500 text-xs">
        © 2026 ParkPass ·{' '}
        <a href="https://github.com/sosivvodnic40/parkpass" className="text-teal-300 hover:text-white">
          GitHub
        </a>
      </div>
    </footer>
  );
}

export default function Footer() {
  const pathname = usePathname();

  if (isStarWarsRoute(pathname)) {
    return <StarWarsFooter />;
  }

  if (isHarryPotterRoute(pathname)) {
    return <HarryPotterFooter />;
  }

  if (isMarvelRoute(pathname)) {
    return <MarvelFooter />;
  }

  if (isJurassicRoute(pathname)) {
    return <JurassicFooter />;
  }

  return <DefaultFooter />;
}
