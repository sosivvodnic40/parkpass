import { Router, Request, Response } from 'express';

const router = Router();

export const parks = [
  {
    id: '1',
    slug: 'magic-kingdom',
    name: 'Magic Kingdom',
    description:
      'The most magical place on Earth with enchanting themed lands, parades, and iconic attractions for the whole family.',
    city: 'Orlando',
    country: 'USA',
    region: 'Florida, USA',
    ratingAvg: 4.9,
    reviewCount: 15450,
    priceFrom: 109,
    coverImage:
      'https://images.unsplash.com/photo-1596422846544-e75c642afc16?w=1400&q=85',
    category: 'disney',
    brand: 'disney',
    badge: 'Хит недели',
    isFeatured: true,
    theme: { primaryColor: '#BE185D', secondaryColor: '#FBBF24', particleEffect: 'stars' },
    openingHours: { mon: '09:00-22:00' },
    zones: 6,
  },
  {
    id: '4',
    slug: 'disneyland-california',
    name: 'Disneyland Resort California',
    description:
      'Оригинальный Диснейленд в Анахайме — Sleeping Beauty Castle, Pixar Pier и Galaxy\'s Edge.',
    city: 'Anaheim',
    country: 'USA',
    region: 'California, USA',
    ratingAvg: 4.9,
    reviewCount: 22100,
    priceFrom: 124,
    coverImage:
      'https://images.unsplash.com/photo-1536092029617-efc5efebfcfe?w=1400&q=85',
    category: 'disney',
    brand: 'disney',
    badge: 'Disney',
    isFeatured: true,
    theme: { primaryColor: '#1D4ED8', secondaryColor: '#FBBF24', particleEffect: 'stars' },
    openingHours: { mon: '08:00-23:00' },
    zones: 8,
  },
  {
    id: '5',
    slug: 'disneyland-paris',
    name: 'Disneyland Paris',
    description:
      'Европейская магия Disney: парк Disneyland, Walt Disney Studios и отели на территории курорта.',
    city: 'Marne-la-Vallée',
    country: 'France',
    region: 'Paris, France',
    ratingAvg: 4.8,
    reviewCount: 18700,
    priceFrom: 99,
    coverImage:
      'https://images.unsplash.com/photo-1513885541842-4b030c4d1746?w=1400&q=85',
    category: 'disney',
    brand: 'disney',
    badge: 'Европа',
    isFeatured: true,
    theme: { primaryColor: '#7C3AED', secondaryColor: '#F472B6', particleEffect: 'stars' },
    openingHours: { mon: '09:30-22:00' },
    zones: 7,
  },
  {
    id: '6',
    slug: 'walt-disney-world',
    name: 'Walt Disney World',
    description:
      'Крупнейший Disney-курорт: Magic Kingdom, EPCOT, Hollywood Studios, Animal Kingdom.',
    city: 'Orlando',
    country: 'USA',
    region: 'Florida, USA',
    ratingAvg: 4.9,
    reviewCount: 45200,
    priceFrom: 129,
    coverImage:
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1400&q=85',
    category: 'disney',
    brand: 'disney',
    badge: null,
    isFeatured: false,
    theme: { primaryColor: '#2563EB', secondaryColor: '#FBBF24', particleEffect: 'stars' },
    openingHours: { mon: '09:00-22:00' },
    zones: 4,
  },
  {
    id: '7',
    slug: 'tokyo-disneyland',
    name: 'Tokyo Disney Resort',
    description:
      'Disneyland и DisneySea — уникальные аттракционы, доступные только в Японии.',
    city: 'Urayasu',
    country: 'Japan',
    region: 'Tokyo, Japan',
    ratingAvg: 4.9,
    reviewCount: 19800,
    priceFrom: 74,
    coverImage:
      'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1400&q=85',
    category: 'disney',
    brand: 'disney',
    badge: 'Только в Азии',
    isFeatured: false,
    theme: { primaryColor: '#DB2777', secondaryColor: '#60A5FA', particleEffect: 'stars' },
    openingHours: { mon: '08:00-22:00' },
    zones: 2,
  },
  {
    id: '8',
    slug: 'hong-kong-disneyland',
    name: 'Hong Kong Disneyland',
    description:
      'Волшебный парк с видом на залив, Marvel-зоной и мистическим замком.',
    city: 'Lantau Island',
    country: 'Hong Kong',
    region: 'Hong Kong',
    ratingAvg: 4.7,
    reviewCount: 8900,
    priceFrom: 69,
    coverImage:
      'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?w=1400&q=85',
    category: 'disney',
    brand: 'disney',
    badge: null,
    isFeatured: false,
    theme: { primaryColor: '#0EA5E9', secondaryColor: '#F43F5E', particleEffect: 'stars' },
    openingHours: { mon: '10:00-21:00' },
    zones: 7,
  },
  {
    id: '9',
    slug: 'star-wars-galaxys-edge',
    name: "Star Wars: Galaxy's Edge",
    description:
      'Планета Батуус: пилотируйте Millennium Falcon, сразитесь с Первым орденом в Rise of the Resistance.',
    city: 'Orlando & Anaheim',
    country: 'USA',
    region: 'Hollywood Studios / Disneyland',
    ratingAvg: 4.95,
    reviewCount: 31200,
    priceFrom: 139,
    coverImage:
      'https://images.unsplash.com/photo-1446776811673-644aa332fba8?w=1400&q=90',
    category: 'star-wars',
    brand: 'disney',
    badge: 'Must-see',
    isFeatured: true,
    theme: { primaryColor: '#FFE81F', secondaryColor: '#1a1a2e', particleEffect: 'none' },
    openingHours: { mon: '09:00-21:00' },
    zones: 2,
  },
  {
    id: '2',
    slug: 'universal-epic-universe',
    name: 'Universal Epic Universe',
    description:
      'Experience the most innovative theme park ever built with immersive worlds and cutting-edge attractions.',
    city: 'Orlando',
    country: 'USA',
    region: 'Florida, USA',
    ratingAvg: 4.8,
    reviewCount: 9200,
    priceFrom: 119,
    coverImage:
      'https://images.unsplash.com/photo-1464440770831-d2746e84329c?w=1400&q=85',
    category: 'thrills',
    brand: null,
    badge: null,
    isFeatured: true,
    theme: { primaryColor: '#4F46E5', secondaryColor: '#7C3AED', particleEffect: 'none' },
    openingHours: { mon: '09:00-21:00' },
    zones: 5,
  },
  {
    id: '3',
    slug: 'ferrari-world-abu-dhabi',
    name: 'Ferrari World Abu Dhabi',
    description:
      "The world's ultimate Ferrari experience. Home to Formula Rossa — the fastest roller coaster on the planet.",
    city: 'Yas Island',
    country: 'UAE',
    region: 'Abu Dhabi, UAE',
    ratingAvg: 4.7,
    reviewCount: 6840,
    priceFrom: 95,
    coverImage:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=85',
    category: 'speed',
    brand: null,
    badge: null,
    isFeatured: true,
    theme: { primaryColor: '#DC0000', secondaryColor: '#1A1A1A', particleEffect: 'speed' },
    openingHours: { mon: '10:00-20:00' },
    zones: 4,
  },
];

const attractions: Record<string, object[]> = {
  'magic-kingdom': [
    { id: 'a1', name: 'Space Mountain', category: 'Экстрим', avgWaitMin: 55, imageUrl: 'https://images.unsplash.com/photo-1598306447935-aea87293bd0a?w=800&q=85' },
    { id: 'a2', name: 'Замок Золушки', category: 'Семейный', avgWaitMin: 25, imageUrl: 'https://images.unsplash.com/photo-1596422846544-e75c642afc16?w=800&q=85' },
    { id: 'a3', name: 'Pirates of the Caribbean', category: 'Приключения', avgWaitMin: 40, imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=85' },
  ],
  'disneyland-california': [
    { id: 'd1', name: 'Indiana Jones Adventure', category: 'Приключения', avgWaitMin: 50, imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=85' },
    { id: 'd2', name: 'Sleeping Beauty Castle', category: 'Семейный', avgWaitMin: 15, imageUrl: 'https://images.unsplash.com/photo-1536092029617-efc5efebfcfe?w=800&q=85' },
    { id: 'd3', name: 'Millennium Falcon: Smugglers Run', category: 'Star Wars', avgWaitMin: 75, imageUrl: 'https://images.unsplash.com/photo-1534796998761-917e5d111861?w=800&q=85' },
  ],
  'disneyland-paris': [
    { id: 'e1', name: 'Phantom Manor', category: 'Приключения', avgWaitMin: 45, imageUrl: 'https://images.unsplash.com/photo-1513885541842-4b030c4d1746?w=800&q=85' },
    { id: 'e2', name: 'Ratatouille: The Adventure', category: 'Семейный', avgWaitMin: 35, imageUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=85' },
    { id: 'e3', name: 'Avengers Campus', category: 'Marvel', avgWaitMin: 60, imageUrl: 'https://images.unsplash.com/photo-1635805737707-5758859a2cb0?w=800&q=85' },
  ],
  'walt-disney-world': [
    { id: 'f1', name: 'TRON Lightcycle Run', category: 'Экстрим', avgWaitMin: 90, imageUrl: 'https://images.unsplash.com/photo-1508807526345-15e9b5e4f876?w=800&q=85' },
    { id: 'f2', name: 'Frozen Ever After', category: 'Семейный', avgWaitMin: 40, imageUrl: 'https://images.unsplash.com/photo-1513885541842-4b030c4d1746?w=800&q=85' },
    { id: 'f3', name: 'Avatar Flight of Passage', category: 'Приключения', avgWaitMin: 120, imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=85' },
  ],
  'tokyo-disneyland': [
    { id: 'g1', name: 'Pooh\'s Hunny Hunt', category: 'Семейный', avgWaitMin: 80, imageUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=85' },
    { id: 'g2', name: 'Journey to the Center of the Earth', category: 'Экстрим', avgWaitMin: 70, imageUrl: 'https://images.unsplash.com/photo-1508807526345-15e9b5e4f876?w=800&q=85' },
  ],
  'hong-kong-disneyland': [
    { id: 'h1', name: 'Mystic Manor', category: 'Приключения', avgWaitMin: 35, imageUrl: 'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?w=800&q=85' },
    { id: 'h2', name: 'Iron Man Experience', category: 'Marvel', avgWaitMin: 45, imageUrl: 'https://images.unsplash.com/photo-1635805737707-5758859a2cb0?w=800&q=85' },
  ],
  'star-wars-galaxys-edge': [
    { id: 'sw1', name: 'Millennium Falcon: Smugglers Run', category: 'Пилотирование', avgWaitMin: 65, imageUrl: 'https://images.unsplash.com/photo-1534796998761-917e5d111861?w=800&q=85' },
    { id: 'sw2', name: 'Star Wars: Rise of the Resistance', category: 'Эпик', avgWaitMin: 95, imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=85' },
    { id: 'sw3', name: 'Oga\'s Cantina', category: 'Шоу', avgWaitMin: 30, imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9ee5?w=800&q=85' },
    { id: 'sw4', name: 'Dok-Ondar\'s Den of Antiquities', category: 'Мерч', avgWaitMin: 10, imageUrl: 'https://images.unsplash.com/photo-1419242902214-272b403eb440?w=800&q=85' },
    { id: 'sw5', name: 'Savi\'s Workshop — Lightsabers', category: 'Опыт', avgWaitMin: 120, imageUrl: 'https://images.unsplash.com/photo-1506318137071-a8e63c84fe8e?w=800&q=85' },
  ],
  'universal-epic-universe': [
    { id: 'b1', name: 'VelociCoaster', category: 'Экстрим', avgWaitMin: 70, imageUrl: 'https://images.unsplash.com/photo-1508807526345-15e9b5e4f876?w=800&q=85' },
    { id: 'b2', name: 'Hagrid\'s Motorbike', category: 'Семейный', avgWaitMin: 50, imageUrl: 'https://images.unsplash.com/photo-1464440770831-d2746e84329c?w=800&q=85' },
  ],
  'ferrari-world-abu-dhabi': [
    { id: 'c1', name: 'Formula Rossa', category: 'Экстрим', avgWaitMin: 45, imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=85' },
    { id: 'c2', name: 'Flying Aces', category: 'Экстрим', avgWaitMin: 30, imageUrl: 'https://images.unsplash.com/photo-1621135802922-27a5f566153a?w=800&q=85' },
    { id: 'c3', name: 'Fiorano GT Challenge', category: 'Семейный', avgWaitMin: 20, imageUrl: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9a?w=800&q=85' },
  ],
};

const ticketTypes: Record<string, object[]> = {
  'magic-kingdom': [
    { id: 't1', name: 'Standard', price: 109, features: ['1 день', 'Все зоны', 'QR-билет'] },
    { id: 't2', name: 'Fast Pass', price: 159, features: ['Приоритетные очереди', '1 день'] },
    { id: 't3', name: 'VIP', price: 249, features: ['VIP-вход', 'Fast Pass', 'Парковка'] },
  ],
  'disneyland-california': [
    { id: 't1', name: '1 Park', price: 124, features: ['Disneyland или California Adventure'] },
    { id: 't2', name: 'Park Hopper', price: 179, features: ['Оба парка', 'Galaxy\'s Edge'] },
    { id: 't3', name: 'Genie+', price: 219, features: ['Lightning Lane', 'Hopper', 'Фото'] },
  ],
  'disneyland-paris': [
    { id: 't1', name: '1 Park', price: 99, features: ['Disneyland Paris'] },
    { id: 't2', name: '2 Parks', price: 129, features: ['Disneyland + Studios'] },
    { id: 't3', name: 'Premier Access', price: 189, features: ['Приоритет', '2 парка'] },
  ],
  'walt-disney-world': [
    { id: 't1', name: '1 Park / day', price: 129, features: ['1 из 4 парков'] },
    { id: 't2', name: 'Park Hopper', price: 189, features: ['Все парки', 'Транспорт'] },
    { id: 't3', name: 'Lightning Lane', price: 249, features: ['Genie+', 'Hopper', 'PhotoPass'] },
  ],
  'tokyo-disneyland': [
    { id: 't1', name: 'Disneyland', price: 74, features: ['1 день'] },
    { id: 't2', name: 'DisneySea', price: 74, features: ['Уникальный парк'] },
    { id: 't3', name: 'Combo', price: 110, features: ['Оба парка', '2 дня'] },
  ],
  'hong-kong-disneyland': [
    { id: 't1', name: 'Standard', price: 69, features: ['1 день', 'Все зоны'] },
    { id: 't2', name: 'Priority', price: 99, features: ['Приоритет 3 аттракциона'] },
  ],
  'star-wars-galaxys-edge': [
    { id: 't1', name: 'Batuu Base', price: 139, features: ['Galaxy\'s Edge', '1 день'] },
    { id: 't2', name: 'Resistance Package', price: 199, features: ['Rise + Falcon', 'Приоритет'] },
    { id: 't3', name: 'Jedi Experience', price: 289, features: ['Все аттракционы', 'Lightsaber workshop'] },
  ],
  'universal-epic-universe': [
    { id: 't1', name: 'Standard', price: 119, features: ['1 день', 'Все миры'] },
    { id: 't2', name: 'Express Pass', price: 169, features: ['Express очереди'] },
    { id: 't3', name: 'VIP', price: 279, features: ['VIP тур', 'Express'] },
  ],
  'ferrari-world-abu-dhabi': [
    { id: 't1', name: 'Standard', price: 95, features: ['1 день'] },
    { id: 't2', name: 'Fast Pass', price: 135, features: ['Приоритет'] },
    { id: 't3', name: 'VIP', price: 199, features: ['VIP лаунж'] },
  ],
};

const categories = [
  { id: 'disney', name: 'Disneyland & Disney', count: 6, image: 'https://images.unsplash.com/photo-1513885541842-4b030c4d1746?w=600&q=85' },
  { id: 'star-wars', name: 'Star Wars', count: 1, image: 'https://images.unsplash.com/photo-1446776811673-644aa332fba8?w=600&q=90' },
  { id: 'magical', name: 'Волшебные миры', count: 12, image: 'https://images.unsplash.com/photo-1596422846544-e75c642afc16?w=600&q=85' },
  { id: 'thrills', name: 'Экстрим', count: 18, image: 'https://images.unsplash.com/photo-1508807526345-15e9b5e4f876?w=600&q=85' },
  { id: 'water', name: 'Водные приключения', count: 8, image: 'https://images.unsplash.com/photo-1505118380757-91f5fcda2c40?w=600&q=85' },
  { id: 'family', name: 'Семейный отдых', count: 15, image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&q=85' },
  { id: 'speed', name: 'Скорость и гонки', count: 2, image: 'https://images.unsplash.com/photo-1621135802922-27a5f566153a?w=600&q=85' },
];

router.get('/categories/list', (_req, res) => {
  res.json(categories);
});

router.get('/', (req: Request, res: Response) => {
  const { city, minRating, maxPrice, category, brand } = req.query;
  let result = [...parks];

  if (city && typeof city === 'string') {
    const q = city.toLowerCase();
    result = result.filter(
      (p) =>
        p.city.toLowerCase().includes(q) ||
        p.country.toLowerCase().includes(q) ||
        p.region.toLowerCase().includes(q),
    );
  }
  if (minRating) result = result.filter((p) => p.ratingAvg >= Number(minRating));
  if (maxPrice) result = result.filter((p) => p.priceFrom <= Number(maxPrice));
  if (category && typeof category === 'string') {
    result = result.filter((p) => p.category === category);
  }
  if (brand && typeof brand === 'string') {
    result = result.filter((p) => p.brand === brand);
  }

  res.json({ data: result, meta: { total: result.length, page: 1, perPage: 20 } });
});

router.get('/:slug/tickets', (req, res) => {
  res.json(ticketTypes[req.params.slug] ?? []);
});

router.get('/:slug/attractions', (req, res) => {
  res.json(attractions[req.params.slug] ?? []);
});

router.get('/:slug', (req, res) => {
  const park = parks.find((p) => p.slug === req.params.slug);
  if (!park) return res.status(404).json({ error: 'Park not found' });
  res.json(park);
});

export default router;
