'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowUpRight, BookOpen, Check, Clock, GraduationCap } from 'lucide-react';
import EnrollButton from '@/components/dashboard/EnrollButton';
import TrackLogo from '@/components/TrackLogo';

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

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
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

      <ul className="divide-y" style={{ borderColor: 'var(--line)' }}>
        {filtered.map((t, index) => (
          <li key={t.slug} className="group">
            <div className="grid gap-5 py-8 sm:grid-cols-[88px_1fr_auto] sm:items-center sm:gap-8">
              <div
                className="relative flex h-[88px] w-[88px] items-end overflow-hidden"
                style={{
                  background: `linear-gradient(145deg, ${t.color} 0%, ${t.color}88 45%, #0C1116 100%)`,
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center p-3">
                  <TrackLogo slug={t.slug} color={t.color} size={52} className="rounded-lg bg-white/95 p-1" />
                </div>
                <span className="absolute right-2 top-2 font-mono text-[10px] text-white/55">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              <div className="min-w-0">
                <div className="mb-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <Link
                    href={`/dashboard/courses/${t.slug}`}
                    className="font-display text-[22px] leading-tight transition-opacity group-hover:opacity-80 sm:text-[26px]"
                  >
                    {t.shortTitle}
                  </Link>
                  {t.enrolled && (
                    <span
                      className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.14em]"
                      style={{ color: 'var(--green-deep)' }}
                    >
                      <Check size={11} /> Enrolled
                      {t.pct > 0 ? ` · ${t.pct}%` : ''}
                    </span>
                  )}
                </div>
                <p className="max-w-[540px] text-[14.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                  {t.tagline}
                </p>
                <div
                  className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-[0.12em]"
                  style={{ color: 'var(--ink-soft)' }}
                >
                  <span className="inline-flex items-center gap-1">
                    <BookOpen size={11} /> {t.totalLessons} lessons
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock size={11} /> ~{Math.round(t.totalMinutes / 60)}h
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <GraduationCap size={11} /> Certificate
                  </span>
                  <span>{t.tag}</span>
                </div>
                {t.enrolled && (
                  <div className="mt-3 h-1 max-w-[280px] overflow-hidden" style={{ background: 'var(--paper-dim)' }}>
                    <div
                      className="h-full"
                      style={{ width: `${Math.max(t.pct, 2)}%`, background: 'var(--green)' }}
                    />
                  </div>
                )}
              </div>

              <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-[140px] sm:items-stretch">
                <Link
                  href={`/dashboard/courses/${t.slug}`}
                  className="inline-flex items-center justify-center gap-1.5 border px-4 py-2.5 text-[13px] font-semibold transition-colors"
                  style={{ borderColor: 'var(--ink)', color: 'var(--ink)' }}
                >
                  View track <ArrowUpRight size={14} />
                </Link>
                <EnrollButton
                  courseSlug={t.slug}
                  enrolled={t.enrolled}
                  continueHref={t.continueHref}
                  editorial
                />
              </div>
            </div>
          </li>
        ))}
      </ul>

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
