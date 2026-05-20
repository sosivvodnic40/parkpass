import Link from 'next/link';

const stats = [
  { label: 'Бронирования', value: '1 284', change: '+12%' },
  { label: 'Выручка', value: '€ 142 500', change: '+8%' },
  { label: 'Пользователи', value: '3 420', change: '+24%' },
  { label: 'Парки', value: '3', change: 'активных' },
];

export default function AdminPage() {
  return (
    <main className="py-12 px-6 bg-brand-bg min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-brand-navy">Админ-панель</h1>
          <Link href="/" className="text-sm text-brand-accent hover:underline">← На сайт</Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((s) => (
            <div key={s.label} className="card p-5">
              <p className="text-sm text-brand-muted">{s.label}</p>
              <p className="text-2xl font-bold text-brand-navy mt-1">{s.value}</p>
              <p className="text-xs text-green-600 mt-1">{s.change}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card p-6">
            <h2 className="font-bold text-brand-navy mb-4">Управление</h2>
            <ul className="space-y-2 text-sm text-brand-muted">
              <li className="flex justify-between py-2 border-b border-brand-border">
                <span>Парки</span>
                <span className="text-brand-accent">CRUD →</span>
              </li>
              <li className="flex justify-between py-2 border-b border-brand-border">
                <span>Билеты и тарифы</span>
                <span className="text-brand-accent">→</span>
              </li>
              <li className="flex justify-between py-2 border-b border-brand-border">
                <span>Бронирования</span>
                <span className="text-brand-accent">→</span>
              </li>
              <li className="flex justify-between py-2">
                <span>Отзывы (модерация)</span>
                <span className="text-brand-accent">→</span>
              </li>
            </ul>
          </div>
          <div className="card p-6">
            <h2 className="font-bold text-brand-navy mb-4">Демо-режим</h2>
            <p className="text-sm text-brand-muted leading-relaxed">
              Полная админка с PostgreSQL и JWT-ролями описана в docs/CONCEPT.md.
              Эта страница — UI-прототип для дипломной презентации.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
