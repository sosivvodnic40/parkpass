/** Стабильные изображения через picsum (Unsplash часто отдаёт 404) */
const pic = (seed: string, w = 1200, h = 800) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const images = {
  hero: {
    main: pic('hero-main', 1920, 1080),
    side1: pic('hero-side-hp', 800, 600),
    side2: pic('hero-side-jp', 800, 600),
  },
  starWars: {
    hero: '/star-wars/hero-mando.png',
    falcon: '/star-wars/image_fc20bfb1.jpeg',
    resistance: '/star-wars/resistance-supply-helmet-16x9.avif',
    cantina: '/star-wars/4027219_0514ZR_4832MS_aRGB_R3R-16x9.avif',
    lightsaber: '/star-wars/mando.jpeg',
  },
  harryPotter: {
    hero: 'https://images.unsplash.com/photo-1742322276273-749b62e782c0?w=900&h=600&fit=crop&auto=format',
    castle: 'https://images.unsplash.com/photo-1668711495033-2aceccc63054?w=600&h=300&fit=crop&auto=format',
    alley: 'https://images.unsplash.com/photo-1618945034890-91dea432cf7a?w=600&h=300&fit=crop&auto=format',
  },
  marvel: {
    hero: pic('marvel-hero', 1920, 1080),
  },
  jurassic: {
    hero: pic('jurassic-hero', 1920, 1080),
  },
  cta: pic('cta-footer', 1920, 1080),
} as const;

export const universes = [
  { id: 'star-wars', name: 'Star Wars', emoji: '⚡', href: '/worlds/star-wars', color: '#FFE81F', desc: "Galaxy's Edge — Батуу" },
  { id: 'harry-potter', name: 'Harry Potter', emoji: '🪄', href: '/worlds/harry-potter', color: '#B45309', desc: 'Хогвартс и Хогсмид' },
  { id: 'marvel', name: 'Marvel', emoji: '🦸', href: '/worlds/marvel', color: '#DC2626', desc: 'Avengers Campus' },
  { id: 'jurassic', name: 'Jurassic World', emoji: '🦕', href: '/worlds/jurassic', color: '#166534', desc: 'VelociCoaster и динозавры' },
] as const;
