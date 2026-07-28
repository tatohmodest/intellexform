'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  FileText,
  GraduationCap,
  Loader2,
  Plus,
  Upload,
  Video,
  X,
} from 'lucide-react';
import IntroVideoRecorder from '@/components/dashboard/IntroVideoRecorder';
import MentorRevisionPortal from '@/components/dashboard/MentorRevisionPortal';
import { MAX_MENTOR_DOC_BYTES, prepareMentorDocForUpload } from '@/lib/compressImage';
import { INTRO_VIDEO_MAX_SECONDS, INTRO_VIDEO_MIN_SECONDS } from '@/lib/learn/compressVideo';
import type { MentorApplicationDoc } from '@/lib/learn/mentorApplication';
import { uploadMentorAsset } from '@/lib/learn/mentorUpload';

const DAYS = ['Today', 'Tomorrow', 'In 2 days', 'In 3 days', 'In 4 days', 'In 5 days', 'In 6 days'];

const STEPS = [
  { id: 'profile', label: 'Profile', icon: GraduationCap },
  { id: 'schedule', label: 'Schedule', icon: CheckCircle2 },
  { id: 'resume', label: 'CV (Drive)', icon: FileText },
  { id: 'id', label: 'ID', icon: CreditCard },
  { id: 'video', label: 'Intro video', icon: Video },
  { id: 'review', label: 'Submit', icon: Upload },
] as const;

function fmtBytes(n: number) {
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

export default function MentorApply() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);

  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [expertise, setExpertise] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [priceXAF, setPriceXAF] = useState(4000);
  const [sessionMinutes, setSessionMinutes] = useState(45);
  const [slots, setSlots] = useState<{ dayOffset: number; time: string }[]>([
    { dayOffset: 1, time: '18:00' },
  ]);

  const [resumeDriveUrl, setResumeDriveUrl] = useState('');
  const [idFront, setIdFront] = useState<File | null>(null);
  const [idBack, setIdBack] = useState<File | null>(null);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [videoSeconds, setVideoSeconds] = useState(0);

  const [busy, setBusy] = useState(false);
  const [uploadPct, setUploadPct] = useState(0);
  const [uploadLabel, setUploadLabel] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [pendingApp, setPendingApp] = useState<MentorApplicationDoc | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch('/api/learn/mentor/application')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.application) {
          setSubmitted(true);
          setPendingApp(data.application);
        }
      })
      .finally(() => setChecking(false));
  }, []);

  function addSkill() {
    const s = skillInput.trim();
    if (s && !expertise.includes(s) && expertise.length < 6) {
      setExpertise([...expertise, s]);
    }
    setSkillInput('');
  }

  function go(next: number) {
    setDir(next > step ? 1 : -1);
    setStep(next);
    setError('');
  }

  function validateStep(i: number): string | null {
    if (i === 0) {
      if (!title.trim() || !bio.trim() || expertise.length === 0) {
        return 'Add your title, bio, and at least one skill.';
      }
    }
    if (i === 1) {
      if (slots.length === 0) return 'Add at least one availability slot.';
    }
    if (i === 2) {
      if (!resumeDriveUrl.trim()) {
        return 'Paste a public Google Drive link to your CV.';
      }
    }
    if (i === 3) {
      if (!idFront || !idBack) return 'Upload the front and back of your ID.';
    }
    if (i === 4) {
      if (!videoBlob) return `Record an intro video (${INTRO_VIDEO_MIN_SECONDS}–${INTRO_VIDEO_MAX_SECONDS} seconds).`;
      if (videoSeconds < INTRO_VIDEO_MIN_SECONDS) {
        return `Intro video must be at least ${INTRO_VIDEO_MIN_SECONDS} seconds.`;
      }
      if (videoSeconds > INTRO_VIDEO_MAX_SECONDS) {
        return `Intro video must be ${INTRO_VIDEO_MAX_SECONDS} seconds or less.`;
      }
    }
    return null;
  }

  function next() {
    const err = validateStep(step);
    if (err) {
      setError(err);
      return;
    }
    go(Math.min(step + 1, STEPS.length - 1));
  }

  function back() {
    go(Math.max(step - 1, 0));
  }

  async function submit() {
    for (let i = 0; i < STEPS.length - 1; i++) {
      const err = validateStep(i);
      if (err) {
        setError(err);
        go(i);
        return;
      }
    }
    if (!resumeDriveUrl.trim() || !idFront || !idBack || !videoBlob) return;

    setBusy(true);
    setError('');
    setUploadPct(0);
    try {
      setUploadLabel('Uploading ID (front)…');
      const front = await uploadMentorAsset('id_front', idFront, idFront.name, setUploadPct);
      if (!front.url) throw new Error('ID front upload did not return a URL.');

      setUploadLabel('Uploading ID (back)…');
      setUploadPct(0);
      const back = await uploadMentorAsset('id_back', idBack, idBack.name, setUploadPct);
      if (!back.url) throw new Error('ID back upload did not return a URL.');

      setUploadLabel('Uploading intro video…');
      setUploadPct(0);
      const videoExt = videoBlob.type.includes('mp4') ? 'mp4' : 'webm';
      const video = await uploadMentorAsset(
        'intro_video',
        videoBlob,
        `intro-${Date.now()}.${videoExt}`,
        setUploadPct,
      );
      if (!video.url) throw new Error('Intro video upload did not return a URL.');

      setUploadLabel('Submitting application…');
      let institutionSlug: string | null = null;
      let institutionName: string | null = null;
      try {
        const me = await fetch('/api/auth/me').then((r) => (r.ok ? r.json() : null));
        const ctx = me?.user?.activeContext;
        if (ctx?.kind === 'institution' && ctx.institutionSlug) {
          institutionSlug = ctx.institutionSlug;
          const aff = (me?.user?.affiliations || []).find(
            (a: { institutionSlug?: string }) => a.institutionSlug === ctx.institutionSlug,
          );
          institutionName = aff?.institutionName || null;
        }
      } catch {
        /* personal / InTelleX default */
      }

      const res = await fetch('/api/learn/mentor/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          bio,
          expertise,
          priceXAF,
          sessionMinutes,
          slots,
          resumeUrl: resumeDriveUrl.trim(),
          resumeSource: 'google_drive',
          institutionSlug,
          institutionName,
          idFrontUrl: front.url,
          idBackUrl: back.url,
          introVideoUrl: video.url,
          introVideoBytes: video.bytes,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(
          data.error === 'missing_documents'
            ? 'Documents are required before submission.'
            : data.error === 'missing_fields'
              ? 'Please complete every step before submitting.'
              : data.error === 'invalid_resume_url'
                ? 'CV must be a public Google Drive or Docs share link.'
                : data.error === 'invalid_document_url'
                  ? 'A document URL was invalid. Re-upload your files and try again.'
                  : data.error === 'db_unavailable'
                    ? 'Could not save your application right now. Try again shortly.'
                    : 'Could not submit your application. Please try again.',
        );
        return;
      }
      setSubmitted(true);
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

  if (checking) {
    return (
      <div className="flex justify-center py-24" style={{ color: 'var(--ink-soft)' }}>
        <Loader2 className="animate-spin" size={22} />
      </div>
    );
  }

  if (submitted) {
    const openRequest =
      pendingApp?.documentRequest?.status === 'open' &&
      Array.isArray(pendingApp.documentRequest.items) &&
      pendingApp.documentRequest.items.length > 0;

    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-[720px] border-t pt-10"
        style={{ borderColor: 'var(--line)' }}
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: 'var(--ink-soft)' }}>
          Instructor application
        </p>
        <h1 className="mt-2 font-display text-[32px] leading-[0.95] tracking-tight">
          {openRequest ? 'Updates requested' : 'Under review'}
        </h1>
        <p className="mt-3 max-w-md text-[15px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
          {openRequest
            ? 'Admins need specific documents again. Use the portal below — only the listed items.'
            : 'Your CV, ID, and intro video are with InTelleX admins. Mentor Studio unlocks only after approval.'}
        </p>

        {openRequest && pendingApp && (
          <MentorRevisionPortal
            application={pendingApp}
            onDone={(app) => {
              setPendingApp(app);
            }}
          />
        )}

        <button
          type="button"
          onClick={() => router.push('/dashboard')}
          className="mt-8 inline-flex items-center gap-2 px-5 py-2.5 text-[13.5px] font-semibold text-white"
          style={{ background: 'var(--green)' }}
        >
          Back to dashboard
        </button>
      </motion.div>
    );
  }

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="mx-auto max-w-[720px] overflow-x-hidden">
      <header className="mb-8 border-b pb-8" style={{ borderColor: 'var(--line)' }}>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: 'var(--ink-soft)' }}>
          Instructor studio · Onboarding
        </p>
        <h1 className="mt-2 font-display text-[32px] leading-[0.95] tracking-tight sm:text-[40px]">
          Apply to mentor
        </h1>
        <p className="mt-3 max-w-md text-[15px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
          Complete profile, documents, and a 30–60 second intro. Access unlocks after InTelleX admin approval.
        </p>
      </header>

      {/* Step rail */}
      <div className="mb-8">
        <div className="mb-3 h-1 overflow-hidden" style={{ background: 'var(--paper-dim)' }}>
          <motion.div
            className="h-full"
            style={{ background: 'var(--green-deep)' }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          />
        </div>
        <div className="flex gap-4 overflow-x-auto pb-1">
          {STEPS.map((s, i) => {
            const active = i === step;
            const done = i < step;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  if (i <= step) go(i);
                }}
                className="shrink-0 text-left"
              >
                <span
                  className="font-mono text-[10px] uppercase tracking-[0.14em]"
                  style={{ color: active || done ? 'var(--green-deep)' : 'var(--ink-soft)' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  className="mt-0.5 block text-[13px] font-semibold"
                  style={{
                    color: active ? 'var(--ink)' : done ? 'var(--green-deep)' : 'var(--ink-soft)',
                    borderBottom: active ? '1px solid var(--ink)' : '1px solid transparent',
                  }}
                >
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative min-h-[420px] border-t pt-6" style={{ borderColor: 'var(--line)' }}>
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            initial={{ opacity: 0, x: dir * 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -32 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          >
            {step === 0 && (
              <section className="space-y-5">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: 'var(--ink-soft)' }}>
                    Step 01
                  </p>
                  <h2 className="font-display text-[22px]">Your mentoring profile</h2>
                </div>
                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold">Professional title</label>
                  <input
                    className="form-input !rounded-none"
                    placeholder="e.g. Senior Backend Engineer"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold">Bio</label>
                  <textarea
                    className="form-input !rounded-none"
                    rows={3}
                    placeholder="What have you built? What can you help students achieve?"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold">Skills (up to 6)</label>
                  <div className="flex gap-2">
                    <input
                      className="form-input !rounded-none"
                      placeholder="e.g. Node.js"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSkill();
                        }
                      }}
                    />
                    <button type="button" onClick={addSkill} className="btn btn-ghost !rounded-none !px-4 !py-2">
                      <Plus size={15} />
                    </button>
                  </div>
                  {expertise.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {expertise.map((s) => (
                        <span
                          key={s}
                          className="flex items-center gap-1.5 border px-3 py-1.5 text-[12.5px] font-medium"
                          style={{ borderColor: 'var(--line)', color: 'var(--green-deep)' }}
                        >
                          {s}
                          <button type="button" onClick={() => setExpertise(expertise.filter((x) => x !== s))}>
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            )}

            {step === 1 && (
              <section className="space-y-5">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: 'var(--ink-soft)' }}>
                    Step 02
                  </p>
                  <h2 className="font-display text-[22px]">Pricing & availability</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-[13px] font-semibold">Session price (XAF)</label>
                    <input
                      type="number"
                      min={0}
                      step={500}
                      className="form-input !rounded-none"
                      value={priceXAF}
                      onChange={(e) => setPriceXAF(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[13px] font-semibold">Session length</label>
                    <select
                      className="form-input !rounded-none"
                      value={sessionMinutes}
                      onChange={(e) => setSessionMinutes(Number(e.target.value))}
                    >
                      <option value={30}>30 minutes</option>
                      <option value={45}>45 minutes</option>
                      <option value={60}>60 minutes</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold">Weekly availability</label>
                  <div className="space-y-2">
                    {slots.map((slot, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <select
                          className="form-input !rounded-none"
                          value={slot.dayOffset}
                          onChange={(e) => {
                            const copy = [...slots];
                            copy[i] = { ...copy[i], dayOffset: Number(e.target.value) };
                            setSlots(copy);
                          }}
                        >
                          {DAYS.map((d, di) => (
                            <option key={d} value={di}>
                              {d}
                            </option>
                          ))}
                        </select>
                        <input
                          type="time"
                          className="form-input !rounded-none"
                          value={slot.time}
                          onChange={(e) => {
                            const copy = [...slots];
                            copy[i] = { ...copy[i], time: e.target.value };
                            setSlots(copy);
                          }}
                        />
                        {slots.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setSlots(slots.filter((_, si) => si !== i))}
                            className="flex h-9 w-9 shrink-0 items-center justify-center border"
                            style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  {slots.length < 10 && (
                    <button
                      type="button"
                      onClick={() => setSlots([...slots, { dayOffset: 2, time: '18:00' }])}
                      className="mt-2 flex items-center gap-1.5 text-[13px] font-semibold"
                      style={{ color: 'var(--green-deep)' }}
                    >
                      <Plus size={13} /> Add slot
                    </button>
                  )}
                </div>
              </section>
            )}

            {step === 2 && (
              <section className="space-y-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: 'var(--ink-soft)' }}>
                    Step 03
                  </p>
                  <h2 className="font-display text-[22px]">Share your CV on Google Drive</h2>
                </div>
                <p className="text-[14px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                  Upload your CV to Google Drive, set sharing to{' '}
                  <strong style={{ color: 'var(--ink)' }}>Anyone with the link (Viewer)</strong>, then paste
                  the link below. Admins open it inside InTelleX — no file upload needed.
                </p>
                <ol className="space-y-1.5 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                  <li>1. Open Drive and upload your PDF/Doc.</li>
                  <li>2. Right-click → Share → Anyone with the link → Viewer.</li>
                  <li>3. Copy link and paste it here.</li>
                </ol>
                <a
                  href="https://drive.google.com/drive/my-drive"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex text-[13px] font-semibold"
                  style={{ color: 'var(--green-deep)' }}
                >
                  Open Google Drive →
                </a>
                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold">Public Google Drive / Docs link</label>
                  <input
                    className="form-input !rounded-none"
                    placeholder="https://drive.google.com/file/d/…/view?usp=sharing"
                    value={resumeDriveUrl}
                    onChange={(e) => setResumeDriveUrl(e.target.value)}
                  />
                </div>
              </section>
            )}

            {step === 3 && (
              <section className="space-y-5">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: 'var(--ink-soft)' }}>
                    Step 04
                  </p>
                  <h2 className="font-display text-[22px]">Government ID</h2>
                </div>
                <p className="text-[14px]" style={{ color: 'var(--ink-soft)' }}>
                  Front and back of your national ID or passport bio page. Up to 10 MB each.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FileDrop
                    accept="image/*"
                    label="ID front"
                    file={idFront}
                    onFile={setIdFront}
                    preview
                    optimize="id"
                    onError={setError}
                  />
                  <FileDrop
                    accept="image/*"
                    label="ID back"
                    file={idBack}
                    onFile={setIdBack}
                    preview
                    optimize="id"
                    onError={setError}
                  />
                </div>
              </section>
            )}

            {step === 4 && (
              <section className="space-y-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: 'var(--ink-soft)' }}>
                    Step 05
                  </p>
                  <h2 className="font-display text-[22px]">Intro video (30–60s)</h2>
                </div>
                <IntroVideoRecorder
                  value={videoBlob}
                  onReady={(blob, sec) => {
                    setVideoBlob(blob);
                    setVideoSeconds(sec);
                  }}
                />
              </section>
            )}

            {step === 5 && (
              <section className="space-y-5">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: 'var(--ink-soft)' }}>
                    Step 06
                  </p>
                  <h2 className="font-display text-[22px]">Review & submit</h2>
                </div>
                <ul className="divide-y border-y" style={{ borderColor: 'var(--line)' }}>
                  <ReviewRow label="Title" value={title} />
                  <ReviewRow label="Skills" value={expertise.join(', ')} />
                  <ReviewRow label="Price" value={`${priceXAF.toLocaleString()} XAF · ${sessionMinutes} min`} />
                  <ReviewRow
                    label="CV"
                    value={resumeDriveUrl.trim() ? 'Google Drive link ready' : '-'}
                  />
                  <ReviewRow label="ID" value={idFront && idBack ? 'Front + back attached' : '-'} />
                  <ReviewRow
                    label="Intro video"
                    value={videoBlob ? `${videoSeconds}s · ${fmtBytes(videoBlob.size)}` : '-'}
                  />
                </ul>
                <p className="border-l-2 pl-4 text-[13.5px] leading-relaxed" style={{ borderColor: 'var(--green)', color: 'var(--ink-soft)' }}>
                  Submitting sends your application to InTelleX admins. You become a mentor only after they approve.
                </p>
                {busy && (
                  <div>
                    <div className="mb-1.5 flex justify-between text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
                      <span>{uploadLabel}</span>
                      <span>{uploadPct}%</span>
                    </div>
                    <div className="h-1 overflow-hidden" style={{ background: 'var(--paper-dim)' }}>
                      <div className="h-full transition-all" style={{ width: `${uploadPct}%`, background: 'var(--green-deep)' }} />
                    </div>
                  </div>
                )}
              </section>
            )}
          </motion.div>
        </AnimatePresence>

        {error && (
          <p
            className="mt-5 border px-4 py-3 text-[13px]"
            style={{ borderColor: 'rgba(196,98,42,0.35)', background: 'rgba(196,98,42,0.08)', color: '#a14d18' }}
          >
            {error}
          </p>
        )}

        <div className="mt-8 flex items-center justify-between gap-3 border-t pt-6" style={{ borderColor: 'var(--line)' }}>
          <button
            type="button"
            onClick={back}
            disabled={step === 0 || busy}
            className="btn btn-ghost !rounded-none !py-2.5 text-[13.5px] disabled:opacity-40"
          >
            <ChevronLeft size={16} /> Back
          </button>
          {step < STEPS.length - 1 ? (
            <button type="button" onClick={next} className="btn btn-primary !rounded-none !py-2.5 text-[13.5px]">
              Continue <ChevronRight size={16} />
            </button>
          ) : (
            <button type="button" onClick={submit} disabled={busy} className="btn btn-primary !rounded-none !py-2.5 text-[13.5px]">
              {busy ? <Loader2 size={16} className="animate-spin" /> : <GraduationCap size={16} />}
              Submit for admin review
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex gap-3 py-3 text-[14px]">
      <span className="w-28 shrink-0 font-mono text-[11px] uppercase tracking-[0.12em]" style={{ color: 'var(--ink-soft)' }}>
        {label}
      </span>
      <span className="font-medium">{value}</span>
    </li>
  );
}

function FileDrop({
  accept,
  label,
  file,
  onFile,
  preview,
  optimize,
  onError,
}: {
  accept: string;
  label: string;
  file: File | null;
  onFile: (f: File | null) => void;
  preview?: boolean;
  optimize?: 'id' | 'resume';
  onError?: (msg: string) => void;
}) {
  const [hover, setHover] = useState(false);
  const [busy, setBusy] = useState(false);
  const [thumb, setThumb] = useState<string | null>(null);

  useEffect(() => {
    if (!preview || !file || !file.type.startsWith('image/')) {
      setThumb(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setThumb(url);
    return () => URL.revokeObjectURL(url);
  }, [file, preview]);

  async function takeFile(raw: File | null) {
    if (!raw) {
      onFile(null);
      return;
    }
    if (raw.size > MAX_MENTOR_DOC_BYTES) {
      onError?.('File must be 10 MB or smaller.');
      return;
    }
    onError?.('');
    if (!optimize) {
      onFile(raw);
      return;
    }
    setBusy(true);
    try {
      const prepared = await prepareMentorDocForUpload(raw, optimize);
      onFile(prepared);
    } catch (err) {
      if (err instanceof Error && err.message === 'file_too_large') {
        onError?.('File must be 10 MB or smaller.');
      } else {
        onFile(raw);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <label
      className="flex cursor-pointer flex-col items-center justify-center gap-2 border border-dashed px-4 py-8 text-center transition-colors"
      style={{
        borderColor: hover ? 'var(--green-deep)' : 'var(--line)',
        background: hover ? 'rgba(0,179,105,0.04)' : 'transparent',
        minHeight: 160,
        opacity: busy ? 0.7 : 1,
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setHover(true);
      }}
      onDragLeave={() => setHover(false)}
      onDrop={(e) => {
        e.preventDefault();
        setHover(false);
        void takeFile(e.dataTransfer.files?.[0] ?? null);
      }}
    >
      {busy ? (
        <Loader2 size={22} className="animate-spin" style={{ color: 'var(--green-deep)' }} />
      ) : thumb ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={thumb} alt="" className="mb-2 max-h-28 object-contain" />
      ) : (
        <Upload size={22} style={{ color: 'var(--green-deep)' }} />
      )}
      <span className="text-[13.5px] font-semibold">{file ? file.name : label}</span>
      {file && (
        <span className="text-[12px]" style={{ color: 'var(--ink-soft)' }}>
          {fmtBytes(file.size)} · tap to replace
        </span>
      )}
      <input
        type="file"
        accept={accept}
        className="hidden"
        disabled={busy}
        onChange={(e) => {
          void takeFile(e.target.files?.[0] ?? null);
          e.target.value = '';
        }}
      />
    </label>
  );
}
