/** Базовый URL API — 127.0.0.1 надёжнее localhost на Windows (IPv6) */
export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:4000';
