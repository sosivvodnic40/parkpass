import { Router, Request, Response } from 'express';

const router = Router();

const bookings: object[] = [
  {
    id: 'b1',
    userId: 'u1',
    parkSlug: 'magic-kingdom',
    parkName: 'Magic Kingdom',
    visitDate: '2026-06-15',
    guests: 2,
    totalAmount: 218,
    status: 'paid',
    qrCode: 'PP-B1-MAGIC',
    createdAt: '2026-05-01T10:00:00Z',
  },
];

router.get('/demo', (_req, res) => {
  res.json(bookings);
});

router.post('/', (req: Request, res: Response) => {
  const { parkSlug, parkName, visitDate, guests, totalAmount } = req.body;
  const booking = {
    id: `b${bookings.length + 1}`,
    userId: 'u1',
    parkSlug,
    parkName,
    visitDate: visitDate ?? new Date().toISOString().slice(0, 10),
    guests: guests ?? 1,
    totalAmount: totalAmount ?? 0,
    status: 'paid',
    qrCode: `PP-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  bookings.push(booking);
  res.status(201).json(booking);
});

export default router;
