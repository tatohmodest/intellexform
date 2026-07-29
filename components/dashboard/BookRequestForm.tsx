'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Send } from 'lucide-react';

export default function BookRequestForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [authorHint, setAuthorHint] = useState('');
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setBusy(true);
    setError('');
    setDone(false);
    try {
      const res = await fetch('/api/learn/book-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, authorHint, reason }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        router.push('/login?next=/dashboard/library');
        return;
      }
      if (!res.ok) throw new Error(data.error || 'Could not send request');
      setTitle('');
      setAuthorHint('');
      setReason('');
      setDone(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border p-5 sm:p-6" style={{ borderColor: 'var(--line)', background: 'var(--paper)' }}>
      <h3 className="font-display text-[18px]">Request a book</h3>
      <p className="mt-1 text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>
        Tell InTelleX what you need. Admins review requests and can publish them to the library
        (free or priced). Student members read paid books free.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="block text-[12px] font-semibold sm:col-span-2">
          Book title / Amazon link
          <input
            required
            className="mt-1 w-full rounded-xl border px-3 py-2.5 text-[14px]"
            style={{ borderColor: 'var(--line)' }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Clean Code, Intro to Networking or https://..."
          />
        </label>
        <label className="block text-[12px] font-semibold">
          Author / topic (optional)
          <input
            className="mt-1 w-full rounded-xl border px-3 py-2.5 text-[14px]"
            style={{ borderColor: 'var(--line)' }}
            value={authorHint}
            onChange={(e) => setAuthorHint(e.target.value)}
            placeholder="Author or subject"
          />
        </label>
        <label className="block text-[12px] font-semibold">
          Why you need it (optional)
          <input
            className="mt-1 w-full rounded-xl border px-3 py-2.5 text-[14px]"
            style={{ borderColor: 'var(--line)' }}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Course, exam, project…"
          />
        </label>
      </div>
      {error && (
        <p className="mt-3 text-[13px]" style={{ color: '#b91c1c' }}>{error}</p>
      )}
      {done && (
        <p className="mt-3 text-[13px]" style={{ color: 'var(--green-deep)' }}>
          Request sent. We will review it and publish when we can.
        </p>
      )}
      <button type="submit" className="btn btn-g mt-4" disabled={busy || !title.trim()}>
        {busy ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
        Submit request
      </button>
    </form>
  );
}
