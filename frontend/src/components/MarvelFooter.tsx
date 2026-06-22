import Image from 'next/image';
import Link from 'next/link';
import '@/app/worlds/marvel/marvel.css';
import { mvColors, mvFooterLinks, mvFooterThumb } from '@/lib/marvel-images';

const C = mvColors;

export default function MarvelFooter() {
  return (
    <footer className="mv-footer">
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-12">
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <span className="mv-logo-mark group-hover:scale-105 transition-transform">P</span>
            <span className="font-bold text-base" style={{ color: C.text }}>
              Park<span style={{ color: C.red }}>Pass</span>
            </span>
          </Link>
          <p className="text-sm leading-relaxed mt-5 mb-6 max-w-xs" style={{ color: C.textMuted }}>
            Бронирование в Avengers Campus — честные цены, мгновенный QR-билет на email.
          </p>
          <Link href="/worlds/marvel/book" className="mv-btn-primary px-6 py-2.5 rounded-xl text-sm">
            Забронировать билет
          </Link>
        </div>

        <div>
          <p className="mv-display text-xs font-bold tracking-[0.35em] uppercase mb-6" style={{ color: 'rgba(240,244,248,0.35)' }}>
            Навигация
          </p>
          <ul className="space-y-3.5">
            {mvFooterLinks.map((label) => (
              <li key={label}>
                <Link
                  href={
                    label === 'Avengers Campus'
                      ? '/worlds/marvel'
                      : label === 'Другие парки'
                        ? '/parks'
                        : '/worlds/marvel#tickets'
                  }
                  className="mv-footer-link"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mv-display text-xs font-bold tracking-[0.35em] uppercase mb-6" style={{ color: 'rgba(240,244,248,0.35)' }}>
            Вселенная Marvel
          </p>
          <div className="mv-footer-card">
            <div className="relative h-32 w-full">
              <Image src={mvFooterThumb} alt="Avengers Campus" fill className="object-cover" sizes="400px" />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(10,14,26,0.7) 0%, transparent 50%)' }}
              />
            </div>
            <div className="p-4" style={{ background: C.surface }}>
              <p className="mv-display text-base font-semibold">Avengers Campus</p>
              <p className="text-xs mt-1" style={{ color: C.textMuted }}>
                Disneyland · California
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs"
        style={{ color: 'rgba(240,244,248,0.28)', borderTop: '1px solid rgba(226,54,54,0.1)' }}
      >
        <span>© 2025 ParkPass · Marvel — демо-проект</span>
        <span className="mv-eyebrow text-[0.6rem] tracking-[0.25em]">Earth&apos;s Mightiest Booking</span>
      </div>
    </footer>
  );
}
