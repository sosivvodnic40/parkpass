import bcrypt from 'bcryptjs';
import {
  catalogAttractions,
  catalogCategories,
  catalogParks,
  catalogTickets,
  REMOVED_PARK_SLUGS,
} from '../data/catalog';
import { seedReviewsIfEmpty } from '../services/review.service';
import { query } from './pool';

/** Удаляет Nintendo, Avatar, Тачки, Toy Story из PostgreSQL */
async function purgeRemovedParks(): Promise<void> {
  const { rowCount } = await query(
    `DELETE FROM parks
     WHERE slug = ANY($1)
        OR category NOT IN ('star-wars', 'harry-potter', 'marvel', 'jurassic')`,
    [[...REMOVED_PARK_SLUGS]],
  );
  if (rowCount && rowCount > 0) {
    console.log(`[seed] Removed ${rowCount} obsolete park(s) from database`);
  }
}

async function seedUsers(): Promise<void> {
  const users = [
    {
      email: 'demo@parkpass.ru',
      password: 'demo123',
      firstName: 'Шамиль',
      lastName: 'Шарипов',
      role: 'user',
      clubTier: 'gold',
      points: 2400,
    },
    {
      email: 'admin@parkpass.ru',
      password: 'admin123',
      firstName: 'Дархан',
      lastName: 'Нурғали',
      role: 'admin',
      clubTier: 'platinum',
      points: 5000,
    },
    {
      email: 'manager@parkpass.ru',
      password: 'manager123',
      firstName: 'Менеджер',
      lastName: 'Парка',
      role: 'park_manager',
      clubTier: 'silver',
      points: 800,
    },
  ];

  for (const u of users) {
    const hash = await bcrypt.hash(u.password, 10);
    await query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role, club_tier, loyalty_points)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (email) DO UPDATE SET
         role = EXCLUDED.role,
         first_name = EXCLUDED.first_name,
         last_name = EXCLUDED.last_name`,
      [u.email, hash, u.firstName, u.lastName, u.role, u.clubTier, u.points],
    );
  }
  console.log('[seed] Users ready (demo, admin, manager)');
}

export async function seedDatabase(): Promise<void> {
  await purgeRemovedParks();
  await seedUsers();

  const { rows } = await query<{ count: string }>('SELECT COUNT(*)::text AS count FROM parks');
  if (Number(rows[0]?.count) > 0) {
    console.log('[seed] Parks already exist — skip parks insert');
    await seedReviewsIfEmpty();
    return;
  }

  console.log('[seed] Inserting parks, attractions, tickets...');

  for (const p of catalogParks) {
    const { rows: parkRows } = await query<{ id: string }>(
      `INSERT INTO parks (
        slug, name, description, country, city, region, cover_image,
        theme_config, rating_avg, review_count, price_from, opening_hours,
        category, brand, badge, zones, is_featured
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
      RETURNING id`,
      [
        p.slug,
        p.name,
        p.description,
        p.country,
        p.city,
        p.region,
        p.coverImage,
        JSON.stringify(p.theme),
        p.ratingAvg,
        p.reviewCount,
        p.priceFrom,
        JSON.stringify(p.openingHours),
        p.category,
        p.brand,
        p.badge,
        p.zones,
        p.isFeatured,
      ],
    );
    const parkId = parkRows[0].id;

    const attrs = catalogAttractions[p.slug] ?? [
      {
        code: 'g1',
        name: 'Главный аттракцион',
        category: 'Хит',
        wait: 45,
        img: p.coverImage,
      },
    ];
    for (const a of attrs) {
      await query(
        `INSERT INTO attractions (park_id, slug, code, name, category, image_url, avg_wait_min)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [parkId, a.code, a.code, a.name, a.category, a.img, a.wait],
      );
    }

    const tickets = catalogTickets[p.slug] ?? [];
    for (const t of tickets) {
      await query(
        `INSERT INTO ticket_types (park_id, code, name, price, features)
         VALUES ($1, $2, $3, $4, $5)`,
        [parkId, t.code, t.name, t.price, JSON.stringify(t.features)],
      );
    }
  }

  const { rows: users } = await query<{ id: string }>(
    `SELECT id FROM users WHERE email = $1`,
    ['demo@parkpass.ru'],
  );
  const { rows: swPark } = await query<{ id: string }>(
    `SELECT id FROM parks WHERE slug = $1`,
    ['star-wars-galaxys-edge'],
  );
  const { rows: swTicket } = await query<{ id: string }>(
    `SELECT tt.id FROM ticket_types tt
     JOIN parks p ON p.id = tt.park_id
     WHERE p.slug = $1 AND tt.code = 't1'`,
    ['star-wars-galaxys-edge'],
  );

  if (users[0] && swPark[0] && swTicket[0]) {
    const existing = await query(
      `SELECT id FROM bookings WHERE user_id = $1 AND qr_code = $2`,
      [users[0].id, 'PP-DEMO-SWGE'],
    );
    if (!existing.rows.length) {
      await query(
        `INSERT INTO bookings (
          user_id, park_id, ticket_type_id, visit_date, guests_adult,
          total_amount, status, qr_code, payment_ref
        ) VALUES ($1,$2,$3,$4,$5,$6,'paid',$7,$8)`,
        [
          users[0].id,
          swPark[0].id,
          swTicket[0].id,
          '2026-06-15',
          2,
          278,
          'PP-DEMO-SWGE',
          'demo-payment',
        ],
      );
    }
  }

  await seedReviewsIfEmpty();
  console.log(`[seed] Done — ${catalogParks.length} parks, categories: ${catalogCategories.length}`);
}
