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
    <div className="divide-y overflow-hidden rounded-[18px] border" style={{ borderColor: 'var(--line)', background: 'var(--paper)' }}>
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
      className="group flex gap-3 p-3.5 transition hover:bg-[var(--paper-dim)] sm:gap-5 sm:p-5"
    >
      <div
        className="relative h-[68px] w-[96px] flex-shrink-0 overflow-hidden rounded-xl sm:h-[88px] sm:w-[140px]"
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

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="mb-1 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5">
          {issuer && (
            <span className="inline-flex max-w-full items-center gap-1 truncate font-mono text-[10px] uppercase tracking-[0.1em]" style={{ color: 'var(--green-deep)' }}>
              <BadgeCheck size={12} className="shrink-0" /> {issuer}
            </span>
          )}
          {course.type && (
            <span className="truncate text-[11px]" style={{ color: 'var(--ink-soft)' }}>{course.type}</span>
          )}
        </div>
        <h4 className="font-display text-[14.5px] font-semibold leading-snug line-clamp-2 group-hover:underline sm:text-[17px]">
          {course.name}
        </h4>
        {course.instructor && (
          <p className="mt-0.5 text-[12px] line-clamp-1 sm:text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>{course.instructor}</p>
        )}

        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <div className="min-w-0 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[12px] sm:text-[12.5px]">
            {course.courseRating > 0 && (
              <span className="inline-flex items-center gap-1">
                <span className="font-semibold" style={{ color: '#8a5a00' }}>{course.courseRating.toFixed(1)}</span>
                <Star size={12} style={{ fill: 'var(--amber)', color: 'var(--amber)' }} />
                {course.courseNumberOfVotes > 0 && (
                  <span className="hidden sm:inline" style={{ color: 'var(--ink-soft)' }}>
                    ({course.courseNumberOfVotes.toLocaleString('en-US')})
                  </span>
                )}
              </span>
            )}
            {course.courseDuration && (
              <span className="truncate" style={{ color: 'var(--ink-soft)' }}>{course.courseDuration}</span>
            )}
          </div>

          <div className="shrink-0 text-right">
            <div className="font-display text-[15px] font-semibold sm:text-[18px]">{formatXAF(course.currentPrice)}</div>
            {discounted && (
              <div className="text-[11px] line-through sm:text-[12px]" style={{ color: 'var(--ink-soft)' }}>{formatXAF(course.originalPrice)}</div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
