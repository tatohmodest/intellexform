'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Star } from 'lucide-react';
import { Course } from '@/lib/types';
import { formatXAF } from '@/lib/format';

function RatingStars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-[1px]">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i + 1 <= Math.round(rating);
        return (
          <Star
            key={i}
            size={12}
            style={{ fill: filled ? 'var(--amber)' : 'transparent', color: filled ? 'var(--amber)' : 'rgba(19,32,25,0.25)' }}
          />
        );
      })}
    </span>
  );
}

export default function CourseCard({ course, live = false }: { course: Course; live?: boolean }) {
  const [imgOk, setImgOk] = useState(Boolean(course.courseImage));
  const discounted = course.originalPrice > course.currentPrice;

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[16px] border bg-paper transition-all duration-200 hover:-translate-y-1 hover:shadow-card"
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
          <span className="px-4 text-center font-display text-base" style={{ color: 'var(--green-deep)' }}>
            {course.name}
          </span>
        )}

        {live ? (
          <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wide" style={{ background: 'var(--green)', color: '#fff' }}>
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> Live · Mentor-led
          </span>
        ) : course.featured ? (
          <span className="absolute left-2.5 top-2.5 rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wide" style={{ background: 'var(--green-deep)', color: '#fff' }}>
            Intellex
          </span>
        ) : course.bestSeller ? (
          <span className="absolute left-2.5 top-2.5 rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wide" style={{ background: 'var(--amber)', color: '#fff' }}>
            Bestseller
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3.5">
        <h4 className="font-display text-[15.5px] font-semibold leading-snug line-clamp-2">{course.name}</h4>
        {course.instructor && (
          <p className="text-[12px] leading-tight line-clamp-1" style={{ color: 'var(--ink-soft)' }}>{course.instructor}</p>
        )}

        {course.courseRating > 0 && (
          <div className="flex items-center gap-1.5 text-[12px]">
            <span className="font-semibold" style={{ color: '#8a5a00' }}>{course.courseRating.toFixed(1)}</span>
            <RatingStars rating={course.courseRating} />
            {course.courseNumberOfVotes > 0 && (
              <span style={{ color: 'var(--ink-soft)' }}>({course.courseNumberOfVotes.toLocaleString('en-US')})</span>
            )}
          </div>
        )}

        <div className="mt-auto flex items-center gap-2 pt-1.5">
          <span className="font-display text-[17px] font-semibold">{formatXAF(course.currentPrice)}</span>
          {discounted && (
            <span className="text-[12.5px] line-through" style={{ color: 'var(--ink-soft)' }}>{formatXAF(course.originalPrice)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
