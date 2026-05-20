import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();
const SECRET = process.env.JWT_SECRET ?? 'parkpass-dev-secret';

const users = [
  {
    id: 'u1',
    email: 'demo@parkpass.ru',
    password: 'demo123',
    firstName: 'Дархан',
    lastName: 'Пользователь',
    clubTier: 'gold',
    loyaltyPoints: 2400,
  },
];

router.post('/register', (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email и пароль обязательны' });
  }
  if (users.find((u) => u.email === email)) {
    return res.status(409).json({ error: 'Пользователь уже существует' });
  }
  const user = {
    id: `u${users.length + 1}`,
    email,
    password,
    firstName: firstName ?? 'Гость',
    lastName: lastName ?? '',
    clubTier: 'bronze',
    loyaltyPoints: 0,
  };
  users.push(user);
  const token = jwt.sign({ sub: user.id, email: user.email }, SECRET, { expiresIn: '7d' });
  res.status(201).json({ token, user: sanitize(user) });
});

router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: 'Неверный email или пароль' });
  const token = jwt.sign({ sub: user.id, email: user.email }, SECRET, { expiresIn: '7d' });
  res.json({ token, user: sanitize(user) });
});

router.get('/me', (req: Request, res: Response) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const payload = jwt.verify(header.slice(7), SECRET) as { sub: string };
    const user = users.find((u) => u.id === payload.sub);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(sanitize(user));
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

function sanitize(u: (typeof users)[0]) {
  return {
    id: u.id,
    email: u.email,
    firstName: u.firstName,
    lastName: u.lastName,
    clubTier: u.clubTier,
    loyaltyPoints: u.loyaltyPoints,
  };
}

export default router;
