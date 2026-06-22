'use client';

import { mvColors } from '@/lib/marvel-images';

export default function MvParticles({ count = 24 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, t) => {
        const isRed = t % 4 === 0;
        const isBlue = t % 4 === 1;
        const isGold = t % 4 === 2;
        const size = 1 + (t % 3);
        return (
          <div
            key={t}
            className="mv-particle"
            style={{
              width: size,
              height: size,
              background: isRed
                ? mvColors.red
                : isBlue
                  ? mvColors.blue
                  : isGold
                    ? mvColors.gold
                    : '#ffffff',
              left: `${(t * 17 + 3) % 98}%`,
              top: `${(t * 11 + 7) % 92}%`,
              opacity: 0.2 + (t % 4) * 0.1,
              animationDuration: `${5 + (t % 4)}s`,
              animationDelay: `${t * 0.35}s`,
            }}
          />
        );
      })}
    </>
  );
}
