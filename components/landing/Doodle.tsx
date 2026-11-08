import type { ProgrammeCategory } from '@/lib/programmes';

/** Open Doodles line illustration from /public/doodles (CC0), decorative only. */
export default function Doodle({ name, className = '' }: { name: string; className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/doodles/${name}.svg`} alt="" className={`pointer-events-none select-none ${className}`} loading="lazy" />;
}

/** One doodle per discipline so a programme always has the same face. */
export const CATEGORY_DOODLE: Record<ProgrammeCategory, string> = {
  software: 'sleek',
  data: 'readingside',
  security: 'meditating',
  marketing: 'selfie',
  foundations: 'plant',
};
