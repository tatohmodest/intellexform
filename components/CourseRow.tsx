'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Course } from '@/lib/types';
import CourseCard from '@/components/CourseCard';

/**
 * Udemy/Coursera-style horizontal course row: a title, optional link, and a
 * horizontally scrollable (snap) rail of course cards with arrow controls.
 */
export default function CourseRow({
  title,
  subtitle,
  courses,
  live = false,
  href,
}: {
  title: string;
  subtitle?: string;
  courses: Course[];
  live?: boolean;
  href?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  if (!courses.length) return null;

  const scroll = (dir: number) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(el.clientWidth * 0.85, 260), behavior: 'smooth' });
  };

  return (
    <div className="mb-12">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            {live && (
              <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wide" style={{ background: 'var(--green)', color: '#fff' }}>
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> Live
              </span>
            )}
            <h3 className="font-display text-[21px] sm:text-[24px]">{title}</h3>
          </div>
          {subtitle && <p className="mt-0.5 text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {href && (
            <Link href={href} className="hidden whitespace-nowrap text-[13px] font-semibold sm:inline" style={{ color: 'var(--green-deep)' }}>
              See all →
            </Link>
          )}
          <div className="hidden gap-2 sm:flex">
            <button onClick={() => scroll(-1)} aria-label="Scroll left" className="flex h-9 w-9 items-center justify-center rounded-full border transition-colors hover:bg-[var(--paper-dim)]" style={{ borderColor: 'var(--line)' }}>
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => scroll(1)} aria-label="Scroll right" className="flex h-9 w-9 items-center justify-center rounded-full border transition-colors hover:bg-[var(--paper-dim)]" style={{ borderColor: 'var(--line)' }}>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-12 sm:block" style={{ background: 'linear-gradient(to left, var(--paper), transparent)' }} />
        <div
          ref={ref}
          className="no-scrollbar -mx-5 flex snap-x gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0"
        >
          {courses.map((c) => (
            <div key={c.slug} className="w-[240px] flex-shrink-0 snap-start sm:w-[250px]">
              <CourseCard course={c} live={live} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
