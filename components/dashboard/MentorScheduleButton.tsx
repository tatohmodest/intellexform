'use client';

import { useCallback, useEffect, useState } from 'react';
import { CalendarClock, Loader2, Trash2, X } from 'lucide-react';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

type Slot = {
  id: string;
  title: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  kind: string;
};

export default function MentorScheduleButton({
  studentId,
  studentName,
}: {
  studentId: string;
  studentName: string;
}) {
  const [open, setOpen] = useState(false);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState(1);
  const [startTime, setStartTime] = useState('16:00');
  const [endTime, setEndTime] = useState('17:00');
  const [kind, setKind] = useState<'school' | 'call' | 'mentorship'>('call');
  const [title, setTitle] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/learn/calendar/mentor-schedule?studentId=${encodeURIComponent(studentId)}`,
      );
      const data = await res.json().catch(() => ({}));
      setSlots(data.slots || []);
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    if (open) load().catch(() => setLoading(false));
  }, [open, load]);

  async function addSlot(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/learn/calendar/mentor-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          studentName,
          dayOfWeek,
          startTime,
          endTime,
          kind,
          title,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || data.error || 'Could not save');
      setSlots((list) => [...list, data.slot].sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime)));
      setTitle('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!window.confirm('Remove this weekly time from the student calendar?')) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/learn/calendar/mentor-schedule?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Could not delete');
      setSlots((list) => list.filter((s) => s.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 border px-3 py-2 text-[12.5px] font-semibold"
        style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
        title="Set weekly school or call times"
      >
        <CalendarClock size={14} /> Weekly times
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[120] flex items-end justify-center p-4 sm:items-center"
          style={{ background: 'rgba(12,17,22,0.55)' }}
          role="dialog"
          aria-modal="true"
          onClick={() => !busy && setOpen(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto border p-6"
            style={{ borderColor: 'var(--line)', background: 'var(--paper)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-[22px]">Weekly times</h3>
                <p className="mt-1 text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>
                  For <strong style={{ color: 'var(--ink)' }}>{studentName}</strong>. These repeat
                  every week on their calendar. They can’t edit or move them.
                </p>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close">
                <X size={18} style={{ color: 'var(--ink-soft)' }} />
              </button>
            </div>

            {loading ? (
              <p className="mb-4 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                Loading…
              </p>
            ) : slots.length === 0 ? (
              <p className="mb-4 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                No weekly times yet. Add school or call blocks below.
              </p>
            ) : (
              <ul className="mb-5 space-y-2">
                {slots.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center gap-3 border px-3 py-2.5"
                    style={{ borderColor: 'var(--line)' }}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14px] font-semibold">{s.title}</span>
                      <span className="text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
                        Every {DAY_NAMES[s.dayOfWeek]} · {s.startTime}–{s.endTime} · {s.kind}
                      </span>
                    </span>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => remove(s.id)}
                      aria-label="Remove"
                    >
                      <Trash2 size={14} style={{ color: '#b91c1c' }} />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <form onSubmit={addSlot} className="space-y-3 border-t pt-4" style={{ borderColor: 'var(--line)' }}>
              <p className="text-[13px] font-semibold">Add weekly block</p>
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-[12px] font-semibold">
                  Day
                  <select
                    className="mt-1 w-full border px-3 py-2.5 text-[14px]"
                    style={{ borderColor: 'var(--line)' }}
                    value={dayOfWeek}
                    onChange={(e) => setDayOfWeek(Number(e.target.value))}
                  >
                    {DAY_NAMES.map((name, i) => (
                      <option key={name} value={i}>
                        {name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-[12px] font-semibold">
                  Type
                  <select
                    className="mt-1 w-full border px-3 py-2.5 text-[14px]"
                    style={{ borderColor: 'var(--line)' }}
                    value={kind}
                    onChange={(e) => setKind(e.target.value as typeof kind)}
                  >
                    <option value="school">School time</option>
                    <option value="call">Call</option>
                    <option value="mentorship">Mentorship</option>
                  </select>
                </label>
                <label className="block text-[12px] font-semibold">
                  Start
                  <input
                    type="time"
                    required
                    className="mt-1 w-full border px-3 py-2.5 text-[14px]"
                    style={{ borderColor: 'var(--line)' }}
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </label>
                <label className="block text-[12px] font-semibold">
                  End
                  <input
                    type="time"
                    required
                    className="mt-1 w-full border px-3 py-2.5 text-[14px]"
                    style={{ borderColor: 'var(--line)' }}
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </label>
              </div>
              <label className="block text-[12px] font-semibold">
                Label (optional)
                <input
                  className="mt-1 w-full border px-3 py-2.5 text-[14px]"
                  style={{ borderColor: 'var(--line)' }}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Math check-in"
                />
              </label>
              {error ? (
                <p className="text-[13px]" style={{ color: '#b91c1c' }}>
                  {error}
                </p>
              ) : null}
              <button type="submit" className="btn btn-g" disabled={busy}>
                {busy ? <Loader2 size={14} className="animate-spin" /> : null}
                Save weekly time
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
