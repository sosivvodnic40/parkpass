import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#F8F7F4',
          surface: '#FFFFFF',
          text: '#1C1917',
          muted: '#57534E',
          border: '#E7E5E4',
          accent: '#E85D04',
          'accent-hover': '#C2410C',
          navy: '#1E3A5F',
        },
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,.08), 0 8px 24px rgba(0,0,0,.06)',
        'card-hover': '0 4px 12px rgba(0,0,0,.1), 0 12px 32px rgba(0,0,0,.08)',
        search: '0 8px 32px rgba(0,0,0,.12)',
      },
    },
  },
  plugins: [],
};

export default config;
