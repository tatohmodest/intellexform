'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell, Loader2 } from 'lucide-react';
import type { NotificationView } from '@/lib/learn/notifications';

export default function NotificationsInbox() {
  const [items, setItems] = useState<NotificationView[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);

  const pageSize = 15;

  const load = useCallback(async (targetPage = page) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/learn/notifications?page=${targetPage}&pageSize=${pageSize + 1}`);
      const data = await res.json();
      const nextItems = (data.notifications || []) as NotificationView[];
      setItems(nextItems.slice(0, pageSize));
      setHasNext(nextItems.length > pageSize);
      setPage(targetPage);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    load(page);
  }, [load, page]);

  async function markAll() {
    await fetch('/api/learn/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ markAll: true }),
    });
    await load(page);
  }

  async function openOne(n: NotificationView) {
    if (!n.readAt) {
      await fetch('/api/learn/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: [n.id] }),
      });
    }
  }

  async function enablePush() {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    await Notification.requestPermission();
  }

  return (
    <div className="mx-auto max-w-[720px]">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="tab mb-2 inline-flex items-center gap-1.5">
            <Bell size={11} />
            Inbox
          </div>
          <h1 className="font-display text-[30px] leading-tight">Notifications</h1>
          <p className="mt-1 text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
            Assignment and exam alerts from your tutors land here.
          </p>
        </div>
        <button
          type="button"
          onClick={markAll}
          className="border px-3 py-2 text-[13px] font-semibold"
          style={{ borderColor: 'var(--line)' }}
        >
          Mark all read
        </button>
        {typeof window !== 'undefined' && 'Notification' in window && Notification.permission !== 'granted' ? (
          <button
            type="button"
            onClick={enablePush}
            className="border px-3 py-2 text-[13px] font-semibold"
            style={{ borderColor: 'var(--line)' }}
          >
            Enable push alerts
          </button>
        ) : null}
      </div>

      {loading ? (
        <div className="flex justify-center py-16" style={{ color: 'var(--ink-soft)' }}>
          <Loader2 className="animate-spin" size={22} />
        </div>
      ) : items.length === 0 ? (
        <p className="border-t py-10 text-[14.5px]" style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}>
          No notifications yet.
        </p>
      ) : (
        <ul className="divide-y" style={{ borderColor: 'var(--line)' }}>
          {items.map((n) => (
            <li key={n.id} className="py-5">
              <Link
                href={n.href || '#'}
                onClick={() => openOne(n)}
                className="block"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="font-display text-[20px] leading-tight">{n.title}</h2>
                  {!n.readAt && (
                    <span
                      className="shrink-0 font-mono text-[10px] uppercase tracking-[0.14em]"
                      style={{ color: 'var(--green-deep)' }}
                    >
                      New
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[14px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                  {n.body}
                </p>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: 'var(--ink-soft)' }}>
                  {new Date(n.createdAt).toLocaleString()}
                  {n.href ? ' · Open →' : ''}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {!loading && items.length > 0 && (
        <nav className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => void load(page - 1)}
            disabled={page <= 1}
            className="border px-3 py-2 text-[13px] font-semibold disabled:opacity-50"
            style={{ borderColor: 'var(--line)' }}
          >
            Previous
          </button>
          <span className="font-mono text-[11px] uppercase tracking-[0.12em]" style={{ color: 'var(--ink-soft)' }}>
            Page {page}
          </span>
          <button
            type="button"
            onClick={() => void load(page + 1)}
            disabled={!hasNext}
            className="border px-3 py-2 text-[13px] font-semibold disabled:opacity-50"
            style={{ borderColor: 'var(--line)' }}
          >
            Next
          </button>
        </nav>
      )}
    </div>
  );
}
