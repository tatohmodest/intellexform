'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save } from 'lucide-react';

export default function AcademicPrefsEditor({
  initialGpa,
  initialCreditsEarned,
  initialCreditsRequired,
  initialCohort,
}: {
  initialGpa: number | null;
  initialCreditsEarned: number | null;
  initialCreditsRequired: number | null;
  initialCohort: string;
}) {
  const router = useRouter();
  const [gpa, setGpa] = useState(initialGpa != null ? String(initialGpa) : '');
  const [earned, setEarned] = useState(
    initialCreditsEarned != null ? String(initialCreditsEarned) : '',
  );
  const [required, setRequired] = useState(
    initialCreditsRequired != null ? String(initialCreditsRequired) : '',
  );
  const [cohort, setCohort] = useState(initialCohort);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setBusy(true);
    setSaved(false);
    try {
      await fetch('/api/learn/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preferences: {
            academicGpa: gpa === '' ? null : Number(gpa),
            academicCreditsEarned: earned === '' ? null : Number(earned),
            academicCreditsRequired: required === '' ? null : Number(required),
            academicCohort: cohort.trim().slice(0, 80),
          },
        }),
      });
      setSaved(true);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="border p-4" style={{ borderColor: 'var(--line)' }}>
      <h2 className="mb-2 font-display text-[18px]">Your academic numbers</h2>
      <p className="mb-4 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
        Soft fields until your campus syncs an official transcript. Instructors may override via
        affiliation records.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-[13px]">
          <span className="mb-1 block font-semibold">GPA</span>
          <input
            className="form-input !rounded-none"
            inputMode="decimal"
            value={gpa}
            onChange={(e) => setGpa(e.target.value)}
            placeholder="e.g. 3.4"
          />
        </label>
        <label className="text-[13px]">
          <span className="mb-1 block font-semibold">Cohort</span>
          <input
            className="form-input !rounded-none"
            value={cohort}
            onChange={(e) => setCohort(e.target.value)}
            placeholder="e.g. 2026 Fall"
          />
        </label>
        <label className="text-[13px]">
          <span className="mb-1 block font-semibold">Credits earned</span>
          <input
            className="form-input !rounded-none"
            inputMode="numeric"
            value={earned}
            onChange={(e) => setEarned(e.target.value)}
          />
        </label>
        <label className="text-[13px]">
          <span className="mb-1 block font-semibold">Credits required</span>
          <input
            className="form-input !rounded-none"
            inputMode="numeric"
            value={required}
            onChange={(e) => setRequired(e.target.value)}
          />
        </label>
      </div>
      <button
        type="button"
        disabled={busy}
        onClick={save}
        className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-white"
        style={{ background: 'var(--green)' }}
      >
        {busy ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
        {saved ? 'Saved' : 'Save academic profile'}
      </button>
    </div>
  );
}
