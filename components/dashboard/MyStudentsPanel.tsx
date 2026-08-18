'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ClipboardList,
  FileText,
  GraduationCap,
  Loader2,
  Radio,
  Search,
  Square,
  Users,
  Video,
} from 'lucide-react';
import type { InstructorCourseStudents } from '@/lib/learn/ecosystem';
import type { CourseClassSessionView } from '@/lib/learn/courseClassSessions';
import MessageStudentButton from '@/components/dashboard/MessageStudentButton';
import MentorScheduleButton from '@/components/dashboard/MentorScheduleButton';

export default function MyStudentsPanel({
  groups,
  totalStudents,
}: {
  groups: InstructorCourseStudents[];
  totalStudents: number;
}) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [rows, setRows] = useState(groups);
  const [openCourseId, setOpenCourseId] = useState<string | null>(
    groups.find((g) => g.studentCount > 0)?.courseId ?? groups[0]?.courseId ?? null,
  );
  const [liveByCourse, setLiveByCourse] = useState<Record<string, CourseClassSessionView>>({});
  const [classBusy, setClassBusy] = useState(false);
  const [classError, setClassError] = useState('');
  const [advocateBusy, setAdvocateBusy] = useState<string | null>(null);

  useEffect(() => {
    setRows(groups);
  }, [groups]);

  const refreshLive = useCallback(async () => {
    try {
      const res = await fetch('/api/learn/course-sessions');
      if (!res.ok) return;
      const data = await res.json();
      const map: Record<string, CourseClassSessionView> = {};
      for (const s of (data.sessions || []) as CourseClassSessionView[]) {
        map[s.courseId] = s;
      }
      setLiveByCourse(map);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    refreshLive();
    const t = window.setInterval(refreshLive, 30000);
    return () => window.clearInterval(t);
  }, [refreshLive]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows
      .map((g) => ({
        ...g,
        students: g.students.filter((s) =>
          `${s.studentName} ${s.studentEmail || ''} ${g.courseTitle}`.toLowerCase().includes(q),
        ),
      }))
      .filter((g) => g.students.length > 0 || g.courseTitle.toLowerCase().includes(q));
  }, [rows, query]);

  const active = filtered.find((g) => g.courseId === openCourseId) || filtered[0] || null;
  const activeLive = active ? liveByCourse[active.courseId] : null;

  async function setAdvocate(studentId: string, classHead: boolean) {
    setAdvocateBusy(studentId);
    setClassError('');
    try {
      const res = await fetch('/api/learn/class-advocates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, classHead }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setClassError(data.error || 'Could not update class advocate');
        return;
      }
      setRows((prev) =>
        prev.map((g) => ({
          ...g,
          students: g.students.map((s) =>
            s.studentId === studentId ? { ...s, classHead } : s,
          ),
        })),
      );
    } catch {
      setClassError('Network error');
    } finally {
      setAdvocateBusy(null);
    }
  }

  async function startClass(courseId: string) {
    setClassBusy(true);
    setClassError('');
    try {
      const res = await fetch('/api/learn/course-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setClassError(data.error || 'Could not start class');
        return;
      }
      const live = data.session as CourseClassSessionView;
      setLiveByCourse((prev) => ({ ...prev, [courseId]: live }));
      router.push(`/dashboard/sessions/${live.channel}`);
    } catch {
      setClassError('Network error');
    } finally {
      setClassBusy(false);
    }
  }

  async function endClass(sessionId: string, courseId: string) {
    if (!window.confirm('End this class? Students will be told the session is over.')) return;
    setClassBusy(true);
    setClassError('');
    try {
      const res = await fetch(`/api/learn/course-sessions/${sessionId}/end`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        setClassError(data.error || 'Could not end class');
        return;
      }
      setLiveByCourse((prev) => {
        const next = { ...prev };
        delete next[courseId];
        return next;
      });
    } catch {
      setClassError('Network error');
    } finally {
      setClassBusy(false);
    }
  }

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
            See who is in each of your courses. Start class, set weekly school or call times on
            their calendar, assign an exam, or make a student the class advocate for course groups.
          </p>
        </div>
        <div
          className="flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-[0.12em]"
          style={{ color: 'var(--ink-soft)' }}
        >
          <span>{totalStudents} students</span>
          <span style={{ color: 'var(--line)' }}>·</span>
          <span>{groups.length} courses</span>
          {Object.keys(liveByCourse).length > 0 ? (
            <>
              <span style={{ color: 'var(--line)' }}>·</span>
              <span style={{ color: '#b91c1c' }}>
                {Object.keys(liveByCourse).length} live
              </span>
            </>
          ) : null}
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
                const live = liveByCourse[g.courseId];
                return (
                  <li key={g.courseId}>
                    <button
                      type="button"
                      onClick={() => setOpenCourseId(g.courseId)}
                      className="flex w-full items-start justify-between gap-2 border px-3 py-3 text-left transition-colors"
                      style={
                        selected
                          ? {
                              background: 'rgba(0,179,105,0.1)',
                              color: 'var(--green-deep)',
                              borderColor: 'var(--green-deep)',
                            }
                          : { color: 'var(--ink)', borderColor: 'var(--line)' }
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
                          {live ? (
                            <span style={{ color: '#b91c1c' }}>Live now · </span>
                          ) : null}
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
                    {activeLive ? (
                      <>
                        <Link
                          href={`/dashboard/sessions/${activeLive.channel}`}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-[13px] font-semibold text-white"
                          style={{ background: '#b91c1c' }}
                        >
                          <Radio size={14} className="animate-pulse" /> Join live class
                        </Link>
                        <button
                          type="button"
                          disabled={classBusy}
                          onClick={() => endClass(activeLive.id, active.courseId)}
                          className="inline-flex items-center gap-1.5 border px-3.5 py-2.5 text-[13px] font-semibold"
                          style={{ borderColor: 'var(--ink)', color: 'var(--ink)' }}
                        >
                          {classBusy ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Square size={14} />
                          )}
                          End class
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        disabled={classBusy}
                        onClick={() => startClass(active.courseId)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-[13px] font-semibold text-white"
                        style={{ background: 'var(--green)' }}
                      >
                        {classBusy ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Video size={14} />
                        )}
                        Start class now
                      </button>
                    )}
                    <Link
                      href={`/dashboard/teach/assessments?courseId=${encodeURIComponent(active.courseId)}&kind=assignment`}
                      className="inline-flex items-center gap-1.5 border px-3.5 py-2.5 text-[13px] font-semibold"
                      style={{ borderColor: 'var(--ink)', color: 'var(--ink)' }}
                    >
                      <ClipboardList size={14} /> Assign assignment
                    </Link>
                    <Link
                      href={`/dashboard/teach/assessments?courseId=${encodeURIComponent(active.courseId)}&kind=exam`}
                      className="inline-flex items-center gap-1.5 border px-3.5 py-2.5 text-[13px] font-semibold"
                      style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
                    >
                      <GraduationCap size={14} /> Assign exam
                    </Link>
                    <Link
                      href={`/dashboard/teach/notes?courseId=${encodeURIComponent(active.courseId)}`}
                      className="inline-flex items-center gap-1.5 border px-3.5 py-2.5 text-[13px] font-semibold"
                      style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
                    >
                      <FileText size={14} /> Send notes
                    </Link>
                  </div>
                </div>

                {classError ? (
                  <p className="mb-4 text-[13px]" style={{ color: '#b91c1c' }}>
                    {classError}
                  </p>
                ) : null}

                {activeLive ? (
                  <div
                    className="mb-5 border px-4 py-3"
                    style={{
                      borderColor: 'rgba(220,38,38,0.35)',
                      background: 'rgba(220,38,38,0.05)',
                    }}
                  >
                    <p
                      className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold"
                      style={{ color: '#b91c1c' }}
                    >
                      <Radio size={14} className="animate-pulse" /> Session in progress
                    </p>
                    <p className="mt-1 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                      Started {new Date(activeLive.startAt).toLocaleString()}. Enrolled students
                      see that class is live and can join. Ending the class records the finish
                      time for platform admin review.
                    </p>
                  </div>
                ) : null}

                <div className="mb-4 flex flex-wrap gap-2">
                  <Link
                    href={`/dashboard/teach/courses`}
                    className="inline-flex items-center border px-3 py-1.5 text-[13px] font-semibold"
                    style={{ borderColor: 'var(--line)', color: 'var(--green-deep)' }}
                  >
                    Manage roster in Course Studio
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
                          <span className="flex flex-wrap items-center gap-2">
                            <span className="block truncate text-[14.5px] font-semibold">
                              {s.studentName}
                            </span>
                            {s.classHead ? (
                              <span
                                className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em]"
                                style={{ color: 'var(--green-deep)' }}
                              >
                                Class advocate
                              </span>
                            ) : null}
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
                        <button
                          type="button"
                          disabled={advocateBusy === s.studentId}
                          onClick={() => setAdvocate(s.studentId, !s.classHead)}
                          className="inline-flex items-center border px-3 py-1.5 text-[12.5px] font-semibold disabled:opacity-50"
                          style={{
                            borderColor: s.classHead ? 'var(--green-deep)' : 'var(--line)',
                            color: s.classHead ? 'var(--green-deep)' : 'var(--ink)',
                          }}
                        >
                          {advocateBusy === s.studentId
                            ? 'Saving…'
                            : s.classHead
                              ? 'Remove advocate'
                              : 'Make class advocate'}
                        </button>
                        <MentorScheduleButton
                          studentId={s.studentId}
                          studentName={s.studentName}
                        />
                        <MessageStudentButton
                          studentId={s.studentId}
                          studentName={s.studentName}
                          courseTitle={active.courseTitle}
                        />
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
