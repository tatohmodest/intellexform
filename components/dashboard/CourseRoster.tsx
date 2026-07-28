'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2, Search, UserPlus, X } from 'lucide-react';

type Enrollment = {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail?: string | null;
  source: 'purchase' | 'instructor' | 'free';
  priceXAF: number;
  instructorXAF: number;
  isTrial: boolean;
  createdAt: string;
};

type StudentHit = {
  lbId: string;
  name: string;
  email: string;
  avatar?: string | null;
};

export default function CourseRoster({
  courseId,
  accent = '#00b369',
}: {
  courseId: string;
  accent?: string;
}) {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [hits, setHits] = useState<StudentHit[]>([]);
  const [searching, setSearching] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/learn/teacher-courses/${courseId}/enrollments`);
      const data = await res.json();
      setEnrollments(data.enrollments || []);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setHits([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/learn/students/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setHits(data.students || []);
      } catch {
        setHits([]);
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  async function addStudent(s: StudentHit) {
    setAddingId(s.lbId);
    setError('');
    try {
      const res = await fetch(`/api/learn/teacher-courses/${courseId}/enrollments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: s.lbId,
          studentName: s.name,
          studentEmail: s.email,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not add student');
      setEnrollments(data.enrollments || []);
      setQuery('');
      setHits([]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not add student');
    } finally {
      setAddingId(null);
    }
  }

  async function removeStudent(studentId: string) {
    const res = await fetch(
      `/api/learn/teacher-courses/${courseId}/enrollments?studentId=${encodeURIComponent(studentId)}`,
      { method: 'DELETE' },
    );
    const data = await res.json();
    if (res.ok) setEnrollments(data.enrollments || []);
  }

  const enrolledIds = new Set(enrollments.map((e) => e.studentId));

  return (
    <div className="space-y-6">
      <section>
        <label className="mb-1.5 block text-[13px] font-semibold">
          Add a student to this course
        </label>
        <p className="mb-2 text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
          Search anyone on InTelleX by name or email. Added students get the course in My
          Courses immediately - no payment needed.
        </p>
        <div className="relative">
          <Search
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--ink-soft)' }}
          />
          <input
            className="form-input !rounded-none !pl-9 text-[13px]"
            placeholder="Search students…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {searching && (
            <Loader2
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin"
              style={{ color: 'var(--ink-soft)' }}
            />
          )}
        </div>

        {hits.length > 0 && (
          <ul className="mt-2 border" style={{ borderColor: 'var(--line)' }}>
            {hits.map((s) => {
              const already = enrolledIds.has(s.lbId);
              return (
                <li
                  key={s.lbId}
                  className="flex items-center gap-3 border-b px-3 py-2.5 last:border-b-0"
                  style={{ borderColor: 'var(--line)' }}
                >
                  {s.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={s.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                  ) : (
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold text-white"
                      style={{ background: accent }}
                    >
                      {s.name.slice(0, 1).toUpperCase()}
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13.5px] font-semibold">{s.name}</span>
                    <span className="block truncate text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                      {s.email}
                    </span>
                  </span>
                  <button
                    type="button"
                    disabled={already || addingId === s.lbId}
                    onClick={() => addStudent(s)}
                    className="inline-flex shrink-0 items-center gap-1.5 border px-2.5 py-1.5 text-[12px] font-semibold disabled:opacity-50"
                    style={{ borderColor: 'var(--line)', color: already ? 'var(--ink-soft)' : accent }}
                  >
                    {addingId === s.lbId ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <UserPlus size={12} />
                    )}
                    {already ? 'Added' : 'Add'}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        {error && (
          <p className="mt-2 text-[13px]" style={{ color: '#b91c1c' }}>
            {error}
          </p>
        )}
      </section>

      <section>
        <h3 className="mb-3 font-display text-[19px]">
          Enrolled students ({enrollments.length})
        </h3>
        {loading ? (
          <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
            Loading…
          </p>
        ) : enrollments.length === 0 ? (
          <p className="text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>
            Nobody enrolled yet. Add your existing students above, or share the course so learners
            can buy it.
          </p>
        ) : (
          <ul className="divide-y border-y" style={{ borderColor: 'var(--line)' }}>
            {enrollments.map((e) => (
              <li key={e.id} className="flex flex-wrap items-center gap-3 py-3">
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-semibold">{e.studentName}</span>
                  <span
                    className="block font-mono text-[10px] uppercase tracking-[0.12em]"
                    style={{ color: 'var(--ink-soft)' }}
                  >
                    {e.source === 'instructor'
                      ? 'Added by you'
                      : e.priceXAF > 0
                        ? `Paid ${e.priceXAF.toLocaleString()} XAF`
                        : 'Free enrolment'}
                    {e.isTrial ? ' · trial (platform fee)' : ''}
                    {e.instructorXAF > 0 ? ` · you earn ${e.instructorXAF.toLocaleString()} XAF` : ''}
                    {' · '}
                    {new Date(e.createdAt).toLocaleDateString()}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => removeStudent(e.studentId)}
                  aria-label={`Remove ${e.studentName}`}
                  className="shrink-0"
                >
                  <X size={15} style={{ color: 'var(--ink-soft)' }} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
