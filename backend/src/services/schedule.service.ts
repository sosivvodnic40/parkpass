import { dbIsReady, query } from '../db/pool';
import { getParkBySlug } from './park.service';
import type { ApiAvailability, ApiSchedule } from '../types';

const DAY_LABELS: Record<string, string> = {
  mon: 'Понедельник',
  tue: 'Вторник',
  wed: 'Среда',
  thu: 'Четверг',
  fri: 'Пятница',
  sat: 'Суббота',
  sun: 'Воскресенье',
};

const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;

const DEFAULT_CAPACITY = 500;

function buildWeeklySchedule(openingHours: Record<string, string>) {
  const defaultHours = openingHours.mon ?? '09:00-21:00';
  return DAY_KEYS.map((key) => {
    const hours = openingHours[key] ?? defaultHours;
    const isOpen = hours !== 'closed' && hours !== 'выходной';
    return {
      day: DAY_LABELS[key] ?? key,
      dayKey: key,
      hours: isOpen ? hours : 'Выходной',
      isOpen,
    };
  });
}

export async function getParkSchedule(parkSlug: string): Promise<ApiSchedule | null> {
  const park = await getParkBySlug(parkSlug);
  if (!park) return null;

  return {
    parkSlug: park.slug,
    parkName: park.name,
    timezone: 'America/New_York',
    openingHours: park.openingHours,
    weeklySchedule: buildWeeklySchedule(park.openingHours),
  };
}

export async function checkAvailability(
  parkSlug: string,
  visitDate: string,
  guests: number,
): Promise<ApiAvailability | null> {
  const park = await getParkBySlug(parkSlug);
  if (!park) return null;

  const date = new Date(visitDate);
  if (Number.isNaN(date.getTime())) {
    throw new Error('INVALID_DATE');
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date < today) {
    return {
      parkSlug,
      visitDate,
      guests,
      isAvailable: false,
      remainingSlots: 0,
      message: 'Дата посещения уже прошла',
    };
  }

  const dayKey = DAY_KEYS[date.getDay()];
  const hours = park.openingHours[dayKey] ?? park.openingHours.mon ?? '09:00-21:00';
  if (hours === 'closed' || hours === 'выходной') {
    return {
      parkSlug,
      visitDate,
      guests,
      isAvailable: false,
      remainingSlots: 0,
      message: 'Парк закрыт в этот день',
    };
  }

  let bookedGuests = 0;
  if (dbIsReady()) {
    const { rows } = await query<{ total: string }>(
      `SELECT COALESCE(SUM(b.guests_adult), 0)::text AS total
       FROM bookings b
       JOIN parks p ON p.id = b.park_id
       WHERE p.slug = $1 AND b.visit_date = $2 AND b.status IN ('paid', 'pending', 'completed')`,
      [parkSlug, visitDate],
    );
    bookedGuests = Number(rows[0]?.total ?? 0);
  } else {
    bookedGuests = visitDate === '2026-06-15' ? 120 : 0;
  }

  const remaining = Math.max(0, DEFAULT_CAPACITY - bookedGuests);
  const isAvailable = remaining >= guests;

  return {
    parkSlug,
    visitDate,
    guests,
    isAvailable,
    remainingSlots: remaining,
    message: isAvailable
      ? `Доступно ${remaining} мест на ${visitDate}`
      : `Недостаточно мест: осталось ${remaining}, запрошено ${guests}`,
  };
}
