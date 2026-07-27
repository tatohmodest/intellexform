'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import DriveDocViewer from '@/components/dashboard/DriveDocViewer';
import type { AssessmentView, SubmissionView } from '@/lib/learn/assessments';

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

  async function submit() {
    setBusy(true);
    setError('');
    try {
      const res = await fetch(`/api/learn/assessments/${assessment.id}/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driveUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submit failed');
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
      <Link href="/dashboard" className="mb-6 inline-flex items-center gap-1 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
        <ArrowLeft size={14} /> Dashboard
      </Link>
      <p className="font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: 'var(--ink-soft)' }}>
        Assignment
      </p>
      <h1 className="mt-1 font-display text-[32px] leading-tight">{assessment.title}</h1>
      <p className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
        {assessment.instructions}
      </p>

      <div className="mt-6 border p-4" style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}>
        <p className="font-semibold text-[14px]">How to submit (Google Drive)</p>
        <p className="mt-2 text-[13.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
          {assessment.studentTips ||
            'Create a Google Doc or upload a PDF to Drive → Share → Anyone with the link (Viewer) → paste the link below. Your instructor opens it inside InTelleX.'}
        </p>
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
            Marked · {submission.score}/{submission.maxScore ?? '—'}
          </p>
          {submission.feedback && (
            <p className="mt-2 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
              {submission.feedback}
            </p>
          )}
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          <label className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--ink-soft)' }}>
            Google Drive / Docs / PDF link
          </label>
          <input
            className="form-input !rounded-none"
            placeholder="https://docs.google.com/document/d/… or Drive file link"
            value={driveUrl}
            onChange={(e) => setDriveUrl(e.target.value)}
          />
          <button
            type="button"
            onClick={submit}
            disabled={busy || !driveUrl.trim()}
            className="btn btn-primary disabled:opacity-40"
          >
            {busy ? <Loader2 className="animate-spin" size={16} /> : null}
            {submission ? 'Update submission' : 'Submit assignment'}
          </button>
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
