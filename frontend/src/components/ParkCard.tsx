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
      className={`card group hover:shadow-card-hover transition-shadow block ${large ? 'md:row-span-2' : ''}`}
    >
      <div className={`relative overflow-hidden ${large ? 'h-72 md:h-80' : 'h-48'}`}>
        <img
          src={park.coverImage}
          alt={park.name}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
        />
        {park.badge && (
          <span className="absolute top-4 left-4 bg-brand-accent text-white text-xs font-bold px-3 py-1 rounded-full">
            {park.badge}
          </span>
        )}
        <span className="absolute bottom-4 right-4 bg-white/95 text-brand-text font-bold px-3 py-1.5 rounded-lg shadow text-sm">
          от {park.priceFrom} €<span className="font-normal text-brand-muted"> / чел.</span>
        </span>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 text-sm text-amber-600 font-medium mb-1">
          <span>★ {park.ratingAvg}</span>
          <span className="text-brand-muted font-normal">
            ({park.reviewCount.toLocaleString('ru-RU')})
          </span>
        </div>
        <h3 className={`font-bold text-brand-navy ${large ? 'text-2xl' : 'text-lg'}`}>
          {park.name}
        </h3>
        <p className="text-brand-muted text-sm mt-1">{park.region}</p>
        {large && (
          <p className="text-brand-muted text-sm mt-3 line-clamp-2">{park.description}</p>
        )}
        <span className="inline-block mt-4 text-brand-accent font-semibold text-sm group-hover:underline">
          Забронировать →
        </span>
      </div>
    </Link>
  );
}
