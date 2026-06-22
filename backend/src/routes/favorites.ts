import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth';
import {
  addFavorite,
  listFavoriteParks,
  listFavoriteParksFull,
  removeFavorite,
  toggleFavorite,
} from '../services/favorite.service';

const router = Router();

router.get('/', requireAuth, async (req: Request, res: Response) => {
  const userId = (req as Request & { userId: string }).userId;
  const full = req.query.full === 'true';
  if (full) {
    return res.json({ data: await listFavoriteParksFull(userId) });
  }
  res.json({ slugs: await listFavoriteParks(userId) });
});

router.post('/', requireAuth, async (req: Request, res: Response) => {
  const userId = (req as Request & { userId: string }).userId;
  const { parkSlug } = req.body;
  if (!parkSlug) return res.status(400).json({ error: 'parkSlug обязателен' });
  try {
    await addFavorite(userId, parkSlug);
    res.status(201).json({ ok: true, parkSlug });
  } catch (e) {
    if (e instanceof Error && e.message === 'PARK_NOT_FOUND') {
      return res.status(404).json({ error: 'Парк не найден' });
    }
    res.status(500).json({ error: 'Ошибка' });
  }
});

router.post('/toggle', requireAuth, async (req: Request, res: Response) => {
  const userId = (req as Request & { userId: string }).userId;
  const { parkSlug } = req.body;
  if (!parkSlug) return res.status(400).json({ error: 'parkSlug обязателен' });
  const added = await toggleFavorite(userId, parkSlug);
  res.json({ parkSlug, favorited: added });
});

router.delete('/:slug', requireAuth, async (req: Request, res: Response) => {
  const userId = (req as Request & { userId: string }).userId;
  await removeFavorite(userId, req.params.slug);
  res.json({ ok: true });
});

export default router;
