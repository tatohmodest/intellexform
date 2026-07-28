'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Radio, Video, X } from 'lucide-react';
import type { OngoingClassForUser } from '@/lib/learn/courseClassSessions';

/**
 * Dashboard-wide banner: if the user hosts or is enrolled in a live class,
 * show an Ongoing class strip with a Join link (not only on My Courses).
 */
export default function OngoingClassBanner({ accent = '#00b369' }: { accent?: string }) {
  const pathname = usePathname();
  const [sessions, setSessions] = useState<OngoingClassForUser[]>([]);
  const [dismissed, setDismissed] = useState<Record<string, boolean>>({});

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/learn/course-sessions/ongoing');
      if (!res.ok) return;
      const data = await res.json();
      setSessions((data.sessions || []) as OngoingClassForUser[]);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    load();
    const t = window.setInterval(load, 20000);
    return () => window.clearInterval(t);
  }, [load]);

  // Clear dismissals when a session ends / new one appears.
  useEffect(() => {
    const liveIds = new Set(sessions.map((s) => s.id));
    setDismissed((prev) => {
      const next: Record<string, boolean> = {};
      for (const [id, v] of Object.entries(prev)) {
        if (liveIds.has(id)) next[id] = v;
      }
      return next;
    });
  }, [sessions]);

  // Hide while already inside a live room.
  if (pathname.startsWith('/dashboard/sessions')) return null;

  const visible = sessions.filter((s) => s.status === 'live' && !dismissed[s.id]);
  if (!visible.length) return null;

  return (
    <div className="mb-5 space-y-2">
      {visible.map((s) => {
        const started = new Date(s.startAt);
        const mins = Math.max(
          1,
          Math.round((Date.now() - started.getTime()) / 60000),
        );
        return (
          <div
            key={s.id}
            className="flex flex-wrap items-center justify-between gap-3 border px-4 py-3"
            style={{
              borderColor: 'rgba(185,28,28,0.35)',
              background: 'rgba(185,28,28,0.06)',
            }}
          >
            <div className="min-w-0 flex-1">
              <p
                className="inline-flex items-center gap-1.5 text-[13px] font-semibold"
                style={{ color: '#b91c1c' }}
              >
                <Radio size={14} className="animate-pulse" /> Ongoing class
              </p>
              <p className="mt-0.5 truncate text-[14.5px] font-semibold" style={{ color: 'var(--ink)' }}>
                {s.courseTitle}
              </p>
              <p className="mt-0.5 text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
                {s.role === 'instructor'
                  ? 'You started this class'
                  : `With ${s.instructorName}`}
                {' · '}
                live {mins} min
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/dashboard/sessions/${encodeURIComponent(s.channel)}`}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-semibold text-white"
                style={{ background: accent === '#00b369' ? '#b91c1c' : accent }}
              >
                <Video size={14} /> Join now
              </Link>
              <button
                type="button"
                onClick={() => setDismissed((d) => ({ ...d, [s.id]: true }))}
                className="flex h-9 w-9 items-center justify-center rounded-full"
                style={{ color: 'var(--ink-soft)' }}
                aria-label="Dismiss"
                title="Dismiss for now"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
