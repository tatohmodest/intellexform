'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, Keyboard, Loader2 } from 'lucide-react';

type QueueItem = {
  assessmentId: string;
  assessmentTitle: string;
  studentId: string;
  studentName: string;
  submittedAt: string | null;
  fileUrl: string | null;
};

export default function RapidGradePanel({
  initialQueue,
  accent = '#00b369',
}: {
  initialQueue: QueueItem[];
  accent?: string;
}) {
  const [queue, setQueue] = useState(initialQueue);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(80);
  const [feedback, setFeedback] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');

  const current = queue[index] || null;
  const remaining = queue.length;

  const hint = useMemo(
    () => 'j/k next/prev · Enter save · ] skip',
    [],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') {
        if (e.key === 'Enter' && !e.shiftKey && tag === 'INPUT') {
          e.preventDefault();
          void save();
        }
        return;
      }
      if (e.key === 'j' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIndex((i) => Math.min(queue.length - 1, i + 1));
      } else if (e.key === 'k' || e.key === 'ArrowUp') {
        e.preventDefault();
        setIndex((i) => Math.max(0, i - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        void save();
      } else if (e.key === ']') {
        e.preventDefault();
        setIndex((i) => Math.min(queue.length - 1, i + 1));
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue, index, score, feedback]);

  useEffect(() => {
    setScore(80);
    setFeedback('');
    setNotice('');
  }, [index, current?.studentId, current?.assessmentId]);

  async function save() {
    if (!current || busy) return;
    setBusy(true);
    setNotice('');
    try {
      const res = await fetch(`/api/learn/assessments/${current.assessmentId}/submissions`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: current.studentId,
          score,
          maxScore: 100,
          feedback,
        }),
      });
      if (!res.ok) throw new Error('grade_failed');
      setQueue((prev) => {
        const next = prev.filter(
          (q) =>
            !(q.assessmentId === current.assessmentId && q.studentId === current.studentId),
        );
        setIndex((i) => Math.min(i, Math.max(0, next.length - 1)));
        return next;
      });
      setNotice('Saved');
    } catch {
      setNotice('Could not save mark');
    } finally {
      setBusy(false);
    }
  }

  if (remaining === 0) {
    return (
      <div className="border border-dashed p-8 text-center" style={{ borderColor: 'var(--line)' }}>
        <p className="font-display text-[20px]">Rapid grade queue empty</p>
        <p className="mt-1 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
          New submissions will appear here for keyboard grading.
        </p>
      </div>
    );
  }

  return (
    <div className="border p-4" style={{ borderColor: 'var(--line)' }}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--ink-soft)' }}>
            <Keyboard size={11} /> Rapid grade · {remaining} left
          </p>
          <h2 className="font-display text-[22px] leading-tight">{current?.studentName}</h2>
          <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
            {current?.assessmentTitle}
            {current?.submittedAt
              ? ` · submitted ${new Date(current.submittedAt).toLocaleString()}`
              : ''}
          </p>
        </div>
        <p className="font-mono text-[11px]" style={{ color: 'var(--ink-soft)' }}>
          {hint}
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          className="inline-flex items-center gap-1 border px-2 py-1 text-[12px]"
          style={{ borderColor: 'var(--line)' }}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
        >
          <ChevronUp size={12} /> Prev
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1 border px-2 py-1 text-[12px]"
          style={{ borderColor: 'var(--line)' }}
          onClick={() => setIndex((i) => Math.min(queue.length - 1, i + 1))}
        >
          <ChevronDown size={12} /> Next
        </button>
        {current ? (
          <Link
            href={`/dashboard/teach/assessments?assessment=${current.assessmentId}`}
            className="border px-2 py-1 text-[12px] font-semibold"
            style={{ borderColor: 'var(--line)', color: accent }}
          >
            Open in studio
          </Link>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        <input
          type="number"
          className="form-input !w-24 !rounded-none !py-1.5 text-[13px]"
          value={score}
          onChange={(e) => setScore(Number(e.target.value) || 0)}
          aria-label="Score"
        />
        <input
          className="form-input !rounded-none min-w-[200px] flex-1 !py-1.5 text-[13px]"
          placeholder="Feedback (optional)"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
        <button
          type="button"
          disabled={busy}
          onClick={save}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-[13px] font-semibold text-white"
          style={{ background: accent }}
        >
          {busy ? <Loader2 size={14} className="animate-spin" /> : null}
          Save mark
        </button>
      </div>
      {notice ? (
        <p className="mt-2 text-[12.5px]" style={{ color: notice === 'Saved' ? accent : '#b91c1c' }}>
          {notice}
        </p>
      ) : null}
    </div>
  );
}
