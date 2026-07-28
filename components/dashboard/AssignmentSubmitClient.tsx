'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Loader2, Lock } from 'lucide-react';
import DriveDocViewer from '@/components/dashboard/DriveDocViewer';
import type { AssessmentView, SubmissionView } from '@/lib/learn/assessments';
import { formatCountdown } from '@/lib/learn/countdown';

function useCountdown(dueAt: string | Date | null | undefined) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!dueAt) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [dueAt]);

  return useMemo(() => formatCountdown(dueAt, now), [dueAt, now]);
}

export default function AssignmentSubmitClient({
  assessment,
  initial,
}: {
  assessment: AssessmentView;
  initial: SubmissionView | null;
}) {
  const [driveUrl, setDriveUrl] = useState(initial?.driveUrl || '');
  const [submission, setSubmission] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(initial?.driveEmbedUrl || '');
  const countdown = useCountdown(assessment.dueAt);
  const locked =
    Boolean(countdown.expired) &&
    !(submission?.status === 'submitted' || submission?.status === 'graded');

  async function submit() {
    if (locked) {
      setError('The deadline has passed. You can no longer submit.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const res = await fetch(`/api/learn/assessments/${assessment.id}/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driveUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.error === 'deadline_passed'
            ? 'The deadline has passed. You can no longer submit.'
            : data.message || data.error || 'Submit failed',
        );
      }
      setSubmission(data.submission);
      setPreview(data.submission.driveEmbedUrl || '');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Submit failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-[900px]">
      <Link href="/dashboard/notifications" className="mb-6 inline-flex items-center gap-1 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
        <ArrowLeft size={14} /> Notifications
      </Link>
      <p className="font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: 'var(--ink-soft)' }}>
        Assignment
      </p>
      <h1 className="mt-1 font-display text-[32px] leading-tight">{assessment.title}</h1>

      {assessment.dueAt && (
        <div
          className="mt-4 inline-flex items-center gap-2 border px-3 py-2 text-[13px] font-semibold"
          style={{
            borderColor: countdown.expired ? 'rgba(185,28,28,0.35)' : 'var(--line)',
            color: countdown.expired ? '#b91c1c' : 'var(--green-deep)',
            background: countdown.expired ? 'rgba(185,28,28,0.06)' : 'rgba(0,179,105,0.06)',
          }}
        >
          {countdown.expired ? <Lock size={14} /> : <Clock size={14} />}
          {countdown.expired
            ? 'Deadline passed — submissions closed'
            : `Time left ${countdown.label}`}
          <span className="font-normal" style={{ color: 'var(--ink-soft)' }}>
            · due {new Date(assessment.dueAt).toLocaleString()}
          </span>
        </div>
      )}

      <p className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
        {assessment.instructions}
      </p>

      <div className="mt-6 border p-4" style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}>
        <p className="font-semibold text-[14px]">How to submit (Google Drive)</p>
        <p className="mt-2 text-[13.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
          {assessment.studentTips ||
            'Create a Google Doc or upload a PDF to Drive → Share → Anyone with the link (Viewer) → paste the link below. Your instructor opens it inside InTelleX.'}
        </p>
        <a
          href="https://drive.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex text-[13px] font-semibold"
          style={{ color: 'var(--green-deep)' }}
        >
          Open Google Drive →
        </a>
      </div>

      {(assessment.questions || []).length > 0 && (
        <ul className="mt-6 list-decimal space-y-2 pl-5 text-[14px]">
          {assessment.questions.map((q) => (
            <li key={q.id}>
              {q.prompt}
              {q.hint ? (
                <span className="block text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
                  Tip: {q.hint}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      )}

      {submission?.status === 'graded' ? (
        <div className="mt-8 border p-5" style={{ borderColor: 'var(--line)' }}>
          <p className="font-display text-[22px]">
            Marked · {submission.score}/{submission.maxScore ?? '-'}
          </p>
          {submission.feedback && (
            <p className="mt-2 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
              {submission.feedback}
            </p>
          )}
        </div>
      ) : locked ? (
        <div className="mt-8 border p-5" style={{ borderColor: 'rgba(185,28,28,0.35)', background: 'rgba(185,28,28,0.06)' }}>
          <p className="inline-flex items-center gap-2 font-semibold text-[#b91c1c]">
            <Lock size={16} /> Submissions closed
          </p>
          <p className="mt-2 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
            The deadline elapsed before you submitted a Google Drive link.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          <label className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--ink-soft)' }}>
            Google Drive / Docs / PDF link (public viewer)
          </label>
          <input
            className="form-input !rounded-none"
            placeholder="https://docs.google.com/document/d/… or Drive file link"
            value={driveUrl}
            onChange={(e) => setDriveUrl(e.target.value)}
            disabled={Boolean(submission?.status === 'submitted')}
          />
          {submission?.status === 'submitted' ? (
            <p className="text-[13px]" style={{ color: 'var(--green-deep)' }}>
              Submitted {submission.submittedAt ? new Date(submission.submittedAt).toLocaleString() : ''}. Waiting for marks.
            </p>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={busy || !driveUrl.trim()}
              className="btn btn-primary disabled:opacity-40"
            >
              {busy ? <Loader2 className="animate-spin" size={16} /> : null}
              Submit assignment
            </button>
          )}
          {error && <p className="text-[13px]" style={{ color: '#b91c1c' }}>{error}</p>}
        </div>
      )}

      {preview && (
        <div className="mt-8">
          <h2 className="mb-3 font-display text-[20px]">Your document (preview)</h2>
          <DriveDocViewer embedUrl={preview} title="Your submission" />
        </div>
      )}
    </div>
  );
}
