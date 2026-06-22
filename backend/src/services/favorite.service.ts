import { dbIsReady, query } from '../db/pool';
import { getParkBySlug } from './park.service';
import type { ApiPark } from '../types';

const mockFavorites: Record<string, Set<string>> = {};

function mockSlugs(userId: string): string[] {
  if (!mockFavorites[userId]) mockFavorites[userId] = new Set();
  return [...mockFavorites[userId]];
}

export async function listFavoriteParks(userId: string): Promise<string[]> {
  if (dbIsReady()) {
    const { rows } = await query(
      `SELECT p.slug FROM favorites f
       JOIN parks p ON p.id = f.park_id
       WHERE f.user_id = $1 AND f.item_type = 'park'
       ORDER BY f.created_at DESC`,
      [userId],
    );
    return rows.map((r) => r.slug as string);
  }
  return mockSlugs(userId);
}

export async function listFavoriteParksFull(userId: string): Promise<ApiPark[]> {
  const slugs = await listFavoriteParks(userId);
  const parks: ApiPark[] = [];
  for (const slug of slugs) {
    const p = await getParkBySlug(slug);
    if (p) parks.push(p);
  }
  return parks;
}

export async function addFavorite(userId: string, parkSlug: string): Promise<void> {
  if (dbIsReady()) {
    const { rows } = await query('SELECT id FROM parks WHERE slug = $1', [parkSlug]);
    if (!rows.length) throw new Error('PARK_NOT_FOUND');
    await query(
      `INSERT INTO favorites (user_id, item_type, park_id)
       VALUES ($1, 'park', $2)
       ON CONFLICT DO NOTHING`,
      [userId, rows[0].id],
    );
    return;
  }
  if (!mockFavorites[userId]) mockFavorites[userId] = new Set();
  mockFavorites[userId].add(parkSlug);
}

export async function removeFavorite(userId: string, parkSlug: string): Promise<void> {
  if (dbIsReady()) {
    await query(
      `DELETE FROM favorites f
       USING parks p
       WHERE f.park_id = p.id AND f.user_id = $1 AND p.slug = $2 AND f.item_type = 'park'`,
      [userId, parkSlug],
    );
    return;
  }
  mockFavorites[userId]?.delete(parkSlug);
}

export async function toggleFavorite(userId: string, parkSlug: string): Promise<boolean> {
  const slugs = await listFavoriteParks(userId);
  if (slugs.includes(parkSlug)) {
    await removeFavorite(userId, parkSlug);
    return false;
  }
  await addFavorite(userId, parkSlug);
  return true;
}
