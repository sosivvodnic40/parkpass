# ParkPass — агрегатор бронирования тематических парков

**ParkPass** — веб-платформа для поиска, сравнения и бронирования билетов в тематические парки.

> Дипломный проект · Дархан, Шамиль  
> Репозиторий: [github.com/sosivvodnic40/parkpass](https://github.com/sosivvodnic40/parkpass)

## Страницы приложения

| URL | Описание |
|-----|----------|
| `/` | Главная — поиск, featured-парки, категории |
| `/parks` | Каталог с фильтрами |
| `/parks/[slug]` | Страница парка — билеты, аттракционы |
| `/checkout` | Оформление бронирования |
| `/auth` | Вход / регистрация |
| `/account` | Личный кабинет |
| `/favorites` | Избранное |
| `/admin` | Админ-панель (демо) |

## Быстрый старт

```bash
# Backend (порт 4000)
cd backend
npm install
npm run dev

# Frontend (порт 3000)
cd frontend
npm install
npm run dev
```

Откройте http://localhost:3000

**Демо-вход:** `demo@parkpass.ru` / `demo123`

## Стек

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, JWT
- **БД:** PostgreSQL (схема в `database/schema.sql`, demo — mock API)

## Документация

- [docs/CONCEPT.md](docs/CONCEPT.md) — концепция продукта
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — архитектура API
- [docs/DIPLOMA_BRIEF.md](docs/DIPLOMA_BRIEF.md) — тезисы для защиты

## API

```
GET  /api/v1/parks
GET  /api/v1/parks/:slug
GET  /api/v1/parks/:slug/attractions
GET  /api/v1/parks/:slug/tickets
POST /api/v1/auth/login
POST /api/v1/auth/register
POST /api/v1/bookings
```

© 2026 ParkPass Team
