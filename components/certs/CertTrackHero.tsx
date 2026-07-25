import Link from 'next/link';
import { ArrowRight, BadgeCheck } from 'lucide-react';
import type { CertTrack } from '@/lib/certTracks';
import { CertBrandMark } from '@/components/certs/CertBrandMark';

export function CertTrackHero({
  track,
  courseCount,
  ctaHref,
  ctaLabel = 'Explore path',
  compact = false,
}: {
  track: CertTrack;
  courseCount?: number;
  ctaHref?: string;
  ctaLabel?: string;
  compact?: boolean;
}) {
  const href = ctaHref || track.href;

  return (
    <div
      className={`relative overflow-hidden rounded-[22px] border ${compact ? 'p-5 sm:p-6' : 'p-6 sm:p-8'}`}
      style={{
        borderColor: 'var(--line)',
        background: `linear-gradient(145deg, ${track.accentSoft} 0%, var(--paper) 55%, var(--paper) 100%)`,
      }}
    >
      <div
        className="pointer-events-none absolute -right-10 -top-12 h-44 w-44 rounded-full opacity-40 blur-2xl"
        style={{ background: track.accent }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(var(--ink) 1px, transparent 1px), linear-gradient(90deg, var(--ink) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
        aria-hidden
      />

      <div className={`relative flex flex-col gap-5 ${compact ? '' : 'lg:flex-row lg:items-start lg:justify-between'}`}>
        <div className="flex min-w-0 items-start gap-4">
          <CertBrandMark mark={track.mark} className={compact ? 'h-14 w-14 shrink-0' : 'h-16 w-16 shrink-0 sm:h-[4.5rem] sm:w-[4.5rem]'} />
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span
                className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em]"
                style={{ background: track.accentSoft, color: track.accent }}
              >
                <BadgeCheck size={12} /> {track.badge}
              </span>
              <span className="text-[12.5px] font-semibold" style={{ color: 'var(--ink-soft)' }}>
                {track.issuer}
              </span>
              {typeof courseCount === 'number' ? (
                <span className="text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                  · {courseCount} related course{courseCount === 1 ? '' : 's'}
                </span>
              ) : null}
            </div>
            <h3 className={`font-display leading-snug ${compact ? 'text-[18px] sm:text-[20px]' : 'text-[22px] sm:text-[28px]'}`}>
              {track.title}
            </h3>
            <p className={`mt-2 max-w-[540px] leading-relaxed ${compact ? 'text-[13.5px]' : 'text-[14.5px]'}`} style={{ color: 'var(--ink-soft)' }}>
              {track.blurb}
            </p>
          </div>
        </div>

        <div className={`flex flex-col gap-3 ${compact ? '' : 'lg:min-w-[220px] lg:items-end'}`}>
          <ul className={`flex flex-wrap gap-2 ${compact ? '' : 'lg:justify-end'}`}>
            {track.outcomes.map((o) => (
              <li
                key={o}
                className="rounded-full border px-3 py-1 text-[11.5px] font-medium"
                style={{ borderColor: 'var(--line)', background: 'rgba(255,255,255,0.72)', color: 'var(--ink)' }}
              >
                {o}
              </li>
            ))}
          </ul>
          <Link
            href={href}
            className="inline-flex items-center gap-1.5 self-start text-[13px] font-semibold transition hover:gap-2 lg:self-end"
            style={{ color: track.accent }}
          >
            {ctaLabel} <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
