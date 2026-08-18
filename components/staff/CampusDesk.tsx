'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Campus = {
  slug: string;
  name: string;
  city: string;
  address: string;
  color: string;
  students?: number;
};

export default function CampusDesk({ campuses }: { campuses: Campus[] }) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  async function save() {
    setBusy(true);
    setMsg('');
    try {
      const res = await fetch('/api/staff/campuses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, city, address }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not save campus');
      setName('');
      setCity('');
      setAddress('');
      setMsg('Campus saved.');
      router.refresh();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Could not save campus');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-8">
      <form
        className="border p-4"
        style={{ borderColor: 'var(--line)' }}
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
      >
        <h2 className="mb-3 font-display text-[20px]">Add a campus</h2>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Buea Campus"
          className="mb-2 w-full border px-3 py-2 text-[14px]"
          style={{ borderColor: 'var(--line)', background: 'transparent' }}
        />
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City"
          className="mb-2 w-full border px-3 py-2 text-[14px]"
          style={{ borderColor: 'var(--line)', background: 'transparent' }}
        />
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Address (optional)"
          className="mb-3 w-full border px-3 py-2 text-[14px]"
          style={{ borderColor: 'var(--line)', background: 'transparent' }}
        />
        <button
          type="submit"
          disabled={busy}
          className="px-4 py-2 text-[13px] font-semibold text-white"
          style={{ background: '#00B369' }}
        >
          {busy ? 'Saving…' : 'Save campus'}
        </button>
        {msg ? (
          <span className="ml-3 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
            {msg}
          </span>
        ) : null}
      </form>

      {campuses.length === 0 ? (
        <div className="rounded-2xl border border-dashed px-4 py-10 text-center" style={{ borderColor: 'var(--line)' }}>
          <p className="font-display text-[20px]">One institution, add campuses when you need them</p>
          <p className="mt-1 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
            A small academy can stay as a single site. Multi-campus schools add Buea, Douala, and the rest here.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {campuses.map((c) => (
            <article key={c.slug} className="border p-4" style={{ borderColor: 'var(--line)' }}>
              <div className="mb-2 h-1.5 w-10" style={{ background: c.color || '#00B369' }} />
              <p className="font-semibold">{c.name}</p>
              <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                {[c.city, c.address].filter(Boolean).join(' · ') || c.slug}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
