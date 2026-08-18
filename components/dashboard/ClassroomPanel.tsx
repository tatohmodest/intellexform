'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ChevronDown,
  ChevronRight,
  Clock,
  Radio,
  School,
  Video,
} from 'lucide-react';
import type {
  ClassroomCourseGroup,
  ClassroomSessionRow,
} from '@/lib/learn/courseClassSessions';

function fmtWhen(iso: string) {
  return new Date(iso).toLocaleString([], {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function SessionRow({
  session,
  showCourse,
}: {
  session: ClassroomSessionRow;
  showCourse?: boolean;
}) {
  const live = session.status === 'live';
  return (
    <li
      className="flex flex-wrap items-center gap-3 border-b py-3.5 last:border-b-0"
      style={{ borderColor: 'var(--line)' }}
    >
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center"
        style={{
          background: live ? 'rgba(185,28,28,0.12)' : 'var(--paper-dim)',
          color: live ? '#b91c1c' : 'var(--ink-soft)',
        }}
      >
        {live ? <Radio size={16} className="animate-pulse" /> : <Clock size={16} />}
      </span>
      <div className="min-w-0 flex-1">
        {showCourse ? (
          <p className="truncate text-[14px] font-semibold">{session.courseTitle}</p>
        ) : null}
        <p
          className={`text-[13px] ${showCourse ? '' : 'font-semibold'}`}
          style={{ color: showCourse ? 'var(--ink-soft)' : 'var(--ink)' }}
        >
          {live ? 'Live now' : 'Ended'} · {fmtWhen(session.startAt)}
          {!live && session.endAt ? ` → ${fmtWhen(session.endAt)}` : ''}
        </p>
        <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: 'var(--ink-soft)' }}>
          {session.durationMinutes} min
          {' · '}
          {session.role === 'instructor' ? 'You hosted' : `With ${session.instructorName}`}
        </p>
      </div>
      {live ? (
        <Link
          href={`/dashboard/sessions/${encodeURIComponent(session.channel)}`}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-semibold text-white"
          style={{ background: '#b91c1c' }}
        >
          <Video size={14} /> Join
        </Link>
      ) : (
        <Link
          href={`/dashboard/courses/instructor/${encodeURIComponent(session.courseId)}`}
          className="inline-flex items-center border px-3 py-1.5 text-[13px] font-semibold"
          style={{ borderColor: 'var(--line)', color: 'var(--green-deep)' }}
        >
          Open course
        </Link>
      )}
    </li>
  );
}

function CourseGroupCard({ group }: { group: ClassroomCourseGroup }) {
  const [open, setOpen] = useState(Boolean(group.live) || group.past.length > 0);
  const recentPast = group.past.slice(0, 8);

  return (
    <section className="border-b py-6" style={{ borderColor: 'var(--line)' }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start justify-between gap-3 border px-3 py-3 text-left"
        style={{ borderColor: 'var(--line)' }}
        aria-expanded={open}
      >
        <div className="min-w-0">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.14em]"
            style={{ color: 'var(--ink-soft)' }}
          >
            {group.role === 'instructor' ? 'You teach' : 'You learn'} · {group.sessionCount} session
            {group.sessionCount === 1 ? '' : 's'}
          </p>
          <h2 className="mt-1 font-display text-[22px] leading-tight sm:text-[26px]">
            {group.courseTitle}
          </h2>
          <p className="mt-1 text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>
            {group.role === 'instructor'
              ? 'Your classroom activity'
              : `Instructor ${group.instructorName}`}
            {group.live ? ' · class in progress' : ''}
          </p>
        </div>
        <span
          className="mt-1 inline-flex shrink-0 items-center gap-1 border px-2.5 py-1.5 text-[12px] font-semibold"
          style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
        >
          {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          {open ? 'Hide' : 'Sessions'}
        </span>
      </button>

      {open ? (
        <div className="mt-4">
          {group.live ? (
            <div
              className="mb-3 border px-4 py-3"
              style={{
                borderColor: 'rgba(185,28,28,0.35)',
                background: 'rgba(185,28,28,0.05)',
              }}
            >
              <p className="mb-2 text-[12px] font-semibold" style={{ color: '#b91c1c' }}>
                Ongoing now
              </p>
              <ul>
                <SessionRow session={group.live} />
              </ul>
            </div>
          ) : null}

          {recentPast.length > 0 ? (
            <>
              <p
                className="mb-1 font-mono text-[10px] uppercase tracking-[0.14em]"
                style={{ color: 'var(--ink-soft)' }}
              >
                Past live sessions
              </p>
              <ul className="border-y" style={{ borderColor: 'var(--line)' }}>
                {recentPast.map((s) => (
                  <SessionRow key={s.id} session={s} />
                ))}
              </ul>
              {group.past.length > recentPast.length ? (
                <p className="mt-2 text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
                  +{group.past.length - recentPast.length} older session
                  {group.past.length - recentPast.length === 1 ? '' : 's'}
                </p>
              ) : null}
            </>
          ) : !group.live ? (
            <p className="text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>
              No live sessions recorded for this course yet.
            </p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

export default function ClassroomPanel({
  live,
  groups,
  totalSessions,
}: {
  live: ClassroomSessionRow[];
  groups: ClassroomCourseGroup[];
  totalSessions: number;
}) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    return groups.filter((g) =>
      `${g.courseTitle} ${g.instructorName}`.toLowerCase().includes(q),
    );
  }, [groups, query]);

  if (groups.length === 0) {
    return (
      <div className="border border-dashed px-6 py-14 text-center" style={{ borderColor: 'var(--line)' }}>
        <School size={26} className="mx-auto mb-4" style={{ color: 'var(--green-deep)' }} />
        <h3 className="font-display text-[20px]">No classroom activity yet</h3>
        <p className="mx-auto mt-2 max-w-md text-[14px]" style={{ color: 'var(--ink-soft)' }}>
          When an instructor starts a live class for a course you are enrolled in - or you host one
          yourself - it will show up here with join links and past session history.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/dashboard/courses"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-[13.5px] font-semibold text-white"
            style={{ background: 'var(--green)' }}
          >
            My Courses
          </Link>
          <Link
            href="/dashboard/students"
            className="inline-flex items-center gap-2 border px-5 py-2.5 text-[13.5px] font-semibold"
            style={{ borderColor: 'var(--ink)', color: 'var(--ink)' }}
          >
            My Students
          </Link>
        </div>
      </div>
    );
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
            Live + past activity
          </p>
          <p className="mt-2 text-[15px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
            Join classes that are happening now, and review every past live session for courses you
            teach or take.
          </p>
        </div>
        <div
          className="flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-[0.12em]"
          style={{ color: 'var(--ink-soft)' }}
        >
          <span>{live.length} live</span>
          <span style={{ color: 'var(--line)' }}>·</span>
          <span>{totalSessions} sessions</span>
          <span style={{ color: 'var(--line)' }}>·</span>
          <span>{groups.length} courses</span>
        </div>
      </div>

      {live.length > 0 ? (
        <section className="mb-10">
          <p
            className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em]"
            style={{ color: '#b91c1c' }}
          >
            Happening now
          </p>
          <ul
            className="border px-4"
            style={{
              borderColor: 'rgba(185,28,28,0.35)',
              background: 'rgba(185,28,28,0.04)',
            }}
          >
            {live.map((s) => (
              <SessionRow key={s.id} session={s} showCourse />
            ))}
          </ul>
        </section>
      ) : null}

      <label className="mb-6 block max-w-md">
        <span className="sr-only">Search classrooms</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by course or instructor…"
          className="form-input w-full !rounded-none border-0 border-b !px-0 !py-3 text-[16px] !shadow-none"
          style={{ borderColor: 'var(--line)', background: 'transparent' }}
        />
      </label>

      <div>
        {filtered.map((g) => (
          <CourseGroupCard key={g.courseId} group={g} />
        ))}
        {filtered.length === 0 ? (
          <p className="py-8 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
            No courses match that search.
          </p>
        ) : null}
      </div>
    </div>
  );
}
