# Протокол тестирования ParkPass API

**Проект:** Платформа бронирования тематических парков (Backend)  
**Версия API:** 2.1.0  
**Студент:** Нурғали Дархан Мырзағалиұлы, ИС-23-19б

## Среда тестирования

| Параметр | Значение |
|----------|----------|
| ОС | Windows 10/11 |
| Runtime | Node.js 20+ |
| Backend | Express + TypeScript |
| БД | PostgreSQL 16 (Docker) / mock |
| URL | http://127.0.0.1:4000 |

## Автоматизированные тесты

```powershell
cd backend
npm install
npm test
```

11 тестов Jest + Supertest в `backend/src/__tests__/api.test.ts`.

## Ручные сценарии

| № | Цель | Действия | Ожидаемый результат | Статус |
|---|------|----------|---------------------|--------|
| 1 | Health-check | GET /health | status: ok, version 2.1.0 | ☐ |
| 2 | Каталог парков | GET /api/v1/parks | 4 парка в data | ☐ |
| 3 | Фильтр категории | GET /api/v1/parks?category=marvel | 1 парк Marvel | ☐ |
| 4 | Расписание | GET /api/v1/parks/jurassic-islands-orlando/schedule | weeklySchedule из 7 дней | ☐ |
| 5 | Доступность | GET .../availability?date=2026-08-01&guests=2 | isAvailable: true | ☐ |
| 6 | Регистрация | POST /auth/register | 201, token + user | ☐ |
| 7 | Вход demo | POST /auth/login demo@parkpass.ru | 200, token, role: user | ☐ |
| 8 | Вход admin | POST /auth/login admin@parkpass.ru | 200, role: admin | ☐ |
| 9 | Мои брони | GET /bookings/me + JWT | массив броней | ☐ |
| 10 | Создание брони | POST /bookings + JWT | 201, qrCode | ☐ |
| 11 | Отзывы | GET /reviews?parkSlug=... | массив отзывов | ☐ |
| 12 | Новый отзыв | POST /reviews + JWT | 201, rating 1-5 | ☐ |
| 13 | Избранное toggle | POST /favorites/toggle + JWT | favorited: true/false | ☐ |
| 14 | Admin stats | GET /admin/stats + admin JWT | usersTotal, revenueTotal | ☐ |
| 15 | Admin запрет user | GET /admin/stats + user JWT | 403 | ☐ |
| 16 | Отчёт посетителей | GET /admin/reports/visitors + manager JWT | totalGuests | ☐ |
| 17 | Смена статуса брони | PATCH /admin/bookings/:id/status | обновлённый status | ☐ |
| 18 | Смена роли | PATCH /admin/users/:id/role + admin JWT | новая role | ☐ |

## Пример PowerShell

```powershell
$admin = Invoke-RestMethod -Method POST -Uri http://127.0.0.1:4000/api/v1/auth/login `
  -ContentType "application/json" `
  -Body '{"email":"admin@parkpass.ru","password":"admin123"}'

Invoke-RestMethod -Uri http://127.0.0.1:4000/api/v1/admin/stats `
  -Headers @{ Authorization = "Bearer $($admin.token)" }
```

## Вывод

API покрывает требования задания №89: пользователи, роли, бронирования, расписание, отзывы, отчётность, PostgreSQL, JWT.
