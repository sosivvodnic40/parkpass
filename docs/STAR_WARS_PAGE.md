# Star Wars — зафиксированная версия страницы

## Маршрут
`/worlds/star-wars`

## Ассеты (локальные)
Папка: `frontend/public/star-wars/`

| Файл | Назначение |
|------|------------|
| `hero-mando.png` | **Главный hero-фон** (Мандалорец + Грогу) |
| `SWGE_WDW.jpg` | Galaxy's Edge, Чубакка + Falcon |
| `5d67ceb8...jpeg` | Панорама Батуус |
| `image_fc20bfb1.jpeg` | Falcon у стоянки |
| `4027219_0515ZR...webp` | Falcon широкий |
| `resistance-supply-helmet-16x9.avif` | Rise of the Resistance |
| `4027219_0514ZR...avif` | Промо / Cantina |
| `Grogu.webp` | Savi's Workshop |
| `mando.jpeg` | Резерв |

Конфиг путей: `frontend/src/lib/star-wars-images.ts`

## Убрано по запросу пользователя
- Блок «Светлая сторона / Тёмная сторона» (Мандо + Вейдер с PNG)

## Дизайн v2 (текущий, зафиксирован)
- Тёмная тема `#050508` + акцент `#FFE81F`
- Hero: `hero-mando.png` (Ken Burns, звёзды, glass-чипы со статистикой)
- Блок Батуу: панорама + Chewbacca/Falcon
- Аттракционы: bento-сетка 12 колонок
- Зоны: горизонтальная карусель
- Билеты: glass-карточки с подсветкой «Рекомендуем»
- Стили: `frontend/src/app/worlds/star-wars/star-wars.css`
- Страница: `frontend/src/app/worlds/star-wars/page.tsx`
