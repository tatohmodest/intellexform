'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function CampusInstructorSalesToggle({
  slug,
  initial,
  accent = '#00b369',
}: {
  slug: string;
  initial: boolean;
  accent?: string;
}) {
  const [on, setOn] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function toggle() {
    setBusy(true);
    setError('');
    const next = !on;
    try {
      const res = await fetch(`/api/learn/institutions/${encodeURIComponent(slug)}/policy`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ allowInstructorSales: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not update policy');
      setOn(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not update policy');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="border-t pt-5" style={{ borderColor: 'var(--line)' }}>
      <h3 className="mb-2 font-display text-[18px]">Instructor sales</h3>
      <p className="mb-4 text-[13.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
        Campus teaching and student bookings stay free on InTelleX - your institution pays
        instructors off-platform. Optionally let instructors sell their own extra courses or books
        to learners outside core campus teaching.
      </p>
      <button
        type="button"
        onClick={toggle}
        disabled={busy}
        className="inline-flex items-center gap-2 border px-3 py-2 text-[13px] font-semibold disabled:opacity-60"
        style={{
          borderColor: on ? accent : 'var(--line)',
          color: on ? accent : 'var(--ink)',
          background: on ? `${accent}14` : 'transparent',
        }}
      >
        {busy ? <Loader2 size={14} className="animate-spin" /> : null}
        {on ? 'Instructor sales enabled' : 'Instructor sales disabled'}
      </button>
      <p className="mt-2 text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
        {on
          ? 'Instructors can price extra courses. Core campus courses can still be free.'
          : 'Instructors may create campus courses, but they stay free for students.'}
      </p>
      {error && (
        <p className="mt-2 text-[13px]" style={{ color: '#b91c1c' }}>
          {error}
        </p>
      )}
    </section>
  );
}
