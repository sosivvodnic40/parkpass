import Image from 'next/image';
import Link from 'next/link';
import type { Park } from '@/lib/api';

export default function ParkCard({
  park,
  large = false,
}: {
  park: Park;
  large?: boolean;
}) {
  return (
    <Link
      href={`/parks/${park.slug}`}
      className={`card group hover:shadow-card-hover transition-all duration-300 block ${
        large ? 'md:row-span-2' : ''
      }`}
    >
      <div className={`relative overflow-hidden ${large ? 'h-[320px] md:h-[420px]' : 'h-52'}`}>
        <Image
          src={park.coverImage}
          alt={park.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes={large ? '(max-width:768px) 100vw, 50vw' : '(max-width:768px) 100vw, 33vw'}
        />
        <div className="image-overlay" />
        {park.badge && (
          <span className="absolute top-4 left-4 bg-brand-coral text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
            {park.badge}
          </span>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <div className="flex items-center gap-2 text-sm mb-2">
            <span className="text-amber-300 font-semibold">★ {park.ratingAvg}</span>
            <span className="text-white/70">
              ({park.reviewCount.toLocaleString('ru-RU')} отзывов)
            </span>
          </div>
          <h3 className={`font-display font-bold ${large ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
            {park.name}
          </h3>
          <p className="text-white/80 text-sm mt-1">{park.region}</p>
        </div>
        <span className="absolute top-4 right-4 bg-white text-brand-navy font-bold px-3 py-2 rounded-xl shadow-lg text-sm">
          от {park.priceFrom} €
        </span>
      </div>
      {!large && (
        <div className="p-4 flex justify-between items-center">
          <p className="text-brand-muted text-sm line-clamp-1 flex-1">{park.description}</p>
          <span className="text-brand-accent font-semibold text-sm shrink-0 ml-3 group-hover:underline">
            →
          </span>
        </div>
      )}
      {large && (
        <div className="p-5 border-t border-brand-border">
          <p className="text-brand-muted text-sm line-clamp-2 mb-4">{park.description}</p>
          <span className="btn-primary text-sm py-2.5 px-5">Забронировать</span>
        </div>
      )}
    </Link>
  );
}
