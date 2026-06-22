import { dbIsReady, query } from '../db/pool';
import { catalogParks } from '../data/catalog';
import { getParkBySlug } from './park.service';
import type { ApiAdminReview, ApiReview } from '../types';

type MockReview = ApiReview & { isApproved: boolean };

const mockReviews: MockReview[] = [
  {
    id: 'r1',
    parkSlug: 'star-wars-galaxys-edge',
    userName: 'Айдана К.',
    rating: 5,
    title: 'Лучший день в парке',
    body: 'Rise of the Resistance превзошёл все ожидания. Очередь того стоила.',
    visitDate: '2026-04-10',
    isVerified: true,
    isApproved: true,
    createdAt: '2026-04-12T10:00:00Z',
  },
  {
    id: 'r2',
    parkSlug: 'marvel-avengers-california',
    userName: 'Ерлан М.',
    rating: 5,
    title: 'Avengers Campus — must see',
    body: 'WEB Slingers и встреча с героями — дети в восторге.',
    visitDate: '2026-03-20',
    isVerified: true,
    isApproved: true,
    createdAt: '2026-03-22T14:30:00Z',
  },
  {
    id: 'r3',
    parkSlug: 'jurassic-islands-orlando',
    userName: 'Мадина С.',
    rating: 4,
    title: 'VelociCoaster — адреналин',
    body: 'Экстремально, но безопасно. River Adventure тоже отличный.',
    visitDate: '2026-02-15',
    isVerified: false,
    isApproved: true,
    createdAt: '2026-02-16T09:00:00Z',
  },
  {
    id: 'r4',
    parkSlug: 'harry-potter-hogsmeade-orlando',
    userName: 'Алия Т.',
    rating: 5,
    title: 'Хогвартс — магия',
    body: 'Forbidden Journey и Butterbeer в Хогсмиде — незабываемо для всей семьи.',
    visitDate: '2026-05-01',
    isVerified: true,
    isApproved: true,
    createdAt: '2026-05-03T11:20:00Z',
  },
];

function parkNameBySlug(slug: string): string {
  return catalogParks.find((p) => p.slug === slug)?.name ?? slug;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToReview(row: any): ApiReview {
  return {
    id: row.id,
    parkSlug: row.park_slug,
    userName: row.user_name ?? 'Гость',
    rating: Number(row.rating),
    title: row.title ?? null,
    body: row.body ?? null,
    visitDate: row.visit_date
      ? String(row.visit_date).slice(0, 10)
      : null,
    isVerified: Boolean(row.is_verified),
    createdAt: row.created_at instanceof Date
      ? row.created_at.toISOString()
      : String(row.created_at),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToAdminReview(row: any): ApiAdminReview {
  return {
    ...rowToReview(row),
    isApproved: Boolean(row.is_approved),
    parkName: row.park_name ?? parkNameBySlug(row.park_slug),
  };
}

async function recalculateParkRatings(parkId: string): Promise<void> {
  await query(
    `UPDATE parks SET
       review_count = (SELECT COUNT(*) FROM reviews WHERE park_id = $1 AND is_approved = true),
       rating_avg = COALESCE(
         (SELECT ROUND(AVG(rating)::numeric, 2) FROM reviews WHERE park_id = $1 AND is_approved = true),
         0
       )
     WHERE id = $1`,
    [parkId],
  );
}
export async function listReviews(parkSlug: string): Promise<ApiReview[]> {
  if (dbIsReady()) {
    const { rows } = await query(
      `SELECT r.*, p.slug AS park_slug,
              CONCAT(u.first_name, ' ', LEFT(u.last_name, 1), '.') AS user_name
       FROM reviews r
       JOIN parks p ON p.id = r.park_id
       JOIN users u ON u.id = r.user_id
       WHERE p.slug = $1 AND r.is_approved = true
       ORDER BY r.created_at DESC
       LIMIT 50`,
      [parkSlug],
    );
    return rows.map(rowToReview);
  }
  return mockReviews.filter((r) => r.parkSlug === parkSlug && r.isApproved);
}

export async function createReview(input: {
  userId: string;
  parkSlug: string;
  rating: number;
  title?: string;
  body?: string;
  visitDate?: string;
}): Promise<ApiReview> {
  if (input.rating < 1 || input.rating > 5) {
    throw new Error('INVALID_RATING');
  }

  const park = await getParkBySlug(input.parkSlug);
  if (!park) throw new Error('PARK_NOT_FOUND');

  if (dbIsReady()) {
    const { rows: parkRows } = await query('SELECT id FROM parks WHERE slug = $1', [
      input.parkSlug,
    ]);
    const { rows: userRows } = await query(
      'SELECT first_name, last_name FROM users WHERE id = $1',
      [input.userId],
    );
    const userName = `${userRows[0]?.first_name ?? 'Гость'} ${(userRows[0]?.last_name ?? '')[0] ?? ''}.`.trim();

    const { rows } = await query(
      `INSERT INTO reviews (user_id, park_id, rating, title, body, visit_date, is_verified, is_approved)
       VALUES ($1, $2, $3, $4, $5, $6, false, false)
       RETURNING *`,
      [
        input.userId,
        parkRows[0].id,
        input.rating,
        input.title ?? null,
        input.body ?? null,
        input.visitDate ?? null,
      ],
    );

    await recalculateParkRatings(parkRows[0].id);

    return rowToReview({ ...rows[0], park_slug: input.parkSlug, user_name: userName });
  }

  const user = await import('./auth.service').then((m) => m.getUserById(input.userId));
  const review: MockReview = {
    id: `r${mockReviews.length + 1}`,
    parkSlug: input.parkSlug,
    userName: user ? `${user.firstName} ${(user.lastName?.[0] ?? '')}.`.trim() : 'Гость',
    rating: input.rating,
    title: input.title ?? null,
    body: input.body ?? null,
    visitDate: input.visitDate ?? null,
    isVerified: false,
    isApproved: false,
    createdAt: new Date().toISOString(),
  };
  mockReviews.unshift(review);
  return review;
}

export async function seedReviewsIfEmpty(): Promise<void> {
  if (!dbIsReady()) return;
  const { rows } = await query<{ count: string }>('SELECT COUNT(*)::text AS count FROM reviews');
  if (Number(rows[0]?.count) > 0) return;

  const { rows: users } = await query<{ id: string }>(
    "SELECT id FROM users WHERE email = 'demo@parkpass.ru'",
  );
  if (!users[0]) return;

  for (const r of mockReviews) {
    const { rows: parks } = await query<{ id: string }>(
      'SELECT id FROM parks WHERE slug = $1',
      [r.parkSlug],
    );
    if (!parks[0]) continue;
    await query(
      `INSERT INTO reviews (user_id, park_id, rating, title, body, visit_date, is_verified, is_approved)
       VALUES ($1, $2, $3, $4, $5, $6, $7, true)`,
      [users[0].id, parks[0].id, r.rating, r.title, r.body, r.visitDate, r.isVerified],
    );
  }
  console.log(`[seed] Inserted ${mockReviews.length} demo reviews`);
}

export async function listAllReviews(filters?: {
  parkSlug?: string;
  approved?: boolean;
}): Promise<ApiAdminReview[]> {
  if (dbIsReady()) {
    const clauses = ['1=1'];
    const params: unknown[] = [];
    let i = 1;

    if (filters?.parkSlug) {
      clauses.push(`p.slug = $${i++}`);
      params.push(filters.parkSlug);
    }
    if (filters?.approved !== undefined) {
      clauses.push(`r.is_approved = $${i++}`);
      params.push(filters.approved);
    }

    const { rows } = await query(
      `SELECT r.*, p.slug AS park_slug, p.name AS park_name,
              CONCAT(u.first_name, ' ', LEFT(u.last_name, 1), '.') AS user_name
       FROM reviews r
       JOIN parks p ON p.id = r.park_id
       JOIN users u ON u.id = r.user_id
       WHERE ${clauses.join(' AND ')}
       ORDER BY r.created_at DESC
       LIMIT 200`,
      params,
    );
    return rows.map(rowToAdminReview);
  }

  let result = mockReviews.map((r) => ({
    ...r,
    parkName: parkNameBySlug(r.parkSlug),
  }));
  if (filters?.parkSlug) result = result.filter((r) => r.parkSlug === filters.parkSlug);
  if (filters?.approved !== undefined) {
    result = result.filter((r) => r.isApproved === filters.approved);
  }
  return result;
}

export async function updateReviewAdmin(
  reviewId: string,
  patch: {
    isApproved?: boolean;
    isVerified?: boolean;
    rating?: number;
    title?: string | null;
    body?: string | null;
  },
): Promise<ApiAdminReview | null> {
  if (patch.rating !== undefined && (patch.rating < 1 || patch.rating > 5)) {
    throw new Error('INVALID_RATING');
  }

  if (dbIsReady()) {
    const fields: string[] = [];
    const params: unknown[] = [];
    let i = 1;

    if (patch.isApproved !== undefined) {
      fields.push(`is_approved = $${i++}`);
      params.push(patch.isApproved);
    }
    if (patch.isVerified !== undefined) {
      fields.push(`is_verified = $${i++}`);
      params.push(patch.isVerified);
    }
    if (patch.rating !== undefined) {
      fields.push(`rating = $${i++}`);
      params.push(patch.rating);
    }
    if (patch.title !== undefined) {
      fields.push(`title = $${i++}`);
      params.push(patch.title);
    }
    if (patch.body !== undefined) {
      fields.push(`body = $${i++}`);
      params.push(patch.body);
    }

    if (!fields.length) return listAllReviews().then((all) => all.find((r) => r.id === reviewId) ?? null);

    params.push(reviewId);
    const { rows } = await query(
      `UPDATE reviews SET ${fields.join(', ')} WHERE id = $${i} RETURNING park_id`,
      params,
    );
    if (!rows.length) return null;
    await recalculateParkRatings(rows[0].park_id);
    const all = await listAllReviews();
    return all.find((r) => r.id === reviewId) ?? null;
  }

  const review = mockReviews.find((r) => r.id === reviewId);
  if (!review) return null;
  if (patch.isApproved !== undefined) review.isApproved = patch.isApproved;
  if (patch.isVerified !== undefined) review.isVerified = patch.isVerified;
  if (patch.rating !== undefined) review.rating = patch.rating;
  if (patch.title !== undefined) review.title = patch.title;
  if (patch.body !== undefined) review.body = patch.body;
  return { ...review, parkName: parkNameBySlug(review.parkSlug) };
}

export async function deleteReviewAdmin(reviewId: string): Promise<boolean> {
  if (dbIsReady()) {
    const { rows } = await query(
      `DELETE FROM reviews WHERE id = $1 RETURNING park_id`,
      [reviewId],
    );
    if (!rows.length) return false;
    await recalculateParkRatings(rows[0].park_id);
    return true;
  }

  const idx = mockReviews.findIndex((r) => r.id === reviewId);
  if (idx === -1) return false;
  mockReviews.splice(idx, 1);
  return true;
}
