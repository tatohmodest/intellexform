'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell, Loader2 } from 'lucide-react';
import type { NotificationCategory, NotificationView } from '@/lib/learn/notificationTypes';
import { CATEGORY_LABELS } from '@/lib/learn/notificationTypes';

const FILTERS: Array<NotificationCategory | 'all'> = [
  'all',
  'academic',
  'social',
  'institution',
  'system',
];

export default function NotificationsInbox() {
  const [items, setItems] = useState<NotificationView[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [category, setCategory] = useState<NotificationCategory | 'all'>('all');

  const pageSize = 15;

  const load = useCallback(
    async (targetPage = page, cat = category) => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/learn/notifications?page=${targetPage}&pageSize=${pageSize + 1}&category=${cat}`,
        );
        const data = await res.json();
        const nextItems = (data.notifications || []) as NotificationView[];
        setItems(nextItems.slice(0, pageSize));
        setHasNext(nextItems.length > pageSize);
        setPage(targetPage);
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize, category],
  );

  useEffect(() => {
    load(1, category);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  async function markAll() {
    await fetch('/api/learn/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ markAll: true }),
    });
    await load(page, category);
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
            Academic, social, institution, and system alerts — filter and mute categories in Settings.
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

      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setCategory(f)}
            className="border px-3 py-1.5 text-[12.5px] font-semibold capitalize"
            style={{
              borderColor: category === f ? 'var(--ink)' : 'var(--line)',
              background: category === f ? 'var(--ink)' : 'transparent',
              color: category === f ? '#fff' : 'var(--ink-soft)',
            }}
          >
            {f === 'all' ? 'All' : CATEGORY_LABELS[f]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16" style={{ color: 'var(--ink-soft)' }}>
          <Loader2 className="animate-spin" size={22} />
        </div>
      ) : items.length === 0 ? (
        <p className="border-t py-10 text-[14.5px]" style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}>
          No notifications in this category.
        </p>
      ) : (
        <ul className="divide-y" style={{ borderColor: 'var(--line)' }}>
          {items.map((n) => (
            <li key={n.id} className="py-5">
              <Link href={n.href || '#'} onClick={() => openOne(n)} className="block">
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
                <p className="mt-1 font-mono text-[10px] uppercase tracking-wide" style={{ color: 'var(--ink-soft)' }}>
                  {CATEGORY_LABELS[n.category] || n.category}
                </p>
                <p className="mt-1 text-[14px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                  {n.body}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 flex justify-between">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => load(page - 1, category)}
          className="text-[13px] font-semibold disabled:opacity-40"
        >
          Previous
        </button>
        <button
          type="button"
          disabled={!hasNext}
          onClick={() => load(page + 1, category)}
          className="text-[13px] font-semibold disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
