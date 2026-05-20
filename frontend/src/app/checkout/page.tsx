'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

const parkNames: Record<string, string> = {
  'magic-kingdom': 'Magic Kingdom',
  'disneyland-california': 'Disneyland California',
  'disneyland-paris': 'Disneyland Paris',
  'walt-disney-world': 'Walt Disney World',
  'tokyo-disneyland': 'Tokyo Disney Resort',
  'hong-kong-disneyland': 'Hong Kong Disneyland',
  'star-wars-galaxys-edge': "Star Wars: Galaxy's Edge",
  'universal-epic-universe': 'Universal Epic Universe',
  'ferrari-world-abu-dhabi': 'Ferrari World Abu Dhabi',
};

const parkPrices: Record<string, number> = {
  'magic-kingdom': 109,
  'disneyland-california': 124,
  'disneyland-paris': 99,
  'walt-disney-world': 129,
  'tokyo-disneyland': 74,
  'hong-kong-disneyland': 69,
  'star-wars-galaxys-edge': 139,
  'universal-epic-universe': 119,
  'ferrari-world-abu-dhabi': 95,
};

function CheckoutForm() {
  const params = useSearchParams();
  const parkSlug = params.get('park') ?? '';
  const guests = Number(params.get('guests') ?? 2);
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const parkName = parkNames[parkSlug] ?? 'Парк';
  const unit = parkPrices[parkSlug] ?? 109;
  const price = unit * guests;

  const confirmPayment = async () => {
    await fetch(`${API}/api/v1/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        parkSlug,
        parkName,
        guests,
        totalAmount: price,
      }),
    }).catch(() => null);
    setDone(true);
  };

  if (done) {
    return (
      <div className="card p-12 text-center max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-3xl mx-auto mb-6">
          ✓
        </div>
        <h1 className="text-2xl font-bold text-brand-navy mb-2">Бронирование подтверждено!</h1>
        <p className="text-brand-muted mb-6">
          Билеты отправлены на {email || 'ваш email'}
        </p>
        <Link href="/parks" className="btn-primary">
          К каталогу парков
        </Link>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        {/* Progress */}
        <div className="flex gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full ${step >= s ? 'bg-brand-accent' : 'bg-brand-border'}`}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="card p-6 space-y-4">
            <h2 className="text-xl font-bold text-brand-navy">Данные гостя</h2>
            <div>
              <label className="text-sm font-medium text-brand-muted block mb-1">Имя</label>
              <input
                className="input-field"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Иван Иванов"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-brand-muted block mb-1">Email</label>
              <input
                type="email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
              />
            </div>
            <button type="button" onClick={() => setStep(2)} className="btn-primary w-full">
              Далее
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="card p-6 space-y-4">
            <h2 className="text-xl font-bold text-brand-navy">Оплата (демо)</h2>
            <input className="input-field" placeholder="Номер карты 4242 4242 4242 4242" />
            <div className="grid grid-cols-2 gap-4">
              <input className="input-field" placeholder="MM/YY" />
              <input className="input-field" placeholder="CVC" />
            </div>
            <p className="text-xs text-brand-muted">Имитация оплаты для дипломного проекта</p>
            <button type="button" onClick={() => setStep(3)} className="btn-primary w-full">
              Далее
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="card p-6 space-y-4">
            <h2 className="text-xl font-bold text-brand-navy">Подтверждение</h2>
            <p className="text-brand-muted">
              Проверьте данные и подтвердите бронирование в {parkName} для {guests} гостей.
            </p>
            <button type="button" onClick={confirmPayment} className="btn-primary w-full">
              Оплатить {price} €
            </button>
          </div>
        )}
      </div>

      {/* Summary */}
      <aside className="card p-6 h-fit sticky top-24">
        <h3 className="font-bold text-brand-navy mb-4">Ваш заказ</h3>
        <p className="font-semibold">{parkName}</p>
        <p className="text-sm text-brand-muted mt-1">{guests} гостей · Standard</p>
        <hr className="my-4 border-brand-border" />
        <div className="flex justify-between text-sm">
          <span className="text-brand-muted">Билеты</span>
          <span>{price} €</span>
        </div>
        <div className="flex justify-between text-sm mt-2">
          <span className="text-brand-muted">Сервисный сбор</span>
          <span>0 €</span>
        </div>
        <p className="text-xs text-green-600 mt-2">Без скрытых сборов</p>
        <hr className="my-4 border-brand-border" />
        <div className="flex justify-between font-bold text-lg">
          <span>Итого</span>
          <span className="tabular-nums">{price} €</span>
        </div>
      </aside>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <main className="py-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-brand-navy mb-8">Оформление бронирования</h1>
        <Suspense fallback={<p className="text-brand-muted">Загрузка...</p>}>
          <CheckoutForm />
        </Suspense>
      </div>
    </main>
  );
}
