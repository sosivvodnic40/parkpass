# ParkPass — агрегатор бронирования тематических парков

**Дипломный проект** · Шарипов Шамиль · ИС-23-19б · ASTANA POLYTECHNIC · 2026

Веб-платформа для поиска, сравнения и бронирования билетов в тематические парки: Star Wars, Harry Potter, Marvel и Jurassic World.

## Быстрый старт

### 1. PostgreSQL (рекомендуется для защиты)

```powershell
docker compose up -d
copy backend\.env.example backend\.env
cd backend
npm install
npm run db:seed
npm run dev
```

### 2. Frontend

```powershell
cd frontend
copy .env.example .env.local
npm install
npm run dev
```

Откройте http://localhost:3000 (API по умолчанию: http://127.0.0.1:4000)

**Демо-вход:** `demo@parkpass.ru` / `demo123`  
**Админ:** `admin@parkpass.ru` / `admin123`  
**Менеджер:** `manager@parkpass.ru` / `manager123`

### Без Docker

Backend работает в mock-режиме (данные в памяти). Просто:

```powershell
cd backend && npm install && npm run dev
cd frontend && npm install && npm run dev
```

## Стек

| Слой | Технологии |
|------|------------|
| Frontend | Next.js 14, React, TypeScript, Tailwind CSS |
| Backend | Node.js, Express, JWT, bcrypt |
| БД | PostgreSQL 16 (схема `database/schema.sql`) |

## API

Полная спецификация: [docs/API.md](docs/API.md)

```
GET  /health
GET  /api/v1/parks
GET  /api/v1/parks/:slug/schedule
GET  /api/v1/parks/:slug/availability
GET  /api/v1/reviews?parkSlug=
POST /api/v1/auth/login
GET  /api/v1/bookings/me      ← JWT
POST /api/v1/bookings         ← JWT
GET  /api/v1/favorites        ← JWT
GET  /api/v1/admin/stats      ← admin / park_manager
```

Тесты: `cd backend && npm test`  
Документация: [docs/ADMIN.md](docs/ADMIN.md) · [docs/TESTING.md](docs/TESTING.md)

## Структура для диплома

```
database/schema.sql     — схема БД (приложение 05_DB_API)
docs/API.md             — спецификация REST API
backend/src/services/   — бизнес-логика
frontend/src/app/       — страницы UI
docker-compose.yml      — PostgreSQL для демо
```

## Документация

- [docs/CONCEPT.md](docs/CONCEPT.md)
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- [docs/API.md](docs/API.md)

© 2026 ParkPass · Дипломный проект
