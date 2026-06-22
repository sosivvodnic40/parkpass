import 'dotenv/config';
import { initDb, closeDb } from '../db/pool';
import { seedDatabase } from '../db/seed';
async function main() {
  const connected = await initDb();
  if (!connected) {
    console.error('DATABASE_URL required for seed. Copy backend/.env.example → backend/.env');
    process.exit(1);
  }
  await seedDatabase();
  await closeDb();
  console.log('Seed completed.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
