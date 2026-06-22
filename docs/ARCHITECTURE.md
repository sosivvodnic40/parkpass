# ParkPass — техническая архитектура (Backend)

## Обзор

Монорепозиторий: `frontend` (Next.js 14) + `backend` (Express + TypeScript).  
Коммуникация через REST API v1, авторизация JWT (Bearer token).

## Backend (Express 4 + TypeScript)

```
backend/src/
├── main.ts              # Запуск сервера
├── app.ts               # createApp() — для тестов и prod
├── routes/
│   ├── auth.ts          # register, login, me
│   ├── parks.ts         # каталог, schedule, availability
│   ├── bookings.ts      # бронирования
│   ├── favorites.ts     # избранное
│   ├── reviews.ts       # отзывы
│   └── admin.ts         # статистика, отчёты, роли
├── services/            # бизнес-логика
│   ├── auth.service.ts
│   ├── park.service.ts
│   ├── booking.service.ts
│   ├── favorite.service.ts
│   ├── review.service.ts
│   ├── schedule.service.ts
│   └── admin.service.ts
├── middleware/auth.ts   # JWT, requireRole
├── data/catalog.ts      # 4 парка, seed-данные
├── db/pool.ts, seed.ts  # PostgreSQL
└── __tests__/api.test.ts
```

## Роли пользователей

| Роль | ENUM в БД | Права |
|------|-----------|-------|
| user | user | Брони, избранное, отзывы |
| park_manager | park_manager | Статистика, брони, отчёты |
| admin | admin | + управление пользователями |

## REST API

Полная спецификация: [API.md](API.md)

## База данных (PostgreSQL 16)

Таблицы: `users`, `parks`, `attractions`, `ticket_types`, `bookings`, `reviews`, `favorites`.

Схема: `database/schema.sql`  
Контейнер: `docker-compose.yml`

## Режимы работы

1. **PostgreSQL** — `DATABASE_URL` в `.env`, данные персистентны
2. **Mock** — без БД, in-memory для разработки frontend и автотестов

## Безопасность

- bcrypt (cost 10) для паролей
- JWT 7 дней, секрет через `JWT_SECRET`
- RBAC middleware `requireRole()`
- CORS ограничен `FRONTEND_URL`

## Тестирование и CI

```powershell
cd backend && npm test
```

GitHub Actions: `.github/workflows/backend-ci.yml`

## Деплой (рекомендация)

| Слой | Сервис |
|------|--------|
| Backend | Railway / Render |
| БД | Supabase PostgreSQL / Docker |
| Frontend | Vercel |
