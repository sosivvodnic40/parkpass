const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

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
}): Promise<Park[]> {
  const q = new URLSearchParams();
  if (params?.category) q.set('category', params.category);
  if (params?.city) q.set('city', params.city);
  const res = await fetch(`${API}/api/v1/parks?${q}`, { cache: 'no-store' });
  const json = await res.json();
  return json.data ?? [];
}

export async function getPark(slug: string): Promise<Park | null> {
  const res = await fetch(`${API}/api/v1/parks/${slug}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

export async function getAttractions(slug: string): Promise<Attraction[]> {
  const res = await fetch(`${API}/api/v1/parks/${slug}/attractions`, {
    cache: 'no-store',
  });
  return res.json();
}

export async function getTickets(slug: string): Promise<TicketType[]> {
  const res = await fetch(`${API}/api/v1/parks/${slug}/tickets`, {
    cache: 'no-store',
  });
  return res.json();
}

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${API}/api/v1/parks/categories/list`, {
    cache: 'no-store',
  });
  return res.json();
}
