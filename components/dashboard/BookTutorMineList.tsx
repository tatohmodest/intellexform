'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookMarked } from 'lucide-react';

type MineRow = {
  id: string;
  title: string;
  lessonCount: number;
  isPrivate: boolean;
  engine: string;
};

export default function BookTutorMineList({ rows }: { rows: MineRow[] }) {
  const router = useRouter();
  const [items, setItems] = useState(rows);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setItems(rows);
  }, [rows]);

  async function remove(id: string, title: string) {
    if (!window.confirm(`Delete “${title}” and your progress on it? This cannot be undone.`)) return;
    setBusyId(id);
    setError('');
    try {
      const res = await fetch(`/api/learn/book-tutor/${id}`, { method: 'DELETE' });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error || 'Could not delete that tutor.');
      setItems((cur) => cur.filter((item) => item.id !== id));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete that tutor.');
    } finally {
      setBusyId(null);
    }
  }

  if (!items.length) {
    return <p className="text-[14px]" style={{ color: 'var(--ink-soft)' }}>None left — upload above and they will land here.</p>;
  }

  return (
    <div>
      {error ? (
        <p className="mb-3 text-[13px]" style={{ color: '#b91c1c' }}>
          {error}
        </p>
      ) : null}
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-3 border px-4 py-3"
            style={{ borderColor: 'var(--line)' }}
          >
            <BookMarked size={16} style={{ color: 'var(--ink-soft)' }} />
            <div className="min-w-0 flex-1">
              <Link href={`/dashboard/library/learn/${item.id}`} className="font-semibold">
                {item.title}
              </Link>
              <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                {item.lessonCount ? `${item.lessonCount} steps` : 'Still building…'}
                {item.isPrivate ? ' · private' : ''}
              </p>
            </div>
            <button
              type="button"
              disabled={busyId === item.id}
              onClick={() => void remove(item.id, item.title)}
              className="shrink-0 text-[13px] font-semibold disabled:opacity-50"
              style={{ color: '#b91c1c' }}
            >
              {busyId === item.id ? 'Deleting…' : 'Delete'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
