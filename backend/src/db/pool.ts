import { Pool, QueryResultRow } from 'pg';

let pool: Pool | null = null;
let dbReady = false;

function normalizeDatabaseUrl(url: string): string {
  return url.replace('@localhost:', '@127.0.0.1:').replace('//localhost:', '//127.0.0.1:');
}

export function isDbEnabled(): boolean {
  if (process.env.USE_MOCK === 'true') return false;
  return Boolean(process.env.DATABASE_URL);
}

export function getPool(): Pool {
  if (!pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not set');
    }
    const connectionString = normalizeDatabaseUrl(process.env.DATABASE_URL);
    pool = new Pool({ connectionString });
  }
  return pool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[],
): Promise<{ rows: T[]; rowCount: number }> {
  const result = await getPool().query<T>(text, params);
  return { rows: result.rows, rowCount: result.rowCount ?? 0 };
}

export async function initDb(): Promise<boolean> {
  if (!isDbEnabled()) {
    console.log('[db] Mock mode — DATABASE_URL not set or USE_MOCK=true');
    return false;
  }
  try {
    await getPool().query('SELECT 1');
    dbReady = true;
    console.log('[db] PostgreSQL connected');
    return true;
  } catch {
    console.warn('[db] PostgreSQL недоступен — mock-режим (in-memory)');
    dbReady = false;
    return false;
  }
}

export function dbIsReady(): boolean {
  return dbReady;
}

export async function closeDb(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
    dbReady = false;
  }
}
