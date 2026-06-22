/** Ассеты Marvel — /public/marvel (из папки worlds/marvel/marvel img) */

const mv = (file: string) => `/marvel/${file}`;

export const MV_PARK_SLUG = 'marvel-avengers-california';

export const mvColors = {
  red: '#e23636',
  redLight: '#ff4d4d',
  blue: '#0476d0',
  blueLight: '#3b82f6',
  gold: '#ffd700',
  bg: '#0a0e1a',
  surface: '#151b2e',
  surfaceDeep: '#0d1424',
  text: '#f0f4f8',
  textMuted: 'rgba(240,244,248,0.45)',
  highlightFrom: '#1c2030',
  highlightTo: '#100d20',
} as const;

export const mvGallery = [
  {
    src: mv('gallery-main.png'),
    alt: 'Avengers Campus — штаб и Quinjet',
    badge: '★ AVENGERS CAMPUS',
    title: 'Вселенная героев',
    subtitle:
      'Башня Мстителей, WEB-штаб и тренировочная арена — станьте частью команды.',
    large: true,
  },
  {
    src: mv('gallery-campus.jpg'),
    alt: 'Guardians of the Galaxy — Avengers Campus',
    label: 'Avengers Campus · Disneyland',
  },
  {
    src: mv('gallery-meeting.jpg'),
    alt: 'Встреча с героями Marvel',
    label: 'Встреча с героями',
  },
] as const;

export const mvHeroCharacter = mv('hero.jpg');

export const mvExperiences = [
  {
    id: 1,
    title: 'Полёт с Железным Человеком',
    subtitle:
      'Наденьте костюм Mark 85 и взлетите над Манхэттеном в битве против Таноса.',
    img: mv('experience-iron-man.avif'),
    duration: '4 мин',
    zone: 'Stark Industries',
  },
  {
    id: 2,
    title: 'Миссия Мстителей',
    subtitle:
      'Присоединитесь к Капитану Америка и остановите вторжение Читаури.',
    img: mv('experience-avengers.jpg'),
    duration: '6 мин',
    zone: 'Avengers Tower',
  },
  {
    id: 3,
    title: 'Путешествие в Ваканду',
    subtitle: 'Исследуйте технологии вибраниума с Чёрной Пантерой.',
    img: mv('experience-wakanda.webp'),
    duration: '5 мин',
    zone: 'Wakanda',
  },
  {
    id: 4,
    title: 'WEB Slingers',
    subtitle:
      'Помогите Человеку-Пауку поймать вышедших из-под контроля роботов-пауков.',
    img: mv('experience-web.webp'),
    duration: '4 мин',
    zone: 'WEB Campus',
  },
] as const;

export const mvFooterLinks = [
  'Avengers Campus',
  'О вселенной',
  'Все аттракционы',
  'Другие парки',
] as const;

export const mvFooterThumb = mv('footer-thumb.png');
