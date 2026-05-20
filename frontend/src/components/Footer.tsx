import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-brand-navy text-white mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <p className="text-xl font-bold mb-2">
            Park<span className="text-brand-accent">Pass</span>
          </p>
          <p className="text-stone-400 text-sm max-w-sm">
            Агрегатор бронирования тематических парков. Дипломный проект — Дархан, Шамиль.
          </p>
        </div>
        <div>
          <p className="font-semibold mb-3 text-sm">Парки</p>
          <ul className="space-y-2 text-sm text-stone-400">
            <li><Link href="/parks/magic-kingdom" className="hover:text-white">Magic Kingdom</Link></li>
            <li><Link href="/parks/universal-epic-universe" className="hover:text-white">Universal Epic</Link></li>
            <li><Link href="/parks/ferrari-world-abu-dhabi" className="hover:text-white">Ferrari World</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold mb-3 text-sm">Сервис</p>
          <ul className="space-y-2 text-sm text-stone-400">
            <li><Link href="/parks" className="hover:text-white">Каталог</Link></li>
            <li><Link href="/account" className="hover:text-white">Личный кабинет</Link></li>
            <li><Link href="/admin" className="hover:text-white">Админ</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-stone-500 text-xs">
        © 2026 ParkPass · <a href="https://github.com/sosivvodnic40/parkpass" className="hover:text-white">GitHub</a>
      </div>
    </footer>
  );
}
