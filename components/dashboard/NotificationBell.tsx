'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import type { NotificationView } from '@/lib/learn/notifications';

export default function NotificationBell({ accent = '#00b369' }: { accent?: string }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationView[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/learn/notifications');
      if (!res.ok) return;
      const data = await res.json();
      setItems(data.notifications || []);
      setUnread(Number(data.unread) || 0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, 60_000);
    return () => clearInterval(id);
  }, [load]);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  async function markAllRead() {
    await fetch('/api/learn/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ markAll: true }),
    });
    setUnread(0);
    setItems((prev) => prev.map((n) => ({ ...n, readAt: n.readAt || new Date().toISOString() })));
  }

  async function openItem(n: NotificationView) {
    if (!n.readAt) {
      await fetch('/api/learn/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: [n.id] }),
      });
      setUnread((u) => Math.max(0, u - 1));
      setItems((prev) =>
        prev.map((x) => (x.id === n.id ? { ...x, readAt: new Date().toISOString() } : x)),
      );
    }
    setOpen(false);
  }

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          if (!open) load();
        }}
        className="relative flex h-9 w-9 items-center justify-center rounded-full border"
        style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
        aria-label={unread ? `${unread} unread notifications` : 'Notifications'}
        title="Notifications"
      >
        <Bell size={16} />
        {unread > 0 && (
          <span
            className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold text-white"
            style={{ background: accent }}
          >
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-[calc(100%+8px)] z-50 w-[min(360px,calc(100vw-24px))] border bg-paper shadow-lg"
          style={{ borderColor: 'var(--line)' }}
        >
          <div
            className="flex items-center justify-between border-b px-3 py-2.5"
            style={{ borderColor: 'var(--line)' }}
          >
            <span className="text-[13px] font-semibold">Notifications</span>
            <div className="flex items-center gap-2">
              {unread > 0 && (
                <button
                  type="button"
                  onClick={markAllRead}
                  className="text-[11px] font-semibold"
                  style={{ color: accent }}
                >
                  Mark all read
                </button>
              )}
              <Link
                href="/dashboard/notifications"
                onClick={() => setOpen(false)}
                className="text-[11px] font-semibold"
                style={{ color: 'var(--ink-soft)' }}
              >
                View all
              </Link>
            </div>
          </div>
          <div className="max-h-[360px] overflow-y-auto">
            {loading && items.length === 0 ? (
              <p className="px-3 py-6 text-center text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                Loading…
              </p>
            ) : items.length === 0 ? (
              <p className="px-3 py-6 text-center text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                No notifications yet. When a tutor publishes an assignment, it shows up here.
              </p>
            ) : (
              items.slice(0, 8).map((n) => (
                <Link
                  key={n.id}
                  href={n.href || '/dashboard/notifications'}
                  onClick={() => openItem(n)}
                  className="block border-b px-3 py-3 transition-colors hover:bg-black/[0.03]"
                  style={{
                    borderColor: 'var(--line)',
                    background: n.readAt ? undefined : `${accent}0d`,
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 text-[13px] font-semibold leading-snug">{n.title}</div>
                    {!n.readAt && (
                      <span
                        className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ background: accent }}
                      />
                    )}
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                    {n.body}
                  </p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: 'var(--ink-soft)' }}>
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
