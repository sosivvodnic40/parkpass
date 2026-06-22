'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import type { Park, TicketType } from '@/lib/api';
import type { CheckoutTheme } from '@/lib/checkout-themes';
import StarCosmos from '@/components/StarCosmos';
import HpCosmos from '@/components/HpCosmos';
import { SwContainer } from '@/components/sw/SwLayout';
import { HpContainer } from '@/components/hp/HpLayout';

import { confirmCheckoutBooking } from '@/lib/checkout-api';
import type { Booking } from '@/lib/api';
import BookingQrCard from '@/components/BookingQrCard';
const MAX_GUESTS = 12;

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
  theme: CheckoutTheme;
};

export default function CheckoutWizard({ park, tickets, theme }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const ticketParam = params.get('ticket') ?? tickets[0]?.id ?? '';
  const visitDate = params.get('date') ?? '';
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

  const changeGuests = (delta: number) => {
    setGuestCount((n) => Math.min(MAX_GUESTS, Math.max(1, n + delta)));
  };

  const checkoutQuery = (ticketId: string) => {
    const q = new URLSearchParams({ ticket: ticketId, guests: String(guestCount) });
    if (visitDate) q.set('date', visitDate);
    return `/checkout/${park.slug}?${q}`;
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

  const isUniverse = !!theme.universeTheme;
  const stepBtnClass = isUniverse
    ? 'w-11 h-11 rounded-xl border border-white/20 text-lg font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#c9922a]/50 hover:text-[#c9922a] transition'
    : 'w-11 h-11 rounded-xl border border-brand-border text-lg font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:border-brand-accent transition';

  const guestStepper = (
    <div>
      <label className="text-sm font-medium block mb-2" style={{ color: theme.muted }}>
        Количество гостей
      </label>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => changeGuests(-1)}
          disabled={guestCount <= 1}
          aria-label="Меньше гостей"
          className={stepBtnClass}
          style={{ color: theme.text }}
        >
          −
        </button>
        <div
          className={`flex-1 text-center py-3 rounded-xl border tabular-nums ${
            isUniverse ? 'border-white/10' : 'border-brand-border'
          }`}
          style={{ backgroundColor: isUniverse ? theme.bg : theme.surface, color: theme.text }}
        >
          <span className="text-2xl font-bold">{guestCount}</span>
          <span className="block text-xs mt-0.5" style={{ color: theme.muted }}>
            {guestLabel(guestCount)}
          </span>
        </div>
        <button
          type="button"
          onClick={() => changeGuests(1)}
          disabled={guestCount >= MAX_GUESTS}
          aria-label="Больше гостей"
          className={stepBtnClass}
          style={{ color: theme.text }}
        >
          +
        </button>
      </div>
      <p className="text-xs mt-2" style={{ color: theme.muted }}>
        от 1 до {MAX_GUESTS} · {unit} € за билет
      </p>
    </div>
  );

  const inner = (
    <div className={isUniverse ? '' : 'max-w-4xl mx-auto w-full px-6 pt-24 pb-10 md:pt-28 md:pb-14'}>
      <div className="mb-10 md:mb-14">
        <p className="text-xs font-bold uppercase tracking-[0.25em] mb-2" style={{ color: theme.accent }}>
          {theme.pageSubtitle}
        </p>
        <h1 className="font-display text-3xl md:text-4xl font-bold" style={{ color: theme.text }}>
          {theme.pageTitle}
        </h1>
        <p className="mt-2 text-sm" style={{ color: theme.muted }}>
          {park.name}
        </p>
      </div>

      {done && completedBooking ? (
        <div className={theme.card + ' max-w-lg mx-auto text-center'}>
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-6"
            style={{ backgroundColor: `${theme.accent}22`, color: theme.accent }}
          >
            ✓
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: theme.text }}>
            {theme.successTitle}
          </h2>
          <p className="mb-6 text-sm" style={{ color: theme.muted }}>
            Билеты отправлены на {email || 'ваш email'}
          </p>
          <BookingQrCard
            booking={completedBooking}
            accent={theme.accent}
            textColor={theme.text}
            mutedColor={theme.muted}
            className="mb-6"
          />
          <Link href={theme.successCtaHref} className={theme.btnPrimary + ' inline-block text-center'}>
            {theme.successCta}
          </Link>
        </div>
      ) : done ? null : (
        <div className="grid lg:grid-cols-3 gap-8 mt-2 md:mt-4">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex gap-2 max-w-xl">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-1 flex-1 rounded-full ${step >= s ? theme.stepActive : theme.stepInactive}`}
                />
              ))}
            </div>

            {step === 1 && (
              <div className={theme.card + ' space-y-4'}>
                <h2 className="text-xl font-bold" style={{ color: theme.text }}>
                  Данные гостя
                </h2>
                <div>
                  <label className="text-sm font-medium block mb-1" style={{ color: theme.muted }}>
                    Имя
                  </label>
                  <input
                    className={theme.input}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Иван Иванов"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1" style={{ color: theme.muted }}>
                    Email
                  </label>
                  <input
                    type="email"
                    className={theme.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                  />
                </div>
                {guestStepper}
                <div
                  className="flex items-center justify-between rounded-xl px-4 py-3 border border-white/10"
                  style={
                    isUniverse ? { backgroundColor: `${theme.accent}14` } : undefined
                  }
                >
                  <span className="text-sm" style={{ color: theme.muted }}>
                    {selectedTicket?.name ?? 'Standard'} · {guestLabel(guestCount)}
                  </span>
                  <span className="text-lg font-bold tabular-nums" style={{ color: theme.accent }}>
                    {price} €
                  </span>
                </div>
                <button type="button" onClick={() => setStep(2)} className={theme.btnPrimary}>
                  Далее
                </button>
              </div>
            )}

            {step === 2 && (
              <div className={theme.card + ' space-y-4'}>
                <h2 className="text-xl font-bold" style={{ color: theme.text }}>
                  Оплата (демо)
                </h2>
                <input className={theme.input} placeholder="Номер карты 4242 4242 4242 4242" />
                <div className="grid grid-cols-2 gap-4">
                  <input className={theme.input} placeholder="MM/YY" />
                  <input className={theme.input} placeholder="CVC" />
                </div>
                <p className="text-xs" style={{ color: theme.muted }}>
                  Имитация оплаты для дипломного проекта
                </p>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)} className={theme.btnGhost}>
                    Назад
                  </button>
                  <button type="button" onClick={() => setStep(3)} className={theme.btnPrimary}>
                    Далее
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className={theme.card + ' space-y-4'}>
                <h2 className="text-xl font-bold" style={{ color: theme.text }}>
                  Подтверждение
                </h2>
                <p className="text-sm" style={{ color: theme.muted }}>
                  {park.name} · {selectedTicket?.name ?? 'Standard'} · {guestLabel(guestCount)}
                  {visitDate ? ` · ${visitDate}` : ''}
                </p>
                {payError && <p className="text-red-500 text-sm">{payError}</p>}
                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(2)} className={theme.btnGhost}>
                    Назад
                  </button>
                  <button type="button" onClick={confirmPayment} className={theme.btnPrimary}>
                    Оплатить {price} €
                  </button>
                </div>
              </div>
            )}
          </div>

          <aside className={theme.card + ' h-fit lg:sticky lg:top-24'}>
            <div className="relative h-32 rounded-xl overflow-hidden mb-4 border border-white/10">
              <Image src={park.coverImage} alt={park.name} fill className="object-cover" sizes="400px" />
              <div
                className="absolute inset-0 bg-gradient-to-t to-transparent"
                style={{ backgroundImage: `linear-gradient(to top, ${theme.bg}, transparent)` }}
              />
            </div>
            <h3 className="font-bold mb-1" style={{ color: theme.text }}>
              Ваш заказ
            </h3>
            <p className="text-sm" style={{ color: theme.muted }}>
              {selectedTicket?.name ?? 'Standard'}
            </p>

            <div className="mt-4">{guestStepper}</div>

            <hr className="my-4" style={{ borderColor: theme.border }} />
            <div className="flex justify-between text-sm">
              <span style={{ color: theme.muted }}>Билеты</span>
              <span style={{ color: theme.text }} className="tabular-nums">
                {unit} € × {guestCount}
              </span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span style={{ color: theme.muted }}>Сервисный сбор</span>
              <span style={{ color: theme.text }}>0 €</span>
            </div>
            <p className="text-xs mt-2" style={{ color: theme.accent }}>
              Без скрытых сборов
            </p>
            <hr className="my-4" style={{ borderColor: theme.border }} />
            <div className="flex justify-between font-bold text-lg">
              <span style={{ color: theme.text }}>Итого</span>
              <span className="tabular-nums" style={{ color: theme.accent }}>
                {price} €
              </span>
            </div>
            {tickets.length > 1 && (
              <div className="mt-6 pt-4 border-t border-white/10">
                <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: theme.muted }}>
                  Тариф
                </p>
                <div className="flex flex-wrap gap-2">
                  {tickets.map((t) => (
                    <Link
                      key={t.id}
                      href={checkoutQuery(t.id)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition ${
                        t.id === selectedTicket?.id
                          ? 'text-[#0a0806]'
                          : 'border border-white/20 text-stone-400'
                      }`}
                      style={
                        t.id === selectedTicket?.id
                          ? { backgroundColor: theme.accent }
                          : undefined
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
      )}
    </div>
  );

  if (theme.universeTheme === 'star-wars') {
    return (
      <main className="min-h-screen" style={{ backgroundColor: theme.bg }}>
        <StarCosmos>
          <SwContainer className="pt-24 pb-10 md:pt-28 md:pb-14">{inner}</SwContainer>
        </StarCosmos>
      </main>
    );
  }

  if (theme.universeTheme === 'harry-potter') {
    return (
      <main className="min-h-screen" style={{ backgroundColor: theme.bg }}>
        <HpCosmos>
          <HpContainer className="pt-24 pb-10 md:pt-28 md:pb-14">{inner}</HpContainer>
        </HpCosmos>
      </main>
    );
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: theme.bg }}>
      {inner}
    </main>
  );
}
