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
    category: 'magical',
    badge: 'Хит недели',
    isFeatured: true,
    theme: {
      primaryColor: '#BE185D',
      secondaryColor: '#FBBF24',
      particleEffect: 'stars',
    },
    openingHours: { mon: '09:00-22:00', tue: '09:00-22:00' },
    zones: 6,
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
    badge: null,
    isFeatured: true,
    theme: {
      primaryColor: '#4F46E5',
      secondaryColor: '#7C3AED',
      particleEffect: 'none',
    },
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
    badge: null,
    isFeatured: true,
    theme: {
      primaryColor: '#DC0000',
      secondaryColor: '#1A1A1A',
      particleEffect: 'speed',
    },
    openingHours: { mon: '10:00-20:00', tue: '10:00-20:00' },
    zones: 4,
  },
];

const attractions: Record<string, object[]> = {
  'magic-kingdom': [
    {
      id: 'a1',
      name: 'Space Mountain',
      category: 'Экстрим',
      avgWaitMin: 55,
      imageUrl:
        'https://images.unsplash.com/photo-1598306447935-aea87293bd0a?w=800&q=85',
    },
    {
      id: 'a2',
      name: 'Замок Золушки',
      category: 'Семейный',
      avgWaitMin: 25,
      imageUrl:
        'https://images.unsplash.com/photo-1596422846544-e75c642afc16?w=800&q=85',
    },
    {
      id: 'a3',
      name: 'Pirates of the Caribbean',
      category: 'Приключения',
      avgWaitMin: 40,
      imageUrl:
        'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=85',
    },
  ],
  'universal-epic-universe': [
    {
      id: 'b1',
      name: 'VelociCoaster',
      category: 'Экстрим',
      avgWaitMin: 70,
      imageUrl:
        'https://images.unsplash.com/photo-1508807526345-15e9b5e4f876?w=800&q=85',
    },
    {
      id: 'b2',
      name: 'Hagrid\'s Motorbike',
      category: 'Семейный',
      avgWaitMin: 50,
      imageUrl:
        'https://images.unsplash.com/photo-1464440770831-d2746e84329c?w=800&q=85',
    },
  ],
  'ferrari-world-abu-dhabi': [
    {
      id: 'c1',
      name: 'Formula Rossa',
      category: 'Экстрим',
      avgWaitMin: 45,
      imageUrl:
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=85',
    },
    {
      id: 'c2',
      name: 'Flying Aces',
      category: 'Экстрим',
      avgWaitMin: 30,
      imageUrl:
        'https://images.unsplash.com/photo-1621135802922-27a5f566153a?w=800&q=85',
    },
    {
      id: 'c3',
      name: 'Fiorano GT Challenge',
      category: 'Семейный',
      avgWaitMin: 20,
      imageUrl:
        'https://images.unsplash.com/photo-1544636331-e26879cd4d9a?w=800&q=85',
    },
  ],
};

const ticketTypes: Record<string, object[]> = {
  'magic-kingdom': [
    { id: 't1', name: 'Standard', price: 109, features: ['1 день', 'Все зоны', 'QR-билет'] },
    { id: 't2', name: 'Fast Pass', price: 159, features: ['Приоритетные очереди', '1 день', 'Все зоны'] },
    { id: 't3', name: 'VIP', price: 249, features: ['VIP-вход', 'Fast Pass', 'Парковка'] },
  ],
  'universal-epic-universe': [
    { id: 't1', name: 'Standard', price: 119, features: ['1 день', 'Все миры'] },
    { id: 't2', name: 'Express Pass', price: 169, features: ['Express очереди', '1 день'] },
    { id: 't3', name: 'VIP', price: 279, features: ['VIP тур', 'Express', 'Питание'] },
  ],
  'ferrari-world-abu-dhabi': [
    { id: 't1', name: 'Standard', price: 95, features: ['1 день', 'Все аттракционы'] },
    { id: 't2', name: 'Fast Pass', price: 135, features: ['Приоритет', '1 день'] },
    { id: 't3', name: 'VIP', price: 199, features: ['VIP лаунж', 'Fast Pass'] },
  ],
};

const categories = [
  { id: 'magical', name: 'Волшебные миры', count: 12, image: 'https://images.unsplash.com/photo-1513885541842-4b030c4d1746?w=600&q=85' },
  { id: 'thrills', name: 'Экстрим', count: 18, image: 'https://images.unsplash.com/photo-1508807526345-15e9b5e4f876?w=600&q=85' },
  { id: 'water', name: 'Водные приключения', count: 8, image: 'https://images.unsplash.com/photo-1505118380757-91f5fcda2c40?w=600&q=85' },
  { id: 'family', name: 'Семейный отдых', count: 15, image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&q=85' },
  { id: 'speed', name: 'Скорость и гонки', count: 2, image: 'https://images.unsplash.com/photo-1621135802922-27a5f566153a?w=600&q=85' },
];

router.get('/categories/list', (_req, res) => {
  res.json(categories);
});

router.get('/', (req: Request, res: Response) => {
  const { city, minRating, maxPrice, category } = req.query;
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
