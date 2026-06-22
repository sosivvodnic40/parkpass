import { API_BASE } from '@/lib/config';

const API = API_BASE;

/** Единственные актуальные вселенные на сайте */
const ALLOWED_CATEGORIES = new Set(['star-wars', 'harry-potter', 'marvel', 'jurassic']);

export async function safeFetch(input: string, init?: RequestInit): Promise<Response | null> {
  try {
    return await fetch(input, init);
  } catch {
    return null;
  }
}

export const BACKEND_HINT = 'Запустите backend: cd backend && npm run dev (порт 4000)';

export interface Park {
  id: string;
  slug: string;
  name: string;
  description: string;
  city: string;
  country: string;
  region: string;
  ratingAvg: number;
  reviewCount: number;
  priceFrom: number;
  coverImage: string;
  category: string;
  brand?: string | null;
  badge: string | null;
  isFeatured: boolean;
  zones: number;
  theme: { primaryColor: string; secondaryColor: string };
  openingHours: Record<string, string>;
}

export interface Attraction {
  id: string;
  name: string;
  category: string;
  avgWaitMin: number;
  imageUrl: string;
}

export interface TicketType {
  id: string;
  name: string;
  price: number;
  features: string[];
}

export interface Category {
  id: string;
  name: string;
  count: number;
  image: string;
}

export async function getParks(params?: {
  category?: string;
  city?: string;
  brand?: string;
}): Promise<Park[]> {
  const q = new URLSearchParams();
  if (params?.category) q.set('category', params.category);
  if (params?.city) q.set('city', params.city);
  if (params?.brand) q.set('brand', params.brand);
  const res = await safeFetch(`${API}/api/v1/parks?${q}`, { cache: 'no-store' });
  if (!res?.ok) return [];
  const json = await res.json();
  return (json.data ?? []).filter((p: Park) => ALLOWED_CATEGORIES.has(p.category));
}

export async function getPark(slug: string): Promise<Park | null> {
  const res = await safeFetch(`${API}/api/v1/parks/${slug}`, { cache: 'no-store' });
  if (!res?.ok) return null;
  const park: Park = await res.json();
  return ALLOWED_CATEGORIES.has(park.category) ? park : null;
}

export async function getAttractions(slug: string): Promise<Attraction[]> {
  const res = await safeFetch(`${API}/api/v1/parks/${slug}/attractions`, {
    cache: 'no-store',
  });
  if (!res?.ok) return [];
  return res.json();
}

export async function getTickets(slug: string): Promise<TicketType[]> {
  const res = await safeFetch(`${API}/api/v1/parks/${slug}/tickets`, {
    cache: 'no-store',
  });
  if (!res?.ok) return [];
  return res.json();
}

export async function getCategories(): Promise<Category[]> {
  const res = await safeFetch(`${API}/api/v1/parks/categories/list`, {
    cache: 'no-store',
  });
  if (!res?.ok) return [];
  const items: Category[] = await res.json();
  return items.filter((c) => ALLOWED_CATEGORIES.has(c.id));
}

export interface Booking {
  id: string;
  parkSlug: string;
  parkName: string;
  ticketName?: string;
  visitDate: string;
  guests: number;
  totalAmount: number;
  status: string;
  qrCode: string;
  createdAt?: string;
}

export async function getMyBookings(token: string): Promise<Booking[]> {
  const res = await safeFetch(`${API}/api/v1/bookings/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res?.ok) return [];
  return res.json();
}

export async function createBooking(
  token: string,
  body: {
    parkSlug: string;
    parkName: string;
    ticketId: string;
    ticketName?: string;
    visitDate?: string;
    guests: number;
    totalAmount: number;
  },
): Promise<Booking | null> {
  const res = await safeFetch(`${API}/api/v1/bookings`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res?.ok) return null;
  return res.json();
}

export interface Review {
  id: string;
  parkSlug: string;
  userName: string;
  rating: number;
  title: string | null;
  body: string | null;
  visitDate: string | null;
  isVerified: boolean;
  createdAt: string;
}

export async function getReviews(parkSlug: string): Promise<Review[]> {
  const res = await safeFetch(
    `${API}/api/v1/reviews?parkSlug=${encodeURIComponent(parkSlug)}`,
    { cache: 'no-store' },
  );
  if (!res?.ok) return [];
  const json = await res.json();
  return json.data ?? [];
}

export async function createReview(
  token: string,
  body: {
    parkSlug: string;
    rating: number;
    title?: string;
    body?: string;
    visitDate?: string;
  },
): Promise<Review | null> {
  const res = await safeFetch(`${API}/api/v1/reviews`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res?.ok) return null;
  return res.json();
}
