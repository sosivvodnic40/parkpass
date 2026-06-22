import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { getUserById } from '../services/auth.service';
import type { UserRole } from '../types';

const SECRET = process.env.JWT_SECRET ?? 'parkpass-dev-secret';

export interface AuthPayload {
  sub: string;
  email: string;
}

export type AuthedRequest = Request & {
  userId: string;
  userEmail: string;
  userRole?: UserRole;
};

export function signToken(payload: AuthPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): AuthPayload {
  return jwt.verify(token, SECRET) as AuthPayload;
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Требуется авторизация' });
  }
  try {
    const payload = verifyToken(header.slice(7));
    (req as AuthedRequest).userId = payload.sub;
    (req as AuthedRequest).userEmail = payload.email;
    next();
  } catch {
    return res.status(401).json({ error: 'Недействительный токен' });
  }
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) {
    try {
      const payload = verifyToken(header.slice(7));
      (req as AuthedRequest).userId = payload.sub;
      (req as AuthedRequest).userEmail = payload.email;
    } catch {
      /* ignore */
    }
  }
  next();
}

export async function attachUserRole(req: Request, res: Response, next: NextFunction) {
  const authed = req as AuthedRequest;
  if (!authed.userId) {
    return res.status(401).json({ error: 'Требуется авторизация' });
  }
  const user = await getUserById(authed.userId);
  if (!user) {
    return res.status(401).json({ error: 'Пользователь не найден' });
  }
  authed.userRole = user.role;
  next();
}

export function requireRole(...roles: UserRole[]) {
  return [
    requireAuth,
    attachUserRole,
    (req: Request, res: Response, next: NextFunction) => {
      const role = (req as AuthedRequest).userRole;
      if (!role || !roles.includes(role)) {
        return res.status(403).json({ error: 'Недостаточно прав доступа' });
      }
      next();
    },
  ];
}
