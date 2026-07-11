'use client';

import { useState } from 'react';

export default function CourseHeroImage({ src, name }: { src: string; name: string }) {
  const [ok, setOk] = useState(Boolean(src));

  return (
    <div
      className="relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-[18px]"
      style={{
        background:
          'repeating-linear-gradient(135deg, var(--paper-dim), var(--paper-dim) 12px, #E1EBF6 12px, #E1EBF6 24px)',
      }}
    >
      {ok ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} className="absolute inset-0 h-full w-full object-cover" onError={() => setOk(false)} />
      ) : (
        <span className="px-6 text-center font-display text-2xl" style={{ color: 'var(--green-deep)' }}>{name}</span>
      )}
    </div>
  );
}
