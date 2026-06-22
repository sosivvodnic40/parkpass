import bcrypt from 'bcryptjs';
import { dbIsReady, query } from '../db/pool';
import type { ApiUser, UserRole } from '../types';

type MockUser = ApiUser & { passwordHash: string };

const mockUsers: MockUser[] = [];

async function ensureMockUsers() {
  if (mockUsers.length > 0) return;
  mockUsers.push(
    {
      id: 'u-demo',
      email: 'demo@parkpass.ru',
      passwordHash: await bcrypt.hash('demo123', 10),
      firstName: 'Шамиль',
      lastName: 'Шарипов',
      role: 'user',
      clubTier: 'gold',
      loyaltyPoints: 2400,
    },
    {
      id: 'u-admin',
      email: 'admin@parkpass.ru',
      passwordHash: await bcrypt.hash('admin123', 10),
      firstName: 'Дархан',
      lastName: 'Нурғали',
      role: 'admin',
      clubTier: 'platinum',
      loyaltyPoints: 5000,
    },
    {
      id: 'u-manager',
      email: 'manager@parkpass.ru',
      passwordHash: await bcrypt.hash('manager123', 10),
      firstName: 'Менеджер',
      lastName: 'Парка',
      role: 'park_manager',
      clubTier: 'silver',
      loyaltyPoints: 800,
    },
  );
}

function sanitize(u: ApiUser): ApiUser {
  return {
    id: u.id,
    email: u.email,
    firstName: u.firstName,
    lastName: u.lastName,
    role: u.role,
    clubTier: u.clubTier,
    loyaltyPoints: u.loyaltyPoints,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToUser(row: any): ApiUser {
  return {
    id: row.id,
    email: row.email,
    firstName: row.first_name ?? '',
    lastName: row.last_name ?? '',
    role: (row.role ?? 'user') as UserRole,
    clubTier: row.club_tier ?? 'bronze',
    loyaltyPoints: Number(row.loyalty_points ?? 0),
  };
}

export async function registerUser(input: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}): Promise<ApiUser> {
  const { email, password, firstName, lastName } = input;
  const hash = await bcrypt.hash(password, 10);

  if (dbIsReady()) {
    const exists = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (exists.rows.length) throw new Error('USER_EXISTS');
    const { rows } = await query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role)
       VALUES ($1, $2, $3, $4, 'user')
       RETURNING *`,
      [email, hash, firstName ?? 'Гость', lastName ?? ''],
    );
    return rowToUser(rows[0]);
  }

  await ensureMockUsers();
  if (mockUsers.find((u) => u.email === email)) throw new Error('USER_EXISTS');
  const user: MockUser = {
    id: `u${mockUsers.length + 1}`,
    email,
    passwordHash: hash,
    firstName: firstName ?? 'Гость',
    lastName: lastName ?? '',
    role: 'user',
    clubTier: 'bronze',
    loyaltyPoints: 0,
  };
  mockUsers.push(user);
  return sanitize(user);
}

export async function loginUser(email: string, password: string): Promise<ApiUser> {
  if (dbIsReady()) {
    const { rows } = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (!rows.length) throw new Error('INVALID_CREDENTIALS');
    const ok = await bcrypt.compare(password, rows[0].password_hash);
    if (!ok) throw new Error('INVALID_CREDENTIALS');
    return rowToUser(rows[0]);
  }

  await ensureMockUsers();
  const user = mockUsers.find((u) => u.email === email);
  if (!user) throw new Error('INVALID_CREDENTIALS');
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new Error('INVALID_CREDENTIALS');
  return sanitize(user);
}

export async function getUserById(id: string): Promise<ApiUser | null> {
  if (dbIsReady()) {
    const { rows } = await query('SELECT * FROM users WHERE id = $1', [id]);
    return rows.length ? rowToUser(rows[0]) : null;
  }
  await ensureMockUsers();
  const user = mockUsers.find((u) => u.id === id);
  return user ? sanitize(user) : null;
}

export async function listUsers(): Promise<ApiUser[]> {
  if (dbIsReady()) {
    const { rows } = await query(
      'SELECT * FROM users ORDER BY created_at DESC LIMIT 100',
    );
    return rows.map(rowToUser);
  }
  await ensureMockUsers();
  return mockUsers.map(sanitize);
}

export async function updateUserRole(userId: string, role: UserRole): Promise<ApiUser | null> {
  if (dbIsReady()) {
    const { rows } = await query(
      `UPDATE users SET role = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [role, userId],
    );
    return rows.length ? rowToUser(rows[0]) : null;
  }
  await ensureMockUsers();
  const user = mockUsers.find((u) => u.id === userId);
  if (!user) return null;
  user.role = role;
  return sanitize(user);
}
