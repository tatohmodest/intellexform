'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Loader2, LogOut, Save } from 'lucide-react';

export default function SettingsForm({
  initialName,
  initialWeeklyGoal,
}: {
  initialName: string;
  initialWeeklyGoal: number;
}) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [goal, setGoal] = useState(initialWeeklyGoal);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setBusy(true);
    setSaved(false);
    try {
      const res = await fetch('/api/learn/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, weeklyGoalMinutes: goal }),
      });
      if (res.ok) {
        setSaved(true);
        router.refresh();
      }
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
    <div className="space-y-8">
      <section className="rounded-2xl border p-6" style={{ borderColor: 'var(--line)' }}>
        <h2 className="mb-5 font-display text-[19px]">Profile</h2>
        <label className="mb-1.5 block text-[13px] font-semibold">Display name</label>
        <input
          className="form-input mb-5 max-w-sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label className="mb-1.5 block text-[13px] font-semibold">
          Weekly learning goal
        </label>
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
          We use this to pace your recommendations and streak reminders.
        </p>
        <button onClick={save} disabled={busy} className="btn btn-primary !px-6 !py-2.5 text-[13.5px]">
          {busy ? (
            <Loader2 size={15} className="animate-spin" />
          ) : saved ? (
            <CheckCircle2 size={15} />
          ) : (
            <Save size={15} />
          )}
          {saved ? 'Saved' : 'Save changes'}
        </button>
      </section>

      <section
        className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border p-6"
        style={{ borderColor: 'var(--line)' }}
      >
        <div>
          <h2 className="font-display text-[19px]">Sign out</h2>
          <p className="mt-1 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
            You&apos;ll stay signed in to LoopingBinary - this only ends your Intellex session.
          </p>
        </div>
        <button onClick={logout} className="btn btn-ghost !px-6 !py-2.5 text-[13.5px]">
          <LogOut size={15} /> Sign out
        </button>
      </section>
    </div>
  );
}
