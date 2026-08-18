'use client';

import { useState } from 'react';
import Link from 'next/link';

type Student = {
  studentId: string;
  studentName: string;
  studentEmail: string | null;
  program: string;
  year: string;
  cohort: string;
  department: string;
  campusSlug: string;
  status: string;
  studentCode: string;
  classHead: boolean;
};

type Group = {
  courseId: string;
  courseTitle: string;
  published: boolean;
  studentCount: number;
  students: Student[];
};

type CourseOpt = { id: string; title: string; instructorId: string; instructorName: string };

type Teacher = {
  userId: string;
  name: string;
  email: string;
  title: string;
  canTeach: boolean;
  courseCount: number;
  studentCount: number;
  staffPost: { desks: string[]; extraPermissions: string[]; active: boolean } | null;
  groups: Group[];
  assignableCourses: CourseOpt[];
};

export default function TeacherDetail({
  initial,
  canManage,
  canStaff,
}: {
  initial: Teacher;
  canManage: boolean;
  canStaff: boolean;
}) {
  const [teacher, setTeacher] = useState(initial);
  const [courseId, setCourseId] = useState('');
  const [busy, setBusy] = useState('');
  const [msg, setMsg] = useState('');

  async function post(body: Record<string, unknown>) {
    setBusy(String(body.action || 'save'));
    setMsg('');
    try {
      const res = await fetch(`/api/staff/teachers/${teacher.userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not save');
      if (data.teacher) setTeacher(data.teacher);
      setMsg('Saved.');
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Could not save');
    } finally {
      setBusy('');
    }
  }

  return (
    <div className="space-y-6">
      {msg ? (
        <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
          {msg}
        </p>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-3">
        {[
          ['Courses', String(teacher.courseCount)],
          ['Students', String(teacher.studentCount)],
          ['Teaching access', teacher.canTeach ? 'Yes' : 'Not yet'],
        ].map(([label, value]) => (
          <div key={label} className="border p-4" style={{ borderColor: 'var(--line)' }}>
            <p className="font-display text-[22px]">{value}</p>
            <p className="font-mono text-[10px] uppercase tracking-wide" style={{ color: 'var(--ink-soft)' }}>
              {label}
            </p>
          </div>
        ))}
      </section>

      {canManage ? (
        <section className="border p-4" style={{ borderColor: 'var(--line)' }}>
          <h2 className="mb-2 font-display text-[20px]">Assign a course</h2>
          <p className="mb-3 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
            This person becomes the instructor for that course. Their students then show in the roster below.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="min-w-0 flex-1 border px-3 py-2 text-[14px]"
              style={{ borderColor: 'var(--line)', background: 'transparent' }}
            >
              <option value="">Choose a course…</option>
              {teacher.assignableCourses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                  {c.instructorId && c.instructorId !== teacher.userId ? ` · now ${c.instructorName}` : ''}
                </option>
              ))}
            </select>
            <button
              type="button"
              disabled={!courseId || busy === 'assign_course'}
              onClick={() => void post({ action: 'assign_course', courseId })}
              className="px-4 py-2 text-[13px] font-semibold text-white"
              style={{ background: '#00B369' }}
            >
              {busy === 'assign_course' ? 'Assigning…' : 'Assign'}
            </button>
          </div>
          {!teacher.canTeach ? (
            <button
              type="button"
              className="mt-3 border px-3 py-2 text-[13px] font-semibold"
              style={{ borderColor: 'var(--line)' }}
              disabled={busy === 'grant'}
              onClick={() => void post({ action: 'grant' })}
            >
              {busy === 'grant' ? 'Granting…' : 'Give teaching access'}
            </button>
          ) : null}
          {canStaff ? (
            <p className="mt-3 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
              Staff workspace privileges (fees, students, this Teachers view) are granted from{' '}
              <Link href="/dashboard/staff/team" className="font-semibold" style={{ color: 'var(--green-deep)' }}>
                Appoint staff
              </Link>
              .
            </p>
          ) : null}
        </section>
      ) : null}

      {teacher.groups.length === 0 ? (
        <div className="rounded-2xl border border-dashed px-4 py-10 text-center" style={{ borderColor: 'var(--line)' }}>
          <p className="font-display text-[20px]">No courses assigned yet</p>
          <p className="mt-1 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
            Assign a course above, or they will appear here after they create one in Teach.
          </p>
        </div>
      ) : (
        teacher.groups.map((g) => (
          <section key={g.courseId} className="border p-4" style={{ borderColor: 'var(--line)' }}>
            <h2 className="font-display text-[20px]">{g.courseTitle}</h2>
            <p className="mb-3 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
              {g.studentCount} student{g.studentCount === 1 ? '' : 's'}
              {g.published ? '' : ' · draft'}
            </p>
            {g.students.length === 0 ? (
              <p className="text-[14px]" style={{ color: 'var(--ink-soft)' }}>
                No students enrolled in this course.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-[13px]">
                  <thead>
                    <tr className="border-b text-[11px] uppercase tracking-wide" style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}>
                      <th className="py-2 pr-3 font-medium">Student</th>
                      <th className="py-2 pr-3 font-medium">Program</th>
                      <th className="py-2 pr-3 font-medium">Level</th>
                      <th className="py-2 pr-3 font-medium">Class</th>
                      <th className="py-2 font-medium">Campus</th>
                    </tr>
                  </thead>
                  <tbody>
                    {g.students.map((s) => (
                      <tr key={s.studentId} className="border-b last:border-0" style={{ borderColor: 'var(--line)' }}>
                        <td className="py-2 pr-3">
                          <Link href={`/dashboard/staff/students/${s.studentId}`} className="font-semibold" style={{ color: 'var(--green-deep)' }}>
                            {s.studentName}
                          </Link>
                          <div className="text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                            {s.studentEmail || s.studentCode || ''}
                            {s.classHead ? ' · class advocate' : ''}
                          </div>
                        </td>
                        <td className="py-2 pr-3">
                          {s.program || '—'}
                          {s.department ? (
                            <div className="text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                              {s.department}
                            </div>
                          ) : null}
                        </td>
                        <td className="py-2 pr-3">{s.year || '—'}</td>
                        <td className="py-2 pr-3">{s.cohort || '—'}</td>
                        <td className="py-2">{s.campusSlug || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ))
      )}
    </div>
  );
}
