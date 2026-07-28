'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import IntroVideoRecorder from '@/components/dashboard/IntroVideoRecorder';
import { prepareMentorDocForUpload } from '@/lib/compressImage';
import {
  MENTOR_DOC_REQUEST_ITEMS,
  type MentorApplicationDoc,
  type MentorDocRequestItem,
} from '@/lib/learn/mentorApplication';
import { INTRO_VIDEO_MAX_SECONDS, INTRO_VIDEO_MIN_SECONDS } from '@/lib/learn/compressVideo';
import { uploadMentorAsset } from '@/lib/learn/mentorUpload';

function fmtBytes(n: number) {
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

export default function MentorRevisionPortal({
  application,
  onDone,
}: {
  application: MentorApplicationDoc;
  onDone: (app: MentorApplicationDoc | null) => void;
}) {
  const req = application.documentRequest;
  const items = (req?.items || []).filter((id) =>
    MENTOR_DOC_REQUEST_ITEMS.some((x) => x.id === id),
  ) as MentorDocRequestItem[];

  const need = new Set(items);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [idFront, setIdFront] = useState<File | null>(null);
  const [idBack, setIdBack] = useState<File | null>(null);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [videoSeconds, setVideoSeconds] = useState(0);
  const [busy, setBusy] = useState(false);
  const [uploadPct, setUploadPct] = useState(0);
  const [uploadLabel, setUploadLabel] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  if (!req || req.status !== 'open' || items.length === 0) {
    return null;
  }

  if (done) {
    return (
      <div className="mt-8 border-t pt-8" style={{ borderColor: 'var(--line)' }}>
        <h2 className="font-display text-[22px]">Documents sent</h2>
        <p className="mt-2 text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
          Admins have your updated files. Your application stays under review.
        </p>
      </div>
    );
  }

  async function submit() {
    setError('');
    if (need.has('resume') && !resumeFile) {
      setError('Upload a new CV as PDF, DOC, or DOCX.');
      return;
    }
    if (need.has('id_front') && !idFront) {
      setError('Upload a new ID front photo.');
      return;
    }
    if (need.has('id_back') && !idBack) {
      setError('Upload a new ID back photo.');
      return;
    }
    if (need.has('intro_video')) {
      if (!videoBlob) {
        setError(`Record a new intro video (${INTRO_VIDEO_MIN_SECONDS}–${INTRO_VIDEO_MAX_SECONDS}s).`);
        return;
      }
      if (videoSeconds < INTRO_VIDEO_MIN_SECONDS || videoSeconds > INTRO_VIDEO_MAX_SECONDS) {
        setError(`Intro video must be ${INTRO_VIDEO_MIN_SECONDS}–${INTRO_VIDEO_MAX_SECONDS} seconds.`);
        return;
      }
    }

    setBusy(true);
    setUploadPct(0);
    try {
      const body: Record<string, unknown> = {};

      if (need.has('resume') && resumeFile) {
        setUploadLabel('Uploading CV…');
        const resume = await uploadMentorAsset('resume', resumeFile, resumeFile.name, setUploadPct);
        body.resumeUrl = resume.url;
        body.resumePublicId = resume.publicId;
        body.resumeResourceType = resume.resourceType;
        body.resumeFormat = resume.format;
      }
      if (need.has('id_front') && idFront) {
        setUploadLabel('Uploading ID (front)…');
        const front = await uploadMentorAsset('id_front', idFront, idFront.name, setUploadPct);
        body.idFrontUrl = front.url;
      }
      if (need.has('id_back') && idBack) {
        setUploadLabel('Uploading ID (back)…');
        setUploadPct(0);
        const back = await uploadMentorAsset('id_back', idBack, idBack.name, setUploadPct);
        body.idBackUrl = back.url;
      }
      if (need.has('intro_video') && videoBlob) {
        setUploadLabel('Uploading intro video…');
        setUploadPct(0);
        const videoExt = videoBlob.type.includes('mp4') ? 'mp4' : 'webm';
        const video = await uploadMentorAsset(
          'intro_video',
          videoBlob,
          `intro-${Date.now()}.${videoExt}`,
          setUploadPct,
        );
        body.introVideoUrl = video.url;
        body.introVideoBytes = video.bytes;
      }

      setUploadLabel('Sending to admins…');
      const res = await fetch('/api/learn/mentor/application', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          data.error === 'invalid_resume_url' || data.error === 'invalid_document_url'
            ? 'Upload failed validation. Re-upload your files and try again.'
            : data.error === 'no_open_request'
              ? 'This request was already completed. Refresh the page.'
              : 'Could not send documents. Please try again.',
        );
        return;
      }
      setDone(true);
      onDone(data.application || null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      setError(
        msg === 'file_too_large'
          ? 'Each file must be 10 MB or smaller.'
          : msg || 'Upload failed. Check your connection and try again.',
      );
    } finally {
      setBusy(false);
      setUploadLabel('');
      setUploadPct(0);
    }
  }

  return (
    <div className="mt-8 border-t pt-8" style={{ borderColor: 'var(--line)' }}>
      <p className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: '#c2570a' }}>
        Action needed
      </p>
      <h2 className="mt-1 font-display text-[24px] leading-tight">Re-send requested documents</h2>
      <p className="mt-2 text-[14.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
        Admins asked for {items.length === 1 ? 'this item' : 'these items'} only — you do not need to
        resubmit the whole application.
      </p>
      {req.note && (
        <p
          className="mt-3 border-l-2 pl-3 text-[13.5px] leading-relaxed"
          style={{ borderColor: '#c2570a', color: 'var(--ink)' }}
        >
          {req.note}
        </p>
      )}

      <ul className="mt-4 flex flex-wrap gap-2">
        {items.map((id) => {
          const meta = MENTOR_DOC_REQUEST_ITEMS.find((x) => x.id === id);
          return (
            <li
              key={id}
              className="border px-2.5 py-1 text-[12px] font-semibold"
              style={{ borderColor: 'rgba(194,87,10,0.35)', color: '#c2570a' }}
            >
              {meta?.label || id}
            </li>
          );
        })}
      </ul>

      <div className="mt-6 space-y-6">
        {need.has('resume') && (
          <RevisionFile
            label="New CV (PDF / DOC / DOCX)"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            file={resumeFile}
            onFile={setResumeFile}
            onError={setError}
            optimize="resume"
          />
        )}

        {need.has('id_front') && (
          <RevisionFile
            label="ID front"
            accept="image/*"
            file={idFront}
            onFile={setIdFront}
            onError={setError}
          />
        )}
        {need.has('id_back') && (
          <RevisionFile
            label="ID back"
            accept="image/*"
            file={idBack}
            onFile={setIdBack}
            onError={setError}
          />
        )}
        {need.has('intro_video') && (
          <section className="space-y-3">
            <h3 className="text-[14px] font-semibold">New intro video</h3>
            <IntroVideoRecorder
              value={videoBlob}
              onReady={(blob, sec) => {
                setVideoBlob(blob);
                setVideoSeconds(sec);
              }}
            />
          </section>
        )}
      </div>

      {error && (
        <p
          className="mt-5 border px-4 py-3 text-[13px]"
          style={{ borderColor: 'rgba(196,98,42,0.35)', background: 'rgba(196,98,42,0.08)', color: '#a14d18' }}
        >
          {error}
        </p>
      )}

      {busy && (
        <div className="mt-4">
          <div className="mb-1.5 flex justify-between text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
            <span>{uploadLabel}</span>
            <span>{uploadPct}%</span>
          </div>
          <div className="h-1 overflow-hidden" style={{ background: 'var(--paper-dim)' }}>
            <div className="h-full" style={{ width: `${uploadPct}%`, background: 'var(--green-deep)' }} />
          </div>
        </div>
      )}

      <button
        type="button"
        disabled={busy}
        onClick={submit}
        className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 text-[13.5px] font-semibold text-white disabled:opacity-60"
        style={{ background: 'var(--green)' }}
      >
        {busy ? <Loader2 size={15} className="animate-spin" /> : null}
        Send requested documents
      </button>
    </div>
  );
}

function RevisionFile({
  label,
  accept,
  file,
  onFile,
  onError,
  optimize = 'id',
}: {
  label: string;
  accept: string;
  file: File | null;
  onFile: (f: File | null) => void;
  onError: (msg: string) => void;
  optimize?: 'id' | 'resume';
}) {
  return (
    <section>
      <h3 className="mb-2 text-[14px] font-semibold">{label}</h3>
      <label
        className="flex cursor-pointer flex-col items-center justify-center border border-dashed px-4 py-8 text-center"
        style={{ borderColor: 'var(--line)' }}
      >
        <span className="text-[13.5px] font-semibold">
          {file ? file.name : `Drop ${label.toLowerCase()} or browse`}
        </span>
        {file && (
          <span className="mt-1 text-[12px]" style={{ color: 'var(--ink-soft)' }}>
            {fmtBytes(file.size)}
          </span>
        )}
        <input
          type="file"
          accept={accept}
          className="hidden"
          onChange={async (e) => {
            const raw = e.target.files?.[0];
            e.target.value = '';
            if (!raw) return;
            try {
              if (raw.type.startsWith('image/')) {
                const prepared = await prepareMentorDocForUpload(raw, optimize);
                onFile(prepared);
              } else {
                onFile(raw);
              }
              onError('');
            } catch (err) {
              onFile(null);
              onError(
                err instanceof Error && err.message === 'file_too_large'
                  ? 'File must be 10 MB or smaller.'
                  : 'Could not prepare that file.',
              );
            }
          }}
        />
      </label>
    </section>
  );
}
