'use client';

import { useCallback, useEffect, useState } from 'react';
import { CalendarClock, Loader2, Trash2 } from 'lucide-react';
import MentorScheduleButton from '@/components/dashboard/MentorScheduleButton';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

type Slot = {
  id: string;
  studentId: string;
  studentName: string;
  title: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  kind: string;
};

export default function MentorSchedulesPanel({
  students,
}: {
  students: { studentId: string; studentName: string }[];
}) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [selectedId, setSelectedId] = useState(students[0]?.studentId || '');

  const selected = students.find((s) => s.studentId === selectedId) || students[0];

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/learn/calendar/mentor-schedule');
      const data = await res.json().catch(() => ({}));
      setSlots(data.slots || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load().catch(() => setLoading(false));
  }, [load]);

  async function remove(id: string) {
    if (!window.confirm('Remove this weekly time?')) return;
    setBusy(true);
    try {
      await fetch(`/api/learn/calendar/mentor-schedule?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      setSlots((list) => list.filter((s) => s.id !== id));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="border p-5" style={{ borderColor: 'var(--line)', background: 'var(--paper)' }}>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p
            className="font-mono text-[11px] uppercase tracking-[0.14em]"
            style={{ color: 'var(--ink-soft)' }}
          >
            Mentor · weekly schedules
          </p>
          <h2 className="mt-1 font-display text-[20px]">Times you set for students</h2>
          <p className="mt-1 max-w-xl text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>
            Recurring school and call blocks show on each student’s calendar every week. They can’t
            edit them — only you can.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            className="border px-3 py-2 text-[13px]"
            style={{ borderColor: 'var(--line)' }}
            value={selected?.studentId || ''}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            {students.map((s) => (
              <option key={s.studentId} value={s.studentId}>
                {s.studentName}
              </option>
            ))}
          </select>
          {selected ? (
            <MentorScheduleButton
              studentId={selected.studentId}
              studentName={selected.studentName}
            />
          ) : null}
        </div>
      </div>

      {loading ? (
        <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
          Loading schedules…
        </p>
      ) : slots.length === 0 ? (
        <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
          No weekly times yet. Pick a student and open Weekly times.
        </p>
      ) : (
        <ul className="space-y-2">
          {slots.map((s) => (
            <li
              key={s.id}
              className="flex flex-wrap items-center gap-3 border px-3 py-2.5"
              style={{ borderColor: 'var(--line)' }}
            >
              <CalendarClock size={14} style={{ color: 'var(--green-deep)' }} />
              <span className="min-w-0 flex-1 text-[13.5px]">
                <strong>{s.studentName}</strong> · {s.title} · every {DAY_NAMES[s.dayOfWeek]}{' '}
                {s.startTime}–{s.endTime}
              </span>
              <button
                type="button"
                disabled={busy}
                onClick={() => remove(s.id)}
                aria-label="Remove"
              >
                {busy ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Trash2 size={14} style={{ color: '#b91c1c' }} />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
