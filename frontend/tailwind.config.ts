import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#FAF8F5',
          surface: '#FFFFFF',
          text: '#1A1614',
          muted: '#6B6560',
          border: '#E8E4DF',
          accent: '#0D9488',
          'accent-hover': '#0F766E',
          coral: '#F97316',
          navy: '#134E4A',
          gold: '#D97706',
        },
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 2px 8px rgba(26,22,20,.06), 0 12px 40px rgba(26,22,20,.08)',
        'card-hover': '0 8px 24px rgba(26,22,20,.12), 0 20px 48px rgba(13,148,136,.12)',
        search: '0 12px 48px rgba(26,22,20,.14)',
        float: '0 24px 64px rgba(26,22,20,.18)',
      },
      backgroundImage: {
        'hero-mesh':
          'radial-gradient(ellipse 80% 60% at 70% 20%, rgba(13,148,136,.15), transparent), radial-gradient(ellipse 60% 50% at 20% 80%, rgba(249,115,22,.08), transparent)',
      },
    },
  },
  plugins: [],
};

export default config;
