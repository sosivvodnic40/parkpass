/** Каталог парков — единый источник для seed и mock-режима */

const pic = (seed: string, w = 1400) => `https://picsum.photos/seed/${seed}/${w}/900`;

export type CatalogPark = {
  legacyId: string;
  slug: string;
  name: string;
  description: string;
  city: string;
  country: string;
  region: string;
  ratingAvg: number;
  reviewCount: number;
  priceFrom: number;
  coverImage: string;
  category: string;
  brand: string;
  badge: string | null;
  isFeatured: boolean;
  theme: { primaryColor: string; secondaryColor: string };
  openingHours: Record<string, string>;
  zones: number;
};

export type CatalogAttraction = {
  code: string;
  name: string;
  category: string;
  wait: number;
  img: string;
};

export type CatalogTicket = {
  code: string;
  name: string;
  price: number;
  features: string[];
};

export const catalogParks: CatalogPark[] = [
  {
    legacyId: 'sw1',
    slug: 'star-wars-galaxys-edge',
    name: "Star Wars: Galaxy's Edge",
    description:
      "Планета Батуус: Millennium Falcon, Rise of the Resistance, Oga's Cantina и мастерская световых мечей.",
    city: 'Orlando & Anaheim',
    country: 'USA',
    region: 'Hollywood Studios / Disneyland',
    ratingAvg: 4.95,
    reviewCount: 31200,
    priceFrom: 139,
    coverImage: '/star-wars/hero-mando.png',
    category: 'star-wars',
    brand: 'universal',
    badge: 'Must-see',
    isFeatured: true,
    theme: { primaryColor: '#FFE81F', secondaryColor: '#1a1a2e' },
    openingHours: { mon: '09:00-21:00' },
    zones: 2,
  },
  {
    legacyId: 'hp1',
    slug: 'harry-potter-hogsmeade-orlando',
    name: 'The Wizarding World — Hogsmeade',
    description:
      'Замок Хогвартс, деревня Хогсмид и поезд «Хогвартс-Экспресс» — флагманский мир волшебства Universal Orlando.',
    city: 'Orlando',
    country: 'USA',
    region: 'Universal Islands of Adventure, Florida',
    ratingAvg: 4.97,
    reviewCount: 28400,
    priceFrom: 139,
    coverImage: pic('harry-potter-hogsmeade-orlando'),
    category: 'harry-potter',
    brand: 'universal',
    badge: 'Хит',
    isFeatured: true,
    theme: { primaryColor: '#7C2D12', secondaryColor: '#FBBF24' },
    openingHours: { mon: '09:00-21:00' },
    zones: 4,
  },
  {
    legacyId: 'mv1',
    slug: 'marvel-avengers-california',
    name: 'Avengers Campus',
    description:
      'Башня Мстителей, WEB-штаб и встречи с героями — станьте частью команды в Disney California Adventure.',
    city: 'Anaheim',
    country: 'USA',
    region: 'Disney California Adventure',
    ratingAvg: 4.95,
    reviewCount: 32100,
    priceFrom: 149,
    coverImage: '/marvel/gallery-main.png',
    category: 'marvel',
    brand: 'disney',
    badge: 'Marvel',
    isFeatured: true,
    theme: { primaryColor: '#E23636', secondaryColor: '#0476D0' },
    openingHours: { mon: '08:00-22:00' },
    zones: 5,
  },
  {
    legacyId: 'jp1',
    slug: 'jurassic-islands-orlando',
    name: 'Jurassic World — Islands of Adventure',
    description:
      'Врата острова Нублар, долина динозавров и VelociCoaster — одна из самых экстремальных зон Universal.',
    city: 'Orlando',
    country: 'USA',
    region: 'Universal Islands of Adventure, Florida',
    ratingAvg: 4.93,
    reviewCount: 28500,
    priceFrom: 119,
    coverImage: '/jurassic/gallery-main.jpg',
    category: 'jurassic',
    brand: 'universal',
    badge: 'Jurassic',
    isFeatured: true,
    theme: { primaryColor: '#22C55E', secondaryColor: '#D97706' },
    openingHours: { mon: '09:00-21:00' },
    zones: 4,
  },
];

export const catalogAttractions: Record<string, CatalogAttraction[]> = {
  'star-wars-galaxys-edge': [
    { code: 'sw1', name: 'Millennium Falcon: Smugglers Run', category: 'Пилотирование', wait: 65, img: '/star-wars/image_fc20bfb1.jpeg' },
    { code: 'sw2', name: 'Star Wars: Rise of the Resistance', category: 'Эпик', wait: 95, img: '/star-wars/resistance-supply-helmet-16x9.avif' },
    { code: 'sw3', name: "Oga's Cantina", category: 'Шоу', wait: 30, img: '/star-wars/4027219_0514ZR_4832MS_aRGB_R3R-16x9.avif' },
  ],
  'harry-potter-hogsmeade-orlando': [
    { code: 'hp-a1', name: 'Harry Potter and the Forbidden Journey', category: 'Эпик', wait: 80, img: pic('attr-hp-a1', 800) },
    { code: 'hp-a2', name: "Hagrid's Magical Creatures", category: 'Семейный', wait: 55, img: pic('attr-hp-a2', 800) },
    { code: 'hp-a3', name: 'Hogwarts Express', category: 'Транспорт', wait: 25, img: pic('attr-hp-a3', 800) },
  ],
  'marvel-avengers-california': [
    { code: 'mv-a1', name: 'Полёт с Железным Человеком', category: 'Stark Industries', wait: 50, img: '/marvel/experience-iron-man.avif' },
    { code: 'mv-a2', name: 'Миссия Мстителей', category: 'Avengers Tower', wait: 65, img: '/marvel/experience-avengers.jpg' },
    { code: 'mv-a3', name: 'WEB Slingers', category: 'WEB Campus', wait: 45, img: '/marvel/experience-web.webp' },
  ],
  'jurassic-islands-orlando': [
    { code: 'jp-a1', name: 'VelociCoaster', category: 'Raptor Paddock', wait: 90, img: '/jurassic/experience-veloci.jpg' },
    { code: 'jp-a2', name: 'River Adventure', category: 'Isla Nublar', wait: 50, img: '/jurassic/experience-river.jpg' },
    { code: 'jp-a3', name: 'Raptor Encounter', category: 'Discovery Center', wait: 35, img: '/jurassic/experience-raptor.jpg' },
  ],
};

function defaultTickets(priceFrom: number): CatalogTicket[] {
  return [
    { code: 't1', name: 'Standard', price: priceFrom, features: ['1 день', 'Все зоны', 'QR-билет'] },
    { code: 't2', name: 'Express', price: Math.round(priceFrom * 1.4), features: ['Приоритетные очереди', '1 день'] },
    { code: 't3', name: 'VIP', price: Math.round(priceFrom * 2), features: ['VIP-вход', 'Express', 'Бонусы'] },
  ];
}

export const catalogTickets: Record<string, CatalogTicket[]> = {};
for (const p of catalogParks) {
  catalogTickets[p.slug] = defaultTickets(p.priceFrom);
}

catalogTickets['harry-potter-hogsmeade-orlando'] = [
  { code: 't1', name: 'Standard', price: 139, features: ['1 день', 'Все зоны', 'QR-билет'] },
  { code: 't2', name: 'Express', price: 195, features: ['Приоритетные очереди', '1 день', 'Доступ к Экспрессу'] },
  { code: 't3', name: 'VIP', price: 278, features: ['VIP-вход', 'Express', 'Бонусы и сувениры'] },
];

catalogTickets['jurassic-islands-orlando'] = [
  { code: 't1', name: 'Standard', price: 119, features: ['1 день', 'Все зоны', 'QR-билет'] },
  { code: 't2', name: 'Explorer Pass', price: 169, features: ['Приоритетные очереди', '1 день', 'VelociCoaster Express'] },
  { code: 't3', name: 'VIP Safari', price: 249, features: ['VIP-вход', 'Explorer Pass', 'Эксклюзивный мерч'] },
];

catalogTickets['marvel-avengers-california'] = [
  { code: 't1', name: 'Standard', price: 149, features: ['1 день', 'Все зоны', 'QR-билет'] },
  { code: 't2', name: 'Hero Pass', price: 209, features: ['Приоритетные очереди', '1 день', 'Встреча с героями'] },
  { code: 't3', name: 'VIP Avenger', price: 299, features: ['VIP-вход', 'Hero Pass', 'Эксклюзивные сувениры'] },
];

export const catalogCategories = [
  { id: 'star-wars', name: 'Star Wars', count: 1, image: '/star-wars/hero-mando.png' },
  { id: 'harry-potter', name: 'Harry Potter', count: 1, image: pic('cat-harry-potter', 600) },
  { id: 'marvel', name: 'Marvel', count: 1, image: pic('cat-marvel', 600) },
  { id: 'jurassic', name: 'Jurassic World', count: 1, image: pic('cat-jurassic', 600) },
];

/** Актуальные категории — всё остальное считается удалённым */
export const ALLOWED_CATEGORIES = catalogCategories.map((c) => c.id);

/** Slug'и парков, которые нужно удалить из БД при старте */
export const REMOVED_PARK_SLUGS = [
  'nintendo-world-osaka',
  'avatar-pandora-orlando',
  'cars-land-california',
  'toy-story-orlando',
] as const;
