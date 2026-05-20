import Link from 'next/link';

export default function Footer() {
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
            Агрегатор бронирования тематических парков по всему миру. Дипломный проект.
          </p>
        </div>
        <div>
          <p className="font-semibold mb-4 text-teal-200 text-sm">Парки</p>
          <ul className="space-y-2.5 text-sm text-stone-400">
            <li><Link href="/parks/disney" className="hover:text-white transition">Все парки Disney</Link></li>
            <li><Link href="/worlds/star-wars" className="hover:text-[#FFE81F] transition">Star Wars: Batuu</Link></li>
            <li><Link href="/parks/disneyland-paris" className="hover:text-white transition">Disneyland Paris</Link></li>
            <li><Link href="/parks/disneyland-california" className="hover:text-white transition">Disneyland California</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold mb-4 text-teal-200 text-sm">Сервис</p>
          <ul className="space-y-2.5 text-sm text-stone-400">
            <li><Link href="/parks" className="hover:text-white transition">Каталог</Link></li>
            <li><Link href="/auth" className="hover:text-white transition">Вход</Link></li>
            <li><Link href="/account" className="hover:text-white transition">Личный кабинет</Link></li>
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
