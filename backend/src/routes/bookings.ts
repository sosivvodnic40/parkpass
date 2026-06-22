import { Router, Request, Response } from 'express';
import { requireAuth, optionalAuth } from '../middleware/auth';
import { createBooking, listBookingsForUser } from '../services/booking.service';

const router = Router();

/** @deprecated Используйте GET /me с JWT */
router.get('/demo', optionalAuth, async (req: Request, res: Response) => {
  const userId = (req as Request & { userId?: string }).userId ?? 'u-demo';
  res.json(await listBookingsForUser(userId));
});

router.get('/me', requireAuth, async (req: Request, res: Response) => {
  const userId = (req as Request & { userId: string }).userId;
  res.json(await listBookingsForUser(userId));
});

router.post('/', requireAuth, async (req: Request, res: Response) => {
  const userId = (req as Request & { userId: string }).userId;
  const { parkSlug, parkName, ticketId, ticketName, visitDate, guests, totalAmount } = req.body;

  if (!parkSlug || !ticketId) {
    return res.status(400).json({ error: 'parkSlug и ticketId обязательны' });
  }

  try {
    const booking = await createBooking({
      userId,
      parkSlug,
      parkName,
      ticketId,
      ticketName,
      visitDate,
      guests: guests ?? 1,
      totalAmount: totalAmount ?? 0,
    });
    res.status(201).json(booking);
  } catch (e) {
    if (e instanceof Error && e.message === 'PARK_NOT_FOUND') {
      return res.status(404).json({ error: 'Парк не найден' });
    }
    if (e instanceof Error && e.message === 'TICKET_NOT_FOUND') {
      return res.status(404).json({ error: 'Тариф не найден' });
    }
    console.error(e);
    res.status(500).json({ error: 'Ошибка создания бронирования' });
  }
});

export default router;
