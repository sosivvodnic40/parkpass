'use client';

import { jpColors } from '@/lib/jurassic-images';

export default function JpParticles({ count = 24 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, t) => {
        const isGreen = t % 4 === 0;
        const isAmber = t % 4 === 1;
        const isLime = t % 4 === 2;
        const size = 1 + (t % 3);
        return (
          <div
            key={t}
            className="jp-particle"
            style={{
              width: size,
              height: size,
              background: isGreen
                ? jpColors.green
                : isAmber
                  ? jpColors.amber
                  : isLime
                    ? jpColors.greenLight
                    : '#ecfdf5',
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
