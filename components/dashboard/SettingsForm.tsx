'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Loader2, LogOut, Save, Upload } from 'lucide-react';
import { uploadMediaAsset } from '@/lib/mediaUpload';
import { MAX_IMAGE_UPLOAD_BYTES } from '@/lib/compressImage';
import { INTERESTS } from '@/lib/learn/interests';
import { PushAlertsSettings } from '@/components/dashboard/PushAlertsBanner';

type Prefs = {
  locale: string;
  emailNotifications: boolean;
  sessionReminders: boolean;
  reducedMotion: boolean;
  marketingEmails: boolean;
  notifyAcademic: boolean;
  notifySocial: boolean;
  notifyInstitution: boolean;
  notifySystem: boolean;
};

export default function SettingsForm({
  initialName,
  initialWeeklyGoal,
  initialAvatar,
  initialPreferences,
}: {
  initialName: string;
  initialWeeklyGoal: number;
  initialAvatar?: string | null;
  initialPreferences?: (Partial<Prefs> & { interests?: string[] }) | null;
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(initialName);
  const [goal, setGoal] = useState(initialWeeklyGoal);
  const [avatar, setAvatar] = useState(initialAvatar || '');
  const [prefs, setPrefs] = useState<Prefs>({
    locale: initialPreferences?.locale || 'en',
    emailNotifications: initialPreferences?.emailNotifications ?? true,
    sessionReminders: initialPreferences?.sessionReminders ?? true,
    reducedMotion: initialPreferences?.reducedMotion ?? false,
    marketingEmails: initialPreferences?.marketingEmails ?? false,
    notifyAcademic: initialPreferences?.notifyAcademic ?? true,
    notifySocial: initialPreferences?.notifySocial ?? true,
    notifyInstitution: initialPreferences?.notifyInstitution ?? true,
    notifySystem: initialPreferences?.notifySystem ?? true,
  });
  const [interests, setInterests] = useState<string[]>(initialPreferences?.interests || []);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadPct, setUploadPct] = useState(0);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwBusy, setPwBusy] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState('');

  async function onPickAvatar(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Choose an image file (JPG, PNG, WebP).');
      return;
    }
    if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
      setError('Keep profile photos under 10MB. We compress them automatically.');
      return;
    }
    setUploading(true);
    setError('');
    setUploadPct(0);
    try {
      const uploaded = await uploadMediaAsset('avatar', file, file.name, setUploadPct);
      setAvatar(uploaded.url);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'upload_failed';
      setError(
        msg === 'upload_unavailable'
          ? 'Photo upload is not configured yet. Paste an image URL instead.'
          : 'Could not upload photo. Try again or paste a URL.',
      );
    } finally {
      setUploading(false);
      setUploadPct(0);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  async function save() {
    setBusy(true);
    setSaved(false);
    setError('');
    try {
      const res = await fetch('/api/learn/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          weeklyGoalMinutes: goal,
          avatar,
          preferences: {
            ...prefs,
            locale:
              typeof document !== 'undefined' ? document.documentElement.lang || prefs.locale : prefs.locale,
            interests,
          },
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          data.error === 'invalid_avatar'
            ? 'Use a Cloudinary / https image link for your photo.'
            : 'Could not save.',
        );
        return;
      }
      setSaved(true);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  }

  async function changePassword() {
    setPwBusy(true);
    setPwSaved(false);
    setPwError('');
    if (newPassword !== confirmPassword) {
      setPwError('New password and confirmation do not match.');
      setPwBusy(false);
      return;
    }
    try {
      const res = await fetch('/api/auth/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setPwError(data.error || 'Could not change password.');
        return;
      }
      setPwSaved(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } finally {
      setPwBusy(false);
    }
  }

  return (
    <div className="space-y-10">
      <section className="border-t pt-6" style={{ borderColor: 'var(--line)' }}>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: 'var(--ink-soft)' }}>
          Profile
        </p>
        <h2 className="mb-5 font-display text-[22px]">How you appear</h2>

        <div className="mb-6 flex flex-wrap items-center gap-5">
          <span
            className="relative flex h-20 w-20 items-center justify-center overflow-hidden border text-[22px] font-bold"
            style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}
          >
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar} alt="" className="h-full w-full object-cover" />
            ) : (
              (name || 'U').charAt(0).toUpperCase()
            )}
          </span>
          <div className="space-y-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => void onPickAvatar(e.target.files?.[0] ?? null)}
            />
            <button
              type="button"
              disabled={uploading}
              className="inline-flex items-center gap-2 border px-4 py-2 text-[13px] font-semibold"
              style={{ borderColor: 'var(--ink)' }}
              onClick={() => fileRef.current?.click()}
            >
              {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              {uploading ? `Uploading ${uploadPct}%` : 'Upload photo'}
            </button>
            <p className="text-[12px]" style={{ color: 'var(--ink-soft)' }}>
              Photos upload to Cloudinary (max 10MB) - we compress large files and store the
              generated link.
            </p>
          </div>
        </div>

        <label className="mb-1.5 block text-[13px] font-semibold">Photo URL (optional)</label>
        <input
          className="form-input mb-5 max-w-lg !rounded-none"
          value={avatar.startsWith('data:') ? '' : avatar}
          onChange={(e) => setAvatar(e.target.value.trim())}
          placeholder="https://…"
        />

        <label className="mb-1.5 block text-[13px] font-semibold">Display name</label>
        <input
          className="form-input mb-5 max-w-sm !rounded-none"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label className="mb-1.5 block text-[13px] font-semibold">Weekly learning goal</label>
        <div className="mb-2 flex max-w-sm items-center gap-4">
          <input
            type="range"
            min={30}
            max={900}
            step={30}
            value={goal}
            onChange={(e) => setGoal(Number(e.target.value))}
            className="flex-1 accent-[#00b369]"
          />
          <span className="w-24 text-right text-[13.5px] font-semibold">
            {Math.round((goal / 60) * 10) / 10} h/week
          </span>
        </div>
        <p className="mb-5 text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
          We use this to pace recommendations and streak reminders.
        </p>
      </section>

      <section className="border-t pt-6" style={{ borderColor: 'var(--line)' }}>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: 'var(--ink-soft)' }}>
          Preferences
        </p>
        <h2 className="mb-5 font-display text-[22px]">Customize your experience</h2>

        <p className="mb-5 text-[13px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
          The app follows your phone language (English or French).
        </p>

        <div className="space-y-3">
          {(
            [
              ['emailNotifications', 'Email notifications for campus news'],
              ['sessionReminders', 'Reminders before live mentorship sessions'],
              ['reducedMotion', 'Reduce motion in the dashboard'],
              ['marketingEmails', 'Product updates from InTelleX'],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex items-start gap-3 text-[14px]">
              <input
                type="checkbox"
                className="mt-1"
                checked={prefs[key]}
                onChange={(e) => setPrefs((p) => ({ ...p, [key]: e.target.checked }))}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>

        <h3 className="mb-3 mt-8 font-display text-[18px]">Interests</h3>
        <p className="mb-3 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
          Used to recommend courses, events, and resources on your home page.
        </p>
        <div className="mb-6 flex flex-wrap gap-2">
          {INTERESTS.map((item) => {
            const on = interests.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  setInterests((prev) =>
                    on ? prev.filter((x) => x !== item.id) : [...prev, item.id],
                  )
                }
                className="rounded-full border px-3 py-1.5 text-[12.5px] font-semibold"
                style={{
                  borderColor: on ? 'var(--ink)' : 'var(--line)',
                  background: on ? 'var(--ink)' : 'transparent',
                  color: on ? '#fff' : 'var(--ink)',
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <h3 className="mb-3 mt-8 font-display text-[18px]">Notification categories</h3>
        <p className="mb-3 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
          Mute categories you do not want in your inbox.
        </p>
        <div className="space-y-3">
          {(
            [
              ['notifyAcademic', 'Academic (assignments, exams, notes)'],
              ['notifySocial', 'Social (messages, badges, discussions)'],
              ['notifyInstitution', 'Institution announcements'],
              ['notifySystem', 'System alerts'],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex items-start gap-3 text-[14px]">
              <input
                type="checkbox"
                className="mt-1"
                checked={prefs[key]}
                onChange={(e) => setPrefs((p) => ({ ...p, [key]: e.target.checked }))}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
        <PushAlertsSettings />
      </section>

      <section className="border-t pt-6" style={{ borderColor: 'var(--line)' }}>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: 'var(--ink-soft)' }}>
          Security
        </p>
        <h2 className="mb-2 font-display text-[22px]">Change password</h2>
        <p className="mb-5 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
          Enter your current password, then the new one twice to confirm.
        </p>
        <label className="mb-1.5 block text-[13px] font-semibold">Current password</label>
        <input
          type="password"
          autoComplete="current-password"
          className="form-input mb-4 max-w-sm !rounded-none"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <label className="mb-1.5 block text-[13px] font-semibold">New password</label>
        <input
          type="password"
          autoComplete="new-password"
          className="form-input mb-4 max-w-sm !rounded-none"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="At least 8 characters"
        />
        <label className="mb-1.5 block text-[13px] font-semibold">Confirm new password</label>
        <input
          type="password"
          autoComplete="new-password"
          className="form-input mb-4 max-w-sm !rounded-none"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {pwError ? (
          <p className="mb-3 text-sm" style={{ color: '#b91c1c' }}>
            {pwError}
          </p>
        ) : null}
        {pwSaved ? (
          <p className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: 'var(--green-deep)' }}>
            <CheckCircle2 size={15} /> Password updated
          </p>
        ) : null}
        <div>
          <button
            type="button"
            onClick={() => void changePassword()}
            disabled={pwBusy || !currentPassword || !newPassword || !confirmPassword}
            className="inline-flex items-center gap-2 px-6 py-3 text-[13.5px] font-semibold text-white disabled:opacity-50"
            style={{ background: 'var(--green)' }}
          >
            {pwBusy ? <Loader2 size={15} className="animate-spin" /> : null}
            {pwBusy ? 'Updating…' : 'Update password'}
          </button>
        </div>
      </section>

      {error ? (
        <p className="text-sm" style={{ color: '#b91c1c' }}>
          {error}
        </p>
      ) : null}

      <button
        onClick={save}
        disabled={busy || uploading}
        className="inline-flex items-center gap-2 px-6 py-3 text-[13.5px] font-semibold text-white"
        style={{ background: 'var(--green)' }}
      >
        {busy ? (
          <Loader2 size={15} className="animate-spin" />
        ) : saved ? (
          <CheckCircle2 size={15} />
        ) : (
          <Save size={15} />
        )}
        {saved ? 'Saved' : 'Save changes'}
      </button>

      <section
        className="flex flex-wrap items-center justify-between gap-4 border-t pt-6"
        style={{ borderColor: 'var(--line)' }}
      >
        <div>
          <h2 className="font-display text-[19px]">Sign out</h2>
          <p className="mt-1 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
            You&apos;ll stay signed in to LoopingBinary - this only ends your InTelleX session.
          </p>
        </div>
        <button onClick={logout} className="btn btn-ghost !rounded-none !px-6 !py-2.5 text-[13.5px]">
          <LogOut size={15} /> Sign out
        </button>
      </section>
    </div>
  );
}
