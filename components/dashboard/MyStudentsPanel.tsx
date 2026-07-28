'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ClipboardList,
  GraduationCap,
  Search,
  Users,
} from 'lucide-react';
import type { InstructorCourseStudents } from '@/lib/learn/ecosystem';

export default function MyStudentsPanel({
  groups,
  totalStudents,
}: {
  groups: InstructorCourseStudents[];
  totalStudents: number;
}) {
  const [query, setQuery] = useState('');
  const [openCourseId, setOpenCourseId] = useState<string | null>(
    groups.find((g) => g.studentCount > 0)?.courseId ?? groups[0]?.courseId ?? null,
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    return groups
      .map((g) => ({
        ...g,
        students: g.students.filter((s) =>
          `${s.studentName} ${s.studentEmail || ''} ${g.courseTitle}`.toLowerCase().includes(q),
        ),
      }))
      .filter((g) => g.students.length > 0 || g.courseTitle.toLowerCase().includes(q));
  }, [groups, query]);

  const active = filtered.find((g) => g.courseId === openCourseId) || filtered[0] || null;

  return (
    <div>
      <div
        className="mb-8 flex flex-col gap-6 border-b pb-8 sm:flex-row sm:items-end sm:justify-between"
        style={{ borderColor: 'var(--line)' }}
      >
        <div className="max-w-[520px]">
          <p
            className="font-mono text-[11px] uppercase tracking-[0.18em]"
            style={{ color: 'var(--ink-soft)' }}
          >
            Grouped by enrolment
          </p>
          <p className="mt-2 text-[15px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
            See who is in each of your courses. Assign an exam or assignment to everyone enrolled
            in that course from Assessment Studio.
          </p>
        </div>
        <div
          className="flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-[0.12em]"
          style={{ color: 'var(--ink-soft)' }}
        >
          <span>{totalStudents} students</span>
          <span style={{ color: 'var(--line)' }}>·</span>
          <span>{groups.length} courses</span>
        </div>
      </div>

      <label className="mb-8 block max-w-md">
        <span className="sr-only">Search students</span>
        <span className="relative block">
          <Search
            size={14}
            className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--ink-soft)' }}
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by student, email, or course…"
            className="form-input w-full !rounded-none border-0 border-b !px-0 !py-3 !pl-6 text-[16px] !shadow-none"
            style={{ borderColor: 'var(--line)', background: 'transparent' }}
          />
        </span>
      </label>

      {groups.length === 0 ? (
        <div className="border border-dashed px-6 py-14 text-center" style={{ borderColor: 'var(--line)' }}>
          <GraduationCap size={26} className="mx-auto mb-4" style={{ color: 'var(--green-deep)' }} />
          <h3 className="font-display text-[20px]">No courses yet</h3>
          <p className="mx-auto mt-2 max-w-sm text-[14px]" style={{ color: 'var(--ink-soft)' }}>
            Create a course in Course Studio, then add students from the Students tab - they will
            show up here by course.
          </p>
          <Link
            href="/dashboard/teach/courses"
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 text-[13.5px] font-semibold text-white"
            style={{ background: 'var(--green)' }}
          >
            Open Course Studio
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="min-w-0">
            <p
              className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em]"
              style={{ color: 'var(--ink-soft)' }}
            >
              Courses
            </p>
            <ul className="space-y-1">
              {filtered.map((g) => {
                const selected = active?.courseId === g.courseId;
                return (
                  <li key={g.courseId}>
                    <button
                      type="button"
                      onClick={() => setOpenCourseId(g.courseId)}
                      className="flex w-full items-start justify-between gap-2 px-3 py-3 text-left transition-colors"
                      style={
                        selected
                          ? {
                              background: 'rgba(0,179,105,0.1)',
                              color: 'var(--green-deep)',
                            }
                          : { color: 'var(--ink)' }
                      }
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-[14px] font-semibold">
                          {g.courseTitle}
                        </span>
                        <span
                          className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.12em]"
                          style={{ color: selected ? 'var(--green-deep)' : 'var(--ink-soft)' }}
                        >
                          {g.published ? 'Published' : 'Draft'} · {g.students.length} enrolled
                        </span>
                      </span>
                      <span className="shrink-0 font-display text-[18px] leading-none">
                        {g.students.length}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          <section className="min-w-0">
            {active ? (
              <>
                <div
                  className="mb-5 flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-end sm:justify-between"
                  style={{ borderColor: 'var(--line)' }}
                >
                  <div className="min-w-0">
                    <p
                      className="font-mono text-[10px] uppercase tracking-[0.14em]"
                      style={{ color: 'var(--ink-soft)' }}
                    >
                      Enrolled in
                    </p>
                    <h2 className="font-display text-[24px] leading-tight sm:text-[28px]">
                      {active.courseTitle}
                    </h2>
                    <p className="mt-1 text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>
                      {active.students.length} student
                      {active.students.length === 1 ? '' : 's'}
                      {!active.published ? ' · course still a draft' : ''}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/dashboard/teach/assessments?courseId=${encodeURIComponent(active.courseId)}&kind=assignment`}
                      className="inline-flex items-center gap-1.5 border px-3.5 py-2.5 text-[13px] font-semibold"
                      style={{ borderColor: 'var(--ink)', color: 'var(--ink)' }}
                    >
                      <ClipboardList size={14} /> Assign assignment
                    </Link>
                    <Link
                      href={`/dashboard/teach/assessments?courseId=${encodeURIComponent(active.courseId)}&kind=exam`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-[13px] font-semibold text-white"
                      style={{ background: 'var(--green)' }}
                    >
                      <GraduationCap size={14} /> Assign exam
                    </Link>
                  </div>
                </div>

                <div className="mb-4 flex flex-wrap gap-2">
                  <Link
                    href={`/dashboard/teach/courses`}
                    className="text-[13px] font-semibold"
                    style={{ color: 'var(--green-deep)' }}
                  >
                    Manage roster in Course Studio →
                  </Link>
                </div>

                {active.students.length === 0 ? (
                  <div
                    className="border border-dashed px-5 py-10 text-center"
                    style={{ borderColor: 'var(--line)' }}
                  >
                    <Users size={22} className="mx-auto mb-3" style={{ color: 'var(--ink-soft)' }} />
                    <p className="font-display text-[18px]">No students in this course yet</p>
                    <p className="mx-auto mt-1 max-w-sm text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>
                      Open Course Studio → Students to search InTelleX users and add them, or share
                      the course so learners can enroll.
                    </p>
                  </div>
                ) : (
                  <ul className="divide-y border-y" style={{ borderColor: 'var(--line)' }}>
                    {active.students.map((s) => (
                      <li
                        key={`${active.courseId}:${s.studentId}`}
                        className="flex flex-wrap items-center gap-3 py-3.5"
                      >
                        <span
                          className="flex h-9 w-9 shrink-0 items-center justify-center text-[12px] font-bold text-white"
                          style={{ background: 'var(--ink)' }}
                        >
                          {(s.studentName || '?').slice(0, 1).toUpperCase()}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[14.5px] font-semibold">
                            {s.studentName}
                          </span>
                          <span
                            className="block truncate text-[12.5px]"
                            style={{ color: 'var(--ink-soft)' }}
                          >
                            {s.studentEmail || s.studentId}
                          </span>
                        </span>
                        <span
                          className="font-mono text-[10px] uppercase tracking-[0.12em]"
                          style={{ color: 'var(--ink-soft)' }}
                        >
                          {s.source === 'instructor'
                            ? 'Added by you'
                            : s.priceXAF > 0
                              ? `Paid ${s.priceXAF.toLocaleString()} XAF`
                              : 'Free'}
                          {' · '}
                          {new Date(s.enrolledAt).toLocaleDateString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <p className="text-[14px]" style={{ color: 'var(--ink-soft)' }}>
                No matches for that search.
              </p>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
