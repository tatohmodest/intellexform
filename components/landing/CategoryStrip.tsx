'use client';

import Link from 'next/link';

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

export default function CategoryStrip() {
  return (
    <div className="border-b" style={{ borderColor: 'var(--line)', background: 'var(--paper)' }}>
      <div className="wrap py-3.5">
        <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
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
