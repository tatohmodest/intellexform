'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { BookOpen, Check, Clock, GraduationCap } from 'lucide-react';
import EnrollButton from '@/components/dashboard/EnrollButton';
import TrackLogo from '@/components/TrackLogo';
import { getTrackLogo } from '@/lib/techLogos';

export type CourseListItem = {
  slug: string;
  shortTitle: string;
  title: string;
  tagline: string;
  tag: string;
  color: string;
  totalLessons: number;
  totalMinutes: number;
  enrolled: boolean;
  doneCount: number;
  pct: number;
  continueHref: string;
};

export default function CoursesBrowser({
  tracks,
}: {
  tracks: CourseListItem[];
}) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'mine' | 'browse'>('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tracks.filter((t) => {
      if (filter === 'mine' && !t.enrolled) return false;
      if (filter === 'browse' && t.enrolled) return false;
      if (!q) return true;
      return `${t.shortTitle} ${t.title} ${t.tagline} ${t.tag}`.toLowerCase().includes(q);
    });
  }, [tracks, query, filter]);

  const mineCount = tracks.filter((t) => t.enrolled).length;

  return (
    <div>
      <div
        className="mb-10 flex flex-col gap-6 border-b pb-8 sm:flex-row sm:items-end sm:justify-between"
        style={{ borderColor: 'var(--line)' }}
      >
        <div className="max-w-[520px]">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: 'var(--ink-soft)' }}>
            Self-paced tracks
          </p>
          <p className="mt-2 text-[15px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
            Real curricula with progress, XP, and certificates. Enroll once — pick up any lesson when
            you are ready.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-[0.12em]" style={{ color: 'var(--ink-soft)' }}>
          <span>{mineCount} in progress</span>
          <span style={{ color: 'var(--line)' }}>·</span>
          <span>{tracks.length} tracks</span>
        </div>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <label className="block min-w-0 flex-1">
          <span className="sr-only">Search tracks</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by track, tag, or skill…"
            className="form-input w-full max-w-md !rounded-none border-0 border-b !px-0 !py-3 text-[16px] !shadow-none"
            style={{ borderColor: 'var(--line)', background: 'transparent' }}
          />
        </label>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ['all', 'All'],
              ['mine', 'In progress'],
              ['browse', 'Not enrolled'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              className="px-3 py-1.5 text-[12.5px] font-semibold"
              style={
                filter === id
                  ? { background: 'var(--ink)', color: '#fff' }
                  : { background: 'var(--paper-dim)', color: 'var(--ink-soft)' }
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((t) => (
          <CourseTrackCard key={t.slug} track={t} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="border-t py-16 text-center" style={{ borderColor: 'var(--line)' }}>
          <p className="font-display text-[22px]">No tracks match</p>
          <p className="mt-2 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
            Try another search, or clear the filter.
          </p>
        </div>
      )}
    </div>
  );
}

function CourseTrackCard({ track: t }: { track: CourseListItem }) {
  const hours = Math.max(1, Math.round(t.totalMinutes / 60));
  const logoSrc = getTrackLogo(t.slug);

  return (
    <article
      className="group flex h-full min-w-0 flex-col overflow-hidden border bg-paper transition-shadow hover:shadow-card"
      style={{ borderColor: 'var(--line)' }}
    >
      {/* Cover: color wash + big low-opacity logo watermark on the left */}
      <Link href={`/dashboard/courses/${t.slug}`} className="relative block aspect-[16/10] overflow-hidden">
        <div
          className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.03]"
          style={{
            background: `linear-gradient(145deg, ${t.color} 0%, ${t.color}bb 42%, #0C1116 100%)`,
          }}
        />
        <div
          className="absolute inset-0 opacity-25"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 85% 15%, rgba(255,255,255,0.4), transparent 55%)',
          }}
        />
        {logoSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoSrc}
            alt=""
            aria-hidden
            className="pointer-events-none absolute -left-6 bottom-[-18%] h-[125%] w-auto max-w-[78%] object-contain opacity-[0.16] brightness-0 invert sm:-left-4 sm:opacity-[0.2]"
          />
        ) : null}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span className="bg-white/95 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--ink)]">
            {t.tag}
          </span>
          {t.enrolled && (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-white"
              style={{ background: 'var(--green-deep)' }}
            >
              <Check size={10} /> Enrolled
            </span>
          )}
        </div>
        {t.enrolled && t.pct > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/25">
            <div className="h-full bg-white" style={{ width: `${Math.min(100, Math.max(t.pct, 2))}%` }} />
          </div>
        )}
      </Link>

      {/* Body: tiny circular logo beside the course name */}
      <div className="flex min-w-0 flex-1 flex-col gap-2 p-4 sm:p-5">
        <Link href={`/dashboard/courses/${t.slug}`} className="min-w-0">
          <div className="flex items-start gap-2.5">
            <span
              className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border sm:h-10 sm:w-10"
              style={{ borderColor: 'var(--line)', background: '#fff' }}
            >
              <TrackLogo slug={t.slug} color={t.color} size={26} className="!rounded-full !bg-transparent" />
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-[17px] font-semibold leading-snug line-clamp-2 transition-opacity group-hover:opacity-80 sm:text-[19px]">
                {t.title}
              </h3>
              <p className="mt-1 line-clamp-2 text-[13.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                {t.tagline}
              </p>
            </div>
          </div>
        </Link>

        <div
          className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[12px]"
          style={{ color: 'var(--ink-soft)' }}
        >
          <span className="inline-flex items-center gap-1">
            <BookOpen size={12} /> {t.totalLessons} lessons
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock size={12} /> ~{hours}h
          </span>
          <span className="inline-flex items-center gap-1">
            <GraduationCap size={12} /> Certificate
          </span>
        </div>

        {t.enrolled && (
          <div className="mt-1 flex items-center justify-between gap-3 text-[12px]">
            <span style={{ color: 'var(--ink-soft)' }}>
              {t.doneCount}/{t.totalLessons} complete
            </span>
            <span className="font-semibold" style={{ color: 'var(--green-deep)' }}>
              {t.pct}%
            </span>
          </div>
        )}

        <div className="mt-auto flex flex-col gap-2 pt-3 sm:flex-row">
          <Link
            href={`/dashboard/courses/${t.slug}`}
            className="inline-flex flex-1 items-center justify-center border px-3 py-2.5 text-[13px] font-semibold"
            style={{ borderColor: 'var(--ink)', color: 'var(--ink)' }}
          >
            View course
          </Link>
          <div className="flex-1">
            <EnrollButton
              courseSlug={t.slug}
              enrolled={t.enrolled}
              continueHref={t.continueHref}
              editorial
            />
          </div>
        </div>
      </div>
    </article>
  );
}
