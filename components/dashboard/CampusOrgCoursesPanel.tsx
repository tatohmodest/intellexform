'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Loader2, Plus } from 'lucide-react';

type Course = {
  id: string;
  slug: string;
  title: string;
  status: string;
  priceXaf: number;
  _count?: { enrollments: number; sections: number };
};

export default function CampusOrgCoursesPanel({
  slug,
  accent = '#00b369',
  isStaff,
}: {
  slug: string;
  accent?: string;
  isStaff: boolean;
}) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [enrollCourseId, setEnrollCourseId] = useState('');
  const [enrollEmail, setEnrollEmail] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/org/${encodeURIComponent(slug)}/courses`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setCourses(data.courses || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (isStaff) load().catch(() => {});
  }, [isStaff, load]);

  async function createCourse(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch(`/api/org/${encodeURIComponent(slug)}/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not create');
      setTitle('');
      setDescription('');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setBusy(false);
    }
  }

  async function enroll(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch(`/api/org/${encodeURIComponent(slug)}/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'enroll',
          courseId: enrollCourseId,
          email: enrollEmail,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not enroll');
      setEnrollEmail('');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setBusy(false);
    }
  }

  if (!isStaff) {
    return (
      <p className="text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>
        Sign in as campus staff to manage organization courses.
      </p>
    );
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <BookOpen size={17} style={{ color: accent }} />
          <h2 className="font-display text-[21px]">Organization courses</h2>
        </div>
        <Link
          href={`/dashboard/teach/courses?campus=${encodeURIComponent(slug)}`}
          className="text-[13px] font-semibold"
          style={{ color: accent }}
        >
          Open teaching studio →
        </Link>
      </div>

      <form onSubmit={createCourse} className="space-y-2 border p-4" style={{ borderColor: 'var(--line)' }}>
        <p className="text-[13px] font-semibold inline-flex items-center gap-2">
          <Plus size={14} /> Create course (Prisma LMS)
        </p>
        <input
          className="form-input !rounded-none"
          required
          placeholder="Course title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="form-input !rounded-none"
          rows={2}
          placeholder="Short description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center gap-2 px-3 py-2 text-[13px] font-semibold text-white"
          style={{ background: accent }}
        >
          {busy ? <Loader2 size={14} className="animate-spin" /> : null}
          Create draft
        </button>
      </form>

      <form onSubmit={enroll} className="flex flex-wrap gap-2 border p-4" style={{ borderColor: 'var(--line)' }}>
        <p className="w-full text-[13px] font-semibold">Enroll student into course</p>
        <select
          className="form-input !rounded-none"
          required
          value={enrollCourseId}
          onChange={(e) => setEnrollCourseId(e.target.value)}
        >
          <option value="">Select course</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
        <input
          className="form-input !rounded-none"
          type="email"
          required
          placeholder="student@email.com"
          value={enrollEmail}
          onChange={(e) => setEnrollEmail(e.target.value)}
        />
        <button
          type="submit"
          disabled={busy || !enrollCourseId}
          className="border px-3 py-2 text-[13px] font-semibold"
          style={{ borderColor: 'var(--line)' }}
        >
          Enroll
        </button>
      </form>

      {error ? (
        <p className="text-[13px]" style={{ color: '#b91c1c' }}>
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
          Loading courses…
        </p>
      ) : courses.length === 0 ? (
        <div
          className="border border-dashed p-6 text-[13.5px]"
          style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}
        >
          Your organization hasn&apos;t created any LMS courses yet. Create a draft above or use Teaching
          Studio for richer lesson media.
        </div>
      ) : (
        <div className="overflow-x-auto border" style={{ borderColor: 'var(--line)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--paper-dim)' }}>
                {['Title', 'Status', 'Enrollments', 'Price'].map((h) => (
                  <th key={h} className="px-3 py-2 text-left text-xs" style={{ color: 'var(--ink-soft)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.id} className="border-t" style={{ borderColor: 'var(--line)' }}>
                  <td className="px-3 py-2 font-semibold">{c.title}</td>
                  <td className="px-3 py-2">{c.status}</td>
                  <td className="px-3 py-2">{c._count?.enrollments ?? 0}</td>
                  <td className="px-3 py-2">{c.priceXaf ? `${c.priceXaf} XAF` : 'Free'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
