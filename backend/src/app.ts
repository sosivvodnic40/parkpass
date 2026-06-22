import express from 'express';
import cors from 'cors';
import parksRouter from './routes/parks';
import authRouter from './routes/auth';
import bookingsRouter from './routes/bookings';
import favoritesRouter from './routes/favorites';
import reviewsRouter from './routes/reviews';
import adminRouter from './routes/admin';
import { dbIsReady } from './db/pool';

export function createApp() {
  const app = express();

  const allowedOrigins = new Set([
    process.env.FRONTEND_URL ?? 'http://localhost:3000',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
  ]);

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.has(origin)) {
          callback(null, true);
          return;
        }
        callback(new Error(`CORS blocked for origin: ${origin}`));
      },
    }),
  );
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'parkpass-api',
      version: '2.1.0',
      database: dbIsReady() ? 'postgresql' : 'mock',
    });
  });

  app.use('/api/v1/parks', parksRouter);
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/bookings', bookingsRouter);
  app.use('/api/v1/favorites', favoritesRouter);
  app.use('/api/v1/reviews', reviewsRouter);
  app.use('/api/v1/admin', adminRouter);

  return app;
}
