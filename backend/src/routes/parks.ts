import { Router, Request, Response } from 'express';
import {
  getAttractions,
  getParkBySlug,
  getTickets,
  listCategories,
  listParks,
} from '../services/park.service';
import { checkAvailability, getParkSchedule } from '../services/schedule.service';

const router = Router();

router.get('/categories/list', (_req, res) => {
  res.json(listCategories());
});

router.get('/', async (req: Request, res: Response) => {
  const { city, minRating, maxPrice, category, brand } = req.query;
  const result = await listParks({
    city: typeof city === 'string' ? city : undefined,
    minRating: minRating ? Number(minRating) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    category: typeof category === 'string' ? category : undefined,
    brand: typeof brand === 'string' ? brand : undefined,
  });
  res.json({ data: result, meta: { total: result.length, page: 1, perPage: 30 } });
});

router.get('/:slug/schedule', async (req, res) => {
  const schedule = await getParkSchedule(req.params.slug);
  if (!schedule) return res.status(404).json({ error: 'Парк не найден' });
  res.json(schedule);
});

router.get('/:slug/availability', async (req, res) => {
  const visitDate = typeof req.query.date === 'string' ? req.query.date : undefined;
  const guests = req.query.guests ? Number(req.query.guests) : 1;
  if (!visitDate) {
    return res.status(400).json({ error: 'Параметр date обязателен (YYYY-MM-DD)' });
  }
  try {
    const availability = await checkAvailability(req.params.slug, visitDate, guests);
    if (!availability) return res.status(404).json({ error: 'Парк не найден' });
    res.json(availability);
  } catch (e) {
    if (e instanceof Error && e.message === 'INVALID_DATE') {
      return res.status(400).json({ error: 'Некорректная дата' });
    }
    res.status(500).json({ error: 'Ошибка проверки доступности' });
  }
});

router.get('/:slug/tickets', async (req, res) => {
  res.json(await getTickets(req.params.slug));
});

router.get('/:slug/attractions', async (req, res) => {
  res.json(await getAttractions(req.params.slug));
});

router.get('/:slug', async (req, res) => {
  const park = await getParkBySlug(req.params.slug);
  if (!park) return res.status(404).json({ error: 'Парк не найден' });
  res.json(park);
});

export default router;
