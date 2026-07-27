import { Cpu, Megaphone, BookOpen } from 'lucide-react';
import { getTrackLogo } from '@/lib/techLogos';

const FALLBACK_ICONS: Record<string, typeof Cpu> = {
  'computer-architecture': Cpu,
  'digital-marketing': Megaphone,
};

/**
 * Renders a course/tutorial brand logo (image) - never an emoji.
 */
export default function TrackLogo({
  slug,
  color,
  size = 40,
  className = '',
}: {
  slug: string;
  color?: string;
  size?: number;
  className?: string;
}) {
  const src = getTrackLogo(slug);
  const Fallback = FALLBACK_ICONS[slug] ?? BookOpen;

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-xl ${className}`}
      style={{
        width: size,
        height: size,
        background: color ? `${color}18` : 'var(--paper-dim)',
      }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          width={Math.round(size * 0.62)}
          height={Math.round(size * 0.62)}
          className="object-contain"
          style={{ width: Math.round(size * 0.62), height: Math.round(size * 0.62) }}
          loading="lazy"
        />
      ) : (
        <Fallback size={Math.round(size * 0.42)} style={{ color: color || 'var(--ink-soft)' }} />
      )}
    </span>
  );
}
