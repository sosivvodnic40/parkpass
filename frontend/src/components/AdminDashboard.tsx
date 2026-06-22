'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import {
  deleteAdminReview,
  fetchAdminBookings,
  fetchAdminParks,
  fetchAdminReviews,
  fetchAdminStats,
  fetchAdminUsers,
  patchAdminPark,
  patchAdminTicket,
  patchAdminReview,
  patchBookingStatus,
  patchUserRole,
  verifyBookingQr,
  type AdminBooking,
  type AdminPark,
  type AdminReview,
  type AdminStats,
  type AdminUser,
  type BookingVerifyResponse,
} from '@/lib/admin-api';
import { BACKEND_HINT } from '@/lib/api';
import { extractQrCodeFromInput } from '@/lib/booking-qr';
import { getToken, getUser } from '@/lib/auth';

type Tab = 'overview' | 'bookings' | 'verify' | 'parks' | 'reviews' | 'users';

const BOOKING_STATUSES = ['pending', 'paid', 'cancelled', 'completed'] as const;
const ROLES = ['user', 'park_manager', 'admin'] as const;

const statusLabel: Record<string, string> = {
  pending: 'Ожидает',
  paid: 'Оплачено',
  cancelled: 'Отменено',
  completed: 'Завершено',
};

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('overview');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [parks, setParks] = useState<AdminPark[]>([]);
  const [expandedPark, setExpandedPark] = useState<string | null>(null);
  const [parkDrafts, setParkDrafts] = useState<Record<string, Partial<AdminPark>>>({});
  const [ticketDrafts, setTicketDrafts] = useState<Record<string, { name: string; price: string }>>({});
  const [verifyInput, setVerifyInput] = useState('');
  const [verifyResult, setVerifyResult] = useState<BookingVerifyResponse | null>(null);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [actionMsg, setActionMsg] = useState('');

  const currentUser = typeof window !== 'undefined' ? getUser() : null;
  const isAdmin = currentUser?.role === 'admin';

  const load = useCallback(async () => {
    if (!getToken()) {
      setError('Войдите как admin@parkpass.ru / admin123');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    const [statsRes, bookingsRes, reviewsRes, usersRes, parksRes] = await Promise.all([
      fetchAdminStats(),
      fetchAdminBookings(),
      fetchAdminReviews(),
      fetchAdminUsers(),
      fetchAdminParks(),
    ]);

    if (statsRes.error) {
      setError(statsRes.error === 'Недостаточно прав'
        ? 'Недостаточно прав. Используйте admin@parkpass.ru или manager@parkpass.ru'
        : `${statsRes.error}. ${BACKEND_HINT}`);
      setLoading(false);
      return;
    }

    setStats(statsRes.data ?? null);
    setBookings(bookingsRes.data ?? []);
    setReviews(reviewsRes.data ?? []);
    if (usersRes.data) setUsers(usersRes.data);
    if (parksRes.data) setParks(parksRes.data);

    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const flash = (msg: string) => {
    setActionMsg(msg);
    setTimeout(() => setActionMsg(''), 2500);
  };

  const changeBookingStatus = async (id: string, status: string) => {
    const res = await patchBookingStatus(id, status);
    if (res.error) {
      flash(res.error);
      return;
    }
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    flash('Статус брони обновлён');
  };

  const toggleReviewApproved = async (review: AdminReview) => {
    const res = await patchAdminReview(review.id, { isApproved: !review.isApproved });
    if (res.error) {
      flash(res.error);
      return;
    }
    if (res.data) {
      setReviews((prev) => prev.map((r) => (r.id === review.id ? res.data! : r)));
      flash(res.data.isApproved ? 'Отзыв опубликован' : 'Отзыв скрыт');
    }
  };

  const toggleReviewVerified = async (review: AdminReview) => {
    const res = await patchAdminReview(review.id, { isVerified: !review.isVerified });
    if (res.error) {
      flash(res.error);
      return;
    }
    if (res.data) {
      setReviews((prev) => prev.map((r) => (r.id === review.id ? res.data! : r)));
      flash('Статус проверки обновлён');
    }
  };

  const removeReview = async (id: string) => {
    if (!confirm('Удалить отзыв безвозвратно?')) return;
    const res = await deleteAdminReview(id);
    if (res.error) {
      flash(res.error);
      return;
    }
    setReviews((prev) => prev.filter((r) => r.id !== id));
    flash('Отзыв удалён');
  };

  const changeUserRole = async (id: string, role: string) => {
    const res = await patchUserRole(id, role);
    if (res.error) {
      flash(res.error);
      return;
    }
    if (res.data) {
      setUsers((prev) => prev.map((u) => (u.id === id ? res.data! : u)));
      flash('Роль обновлена');
    }
  };

  const savePark = async (park: AdminPark) => {
    const draft = parkDrafts[park.slug] ?? {};
    const res = await patchAdminPark(park.slug, {
      name: draft.name ?? park.name,
      description: draft.description ?? park.description,
      priceFrom: draft.priceFrom ?? park.priceFrom,
      coverImage: draft.coverImage ?? park.coverImage,
      badge: draft.badge !== undefined ? draft.badge : park.badge,
    });
    if (res.error) {
      flash(res.error);
      return;
    }
    if (res.data) {
      setParks((prev) => prev.map((p) => (p.slug === park.slug ? { ...res.data!, tickets: p.tickets } : p)));
      setParkDrafts((prev) => {
        const next = { ...prev };
        delete next[park.slug];
        return next;
      });
      flash('Парк обновлён');
    }
  };

  const saveTicket = async (parkSlug: string, ticketId: string, fallbackName: string, fallbackPrice: number) => {
    const key = `${parkSlug}:${ticketId}`;
    const draft = ticketDrafts[key];
    const res = await patchAdminTicket(parkSlug, ticketId, {
      name: draft?.name || fallbackName,
      price: Number(draft?.price ?? fallbackPrice),
    });
    if (res.error) {
      flash(res.error);
      return;
    }
    if (res.data) {
      setParks((prev) =>
        prev.map((p) =>
          p.slug === parkSlug
            ? { ...p, tickets: p.tickets.map((t) => (t.id === ticketId ? { ...t, ...res.data! } : t)) }
            : p,
        ),
      );
      setTicketDrafts((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
      flash('Билет обновлён');
    }
  };

  const runVerify = async (checkIn: boolean) => {
    const code = extractQrCodeFromInput(verifyInput);
    if (!code) {
      flash('Введите код или вставьте данные QR');
      return;
    }
    setVerifyLoading(true);
    setVerifyResult(null);
    const res = await verifyBookingQr(code, checkIn);
    setVerifyLoading(false);
    if (res.error) {
      flash(res.error);
      return;
    }
    if (res.data) {
      setVerifyResult(res.data);
      if (checkIn && res.data.valid) {
        setBookings((prev) =>
          prev.map((b) => (b.qrCode.toUpperCase() === code ? { ...b, status: 'completed' } : b)),
        );
      }
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (reviewFilter === 'pending') return !r.isApproved;
    if (reviewFilter === 'approved') return r.isApproved;
    return true;
  });

  if (loading) {
    return <p className="text-brand-muted">Загрузка панели...</p>;
  }

  if (error) {
    return (
      <div className="card p-6 max-w-lg">
        <p className="text-red-600 mb-4">{error}</p>
        <Link href="/auth?next=/admin" className="btn-primary inline-block">
          Войти
        </Link>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; adminOnly?: boolean }[] = [
    { id: 'overview', label: 'Обзор' },
    { id: 'bookings', label: 'Бронирования' },
    { id: 'verify', label: 'Проверка билета' },
    { id: 'parks', label: 'Парки' },
    { id: 'reviews', label: 'Отзывы' },
    { id: 'users', label: 'Пользователи', adminOnly: true },
  ];

  return (
    <div className="space-y-6">
      {actionMsg && (
        <div className="rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm px-4 py-3">
          {actionMsg}
        </div>
      )}

      <div className="flex flex-wrap gap-2 p-1 bg-white rounded-xl border border-brand-border w-fit">
        {tabs
          .filter((t) => !t.adminOnly || isAdmin)
          .map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                tab === t.id ? 'bg-brand-accent text-white shadow-sm' : 'text-brand-muted hover:text-brand-navy'
              }`}
            >
              {t.label}
              {t.id === 'reviews' && reviews.filter((r) => !r.isApproved).length > 0 && (
                <span className="ml-2 inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold">
                  {reviews.filter((r) => !r.isApproved).length}
                </span>
              )}
            </button>
          ))}
      </div>

      {tab === 'overview' && stats && (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Бронирования', value: stats.bookingsTotal, sub: `${stats.bookingsByStatus.paid ?? 0} оплачено` },
              { label: 'Выручка', value: `€ ${stats.revenueTotal.toLocaleString()}`, sub: 'всего' },
              { label: 'Пользователи', value: stats.usersTotal, sub: 'в системе' },
              { label: 'Парки', value: stats.parksTotal, sub: 'активных' },
            ].map((c) => (
              <div key={c.label} className="card p-5">
                <p className="text-sm text-brand-muted">{c.label}</p>
                <p className="text-2xl font-bold text-brand-navy mt-1">{c.value}</p>
                <p className="text-xs text-green-600 mt-1">{c.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="card p-6">
              <h2 className="font-bold text-brand-navy mb-4">По паркам</h2>
              <ul className="space-y-3 text-sm">
                {stats.bookingsByPark.map((p) => (
                  <li key={p.parkSlug} className="flex justify-between gap-4">
                    <span className="text-brand-navy font-medium">{p.parkName}</span>
                    <span className="text-brand-muted">{p.count} броней · € {p.revenue}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card p-6">
              <h2 className="font-bold text-brand-navy mb-4">Последние бронирования</h2>
              <ul className="divide-y divide-brand-border text-sm">
                {stats.recentBookings.map((b) => (
                  <li key={b.id} className="py-3 flex justify-between gap-2">
                    <span className="font-medium">{b.parkName}</span>
                    <span className="text-brand-muted">{b.visitDate}</span>
                    <span className="text-brand-accent font-semibold">{b.totalAmount} €</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}

      {tab === 'bookings' && (
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-brand-border">
            <h2 className="font-bold text-brand-navy">Все бронирования ({bookings.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-brand-bg text-brand-muted text-left">
                <tr>
                  <th className="p-3 font-medium">Парк</th>
                  <th className="p-3 font-medium">Дата</th>
                  <th className="p-3 font-medium">Гости</th>
                  <th className="p-3 font-medium">Сумма</th>
                  <th className="p-3 font-medium">QR-код</th>
                  <th className="p-3 font-medium">Статус</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-t border-brand-border">
                    <td className="p-3 font-medium text-brand-navy">{b.parkName}</td>
                    <td className="p-3 text-brand-muted">{b.visitDate}</td>
                    <td className="p-3">{b.guests}</td>
                    <td className="p-3 font-semibold">{b.totalAmount} €</td>
                    <td className="p-3 font-mono text-xs text-brand-muted">{b.qrCode}</td>
                    <td className="p-3">
                      <select
                        value={b.status}
                        onChange={(e) => changeBookingStatus(b.id, e.target.value)}
                        className="input-field py-1.5 text-xs w-auto"
                      >
                        {BOOKING_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {statusLabel[s]}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'verify' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card p-6 space-y-4">
            <h2 className="font-bold text-brand-navy">Контроль на входе</h2>
            <p className="text-sm text-brand-muted">
              Вставьте код PP-… или JSON из QR-кода гостя. Для допуска нажмите «Отметить вход» — статус сменится на «Завершено».
            </p>
            <textarea
              value={verifyInput}
              onChange={(e) => setVerifyInput(e.target.value)}
              placeholder="PP-XXXXXXXX или JSON из QR"
              rows={4}
              className="input-field font-mono text-sm"
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={verifyLoading}
                onClick={() => runVerify(false)}
                className="btn-primary text-sm disabled:opacity-50"
              >
                Проверить
              </button>
              <button
                type="button"
                disabled={verifyLoading}
                onClick={() => runVerify(true)}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
              >
                Отметить вход
              </button>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="font-bold text-brand-navy mb-4">Результат</h2>
            {!verifyResult ? (
              <p className="text-sm text-brand-muted">Сканируйте или введите код билета</p>
            ) : (
              <div className="space-y-3">
                <p
                  className={`text-sm font-semibold px-3 py-2 rounded-lg ${
                    verifyResult.valid
                      ? 'bg-green-50 text-green-800 border border-green-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {verifyResult.message}
                </p>
                {verifyResult.booking && (
                  <dl className="text-sm space-y-2">
                    <div className="flex justify-between gap-4">
                      <dt className="text-brand-muted">Парк</dt>
                      <dd className="font-medium text-brand-navy">{verifyResult.booking.parkName}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-brand-muted">Дата визита</dt>
                      <dd>{verifyResult.booking.visitDate}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-brand-muted">Гости</dt>
                      <dd>{verifyResult.booking.guests}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-brand-muted">Сумма</dt>
                      <dd className="font-semibold">{verifyResult.booking.totalAmount} €</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-brand-muted">Код</dt>
                      <dd className="font-mono text-xs">{verifyResult.booking.qrCode}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-brand-muted">Статус</dt>
                      <dd>{statusLabel[verifyResult.booking.status] ?? verifyResult.booking.status}</dd>
                    </div>
                  </dl>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'parks' && (
        <div className="space-y-4">
          {parks.map((park) => {
            const draft = parkDrafts[park.slug] ?? {};
            const isOpen = expandedPark === park.slug;
            return (
              <div key={park.slug} className="card overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpandedPark(isOpen ? null : park.slug)}
                  className="w-full p-4 flex flex-wrap items-center justify-between gap-3 text-left hover:bg-brand-bg/50 transition"
                >
                  <div className="flex items-center gap-4">
                    {park.coverImage && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={park.coverImage} alt="" className="w-16 h-12 object-cover rounded-lg border border-brand-border" />
                    )}
                    <div>
                      <p className="font-bold text-brand-navy">{draft.name ?? park.name}</p>
                      <p className="text-xs text-brand-muted">{park.slug} · от {draft.priceFrom ?? park.priceFrom} €</p>
                    </div>
                  </div>
                  <span className="text-brand-muted text-sm">{isOpen ? '▲' : '▼'}</span>
                </button>

                {isOpen && (
                  <div className="p-4 border-t border-brand-border space-y-4 bg-brand-bg/30">
                    <div className="grid md:grid-cols-2 gap-4">
                      <label className="block text-sm">
                        <span className="text-brand-muted">Название</span>
                        <input
                          className="input-field mt-1"
                          defaultValue={park.name}
                          onChange={(e) =>
                            setParkDrafts((prev) => ({
                              ...prev,
                              [park.slug]: { ...prev[park.slug], name: e.target.value },
                            }))
                          }
                        />
                      </label>
                      <label className="block text-sm">
                        <span className="text-brand-muted">Цена от (€)</span>
                        <input
                          type="number"
                          className="input-field mt-1"
                          defaultValue={park.priceFrom}
                          onChange={(e) =>
                            setParkDrafts((prev) => ({
                              ...prev,
                              [park.slug]: { ...prev[park.slug], priceFrom: Number(e.target.value) },
                            }))
                          }
                        />
                      </label>
                      <label className="block text-sm md:col-span-2">
                        <span className="text-brand-muted">Обложка (URL)</span>
                        <input
                          className="input-field mt-1 font-mono text-xs"
                          defaultValue={park.coverImage}
                          onChange={(e) =>
                            setParkDrafts((prev) => ({
                              ...prev,
                              [park.slug]: { ...prev[park.slug], coverImage: e.target.value },
                            }))
                          }
                        />
                      </label>
                      <label className="block text-sm md:col-span-2">
                        <span className="text-brand-muted">Описание</span>
                        <textarea
                          className="input-field mt-1"
                          rows={3}
                          defaultValue={park.description}
                          onChange={(e) =>
                            setParkDrafts((prev) => ({
                              ...prev,
                              [park.slug]: { ...prev[park.slug], description: e.target.value },
                            }))
                          }
                        />
                      </label>
                      <label className="block text-sm">
                        <span className="text-brand-muted">Бейдж</span>
                        <input
                          className="input-field mt-1"
                          defaultValue={park.badge ?? ''}
                          placeholder="Новинка, Хит…"
                          onChange={(e) =>
                            setParkDrafts((prev) => ({
                              ...prev,
                              [park.slug]: { ...prev[park.slug], badge: e.target.value || null },
                            }))
                          }
                        />
                      </label>
                    </div>

                    <button type="button" onClick={() => savePark(park)} className="btn-primary text-sm">
                      Сохранить парк
                    </button>

                    <div>
                      <h3 className="font-semibold text-brand-navy mb-3">Типы билетов</h3>
                      <div className="space-y-3">
                        {park.tickets.map((ticket) => {
                          const tKey = `${park.slug}:${ticket.id}`;
                          return (
                            <div key={ticket.id} className="flex flex-wrap gap-3 items-end p-3 rounded-xl bg-white border border-brand-border">
                              <label className="text-sm flex-1 min-w-[140px]">
                                <span className="text-brand-muted text-xs">{ticket.id}</span>
                                <input
                                  className="input-field mt-1 py-1.5"
                                  defaultValue={ticket.name}
                                  onChange={(e) =>
                                    setTicketDrafts((prev) => ({
                                      ...prev,
                                      [tKey]: { ...prev[tKey], name: e.target.value, price: prev[tKey]?.price ?? String(ticket.price) },
                                    }))
                                  }
                                />
                              </label>
                              <label className="text-sm w-28">
                                <span className="text-brand-muted text-xs">Цена €</span>
                                <input
                                  type="number"
                                  className="input-field mt-1 py-1.5"
                                  defaultValue={ticket.price}
                                  onChange={(e) =>
                                    setTicketDrafts((prev) => ({
                                      ...prev,
                                      [tKey]: { name: prev[tKey]?.name ?? ticket.name, price: e.target.value },
                                    }))
                                  }
                                />
                              </label>
                              <button
                                type="button"
                                onClick={() => saveTicket(park.slug, ticket.id, ticket.name, ticket.price)}
                                className="px-3 py-2 rounded-lg text-xs font-semibold border border-brand-border hover:border-brand-accent"
                              >
                                Сохранить
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {tab === 'reviews' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {(['all', 'pending', 'approved'] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setReviewFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                  reviewFilter === f
                    ? 'bg-brand-navy text-white border-brand-navy'
                    : 'border-brand-border text-brand-muted hover:border-brand-accent'
                }`}
              >
                {f === 'all' ? 'Все' : f === 'pending' ? 'На модерации' : 'Опубликованные'}
              </button>
            ))}
          </div>

          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-brand-bg text-brand-muted text-left">
                  <tr>
                    <th className="p-3 font-medium">Автор</th>
                    <th className="p-3 font-medium">Парк</th>
                    <th className="p-3 font-medium">Оценка</th>
                    <th className="p-3 font-medium">Текст</th>
                    <th className="p-3 font-medium">Статус</th>
                    <th className="p-3 font-medium">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReviews.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-brand-muted">
                        Нет отзывов по фильтру
                      </td>
                    </tr>
                  ) : (
                    filteredReviews.map((r) => (
                      <tr key={r.id} className="border-t border-brand-border align-top">
                        <td className="p-3">
                          <p className="font-medium text-brand-navy">{r.userName}</p>
                          <p className="text-xs text-brand-muted">{new Date(r.createdAt).toLocaleDateString('ru-RU')}</p>
                        </td>
                        <td className="p-3 text-brand-muted max-w-[140px]">{r.parkName}</td>
                        <td className="p-3">
                          <span className="text-amber-500 font-bold">{'★'.repeat(r.rating)}</span>
                        </td>
                        <td className="p-3 max-w-xs">
                          {r.title && <p className="font-medium text-brand-navy">{r.title}</p>}
                          {r.body && <p className="text-brand-muted text-xs mt-1 line-clamp-2">{r.body}</p>}
                        </td>
                        <td className="p-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              r.isApproved ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {r.isApproved ? 'Опубликован' : 'Модерация'}
                          </span>
                          {r.isVerified && (
                            <span className="block mt-1 text-[10px] text-brand-accent font-semibold">✓ Проверен</span>
                          )}
                        </td>
                        <td className="p-3">
                          <div className="flex flex-col gap-1.5 min-w-[120px]">
                            <button
                              type="button"
                              onClick={() => toggleReviewApproved(r)}
                              className="text-xs px-2 py-1 rounded-lg bg-brand-accent/10 text-brand-accent font-semibold hover:bg-brand-accent/20"
                            >
                              {r.isApproved ? 'Скрыть' : 'Опубликовать'}
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleReviewVerified(r)}
                              className="text-xs px-2 py-1 rounded-lg border border-brand-border text-brand-muted hover:border-brand-accent"
                            >
                              {r.isVerified ? 'Снять ✓' : 'Проверен ✓'}
                            </button>
                            <button
                              type="button"
                              onClick={() => removeReview(r.id)}
                              className="text-xs px-2 py-1 rounded-lg text-red-600 hover:bg-red-50"
                            >
                              Удалить
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'users' && isAdmin && (
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-brand-border">
            <h2 className="font-bold text-brand-navy">Пользователи ({users.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-brand-bg text-brand-muted text-left">
                <tr>
                  <th className="p-3 font-medium">Имя</th>
                  <th className="p-3 font-medium">Email</th>
                  <th className="p-3 font-medium">Клуб</th>
                  <th className="p-3 font-medium">Роль</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t border-brand-border">
                    <td className="p-3 font-medium">{u.firstName} {u.lastName}</td>
                    <td className="p-3 text-brand-muted">{u.email}</td>
                    <td className="p-3 capitalize">{u.clubTier}</td>
                    <td className="p-3">
                      <select
                        value={u.role}
                        onChange={(e) => changeUserRole(u.id, e.target.value)}
                        className="input-field py-1.5 text-xs w-auto capitalize"
                      >
                        {ROLES.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
