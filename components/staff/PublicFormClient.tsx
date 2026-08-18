'use client';

import { useEffect, useState } from 'react';
import { FormFields } from '@/components/staff/FormFields';
import type { DataField } from '@/lib/staff/dataTypes';

export default function PublicFormClient({ slug }: { slug: string }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [fields, setFields] = useState<DataField[]>([]);
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [lookups, setLookups] = useState<{ campuses: { slug: string; name: string }[] }>({ campuses: [] });
  const [done, setDone] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [missing, setMissing] = useState('');

  useEffect(() => {
    fetch(`/api/forms/${encodeURIComponent(slug)}`)
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || 'Form not found');
        setName(data.dataset.name);
        setDescription(data.dataset.description);
        setFields(data.dataset.fields || []);
        setLookups(data.lookups || { campuses: [] });
      })
      .catch((err) => setMissing(err instanceof Error ? err.message : 'Form not found'));
  }, [slug]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch(`/api/forms/${encodeURIComponent(slug)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ values }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not submit');
      setDone(data.status ? `Submitted · ${data.status}` : 'Submitted. Thank you.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit');
    } finally {
      setBusy(false);
    }
  }

  if (missing) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="font-display text-[28px]">Form unavailable</h1>
        <p className="mt-2 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
          {missing}
        </p>
      </div>
    );
  }

  if (done) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="font-display text-[28px]">You’re in</h1>
        <p className="mt-2 text-[14.5px]">{done}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: 'var(--ink-soft)' }}>
        InTelleX form
      </p>
      <h1 className="mt-2 font-display text-[32px] leading-tight">{name || 'Loading…'}</h1>
      {description ? (
        <p className="mt-2 text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
          {description}
        </p>
      ) : null}
      <form className="mt-6 space-y-4" onSubmit={submit}>
        <FormFields fields={fields} values={values} onChange={(id, v) => setValues((cur) => ({ ...cur, [id]: v }))} lookups={lookups} />
        {error ? (
          <p className="text-[13px]" style={{ color: '#b91c1c' }}>
            {error}
          </p>
        ) : null}
        <button type="submit" disabled={busy || !fields.length} className="px-4 py-2 text-[13px] font-semibold text-white disabled:opacity-50" style={{ background: '#00B369' }}>
          {busy ? 'Sending…' : 'Submit'}
        </button>
      </form>
    </div>
  );
}
