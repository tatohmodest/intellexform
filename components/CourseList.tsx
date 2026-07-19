import Link from 'next/link';
import { Star, BadgeCheck } from 'lucide-react';
import { Course } from '@/lib/types';
import { formatXAF } from '@/lib/format';

/**
 * Coursera-style vertical list of courses (thumbnail + meta + price).
 * Used for certification tracks and denser catalogue sections.
 */
export default function CourseList({
  courses,
  issuer,
}: {
  courses: Course[];
  issuer?: string;
}) {
  if (!courses.length) return null;

  return (
    <div className="divide-y rounded-[18px] border" style={{ borderColor: 'var(--line)', background: 'var(--paper)' }}>
      {courses.map((c) => (
        <CourseListItem key={c.slug} course={c} issuer={issuer} />
      ))}
    </div>
  );
}

function CourseListItem({ course, issuer }: { course: Course; issuer?: string }) {
  const discounted = course.originalPrice > course.currentPrice;

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex gap-4 p-4 transition hover:bg-[var(--paper-dim)] sm:gap-5 sm:p-5"
    >
      <div
        className="relative h-[72px] w-[112px] flex-shrink-0 overflow-hidden rounded-xl sm:h-[88px] sm:w-[140px]"
        style={{
          background:
            'repeating-linear-gradient(135deg, var(--paper-dim), var(--paper-dim) 8px, #E1EBF6 8px, #E1EBF6 16px)',
        }}
      >
        {course.courseImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={course.courseImage} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <span className="flex h-full items-center justify-center px-2 text-center font-display text-[11px]" style={{ color: 'var(--green-deep)' }}>
            {course.name.slice(0, 28)}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          {issuer && (
            <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.1em]" style={{ color: 'var(--green-deep)' }}>
              <BadgeCheck size={12} /> {issuer}
            </span>
          )}
          {course.type && (
            <span className="text-[11px]" style={{ color: 'var(--ink-soft)' }}>{course.type}</span>
          )}
        </div>
        <h4 className="mb-1 font-display text-[16px] font-semibold leading-snug line-clamp-2 group-hover:underline sm:text-[17px]">
          {course.name}
        </h4>
        {course.instructor && (
          <p className="mb-1.5 text-[12.5px] line-clamp-1" style={{ color: 'var(--ink-soft)' }}>{course.instructor}</p>
        )}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px]">
          {course.courseRating > 0 && (
            <span className="inline-flex items-center gap-1">
              <span className="font-semibold" style={{ color: '#8a5a00' }}>{course.courseRating.toFixed(1)}</span>
              <Star size={12} style={{ fill: 'var(--amber)', color: 'var(--amber)' }} />
              {course.courseNumberOfVotes > 0 && (
                <span style={{ color: 'var(--ink-soft)' }}>({course.courseNumberOfVotes.toLocaleString('en-US')})</span>
              )}
            </span>
          )}
          {course.courseDuration && (
            <span style={{ color: 'var(--ink-soft)' }}>{course.courseDuration}</span>
          )}
        </div>
      </div>

      <div className="hidden flex-shrink-0 flex-col items-end justify-center sm:flex">
        <span className="font-display text-[18px] font-semibold">{formatXAF(course.currentPrice)}</span>
        {discounted && (
          <span className="text-[12px] line-through" style={{ color: 'var(--ink-soft)' }}>{formatXAF(course.originalPrice)}</span>
        )}
      </div>
    </Link>
  );
}
