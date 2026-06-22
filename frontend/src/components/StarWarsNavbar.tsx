'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import '@/app/worlds/star-wars/star-wars.css';
import { clearSession, getUser, type User } from '@/lib/auth';

const links = [
  { href: '/parks', label: 'Парки' },
  { href: '/worlds/star-wars', label: 'Star Wars' },
  { href: '/favorites', label: 'Избранное' },
];

function isActive(pathname: string, href: string) {
  if (pathname === href || pathname.startsWith(href + '?')) return true;
  if (href === '/parks' && pathname.startsWith('/parks')) return true;
  if (href === '/worlds/star-wars' && pathname.startsWith('/worlds/star-wars')) return true;
  if (href === '/worlds/star-wars' && pathname.startsWith('/checkout/star-wars')) return true;
  return false;
}

export default function StarWarsNavbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setUser(getUser());
    document.body.classList.add('sw-theme');
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      document.body.classList.remove('sw-theme');
    };
  }, [pathname]);

  const logout = () => {
    clearSession();
    setUser(null);
    window.location.href = '/';
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#050508] border-b border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.45)]'
          : 'bg-transparent border-b border-transparent shadow-none'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 md:px-6 h-[72px] flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <span className="w-9 h-9 rounded-xl bg-[#FFE81F] text-[#050508] flex items-center justify-center font-bold text-sm shadow-[0_0_16px_rgba(255,232,31,0.4)]">
            P
          </span>
          <span className="text-lg md:text-xl font-bold text-white">
            Park<span className="text-[#FFE81F]">Pass</span>
          </span>
        </Link>

        <div className="hidden md:flex gap-0.5 p-1 rounded-xl bg-[#0c0c14] border border-white/10">
          {links.map((l) => {
            const active = isActive(pathname, l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                  active
                    ? 'bg-[#FFE81F] text-[#050508] font-semibold'
                    : 'text-stone-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 pl-2 pr-1.5 py-1 rounded-xl bg-[#0c0c14] border border-white/10">
            {user ? (
              <>
                <Link
                  href="/account"
                  className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-white/5 transition"
                >
                  <span className="w-7 h-7 rounded-full bg-[#FFE81F]/20 text-[#FFE81F] border border-[#FFE81F]/40 flex items-center justify-center text-xs font-bold">
                    {user.firstName[0]}
                  </span>
                  <span className="text-sm font-medium text-stone-200 max-w-[80px] truncate">
                    {user.firstName}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="text-sm text-stone-400 hover:text-white px-2 py-1 transition"
                >
                  Выйти
                </button>
              </>
            ) : (
              <Link
                href="/auth"
                className="text-sm font-medium text-stone-400 hover:text-white px-3 py-1.5 transition"
              >
                Войти
              </Link>
            )}
          </div>

          <Link
            href="/worlds/star-wars#tickets"
            className="inline-flex items-center justify-center text-sm py-2.5 px-4 md:px-5 rounded-xl font-bold text-[#050508] bg-[#FFE81F] border-2 border-[#c9b800] shadow-none hover:bg-[#fff176] hover:border-[#FFE81F] active:translate-y-px transition"
          >
            Забронировать
          </Link>
        </div>
      </nav>
    </header>
  );
}
