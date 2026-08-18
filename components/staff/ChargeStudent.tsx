'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ChargeStudent({
  userId,
  structures,
}: {
  userId: string;
  structures: { id: string; title: string; amountXAF: number }[];
}) {
  const router = useRouter();
  const [structureId, setStructureId] = useState(structures[0]?.id || '');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  if (!structures.length) return null;

  async function charge() {
    setBusy(true);
    setMsg('');
    try {
      const res = await fetch('/api/staff/fees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'charge', structureId, studentUserId: userId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not charge');
      setMsg('Fee charged.');
      router.refresh();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Could not charge');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="border p-4" style={{ borderColor: 'var(--line)' }}>
      <h2 className="mb-3 font-display text-[20px]">Charge a fee</h2>
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={structureId}
          onChange={(e) => setStructureId(e.target.value)}
          className="border px-3 py-2 text-[13px]"
          style={{ borderColor: 'var(--line)', background: 'transparent' }}
        >
          {structures.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title}
            </option>
          ))}
        </select>
        <button
          type="button"
          disabled={busy || !structureId}
          onClick={charge}
          className="px-3 py-2 text-[13px] font-semibold text-white"
          style={{ background: '#00B369' }}
        >
          {busy ? 'Charging…' : 'Charge this student'}
        </button>
        {msg ? (
          <span className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
            {msg}
          </span>
        ) : null}
      </div>
    </div>
  );
}
