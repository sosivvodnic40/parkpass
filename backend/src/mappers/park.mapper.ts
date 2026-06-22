import type { ApiPark, ApiAttraction, ApiTicket } from '../types';
import type { CatalogPark } from '../data/catalog';

export function catalogToApiPark(p: CatalogPark): ApiPark {
  return {
    id: p.legacyId,
    slug: p.slug,
    name: p.name,
    description: p.description,
    city: p.city,
    country: p.country,
    region: p.region,
    ratingAvg: p.ratingAvg,
    reviewCount: p.reviewCount,
    priceFrom: p.priceFrom,
    coverImage: p.coverImage,
    category: p.category,
    brand: p.brand,
    badge: p.badge,
    isFeatured: p.isFeatured,
    zones: p.zones,
    theme: p.theme,
    openingHours: p.openingHours,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function rowToApiPark(row: any): ApiPark {
  const theme = row.theme_config ?? {};
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description ?? '',
    city: row.city,
    country: row.country,
    region: row.region ?? '',
    ratingAvg: Number(row.rating_avg),
    reviewCount: Number(row.review_count),
    priceFrom: Number(row.price_from),
    coverImage: row.cover_image ?? '',
    category: row.category ?? '',
    brand: row.brand ?? 'universal',
    badge: row.badge,
    isFeatured: Boolean(row.is_featured),
    zones: Number(row.zones ?? 1),
    theme: {
      primaryColor: theme.primaryColor ?? '#6366f1',
      secondaryColor: theme.secondaryColor ?? '#312e81',
    },
    openingHours: row.opening_hours ?? {},
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function rowToAttraction(row: any): ApiAttraction {
  return {
    id: row.code ?? row.slug ?? row.id,
    name: row.name,
    category: row.category ?? '',
    avgWaitMin: Number(row.avg_wait_min ?? 0),
    imageUrl: row.image_url ?? '',
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function rowToTicket(row: any): ApiTicket {
  const features = Array.isArray(row.features)
    ? row.features
    : typeof row.features === 'string'
      ? JSON.parse(row.features)
      : [];
  return {
    id: row.code ?? row.id,
    name: row.name,
    price: Number(row.price),
    features,
  };
}
