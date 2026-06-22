/** Локальные ассеты Star Wars (файлы в /public/star-wars) */
const base = '/star-wars';

export const SW_PARK_SLUG = 'star-wars-galaxys-edge';

export const starWarsImages = {
  hero: `${base}/hero-mando.png`,
  heroChewbacca: `${base}/SWGE_WDW.jpg`,
  batuuAerial: `${base}/5d67ceb8b960f70001cd0df6-image_cfe15865.jpeg`,
  falconDock: `${base}/image_fc20bfb1.jpeg`,
  falconWide: `${base}/4027219_0515ZR_5257MS_aRGB_r3-1200x800-5b2df79-min-1200x720.webp`,
  resistance: `${base}/resistance-supply-helmet-16x9.avif`,
  promoWide: `${base}/4027219_0514ZR_4832MS_aRGB_R3R-16x9.avif`,
  mando: `${base}/mando.jpeg`,
  grogu: `${base}/Grogu.webp`,
  vader: `${base}/dart.png`,
} as const;

/** Картинки для карточек аттракционов на странице вселенной */
export const starWarsExperiences = [
  {
    title: 'Millennium Falcon',
    desc: 'Станьте пилотом, стрелком или инженером на легендарном корабле.',
    image: starWarsImages.falconDock,
    wait: '~65 мин',
  },
  {
    title: 'Rise of the Resistance',
    desc: 'Эпическое сражение с Первым орденом — лучший dark ride в мире.',
    image: starWarsImages.resistance,
    wait: '~95 мин',
  },
  {
    title: "Oga's Cantina",
    desc: 'Космический бар с экзотическими напитками и живой музыкой.',
    image: starWarsImages.promoWide,
    wait: '~30 мин',
  },
  {
    title: "Savi's Workshop",
    desc: 'Создайте собственный световой меч у мастеров.',
    image: starWarsImages.grogu,
    wait: 'По записи',
  },
] as const;

/** Сопоставление id аттракционов API → локальные фото */
export const attractionImageById: Record<string, string> = {
  sw1: starWarsImages.falconDock,
  sw2: starWarsImages.resistance,
  sw3: starWarsImages.promoWide,
};
