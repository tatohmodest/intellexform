'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Database, Plus } from 'lucide-react';
import { DATASET_TEMPLATES } from '@/lib/staff/dataTypes';

type Dataset = {
  id: string;
  name: string;
  description: string;
  category: string;
  recordCount: number;
  fieldCount: number;
  ownerName: string;
  updatedAt: string;
  submitAccess: string;
};

export default function DataHomeClient({ canWrite }: { canWrite: boolean }) {
  const router = useRouter();
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [templateId, setTemplateId] = useState('event');
  const [submitAccess, setSubmitAccess] = useState('staff');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/staff/data')
      .then((r) => r.json())
      .then((d) => setDatasets(d.datasets || []))
      .catch(() => setDatasets([]));
  }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/staff/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, templateId, submitAccess }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not create');
      router.push(`/dashboard/staff/data/${data.dataset.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="tab mb-2 inline-flex items-center gap-1.5">
            <Database size={11} /> Data Workspace
          </div>
          <h1 className="font-display text-[28px] leading-tight sm:text-[32px]">Data Workspace</h1>
          <p className="mt-2 max-w-[640px] text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
            Create a form, collect responses, then search, filter, and export like a spreadsheet — with real records underneath.
          </p>
        </div>
        {canWrite ? (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-1 px-4 py-2 text-[13px] font-semibold text-white"
            style={{ background: '#00B369' }}
          >
            <Plus size={14} /> Create dataset
          </button>
        ) : null}
      </header>

      {datasets.length === 0 ? (
        <p className="border border-dashed p-8 text-center text-[14px]" style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}>
          No datasets yet. Create one from a template — event registration, scholarships, surveys, or a blank sheet.
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {datasets.map((d) => (
            <li key={d.id}>
              <button
                type="button"
                onClick={() => router.push(`/dashboard/staff/data/${d.id}`)}
                className="w-full border p-4 text-left"
                style={{ borderColor: 'var(--line)' }}
              >
                <p className="font-semibold">{d.name}</p>
                <p className="mt-1 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                  {d.description || d.category}
                </p>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-wide" style={{ color: 'var(--ink-soft)' }}>
                  {d.recordCount} records · {d.fieldCount} fields · {d.submitAccess}
                </p>
              </button>
            </li>
          ))}
        </ul>
      )}

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form className="w-full max-w-lg border bg-white p-5" style={{ borderColor: 'var(--line)' }} onSubmit={create}>
            <h2 className="font-display text-[22px]">New dataset</h2>
            <p className="mt-1 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
              Pick a template, then customize fields. People fill the form; you get a searchable table.
            </p>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. 2026 Career Fair"
              className="mt-4 w-full border px-3 py-2 text-[14px]"
              style={{ borderColor: 'var(--line)' }}
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this for?"
              rows={2}
              className="mt-2 w-full border px-3 py-2 text-[14px]"
              style={{ borderColor: 'var(--line)' }}
            />
            <label className="mt-3 block text-[13px] font-semibold">
              Template
              <select
                value={templateId}
                onChange={(e) => {
                  const id = e.target.value;
                  setTemplateId(id);
                  if (id === 'event' || id === 'conference' || id === 'visitor') setSubmitAccess('public');
                }}
                className="mt-1 w-full border px-3 py-2 font-normal"
                style={{ borderColor: 'var(--line)', background: 'transparent' }}
              >
                {DATASET_TEMPLATES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="mt-3 block text-[13px] font-semibold">
              Who can submit
              <select
                value={submitAccess}
                onChange={(e) => setSubmitAccess(e.target.value)}
                className="mt-1 w-full border px-3 py-2 font-normal"
                style={{ borderColor: 'var(--line)', background: 'transparent' }}
              >
                <option value="staff">Staff only (type into the table)</option>
                <option value="students">Official students</option>
                <option value="authenticated">Anyone signed in</option>
                <option value="public">Anyone with the link (no account needed)</option>
              </select>
            </label>
            {error ? (
              <p className="mt-2 text-[13px]" style={{ color: '#b91c1c' }}>
                {error}
              </p>
            ) : null}
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setOpen(false)} className="border px-3 py-2 text-[13px]" style={{ borderColor: 'var(--line)' }}>
                Cancel
              </button>
              <button type="submit" disabled={busy} className="px-3 py-2 text-[13px] font-semibold text-white" style={{ background: '#00B369' }}>
                {busy ? 'Creating…' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
