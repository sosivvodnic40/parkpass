# ParkPass — техническая архитектура

## Обзор

Монорепозиторий с разделением на `frontend` (Next.js) и `backend` (NestJS). Коммуникация через REST API v1, авторизация JWT (access + refresh).

## Frontend (Next.js 14)

```
frontend/
├── src/
│   ├── app/                 # App Router
│   │   ├── page.tsx         # Главная
│   │   ├── parks/
│   │   ├── checkout/
│   │   ├── account/
│   │   └── admin/
│   ├── components/
│   ├── hooks/
│   ├── lib/api.ts
│   └── styles/
└── package.json
```

**Ключевые библиотеки:** React 18, TypeScript, Tailwind CSS, Framer Motion, React Query, Zustand, Mapbox GL.

## Backend (NestJS)

```
backend/
├── src/
│   ├── auth/          # JWT, guards
│   ├── users/
│   ├── parks/
│   ├── attractions/
│   ├── bookings/
│   ├── reviews/
│   ├── favorites/
│   └── admin/
├── prisma/
│   └── schema.prisma
└── package.json
```

## REST API (основные эндпоинты)

| Method | Endpoint | Описание |
|--------|----------|----------|
| POST | `/api/v1/auth/register` | Регистрация |
| POST | `/api/v1/auth/login` | Вход → JWT |
| GET | `/api/v1/parks` | Каталог (query: city, minPrice, rating) |
| GET | `/api/v1/parks/:slug` | Детали парка |
| GET | `/api/v1/parks/:slug/attractions` | Аттракционы |
| POST | `/api/v1/bookings` | Создать бронь |
| GET | `/api/v1/bookings/me` | Мои брони |
| POST | `/api/v1/favorites` | Добавить в избранное |
| GET | `/api/v1/reviews?parkId=` | Отзывы |
| POST | `/api/v1/reviews` | Создать отзыв |

## Безопасность

- bcrypt для паролей (cost 12)
- JWT access (15m) + refresh (7d) в httpOnly cookie
- Rate limiting (100 req/min)
- Валидация DTO (class-validator)
- CORS только для домена фронтенда

## Деплой (рекомендация)

| Слой | Сервис |
|------|--------|
| Frontend | Vercel |
| Backend | Railway / Render |
| БД | Supabase PostgreSQL |
| Медиа | Cloudinary |
| CI/CD | GitHub Actions |

## Масштабирование

- Кэш Redis для каталога парков
- CDN для статики и видео Hero
- Read replicas PostgreSQL при росте нагрузки
