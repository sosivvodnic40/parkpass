import { Router, Request, Response } from 'express';
import { requireRole } from '../middleware/auth';
import { listUsers, updateUserRole } from '../services/auth.service';
import {
  getAdminStats,
  getBookingsReport,
  getVisitorsReport,
  listAllBookings,
  updateBookingStatus,
} from '../services/admin.service';
import {
  listAdminParks,
  updateAdminPark,
  updateAdminTicket,
} from '../services/park-admin.service';
import {
  checkInBookingByQr,
  verifyBookingByQr,
} from '../services/booking.service';
import {
  deleteReviewAdmin,
  listAllReviews,
  updateReviewAdmin,
} from '../services/review.service';
import type { UserRole } from '../types';

const router = Router();
const staff = requireRole('admin', 'park_manager');
const adminOnly = requireRole('admin');

router.get('/stats', ...staff, async (_req, res) => {
  res.json(await getAdminStats());
});

router.get('/bookings', ...staff, async (req, res) => {
  const { parkSlug, status, from, to } = req.query;
  res.json({
    data: await listAllBookings({
      parkSlug: typeof parkSlug === 'string' ? parkSlug : undefined,
      status: typeof status === 'string' ? status : undefined,
      from: typeof from === 'string' ? from : undefined,
      to: typeof to === 'string' ? to : undefined,
    }),
  });
});

router.patch('/bookings/:id/status', ...staff, async (req, res) => {
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: 'Поле status обязательно' });
  try {
    const booking = await updateBookingStatus(req.params.id, status);
    if (!booking) return res.status(404).json({ error: 'Бронирование не найдено' });
    res.json(booking);
  } catch (e) {
    if (e instanceof Error && e.message === 'INVALID_STATUS') {
      return res.status(400).json({ error: 'Недопустимый статус' });
    }
    res.status(500).json({ error: 'Ошибка обновления' });
  }
});

router.get('/users', ...adminOnly, async (_req, res) => {
  res.json({ data: await listUsers() });
});

router.patch('/users/:id/role', ...adminOnly, async (req, res) => {
  const { role } = req.body as { role?: UserRole };
  const allowed: UserRole[] = ['user', 'park_manager', 'admin'];
  if (!role || !allowed.includes(role)) {
    return res.status(400).json({ error: 'Недопустимая роль' });
  }
  const user = await updateUserRole(req.params.id, role);
  if (!user) return res.status(404).json({ error: 'Пользователь не найден' });
  res.json(user);
});

router.get('/reviews', ...staff, async (req, res) => {
  const { parkSlug, approved } = req.query;
  let approvedFilter: boolean | undefined;
  if (approved === 'true') approvedFilter = true;
  if (approved === 'false') approvedFilter = false;
  res.json({
    data: await listAllReviews({
      parkSlug: typeof parkSlug === 'string' ? parkSlug : undefined,
      approved: approvedFilter,
    }),
  });
});

router.patch('/reviews/:id', ...staff, async (req, res) => {
  const { isApproved, isVerified, rating, title, body } = req.body;
  try {
    const review = await updateReviewAdmin(req.params.id, {
      isApproved,
      isVerified,
      rating: rating !== undefined ? Number(rating) : undefined,
      title,
      body,
    });
    if (!review) return res.status(404).json({ error: 'Отзыв не найден' });
    res.json(review);
  } catch (e) {
    if (e instanceof Error && e.message === 'INVALID_RATING') {
      return res.status(400).json({ error: 'Рейтинг должен быть от 1 до 5' });
    }
    res.status(500).json({ error: 'Ошибка обновления отзыва' });
  }
});

router.delete('/reviews/:id', ...staff, async (req, res) => {
  const ok = await deleteReviewAdmin(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Отзыв не найден' });
  res.json({ ok: true });
});

router.get('/reports/bookings', ...staff, async (req, res) => {
  const from = typeof req.query.from === 'string' ? req.query.from : undefined;
  const to = typeof req.query.to === 'string' ? req.query.to : undefined;
  res.json(await getBookingsReport(from, to));
});

router.get('/reports/visitors', ...staff, async (req, res) => {
  const from = typeof req.query.from === 'string' ? req.query.from : undefined;
  const to = typeof req.query.to === 'string' ? req.query.to : undefined;
  res.json(await getVisitorsReport(from, to));
});

router.get('/parks', ...staff, async (_req, res) => {
  res.json({ data: await listAdminParks() });
});

router.patch('/parks/:slug', ...staff, async (req, res) => {
  const park = await updateAdminPark(req.params.slug, req.body);
  if (!park) return res.status(404).json({ error: 'Парк не найден' });
  res.json(park);
});

router.patch('/parks/:slug/tickets/:ticketCode', ...staff, async (req, res) => {
  const ticket = await updateAdminTicket(req.params.slug, req.params.ticketCode, req.body);
  if (!ticket) return res.status(404).json({ error: 'Тип билета не найден' });
  res.json(ticket);
});

router.post('/bookings/verify', ...staff, async (req, res) => {
  const { qrCode, checkIn } = req.body as { qrCode?: string; checkIn?: boolean };
  if (!qrCode?.trim()) return res.status(400).json({ error: 'Укажите qrCode' });

  const result = checkIn
    ? await checkInBookingByQr(qrCode)
    : await verifyBookingByQr(qrCode);

  const messages: Record<string, string> = {
    NOT_FOUND: 'Билет не найден',
    CANCELLED: 'Бронирование отменено',
    ALREADY_USED: 'Билет уже использован',
    WRONG_DATE: 'Билет недействителен на сегодня',
    INVALID_STATUS: 'Недопустимый статус брони',
    EMPTY_CODE: 'Пустой код',
  };

  res.json({
    ...result,
    message: result.valid
      ? checkIn
        ? 'Гость допущен на территорию'
        : 'Билет действителен'
      : messages[result.reason ?? ''] ?? 'Билет недействителен',
  });
});

export default router;
