'use client';

import { hpColors } from '@/lib/harry-potter-images';

export default function HpSparkles({ count = 24 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, t) => {
        const isGold = t % 4 === 0;
        const isPurple = t % 4 === 1;
        const size = 1 + (t % 3);
        return (
          <div
            key={t}
            className="hp-particle"
            style={{
              width: size,
              height: size,
              background: isGold ? hpColors.gold : isPurple ? hpColors.purple : '#ffffff',
              left: `${(t * 17 + 3) % 98}%`,
              top: `${(t * 11 + 7) % 92}%`,
              opacity: 0.25 + (t % 4) * 0.12,
              animationDuration: `${5 + (t % 4)}s`,
              animationDelay: `${t * 0.35}s`,
            }}
          />
        );
      })}
    </>
  );
}
