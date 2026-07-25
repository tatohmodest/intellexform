'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { BookOpen, GraduationCap, Search } from 'lucide-react';
import { filterTutorialSearchIndex, type TutorialSearchItem } from '@/lib/tutorials/searchFilter';

export type CourseSearchItem = {
  slug: string;
  name: string;
  type?: string;
  shortDescription?: string;
};

function filterCourses(courses: CourseSearchItem[], query: string, limit = 6) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return courses
    .filter((c) => {
      const hay = `${c.name} ${c.type || ''} ${c.shortDescription || ''}`.toLowerCase();
      return hay.includes(q);
    })
    .slice(0, limit);
}

export default function SiteSearch({
  tutorialIndex,
  courses = [],
  placeholder = 'Search courses, tutorials, skills…',
  className = '',
  compact = false,
}: {
  tutorialIndex: TutorialSearchItem[];
  courses?: CourseSearchItem[];
  placeholder?: string;
  className?: string;
  compact?: boolean;
}) {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);

  const tutorialHits = useMemo(() => filterTutorialSearchIndex(tutorialIndex, q, 8), [tutorialIndex, q]);
  const courseHits = useMemo(() => filterCourses(courses, q, 6), [courses, q]);
  const tutorialCourses = tutorialHits.filter((i) => i.kind === 'tutorial');
  const tutorialLessons = tutorialHits.filter((i) => i.kind === 'lesson');
  const hasResults = courseHits.length > 0 || tutorialHits.length > 0;
  const showPanel = open && q.trim().length >= 1;

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const query = q.trim();
    setOpen(false);
    router.push(query ? `/search?q=${encodeURIComponent(query)}` : '/search');
  }

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <form onSubmit={onSubmit} className="relative">
        <Search
          size={compact ? 16 : 18}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2"
          style={{ color: 'var(--ink-soft)' }}
        />
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          className={`form-input w-full !rounded-full ${compact ? '!py-2.5 !pl-10 !pr-3 text-[13.5px]' : '!py-3 !pl-11 !pr-4'}`}
          placeholder={placeholder}
          aria-label="Search courses and tutorials"
          autoComplete="off"
        />
      </form>

      {showPanel && (
        <div
          className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border shadow-card"
          style={{ background: 'var(--paper)', borderColor: 'var(--line)' }}
        >
          {!hasResults ? (
            <div className="px-4 py-5 text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>
              No matches for “{q.trim()}”. Try another skill or open all tutorials.
              <div className="mt-3 flex flex-wrap gap-2">
                <Link href={`/courses?q=${encodeURIComponent(q.trim())}`} className="text-[13px] font-semibold" style={{ color: 'var(--green-deep)' }} onClick={() => setOpen(false)}>
                  Search courses
                </Link>
                <Link href="/tutorials" className="text-[13px] font-semibold" style={{ color: 'var(--blue-ink)' }} onClick={() => setOpen(false)}>
                  Browse tutorials
                </Link>
              </div>
            </div>
          ) : (
            <div className="max-h-[min(70vh,420px)] overflow-y-auto py-2">
              {courseHits.length > 0 && (
                <div className="px-2 pb-1">
                  <div className="px-2.5 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.1em]" style={{ color: 'var(--ink-soft)' }}>
                    Courses
                  </div>
                  {courseHits.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/courses/${c.slug}`}
                      onClick={() => setOpen(false)}
                      className="flex items-start gap-2.5 rounded-xl px-2.5 py-2.5 transition-colors hover:bg-[var(--paper-dim)]"
                    >
                      <GraduationCap size={16} className="mt-0.5 shrink-0" style={{ color: 'var(--green-deep)' }} />
                      <span className="min-w-0">
                        <span className="block truncate text-[14px] font-medium">{c.name}</span>
                        <span className="block truncate text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                          {c.type || 'Course'}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              )}

              {tutorialCourses.length > 0 && (
                <div className="px-2 pb-1">
                  <div className="px-2.5 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.1em]" style={{ color: 'var(--ink-soft)' }}>
                    Tutorials
                  </div>
                  {tutorialCourses.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-start gap-2.5 rounded-xl px-2.5 py-2.5 transition-colors hover:bg-[var(--paper-dim)]"
                    >
                      <BookOpen size={16} className="mt-0.5 shrink-0" style={{ color: 'var(--blue-ink)' }} />
                      <span className="min-w-0">
                        <span className="block truncate text-[14px] font-medium">{item.title}</span>
                        <span className="block truncate text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                          {item.tag || 'Tutorial path'}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              )}

              {tutorialLessons.length > 0 && (
                <div className="px-2 pb-1">
                  <div className="px-2.5 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.1em]" style={{ color: 'var(--ink-soft)' }}>
                    Lessons
                  </div>
                  {tutorialLessons.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-start gap-2.5 rounded-xl px-2.5 py-2.5 transition-colors hover:bg-[var(--paper-dim)]"
                    >
                      <BookOpen size={16} className="mt-0.5 shrink-0" style={{ color: 'var(--ink-soft)' }} />
                      <span className="min-w-0">
                        <span className="block truncate text-[14px] font-medium">{item.title}</span>
                        <span className="block truncate text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                          {item.courseTitle}
                          {item.level ? ` · ${item.level}` : ''}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              )}

              <div className="border-t px-4 py-2.5" style={{ borderColor: 'var(--line)' }}>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
                  }}
                  className="text-[13px] font-semibold"
                  style={{ color: 'var(--green-deep)' }}
                >
                  View all results for “{q.trim()}”
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
