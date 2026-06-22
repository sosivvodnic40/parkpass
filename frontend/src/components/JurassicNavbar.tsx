'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import '@/app/worlds/jurassic/jurassic.css';
import { jpCheckoutPath } from '@/lib/checkout-path';
import { jpColors } from '@/lib/jurassic-images';
import { clearSession, getUser, type User } from '@/lib/auth';

const C = jpColors;

const links = [
  { href: '/parks', label: 'Парки' },
  { href: '/worlds/jurassic', label: 'Jurassic' },
  { href: '/favorites', label: 'Избранное' },
];

function isActive(pathname: string, href: string) {
  if (pathname === href || pathname.startsWith(href + '?')) return true;
  if (href === '/parks' && pathname.startsWith('/parks')) return true;
  if (href === '/worlds/jurassic' && pathname.startsWith('/worlds/jurassic')) return true;
  if (
    href === '/worlds/jurassic' &&
    (pathname.startsWith('/checkout/jurassic-') || pathname.startsWith('/worlds/jurassic/book'))
  )
    return true;
  return false;
}

export default function JurassicNavbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const onBook =
    pathname.startsWith('/worlds/jurassic/book') || pathname.startsWith('/checkout/jurassic-');

  useEffect(() => {
    setUser(getUser());
    document.body.classList.add('jp-theme');
    return () => document.body.classList.remove('jp-theme');
  }, [pathname]);

  const logout = () => {
    clearSession();
    setUser(null);
    window.location.href = '/';
  };

  return (
    <header className="jp-nav sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-6 h-[3.75rem] flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <span className="jp-logo-mark group-hover:scale-105 transition-transform">P</span>
          <span className="font-bold text-base tracking-tight" style={{ color: C.text }}>
            Park<span style={{ color: C.green }}>Pass</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-0.5">
          {links.map((l) => {
            const active = isActive(pathname, l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`jp-nav-link ${active ? 'jp-nav-link--active' : ''}`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              <>
                <Link href="/account" className="flex items-center gap-2">
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: C.surface,
                      color: C.green,
                      border: `1px solid ${C.green}40`,
                    }}
                  >
                    {user.firstName[0]}
                  </span>
                  <span className="text-sm" style={{ color: 'rgba(236,253,245,0.55)' }}>
                    {user.firstName}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="text-sm transition-colors hover:text-green-400"
                  style={{ color: 'rgba(236,253,245,0.35)' }}
                >
                  Выйти
                </button>
              </>
            ) : (
              <Link
                href="/auth"
                className="text-sm font-medium transition-colors hover:text-white"
                style={{ color: 'rgba(236,253,245,0.5)' }}
              >
                Войти
              </Link>
            )}
          </div>
          <Link href={onBook ? jpCheckoutPath() : '/worlds/jurassic/book'} className="jp-btn-primary px-5 py-2.5 rounded-xl text-sm">
            {onBook ? 'Новое бронирование' : 'Забронировать'}
          </Link>
        </div>
      </nav>
    </header>
  );
}
