'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import '@/app/worlds/harry-potter/harry-potter.css';
import { hpCheckoutPath } from '@/lib/checkout-path';
import { hpColors } from '@/lib/harry-potter-images';
import { clearSession, getUser, type User } from '@/lib/auth';

const C = hpColors;

const links = [
  { href: '/parks', label: 'Парки' },
  { href: '/worlds/harry-potter', label: 'Гарри Поттер' },
  { href: '/favorites', label: 'Избранное' },
];

function isActive(pathname: string, href: string) {
  if (pathname === href || pathname.startsWith(href + '?')) return true;
  if (href === '/parks' && pathname.startsWith('/parks')) return true;
  if (href === '/worlds/harry-potter' && pathname.startsWith('/worlds/harry-potter')) return true;
  if (href === '/worlds/harry-potter' && pathname.startsWith('/checkout/harry-potter')) return true;
  return false;
}

export default function HarryPotterNavbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getUser());
    document.body.classList.add('hp-theme');
    return () => document.body.classList.remove('hp-theme');
  }, [pathname]);

  const logout = () => {
    clearSession();
    setUser(null);
    window.location.href = '/';
  };

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-md"
      style={{
        background: `${C.bg}f0`,
        borderBottom: `1px solid ${C.gold}18`,
      }}
    >
      <nav className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <span
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black"
            style={{ background: C.gold, color: C.bg }}
          >
            P
          </span>
          <span className="font-bold text-base tracking-tight" style={{ color: C.text }}>
            Park<span style={{ color: C.gold }}>Pass</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const active = isActive(pathname, l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
                style={{
                  background: active
                    ? `linear-gradient(135deg, ${C.goldLight}, ${C.gold})`
                    : 'transparent',
                  color: active ? '#1a0e00' : 'rgba(240,232,216,0.5)',
                  fontFamily: active ? "'Cinzel', Georgia, serif" : undefined,
                  letterSpacing: active ? '0.04em' : undefined,
                }}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-2">
            {user ? (
              <>
                <Link href="/account" className="flex items-center gap-2">
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: '#2a1f4a',
                      color: C.gold,
                      border: `1px solid ${C.gold}40`,
                    }}
                  >
                    {user.firstName[0]}
                  </span>
                  <span className="text-sm" style={{ color: 'rgba(240,232,216,0.5)' }}>
                    {user.firstName}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="text-sm transition-colors hover:opacity-80"
                  style={{ color: 'rgba(240,232,216,0.31)' }}
                >
                  Выйти
                </button>
              </>
            ) : (
              <Link
                href="/auth"
                className="text-sm transition-colors hover:opacity-80"
                style={{ color: 'rgba(240,232,216,0.5)' }}
              >
                Войти
              </Link>
            )}
          </div>
          <Link
            href={pathname.startsWith('/checkout/harry-potter') ? hpCheckoutPath() : '/worlds/harry-potter#tickets'}
            className="hp-btn-gold px-5 py-2.5 rounded-xl text-sm font-semibold shadow-none"
          >
            {pathname.startsWith('/checkout/harry-potter') ? 'Новое бронирование' : 'Забронировать'}
          </Link>
        </div>
      </nav>
    </header>
  );
}
