'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

export type CalendarEvent = {
  id: string;
  title: string;
  kind: string;
  startsAt: string;
  endsAt?: string | null;
  href: string;
  meta?: string;
  status?: string;
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

export default function AcademicCalendar({ events }: { events: CalendarEvent[] }) {
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');
  const [cursor, setCursor] = useState(() => new Date());

  const labeled = useMemo(() => {
    if (view === 'day') {
      const dayEvents = events.filter((e) => sameDay(new Date(e.startsAt), cursor));
      return [{ key: cursor.toDateString(), label: cursor.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }), events: dayEvents }];
    }
    if (view === 'week') {
      const start = startOfWeek(cursor);
      return Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        return {
          key: d.toDateString(),
          label: d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }),
          events: events.filter((e) => sameDay(new Date(e.startsAt), d)),
        };
      });
    }
    // month
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }).map((_, i) => {
      const d = new Date(year, month, i + 1);
      return {
        key: d.toDateString(),
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

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
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
        </div>
        <div className="flex items-center gap-2 text-[13px] font-semibold">
          <button type="button" onClick={() => shift(-1)} className="border px-2 py-1" style={{ borderColor: 'var(--line)' }}>
            ←
          </button>
          <button type="button" onClick={() => setCursor(new Date())} className="px-2">
            Today
          </button>
          <button type="button" onClick={() => shift(1)} className="border px-2 py-1" style={{ borderColor: 'var(--line)' }}>
            →
          </button>
        </div>
      </div>

      {view === 'month' ? (
        <div className="grid grid-cols-7 gap-1">
          {labeled.map((day) => (
            <div key={day.key} className="min-h-[84px] border p-1.5" style={{ borderColor: 'var(--line)' }}>
              <p className="font-mono text-[11px]" style={{ color: 'var(--ink-soft)' }}>
                {day.label}
              </p>
              {day.events.slice(0, 3).map((e) => (
                <Link
                  key={e.id}
                  href={e.href}
                  className="mt-1 block truncate text-[11px] font-semibold"
                  style={{ color: 'var(--green-deep)' }}
                >
                  {e.title}
                </Link>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-5">
          {labeled.map((day) => (
            <section key={day.key}>
              <h3 className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: 'var(--ink-soft)' }}>
                {day.label}
              </h3>
              {day.events.length === 0 ? (
                <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                  —
                </p>
              ) : (
                <ul className="space-y-2">
                  {day.events.map((e) => (
                    <li key={e.id}>
                      <Link
                        href={e.href}
                        className="flex gap-3 border p-3"
                        style={{ borderColor: 'var(--line)' }}
                      >
                        <span className="w-14 shrink-0 font-mono text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                          {new Date(e.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <div>
                          <p className="font-semibold">{e.title}</p>
                          <p className="text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
                            {e.meta || e.kind}
                            {e.status ? ` · ${e.status}` : ''}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
