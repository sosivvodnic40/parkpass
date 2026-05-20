'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { clearSession, getUser, type User } from '@/lib/auth';

const links = [
  { href: '/parks', label: 'Парки' },
  { href: '/favorites', label: 'Избранное' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, [pathname]);

  const logout = () => {
    clearSession();
    setUser(null);
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-50 bg-brand-surface/95 backdrop-blur-md border-b border-brand-border">
      <nav className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-brand-navy">
          Park<span className="text-brand-accent">Pass</span>
        </Link>

        <div className="hidden md:flex gap-8 text-sm font-medium text-brand-muted">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={
                pathname === l.href || pathname.startsWith(l.href + '/')
                  ? 'text-brand-accent'
                  : 'hover:text-brand-text transition'
              }
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex gap-2 md:gap-3 items-center">
          {user ? (
            <>
              <Link
                href="/account"
                className="hidden sm:inline text-sm font-medium text-brand-navy hover:text-brand-accent"
              >
                {user.firstName}
              </Link>
              <button type="button" onClick={logout} className="text-sm text-brand-muted hover:text-brand-text px-2">
                Выйти
              </button>
            </>
          ) : (
            <Link href="/auth" className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-brand-muted hover:text-brand-text">
              Войти
            </Link>
          )}
          <Link href="/parks" className="btn-primary text-sm py-2 px-4">
            Найти парки
          </Link>
        </div>
      </nav>
    </header>
  );
}
