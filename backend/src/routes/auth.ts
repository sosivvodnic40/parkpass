import { Router, Request, Response } from 'express';
import { signToken, verifyToken } from '../middleware/auth';
import { getUserById, loginUser, registerUser } from '../services/auth.service';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email и пароль обязательны' });
  }
  try {
    const user = await registerUser({ email, password, firstName, lastName });
    const token = signToken({ sub: user.id, email: user.email });
    res.status(201).json({ token, user });
  } catch (e) {
    if (e instanceof Error && e.message === 'USER_EXISTS') {
      return res.status(409).json({ error: 'Пользователь уже существует' });
    }
    console.error(e);
    res.status(500).json({ error: 'Ошибка регистрации' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await loginUser(email, password);
    const token = signToken({ sub: user.id, email: user.email });
    res.json({ token, user });
  } catch {
    res.status(401).json({ error: 'Неверный email или пароль' });
  }
});

router.get('/me', async (req: Request, res: Response) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const payload = verifyToken(header.slice(7));
    const user = await getUserById(payload.sub);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
