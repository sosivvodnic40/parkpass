'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { saveSession } from '@/lib/auth';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('demo@parkpass.ru');
  const [password, setPassword] = useState('demo123');
  const [firstName, setFirstName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/api/v1/auth/${mode === 'login' ? 'login' : 'register'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, firstName, lastName: '' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Ошибка');
      saveSession(data.token, data.user);
      router.push('/account');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="py-16 px-6">
      <div className="max-w-md mx-auto card p-8">
        <h1 className="text-2xl font-bold text-brand-navy mb-2">
          {mode === 'login' ? 'Вход' : 'Регистрация'}
        </h1>
        <p className="text-brand-muted text-sm mb-6">
          Демо: demo@parkpass.ru / demo123
        </p>

        <form onSubmit={submit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="text-sm font-medium text-brand-muted block mb-1">Имя</label>
              <input className="input-field" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-brand-muted block mb-1">Email</label>
            <input type="email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm font-medium text-brand-muted block mb-1">Пароль</label>
            <input type="password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Загрузка...' : mode === 'login' ? 'Войти' : 'Создать аккаунт'}
          </button>
        </form>

        <p className="text-center text-sm text-brand-muted mt-6">
          {mode === 'login' ? (
            <>Нет аккаунта? <button type="button" className="text-brand-accent font-medium" onClick={() => setMode('register')}>Регистрация</button></>
          ) : (
            <>Есть аккаунт? <button type="button" className="text-brand-accent font-medium" onClick={() => setMode('login')}>Войти</button></>
          )}
        </p>
        <Link href="/" className="block text-center text-sm text-brand-muted mt-4 hover:text-brand-accent">
          ← На главную
        </Link>
      </div>
    </main>
  );
}
