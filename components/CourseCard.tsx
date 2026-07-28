'use client';

import Link from 'next/link';
import { Star } from 'lucide-react';
import { Course } from '@/lib/types';
import { formatXAF } from '@/lib/format';
import GeoTaggedImage from '@/components/seo/GeoTaggedImage';

function RatingStars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-[1px]">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i + 1 <= Math.round(rating);
        return (
          <Star
            key={i}
            size={11}
            className="sm:h-3 sm:w-3"
            style={{ fill: filled ? 'var(--amber)' : 'transparent', color: filled ? 'var(--amber)' : 'rgba(19,32,25,0.25)' }}
          />
        );
      })}
    </span>
  );
}

export default function CourseCard({ course, live = false }: { course: Course; live?: boolean }) {
  const discounted = course.originalPrice > course.currentPrice;
  const hasImage = Boolean(course.courseImage);

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex h-full min-w-0 flex-col overflow-hidden rounded-[14px] border bg-paper transition-all duration-200 hover:-translate-y-1 hover:shadow-card sm:rounded-[16px]"
      style={{ borderColor: 'var(--line)' }}
    >
      <div
        className="relative flex aspect-[16/10] items-center justify-center overflow-hidden"
        style={{
          background:
            'repeating-linear-gradient(135deg, var(--paper-dim), var(--paper-dim) 10px, #E1EBF6 10px, #E1EBF6 20px)',
        }}
      >
        {hasImage ? (
          <GeoTaggedImage
            src={course.courseImage}
            name={course.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="px-3 text-center font-display text-[13px] sm:px-4 sm:text-base" style={{ color: 'var(--green-deep)' }}>
            {course.name}
          </span>
        )}

        {live ? (
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wide sm:left-2.5 sm:top-2.5 sm:gap-1.5 sm:px-2.5 sm:py-1 sm:text-[10px]" style={{ background: 'var(--green)', color: '#fff' }}>
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> Live
          </span>
        ) : course.featured ? (
          <span className="absolute left-2 top-2 rounded-full px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wide sm:left-2.5 sm:top-2.5 sm:px-2.5 sm:py-1 sm:text-[10px]" style={{ background: 'var(--green-deep)', color: '#fff' }}>
            Intellex
          </span>
        ) : course.bestSeller ? (
          <span className="absolute left-2 top-2 rounded-full px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wide sm:left-2.5 sm:top-2.5 sm:px-2.5 sm:py-1 sm:text-[10px]" style={{ background: 'var(--amber)', color: '#fff' }}>
            Bestseller
          </span>
        ) : null}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1 p-2.5 sm:gap-1.5 sm:p-3.5">
        <h4 className="min-w-0 font-display text-[13.5px] font-semibold leading-snug line-clamp-2 sm:text-[15.5px]">{course.name}</h4>
        {course.instructor && (
          <p className="min-w-0 text-[11px] leading-tight line-clamp-1 sm:text-[12px]" style={{ color: 'var(--ink-soft)' }}>{course.instructor}</p>
        )}

        {course.courseRating > 0 && (
          <div className="flex items-center gap-1 text-[11px] sm:text-[12px]">
            <span className="font-semibold" style={{ color: 'var(--amber)' }}>{course.courseRating.toFixed(1)}</span>
            <RatingStars rating={course.courseRating} />
            {course.courseNumberOfVotes > 0 && (
              <span style={{ color: 'var(--ink-soft)' }}>({course.courseNumberOfVotes.toLocaleString('en-US')})</span>
            )}
          </div>
        )}

        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <span className="font-display text-[15px] font-semibold sm:text-[17px]">{formatXAF(course.currentPrice)}</span>
          {discounted && (
            <span className="text-[11px] line-through sm:text-[12px]" style={{ color: 'var(--ink-soft)' }}>
              {formatXAF(course.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
