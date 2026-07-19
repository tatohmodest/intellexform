'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { Course } from '@/lib/types';
import CourseCard from '@/components/CourseCard';

export default function CoursesBrowser({ courses }: { courses: Course[] }) {
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get('q') || '');
  const [category, setCategory] = useState('All');

  const categories = useMemo(() => {
    const set = new Set<string>();
    courses.forEach((c) => c.type && set.add(c.type));
    return ['All', ...Array.from(set).sort()];
  }, [courses]);

  const featured = courses.filter((c) => c.featured);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return courses.filter((c) => {
      if (category !== 'All' && c.type !== category) return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.instructor.toLowerCase().includes(q) ||
        c.type.toLowerCase().includes(q) ||
        (c.shortDescription || '').toLowerCase().includes(q)
      );
    });
  }, [courses, query, category]);

  const showFeatured = !query.trim() && category === 'All';

  return (
    <div>
      {/* Search + filters */}
      <div className="mb-8 flex flex-col gap-4">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--ink-soft)' }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses, instructors, topics…"
            className="form-input pl-11"
            style={{ background: 'var(--paper)' }}
          />
        </div>
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className="whitespace-nowrap rounded-full px-3.5 py-2 font-mono text-[11.5px] transition-colors"
              style={{
                border: `1px solid ${category === cat ? 'var(--ink)' : 'var(--line)'}`,
                background: category === cat ? 'var(--ink)' : 'transparent',
                color: category === cat ? 'var(--paper)' : 'var(--ink-soft)',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {showFeatured && featured.length > 0 && (
        <div className="mb-12">
          <div className="mb-5 flex items-center gap-3">
            <div className="tab">Intellex programs</div>
            <div className="h-px flex-1" style={{ background: 'var(--line)' }} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((c) => (
              <CourseCard key={c.slug} course={c} />
            ))}
          </div>
        </div>
      )}

      <div className="mb-5 flex items-center gap-3">
        <div className="tab">{showFeatured ? 'Full catalogue' : `${filtered.length} result${filtered.length === 1 ? '' : 's'}`}</div>
        <div className="h-px flex-1" style={{ background: 'var(--line)' }} />
      </div>

      {filtered.length === 0 ? (
        <div className="py-20 text-center" style={{ color: 'var(--ink-soft)' }}>
          <p className="font-display text-xl">No courses match your search</p>
          <p className="mt-1 text-sm">Try a different term or category.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {(showFeatured ? filtered.filter((c) => !c.featured) : filtered).map((c) => (
            <CourseCard key={c.slug} course={c} />
          ))}
        </div>
      )}
    </div>
  );
}
