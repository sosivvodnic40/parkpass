# ParkPass — агрегатор бронирования тематических парков

**ParkPass** — современная веб-платформа для поиска, сравнения и бронирования билетов в тематические парки и на аттракционы по всему миру.

> Дипломный проект: веб-разработка (IT)  
> Авторы: Дархан, Шамиль  
> GitHub: [sosivvodnic40](https://github.com/sosivvodnic40)

## Документация

| Документ | Описание |
|----------|----------|
| [docs/CONCEPT.md](docs/CONCEPT.md) | Полная концепция, UX/UI, функционал, монетизация |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Техническая архитектура и API |
| [database/schema.sql](database/schema.sql) | Схема PostgreSQL |

## Стек

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **Backend:** Node.js, NestJS, REST API, JWT
- **БД:** PostgreSQL, Prisma ORM

## Быстрый старт

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

## Структура репозитория

```
parkpass/
├── docs/           # Концепция и архитектура
├── frontend/       # Next.js приложение
├── backend/        # NestJS API
└── database/       # SQL-схема
```

## Лицензия

Учебный проект. © 2026 ParkPass Team.
