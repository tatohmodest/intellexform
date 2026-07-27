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
import { INTRO_VIDEO_MAX_SECONDS, INTRO_VIDEO_MIN_SECONDS } from '@/lib/learn/compressVideo';
import { uploadMentorAsset } from '@/lib/learn/mentorUpload';

const DAYS = ['Today', 'Tomorrow', 'In 2 days', 'In 3 days', 'In 4 days', 'In 5 days', 'In 6 days'];

const STEPS = [
  { id: 'profile', label: 'Profile', icon: GraduationCap },
  { id: 'schedule', label: 'Schedule', icon: CheckCircle2 },
  { id: 'resume', label: 'CV / Resume', icon: FileText },
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

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [idFront, setIdFront] = useState<File | null>(null);
  const [idBack, setIdBack] = useState<File | null>(null);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [videoSeconds, setVideoSeconds] = useState(0);

  const [busy, setBusy] = useState(false);
  const [uploadPct, setUploadPct] = useState(0);
  const [uploadLabel, setUploadLabel] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch('/api/learn/mentor/application')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.application) setSubmitted(true);
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
      if (!resumeFile) return 'Upload your CV or resume (PDF or DOC).';
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
    if (!resumeFile || !idFront || !idBack || !videoBlob) return;

    setBusy(true);
    setError('');
    setUploadPct(0);
    try {
      setUploadLabel('Uploading CV…');
      const resume = await uploadMentorAsset('resume', resumeFile, resumeFile.name, setUploadPct);

      setUploadLabel('Uploading ID (front)…');
      setUploadPct(0);
      const front = await uploadMentorAsset('id_front', idFront, idFront.name, setUploadPct);

      setUploadLabel('Uploading ID (back)…');
      setUploadPct(0);
      const back = await uploadMentorAsset('id_back', idBack, idBack.name, setUploadPct);

      setUploadLabel('Uploading intro video…');
      setUploadPct(0);
      const videoExt = videoBlob.type.includes('mp4') ? 'mp4' : 'webm';
      const video = await uploadMentorAsset(
        'intro_video',
        videoBlob,
        `intro-${Date.now()}.${videoExt}`,
        setUploadPct,
      );
      if (!video.url) {
        throw new Error('video_upload_empty');
      }

      setUploadLabel('Submitting application…');
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
          resumeUrl: resume.url,
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
              : 'Could not submit your application. Please try again.',
        );
        return;
      }
      setSubmitted(true);
    } catch {
      setError('Upload failed. Check your connection and try again.');
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
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-[560px] rounded-3xl border px-6 py-12 text-center"
        style={{ borderColor: 'var(--line)' }}
      >
        <GraduationCap className="mx-auto mb-4" size={32} style={{ color: 'var(--green-deep)' }} />
        <h1 className="font-display text-[24px]">Application under review</h1>
        <p className="mx-auto mt-2 max-w-md text-[14.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
          Thanks - your CV, ID, and intro video are with InTelleX admins.
          Mentor Studio unlocks only after approval. Nothing important is toggled on by accident.
        </p>
        <button type="button" onClick={() => router.push('/dashboard')} className="btn btn-primary mt-6 !py-2.5 text-[13.5px]">
          Back to dashboard
        </button>
      </motion.div>
    );
  }

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="mx-auto max-w-[720px]">
      <div className="mb-8 text-center">
        <span
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl"
          style={{ background: 'rgba(0,179,105,0.12)', color: 'var(--green-deep)' }}
        >
          <GraduationCap size={30} />
        </span>
        <h1 className="font-display text-[28px] leading-tight">Apply to mentor</h1>
        <p className="mx-auto mt-2 max-w-md text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
          Mentorship is a privilege. Complete this short onboarding - profile, documents, and a
          30–60 second intro - then wait for InTelleX admin approval.
        </p>
      </div>

      {/* Step rail */}
      <div className="mb-6">
        <div className="mb-3 h-1.5 overflow-hidden rounded-full" style={{ background: 'var(--paper-dim)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'var(--green-deep)' }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          />
        </div>
        <div className="flex gap-1 overflow-x-auto pb-1">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const active = i === step;
            const done = i < step;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  if (i <= step) go(i);
                }}
                className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors"
                style={{
                  background: active
                    ? 'rgba(0,179,105,0.14)'
                    : done
                      ? 'rgba(0,179,105,0.06)'
                      : 'transparent',
                  color: active || done ? 'var(--green-deep)' : 'var(--ink-soft)',
                }}
              >
                <Icon size={12} />
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      <div
        className="relative overflow-hidden rounded-3xl border p-6 sm:p-8"
        style={{ borderColor: 'var(--line)', minHeight: 420 }}
      >
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            initial={{ opacity: 0, x: dir * 48 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -48 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          >
            {step === 0 && (
              <div className="space-y-5">
                <h2 className="font-display text-[22px]">Your mentoring profile</h2>
                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold">Professional title</label>
                  <input
                    className="form-input"
                    placeholder="e.g. Senior Backend Engineer"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold">Bio</label>
                  <textarea
                    className="form-input"
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
                      className="form-input"
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
                    <button type="button" onClick={addSkill} className="btn btn-ghost !px-4 !py-2">
                      <Plus size={15} />
                    </button>
                  </div>
                  {expertise.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {expertise.map((s) => (
                        <span
                          key={s}
                          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-medium"
                          style={{ background: 'rgba(0,179,105,0.1)', color: 'var(--green-deep)' }}
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
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <h2 className="font-display text-[22px]">Pricing & availability</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-[13px] font-semibold">Session price (XAF)</label>
                    <input
                      type="number"
                      min={0}
                      step={500}
                      className="form-input"
                      value={priceXAF}
                      onChange={(e) => setPriceXAF(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[13px] font-semibold">Session length</label>
                    <select
                      className="form-input"
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
                          className="form-input"
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
                          className="form-input"
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
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border"
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
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="font-display text-[22px]">Upload your CV or resume</h2>
                <p className="text-[14px]" style={{ color: 'var(--ink-soft)' }}>
                  PDF preferred. Admins review this before granting tutor access.
                </p>
                <FileDrop
                  accept=".pdf,.doc,.docx,application/pdf"
                  label="Drop CV here or browse"
                  file={resumeFile}
                  onFile={setResumeFile}
                />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <h2 className="font-display text-[22px]">Government ID</h2>
                <p className="text-[14px]" style={{ color: 'var(--ink-soft)' }}>
                  Upload clear photos of the front and back of your national ID or passport bio page.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FileDrop
                    accept="image/*"
                    label="ID front"
                    file={idFront}
                    onFile={setIdFront}
                    preview
                  />
                  <FileDrop
                    accept="image/*"
                    label="ID back"
                    file={idBack}
                    onFile={setIdBack}
                    preview
                  />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <h2 className="font-display text-[22px]">Intro video (30–60s)</h2>
                <IntroVideoRecorder
                  value={videoBlob}
                  onReady={(blob, sec) => {
                    setVideoBlob(blob);
                    setVideoSeconds(sec);
                  }}
                />
              </div>
            )}

            {step === 5 && (
              <div className="space-y-5">
                <h2 className="font-display text-[22px]">Review & submit</h2>
                <ul className="space-y-3 text-[14px]">
                  <ReviewRow label="Title" value={title} />
                  <ReviewRow label="Skills" value={expertise.join(', ')} />
                  <ReviewRow label="Price" value={`${priceXAF.toLocaleString()} XAF · ${sessionMinutes} min`} />
                  <ReviewRow label="CV" value={resumeFile ? `${resumeFile.name} (${fmtBytes(resumeFile.size)})` : '-'} />
                  <ReviewRow label="ID" value={idFront && idBack ? 'Front + back attached' : '-'} />
                  <ReviewRow
                    label="Intro video"
                    value={
                      videoBlob
                        ? `${videoSeconds}s · ${fmtBytes(videoBlob.size)}`
                        : '-'
                    }
                  />
                </ul>
                <p className="rounded-2xl px-4 py-3 text-[13.5px] leading-relaxed" style={{ background: 'rgba(0,179,105,0.08)', color: 'var(--green-deep)' }}>
                  Submitting sends your application to InTelleX admins. You become a mentor only after they approve.
                </p>
                {busy && (
                  <div>
                    <div className="mb-1.5 flex justify-between text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
                      <span>{uploadLabel}</span>
                      <span>{uploadPct}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full" style={{ background: 'var(--paper-dim)' }}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${uploadPct}%`, background: 'var(--green-deep)' }} />
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {error && (
          <p className="mt-5 rounded-xl px-4 py-3 text-[13px]" style={{ background: 'rgba(196,98,42,0.08)', color: '#a14d18' }}>
            {error}
          </p>
        )}

        <div className="mt-8 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={back}
            disabled={step === 0 || busy}
            className="btn btn-ghost !py-2.5 text-[13.5px] disabled:opacity-40"
          >
            <ChevronLeft size={16} /> Back
          </button>
          {step < STEPS.length - 1 ? (
            <button type="button" onClick={next} className="btn btn-primary !py-2.5 text-[13.5px]">
              Continue <ChevronRight size={16} />
            </button>
          ) : (
            <button type="button" onClick={submit} disabled={busy} className="btn btn-primary !py-2.5 text-[13.5px]">
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
    <li className="flex gap-3 border-b pb-3" style={{ borderColor: 'var(--line)' }}>
      <span className="w-28 shrink-0 text-[12.5px] font-semibold uppercase tracking-wide" style={{ color: 'var(--ink-soft)' }}>
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
}: {
  accept: string;
  label: string;
  file: File | null;
  onFile: (f: File | null) => void;
  preview?: boolean;
}) {
  const [hover, setHover] = useState(false);
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

  return (
    <label
      className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed px-4 py-8 text-center transition-colors"
      style={{
        borderColor: hover ? 'var(--green-deep)' : 'var(--line)',
        background: hover ? 'rgba(0,179,105,0.04)' : 'transparent',
        minHeight: 160,
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setHover(true);
      }}
      onDragLeave={() => setHover(false)}
      onDrop={(e) => {
        e.preventDefault();
        setHover(false);
        const f = e.dataTransfer.files?.[0];
        if (f) onFile(f);
      }}
    >
      {thumb ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={thumb} alt="" className="mb-2 max-h-28 rounded-lg object-contain" />
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
        onChange={(e) => onFile(e.target.files?.[0] ?? null)}
      />
    </label>
  );
}
