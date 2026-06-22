import {
  ALLOWED_CATEGORIES,
  catalogAttractions,
  catalogCategories,
  catalogParks,
  catalogTickets,
  REMOVED_PARK_SLUGS,
} from '../data/catalog';
import { applyParkOverride, applyTicketOverride } from '../data/catalog-overrides';
import { dbIsReady, query } from '../db/pool';
import { catalogToApiPark, rowToApiPark, rowToAttraction, rowToTicket } from '../mappers/park.mapper';
import type { ApiAttraction, ApiPark, ApiTicket } from '../types';

export function listCategories() {
  return catalogCategories;
}

function isAllowedCategory(category: string | null | undefined): boolean {
  return !!category && ALLOWED_CATEGORIES.includes(category);
}

export async function listParks(filters: {
  city?: string;
  minRating?: number;
  maxPrice?: number;
  category?: string;
  brand?: string;
}): Promise<ApiPark[]> {
  if (dbIsReady()) {
    const clauses: string[] = ['is_active = true', `category = ANY($1)`];
    const params: unknown[] = [ALLOWED_CATEGORIES];
    let i = 2;

    if (filters.category) {
      if (!isAllowedCategory(filters.category)) return [];
      clauses.push(`category = $${i++}`);
      params.push(filters.category);
    }
    if (filters.brand) {
      clauses.push(`brand = $${i++}`);
      params.push(filters.brand);
    }
    if (filters.minRating) {
      clauses.push(`rating_avg >= $${i++}`);
      params.push(filters.minRating);
    }
    if (filters.maxPrice) {
      clauses.push(`price_from <= $${i++}`);
      params.push(filters.maxPrice);
    }
    if (filters.city) {
      clauses.push(
        `(LOWER(city) LIKE $${i} OR LOWER(country) LIKE $${i} OR LOWER(region) LIKE $${i})`,
      );
      params.push(`%${filters.city.toLowerCase()}%`);
      i++;
    }

    const { rows } = await query(
      `SELECT * FROM parks WHERE ${clauses.join(' AND ')} ORDER BY rating_avg DESC`,
      params,
    );
    return rows.map(rowToApiPark);
  }

  let result = catalogParks.map((p) => catalogToApiPark(applyParkOverride(p))).filter((p) => isAllowedCategory(p.category));
  if (filters.city) {
    const q = filters.city.toLowerCase();
    result = result.filter(
      (p) =>
        p.city.toLowerCase().includes(q) ||
        p.country.toLowerCase().includes(q) ||
        p.region.toLowerCase().includes(q),
    );
  }
  if (filters.minRating) result = result.filter((p) => p.ratingAvg >= filters.minRating!);
  if (filters.maxPrice) result = result.filter((p) => p.priceFrom <= filters.maxPrice!);
  if (filters.category) result = result.filter((p) => p.category === filters.category);
  if (filters.brand) result = result.filter((p) => p.brand === filters.brand);
  return result;
}

export async function getParkBySlug(slug: string): Promise<ApiPark | null> {
  if ((REMOVED_PARK_SLUGS as readonly string[]).includes(slug)) return null;

  if (dbIsReady()) {
    const { rows } = await query(
      'SELECT * FROM parks WHERE slug = $1 AND is_active = true AND category = ANY($2)',
      [slug, ALLOWED_CATEGORIES],
    );
    return rows.length ? rowToApiPark(rows[0]) : null;
  }
  const p = catalogParks.find((x) => x.slug === slug);
  if (!p || !isAllowedCategory(p.category)) return null;
  return catalogToApiPark(applyParkOverride(p));
}

export async function getAttractions(slug: string): Promise<ApiAttraction[]> {
  if (dbIsReady()) {
    const { rows } = await query(
      `SELECT a.* FROM attractions a
       JOIN parks p ON p.id = a.park_id
       WHERE p.slug = $1 AND a.is_active = true
       ORDER BY a.avg_wait_min DESC`,
      [slug],
    );
    return rows.map(rowToAttraction);
  }
  const park = catalogParks.find((p) => p.slug === slug);
  const items = catalogAttractions[slug] ?? (park
    ? [{ code: 'g1', name: 'Главный аттракцион', category: 'Хит', wait: 45, img: park.coverImage }]
    : []);
  return items.map((x) => ({
    id: x.code,
    name: x.name,
    category: x.category,
    avgWaitMin: x.wait,
    imageUrl: x.img,
  }));
}

export async function getTickets(slug: string): Promise<ApiTicket[]> {
  if (dbIsReady()) {
    const { rows } = await query(
      `SELECT tt.* FROM ticket_types tt
       JOIN parks p ON p.id = tt.park_id
       WHERE p.slug = $1 AND tt.is_active = true
       ORDER BY tt.price ASC`,
      [slug],
    );
    return rows.map(rowToTicket);
  }
  return (catalogTickets[slug] ?? []).map((t) => {
    const ticket = applyTicketOverride(slug, t);
    return {
      id: ticket.code,
      name: ticket.name,
      price: ticket.price,
      features: ticket.features,
    };
  });
}

export async function getParkDbId(slug: string): Promise<string | null> {
  if (!dbIsReady()) return null;
  const { rows } = await query('SELECT id FROM parks WHERE slug = $1', [slug]);
  return rows[0]?.id ?? null;
}

export async function getTicketDbId(
  parkSlug: string,
  ticketCode: string,
): Promise<{ id: string; name: string; price: number } | null> {
  if (!dbIsReady()) return null;
  const { rows } = await query(
    `SELECT tt.id, tt.name, tt.price FROM ticket_types tt
     JOIN parks p ON p.id = tt.park_id
     WHERE p.slug = $1 AND tt.code = $2`,
    [parkSlug, ticketCode],
  );
  if (!rows.length) return null;
  return { id: rows[0].id, name: rows[0].name, price: Number(rows[0].price) };
}
