'use client';

import { useCallback, useEffect, useState } from 'react';
import { History, Loader2, RotateCcw } from 'lucide-react';

type Revision = {
  id: string;
  version: number;
  label: string;
  authorName: string;
  createdAt: string;
};

export default function ContentVersionHistory({
  entityType,
  entityId,
  accent = '#00b369',
}: {
  entityType: 'teacher_course' | 'assessment' | 'book';
  entityId: string;
  accent?: string;
}) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Revision[]>([]);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState('');

  const load = useCallback(async () => {
    if (!entityId) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/learn/content-revisions?entityType=${entityType}&entityId=${encodeURIComponent(entityId)}`,
      );
      const data = await res.json();
      setItems(data.revisions || []);
    } finally {
      setLoading(false);
    }
  }, [entityType, entityId]);

  useEffect(() => {
    if (open) void load();
  }, [open, load]);

  async function restore(revisionId: string) {
    setBusyId(revisionId);
    setNotice('');
    try {
      const res = await fetch('/api/learn/content-revisions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'restore', revisionId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setNotice(data.error || 'Restore failed');
        return;
      }
      setNotice('Restored as draft — reload the editor to see changes.');
    } finally {
      setBusyId(null);
    }
  }

  if (!entityId) return null;

  return (
    <div className="border p-3" style={{ borderColor: 'var(--line)' }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 text-[13px] font-semibold"
        style={{ color: accent }}
      >
        <History size={14} />
        Version history {open ? '▴' : '▾'}
      </button>
      {open ? (
        <div className="mt-3 space-y-2">
          {loading ? (
            <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
              <Loader2 size={14} className="mr-1 inline animate-spin" /> Loading…
            </p>
          ) : items.length === 0 ? (
            <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
              No published snapshots yet. Versions are saved each time you publish.
            </p>
          ) : (
            <ul className="space-y-2">
              {items.map((r) => (
                <li
                  key={r.id}
                  className="flex flex-wrap items-center justify-between gap-2 border-t pt-2"
                  style={{ borderColor: 'var(--line)' }}
                >
                  <div>
                    <p className="text-[13px] font-semibold">
                      {r.label} · v{r.version}
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-wide" style={{ color: 'var(--ink-soft)' }}>
                      {r.authorName} · {new Date(r.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={busyId === r.id}
                    onClick={() => restore(r.id)}
                    className="inline-flex items-center gap-1 border px-2 py-1 text-[12px] font-semibold"
                    style={{ borderColor: 'var(--line)' }}
                  >
                    {busyId === r.id ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <RotateCcw size={12} />
                    )}
                    Restore draft
                  </button>
                </li>
              ))}
            </ul>
          )}
          {notice ? (
            <p className="text-[12.5px]" style={{ color: accent }}>
              {notice}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
