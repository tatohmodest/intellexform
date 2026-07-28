'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  GraduationCap,
} from 'lucide-react';
import TrackLogo from '@/components/TrackLogo';
import EnrollButton from '@/components/dashboard/EnrollButton';
import { getTrackLogo } from '@/lib/techLogos';
import type { MyCourseCard, MyCourseSection } from '@/lib/learn/myCourses';

export type { MyCourseCard, MyCourseSection };

export default function CoursesBrowser({
  sections,
  total,
  inProgress,
}: {
  sections: MyCourseSection[];
  total: number;
  inProgress: number;
}) {
  const [query, setQuery] = useState('');

  const filteredSections = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sections;
    return sections
      .map((s) => ({
        ...s,
        courses: s.courses.filter((c) =>
          `${c.title} ${c.subtitle} ${c.tagline} ${c.tag}`.toLowerCase().includes(q),
        ),
      }))
      .filter((s) => s.courses.length > 0);
  }, [sections, query]);

  return (
    <div>
      <div
        className="mb-8 flex flex-col gap-6 border-b pb-8 sm:flex-row sm:items-end sm:justify-between"
        style={{ borderColor: 'var(--line)' }}
      >
        <div className="max-w-[520px]">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: 'var(--ink-soft)' }}>
            One catalogue · Supabase
          </p>
          <p className="mt-2 text-[15px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
            Free tracks, tutoring, and self-paced programmes — synced into one place so you can
            browse by category.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-[0.12em]" style={{ color: 'var(--ink-soft)' }}>
          <span>{inProgress} in progress</span>
          <span style={{ color: 'var(--line)' }}>·</span>
          <span>{total} courses</span>
        </div>
      </div>

      <label className="mb-10 block max-w-md">
        <span className="sr-only">Search courses</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by course, tag, or skill…"
          className="form-input w-full !rounded-none border-0 border-b !px-0 !py-3 text-[16px] !shadow-none"
          style={{ borderColor: 'var(--line)', background: 'transparent' }}
        />
      </label>

      {filteredSections.map((section) => (
        <CourseSectionRow key={section.id} section={section} />
      ))}

      {filteredSections.length === 0 && (
        <div className="border-t py-16 text-center" style={{ borderColor: 'var(--line)' }}>
          <p className="font-display text-[22px]">No courses match</p>
          <p className="mt-2 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
            Try another search.
          </p>
        </div>
      )}
    </div>
  );
}

function CourseSectionRow({ section }: { section: MyCourseSection }) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(el.clientWidth * 0.85, 260), behavior: 'smooth' });
  };

  return (
    <section className="mb-10 sm:mb-12">
      <div className="mb-3.5 flex items-end justify-between gap-3 sm:mb-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {section.live && (
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wide text-white"
                style={{ background: 'var(--green)' }}
              >
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> Live
              </span>
            )}
            <h2 className="font-display text-[19px] leading-tight sm:text-[24px]">{section.title}</h2>
          </div>
          {section.subtitle && (
            <p className="mt-0.5 text-[13px] sm:text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>
              {section.subtitle}
            </p>
          )}
        </div>
        <div className="hidden shrink-0 gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label="Scroll left"
            className="flex h-9 w-9 items-center justify-center border transition-colors hover:bg-[var(--paper-dim)]"
            style={{ borderColor: 'var(--line)' }}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label="Scroll right"
            className="flex h-9 w-9 items-center justify-center border transition-colors hover:bg-[var(--paper-dim)]"
            style={{ borderColor: 'var(--line)' }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={ref}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:gap-4 sm:px-0"
      >
        {section.courses.map((c) => (
          <div
            key={c.id}
            className="w-[min(78vw,280px)] flex-shrink-0 snap-start sm:w-[280px]"
          >
            <CourseCard course={c} />
          </div>
        ))}
      </div>
    </section>
  );
}

function CourseCard({ course: c }: { course: MyCourseCard }) {
  const hours = Math.max(1, Math.round((c.totalMinutes || 60) / 60));
  const logoSrc = c.source === 'tutorial' ? getTrackLogo(c.slug) : c.thumbnailUrl;

  return (
    <article
      className="group flex h-full min-w-0 flex-col overflow-hidden border bg-paper transition-shadow hover:shadow-card"
      style={{ borderColor: 'var(--line)' }}
    >
      <Link href={c.href} className="relative block aspect-[16/10] overflow-hidden">
        {c.source === 'catalogue' && c.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={c.thumbnailUrl}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <>
            <div
              className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.03]"
              style={{
                background: `linear-gradient(145deg, ${c.color} 0%, ${c.color}bb 42%, #0C1116 100%)`,
              }}
            />
            {logoSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoSrc}
                alt=""
                aria-hidden
                className="pointer-events-none absolute -left-6 bottom-[-18%] h-[125%] w-auto max-w-[78%] object-contain opacity-[0.16] brightness-0 invert"
              />
            ) : null}
          </>
        )}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span className="bg-white/95 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--ink)]">
            {c.tag}
          </span>
          {c.enrolled && (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-white"
              style={{ background: 'var(--green-deep)' }}
            >
              <Check size={10} /> Enrolled
            </span>
          )}
          {c.pricingType === 'FREE' ? (
            <span className="bg-black/55 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-white">
              Free
            </span>
          ) : c.priceXaf > 0 ? (
            <span className="bg-black/55 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-white">
              {c.priceXaf.toLocaleString()} XAF
            </span>
          ) : null}
        </div>
        {c.enrolled && c.pct > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/25">
            <div className="h-full bg-white" style={{ width: `${Math.min(100, Math.max(c.pct, 2))}%` }} />
          </div>
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-2 p-4">
        <Link href={c.href} className="min-w-0">
          <div className="flex items-start gap-2.5">
            {c.source === 'tutorial' ? (
              <span
                className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border"
                style={{ borderColor: 'var(--line)', background: '#fff' }}
              >
                <TrackLogo slug={c.slug} color={c.color} size={24} className="!rounded-full !bg-transparent" />
              </span>
            ) : null}
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-[17px] font-semibold leading-snug line-clamp-2">
                {c.title}
              </h3>
              <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                {c.tagline}
              </p>
            </div>
          </div>
        </Link>

        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[12px]" style={{ color: 'var(--ink-soft)' }}>
          {c.totalLessons > 0 && (
            <span className="inline-flex items-center gap-1">
              <BookOpen size={12} /> {c.totalLessons} lessons
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Clock size={12} /> ~{hours}h
          </span>
          <span className="inline-flex items-center gap-1">
            <GraduationCap size={12} /> {c.source === 'tutorial' ? 'Track' : 'Catalogue'}
          </span>
        </div>

        <div className="mt-auto flex flex-col gap-2 pt-3">
          <Link
            href={c.href}
            className="inline-flex w-full items-center justify-center border px-3 py-2.5 text-[13px] font-semibold"
            style={{ borderColor: 'var(--ink)', color: 'var(--ink)' }}
          >
            View course
          </Link>
          {c.source === 'tutorial' ? (
            <EnrollButton
              courseSlug={c.slug}
              enrolled={c.enrolled}
              continueHref={c.continueHref}
              editorial
            />
          ) : (
            <Link
              href={c.href}
              className="inline-flex w-full items-center justify-center gap-1.5 px-3 py-2.5 text-[13px] font-semibold text-white"
              style={{ background: 'var(--green)' }}
            >
              {c.pricingType === 'FREE' ? 'Open course' : 'Get access'}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
