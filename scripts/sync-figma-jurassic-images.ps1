# Скачивает картинки Jurassic World из макета Figma Make в frontend/public/jurassic/
# Запуск (из корня проекта):
#   powershell -ExecutionPolicy Bypass -File .\scripts\sync-figma-jurassic-images.ps1

$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$outDir = Join-Path $root 'frontend\public\jurassic'
$manifest = Join-Path $outDir 'figma-urls.json'

New-Item -ItemType Directory -Force -Path $outDir | Out-Null

Write-Host '1/4 Загрузка HTML с emit-raster-59598005.figma.site ...'
$html = (Invoke-WebRequest -Uri 'https://emit-raster-59598005.figma.site' -UseBasicParsing -TimeoutSec 30).Content

$bundle = [regex]::Match($html, '_components/v2/([a-f0-9]+\.js)').Groups[1].Value
if (-not $bundle) {
  $bundle = [regex]::Match($html, '([a-f0-9]{40}\.js)').Groups[1].Value
}
if (-not $bundle) { throw 'Не найден JS-бандл Figma на странице' }
Write-Host "   Бандл: $bundle"

$jsUrl = "https://emit-raster-59598005.figma.site/_components/v2/$bundle"
Write-Host '2/4 Загрузка бандла ...'
$js = (Invoke-WebRequest -Uri $jsUrl -UseBasicParsing -TimeoutSec 60).Content

$urls = [regex]::Matches($js, 'https://images\.unsplash\.com/photo-[a-zA-Z0-9_-]+[^''"\s]*') |
  ForEach-Object { $_.Value -replace '\\u0026', '&' } |
  Select-Object -Unique

if ($urls.Count -lt 5) {
  throw "В бандле мало URL ($($urls.Count)). Откройте Jurassic World в Figma Make и пересоберите сайт."
}

$urls | ConvertTo-Json | Set-Content -Path $manifest -Encoding UTF8
Write-Host "   Найдено URL: $($urls.Count)"

# Порядок как на странице: gallery main, side x2, hero, 4 experiences, footer
$names = @(
  'gallery-main.jpg',
  'gallery-isla.jpg',
  'gallery-raptor.jpg',
  'hero.jpg',
  'experience-veloci.jpg',
  'experience-river.jpg',
  'experience-raptor.jpg',
  'experience-camp.jpg',
  'footer-thumb.jpg'
)

Write-Host '3/4 Скачивание файлов ...'
$i = 0
foreach ($name in $names) {
  if ($i -ge $urls.Count) { break }
  $url = $urls[$i]
  if ($url -notmatch '\?') { $url += '?w=1200&fit=crop&auto=format' }
  $path = Join-Path $outDir $name
  Invoke-WebRequest -Uri $url -OutFile $path -UseBasicParsing
  Write-Host "   OK $name"
  $i++
}

Write-Host "4/4 Готово: $outDir"
Write-Host 'Обновите страницу http://localhost:3000/worlds/jurassic'
