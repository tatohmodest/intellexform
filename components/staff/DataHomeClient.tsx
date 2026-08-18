'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Database, Plus, Trash2 } from 'lucide-react';
import {
  DATASET_TEMPLATES,
  FIELD_TYPE_LABELS,
  SUBMIT_ACCESS_OPTIONS,
  makeField,
  submitAccessLabel,
  type DataField,
  type DataFieldType,
  type DatasetTemplate,
} from '@/lib/staff/dataTypes';

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

type Template = DatasetTemplate & { saved?: boolean; ownerName?: string };

type CsvColumnPlan = {
  header: string;
  type: DataFieldType;
  required: boolean;
  skip: boolean;
  fieldId: string;
  options: string[];
};

function cloneFields(tmpl: Template | undefined): DataField[] {
  return (tmpl?.fields || []).map((f) => makeField(f));
}

export default function DataHomeClient({ canWrite }: { canWrite: boolean }) {
  const router = useRouter();
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [templates, setTemplates] = useState<Template[]>(DATASET_TEMPLATES);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [templateId, setTemplateId] = useState('event');
  const [submitAccess, setSubmitAccess] = useState('staff');
  const [fields, setFields] = useState<DataField[]>(() => cloneFields(DATASET_TEMPLATES.find((t) => t.id === 'event')));
  const [blankMode, setBlankMode] = useState<'ask' | 'manual' | 'import'>('ask');
  const [csvText, setCsvText] = useState('');
  const [csvColumns, setCsvColumns] = useState<CsvColumnPlan[]>([]);
  const [csvRows, setCsvRows] = useState(0);
  const [csvSample, setCsvSample] = useState<string[][]>([]);
  const [extraFields, setExtraFields] = useState<DataField[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [templateMsg, setTemplateMsg] = useState('');

  const selected = useMemo(
    () => templates.find((t) => t.id === templateId) || templates[0],
    [templates, templateId],
  );
  const isBlank = selected?.id === 'blank';

  useEffect(() => {
    fetch('/api/staff/data')
      .then((r) => r.json())
      .then((d) => {
        setDatasets(d.datasets || []);
        if (Array.isArray(d.templates) && d.templates.length) setTemplates(d.templates);
      })
      .catch(() => setDatasets([]));
  }, []);

  function pickTemplate(id: string) {
    setTemplateId(id);
    const tmpl = templates.find((t) => t.id === id);
    setFields(cloneFields(tmpl));
    setBlankMode(id === 'blank' ? 'ask' : 'manual');
    setCsvText('');
    setCsvColumns([]);
    setExtraFields([]);
    setTemplateMsg('');
    if (id === 'event' || id === 'conference' || id === 'visitor') setSubmitAccess('public');
  }

  async function onPickCreateCsv(file: File) {
    const name = file.name.toLowerCase();
    if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
      setError('Save the Excel file as CSV first (File → Save As → CSV UTF-8).');
      return;
    }
    const text = await file.text();
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/staff/data/csv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csv: text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not read CSV');
      setCsvText(text);
      setCsvColumns(data.columns || []);
      setCsvRows(data.rowCount || 0);
      setCsvSample(data.sample || []);
      setExtraFields([]);
      setFields(
        (data.columns || [])
          .filter((c: CsvColumnPlan) => !c.skip)
          .map((c: CsvColumnPlan) =>
            makeField({
              label: c.header,
              type: c.type,
              required: c.required,
              options: c.options,
            }),
          ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not read CSV');
    } finally {
      setBusy(false);
    }
  }

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (isBlank && blankMode === 'ask') {
      setError('Choose whether to import a CSV or add columns yourself.');
      return;
    }
    if (isBlank && blankMode === 'import' && !csvText) {
      setError('Choose a CSV file, or switch to adding columns yourself.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const payload: Record<string, unknown> = {
        name,
        description,
        templateId,
        submitAccess,
        fields: isBlank && blankMode === 'import' ? extraFields : fields,
        statuses: selected?.statuses,
        category: selected?.category,
      };
      if (isBlank && blankMode === 'import' && csvText) {
        payload.csv = csvText;
        payload.columns = csvColumns;
      }
      const res = await fetch('/api/staff/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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

  function columnsForTemplate(): DataField[] {
    if (isBlank && blankMode === 'import') {
      return [
        ...csvColumns
          .filter((c) => !c.skip && c.header.trim())
          .map((c) => makeField({ label: c.header, type: c.type, required: c.required, options: c.options })),
        ...extraFields,
      ];
    }
    return fields;
  }

  async function saveCurrentAsTemplate() {
    const cols = columnsForTemplate();
    if (!cols.length) {
      setError('Add at least one column before saving a template.');
      return;
    }
    const title = window.prompt('Template name', name.trim() || selected?.name || '')?.trim();
    if (!title) return;
    setBusy(true);
    setError('');
    setTemplateMsg('');
    try {
      const res = await fetch('/api/staff/data/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: title,
          description: description || selected?.description,
          category: selected?.category || 'Custom',
          statuses: selected?.statuses,
          fields: cols,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not save template');
      const listed = await fetch('/api/staff/data').then((r) => r.json());
      if (Array.isArray(listed.templates) && listed.templates.length) setTemplates(listed.templates);
      setTemplateMsg(`Saved template “${data.template?.name || title}”. You can pick it next time.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save template');
    } finally {
      setBusy(false);
    }
  }

  async function removeSavedTemplate() {
    if (!selected?.saved) return;
    if (!window.confirm(`Delete saved template “${selected.name}”?`)) return;
    setBusy(true);
    setError('');
    try {
      const res = await fetch(`/api/staff/data/templates?id=${encodeURIComponent(selected.id)}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not delete template');
      const listed = await fetch('/api/staff/data').then((r) => r.json());
      if (Array.isArray(listed.templates) && listed.templates.length) setTemplates(listed.templates);
      pickTemplate('blank');
      setTemplateMsg('Saved template deleted.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete template');
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
            onClick={() => {
              setOpen(true);
              setError('');
              pickTemplate(templateId);
            }}
            className="inline-flex items-center gap-1 px-4 py-2 text-[13px] font-semibold text-white"
            style={{ background: '#00B369' }}
          >
            <Plus size={14} /> Create dataset
          </button>
        ) : null}
      </header>

      {datasets.length === 0 ? (
        <p className="border border-dashed p-8 text-center text-[14px]" style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}>
          No datasets yet. Start from a template, import a CSV, or add your own columns.
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
                <p className="mt-2 text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
                  Created by {d.ownerName || 'staff'}
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-wide" style={{ color: 'var(--ink-soft)' }}>
                  {d.recordCount} records · {d.fieldCount} fields
                </p>
                <p className="mt-1 text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                  {submitAccessLabel(d.submitAccess)}
                </p>
              </button>
            </li>
          ))}
        </ul>
      )}

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form
            className="max-h-[92vh] w-full max-w-2xl overflow-y-auto border bg-white p-5"
            style={{ borderColor: 'var(--line)' }}
            onSubmit={create}
          >
            <h2 className="font-display text-[22px]">New dataset</h2>
            <p className="mt-1 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
              Pick a template and change the columns, import a CSV, or build a blank sheet yourself.
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
              Start from
              <select
                value={templateId}
                onChange={(e) => pickTemplate(e.target.value)}
                className="mt-1 w-full border px-3 py-2 font-normal"
                style={{ borderColor: 'var(--line)', background: 'transparent' }}
              >
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.saved ? `Saved · ${t.name}` : t.name}
                  </option>
                ))}
              </select>
            </label>
            <p className="mt-1 text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
              {selected?.description}
              {selected?.saved && selected.ownerName ? ` · Saved by ${selected.ownerName}` : ''}
            </p>
            {selected?.saved ? (
              <button
                type="button"
                className="mt-1 text-[12px]"
                style={{ color: '#b91c1c' }}
                onClick={() => void removeSavedTemplate()}
              >
                Delete this saved template
              </button>
            ) : null}

            {isBlank ? (
              <div className="mt-4 space-y-2 border p-3 text-[13px]" style={{ borderColor: 'var(--line)' }}>
                <p className="font-semibold">How do you want to start this blank sheet?</p>
                <label className="flex items-start gap-2">
                  <input
                    type="radio"
                    name="blankMode"
                    checked={blankMode === 'import'}
                    onChange={() => setBlankMode('import')}
                  />
                  <span>
                    Import a CSV — columns are created from the file headers, with a type on each column.
                  </span>
                </label>
                <label className="flex items-start gap-2">
                  <input
                    type="radio"
                    name="blankMode"
                    checked={blankMode === 'manual'}
                    onChange={() => setBlankMode('manual')}
                  />
                  <span>Create columns myself, then add rows by hand.</span>
                </label>
              </div>
            ) : null}

            {isBlank && blankMode === 'import' ? (
              <div className="mt-3">
                <label className="inline-flex cursor-pointer border px-3 py-2 text-[13px] font-semibold" style={{ borderColor: 'var(--line)' }}>
                  Choose CSV
                  <input
                    type="file"
                    accept=".csv,text/csv,.txt"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void onPickCreateCsv(file);
                      e.target.value = '';
                    }}
                  />
                </label>
                {csvColumns.length ? (
                  <div className="mt-3">
                    <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                      {csvRows} data row{csvRows === 1 ? '' : 's'}. Set a type for each column, or skip it.
                    </p>
                    <ul className="mt-2 space-y-2">
                      {csvColumns.map((c, i) => (
                        <li key={`${c.header}-${i}`} className="grid gap-2 sm:grid-cols-6">
                          <input
                            value={c.header}
                            onChange={(e) =>
                              setCsvColumns((all) => all.map((x, idx) => (idx === i ? { ...x, header: e.target.value } : x)))
                            }
                            className="border px-2 py-1.5 text-[13px] sm:col-span-2"
                            style={{ borderColor: 'var(--line)' }}
                          />
                          <select
                            value={c.type}
                            disabled={c.skip}
                            onChange={(e) =>
                              setCsvColumns((all) =>
                                all.map((x, idx) => (idx === i ? { ...x, type: e.target.value as DataFieldType } : x)),
                              )
                            }
                            className="border px-2 py-1.5 text-[13px]"
                            style={{ borderColor: 'var(--line)', background: 'transparent' }}
                          >
                            {Object.entries(FIELD_TYPE_LABELS).map(([k, lab]) => (
                              <option key={k} value={k}>
                                {lab}
                              </option>
                            ))}
                          </select>
                          <label className="flex items-center gap-2 text-[13px]">
                            <input
                              type="checkbox"
                              checked={c.required}
                              disabled={c.skip}
                              onChange={(e) =>
                                setCsvColumns((all) => all.map((x, idx) => (idx === i ? { ...x, required: e.target.checked } : x)))
                              }
                            />
                            Required
                          </label>
                          <label className="flex items-center gap-2 text-[13px]">
                            <input
                              type="checkbox"
                              checked={c.skip}
                              onChange={(e) =>
                                setCsvColumns((all) => all.map((x, idx) => (idx === i ? { ...x, skip: e.target.checked } : x)))
                              }
                            />
                            Skip
                          </label>
                        </li>
                      ))}
                    </ul>
                    {csvSample[0] ? (
                      <p className="mt-2 truncate text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                        First row: {csvSample[0].slice(0, 6).join(' · ')}
                      </p>
                    ) : null}
                    <p className="mt-3 text-[13px] font-semibold">Extra columns (optional)</p>
                    <p className="mb-2 text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
                      Add columns that are not in the CSV. You can still change everything after the sheet is created.
                    </p>
                    <ul className="space-y-2">
                      {extraFields.map((f, idx) => (
                        <li key={f.id} className="grid gap-2 sm:grid-cols-4">
                          <input
                            value={f.label}
                            onChange={(e) =>
                              setExtraFields((all) => all.map((x, i) => (i === idx ? { ...x, label: e.target.value } : x)))
                            }
                            className="border px-2 py-1.5 text-[13px] sm:col-span-2"
                            style={{ borderColor: 'var(--line)' }}
                          />
                          <select
                            value={f.type}
                            onChange={(e) =>
                              setExtraFields((all) =>
                                all.map((x, i) => (i === idx ? { ...x, type: e.target.value as DataFieldType } : x)),
                              )
                            }
                            className="border px-2 py-1.5 text-[13px]"
                            style={{ borderColor: 'var(--line)', background: 'transparent' }}
                          >
                            {Object.entries(FIELD_TYPE_LABELS).map(([k, lab]) => (
                              <option key={k} value={k}>
                                {lab}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 text-[12px]"
                            style={{ color: '#b91c1c' }}
                            onClick={() => setExtraFields((all) => all.filter((_, i) => i !== idx))}
                          >
                            <Trash2 size={12} /> Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      className="mt-2 border px-3 py-1.5 text-[13px]"
                      style={{ borderColor: 'var(--line)' }}
                      onClick={() => setExtraFields((f) => [...f, makeField({ label: 'New column', type: 'short_text' })])}
                    >
                      Add extra column
                    </button>
                  </div>
                ) : null}
              </div>
            ) : null}

            {(!isBlank || blankMode === 'manual') && (
              <div className="mt-4">
                <p className="text-[13px] font-semibold">Columns</p>
                <p className="mb-2 text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
                  Add, remove, or change types. Templates are a starting point, not a lock.
                </p>
                <ul className="space-y-2">
                  {fields.map((f, idx) => (
                    <li key={f.id} className="grid gap-2 sm:grid-cols-4">
                      <input
                        value={f.label}
                        onChange={(e) =>
                          setFields((all) => all.map((x, i) => (i === idx ? { ...x, label: e.target.value } : x)))
                        }
                        className="border px-2 py-1.5 text-[13px] sm:col-span-2"
                        style={{ borderColor: 'var(--line)' }}
                      />
                      <select
                        value={f.type}
                        onChange={(e) =>
                          setFields((all) =>
                            all.map((x, i) => (i === idx ? { ...x, type: e.target.value as DataFieldType } : x)),
                          )
                        }
                        className="border px-2 py-1.5 text-[13px]"
                        style={{ borderColor: 'var(--line)', background: 'transparent' }}
                      >
                        {Object.entries(FIELD_TYPE_LABELS).map(([k, lab]) => (
                          <option key={k} value={k}>
                            {lab}
                          </option>
                        ))}
                      </select>
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-1 text-[12px]">
                          <input
                            type="checkbox"
                            checked={f.required}
                            onChange={(e) =>
                              setFields((all) => all.map((x, i) => (i === idx ? { ...x, required: e.target.checked } : x)))
                            }
                          />
                          Required
                        </label>
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 text-[12px]"
                          style={{ color: '#b91c1c' }}
                          onClick={() => setFields((all) => all.filter((_, i) => i !== idx))}
                        >
                          <Trash2 size={12} /> Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="mt-2 border px-3 py-1.5 text-[13px]"
                  style={{ borderColor: 'var(--line)' }}
                  onClick={() => setFields((f) => [...f, makeField({ label: 'New column', type: 'short_text' })])}
                >
                  Add column
                </button>
              </div>
            )}

            <label className="mt-3 block text-[13px] font-semibold">
              Who can fill this form
              <p className="mt-0.5 font-normal text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
                This is not who can see the table. Institution members still see the dataset on
                their dashboard, with your name as the person who created it.
              </p>
              <select
                value={submitAccess}
                onChange={(e) => setSubmitAccess(e.target.value)}
                className="mt-1 w-full border px-3 py-2 font-normal"
                style={{ borderColor: 'var(--line)', background: 'transparent' }}
              >
                {SUBMIT_ACCESS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <span className="mt-1 block font-normal text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                {SUBMIT_ACCESS_OPTIONS.find((o) => o.value === submitAccess)?.hint}
              </span>
            </label>
            {templateMsg ? (
              <p className="mt-2 text-[13px]" style={{ color: 'var(--green-deep)' }}>
                {templateMsg}
              </p>
            ) : null}
            {error ? (
              <p className="mt-2 text-[13px]" style={{ color: '#b91c1c' }}>
                {error}
              </p>
            ) : null}
            <div className="mt-4 flex flex-wrap justify-end gap-2">
              <button type="button" onClick={() => setOpen(false)} className="border px-3 py-2 text-[13px]" style={{ borderColor: 'var(--line)' }}>
                Cancel
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void saveCurrentAsTemplate()}
                className="border px-3 py-2 text-[13px]"
                style={{ borderColor: 'var(--line)' }}
              >
                Save as template
              </button>
              <button type="submit" disabled={busy} className="px-3 py-2 text-[13px] font-semibold text-white" style={{ background: '#00B369' }}>
                {busy ? 'Creating…' : isBlank && blankMode === 'import' ? 'Create and import' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
