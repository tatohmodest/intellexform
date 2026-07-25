'use client';

import Link from 'next/link';
import SiteSearch from '@/components/landing/SiteSearch';
import type { CourseSearchItem } from '@/lib/tutorials/searchFilter';
import type { TutorialSearchItem } from '@/lib/tutorials/searchTypes';

const CATEGORIES = [
  { label: 'Web Development', q: 'Web Development' },
  { label: 'Data Analysis', q: 'Data' },
  { label: 'Cybersecurity', q: 'Cybersecurity' },
  { label: 'AI & ML', q: 'Machine Learning' },
  { label: 'Cloud & Azure', q: 'Cloud' },
  { label: 'Python', q: 'Python' },
  { label: 'JavaScript', q: 'JavaScript' },
  { label: 'Tutorials', href: '/tutorials' },
  { label: 'Design', q: 'Design' },
  { label: 'Digital Marketing', q: 'Marketing' },
  { label: 'IT Certification', q: 'IT Certification' },
];

export default function CategoryStrip({
  tutorialIndex,
  courses = [],
}: {
  tutorialIndex: TutorialSearchItem[];
  courses?: CourseSearchItem[];
}) {
  return (
    <div className="relative z-40 border-b" style={{ borderColor: 'var(--line)', background: 'var(--paper)' }}>
      <div className="wrap overflow-visible py-4">
        <SiteSearch
          tutorialIndex={tutorialIndex}
          courses={courses}
          className="mb-3.5 max-w-xl"
          placeholder="Search for courses, tutorials, skills…"
        />
        <div className="no-scrollbar relative z-0 -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {CATEGORIES.map((c) =>
            'href' in c && c.href ? (
              <Link
                key={c.label}
                href={c.href}
                className="whitespace-nowrap rounded-full border px-3.5 py-2 text-[13px] transition hover:-translate-y-0.5 hover:border-[var(--green)]"
                style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}
              >
                {c.label}
              </Link>
            ) : (
              <Link
                key={c.label}
                href={`/courses?q=${encodeURIComponent(c.q!)}`}
                className="whitespace-nowrap rounded-full border px-3.5 py-2 text-[13px] transition hover:-translate-y-0.5 hover:border-[var(--green)]"
                style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}
              >
                {c.label}
              </Link>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
