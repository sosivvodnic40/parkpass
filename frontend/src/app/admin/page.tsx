import Link from 'next/link';
import AdminDashboard from '@/components/AdminDashboard';

export default function AdminPage() {
  return (
    <main className="py-12 px-6 bg-brand-bg min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-brand-navy">Админ-панель</h1>
            <p className="text-brand-muted text-sm mt-1">
              Управление бронированиями, отзывами и пользователями
            </p>
          </div>
          <Link href="/" className="text-sm text-brand-accent hover:underline">
            ← На сайт
          </Link>
        </div>

        <AdminDashboard />

        <p className="text-xs text-brand-muted mt-8">
          Вход: admin@parkpass.ru / admin123 · manager@parkpass.ru / manager123
        </p>
      </div>
    </main>
  );
}
