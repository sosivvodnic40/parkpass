import express from 'express';
import cors from 'cors';
import parksRouter from './routes/parks';
import authRouter from './routes/auth';
import bookingsRouter from './routes/bookings';

const app = express();
const PORT = process.env.PORT ?? 4000;

app.use(cors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:3000' }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'parkpass-api', version: '1.0.0' });
});

app.use('/api/v1/parks', parksRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/bookings', bookingsRouter);

app.listen(PORT, () => {
  console.log(`ParkPass API running on http://localhost:${PORT}`);
});
