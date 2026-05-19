'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/** Тема оформления парка из API (theme_config) */
export interface ParkTheme {
  primaryColor: string;
  secondaryColor: string;
  fontFamily?: string;
  particleEffect?: 'stars' | 'speed' | 'water' | 'none';
}

export interface Park {
  id: string;
  slug: string;
  name: string;
  description: string;
  city: string;
  country: string;
  ratingAvg: number;
  reviewCount: number;
  priceFrom: number;
  coverImage: string;
  heroVideoUrl?: string;
  theme: ParkTheme;
  openingHours: Record<string, string>;
}

export interface Attraction {
  id: string;
  name: string;
  category: string;
  avgWaitMin: number;
  imageUrl: string;
}

interface ParkPageProps {
  slug: string;
}

export default function ParkPage({ slug }: ParkPageProps) {
  const [park, setPark] = useState<Park | null>(null);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [visitDate, setVisitDate] = useState('');
  const [guests, setGuests] = useState(2);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const api = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
    fetch(`${api}/api/v1/parks/${slug}`)
      .then((r) => r.json())
      .then(setPark);
    fetch(`${api}/api/v1/parks/${slug}/attractions`)
      .then((r) => r.json())
      .then(setAttractions);
  }, [slug]);

  if (!park) {
    return (
      <motion.div
        className="min-h-screen bg-slate-900 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="w-12 h-12 border-2 border-indigo-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        />
      </motion.div>
    );
  }

  const themeStyle = {
    '--park-primary': park.theme.primaryColor,
    '--park-secondary': park.theme.secondaryColor,
  } as React.CSSProperties;

  return (
    <div
      className="min-h-screen bg-slate-900 text-white"
      style={themeStyle}
    >
      {/* Immersive Hero */}
      <section className="relative h-[70vh] overflow-hidden">
        {park.heroVideoUrl ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            poster={park.coverImage}
          >
            <source src={park.heroVideoUrl} type="video/webm" />
          </video>
        ) : (
          <img
            src={park.coverImage}
            alt={park.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />
        <div className="relative z-10 h-full flex flex-col justify-end p-8 max-w-6xl mx-auto">
          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-2"
            style={{ color: 'var(--park-primary)' }}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            {park.name}
          </motion.h1>
          <p className="text-slate-300 text-lg mb-4">
            {park.city}, {park.country} · ★ {park.ratingAvg} ({park.reviewCount} отзывов)
          </p>
          <motion.div
            className="flex gap-3"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <button
              type="button"
              onClick={() => setIsFavorite(!isFavorite)}
              className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur border border-white/20 hover:bg-white/20 transition"
              aria-label="Избранное"
            >
              {isFavorite ? '♥' : '♡'} Избранное
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur border border-white/20"
            >
              Поделиться
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Sticky Booking Bar */}
      <motion.div
        className="sticky top-0 z-50 mx-4 -mt-8 max-w-6xl lg:mx-auto p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl flex flex-wrap gap-4 items-center justify-between"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex flex-wrap gap-3">
          <input
            type="date"
            value={visitDate}
            onChange={(e) => setVisitDate(e.target.value)}
            className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-600"
          />
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-600"
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n} гост{n === 1 ? 'ь' : 'ей'}
              </option>
            ))}
          </select>
        </motion.div>
        <motion.div className="flex items-center gap-4">
          <span className="text-2xl font-bold" style={{ color: 'var(--park-primary)' }}>
            от {park.priceFrom} €
          </span>
          <motion.a
            href={`/checkout?park=${park.slug}&date=${visitDate}&guests=${guests}`}
            className="px-6 py-3 rounded-xl font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, var(--park-primary), var(--park-secondary))' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Забронировать
          </motion.a>
        </motion.div>
      </motion.div>

      {/* About */}
      <section className="max-w-6xl mx-auto px-8 py-16">
        <h2 className="text-3xl font-bold mb-4">О парке</h2>
        <p className="text-slate-300 leading-relaxed max-w-3xl">{park.description}</p>
      </section>

      {/* Attractions */}
      <section className="max-w-6xl mx-auto px-8 pb-24">
        <h2 className="text-3xl font-bold mb-8">Аттракционы</h2>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.08 } },
          }}
        >
          {attractions.map((a) => (
            <motion.article
              key={a.id}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0 },
              }}
              className="group rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/30 transition cursor-pointer"
              whileHover={{ y: -4 }}
            >
              <img
                src={a.imageUrl}
                alt={a.name}
                className="h-40 w-full object-cover group-hover:scale-105 transition duration-500"
              />
              <motion.div className="p-4">
                <h3 className="font-semibold text-lg">{a.name}</h3>
                <p className="text-slate-400 text-sm">{a.category}</p>
                <p className="mt-2 text-amber-400 text-sm">
                  Очередь: ~{a.avgWaitMin} мин
                </p>
              </motion.div>
            </motion.article>
          ))}
        </motion.div>
      </section>
    </motion.div>
  );
}
