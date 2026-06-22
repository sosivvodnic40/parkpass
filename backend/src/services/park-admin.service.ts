import {
  applyParkOverride,
  applyTicketOverride,
  patchCatalogPark,
  patchCatalogTicket,
} from '../data/catalog-overrides';
import {
  catalogParks,
  catalogTickets,
  type CatalogPark,
  type CatalogTicket,
} from '../data/catalog';
import { dbIsReady, query } from '../db/pool';
import { catalogToApiPark, rowToApiPark, rowToTicket } from '../mappers/park.mapper';
import { getTickets } from './park.service';
import type { ApiPark, ApiTicket } from '../types';

export type AdminParkDetail = ApiPark & {
  description: string;
  tickets: ApiTicket[];
};

export async function listAdminParks(): Promise<AdminParkDetail[]> {
  if (dbIsReady()) {
    const { rows } = await query(
      `SELECT * FROM parks WHERE is_active = true ORDER BY name`,
    );
    const parks = await Promise.all(
      rows.map(async (row) => {
        const park = rowToApiPark(row);
        const tickets = await getTickets(park.slug);
        return {
          ...park,
          description: row.description ?? '',
          tickets,
        };
      }),
    );
    return parks;
  }

  return catalogParks.map((p) => {
    const park = catalogToApiPark(applyParkOverride(p));
    const tickets = (catalogTickets[p.slug] ?? []).map((t) =>
      applyTicketOverride(p.slug, t),
    );
    return {
      ...park,
      description: p.description,
      tickets: tickets.map((t) => ({
        id: t.code,
        name: t.name,
        price: t.price,
        features: t.features,
      })),
    };
  });
}

export async function updateAdminPark(
  slug: string,
  patch: Partial<{
    name: string;
    description: string;
    priceFrom: number;
    coverImage: string;
    badge: string | null;
    ratingAvg: number;
    reviewCount: number;
  }>,
): Promise<AdminParkDetail | null> {
  if (dbIsReady()) {
    const fields: string[] = [];
    const params: unknown[] = [];
    let i = 1;

    const map: Record<string, string> = {
      name: 'name',
      description: 'description',
      priceFrom: 'price_from',
      coverImage: 'cover_image',
      badge: 'badge',
      ratingAvg: 'rating_avg',
      reviewCount: 'review_count',
    };

    for (const [key, col] of Object.entries(map)) {
      const val = patch[key as keyof typeof patch];
      if (val !== undefined) {
        fields.push(`${col} = $${i++}`);
        params.push(val);
      }
    }

    if (!fields.length) {
      const parks = await listAdminParks();
      return parks.find((p) => p.slug === slug) ?? null;
    }

    fields.push('updated_at = NOW()');
    params.push(slug);

    const { rows } = await query(
      `UPDATE parks SET ${fields.join(', ')} WHERE slug = $${i} RETURNING *`,
      params,
    );
    if (!rows.length) return null;

    const park = rowToApiPark(rows[0]);
    const tickets = await getTickets(slug);
    return { ...park, description: rows[0].description ?? '', tickets };
  }

  const base = catalogParks.find((p) => p.slug === slug);
  if (!base) return null;

  patchCatalogPark(slug, {
    name: patch.name,
    description: patch.description,
    priceFrom: patch.priceFrom,
    coverImage: patch.coverImage,
    badge: patch.badge ?? undefined,
    ratingAvg: patch.ratingAvg,
    reviewCount: patch.reviewCount,
  } as Partial<CatalogPark>);

  const parks = await listAdminParks();
  return parks.find((p) => p.slug === slug) ?? null;
}

export async function updateAdminTicket(
  parkSlug: string,
  ticketCode: string,
  patch: Partial<{ name: string; price: number; features: string[] }>,
): Promise<ApiTicket | null> {
  if (dbIsReady()) {
    const fields: string[] = [];
    const params: unknown[] = [];
    let i = 1;

    if (patch.name !== undefined) {
      fields.push(`name = $${i++}`);
      params.push(patch.name);
    }
    if (patch.price !== undefined) {
      fields.push(`price = $${i++}`);
      params.push(patch.price);
    }
    if (patch.features !== undefined) {
      fields.push(`features = $${i++}::jsonb`);
      params.push(JSON.stringify(patch.features));
    }

    if (!fields.length) {
      const tickets = await getTickets(parkSlug);
      return tickets.find((t) => t.id === ticketCode) ?? null;
    }

    params.push(parkSlug, ticketCode);
    const { rows } = await query(
      `UPDATE ticket_types tt SET ${fields.join(', ')}
       FROM parks p
       WHERE tt.park_id = p.id AND p.slug = $${i} AND tt.code = $${i + 1}
       RETURNING tt.*`,
      params,
    );
    return rows.length ? rowToTicket(rows[0]) : null;
  }

  const tickets = catalogTickets[parkSlug];
  if (!tickets?.some((t) => t.code === ticketCode)) return null;

  patchCatalogTicket(parkSlug, ticketCode, patch as Partial<CatalogTicket>);
  const updated = await getTickets(parkSlug);
  return updated.find((t) => t.id === ticketCode) ?? null;
}
