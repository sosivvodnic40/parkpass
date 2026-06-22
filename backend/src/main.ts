import { createApp } from './app';
import { initDb, dbIsReady } from './db/pool';
import { seedDatabase } from './db/seed';

const PORT = process.env.PORT ?? 4000;

async function start() {
  const connected = await initDb();
  if (connected) {
    try {
      await seedDatabase();
    } catch (err) {
      console.error('[seed] Failed:', err);
    }
  }

  const app = createApp();
  app.listen(PORT, () => {
    console.log(`ParkPass API v2.1 → http://127.0.0.1:${PORT}`);
    console.log(`Mode: ${dbIsReady() ? 'PostgreSQL' : 'in-memory mock'}`);
  });
}

if (require.main === module) {
  start().catch((err) => {
    console.error('Failed to start:', err);
    process.exit(1);
  });
}
