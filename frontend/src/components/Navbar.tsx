'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { clearSession, getUser, type User } from '@/lib/auth';
import { isHarryPotterRoute, isJurassicRoute, isMarvelRoute, isStarWarsRoute } from '@/lib/theme-routes';
import JurassicNavbar from '@/components/JurassicNavbar';
import MarvelNavbar from '@/components/MarvelNavbar';
import StarWarsNavbar from '@/components/StarWarsNavbar';
import HarryPotterNavbar from '@/components/HarryPotterNavbar';

const links = [
  { href: '/parks', label: 'Парки' },
  { href: '/worlds/star-wars', label: 'Star Wars' },
  { href: '/worlds/harry-potter', label: 'Harry Potter' },
  { href: '/favorites', label: 'Избранное' },
];

function DefaultNavbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setUser(getUser());
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);

  const logout = () => {
    clearSession();
    setUser(null);
    window.location.href = '/';
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-lg shadow-sm border-b border-brand-border'
          : 'bg-brand-bg/80 backdrop-blur-sm border-b border-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 md:px-6 h-[72px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-accent to-brand-navy flex items-center justify-center text-white font-bold text-sm">
            P
          </span>
          <span className="text-xl font-bold text-brand-navy">
            Park<span className="text-brand-accent">Pass</span>
          </span>
        </Link>

        <div className="hidden md:flex gap-1 p-1 bg-brand-bg rounded-xl">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                pathname === l.href ||
                pathname.startsWith(l.href + '?') ||
                (l.href === '/parks' && pathname.startsWith('/parks')) ||
                (l.href === '/worlds/star-wars' && pathname.startsWith('/worlds/star-wars')) ||
                (l.href === '/worlds/harry-potter' && pathname.startsWith('/worlds/harry-potter'))
                  ? 'bg-white text-brand-accent shadow-sm'
                  : 'text-brand-muted hover:text-brand-text'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex gap-2 items-center">
          {user ? (
            <>
              <Link
                href="/account"
                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-brand-bg transition"
              >
                <span className="w-8 h-8 rounded-full bg-brand-accent/20 text-brand-accent flex items-center justify-center text-sm font-bold">
                  {user.firstName[0]}
                </span>
                <span className="text-sm font-medium text-brand-navy">{user.firstName}</span>
              </Link>
              <button type="button" onClick={logout} className="text-sm text-brand-muted hover:text-brand-text px-2">
                Выйти
              </button>
            </>
          ) : (
            <Link href="/auth" className="hidden sm:inline text-sm font-medium text-brand-muted hover:text-brand-accent px-3">
              Войти
            </Link>
          )}
          <Link href="/parks" className="btn-primary text-sm py-2.5 px-5">
            Найти парки
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default function Navbar() {
  const pathname = usePathname();

  if (isStarWarsRoute(pathname)) {
    return <StarWarsNavbar />;
  }

  if (isHarryPotterRoute(pathname)) {
    return <HarryPotterNavbar />;
  }

  if (isMarvelRoute(pathname)) {
    return <MarvelNavbar />;
  }

  if (isJurassicRoute(pathname)) {
    return <JurassicNavbar />;
  }

  return <DefaultNavbar />;
}
