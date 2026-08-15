'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BookPlus, Loader2, Send, Sparkles, X } from 'lucide-react';

type Quota = {
  isStudent: boolean;
  limit: number;
  used: number;
  remaining: number;
  monthLabel: string;
};

export default function BookRequestButton({
  initialQuota,
}: {
  initialQuota: Quota;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [quota, setQuota] = useState(initialQuota);
  const [title, setTitle] = useState('');
  const [authorHint, setAuthorHint] = useState('');
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setQuota(initialQuota);
  }, [initialQuota]);

  function close() {
    if (busy) return;
    setOpen(false);
    setError('');
    setDone(false);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || quota.remaining <= 0) return;
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
      if (data.quota) setQuota(data.quota);
      if (!res.ok) {
        throw new Error(data.message || data.error || 'Could not send request');
      }
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
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>
            {quota.remaining} of {quota.limit} requests left in {quota.monthLabel}
            {!quota.isStudent ? ' · guests get 2/month' : ' · students get 10/month'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="btn btn-g inline-flex items-center gap-1.5"
        >
          <BookPlus size={15} />
          Request a book
        </button>
      </div>

      {open ? (
        <div
          className="fixed inset-0 z-[120] flex items-end justify-center p-4 sm:items-center"
          style={{ background: 'rgba(12,17,22,0.55)' }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="book-request-title"
          onClick={close}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto border p-6 shadow-book"
            style={{ borderColor: 'var(--line)', background: 'var(--paper)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 id="book-request-title" className="font-display text-[22px]">
                  Request a book
                </h3>
                <p className="mt-1 text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>
                  Admins review requests and can publish them to the library.
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                className="flex h-9 w-9 items-center justify-center"
                aria-label="Close"
                style={{ color: 'var(--ink-soft)' }}
              >
                <X size={18} />
              </button>
            </div>

            <div
              className="mb-4 border px-3.5 py-3 text-[13px]"
              style={{
                borderColor: quota.remaining > 0 ? 'rgba(0,179,105,0.3)' : 'rgba(185,28,28,0.35)',
                background:
                  quota.remaining > 0 ? 'rgba(0,179,105,0.06)' : 'rgba(185,28,28,0.05)',
                color: quota.remaining > 0 ? 'var(--green-deep)' : '#b91c1c',
              }}
            >
              <strong>
                {quota.remaining} request{quota.remaining === 1 ? '' : 's'} left
              </strong>{' '}
              this month ({quota.used}/{quota.limit} used · {quota.monthLabel}).
              {!quota.isStudent ? (
                <span className="mt-1.5 flex items-start gap-1.5" style={{ color: 'var(--ink-soft)' }}>
                  <Sparkles size={14} className="mt-0.5 shrink-0" style={{ color: 'var(--green-deep)' }} />
                  <span>
                    Subscribe as an InTelleX Student for up to 10 book requests per month, free
                    priced library books, and more.{' '}
                    <Link href="/membership" className="font-semibold" style={{ color: 'var(--green-deep)' }}>
                      See student benefits →
                    </Link>
                  </span>
                </span>
              ) : null}
            </div>

            {quota.remaining <= 0 ? (
              <div className="space-y-4">
                <p className="text-[14px]" style={{ color: 'var(--ink-soft)' }}>
                  {quota.isStudent
                    ? 'You’ve hit this month’s student request limit. New requests open next month.'
                    : 'You’ve used both guest requests for this month. Become a student for 10 requests each month.'}
                </p>
                {!quota.isStudent ? (
                  <Link href="/membership" className="btn btn-g inline-flex">
                    <Sparkles size={14} /> Become a student
                  </Link>
                ) : null}
                <button type="button" onClick={close} className="block text-[13px] font-semibold" style={{ color: 'var(--ink-soft)' }}>
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-3">
                <label className="block text-[12px] font-semibold">
                  Book title / Amazon link
                  <input
                    required
                    className="mt-1 w-full rounded-xl border px-3 py-2.5 text-[14px]"
                    style={{ borderColor: 'var(--line)' }}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Clean Code or https://…"
                    autoFocus
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
                {error ? (
                  <p className="text-[13px]" style={{ color: '#b91c1c' }}>
                    {error}
                  </p>
                ) : null}
                {done ? (
                  <p className="text-[13px]" style={{ color: 'var(--green-deep)' }}>
                    Request sent. You have {quota.remaining} left this month.
                    {!quota.isStudent ? (
                      <>
                        {' '}
                        <Link href="/membership" className="font-semibold underline">
                          Subscribe for 10/month as a student
                        </Link>
                        .
                      </>
                    ) : null}
                  </p>
                ) : null}
                <div className="flex flex-wrap gap-2 pt-1">
                  <button type="submit" className="btn btn-g" disabled={busy || !title.trim()}>
                    {busy ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                    Submit request
                  </button>
                  <button
                    type="button"
                    onClick={close}
                    className="rounded-full border px-4 py-2 text-[13px] font-semibold"
                    style={{ borderColor: 'var(--line)' }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
