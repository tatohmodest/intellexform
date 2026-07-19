'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { Search } from 'lucide-react';

const CATEGORIES = [
  { label: 'Web Development', q: 'Web Development' },
  { label: 'Data Analysis', q: 'Data' },
  { label: 'Cybersecurity', q: 'Cybersecurity' },
  { label: 'AI & ML', q: 'Machine Learning' },
  { label: 'Cloud & Azure', q: 'Cloud' },
  { label: 'Python', q: 'Python' },
  { label: 'JavaScript', q: 'JavaScript' },
  { label: 'Design', q: 'Design' },
  { label: 'Digital Marketing', q: 'Marketing' },
  { label: 'IT Certification', q: 'IT Certification' },
];

export default function CategoryStrip() {
  const router = useRouter();
  const [q, setQ] = useState('');

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const query = q.trim();
    router.push(query ? `/courses?q=${encodeURIComponent(query)}` : '/courses');
  }

  return (
    <div className="border-b" style={{ borderColor: 'var(--line)', background: 'var(--paper)' }}>
      <div className="wrap py-4">
        <form onSubmit={onSubmit} className="relative mb-3.5 max-w-xl">
          <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--ink-soft)' }} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="form-input !rounded-full !py-3 !pl-11 !pr-4"
            placeholder="Search for courses, skills, or certificates…"
            aria-label="Search courses"
          />
        </form>
        <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {CATEGORIES.map((c) => (
            <Link
              key={c.label}
              href={`/courses?q=${encodeURIComponent(c.q)}`}
              className="whitespace-nowrap rounded-full border px-3.5 py-2 text-[13px] transition hover:-translate-y-0.5 hover:border-[var(--green)]"
              style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}
            >
              {c.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
