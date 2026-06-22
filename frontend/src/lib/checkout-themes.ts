export type CheckoutTheme = {
  id: string;
  pageTitle: string;
  pageSubtitle: string;
  successTitle: string;
  successCta: string;
  successCtaHref: string;
  bg: string;
  surface: string;
  accent: string;
  accentHover: string;
  text: string;
  muted: string;
  border: string;
  card: string;
  input: string;
  stepActive: string;
  stepInactive: string;
  btnPrimary: string;
  btnGhost: string;
  universeTheme?: 'star-wars' | 'harry-potter';
};

const starWars: CheckoutTheme = {
  id: 'star-wars',
  pageTitle: 'Бронирование',
  pageSubtitle: "Galaxy's Edge · Black Spire Outpost",
  successTitle: 'Путь открыт!',
  successCta: 'Вернуться на Батуу',
  successCtaHref: '/worlds/star-wars',
  bg: '#050508',
  surface: '#0c0c14',
  accent: '#FFE81F',
  accentHover: '#fff176',
  text: '#f5f5f4',
  muted: '#a8a29e',
  border: 'rgba(255,255,255,0.1)',
  card: 'rounded-2xl border border-white/10 bg-[#0c0c14]/95 p-6 md:p-8',
  input:
    'w-full rounded-xl border border-white/15 bg-[#050508] px-4 py-3 text-white placeholder:text-stone-600 focus:outline-none focus:border-[#FFE81F]/50',
  stepActive: 'bg-[#FFE81F]',
  stepInactive: 'bg-white/10',
  btnPrimary:
    'w-full py-3.5 rounded-xl font-bold text-[#050508] bg-[#FFE81F] hover:bg-[#fff176] transition shadow-none',
  btnGhost:
    'flex-1 py-3.5 rounded-xl font-bold border border-white/25 text-white hover:border-[#FFE81F]/40 hover:text-[#FFE81F] transition',
  universeTheme: 'star-wars',
};

const harryPotter: CheckoutTheme = {
  id: 'harry-potter',
  pageTitle: 'Бронирование',
  pageSubtitle: 'Хогсмид · The Wizarding World',
  successTitle: 'Добро пожаловать в Хогвартс!',
  successCta: 'Вернуться в Хогсмид',
  successCtaHref: '/worlds/harry-potter',
  bg: '#0b0d14',
  surface: '#13172a',
  accent: '#c9922a',
  accentHover: '#e8b84b',
  text: '#f0e8d8',
  muted: 'rgba(240,232,216,0.55)',
  border: 'rgba(201,146,42,0.15)',
  card: 'rounded-2xl border border-[#c9922a]/15 bg-[#13172a]/95 p-6 md:p-8',
  input:
    'w-full rounded-xl border border-white/15 bg-[#0b0d14] px-4 py-3 text-[#f0e8d8] placeholder:text-stone-600 focus:outline-none focus:border-[#c9922a]/50',
  stepActive: 'bg-[#c9922a]',
  stepInactive: 'bg-white/10',
  btnPrimary:
    'w-full py-3.5 rounded-xl font-bold text-[#1a0e00] bg-gradient-to-br from-[#e8b84b] to-[#c9922a] hover:opacity-90 transition shadow-none',
  btnGhost:
    'flex-1 py-3.5 rounded-xl font-bold border border-[#c9922a]/30 text-[#f0e8d8] hover:border-[#c9922a]/50 transition',
  universeTheme: 'harry-potter',
};

const defaultTheme = (accent: string, secondary: string): CheckoutTheme => ({
  id: 'default',
  pageTitle: 'Оформление бронирования',
  pageSubtitle: 'Без скрытых сборов · QR после оплаты',
  successTitle: 'Бронирование подтверждено!',
  successCta: 'К каталогу парков',
  successCtaHref: '/parks',
  bg: secondary,
  surface: '#ffffff',
  accent,
  accentHover: accent,
  text: '#1e293b',
  muted: '#64748b',
  border: '#e2e8f0',
  card: 'card p-6',
  input: 'input-field',
  stepActive: 'bg-brand-accent',
  stepInactive: 'bg-brand-border',
  btnPrimary: 'btn-primary flex-1',
  btnGhost:
    'flex-1 py-3 rounded-xl font-semibold border border-brand-border text-brand-navy hover:bg-white transition',
});

export function getCheckoutTheme(category: string, parkTheme?: { primaryColor: string; secondaryColor: string }): CheckoutTheme {
  if (category === 'star-wars') return starWars;
  if (category === 'harry-potter') return harryPotter;
  return defaultTheme(
    parkTheme?.primaryColor ?? '#2563eb',
    parkTheme?.secondaryColor ?? '#f8fafc',
  );
}
