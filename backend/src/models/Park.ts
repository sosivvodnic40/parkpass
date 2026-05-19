/**
 * ParkPass — модель парка (TypeScript)
 * Соответствует таблице parks в PostgreSQL
 */

export interface ParkThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  fontFamily?: string;
  particleEffect?: 'stars' | 'speed' | 'water' | 'fog' | 'none';
  backgroundTexture?: string;
}

export interface OpeningHours {
  [day: string]: string; // e.g. "mon": "10:00-20:00"
}

export class ParkModel {
  id!: string;
  slug!: string;
  name!: string;
  description!: string | null;
  country!: string;
  city!: string;
  address!: string | null;
  latitude!: number | null;
  longitude!: number | null;
  coverImage!: string | null;
  heroVideoUrl!: string | null;
  themeConfig!: ParkThemeConfig;
  ratingAvg!: number;
  reviewCount!: number;
  priceFrom!: number | null;
  openingHours!: OpeningHours;
  isFeatured!: boolean;
  isActive!: boolean;
  createdAt!: Date;
  updatedAt!: Date;

  /** Маппинг строки БД → модель */
  static fromRow(row: Record<string, unknown>): ParkModel {
    const park = new ParkModel();
    park.id = row.id as string;
    park.slug = row.slug as string;
    park.name = row.name as string;
    park.description = (row.description as string) ?? null;
    park.country = row.country as string;
    park.city = row.city as string;
    park.address = (row.address as string) ?? null;
    park.latitude = row.latitude != null ? Number(row.latitude) : null;
    park.longitude = row.longitude != null ? Number(row.longitude) : null;
    park.coverImage = (row.cover_image as string) ?? null;
    park.heroVideoUrl = (row.hero_video_url as string) ?? null;
    park.themeConfig = (row.theme_config as ParkThemeConfig) ?? {
      primaryColor: '#6366F1',
      secondaryColor: '#8B5CF6',
    };
    park.ratingAvg = Number(row.rating_avg ?? 0);
    park.reviewCount = Number(row.review_count ?? 0);
    park.priceFrom = row.price_from != null ? Number(row.price_from) : null;
    park.openingHours = (row.opening_hours as OpeningHours) ?? {};
    park.isFeatured = Boolean(row.is_featured);
    park.isActive = Boolean(row.is_active);
    park.createdAt = new Date(row.created_at as string);
    park.updatedAt = new Date(row.updated_at as string);
    return park;
  }

  /** Публичный DTO для API */
  toJSON() {
    return {
      id: this.id,
      slug: this.slug,
      name: this.name,
      description: this.description,
      country: this.country,
      city: this.city,
      coverImage: this.coverImage,
      heroVideoUrl: this.heroVideoUrl,
      theme: this.themeConfig,
      ratingAvg: this.ratingAvg,
      reviewCount: this.reviewCount,
      priceFrom: this.priceFrom,
      openingHours: this.openingHours,
    };
  }
}
