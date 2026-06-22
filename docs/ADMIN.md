# Инструкция администратора ParkPass API

## Учётные записи (после seed)

| Роль | Email | Пароль | Доступ |
|------|-------|--------|--------|
| Пользователь | demo@parkpass.ru | demo123 | Брони, избранное, отзывы |
| Менеджер парка | manager@parkpass.ru | manager123 | Статистика, брони, отчёты |
| Администратор | admin@parkpass.ru | admin123 | Полный доступ + пользователи |

## Запуск

```powershell
docker compose up -d
copy backend\.env.example backend\.env
cd backend
npm install
npm run db:seed
npm run dev
```

Проверка: `GET http://127.0.0.1:4000/health` → `"database": "postgresql"`.

## Роли

- **user** — обычный посетитель
- **park_manager** — просмотр статистики, всех броней, отчётов; смена статуса брони
- **admin** — всё выше + список пользователей и смена ролей

## Админ-эндпоинты

Все запросы с заголовком `Authorization: Bearer <token>`.

### Статистика

```
GET /api/v1/admin/stats
```

Возвращает: число пользователей, парков, броней, выручку, разбивку по статусам и паркам.

### Бронирования

```
GET /api/v1/admin/bookings?parkSlug=&status=&from=&to=
PATCH /api/v1/admin/bookings/:id/status
Body: { "status": "cancelled" }
```

Статусы: `pending`, `paid`, `cancelled`, `completed`.

### Пользователи (только admin)

```
GET /api/v1/admin/users
PATCH /api/v1/admin/users/:id/role
Body: { "role": "park_manager" }
```

### Отзывы (модерация)

```
GET    /api/v1/admin/reviews?parkSlug=&approved=true|false
PATCH  /api/v1/admin/reviews/:id
Body:  { "isApproved": true, "isVerified": true, "rating": 5 }
DELETE /api/v1/admin/reviews/:id
```

Новые отзывы пользователей создаются со статусом `isApproved: false` и требуют публикации администратором.

### Отчёты

```
GET /api/v1/admin/reports/bookings?from=2026-01-01&to=2026-12-31
GET /api/v1/admin/reports/visitors?from=2026-01-01&to=2026-12-31
```

## Расписание и доступность

```
GET /api/v1/parks/:slug/schedule
GET /api/v1/parks/:slug/availability?date=2026-07-01&guests=2
```

## Резервное копирование PostgreSQL

```powershell
docker exec parkpass-db pg_dump -U parkpass parkpass > backup.sql
```

## Безопасность

- Смените `JWT_SECRET` в production
- Не используйте демо-пароли на боевом сервере
- Ограничьте CORS через `FRONTEND_URL` в `.env`
