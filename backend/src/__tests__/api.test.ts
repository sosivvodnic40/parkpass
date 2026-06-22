import request from 'supertest';
import { createApp } from '../app';

process.env.USE_MOCK = 'true';
delete process.env.DATABASE_URL;

const app = createApp();

describe('ParkPass API (mock mode)', () => {
  let userToken: string;
  let adminToken: string;

  beforeAll(async () => {
    const userLogin = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'demo@parkpass.ru', password: 'demo123' });
    userToken = userLogin.body.token;

    const adminLogin = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@parkpass.ru', password: 'admin123' });
    adminToken = adminLogin.body.token;
  });

  test('GET /health returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.database).toBe('mock');
  });

  test('GET /parks returns 4 parks', async () => {
    const res = await request(app).get('/api/v1/parks');
    expect(res.status).toBe(200);
    expect(res.body.meta.total).toBe(4);
  });

  test('GET /parks/:slug/schedule returns weekly schedule', async () => {
    const res = await request(app).get('/api/v1/parks/marvel-avengers-california/schedule');
    expect(res.status).toBe(200);
    expect(res.body.weeklySchedule).toHaveLength(7);
  });

  test('GET /parks/:slug/availability checks slots', async () => {
    const res = await request(app).get(
      '/api/v1/parks/jurassic-islands-orlando/availability?date=2026-08-01&guests=2',
    );
    expect(res.status).toBe(200);
    expect(res.body.isAvailable).toBe(true);
  });

  test('GET /reviews?parkSlug returns reviews', async () => {
    const res = await request(app).get(
      '/api/v1/reviews?parkSlug=star-wars-galaxys-edge',
    );
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('POST /reviews creates review with JWT', async () => {
    const res = await request(app)
      .post('/api/v1/reviews')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        parkSlug: 'harry-potter-hogsmeade-orlando',
        rating: 5,
        title: 'Тестовый отзыв',
        body: 'Отличный парк',
      });
    expect(res.status).toBe(201);
    expect(res.body.rating).toBe(5);
  });

  test('GET /bookings/me returns demo booking', async () => {
    const res = await request(app)
      .get('/api/v1/bookings/me')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('POST /bookings creates booking', async () => {
    const res = await request(app)
      .post('/api/v1/bookings')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        parkSlug: 'marvel-avengers-california',
        ticketId: 't1',
        visitDate: '2026-09-01',
        guests: 2,
        totalAmount: 298,
      });
    expect(res.status).toBe(201);
    expect(res.body.qrCode).toBeTruthy();
  });

  test('GET /admin/stats forbidden for user', async () => {
    const res = await request(app)
      .get('/api/v1/admin/stats')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(403);
  });

  test('GET /admin/stats works for admin', async () => {
    const res = await request(app)
      .get('/api/v1/admin/stats')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.parksTotal).toBe(4);
  });

  test('GET /admin/reports/visitors works for admin', async () => {
    const res = await request(app)
      .get('/api/v1/admin/reports/visitors')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.totalGuests).toBeGreaterThan(0);
  });

  test('GET /admin/reviews lists all reviews for admin', async () => {
    const res = await request(app)
      .get('/api/v1/admin/reviews')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  test('PATCH /admin/reviews/:id toggles approval', async () => {
    const list = await request(app)
      .get('/api/v1/admin/reviews')
      .set('Authorization', `Bearer ${adminToken}`);
    const review = list.body.data[0];
    const res = await request(app)
      .patch(`/api/v1/admin/reviews/${review.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ isApproved: false });
    expect(res.status).toBe(200);
    expect(res.body.isApproved).toBe(false);
  });
});
