'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import MyCourseCardView from '@/components/dashboard/MyCourseCardView';
import type { MyCourseCard, MyCourseSection } from '@/lib/learn/myCourses';

export type { MyCourseCard, MyCourseSection };

/** How many cards to keep in the My Courses horizontal preview rail. */
export const MY_COURSES_PREVIEW_LIMIT = 8;

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
      <div className="mb-8 flex flex-col gap-3 rounded-3xl bg-white p-3 sm:flex-row sm:items-center">
        <label className="flex min-w-0 flex-1 items-center gap-2.5 rounded-2xl bg-[var(--paper-dim)] px-4 py-3">
          <Search size={17} className="shrink-0 text-[var(--ink-soft)]" />
          <span className="sr-only">Search courses</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by course, tag, or skill…"
            className="min-w-0 flex-1 bg-transparent text-[15px] text-[var(--navy)] outline-none placeholder:text-[var(--ink-soft)]"
          />
        </label>
        <div className="flex shrink-0 gap-2 px-1">
          <span className="rounded-xl bg-[var(--pastel-mint)] px-3.5 py-2 text-[13px] font-semibold text-[var(--navy)]">
            {inProgress} in progress
          </span>
          <span className="rounded-xl bg-[var(--pastel-sky)] px-3.5 py-2 text-[13px] font-semibold text-[var(--navy)]">
            {total} courses
          </span>
        </div>
      </div>

      {filteredSections.map((section) => (
        <CourseSectionRow key={section.id} section={section} />
      ))}

      {filteredSections.length === 0 && (
        <div className="rounded-3xl bg-white py-14 text-center">
          <p className="text-[20px] font-bold text-[var(--navy)]">No courses match</p>
          <p className="mt-2 text-[14px] text-[var(--ink-soft)]">Try another search.</p>
        </div>
      )}
    </div>
  );
}

function CourseSectionRow({ section }: { section: MyCourseSection }) {
  const ref = useRef<HTMLDivElement>(null);
  const preview = section.courses.slice(0, MY_COURSES_PREVIEW_LIMIT);
  const hasMore = section.courses.length > 0;
  const browseHref = `/dashboard/courses/browse/${section.id}`;

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
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white"
                style={{ background: 'var(--green)' }}
              >
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> Live
              </span>
            )}
            <h2 className="text-[19px] font-bold leading-tight text-[var(--navy)] sm:text-[22px]">
              {section.title}
            </h2>
          </div>
          {section.subtitle && (
            <p className="mt-0.5 text-[13px] sm:text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>
              {section.subtitle}
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {hasMore && (
            <Link
              href={browseHref}
              className="whitespace-nowrap text-[12.5px] font-semibold sm:text-[13px]"
              style={{ color: 'var(--green-deep)' }}
            >
              Show more
              {section.courses.length > MY_COURSES_PREVIEW_LIMIT
                ? ` (${section.courses.length})`
                : ''}
            </Link>
          )}
          <div className="hidden gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scroll(-1)}
              aria-label="Scroll left"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[var(--navy)] shadow-[0_4px_14px_-10px_rgba(18,50,79,0.5)] transition-colors hover:bg-[var(--pastel-mint)]"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              aria-label="Scroll right"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[var(--navy)] shadow-[0_4px_14px_-10px_rgba(18,50,79,0.5)] transition-colors hover:bg-[var(--pastel-mint)]"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={ref}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:gap-4 sm:px-0"
      >
        {preview.map((c) => (
          <div
            key={c.id}
            className="w-[min(78vw,280px)] flex-shrink-0 snap-start sm:w-[280px]"
          >
            <MyCourseCardView course={c} />
          </div>
        ))}
        {section.courses.length > MY_COURSES_PREVIEW_LIMIT && (
          <Link
            href={browseHref}
            className="flex w-[min(60vw,200px)] flex-shrink-0 snap-start flex-col items-center justify-center gap-2 border border-dashed px-4 text-center sm:w-[200px]"
            style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)', minHeight: 280 }}
          >
            <span className="font-display text-[18px]" style={{ color: 'var(--ink)' }}>
              Show more
            </span>
            <span className="text-[13px]">
              View all {section.courses.length} courses
            </span>
          </Link>
        )}
      </div>
    </section>
  );
}
