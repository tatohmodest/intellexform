'use client';

import GeoTaggedImage from '@/components/seo/GeoTaggedImage';

export default function CourseHeroImage({ src, name }: { src: string; name: string }) {
  return (
    <div
      className="relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-[18px]"
      style={{
        background:
          'repeating-linear-gradient(135deg, var(--paper-dim), var(--paper-dim) 12px, #E1EBF6 12px, #E1EBF6 24px)',
      }}
    >
      {src ? (
        <GeoTaggedImage src={src} name={name} />
      ) : (
        <span className="px-6 text-center font-display text-2xl" style={{ color: 'var(--green-deep)' }}>
          {name}
        </span>
      )}
    </div>
  );
}
