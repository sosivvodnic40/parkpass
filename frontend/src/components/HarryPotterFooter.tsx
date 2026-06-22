import Image from 'next/image';
import Link from 'next/link';
import '@/app/worlds/harry-potter/harry-potter.css';
import { hpColors, hpFooterLinks, hpFooterThumb } from '@/lib/harry-potter-images';

const C = hpColors;

export default function HarryPotterFooter() {
  return (
    <footer style={{ borderTop: `1px solid ${C.gold}15`, background: C.surfaceDeep }}>
      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-12">
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black"
              style={{ background: C.gold, color: C.bg }}
            >
              P
            </span>
            <span className="font-bold text-base" style={{ color: C.text }}>
              Park<span style={{ color: C.gold }}>Pass</span>
            </span>
          </Link>
          <p
            className="text-sm leading-relaxed mt-4 mb-6 max-w-xs"
            style={{ color: 'rgba(240,232,216,0.55)' }}
          >
            Бронирование в Волшебном мире Гарри Поттера — честные цены, мгновенный QR-билет.
          </p>
          <Link
            href="/worlds/harry-potter#tickets"
            className="hp-btn-gold inline-flex px-5 py-2.5 rounded-xl text-sm font-semibold shadow-none"
          >
            Забронировать в Хогсмиде
          </Link>
        </div>

        <div>
          <p
            className="hp-display text-xs font-bold tracking-[0.35em] uppercase mb-5"
            style={{ color: 'rgba(240,232,216,0.35)' }}
          >
            Навигация
          </p>
          <ul className="space-y-3">
            {hpFooterLinks.map((label) => (
              <li key={label}>
                <Link
                  href={
                    label === 'Хогсмид'
                      ? '/worlds/harry-potter'
                      : label === 'Другие парки'
                        ? '/parks'
                        : '/worlds/harry-potter'
                  }
                  className="text-sm transition-colors hover:opacity-80"
                  style={{ color: 'rgba(240,232,216,0.6)' }}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p
            className="hp-display text-xs font-bold tracking-[0.35em] uppercase mb-5"
            style={{ color: 'rgba(240,232,216,0.35)' }}
          >
            Волшебный мир
          </p>
          <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${C.gold}20` }}>
            <div className="relative h-28 w-full">
              <Image src={hpFooterThumb} alt="Хогсмид" fill className="object-cover" sizes="400px" />
            </div>
            <div className="p-3" style={{ background: C.surface }}>
              <p className="hp-display text-sm font-semibold">Хогсмид</p>
              <p className="text-xs" style={{ color: 'rgba(240,232,216,0.45)' }}>
                Universal Studios · Orlando
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between gap-3"
        style={{ borderTop: `1px solid ${C.gold}10` }}
      >
        <p className="text-xs" style={{ color: 'rgba(240,232,216,0.28)' }}>
          © 2026 ParkPass · Дипломный проект
        </p>
        <div className="flex gap-6">
          <Link href="/parks" className="text-xs hover:opacity-60" style={{ color: 'rgba(240,232,216,0.3)' }}>
            Каталог
          </Link>
          <Link href="/favorites" className="text-xs hover:opacity-60" style={{ color: 'rgba(240,232,216,0.3)' }}>
            Избранное
          </Link>
        </div>
      </div>
    </footer>
  );
}
