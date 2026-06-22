/** Jurassic World — картинки из Figma Make (emit-raster-59598005.figma.site) → /public/jurassic */

const jp = (file: string) => `/jurassic/${file}`;

export const JP_PARK_SLUG = 'jurassic-islands-orlando';

export const jpColors = {
  green: '#22c55e',
  greenLight: '#4ade80',
  greenDark: '#16a34a',
  amber: '#d97706',
  amberLight: '#f59e0b',
  bg: '#0a120c',
  surface: '#142018',
  surfaceDeep: '#0c1810',
  text: '#ecfdf5',
  textMuted: 'rgba(236,253,245,0.5)',
  highlightFrom: '#1a2e18',
  highlightTo: '#0c1408',
} as const;

export const jpGallery = [
  {
    src: jp('gallery-main.jpg'),
    alt: 'Врата Jurassic World',
    badge: '✦ JURASSIC WORLD',
    title: 'Мир преистории',
    subtitle:
      'Врата острова Нублар, долина динозавров и легендарные аттракционы — полное погружение.',
    large: true,
  },
  {
    src: jp('gallery-isla.jpg'),
    alt: 'Isla Nublar',
    label: 'Isla Nublar · Islands of Adventure',
  },
  {
    src: jp('gallery-raptor.jpg'),
    alt: 'VelociCoaster',
    label: 'VelociCoaster · экстрим',
  },
] as const;

export const jpHeroDino = jp('hero.jpg');

export const jpExperiences = [
  {
    id: 1,
    title: 'VelociCoaster',
    subtitle:
      'Разгон до 130 км/ч мимо стаи рапторов — одна из самых экстремальных горок мира.',
    img: jp('experience-veloci.jpg'),
    duration: '5 мин',
    zone: 'Raptor Paddock',
  },
  {
    id: 2,
    title: 'River Adventure',
    subtitle: 'Спуск по реке среди гигантских динозавров и схватка с индоминусом.',
    img: jp('experience-river.jpg'),
    duration: '6 мин',
    zone: 'Isla Nublar',
  },
  {
    id: 3,
    title: 'Raptor Encounter',
    subtitle: 'Встреча с обученными рапторами Blue и Delta в Discovery Center.',
    img: jp('experience-raptor.jpg'),
    duration: '15 мин',
    zone: 'Discovery Center',
  },
  {
    id: 4,
    title: 'Camp Cretaceous',
    subtitle: 'Интерактивная зона для юных палеонтологов с аниматронными динозаврами.',
    img: jp('experience-camp.jpg'),
    duration: '4 мин',
    zone: 'Youth Camp',
  },
] as const;

export const jpFooterLinks = [
  'Jurassic World',
  'О вселенной',
  'Все аттракционы',
  'Другие парки',
] as const;

export const jpFooterThumb = jp('footer-thumb.jpg');
