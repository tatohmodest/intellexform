'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Loader2, LogOut, Save, Upload } from 'lucide-react';

type Prefs = {
  locale: string;
  emailNotifications: boolean;
  sessionReminders: boolean;
  reducedMotion: boolean;
  marketingEmails: boolean;
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
  initialPreferences?: Partial<Prefs> | null;
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
  });
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  async function onPickAvatar(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Choose an image file (JPG, PNG, WebP).');
      return;
    }
    if (file.size > 240_000) {
      setError('Keep profile photos under ~240KB for now.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || '');
      setAvatar(result);
      setError('');
    };
    reader.readAsDataURL(file);
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
          preferences: prefs,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error === 'invalid_avatar' ? 'Avatar too large or invalid.' : 'Could not save.');
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
              onChange={(e) => onPickAvatar(e.target.files?.[0] ?? null)}
            />
            <button
              type="button"
              className="inline-flex items-center gap-2 border px-4 py-2 text-[13px] font-semibold"
              style={{ borderColor: 'var(--ink)' }}
              onClick={() => fileRef.current?.click()}
            >
              <Upload size={14} /> Upload photo
            </button>
            <p className="text-[12px]" style={{ color: 'var(--ink-soft)' }}>
              Or paste an image URL below. JPG / PNG / WebP, keep it light.
            </p>
          </div>
        </div>

        <label className="mb-1.5 block text-[13px] font-semibold">Photo URL (optional)</label>
        <input
          className="form-input mb-5 max-w-lg !rounded-none"
          value={avatar.startsWith('data:') ? '' : avatar}
          onChange={(e) => setAvatar(e.target.value)}
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

        <label className="mb-1.5 block text-[13px] font-semibold">Language</label>
        <select
          className="form-input mb-5 max-w-xs !rounded-none"
          value={prefs.locale}
          onChange={(e) => setPrefs((p) => ({ ...p, locale: e.target.value }))}
        >
          <option value="en">English</option>
          <option value="fr">Français</option>
        </select>

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
      </section>

      {error ? (
        <p className="text-sm" style={{ color: '#b91c1c' }}>
          {error}
        </p>
      ) : null}

      <button
        onClick={save}
        disabled={busy}
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
