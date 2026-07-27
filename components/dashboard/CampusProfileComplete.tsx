'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, UserRound } from 'lucide-react';

export default function CampusProfileComplete({
  slug,
  institutionName,
  accent = '#00b369',
}: {
  slug: string;
  institutionName: string;
  accent?: string;
}) {
  const router = useRouter();
  const [program, setProgram] = useState('');
  const [year, setYear] = useState('');
  const [department, setDepartment] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch(`/api/learn/institutions/${slug}/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ program, year, department, emergencyContact }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error === 'program_required' ? 'Program / field of study is required.' : 'Could not save.');
        return;
      }
      router.replace(`/dashboard/institutions/${slug}`);
      router.refresh();
    } catch {
      setError('Could not connect. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-4 sm:items-center">
      <form
        onSubmit={submit}
        className="w-full max-w-[480px] rounded-3xl bg-paper p-6 shadow-xl"
        style={{ borderTop: `4px solid ${accent}` }}
      >
        <div className="mb-5 flex items-start gap-3">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
            style={{ background: `${accent}22`, color: accent }}
          >
            <UserRound size={20} />
          </span>
          <div>
            <h2 className="font-display text-[22px]">Complete your {institutionName} profile</h2>
            <p className="mt-1 text-[13.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              First verified visit — a few campus details. Your global InTelleX identity stays the same.
            </p>
          </div>
        </div>

        <label className="mb-1.5 block text-[13px] font-semibold">Program / field of study</label>
        <input
          className="form-input mb-3"
          value={program}
          onChange={(e) => setProgram(e.target.value)}
          placeholder="e.g. B.Sc. Computer Science"
          required
          autoFocus
        />

        <div className="mb-3 grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold">Year</label>
            <input className="form-input" value={year} onChange={(e) => setYear(e.target.value)} placeholder="Year 2" />
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold">Department</label>
            <input className="form-input" value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="Faculty of Science" />
          </div>
        </div>

        <label className="mb-1.5 block text-[13px] font-semibold">Emergency contact</label>
        <input
          className="form-input mb-4"
          value={emergencyContact}
          onChange={(e) => setEmergencyContact(e.target.value)}
          placeholder="Name · phone"
        />

        {error && (
          <p className="mb-3 rounded-xl px-4 py-3 text-[13px]" style={{ background: 'rgba(196,98,42,0.08)', color: '#a14d18' }}>
            {error}
          </p>
        )}

        <button type="submit" disabled={busy || !program.trim()} className="btn btn-primary w-full !py-3" style={{ background: accent }}>
          {busy ? <Loader2 size={16} className="animate-spin" /> : null}
          Save and enter campus
        </button>
      </form>
    </div>
  );
}
