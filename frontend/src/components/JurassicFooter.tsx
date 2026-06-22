import Image from 'next/image';
import Link from 'next/link';
import '@/app/worlds/jurassic/jurassic.css';
import { jpColors, jpFooterLinks, jpFooterThumb } from '@/lib/jurassic-images';

const C = jpColors;

export default function JurassicFooter() {
  return (
    <footer className="jp-footer">
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-12">
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <span className="jp-logo-mark group-hover:scale-105 transition-transform">P</span>
            <span className="font-bold text-base" style={{ color: C.text }}>
              Park<span style={{ color: C.green }}>Pass</span>
            </span>
          </Link>
          <p className="text-sm leading-relaxed mt-5 mb-6 max-w-xs" style={{ color: C.textMuted }}>
            Бронирование в Jurassic World — честные цены, мгновенный QR-билет на email.
          </p>
          <Link href="/worlds/jurassic/book" className="jp-btn-primary px-6 py-2.5 rounded-xl text-sm">
            Забронировать билет
          </Link>
        </div>

        <div>
          <p className="jp-display text-xs font-bold tracking-[0.35em] uppercase mb-6" style={{ color: 'rgba(236,253,245,0.35)' }}>
            Навигация
          </p>
          <ul className="space-y-3.5">
            {jpFooterLinks.map((label) => (
              <li key={label}>
                <Link
                  href={
                    label === 'Jurassic World'
                      ? '/worlds/jurassic'
                      : label === 'Другие парки'
                        ? '/parks'
                        : '/worlds/jurassic#tickets'
                  }
                  className="jp-footer-link"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="jp-display text-xs font-bold tracking-[0.35em] uppercase mb-6" style={{ color: 'rgba(236,253,245,0.35)' }}>
            Jurassic World
          </p>
          <div className="jp-footer-card">
            <div className="relative h-32 w-full">
              <Image src={jpFooterThumb} alt="Jurassic World" fill className="object-cover" sizes="400px" />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(10,18,12,0.7) 0%, transparent 50%)' }}
              />
            </div>
            <div className="p-4" style={{ background: C.surface }}>
              <p className="jp-display text-base font-semibold">Islands of Adventure</p>
              <p className="text-xs mt-1" style={{ color: C.textMuted }}>
                Universal · Orlando, Florida
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs"
        style={{ color: 'rgba(236,253,245,0.28)', borderTop: '1px solid rgba(34,197,94,0.1)' }}
      >
        <span>© 2025 ParkPass · Jurassic World — демо-проект</span>
        <span className="jp-eyebrow text-[0.6rem] tracking-[0.25em]">Life Finds a Way</span>
      </div>
    </footer>
  );
}
