'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  ImagePlus,
  Loader2,
  Plus,
  Save,
  Video,
  X,
} from 'lucide-react';
import type { MentorProfileDoc } from '@/lib/learn/ecosystem';
import IntroVideoRecorder from '@/components/dashboard/IntroVideoRecorder';
import { uploadMediaAsset } from '@/lib/learn/mentorUpload';

const DAYS = ['Today', 'Tomorrow', 'In 2 days', 'In 3 days', 'In 4 days', 'In 5 days', 'In 6 days'];

export default function MentorProfileForm({ profile }: { profile: MentorProfileDoc }) {
  const router = useRouter();
  const [title, setTitle] = useState(profile.title);
  const [bio, setBio] = useState(profile.bio);
  const [expertise, setExpertise] = useState(profile.expertise);
  const [skillInput, setSkillInput] = useState('');
  const [priceXAF, setPriceXAF] = useState(profile.priceXAF);
  const [sessionMinutes, setSessionMinutes] = useState(profile.sessionMinutes);
  const [slots, setSlots] = useState(profile.slots);
  const [active, setActive] = useState(profile.active);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl || '');
  const [introVideoUrl, setIntroVideoUrl] = useState(profile.introVideoUrl || '');
  const [photoBusy, setPhotoBusy] = useState(false);
  const [videoBusy, setVideoBusy] = useState(false);
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  async function uploadPhoto(file: File) {
    setPhotoBusy(true);
    setError('');
    try {
      const uploaded = await uploadMediaAsset('avatar', file, file.name);
      setAvatarUrl(uploaded.url);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Photo upload failed';
      setError(msg === 'file_too_large' ? 'Photo must be 10 MB or smaller.' : msg);
    } finally {
      setPhotoBusy(false);
    }
  }

  async function uploadIntro(blob: Blob) {
    setVideoBusy(true);
    setError('');
    try {
      const ext = blob.type.includes('mp4') ? 'mp4' : 'webm';
      const uploaded = await uploadMediaAsset(
        'intro_video',
        blob,
        `intro-${Date.now()}.${ext}`,
      );
      setIntroVideoUrl(uploaded.url);
      setRecording(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Video upload failed');
    } finally {
      setVideoBusy(false);
    }
  }

  async function save() {
    setBusy(true);
    setSaved(false);
    try {
      const res = await fetch('/api/learn/mentor/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          bio,
          expertise,
          priceXAF,
          sessionMinutes,
          slots,
          active,
          avatarUrl: avatarUrl || null,
          introVideoUrl: introVideoUrl || null,
        }),
      });
      if (res.ok) {
        setSaved(true);
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-[640px]">
      <Link href="/dashboard/mentor" className="mb-6 inline-flex items-center gap-1.5 text-[13.5px] font-semibold" style={{ color: 'var(--ink-soft)' }}>
        <ArrowLeft size={14} /> Mentor Studio
      </Link>
      <h1 className="mb-6 font-display text-[26px]">Mentor profile & availability</h1>

      <div className="space-y-5 rounded-3xl border p-6 sm:p-8" style={{ borderColor: 'var(--line)' }}>
        {/* Photo */}
        <div>
          <label className="mb-1.5 block text-[13px] font-semibold">Profile photo</label>
          <div className="flex flex-wrap items-center gap-4">
            <span
              className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full"
              style={{ background: 'var(--paper-dim)' }}
            >
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <ImagePlus size={20} style={{ color: 'var(--ink-soft)' }} />
              )}
              {photoBusy && (
                <span className="absolute inset-0 flex items-center justify-center bg-white/70">
                  <Loader2 size={16} className="animate-spin" />
                </span>
              )}
            </span>
            <div>
              <label
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border px-3.5 py-2 text-[13px] font-semibold"
                style={{ borderColor: 'var(--line)' }}
              >
                <ImagePlus size={14} /> {avatarUrl ? 'Replace photo' : 'Upload photo'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    e.target.value = '';
                    if (f) uploadPhoto(f);
                  }}
                />
              </label>
              <p className="mt-1.5 text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
                Students see this in the instructor directory.
              </p>
            </div>
          </div>
        </div>

        {/* Intro video */}
        <div>
          <label className="mb-1.5 block text-[13px] font-semibold">
            Intro video
          </label>
          <p className="mb-2 text-[12.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
            A short clip explaining who you are and what you teach. Students watch it on your
            profile before booking.
          </p>
          {introVideoUrl && !recording && (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <video
              src={introVideoUrl}
              controls
              className="mb-2 w-full max-w-[360px] rounded-xl"
              style={{ background: '#0C1116' }}
            />
          )}
          {recording ? (
            <div className="space-y-3">
              <IntroVideoRecorder
                value={null}
                onReady={(blob) => {
                  if (blob) uploadIntro(blob);
                }}
              />
              <button
                type="button"
                onClick={() => setRecording(false)}
                className="text-[12.5px] font-semibold"
                style={{ color: 'var(--ink-soft)' }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setRecording(true)}
                className="inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[13px] font-semibold"
                style={{ borderColor: 'var(--line)' }}
              >
                <Video size={14} /> {introVideoUrl ? 'Record again' : 'Record intro'}
              </button>
              <label
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border px-3.5 py-2 text-[13px] font-semibold"
                style={{ borderColor: 'var(--line)' }}
              >
                {videoBusy ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                Upload a clip
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    e.target.value = '';
                    if (f) uploadIntro(f);
                  }}
                />
              </label>
              {introVideoUrl && (
                <button
                  type="button"
                  onClick={() => setIntroVideoUrl('')}
                  className="text-[12.5px] font-semibold"
                  style={{ color: 'var(--ink-soft)' }}
                >
                  Remove
                </button>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-[13px] font-semibold">Professional title</label>
          <input className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label className="mb-1.5 block text-[13px] font-semibold">Bio</label>
          <textarea className="form-input" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>
        <div>
          <label className="mb-1.5 block text-[13px] font-semibold">Skills</label>
          <div className="flex gap-2">
            <input
              className="form-input"
              value={skillInput}
              placeholder="Add a skill"
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const s = skillInput.trim();
                  if (s && !expertise.includes(s) && expertise.length < 6) setExpertise([...expertise, s]);
                  setSkillInput('');
                }
              }}
            />
          </div>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {expertise.map((s) => (
              <span key={s} className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-medium" style={{ background: 'rgba(0,179,105,0.1)', color: 'var(--green-deep)' }}>
                {s}
                <button onClick={() => setExpertise(expertise.filter((x) => x !== s))}>
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold">Session price (XAF)</label>
            <input type="number" min={0} step={500} className="form-input" value={priceXAF} onChange={(e) => setPriceXAF(Number(e.target.value))} />
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold">Session length</label>
            <select className="form-input" value={sessionMinutes} onChange={(e) => setSessionMinutes(Number(e.target.value))}>
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>60 minutes</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-[13px] font-semibold">Availability calendar</label>
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
                    <option key={d} value={di}>{d}</option>
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
              onClick={() => setSlots([...slots, { dayOffset: 2, time: '18:00' }])}
              className="mt-2 flex items-center gap-1.5 text-[13px] font-semibold"
              style={{ color: 'var(--green-deep)' }}
            >
              <Plus size={13} /> Add slot
            </button>
          )}
        </div>

        <label className="flex items-center gap-2.5 text-[13.5px]">
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="h-4 w-4 accent-[#00b369]" />
          Listed in the mentorship directory (students can book me)
        </label>

        {error && (
          <p className="text-[13px]" style={{ color: '#b91c1c' }}>
            {error}
          </p>
        )}

        <button onClick={save} disabled={busy} className="btn btn-primary w-full !py-3.5 text-[14px]">
          {busy ? <Loader2 size={16} className="animate-spin" /> : saved ? <CheckCircle2 size={16} /> : <Save size={16} />}
          {saved ? 'Saved' : 'Save profile'}
        </button>
      </div>
    </div>
  );
}
