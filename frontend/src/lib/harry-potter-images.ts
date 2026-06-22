/** Ассеты и контент — как в Figma Make (emit-raster-59598005.figma.site) */

export const HP_PARK_SLUG = 'harry-potter-hogsmeade-orlando';

export const hpColors = {
  gold: '#c9922a',
  goldLight: '#e8b84b',
  bg: '#0b0d14',
  surface: '#13172a',
  surfaceDeep: '#0f1220',
  text: '#f0e8d8',
  textMuted: 'rgba(240, 232, 216, 0.45)',
  purple: '#6a3fa0',
  highlightFrom: '#1c1530',
  highlightTo: '#100d20',
} as const;

export const hpGallery = [
  {
    src: 'https://images.unsplash.com/photo-1742322276273-749b62e782c0?w=900&h=600&fit=crop&auto=format',
    alt: 'Замок Хогвартс',
    badge: '✦ ХОГСМИД',
    title: 'Замок Хогвартс',
    subtitle:
      'Каменные шпили, летящие призраки и арена Квиддич — полное погружение.',
    large: true,
  },
  {
    src: 'https://images.unsplash.com/photo-1618945034890-91dea432cf7a?w=600&h=300&fit=crop&auto=format',
    alt: 'Хогсмид',
    label: 'Хогсмид · Universal Orlando',
  },
  {
    src: 'https://images.unsplash.com/photo-1668711495033-2aceccc63054?w=600&h=300&fit=crop&auto=format',
    alt: 'Ночной замок',
    label: 'Ночной замок',
  },
] as const;

export const hpHeroDragon =
  'https://images.unsplash.com/photo-1765148754574-e1ddd1775935?w=1200&h=900&fit=crop&auto=format';

export const hpExperiences = [
  {
    id: 1,
    title: 'Хогвартс Экспресс',
    subtitle:
      'Пересеките барьер Платформы 9¾ и отправьтесь в волшебное путешествие.',
    img: 'https://images.unsplash.com/photo-1668711495033-2aceccc63054?w=420&h=300&fit=crop&auto=format',
    duration: '20 мин',
    zone: 'Платформа 9¾',
  },
  {
    id: 2,
    title: 'Полёт над Хогвартсом',
    subtitle:
      'Парите над замком рядом с Гарри на метле через Квиддич и дементоров.',
    img: 'https://images.unsplash.com/photo-1635929710899-da06963069bc?w=420&h=300&fit=crop&auto=format',
    duration: '4 мин',
    zone: 'Хогвартс',
  },
  {
    id: 3,
    title: 'Мотоцикл Хагрида',
    subtitle: 'Умчитесь в Запретный лес на зачарованном мотоцикле с коляской.',
    img: 'https://images.unsplash.com/photo-1483982258113-b72862e6cff6?w=420&h=300&fit=crop&auto=format',
    duration: '5 мин',
    zone: 'Запретный лес',
  },
  {
    id: 4,
    title: 'Побег из Гринготтса',
    subtitle:
      'Прорвитесь сквозь огнедышащего дракона в шахтном вагоне Гринготтса.',
    img: 'https://images.unsplash.com/photo-1656878564120-ab988c47f0b5?w=420&h=300&fit=crop&auto=format',
    duration: '4 мин',
    zone: 'Косой переулок',
  },
] as const;

export const hpFooterLinks = ['Хогсмид', 'О вселенной', 'Все аттракционы', 'Другие парки'] as const;

export const hpFooterThumb =
  'https://images.unsplash.com/photo-1618945034890-91dea432cf7a?w=400&h=180&fit=crop&auto=format';
