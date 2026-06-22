# ParkPass REST API v2.1

Базовый URL: `http://127.0.0.1:4000/api/v1` (на Windows надёжнее, чем `localhost`)

## Health

```
GET /health
→ { status, service, version: "2.1.0", database: "postgresql" | "mock" }
```

## Аутентификация (JWT)

| Метод | Путь | Описание |
|-------|------|----------|
| POST | `/auth/register` | Регистрация (роль user) |
| POST | `/auth/login` | Вход |
| GET | `/auth/me` | Профиль (Bearer token) |

**Response user:** `{ id, email, firstName, lastName, role, clubTier, loyaltyPoints }`

**Демо-аккаунты:**

| Email | Пароль | Роль |
|-------|--------|------|
| demo@parkpass.ru | demo123 | user |
| admin@parkpass.ru | admin123 | admin |
| manager@parkpass.ru | manager123 | park_manager |

## Парки

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/parks` | Список (category, city, brand, minRating, maxPrice) |
| GET | `/parks/:slug` | Один парк |
| GET | `/parks/:slug/attractions` | Аттракционы |
| GET | `/parks/:slug/tickets` | Тарифы |
| GET | `/parks/:slug/schedule` | Расписание работы (неделя) |
| GET | `/parks/:slug/availability?date=&guests=` | Доступность на дату |
| GET | `/parks/categories/list` | Категории вселенных |

## Бронирования (JWT)

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/bookings/me` | История пользователя |
| POST | `/bookings` | Создать бронирование |

## Избранное (JWT)

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/favorites` | Slugs парков |
| GET | `/favorites?full=true` | Полные объекты |
| POST | `/favorites` | `{ "parkSlug" }` |
| POST | `/favorites/toggle` | Переключить |
| DELETE | `/favorites/:slug` | Удалить |

## Отзывы

| Метод | Путь | Auth | Описание |
|-------|------|------|----------|
| GET | `/reviews?parkSlug=` | — | Список отзывов парка |
| POST | `/reviews` | JWT | Создать отзыв (rating 1–5) |

## Администрирование

Роли: **admin**, **park_manager** (кроме users/role — только admin).

| Метод | Путь | Роли | Описание |
|-------|------|------|----------|
| GET | `/admin/stats` | admin, manager | Общая статистика |
| GET | `/admin/bookings` | admin, manager | Все брони (фильтры) |
| PATCH | `/admin/bookings/:id/status` | admin, manager | Смена статуса |
| GET | `/admin/reviews` | admin, manager | Все отзывы (модерация) |
| PATCH | `/admin/reviews/:id` | admin, manager | Одобрить / скрыть / проверить |
| DELETE | `/admin/reviews/:id` | admin, manager | Удалить отзыв |
| GET | `/admin/users` | admin | Список пользователей |
| PATCH | `/admin/users/:id/role` | admin | Смена роли |
| GET | `/admin/reports/bookings` | admin, manager | Отчёт по броням |
| GET | `/admin/reports/visitors` | admin, manager | Отчёт по посетителям |

## База данных

- Схема: `database/schema.sql`
- Docker: `docker compose up -d`
- Seed: `cd backend && npm run db:seed`
- Инструкция администратора: [ADMIN.md](ADMIN.md)
- Протокол тестирования: [TESTING.md](TESTING.md)
