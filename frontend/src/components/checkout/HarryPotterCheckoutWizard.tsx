'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import type { Park, TicketType, Booking } from '@/lib/api';
import { hpColors, hpGallery, HP_PARK_SLUG } from '@/lib/harry-potter-images';
import HpSparkles from '@/components/hp/HpSparkles';
import HpSparkleDivider from '@/components/hp/HpSparkleDivider';
import BookingQrCard from '@/components/BookingQrCard';

const C = hpColors;
import { confirmCheckoutBooking } from '@/lib/checkout-api';
const MAX_GUESTS = 12;
const COVER = hpGallery[0].src;
const TRUST = ['Без скрытых сборов', 'QR мгновенно', 'Безопасная оплата'];

const STEPS = ['Гость', 'Оплата', 'Подтверждение'] as const;

function guestLabel(n: number) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 14) return `${n} гостей`;
  if (mod10 === 1) return `${n} гость`;
  if (mod10 >= 2 && mod10 <= 4) return `${n} гостя`;
  return `${n} гостей`;
}

type Props = {
  park: Park;
  tickets: TicketType[];
};

export default function HarryPotterCheckoutWizard({ park, tickets }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const ticketParam = params.get('ticket') ?? tickets[1]?.id ?? tickets[0]?.id ?? '';
  const [visitDate, setVisitDate] = useState(params.get('date') ?? '');
  const [guestCount, setGuestCount] = useState(() =>
    Math.min(MAX_GUESTS, Math.max(1, Number(params.get('guests') ?? 2))),
  );

  const selectedTicket = useMemo(
    () => tickets.find((t) => t.id === ticketParam) ?? tickets[0],
    [tickets, ticketParam],
  );

  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [completedBooking, setCompletedBooking] = useState<Booking | null>(null);
  const [payError, setPayError] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const unit = selectedTicket?.price ?? park.priceFrom;
  const price = unit * guestCount;

  const checkoutQuery = (ticketId: string) => {
    const q = new URLSearchParams({ ticket: ticketId, guests: String(guestCount) });
    if (visitDate) q.set('date', visitDate);
    return `/checkout/${HP_PARK_SLUG}?${q}`;
  };

  const confirmPayment = async () => {
    setPayError('');
    await confirmCheckoutBooking(
      router,
      {
        parkSlug: park.slug,
        parkName: park.name,
        ticketId: selectedTicket?.id ?? 't1',
        ticketName: selectedTicket?.name,
        visitDate: visitDate || undefined,
        guests: guestCount,
        totalAmount: price,
      },
      (booking) => {
        setCompletedBooking(booking);
        setDone(true);
      },
      setPayError,
    );
  };

  const inputClass =
    'w-full rounded-xl border border-white/15 bg-[#0b0d14] px-4 py-3 text-[#f0e8d8] placeholder:text-stone-600 focus:outline-none focus:border-[#c9922a]/50';

  return (
    <main className="hp-page min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 hp-tickets-bg pointer-events-none" aria-hidden />
      <HpSparkles count={28} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-8 pb-16 md:pt-10 md:pb-20">
        <Link
          href="/worlds/harry-potter"
          className="inline-flex items-center gap-2 text-sm mb-8 transition-opacity hover:opacity-80"
          style={{ color: 'rgba(240,232,216,0.6)' }}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="m15 18-6-6 6-6" />
          </svg>
          Вернуться в Хогсмид
        </Link>

        <div className="relative rounded-2xl overflow-hidden mb-8 h-32 md:h-40" style={{ border: `1px solid ${C.gold}25` }}>
          <Image src={COVER} alt={park.name} fill className="object-cover" sizes="100vw" priority />
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(90deg, ${C.bg} 0%, ${C.bg}cc 40%, transparent 72%)` }}
          />
          <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-8">
            <p className="hp-display text-[10px] tracking-[0.45em] uppercase mb-1" style={{ color: C.gold }}>
              Бронирование
            </p>
            <h1 className="hp-display text-2xl md:text-3xl font-black" style={{ color: C.text }}>
              Оформление билета
            </h1>
            <p className="text-sm mt-1" style={{ color: 'rgba(240,232,216,0.55)' }}>
              {park.name} · Хогсмид · Universal Orlando
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {TRUST.map((t) => (
            <span
              key={t}
              className="text-[10px] md:text-xs px-3 py-1.5 rounded-full uppercase tracking-wider"
              style={{
                background: 'rgba(201,146,42,0.12)',
                border: `1px solid ${C.gold}30`,
                color: 'rgba(240,232,216,0.7)',
              }}
            >
              {t}
            </span>
          ))}
        </div>

        {done && completedBooking ? (
          <div
            className="max-w-lg mx-auto rounded-2xl p-8 md:p-10 text-center"
            style={{
              background: `linear-gradient(160deg, ${C.highlightFrom} 0%, ${C.highlightTo} 100%)`,
              border: `1px solid ${C.gold}50`,
              boxShadow: '0 0 40px rgba(201,146,42,0.12)',
            }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-6 hp-display"
              style={{ background: `linear-gradient(135deg, ${C.goldLight}, ${C.gold})`, color: '#1a0e00' }}
            >
              ✓
            </div>
            <h2 className="hp-display text-2xl font-black mb-2">Добро пожаловать в Хогвартс!</h2>
            <p className="text-sm mb-6" style={{ color: 'rgba(240,232,216,0.7)' }}>
              Билеты отправлены на {email || 'ваш email'}
            </p>
            <BookingQrCard
              booking={completedBooking}
              accent={C.gold}
              textColor="#f0e8d8"
              mutedColor="rgba(240,232,216,0.65)"
              className="mb-6"
            />
            <Link href="/worlds/harry-potter" className="hp-btn-gold inline-flex px-8 py-3 rounded-xl font-semibold shadow-none">
              Вернуться в Хогсмид
            </Link>
          </div>
        ) : done ? null : (
          <>
            <div className="mb-10 max-w-2xl mx-auto">
              <div className="flex justify-between mb-2">
                {STEPS.map((label, i) => (
                  <span
                    key={label}
                    className="hp-display text-[10px] md:text-xs uppercase tracking-wider"
                    style={{ color: step >= i + 1 ? C.gold : 'rgba(240,232,216,0.35)' }}
                  >
                    {label}
                  </span>
                ))}
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: `${C.gold}15` }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(step / 3) * 100}%`,
                    background: `linear-gradient(90deg, ${C.goldLight}, ${C.gold})`,
                  }}
                />
              </div>
            </div>

            <HpSparkleDivider />

            <div className="grid lg:grid-cols-3 gap-6 md:gap-8 mt-8">
              <div className="lg:col-span-2 space-y-6">
                {step === 1 && (
                  <div
                    className="rounded-2xl p-6 md:p-8 space-y-5"
                    style={{ background: C.surface, border: `1px solid ${C.gold}18` }}
                  >
                    <h2 className="hp-display text-xl font-bold">Данные гостя</h2>
                    <div>
                      <label className="text-sm block mb-1" style={{ color: 'rgba(240,232,216,0.55)' }}>
                        Имя
                      </label>
                      <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="Иван Иванов" />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm block mb-1" style={{ color: 'rgba(240,232,216,0.55)' }}>
                          Email
                        </label>
                        <input
                          type="email"
                          className={inputClass}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="email@example.com"
                        />
                      </div>
                      <div>
                        <label className="text-sm block mb-1" style={{ color: 'rgba(240,232,216,0.55)' }}>
                          Дата визита
                        </label>
                        <input
                          type="date"
                          className={inputClass}
                          value={visitDate}
                          onChange={(e) => setVisitDate(e.target.value)}
                        />
                      </div>
                    </div>
                    <GuestStepper
                      guestCount={guestCount}
                      onChange={(d) => setGuestCount((n) => Math.min(MAX_GUESTS, Math.max(1, n + d)))}
                      unit={unit}
                    />
                    <button type="button" onClick={() => setStep(2)} className="hp-btn-gold w-full py-3.5 rounded-xl font-semibold shadow-none">
                      Далее
                    </button>
                  </div>
                )}

                {step === 2 && (
                  <div
                    className="rounded-2xl p-6 md:p-8 space-y-5"
                    style={{ background: C.surface, border: `1px solid ${C.gold}18` }}
                  >
                    <h2 className="hp-display text-xl font-bold">Оплата (демо)</h2>
                    <input className={inputClass} placeholder="Номер карты 4242 4242 4242 4242" />
                    <div className="grid grid-cols-2 gap-4">
                      <input className={inputClass} placeholder="MM/YY" />
                      <input className={inputClass} placeholder="CVC" />
                    </div>
                    <p className="text-xs" style={{ color: 'rgba(240,232,216,0.45)' }}>
                      Имитация оплаты для дипломного проекта
                    </p>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex-1 py-3.5 rounded-xl font-semibold border transition"
                        style={{ borderColor: `${C.gold}30`, color: C.text }}
                      >
                        Назад
                      </button>
                      <button type="button" onClick={() => setStep(3)} className="hp-btn-gold flex-1 py-3.5 rounded-xl font-semibold shadow-none">
                        Далее
                      </button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div
                    className="rounded-2xl p-6 md:p-8 space-y-5"
                    style={{ background: C.surface, border: `1px solid ${C.gold}18` }}
                  >
                    <h2 className="hp-display text-xl font-bold">Подтверждение</h2>
                    <div className="rounded-xl p-4 space-y-2 text-sm mb-4" style={{ background: C.bg, border: `1px solid ${C.gold}15` }}>
                      <p style={{ color: 'rgba(240,232,216,0.65)' }}>{park.name}</p>
                      <p className="font-semibold">{selectedTicket?.name}</p>
                      <p style={{ color: 'rgba(240,232,216,0.55)' }}>
                        {guestLabel(guestCount)}
                        {visitDate ? ` · ${visitDate}` : ''}
                      </p>
                    </div>
                    <ul className="space-y-2 mb-4">
                      {selectedTicket?.features.map((f) => (
                        <li key={f} className="flex gap-2 text-sm" style={{ color: 'rgba(240,232,216,0.75)' }}>
                          <span style={{ color: C.gold }}>✦</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                    {payError && <p className="text-red-400 text-sm">{payError}</p>}
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="flex-1 py-3.5 rounded-xl font-semibold border transition"
                        style={{ borderColor: `${C.gold}30`, color: C.text }}
                      >
                        Назад
                      </button>
                      <button type="button" onClick={confirmPayment} className="hp-btn-gold flex-1 py-3.5 rounded-xl font-semibold shadow-none hp-display">
                        Оплатить {price} €
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <aside
                className="rounded-2xl p-6 md:p-7 h-fit lg:sticky lg:top-20"
                style={{
                  background: `linear-gradient(160deg, ${C.highlightFrom} 0%, ${C.highlightTo} 100%)`,
                  border: `1px solid ${C.gold}35`,
                }}
              >
                <div className="relative h-40 rounded-xl overflow-hidden mb-5 ring-1 ring-white/10" style={{ border: `1px solid ${C.gold}20` }}>
                  <Image src={COVER} alt={park.name} fill className="object-cover" sizes="360px" />
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, rgba(11,13,20,0.85) 0%, transparent 55%)' }}
                  />
                </div>

                <p className="hp-display text-xs tracking-widest uppercase mb-1" style={{ color: C.gold }}>
                  Ваш заказ
                </p>
                <h3 className="hp-display text-lg font-bold mb-4">{selectedTicket?.name}</h3>

                <GuestStepper
                  guestCount={guestCount}
                  onChange={(d) => setGuestCount((n) => Math.min(MAX_GUESTS, Math.max(1, n + d)))}
                  unit={unit}
                  compact
                />

                <hr className="my-4" style={{ borderColor: `${C.gold}20` }} />

                <div className="flex justify-between text-sm" style={{ color: 'rgba(240,232,216,0.65)' }}>
                  <span>Билеты</span>
                  <span className="tabular-nums">
                    {unit} € × {guestCount}
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-2" style={{ color: 'rgba(240,232,216,0.65)' }}>
                  <span>Сервисный сбор</span>
                  <span>0 €</span>
                </div>
                <p className="text-xs mt-3" style={{ color: C.gold }}>
                  Без скрытых сборов
                </p>

                <hr className="my-4" style={{ borderColor: `${C.gold}20` }} />

                <div className="flex justify-between items-baseline">
                  <span className="hp-display font-bold">Итого</span>
                  <span className="hp-display text-2xl font-black" style={{ color: C.gold }}>
                    {price} €
                  </span>
                </div>

                {tickets.length > 1 && (
                  <div className="mt-6 pt-4" style={{ borderTop: `1px solid ${C.gold}20` }}>
                    <p className="text-[10px] tracking-widest uppercase mb-3" style={{ color: 'rgba(240,232,216,0.45)' }}>
                      Тариф
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {tickets.map((t) => (
                        <Link
                          key={t.id}
                          href={checkoutQuery(t.id)}
                          className="text-xs px-3 py-1.5 rounded-lg font-semibold transition"
                          style={
                            t.id === selectedTicket?.id
                              ? {
                                  background: `linear-gradient(135deg, ${C.goldLight}, ${C.gold})`,
                                  color: '#1a0e00',
                                }
                              : {
                                  border: `1px solid ${C.gold}30`,
                                  color: 'rgba(240,232,216,0.7)',
                                }
                          }
                        >
                          {t.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </aside>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function GuestStepper({
  guestCount,
  onChange,
  unit,
  compact,
}: {
  guestCount: number;
  onChange: (delta: number) => void;
  unit: number;
  compact?: boolean;
}) {
  const btn =
    'w-10 h-10 rounded-xl border border-white/20 text-lg font-bold disabled:opacity-30 hover:border-[#c9922a]/50 transition';
  return (
    <div className={compact ? '' : 'pt-1'}>
      {!compact && (
        <label className="text-sm block mb-2" style={{ color: 'rgba(240,232,216,0.55)' }}>
          Количество гостей
        </label>
      )}
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => onChange(-1)} disabled={guestCount <= 1} className={btn} style={{ color: C.text }}>
          −
        </button>
        <div
          className="flex-1 text-center py-2.5 rounded-xl border tabular-nums"
          style={{ background: C.bg, borderColor: `${C.gold}25`, color: C.text }}
        >
          <span className={compact ? 'text-xl font-bold' : 'text-2xl font-bold'}>{guestCount}</span>
          {!compact && (
            <span className="block text-xs mt-0.5" style={{ color: 'rgba(240,232,216,0.45)' }}>
              {guestLabel(guestCount)}
            </span>
          )}
        </div>
        <button type="button" onClick={() => onChange(1)} disabled={guestCount >= MAX_GUESTS} className={btn} style={{ color: C.text }}>
          +
        </button>
      </div>
      {!compact && (
        <p className="text-xs mt-2" style={{ color: 'rgba(240,232,216,0.45)' }}>
          от 1 до {MAX_GUESTS} · {unit} € за билет
        </p>
      )}
    </div>
  );
}
