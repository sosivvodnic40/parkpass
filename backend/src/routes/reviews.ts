import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth';
import { createReview, listReviews } from '../services/review.service';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const parkSlug = req.query.parkSlug as string | undefined;
  if (!parkSlug) {
    return res.status(400).json({ error: 'Параметр parkSlug обязателен' });
  }
  res.json({ data: await listReviews(parkSlug) });
});

router.post('/', requireAuth, async (req: Request, res: Response) => {
  const userId = (req as Request & { userId: string }).userId;
  const { parkSlug, rating, title, body, visitDate } = req.body;

  if (!parkSlug || rating === undefined) {
    return res.status(400).json({ error: 'parkSlug и rating обязательны' });
  }

  try {
    const review = await createReview({
      userId,
      parkSlug,
      rating: Number(rating),
      title,
      body,
      visitDate,
    });
    res.status(201).json(review);
  } catch (e) {
    if (e instanceof Error && e.message === 'PARK_NOT_FOUND') {
      return res.status(404).json({ error: 'Парк не найден' });
    }
    if (e instanceof Error && e.message === 'INVALID_RATING') {
      return res.status(400).json({ error: 'Рейтинг должен быть от 1 до 5' });
    }
    console.error(e);
    res.status(500).json({ error: 'Ошибка создания отзыва' });
  }
});

export default router;
