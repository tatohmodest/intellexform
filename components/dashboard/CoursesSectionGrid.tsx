'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import MyCourseCardView from '@/components/dashboard/MyCourseCardView';
import type { MyCourseSection } from '@/lib/learn/myCourses';

export default function CoursesSectionGrid({ section }: { section: MyCourseSection }) {
  const [query, setQuery] = useState('');

  const courses = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return section.courses;
    return section.courses.filter((c) =>
      `${c.title} ${c.subtitle} ${c.tagline} ${c.tag} ${c.instructorName || ''}`
        .toLowerCase()
        .includes(q),
    );
  }, [section.courses, query]);

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/dashboard/courses"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold"
          style={{ color: 'var(--green-deep)' }}
        >
          <ArrowLeft size={14} /> My Courses
        </Link>
      </div>

      <header className="mb-8 border-b pb-8" style={{ borderColor: 'var(--line)' }}>
        <div className="flex flex-wrap items-center gap-2">
          {section.live && (
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wide text-white"
              style={{ background: 'var(--green)' }}
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> Live
            </span>
          )}
          <p
            className="font-mono text-[11px] uppercase tracking-[0.2em]"
            style={{ color: 'var(--ink-soft)' }}
          >
            Full catalogue
          </p>
        </div>
        <h1 className="mt-3 font-display text-[34px] leading-[0.95] tracking-tight sm:text-[46px]">
          {section.title}
        </h1>
        {section.subtitle && (
          <p className="mt-4 max-w-[480px] text-[15px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
            {section.subtitle}
          </p>
        )}
        <p
          className="mt-4 font-mono text-[11px] uppercase tracking-[0.12em]"
          style={{ color: 'var(--ink-soft)' }}
        >
          {section.courses.length} course{section.courses.length === 1 ? '' : 's'}
        </p>
      </header>

      <label className="mb-8 block max-w-md">
        <span className="sr-only">Search this section</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search in this list…"
          className="form-input w-full !rounded-none border-0 border-b !px-0 !py-3 text-[16px] !shadow-none"
          style={{ borderColor: 'var(--line)', background: 'transparent' }}
        />
      </label>

      {courses.length === 0 ? (
        <div className="border-t py-16 text-center" style={{ borderColor: 'var(--line)' }}>
          <p className="font-display text-[22px]">No courses match</p>
          <p className="mt-2 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
            Try another search, or go back to My Courses.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <MyCourseCardView key={c.id} course={c} />
          ))}
        </div>
      )}
    </div>
  );
}
