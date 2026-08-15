'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Loader2, Plus, Trash2, X } from 'lucide-react';

export type InteractiveCalendarEvent = {
  id: string;
  title: string;
  kind: string;
  startsAt: string;
  endsAt?: string | null;
  href: string;
  meta?: string;
  status?: string;
  source?: 'personal' | 'mentor' | 'system';
  editable?: boolean;
};

type Draft = {
  mode: 'create' | 'edit';
  id?: string;
  title: string;
  notes: string;
  date: string;
  startTime: string;
  endTime: string;
  allDay: boolean;
};

function startOfWeek(d: Date) {
  const x = new Date(d);
  const day = x.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  x.setDate(x.getDate() + diff);
  x.setHours(0, 0, 0, 0);
  return x;
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function toDateInput(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function toTimeInput(d: Date) {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function combineLocal(date: string, time: string) {
  return new Date(`${date}T${time}:00`);
}

function eventColor(e: InteractiveCalendarEvent) {
  if (e.source === 'mentor' || e.status === 'locked') return '#0f766e';
  if (e.source === 'personal' || e.kind === 'personal') return '#1d4ed8';
  if (e.kind === 'live_class') return '#b91c1c';
  if (e.kind === 'assignment') return '#a16207';
  return '#374151';
}

const HOURS = Array.from({ length: 14 }).map((_, i) => i + 7); // 7–20

export default function InteractiveCalendar({
  events: initialEvents,
}: {
  events: InteractiveCalendarEvent[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');
  const [cursor, setCursor] = useState(() => new Date());
  const [events, setEvents] = useState(initialEvents);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setEvents(initialEvents);
  }, [initialEvents]);

  const labeled = useMemo(() => {
    if (view === 'day') {
      const dayEvents = events.filter((e) => sameDay(new Date(e.startsAt), cursor));
      return [
        {
          key: cursor.toDateString(),
          date: new Date(cursor),
          label: cursor.toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          }),
          events: dayEvents,
        },
      ];
    }
    if (view === 'week') {
      const start = startOfWeek(cursor);
      return Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        return {
          key: d.toDateString(),
          date: d,
          label: d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' }),
          events: events.filter((e) => sameDay(new Date(e.startsAt), d)),
        };
      });
    }
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }).map((_, i) => {
      const d = new Date(year, month, i + 1);
      return {
        key: d.toDateString(),
        date: d,
        label: String(i + 1),
        events: events.filter((e) => sameDay(new Date(e.startsAt), d)),
      };
    });
  }, [events, view, cursor]);

  function shift(dir: -1 | 1) {
    const next = new Date(cursor);
    if (view === 'day') next.setDate(next.getDate() + dir);
    else if (view === 'week') next.setDate(next.getDate() + dir * 7);
    else next.setMonth(next.getMonth() + dir);
    setCursor(next);
  }

  function openCreate(day: Date, hour?: number) {
    const start = new Date(day);
    if (typeof hour === 'number') start.setHours(hour, 0, 0, 0);
    else {
      const now = new Date();
      start.setHours(now.getHours(), 0, 0, 0);
    }
    const end = new Date(start);
    end.setHours(start.getHours() + 1);
    setError('');
    setDraft({
      mode: 'create',
      title: '',
      notes: '',
      date: toDateInput(start),
      startTime: toTimeInput(start),
      endTime: toTimeInput(end),
      allDay: false,
    });
  }

  function openEdit(e: InteractiveCalendarEvent) {
    if (e.editable === false || e.source === 'mentor' || e.source === 'system') return;
    if (e.source !== 'personal' && e.kind !== 'personal') return;
    const start = new Date(e.startsAt);
    const end = e.endsAt ? new Date(e.endsAt) : new Date(start.getTime() + 60 * 60 * 1000);
    setError('');
    setDraft({
      mode: 'edit',
      id: e.id.replace(/^personal-/, ''),
      title: e.title,
      notes: e.meta && e.meta !== 'Your event' ? e.meta : '',
      date: toDateInput(start),
      startTime: toTimeInput(start),
      endTime: toTimeInput(end),
      allDay: false,
    });
  }

  async function saveDraft() {
    if (!draft || !draft.title.trim()) return;
    setBusy(true);
    setError('');
    try {
      const startsAt = combineLocal(draft.date, draft.startTime).toISOString();
      const endsAt = combineLocal(draft.date, draft.endTime).toISOString();
      if (draft.mode === 'create') {
        const res = await fetch('/api/learn/calendar/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: draft.title,
            notes: draft.notes,
            startsAt,
            endsAt,
            allDay: draft.allDay,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || 'Could not create event');
        const ev = data.event as InteractiveCalendarEvent;
        setEvents((list) =>
          [
            ...list,
            {
              ...ev,
              source: 'personal' as const,
              editable: true,
              kind: 'personal',
              href: '/dashboard/calendar',
            },
          ].sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()),
        );
      } else if (draft.id) {
        const res = await fetch('/api/learn/calendar/events', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: draft.id,
            title: draft.title,
            notes: draft.notes,
            startsAt,
            endsAt,
            allDay: draft.allDay,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || 'Could not update');
        const ev = data.event as InteractiveCalendarEvent;
        setEvents((list) =>
          list.map((x) =>
            x.id === draft.id || x.id === `personal-${draft.id}`
              ? { ...ev, source: 'personal', editable: true, kind: 'personal', href: '/dashboard/calendar' }
              : x,
          ),
        );
      }
      setDraft(null);
      startTransition(() => router.refresh());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setBusy(false);
    }
  }

  async function removeDraft() {
    if (!draft?.id || draft.mode !== 'edit') return;
    if (!window.confirm('Delete this event?')) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/learn/calendar/events?id=${encodeURIComponent(draft.id)}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Could not delete');
      setEvents((list) => list.filter((x) => x.id !== draft.id && x.id !== `personal-${draft.id}`));
      setDraft(null);
      startTransition(() => router.refresh());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {(['day', 'week', 'month'] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className="border px-3 py-1.5 text-[12.5px] font-semibold capitalize"
              style={{
                borderColor: view === v ? 'var(--ink)' : 'var(--line)',
                background: view === v ? 'var(--ink)' : 'transparent',
                color: view === v ? '#fff' : 'var(--ink-soft)',
              }}
            >
              {v}
            </button>
          ))}
          <button
            type="button"
            onClick={() => openCreate(cursor)}
            className="inline-flex items-center gap-1 border px-3 py-1.5 text-[12.5px] font-semibold"
            style={{ borderColor: 'var(--green-deep)', color: 'var(--green-deep)' }}
          >
            <Plus size={13} /> Add event
          </button>
        </div>
        <div className="flex items-center gap-2 text-[13px] font-semibold">
          <button
            type="button"
            onClick={() => shift(-1)}
            className="border px-2 py-1"
            style={{ borderColor: 'var(--line)' }}
          >
            ←
          </button>
          <button type="button" onClick={() => setCursor(new Date())} className="px-2">
            Today
          </button>
          <button
            type="button"
            onClick={() => shift(1)}
            className="border px-2 py-1"
            style={{ borderColor: 'var(--line)' }}
          >
            →
          </button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-3 text-[11.5px] font-semibold" style={{ color: 'var(--ink-soft)' }}>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5" style={{ background: '#1d4ed8' }} /> Your events
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5" style={{ background: '#0f766e' }} /> Mentor schedule
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5" style={{ background: '#a16207' }} /> Assignments
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5" style={{ background: '#b91c1c' }} /> Live class
        </span>
      </div>

      {view === 'week' ? (
        <div className="overflow-x-auto border" style={{ borderColor: 'var(--line)' }}>
          <div className="grid min-w-[720px]" style={{ gridTemplateColumns: '52px repeat(7, 1fr)' }}>
            <div className="border-b p-2" style={{ borderColor: 'var(--line)' }} />
            {labeled.map((day) => (
              <button
                key={day.key}
                type="button"
                onClick={() => openCreate(day.date)}
                className="border-b border-l p-2 text-left"
                style={{
                  borderColor: 'var(--line)',
                  background: sameDay(day.date, new Date()) ? 'rgba(0,179,105,0.06)' : undefined,
                }}
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.08em]" style={{ color: 'var(--ink-soft)' }}>
                  {day.label}
                </span>
              </button>
            ))}
            {HOURS.map((hour) => (
              <div key={`row-${hour}`} className="contents">
                <div
                  className="border-b px-1 py-2 text-right font-mono text-[10px]"
                  style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}
                >
                  {String(hour).padStart(2, '0')}:00
                </div>
                {labeled.map((day) => {
                  const cellEvents = day.events.filter((e) => {
                    const h = new Date(e.startsAt).getHours();
                    return h === hour;
                  });
                  return (
                    <button
                      key={`${day.key}-${hour}`}
                      type="button"
                      onClick={() => openCreate(day.date, hour)}
                      className="relative min-h-[52px] border-b border-l p-0.5 text-left align-top transition-colors hover:bg-black/[0.02]"
                      style={{ borderColor: 'var(--line)' }}
                    >
                      {cellEvents.map((e) => {
                        const locked = e.editable === false || e.source === 'mentor';
                        return (
                          <span
                            key={e.id}
                            role={locked ? undefined : 'button'}
                            onClick={(ev) => {
                              ev.stopPropagation();
                              if (locked) return;
                              openEdit(e);
                            }}
                            className="mb-0.5 block truncate px-1 py-0.5 text-[10.5px] font-semibold text-white"
                            style={{ background: eventColor(e) }}
                            title={e.meta || e.title}
                          >
                            {locked ? <Lock size={9} className="mr-0.5 inline" /> : null}
                            {e.title}
                          </span>
                        );
                      })}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      ) : view === 'month' ? (
        <div className="grid grid-cols-7 gap-1">
          {labeled.map((day) => (
            <button
              key={day.key}
              type="button"
              onClick={() => openCreate(day.date)}
              className="min-h-[92px] border p-1.5 text-left"
              style={{
                borderColor: 'var(--line)',
                background: sameDay(day.date, new Date()) ? 'rgba(0,179,105,0.06)' : undefined,
              }}
            >
              <p className="font-mono text-[11px]" style={{ color: 'var(--ink-soft)' }}>
                {day.label}
              </p>
              {day.events.slice(0, 3).map((e) => {
                const locked = e.editable === false || e.source === 'mentor';
                return (
                  <span
                    key={e.id}
                    className="mt-1 flex items-center gap-0.5 truncate text-[11px] font-semibold"
                    style={{ color: eventColor(e) }}
                    onClick={(ev) => {
                      ev.stopPropagation();
                      if (!locked) openEdit(e);
                    }}
                  >
                    {locked ? <Lock size={9} className="shrink-0" /> : null}
                    <span className="truncate">{e.title}</span>
                  </span>
                );
              })}
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: 'var(--ink-soft)' }}>
              {labeled[0]?.label}
            </h3>
            <button
              type="button"
              onClick={() => openCreate(cursor)}
              className="text-[12.5px] font-semibold"
              style={{ color: 'var(--green-deep)' }}
            >
              + Add on this day
            </button>
          </div>
          {(labeled[0]?.events || []).length === 0 ? (
            <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
              Nothing scheduled — click a time or Add event.
            </p>
          ) : (
            <ul className="space-y-2">
              {(labeled[0]?.events || []).map((e) => {
                const locked = e.editable === false || e.source === 'mentor';
                const inner = (
                  <>
                    <span className="w-14 shrink-0 font-mono text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                      {new Date(e.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-1.5 font-semibold">
                        {locked ? <Lock size={12} style={{ color: '#0f766e' }} /> : null}
                        {e.title}
                      </p>
                      <p className="text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
                        {e.meta || e.kind}
                        {e.status ? ` · ${e.status}` : ''}
                      </p>
                    </div>
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: eventColor(e) }} />
                  </>
                );
                if (locked && e.href && e.href !== '/dashboard/calendar') {
                  return (
                    <li key={e.id}>
                      <Link href={e.href} className="flex gap-3 border p-3" style={{ borderColor: 'var(--line)' }}>
                        {inner}
                      </Link>
                    </li>
                  );
                }
                return (
                  <li key={e.id}>
                    <button
                      type="button"
                      onClick={() => (locked ? undefined : openEdit(e))}
                      className="flex w-full gap-3 border p-3 text-left"
                      style={{ borderColor: 'var(--line)', cursor: locked ? 'default' : 'pointer' }}
                    >
                      {inner}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {pending ? (
        <p className="mt-3 text-[12px]" style={{ color: 'var(--ink-soft)' }}>
          Syncing…
        </p>
      ) : null}

      {draft ? (
        <div
          className="fixed inset-0 z-[120] flex items-end justify-center p-4 sm:items-center"
          style={{ background: 'rgba(12,17,22,0.55)' }}
          role="dialog"
          aria-modal="true"
          onClick={() => !busy && setDraft(null)}
        >
          <div
            className="w-full max-w-md space-y-4 border p-6"
            style={{ borderColor: 'var(--line)', background: 'var(--paper)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-[22px]">
                  {draft.mode === 'create' ? 'New event' : 'Edit event'}
                </h3>
                <p className="mt-1 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                  Your personal calendar — like a Google Calendar todo. Mentor-set times can’t be
                  changed here.
                </p>
              </div>
              <button type="button" onClick={() => setDraft(null)} aria-label="Close">
                <X size={18} style={{ color: 'var(--ink-soft)' }} />
              </button>
            </div>
            <label className="block text-[12px] font-semibold">
              Title
              <input
                className="mt-1 w-full border px-3 py-2.5 text-[14px]"
                style={{ borderColor: 'var(--line)' }}
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                placeholder="Study session, remind myself…"
                autoFocus
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-[12px] font-semibold">
                Date
                <input
                  type="date"
                  className="mt-1 w-full border px-3 py-2.5 text-[14px]"
                  style={{ borderColor: 'var(--line)' }}
                  value={draft.date}
                  onChange={(e) => setDraft({ ...draft, date: e.target.value })}
                />
              </label>
              <label className="block text-[12px] font-semibold">
                Notes
                <input
                  className="mt-1 w-full border px-3 py-2.5 text-[14px]"
                  style={{ borderColor: 'var(--line)' }}
                  value={draft.notes}
                  onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
                  placeholder="Optional"
                />
              </label>
              <label className="block text-[12px] font-semibold">
                Start
                <input
                  type="time"
                  className="mt-1 w-full border px-3 py-2.5 text-[14px]"
                  style={{ borderColor: 'var(--line)' }}
                  value={draft.startTime}
                  onChange={(e) => setDraft({ ...draft, startTime: e.target.value })}
                />
              </label>
              <label className="block text-[12px] font-semibold">
                End
                <input
                  type="time"
                  className="mt-1 w-full border px-3 py-2.5 text-[14px]"
                  style={{ borderColor: 'var(--line)' }}
                  value={draft.endTime}
                  onChange={(e) => setDraft({ ...draft, endTime: e.target.value })}
                />
              </label>
            </div>
            {error ? (
              <p className="text-[13px]" style={{ color: '#b91c1c' }}>
                {error}
              </p>
            ) : null}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={busy || !draft.title.trim()}
                onClick={saveDraft}
                className="btn btn-g inline-flex items-center gap-1.5"
              >
                {busy ? <Loader2 size={14} className="animate-spin" /> : null}
                {draft.mode === 'create' ? 'Add to calendar' : 'Save'}
              </button>
              {draft.mode === 'edit' ? (
                <button
                  type="button"
                  disabled={busy}
                  onClick={removeDraft}
                  className="inline-flex items-center gap-1 border px-3 py-2 text-[13px] font-semibold"
                  style={{ borderColor: 'var(--line)', color: '#b91c1c' }}
                >
                  <Trash2 size={14} /> Delete
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => setDraft(null)}
                className="text-[13px] font-semibold"
                style={{ color: 'var(--ink-soft)' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
