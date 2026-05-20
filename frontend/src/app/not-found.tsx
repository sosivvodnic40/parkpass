import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <p className="text-6xl font-bold text-brand-accent/30">404</p>
      <h1 className="text-2xl font-bold text-brand-navy mt-4">Страница не найдена</h1>
      <p className="text-brand-muted mt-2 mb-8">Возможно, парк переехал или ссылка устарела</p>
      <Link href="/parks" className="btn-primary">К каталогу парков</Link>
    </main>
  );
}
