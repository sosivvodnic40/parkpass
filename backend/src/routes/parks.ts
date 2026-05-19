import { Router, Request, Response } from 'express';

/**
 * ParkPass API — Parks module
 * Пример REST API на Node.js + Express
 */

const router = Router();

// Mock data для демонстрации (в проде — PostgreSQL через Prisma/pg)
const parks = [
  {
    id: '1',
    slug: 'ferrari-world-abu-dhabi',
    name: 'Ferrari World Abu Dhabi',
    description:
      'Первый тематический парк Ferrari в мире. Formula Rossa — самые быстрые американские горки на планете.',
    city: 'Abu Dhabi',
    country: 'UAE',
    ratingAvg: 4.7,
    reviewCount: 2840,
    priceFrom: 89,
    coverImage: 'https://cdn.parkpass.demo/ferrari-cover.jpg',
    heroVideoUrl: 'https://cdn.parkpass.demo/ferrari-hero.webm',
    theme: {
      primaryColor: '#DC0000',
      secondaryColor: '#1A1A1A',
      particleEffect: 'speed',
    },
    openingHours: { mon: '10:00-20:00', tue: '10:00-20:00' },
  },
  {
    id: '2',
    slug: 'magic-kingdom-eu',
    name: 'Magic Kingdom EU',
    description: 'Сказочный мир для всей семьи с парадами и волшебными зонами.',
    city: 'Paris',
    country: 'France',
    ratingAvg: 4.9,
    reviewCount: 12000,
    priceFrom: 120,
    coverImage: 'https://cdn.parkpass.demo/magic-cover.jpg',
    theme: {
      primaryColor: '#F472B6',
      secondaryColor: '#FBBF24',
      particleEffect: 'stars',
    },
    openingHours: { mon: '09:00-22:00' },
  },
];

const attractions: Record<string, unknown[]> = {
  'ferrari-world-abu-dhabi': [
    {
      id: 'a1',
      name: 'Formula Rossa',
      category: 'Экстрим',
      avgWaitMin: 45,
      imageUrl: 'https://cdn.parkpass.demo/formula-rossa.jpg',
    },
    {
      id: 'a2',
      name: 'Flying Aces',
      category: 'Экстрим',
      avgWaitMin: 30,
      imageUrl: 'https://cdn.parkpass.demo/flying-aces.jpg',
    },
  ],
  'magic-kingdom-eu': [
    {
      id: 'b1',
      name: 'Замок Мечты',
      category: 'Семейный',
      avgWaitMin: 20,
      imageUrl: 'https://cdn.parkpass.demo/castle.jpg',
    },
  ],
};

/** GET /api/v1/parks — каталог с фильтрацией */
router.get('/', (req: Request, res: Response) => {
  const { city, minRating, maxPrice } = req.query;
  let result = [...parks];

  if (city && typeof city === 'string') {
    result = result.filter(
      (p) =>
        p.city.toLowerCase().includes(city.toLowerCase()) ||
        p.country.toLowerCase().includes(city.toLowerCase()),
    );
  }
  if (minRating) {
    result = result.filter((p) => p.ratingAvg >= Number(minRating));
  }
  if (maxPrice) {
    result = result.filter((p) => p.priceFrom <= Number(maxPrice));
  }

  res.json({
    data: result,
    meta: { total: result.length, page: 1, perPage: 20 },
  });
});

/** GET /api/v1/parks/:slug — детальная страница парка */
router.get('/:slug', (req: Request, res: Response) => {
  const park = parks.find((p) => p.slug === req.params.slug);
  if (!park) {
    return res.status(404).json({ error: 'Park not found' });
  }
  res.json(park);
});

/** GET /api/v1/parks/:slug/attractions */
router.get('/:slug/attractions', (req: Request, res: Response) => {
  const list = attractions[req.params.slug] ?? [];
  res.json(list);
});

export default router;
