'use client';

import Link from 'next/link';
import { useState } from 'react';
import { createReview, type Review } from '@/lib/api';
import { getToken } from '@/lib/auth';

export type ReviewTheme = 'default' | 'sw' | 'hp' | 'mv' | 'jp';

type Props = {
  parkSlug: string;
  parkName: string;
  initialReviews: Review[];
  theme?: ReviewTheme;
};

function stars(n: number) {
  return '★'.repeat(n) + '☆'.repeat(5 - n);
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

const styles: Record<
  ReviewTheme,
  {
    section: string;
    card: string;
    title: string;
    muted: string;
    accent: string;
    input: string;
    btn: string;
    star: string;
  }
> = {
  default: {
    section: 'bg-white border-t border-brand-border',
    card: 'card p-5',
    title: 'text-brand-navy',
    muted: 'text-brand-muted',
    accent: 'text-brand-accent',
    input: 'input-field',
    btn: 'btn-primary',
    star: 'text-amber-500',
  },
  sw: {
    section: 'bg-[#050508] border-t border-white/10',
    card: 'rounded-2xl p-5 border border-white/10 bg-[#0c0c14]/90',
    title: 'text-white',
    muted: 'text-stone-400',
    accent: 'text-[#FFE81F]',
    input:
      'w-full rounded-xl px-4 py-2.5 bg-[#0c0c14] border border-white/15 text-white placeholder:text-stone-500 outline-none focus:border-[#FFE81F]/50',
    btn: 'px-6 py-3 rounded-xl bg-[#FFE81F] text-[#050508] font-bold hover:bg-[#fff176] transition disabled:opacity-50',
    star: 'text-[#FFE81F]',
  },
  hp: {
    section: 'hp-page border-t',
    card: 'rounded-2xl p-5',
    title: 'text-[#f0e8d8]',
    muted: 'text-[rgba(240,232,216,0.55)]',
    accent: 'text-[#c9a227]',
    input:
      'w-full rounded-xl px-4 py-2.5 bg-[#0b0d14] border border-[#c9a227]/25 text-[#f0e8d8] placeholder:text-stone-500 outline-none focus:border-[#c9a227]/60',
    btn: 'hp-btn-gold hp-display px-6 py-3 rounded-xl font-semibold disabled:opacity-50',
    star: 'text-[#c9a227]',
  },
  mv: {
    section: 'bg-[#0a0e1a] border-t border-white/10',
    card: 'rounded-2xl p-5 border border-white/10 bg-[#111827]/90',
    title: 'text-white',
    muted: 'text-slate-400',
    accent: 'text-[#E23636]',
    input:
      'w-full rounded-xl px-4 py-2.5 bg-[#111827] border border-white/15 text-white placeholder:text-slate-500 outline-none focus:border-[#E23636]/50',
    btn: 'px-6 py-3 rounded-xl bg-[#E23636] text-white font-bold hover:bg-red-600 transition disabled:opacity-50',
    star: 'text-[#E23636]',
  },
  jp: {
    section: 'bg-[#0a120c] border-t border-emerald-900/30',
    card: 'rounded-2xl p-5 border border-emerald-800/30 bg-[#0f1812]/90',
    title: 'text-emerald-50',
    muted: 'text-emerald-200/50',
    accent: 'text-emerald-400',
    input:
      'w-full rounded-xl px-4 py-2.5 bg-[#0f1812] border border-emerald-800/40 text-emerald-50 placeholder:text-emerald-900 outline-none focus:border-emerald-500/50',
    btn: 'px-6 py-3 rounded-xl bg-emerald-500 text-emerald-950 font-bold hover:bg-emerald-400 transition disabled:opacity-50',
    star: 'text-emerald-400',
  },
};

export default function ParkReviews({
  parkSlug,
  parkName,
  initialReviews,
  theme = 'default',
}: Props) {
  const s = styles[theme];
  const [reviews, setReviews] = useState(initialReviews);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getToken();
    if (!token) return;

    setLoading(true);
    setError('');
    setSuccess(false);

    const review = await createReview(token, {
      parkSlug,
      rating,
      title: title.trim() || undefined,
      body: body.trim() || undefined,
      visitDate: visitDate || undefined,
    });

    setLoading(false);

    if (!review) {
      setError('Не удалось отправить отзыв. Войдите в аккаунт и проверьте backend.');
      return;
    }

    setReviews((prev) => [review, ...prev]);
    setTitle('');
    setBody('');
    setVisitDate('');
    setRating(5);
    setSuccess(true);
    setShowForm(false);
  };

  const token = typeof window !== 'undefined' ? getToken() : null;

  return (
    <section id="reviews" className={`py-16 md:py-20 ${s.section}`}>
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <p className={`text-xs font-bold uppercase tracking-widest ${s.accent}`}>Отзывы</p>
            <h2 className={`text-2xl md:text-3xl font-bold mt-2 ${s.title}`}>
              Что говорят гости
            </h2>
            <p className={`text-sm mt-2 ${s.muted}`}>
              {parkName} · {reviews.length}{' '}
              {reviews.length === 1 ? 'отзыв' : reviews.length < 5 ? 'отзыва' : 'отзывов'}
            </p>
          </div>
          {!showForm && (
            <button
              type="button"
              onClick={() => {
                if (!getToken()) {
                  window.location.href = `/auth?next=${encodeURIComponent(window.location.pathname + '#reviews')}`;
                  return;
                }
                setShowForm(true);
              }}
              className={s.btn}
            >
              Написать отзыв
            </button>
          )}
        </div>

        {success && (
          <p className={`mb-6 text-sm font-medium ${s.accent}`}>
            Спасибо! Отзыв отправлен на модерацию — появится на сайте после одобрения администратором.
          </p>
        )}

        {showForm && token && (
          <form onSubmit={submit} className={`${s.card} mb-10 space-y-4 max-w-2xl`}>
            <h3 className={`font-bold ${s.title}`}>Ваш отзыв о {parkName}</h3>

            <div>
              <label className={`text-sm block mb-2 ${s.muted}`}>Оценка</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(n)}
                    className={`text-2xl transition ${n <= rating ? s.star : s.muted}`}
                    aria-label={`${n} звёзд`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={`text-sm block mb-1 ${s.muted}`}>Заголовок</label>
              <input
                className={s.input}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Кратко о впечатлениях"
                maxLength={120}
              />
            </div>

            <div>
              <label className={`text-sm block mb-1 ${s.muted}`}>Текст отзыва</label>
              <textarea
                className={`${s.input} min-h-[100px] resize-y`}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Что понравилось, что стоит знать..."
                rows={4}
              />
            </div>

            <div>
              <label className={`text-sm block mb-1 ${s.muted}`}>Дата визита</label>
              <input
                type="date"
                className={s.input}
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex gap-3">
              <button type="submit" disabled={loading} className={s.btn}>
                {loading ? 'Отправка...' : 'Опубликовать'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className={`text-sm ${s.muted} hover:underline`}
              >
                Отмена
              </button>
            </div>
          </form>
        )}

        {reviews.length === 0 ? (
          <div className={`${s.card} text-center py-12`}>
            <p className={s.muted}>Пока нет отзывов — будьте первым!</p>
            {!token && (
              <Link href={`/auth?next=${encodeURIComponent(`/worlds#reviews`)}`} className={`inline-block mt-4 text-sm font-semibold ${s.accent}`}>
                Войти, чтобы написать
              </Link>
            )}
          </div>
        ) : (
          <ul className="grid md:grid-cols-2 gap-5">
            {reviews.map((r) => (
              <li key={r.id} className={s.card}>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className={`font-bold ${s.title}`}>{r.userName}</p>
                    <p className={`text-xs mt-0.5 ${s.muted}`}>
                      {formatDate(r.createdAt)}
                      {r.visitDate ? ` · визит ${r.visitDate}` : ''}
                    </p>
                  </div>
                  <span className={`text-sm font-bold shrink-0 ${s.star}`} aria-label={`${r.rating} из 5`}>
                    {stars(r.rating)}
                  </span>
                </div>
                {r.title && <p className={`font-semibold mb-2 ${s.title}`}>{r.title}</p>}
                {r.body && <p className={`text-sm leading-relaxed ${s.muted}`}>{r.body}</p>}
                {r.isVerified && (
                  <span className={`inline-block mt-3 text-[10px] font-bold uppercase tracking-wider ${s.accent}`}>
                    ✓ Подтверждённый визит
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
