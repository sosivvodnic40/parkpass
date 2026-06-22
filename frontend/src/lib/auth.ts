import { API_BASE } from '@/lib/config';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: string;
  clubTier: string;
  loyaltyPoints: number;
}

const TOKEN_KEY = 'parkpass_token';
const USER_KEY = 'parkpass_user';

export function saveSession(token: string, user: User) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function authHeaders(): HeadersInit {
  const token = getToken();
  return token
    ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    : { 'Content-Type': 'application/json' };
}

export function getUser(): User | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export const FAVORITES_KEY = 'parkpass_favorites';

export function getFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(FAVORITES_KEY);
  return raw ? (JSON.parse(raw) as string[]) : [];
}

export function toggleFavorite(slug: string): string[] {
  const list = getFavorites();
  const next = list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug];
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  syncFavoriteWithApi(slug, !list.includes(slug));
  return next;
}

const API = API_BASE;

async function syncFavoriteWithApi(slug: string, adding: boolean) {
  const token = getToken();
  if (!token) return;
  try {
    if (adding) {
      await fetch(`${API}/api/v1/favorites`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ parkSlug: slug }),
      });
    } else {
      await fetch(`${API}/api/v1/favorites/${slug}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
    }
  } catch {
    /* offline fallback — localStorage already updated */
  }
}

export async function loadFavoritesFromApi(): Promise<string[]> {
  const token = getToken();
  if (!token) return getFavorites();
  try {
    const res = await fetch(`${API}/api/v1/favorites`, {
      headers: authHeaders(),
      cache: 'no-store',
    });
    if (!res.ok) return getFavorites();
    const json = (await res.json()) as { slugs: string[] };
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(json.slugs ?? []));
    return json.slugs ?? [];
  } catch {
    return getFavorites();
  }
}
