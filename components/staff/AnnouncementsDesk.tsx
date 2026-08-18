'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Item = {
  id: string;
  title: string;
  body: string;
  audience: string;
  authorName: string;
  createdAt: string | Date;
};

export default function AnnouncementsDesk({
  items,
  canWrite,
}: {
  items: Item[];
  canWrite: boolean;
}) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [audience, setAudience] = useState('everyone');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  async function publish() {
    setBusy(true);
    setMsg('');
    try {
      const res = await fetch('/api/staff/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body, audience }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not publish');
      setTitle('');
      setBody('');
      setMsg('Published.');
      router.refresh();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Could not publish');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      {canWrite ? (
        <div className="border p-4" style={{ borderColor: 'var(--line)' }}>
          <h2 className="mb-3 font-display text-[20px]">Publish an announcement</h2>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="mb-2 w-full border px-3 py-2 text-[14px]"
            style={{ borderColor: 'var(--line)', background: 'transparent' }}
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="What should people know?"
            rows={4}
            className="mb-2 w-full border px-3 py-2 text-[14px]"
            style={{ borderColor: 'var(--line)', background: 'transparent' }}
          />
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="border px-3 py-2 text-[13px]"
              style={{ borderColor: 'var(--line)', background: 'transparent' }}
            >
              <option value="everyone">Everyone</option>
              <option value="students">Students</option>
              <option value="staff">Staff only</option>
            </select>
            <button
              type="button"
              onClick={publish}
              disabled={busy}
              className="px-4 py-2 text-[13px] font-semibold text-white"
              style={{ background: '#00B369' }}
            >
              {busy ? 'Publishing…' : 'Publish'}
            </button>
            {msg ? (
              <span className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                {msg}
              </span>
            ) : null}
          </div>
        </div>
      ) : null}

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed px-4 py-10 text-center" style={{ borderColor: 'var(--line)' }}>
          <p className="font-display text-[20px]">No announcements yet</p>
          <p className="mt-1 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
            {canWrite
              ? 'Share registration updates, exam notices, or campus news.'
              : 'Announcements from authorized staff will appear here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <article key={item.id} className="border p-4" style={{ borderColor: 'var(--line)' }}>
              <p className="font-semibold">{item.title}</p>
              <p className="mt-1 whitespace-pre-wrap text-[14px]">{item.body}</p>
              <p className="mt-2 text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                {item.authorName} · {item.audience} ·{' '}
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
