'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Download, ExternalLink, Loader2, Lock, Upload } from 'lucide-react';
import CloudinaryDocViewer from '@/components/dashboard/CloudinaryDocViewer';
import DriveDocViewer from '@/components/dashboard/DriveDocViewer';
import MarkdownLite from '@/components/dashboard/MarkdownLite';
import type { AssessmentView, SubmissionView } from '@/lib/learn/assessments';
import { formatCountdown } from '@/lib/learn/countdown';
import { uploadMediaAsset } from '@/lib/learn/mentorUpload';

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
  const [file, setFile] = useState<File | null>(null);
  const [submission, setSubmission] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [uploadPct, setUploadPct] = useState(0);
  const [error, setError] = useState('');
  const countdown = useCountdown(assessment.dueAt);
  const locked =
    Boolean(countdown.expired) &&
    !(submission?.status === 'submitted' || submission?.status === 'graded');

  const hasCloudinary = Boolean(submission?.fileUrl);
  const fileApiBase = `/api/learn/assessments/${assessment.id}/file`;

  async function submit() {
    if (locked) {
      setError('The deadline has passed. You can no longer submit.');
      return;
    }
    if (!file) {
      setError('Choose a PDF, DOC, or DOCX file to upload.');
      return;
    }
    setBusy(true);
    setError('');
    setUploadPct(0);
    try {
      const uploaded = await uploadMediaAsset('assignment', file, file.name, setUploadPct);
      const res = await fetch(`/api/learn/assessments/${assessment.id}/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileUrl: uploaded.url,
          filePublicId: uploaded.publicId,
          fileResourceType: uploaded.resourceType,
          fileFormat: uploaded.format,
          fileName: uploaded.originalFilename,
          fileBytes: uploaded.bytes,
        }),
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
      setFile(null);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Submit failed';
      setError(
        msg === 'file_too_large'
          ? 'File must be 10 MB or smaller.'
          : msg,
      );
    } finally {
      setBusy(false);
      setUploadPct(0);
    }
  }

  return (
    <div className="mx-auto w-full max-w-[900px] overflow-x-hidden">
      <Link href="/dashboard/assignments" className="mb-5 inline-flex min-h-[44px] items-center gap-1 text-[13px] sm:mb-6" style={{ color: 'var(--ink-soft)' }}>
        <ArrowLeft size={14} /> Assignments
      </Link>
      <p className="font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: 'var(--ink-soft)' }}>
        Assignment
      </p>
      <h1 className="mt-1 font-display text-[24px] leading-tight sm:text-[32px]">{assessment.title}</h1>

      {assessment.dueAt && (
        <div
          className="mt-4 flex flex-wrap items-center gap-2 border px-3 py-2 text-[13px] font-semibold"
          style={{
            borderColor: countdown.expired ? 'rgba(185,28,28,0.35)' : 'var(--line)',
            color: countdown.expired ? '#b91c1c' : 'var(--green-deep)',
            background: countdown.expired ? 'rgba(185,28,28,0.06)' : 'rgba(0,179,105,0.06)',
          }}
        >
          {countdown.expired ? <Lock size={14} /> : <Clock size={14} />}
          <span>
            {countdown.expired
              ? 'Deadline passed - submissions closed'
              : `Time left ${countdown.label}`}
          </span>
          <span className="w-full font-normal sm:w-auto" style={{ color: 'var(--ink-soft)' }}>
            · due {new Date(assessment.dueAt).toLocaleString()}
          </span>
        </div>
      )}

      <div className="mt-3 rounded-xl border p-4" style={{ borderColor: 'var(--line)' }}>
        <MarkdownLite text={assessment.instructions || 'No assignment instructions added yet.'} />
      </div>

      {assessment.attachmentFileUrl && (
        <div className="mt-4 rounded-xl border p-4" style={{ borderColor: 'var(--line)' }}>
          <p className="mb-2 text-[13px] font-semibold">Assignment brief file</p>
          <div className="mb-3 flex flex-wrap gap-2">
            <a
              href={`${fileApiBase}?target=brief&disposition=inline`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12.5px] font-semibold"
              style={{ borderColor: 'var(--line)' }}
            >
              <ExternalLink size={13} /> Open brief
            </a>
            <a
              href={`${fileApiBase}?target=brief&disposition=attachment`}
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12.5px] font-semibold"
              style={{ borderColor: 'var(--line)' }}
            >
              <Download size={13} /> Download brief
            </a>
          </div>
          <CloudinaryDocViewer
            title={assessment.title}
            format={assessment.attachmentFileFormat}
            fileName={assessment.attachmentFileName}
            viewUrl={`${fileApiBase}?target=brief&disposition=inline`}
            downloadUrl={`${fileApiBase}?target=brief&disposition=attachment`}
          />
        </div>
      )}

      <div className="mt-6 border p-4" style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}>
        <p className="font-semibold text-[14px]">How to submit</p>
        <p className="mt-2 text-[13.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
          {assessment.studentTips ||
            'Upload a PDF (best for in-app preview), DOC, or DOCX - up to 10 MB. Your instructor opens it inside InTelleX.'}
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
            The deadline elapsed before you submitted your file.
          </p>
        </div>
      ) : submission?.status === 'submitted' ? (
        <p className="mt-8 text-[13px]" style={{ color: 'var(--green-deep)' }}>
          Submitted {submission.submittedAt ? new Date(submission.submittedAt).toLocaleString() : ''}. Waiting for marks.
        </p>
      ) : (
        <div className="mt-8 space-y-3">
          <label className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--ink-soft)' }}>
            Upload PDF / DOC / DOCX
          </label>
          <label
            className="flex cursor-pointer flex-col items-center justify-center border border-dashed px-4 py-10 text-center"
            style={{ borderColor: 'var(--line)' }}
          >
            <Upload size={20} style={{ color: 'var(--ink-soft)' }} />
            <span className="mt-2 text-[13.5px] font-semibold">
              {file ? file.name : 'Drop file here or browse'}
            </span>
            <span className="mt-1 text-[12px]" style={{ color: 'var(--ink-soft)' }}>
              PDF preferred for preview · max 10 MB
            </span>
            <input
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="hidden"
              onChange={(e) => {
                setFile(e.target.files?.[0] || null);
                setError('');
                e.target.value = '';
              }}
            />
          </label>
          {busy && (
            <div>
              <div className="mb-1 flex justify-between text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                <span>Uploading…</span>
                <span>{uploadPct}%</span>
              </div>
              <div className="h-1" style={{ background: 'var(--paper-dim)' }}>
                <div className="h-full" style={{ width: `${uploadPct}%`, background: 'var(--green-deep)' }} />
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={submit}
            disabled={busy || !file}
            className="btn btn-primary min-h-[44px] w-full disabled:opacity-40 sm:w-auto"
          >
            {busy ? <Loader2 className="animate-spin" size={16} /> : null}
            Submit assignment
          </button>
          {error && <p className="text-[13px]" style={{ color: '#b91c1c' }}>{error}</p>}
        </div>
      )}

      {hasCloudinary && submission && (
        <div className="mt-8">
          <h2 className="mb-3 font-display text-[20px]">Your document</h2>
          <CloudinaryDocViewer
            title="Your submission"
            format={submission.fileFormat}
            fileName={submission.fileName}
            viewUrl={`${fileApiBase}?disposition=inline`}
            downloadUrl={`${fileApiBase}?disposition=attachment`}
          />
        </div>
      )}

      {!hasCloudinary && submission?.driveEmbedUrl && (
        <div className="mt-8">
          <h2 className="mb-3 font-display text-[20px]">Your document (Drive)</h2>
          <DriveDocViewer embedUrl={submission.driveEmbedUrl} title="Your submission" />
        </div>
      )}
    </div>
  );
}
