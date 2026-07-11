'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Star } from 'lucide-react';
import { Course } from '@/lib/types';
import { formatXAF } from '@/lib/format';

export default function CourseCard({ course }: { course: Course }) {
  const [imgOk, setImgOk] = useState(Boolean(course.courseImage));

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex flex-col overflow-hidden rounded-[20px] border bg-paper transition-all duration-200 hover:-translate-y-1 hover:shadow-card"
      style={{ borderColor: 'var(--line)' }}
    >
      <div
        className="relative flex aspect-[16/10] items-center justify-center overflow-hidden"
        style={{
          background:
            'repeating-linear-gradient(135deg, var(--paper-dim), var(--paper-dim) 10px, #E1EBF6 10px, #E1EBF6 20px)',
        }}
      >
        {imgOk && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={course.courseImage}
            alt={course.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgOk(false)}
          />
        )}
        {!imgOk && (
          <span className="px-4 text-center font-display text-lg" style={{ color: 'var(--green-deep)' }}>
            {course.name}
          </span>
        )}
        {course.featured ? (
          <span
            className="absolute left-3 top-3 rounded-full px-2.5 py-1 font-mono text-[10.5px] font-semibold uppercase tracking-wide"
            style={{ background: 'var(--green-deep)', color: 'var(--paper)' }}
          >
            Intellex
          </span>
        ) : course.bestSeller ? (
          <span
            className="absolute left-3 top-3 rounded-full px-2.5 py-1 font-mono text-[10.5px] font-semibold uppercase tracking-wide"
            style={{ background: 'var(--amber)', color: 'var(--ink)' }}
          >
            Bestseller
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-5">
        <h4 className="font-display text-[18px] font-semibold leading-snug line-clamp-2">{course.name}</h4>
        <p className="line-clamp-2 text-[13.5px] leading-snug" style={{ color: 'var(--ink-soft)' }}>
          {course.shortDescription}
        </p>
        <div className="flex flex-wrap items-center gap-2 text-[11px]" style={{ color: 'var(--ink-soft)' }}>
          {course.courseRating > 0 && (
            <span className="inline-flex items-center gap-1 font-mono">
              <Star size={12} style={{ fill: 'var(--amber)', color: 'var(--amber)' }} />
              {course.courseRating.toFixed(1)}
            </span>
          )}
          <span className="pill px-2 py-0.5">{course.type}</span>
          {course.courseDuration && <span className="opacity-80">{course.courseDuration}</span>}
        </div>

        <div className="mt-auto flex items-center justify-between border-t pt-3.5" style={{ borderColor: 'var(--line)' }}>
          <div className="font-display text-[18px] font-semibold">{formatXAF(course.currentPrice)}</div>
          <span className="text-[12.5px] font-semibold" style={{ color: 'var(--green-deep)' }}>
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}
