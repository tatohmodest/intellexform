'use client';

import { useEffect, useState } from 'react';
import { Loader2, Search, Trash2, UserPlus } from 'lucide-react';

type Teacher = {
  userId: string;
  name: string;
  email: string;
  courses: Array<{ id: string; title: string; published: boolean; studentCount: number }>;
};
type Learner = { lbId: string; name: string; email: string };
type Enrollment = { studentId: string; studentName: string; studentEmail?: string | null; source: string };

export default function AdminAssignments() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [teacherId, setTeacherId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [roster, setRoster] = useState<Enrollment[]>([]);
  const [q, setQ] = useState('');
  const [results, setResults] = useState<Learner[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const teacher = teachers.find((t) => t.userId === teacherId);

  useEffect(() => {
    fetch('/api/admin/assignments')
      .then((r) => r.json())
      .then((d) => setTeachers(d.teachers || []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setRoster([]);
    if (!courseId) return;
    fetch(`/api/admin/assignments?courseId=${encodeURIComponent(courseId)}`)
      .then((r) => r.json())
      .then((d) => setRoster(d.enrollments || []));
  }, [courseId]);

  useEffect(() => {
    if (q.trim().length < 2) {
      setResults([]);
      return;
    }
    const t = setTimeout(() => {
      fetch(`/api/admin/assignments?students=${encodeURIComponent(q.trim())}`)
        .then((r) => r.json())
        .then((d) => setResults(d.students || []));
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  async function assign(studentId: string) {
    setBusy(true);
    setMsg('');
    const res = await fetch('/api/admin/assignments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId, studentId }),
    });
    const d = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) return setMsg(d.error || 'Could not assign.');
    setRoster(d.enrollments || []);
    setMsg(d.created ? 'Student assigned. They were notified.' : 'Already assigned.');
    setQ('');
  }

  async function remove(studentId: string) {
    const res = await fetch(
      `/api/admin/assignments?courseId=${encodeURIComponent(courseId)}&studentId=${encodeURIComponent(studentId)}`,
      { method: 'DELETE' },
    );
    const d = await res.json().catch(() => ({}));
    if (res.ok) setRoster(d.enrollments || []);
  }

  if (loading) {
    return (
      <p className="flex items-center gap-2 text-sm text-slate-500">
        <Loader2 size={14} className="animate-spin" /> Loading teachers…
      </p>
    );
  }

  const box = 'rounded-2xl border border-slate-200 bg-white p-5';
  const field = 'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none';

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <section className={box}>
        <h2 className="text-lg font-bold">1 · Pick a teacher and course</h2>
        <p className="mt-1 text-sm text-slate-500">
          Students you assign see the course (and the teacher) in their dashboard. The teacher sees them in My Students.
        </p>
        <select
          className={`${field} mt-4`}
          value={teacherId}
          onChange={(e) => {
            setTeacherId(e.target.value);
            setCourseId('');
          }}
        >
          <option value="">Select a teacher…</option>
          {teachers.map((t) => (
            <option key={t.userId} value={t.userId}>
              {t.name} ({t.email})
            </option>
          ))}
        </select>
        <select
          className={`${field} mt-3`}
          value={courseId}
          disabled={!teacher}
          onChange={(e) => setCourseId(e.target.value)}
        >
          <option value="">{teacher && teacher.courses.length === 0 ? 'This teacher has no courses' : 'Select a course…'}</option>
          {teacher?.courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title} · {c.studentCount} students
            </option>
          ))}
        </select>

        {courseId ? (
          <div className="mt-5">
            <h3 className="text-sm font-bold">Find a student</h3>
            <label className="relative mt-2 block">
              <Search size={15} className="absolute left-3 top-3 text-slate-400" />
              <input
                className={`${field} pl-9`}
                placeholder="Name or email"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </label>
            {results.length > 0 ? (
              <ul className="mt-2 divide-y divide-slate-100 rounded-xl border border-slate-200">
                {results.map((s) => (
                  <li key={s.lbId} className="flex items-center justify-between gap-3 px-3 py-2">
                    <span className="min-w-0 text-sm">
                      <span className="block truncate font-semibold">{s.name}</span>
                      <span className="block truncate text-xs text-slate-500">{s.email}</span>
                    </span>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => assign(s.lbId)}
                      className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white disabled:opacity-50"
                    >
                      <UserPlus size={13} /> Assign
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
            {msg ? <p className="mt-2 text-sm text-slate-600">{msg}</p> : null}
          </div>
        ) : null}
      </section>

      <section className={box}>
        <h2 className="text-lg font-bold">2 · Assigned students</h2>
        {!courseId ? (
          <p className="mt-3 text-sm text-slate-500">Choose a course to see its students.</p>
        ) : roster.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">No students yet.</p>
        ) : (
          <ul className="mt-3 divide-y divide-slate-100">
            {roster.map((s) => (
              <li key={s.studentId} className="flex items-center justify-between gap-3 py-2.5">
                <span className="min-w-0 text-sm">
                  <span className="block truncate font-semibold">{s.studentName}</span>
                  <span className="block truncate text-xs text-slate-500">
                    {s.studentEmail || s.studentId} · {s.source}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => remove(s.studentId)}
                  className="rounded-full p-2 text-red-600 hover:bg-red-50"
                  aria-label="Remove student"
                >
                  <Trash2 size={15} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
