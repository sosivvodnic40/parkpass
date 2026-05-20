export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
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
  return next;
}
