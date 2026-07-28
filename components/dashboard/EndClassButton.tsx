'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loader2, Radio, Square } from 'lucide-react';

/**
 * Host controls on the session room: end the course class so admins
 * get a clean start/end audit trail.
 */
export default function EndClassButton({
  sessionId,
  courseTitle,
}: {
  sessionId: string;
  courseTitle: string;
}) {
  const [busy, setBusy] = useState(false);
  const [ended, setEnded] = useState(false);
  const [error, setError] = useState('');

  async function endClass() {
    if (busy || ended) return;
    if (!window.confirm(`End class for "${courseTitle}"? Students will be notified.`)) return;
    setBusy(true);
    setError('');
    try {
      const res = await fetch(`/api/learn/course-sessions/${sessionId}/end`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Could not end class');
        return;
      }
      setEnded(true);
    } catch {
      setError('Network error');
    } finally {
      setBusy(false);
    }
  }

  if (ended) {
    return (
      <div
        className="mb-4 flex flex-wrap items-center justify-between gap-3 border px-4 py-3"
        style={{ borderColor: 'var(--line)', background: 'rgba(0,179,105,0.06)' }}
      >
        <p className="text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>
          Class ended. Start and end times are recorded for platform admin review.
        </p>
        <Link
          href="/dashboard/students"
          className="text-[13px] font-semibold"
          style={{ color: 'var(--green-deep)' }}
        >
          Back to My Students →
        </Link>
      </div>
    );
  }

  return (
    <div
      className="mb-4 flex flex-wrap items-center justify-between gap-3 border px-4 py-3"
      style={{ borderColor: 'rgba(220,38,38,0.35)', background: 'rgba(220,38,38,0.05)' }}
    >
      <div className="min-w-0">
        <p className="inline-flex items-center gap-1.5 text-[13px] font-semibold" style={{ color: '#b91c1c' }}>
          <Radio size={14} className="animate-pulse" /> Class in progress
        </p>
        <p className="mt-0.5 text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
          When you finish teaching, end the class so admins can verify it was held.
        </p>
        {error ? (
          <p className="mt-1 text-[12px]" style={{ color: '#b91c1c' }}>
            {error}
          </p>
        ) : null}
      </div>
      <button
        type="button"
        onClick={endClass}
        disabled={busy}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-semibold text-white"
        style={{ background: '#b91c1c' }}
      >
        {busy ? <Loader2 size={14} className="animate-spin" /> : <Square size={14} />}
        End class
      </button>
    </div>
  );
}
