'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { FIELD_TYPE_LABELS, makeField, type DataField, type DataFieldType } from '@/lib/staff/dataTypes';
import { FormFields } from '@/components/staff/FormFields';

type RecordRow = {
  id: string;
  values: Record<string, unknown>;
  status: string;
  tags: string[];
  createdAt: string;
  createdByName: string;
  deletedAt: string | null;
};

type Dataset = {
  id: string;
  name: string;
  description: string;
  slug: string;
  fields: DataField[];
  statuses: string[];
  submitAccess: string;
  visibility: string;
  recordCount: number;
  maxSubmissions: number | null;
  openAt: string | null;
  closeAt: string | null;
};

type ImportPreview = {
  header: string[];
  suggested: string[];
  fields: Array<{ id: string; label: string }>;
  sample: string[][];
  rowCount: number;
  csv: string;
};

function cell(v: unknown) {
  if (Array.isArray(v)) return v.join(', ');
  if (v == null) return '';
  return String(v);
}

function toLocalInput(iso: string | null) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function DatasetDesk({
  datasetId,
  canWrite,
  origin,
}: {
  datasetId: string;
  canWrite: boolean;
  origin: string;
}) {
  const [tab, setTab] = useState<'table' | 'form' | 'analytics' | 'settings'>('table');
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [rows, setRows] = useState<RecordRow[]>([]);
  const [lookups, setLookups] = useState<{ campuses: { slug: string; name: string }[] }>({ campuses: [] });
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [tag, setTag] = useState('');
  const [page, setPage] = useState(1);
  const [trash, setTrash] = useState(false);
  const [sort, setSort] = useState('createdAt');
  const [dir, setDir] = useState<'asc' | 'desc'>('desc');
  const [filterField, setFilterField] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [editor, setEditor] = useState<RecordRow | 'new' | null>(null);
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [editStatus, setEditStatus] = useState('');
  const [editTags, setEditTags] = useState('');
  const [audit, setAudit] = useState<Array<{ id: string; action: string; actorName: string; createdAt: string }>>([]);
  const [fields, setFields] = useState<DataField[]>([]);
  const [ask, setAsk] = useState('');
  const [answer, setAnswer] = useState('');
  const [analytics, setAnalytics] = useState<{
    total: number;
    byStatus: Record<string, number>;
    confirmationRate: number;
    calcs: Array<{ label: string; sum: number; avg: number; min: number; max: number }>;
    breakdown: Array<{ label: string; counts: Record<string, number> }>;
  } | null>(null);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState('');
  const [shareCopied, setShareCopied] = useState(false);
  const [importPreview, setImportPreview] = useState<ImportPreview | null>(null);
  const [importMap, setImportMap] = useState<string[]>([]);
  const [settings, setSettings] = useState({
    name: '',
    description: '',
    submitAccess: 'staff',
    visibility: 'internal',
    maxSubmissions: '',
    openAt: '',
    closeAt: '',
    statuses: '',
  });

  const load = useCallback(async () => {
    const p = new URLSearchParams({ page: String(page), sort, dir });
    if (q.trim()) p.set('q', q.trim());
    if (status) p.set('status', status);
    if (tag.trim()) p.set('tag', tag.trim());
    if (trash) p.set('trash', '1');
    if (filterField && filterValue.trim()) {
      p.set('filters', JSON.stringify([{ fieldId: filterField, op: 'contains', value: filterValue.trim() }]));
    }
    const res = await fetch(`/api/staff/data/${datasetId}?${p}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Could not load');
    setRows(data.records || []);
    setTotal(data.total || 0);
    setDataset(data.dataset);
    setFields(data.dataset?.fields || data.fields || []);
    if (data.lookups) setLookups(data.lookups);
    if (data.dataset) {
      setSettings({
        name: data.dataset.name || '',
        description: data.dataset.description || '',
        submitAccess: data.dataset.submitAccess || 'staff',
        visibility: data.dataset.visibility || 'internal',
        maxSubmissions: data.dataset.maxSubmissions != null ? String(data.dataset.maxSubmissions) : '',
        openAt: toLocalInput(data.dataset.openAt),
        closeAt: toLocalInput(data.dataset.closeAt),
        statuses: (data.dataset.statuses || []).join(', '),
      });
    }
  }, [datasetId, page, q, status, tag, trash, sort, dir, filterField, filterValue]);

  useEffect(() => {
    load().catch((err) => setMsg(err.message));
  }, [load]);

  const shareOrigin =
    origin || (typeof window !== 'undefined' ? window.location.origin : '');
  const shareUrl = dataset ? `${shareOrigin.replace(/\/$/, '')}/f/${dataset.slug}` : '';

  async function post(body: Record<string, unknown>) {
    setBusy('save');
    setMsg('');
    try {
      const res = await fetch(`/api/staff/data/${datasetId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed');
      return data;
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Failed');
      return null;
    } finally {
      setBusy('');
    }
  }

  async function saveRecord(e: React.FormEvent) {
    e.preventDefault();
    const data = await post({
      action: 'save',
      id: editor && editor !== 'new' ? editor.id : undefined,
      values,
      status: editStatus || dataset?.statuses[0],
      tags: editTags
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    });
    if (data?.record) {
      setEditor(null);
      await load();
    }
  }

  async function bulk(bulkAction: string, value?: string) {
    if (!selected.length) return;
    if (bulkAction === 'delete' && !confirm('Move selected rows to trash?')) return;
    if (bulkAction === 'purge' && !confirm('Permanently delete selected rows? This cannot be undone.')) return;
    const data = await post({ action: 'bulk', ids: selected, bulkAction, value });
    if (data?.ok) {
      setSelected([]);
      await load();
    }
  }

  async function saveFields() {
    setBusy('fields');
    try {
      const res = await fetch(`/api/staff/data/${datasetId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not save fields');
      setDataset(data.dataset);
      setMsg('Form saved.');
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Could not save fields');
    } finally {
      setBusy('');
    }
  }

  async function saveSettings(e: React.FormEvent) {
    e.preventDefault();
    setBusy('settings');
    setMsg('');
    try {
      const res = await fetch(`/api/staff/data/${datasetId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: settings.name,
          description: settings.description,
          submitAccess: settings.submitAccess,
          visibility: settings.visibility,
          maxSubmissions: settings.maxSubmissions === '' ? null : Number(settings.maxSubmissions),
          openAt: settings.openAt || null,
          closeAt: settings.closeAt || null,
          statuses: settings.statuses.split(',').map((s) => s.trim()).filter(Boolean),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not save settings');
      setDataset(data.dataset);
      setMsg('Settings saved.');
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Could not save settings');
    } finally {
      setBusy('');
    }
  }

  async function loadAnalytics() {
    const res = await fetch(`/api/staff/data/${datasetId}?view=analytics`);
    const data = await res.json();
    setAnalytics(data.analytics || null);
  }

  async function openEditor(row: RecordRow | 'new') {
    setEditor(row);
    if (row === 'new') {
      setValues({});
      setEditStatus(dataset?.statuses[0] || '');
      setEditTags('');
      setAudit([]);
      return;
    }
    setValues(row.values);
    setEditStatus(row.status);
    setEditTags(row.tags.join(', '));
    const res = await fetch(`/api/staff/data/${datasetId}?view=audit&recordId=${row.id}`);
    const data = await res.json().catch(() => ({}));
    setAudit(data.audit || []);
  }

  async function onPickCsv(file: File) {
    const text = await file.text();
    const data = await post({ action: 'importPreview', csv: text });
    if (data?.header) {
      setImportPreview({ ...data, csv: text });
      setImportMap(data.suggested || []);
    }
  }

  async function confirmImport() {
    const data = await post({ action: 'import', csv: importPreview?.csv, mapping: importMap });
    if (data) {
      setMsg(`Imported ${data.imported}. ${data.errors?.length ? `${data.errors.length} row(s) skipped.` : ''}`);
      if (data.errors?.length) setMsg((m) => `${m} ${data.errors.slice(0, 6).join(' ')}`);
      setImportPreview(null);
      await load();
    }
  }

  function toggleSort(next: string) {
    if (sort === next) setDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSort(next);
      setDir('asc');
    }
  }

  const displayFields = useMemo(() => fields.slice(0, 6), [fields]);

  return (
    <div>
      <header className="mb-4">
        <p className="text-[13px] font-semibold">
          <a href="/dashboard/staff/data" style={{ color: 'var(--green-deep)' }}>
            ← Data Workspace
          </a>
        </p>
        <h1 className="mt-2 font-display text-[28px] leading-tight">{dataset?.name || 'Dataset'}</h1>
        <p className="mt-1 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
          {dataset?.description} · {total} records
        </p>
      </header>

      <div className="mb-4 flex flex-wrap gap-2">
        {(['table', 'form', 'analytics', 'settings'] as const).map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              setTab(id);
              if (id === 'analytics') void loadAnalytics();
            }}
            className="border px-3 py-1.5 text-[12.5px] font-semibold capitalize"
            style={{
              borderColor: tab === id ? 'var(--ink)' : 'var(--line)',
              background: tab === id ? 'var(--ink)' : 'transparent',
              color: tab === id ? '#fff' : 'var(--ink)',
            }}
          >
            {id === 'table' ? 'Spreadsheet' : id === 'form' ? 'Form builder' : id === 'analytics' ? 'Analytics' : 'Settings'}
          </button>
        ))}
      </div>

      {msg ? (
        <p className="mb-3 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
          {msg}
        </p>
      ) : null}

      {tab === 'table' ? (
        <>
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              value={q}
              onChange={(e) => {
                setPage(1);
                setQ(e.target.value);
              }}
              placeholder="Search any field…"
              className="flex-1 border px-3 py-2 text-[14px]"
              style={{ borderColor: 'var(--line)' }}
            />
            <select
              value={status}
              onChange={(e) => {
                setPage(1);
                setStatus(e.target.value);
              }}
              className="border px-3 py-2 text-[13px]"
              style={{ borderColor: 'var(--line)', background: 'transparent' }}
            >
              <option value="">All statuses</option>
              {(dataset?.statuses || []).map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <input
              value={tag}
              onChange={(e) => {
                setPage(1);
                setTag(e.target.value);
              }}
              placeholder="Tag"
              className="w-28 border px-3 py-2 text-[13px]"
              style={{ borderColor: 'var(--line)' }}
            />
            <button type="button" className="border px-3 py-2 text-[13px]" style={{ borderColor: 'var(--line)' }} onClick={() => setTrash((t) => !t)}>
              {trash ? 'Live records' : 'Trash'}
            </button>
            {canWrite ? (
              <button
                type="button"
                className="px-3 py-2 text-[13px] font-semibold text-white"
                style={{ background: '#00B369' }}
                onClick={() => openEditor('new')}
              >
                Add row
              </button>
            ) : null}
          </div>

          <div className="mb-3 flex flex-wrap items-center gap-2 text-[13px]">
            <select
              value={filterField}
              onChange={(e) => {
                setPage(1);
                setFilterField(e.target.value);
              }}
              className="border px-2 py-1.5"
              style={{ borderColor: 'var(--line)', background: 'transparent' }}
            >
              <option value="">Filter field</option>
              {fields.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.label}
                </option>
              ))}
            </select>
            <input
              value={filterValue}
              onChange={(e) => {
                setPage(1);
                setFilterValue(e.target.value);
              }}
              placeholder="contains…"
              className="border px-2 py-1.5"
              style={{ borderColor: 'var(--line)' }}
            />
            {canWrite ? (
              <label className="cursor-pointer border px-3 py-1.5" style={{ borderColor: 'var(--line)' }}>
                Import CSV
                <input
                  type="file"
                  accept=".csv,text/csv"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void onPickCsv(file);
                    e.target.value = '';
                  }}
                />
              </label>
            ) : null}
            <a href={`/api/staff/data/${datasetId}?view=export`} className="border px-3 py-1.5" style={{ borderColor: 'var(--line)' }}>
              Export CSV
            </a>
            <button type="button" className="border px-3 py-1.5" style={{ borderColor: 'var(--line)' }} onClick={() => window.print()}>
              Print
            </button>
          </div>

          {shareUrl && dataset?.submitAccess !== 'staff' ? (
            <p className="mb-3 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
              Share form:{' '}
              <button
                type="button"
                className="font-semibold"
                style={{ color: 'var(--green-deep)' }}
                onClick={() => {
                  void navigator.clipboard.writeText(shareUrl);
                  setShareCopied(true);
                }}
              >
                {shareUrl}
              </button>
              {shareCopied ? ' · copied' : ''}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="QR"
                src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(shareUrl)}`}
                className="ml-3 inline-block align-middle"
                width={40}
                height={40}
              />
            </p>
          ) : null}

          {selected.length > 0 && canWrite ? (
            <div className="mb-3 flex flex-wrap gap-2 text-[12.5px]">
              <span className="py-1.5">{selected.length} selected</span>
              {(dataset?.statuses || []).slice(0, 4).map((s) => (
                <button key={s} type="button" className="border px-2 py-1" style={{ borderColor: 'var(--line)' }} onClick={() => bulk('status', s)}>
                  Mark {s}
                </button>
              ))}
              <button
                type="button"
                className="border px-2 py-1"
                style={{ borderColor: 'var(--line)' }}
                onClick={() => {
                  const t = prompt('Tag to add');
                  if (t?.trim()) void bulk('tag', t.trim());
                }}
              >
                Add tag
              </button>
              <button type="button" className="border px-2 py-1" style={{ borderColor: 'var(--line)', color: '#b91c1c' }} onClick={() => bulk(trash ? 'restore' : 'delete')}>
                {trash ? 'Restore' : 'Trash'}
              </button>
              {trash ? (
                <button type="button" className="border px-2 py-1" style={{ borderColor: 'var(--line)', color: '#b91c1c' }} onClick={() => bulk('purge')}>
                  Delete forever
                </button>
              ) : null}
            </div>
          ) : null}

          <div className="hidden overflow-x-auto border md:block" style={{ borderColor: 'var(--line)' }}>
            <table className="min-w-full text-left text-[13px]">
              <thead style={{ background: 'var(--paper-dim)' }}>
                <tr>
                  <th className="px-2 py-2">
                    <input type="checkbox" onChange={(e) => setSelected(e.target.checked ? rows.map((r) => r.id) : [])} />
                  </th>
                  <th className="cursor-pointer px-2 py-2" onClick={() => toggleSort('status')}>
                    Status
                  </th>
                  {displayFields.map((f) => (
                    <th key={f.id} className="cursor-pointer px-2 py-2 font-semibold" onClick={() => toggleSort(`field:${f.id}`)}>
                      {f.label}
                    </th>
                  ))}
                  <th className="cursor-pointer px-2 py-2" onClick={() => toggleSort('createdAt')}>
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-t" style={{ borderColor: 'var(--line)' }}>
                    <td className="px-2 py-2">
                      <input
                        type="checkbox"
                        checked={selected.includes(r.id)}
                        onChange={(e) =>
                          setSelected((ids) => (e.target.checked ? [...ids, r.id] : ids.filter((id) => id !== r.id)))
                        }
                      />
                    </td>
                    <td className="px-2 py-2">{r.status}</td>
                    {displayFields.map((f) => (
                      <td
                        key={f.id}
                        className="max-w-[180px] cursor-pointer truncate px-2 py-2"
                        onClick={() => openEditor(r)}
                      >
                        {cell(r.values[f.id]) || '—'}
                      </td>
                    ))}
                    <td className="whitespace-nowrap px-2 py-2" style={{ color: 'var(--ink-soft)' }}>
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-2 md:hidden">
            {rows.map((r) => (
              <button
                key={r.id}
                type="button"
                className="w-full border p-3 text-left"
                style={{ borderColor: 'var(--line)' }}
                onClick={() => openEditor(r)}
              >
                <p className="font-semibold">{cell(r.values[fields[0]?.id]) || r.createdByName || 'Record'}</p>
                <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                  {r.status}
                  {fields[1] ? ` · ${cell(r.values[fields[1].id])}` : ''}
                  {r.tags.length ? ` · ${r.tags.join(', ')}` : ''}
                </p>
              </button>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between text-[13px]">
            <span style={{ color: 'var(--ink-soft)' }}>
              Page {page} · {total} total
            </span>
            <div className="flex gap-2">
              <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="border px-2 py-1" style={{ borderColor: 'var(--line)' }}>
                Prev
              </button>
              <button type="button" disabled={page * 50 >= total} onClick={() => setPage((p) => p + 1)} className="border px-2 py-1" style={{ borderColor: 'var(--line)' }}>
                Next
              </button>
            </div>
          </div>
        </>
      ) : null}

      {tab === 'form' && !canWrite ? (
        <p className="text-[14px]" style={{ color: 'var(--ink-soft)' }}>
          You can view records, but you don’t have permission to edit this form.
        </p>
      ) : null}

      {tab === 'form' && canWrite ? (
        <div className="space-y-4">
          <p className="text-[14px]" style={{ color: 'var(--ink-soft)' }}>
            Add the questions people will answer. Then share the form link from the spreadsheet tab.
          </p>
          {fields.map((f, idx) => (
            <div key={f.id} className="grid gap-2 border p-3 sm:grid-cols-4" style={{ borderColor: 'var(--line)' }}>
              <input
                value={f.label}
                onChange={(e) => setFields((all) => all.map((x, i) => (i === idx ? { ...x, label: e.target.value } : x)))}
                className="border px-2 py-1.5 text-[13px] sm:col-span-2"
                style={{ borderColor: 'var(--line)' }}
              />
              <select
                value={f.type}
                onChange={(e) =>
                  setFields((all) => all.map((x, i) => (i === idx ? { ...x, type: e.target.value as DataFieldType } : x)))
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
                  checked={f.required}
                  onChange={(e) => setFields((all) => all.map((x, i) => (i === idx ? { ...x, required: e.target.checked } : x)))}
                />
                Required
              </label>
              {['dropdown', 'radio', 'multi_select', 'checkbox'].includes(f.type) ? (
                <input
                  value={f.options.join(', ')}
                  onChange={(e) =>
                    setFields((all) =>
                      all.map((x, i) => (i === idx ? { ...x, options: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) } : x)),
                    )
                  }
                  placeholder="Options, comma separated"
                  className="border px-2 py-1.5 text-[13px] sm:col-span-4"
                  style={{ borderColor: 'var(--line)' }}
                />
              ) : null}
              <div className="flex flex-wrap gap-2 sm:col-span-4">
                <select
                  value={f.showIf?.fieldId || ''}
                  onChange={(e) =>
                    setFields((all) =>
                      all.map((x, i) =>
                        i === idx
                          ? { ...x, showIf: e.target.value ? { fieldId: e.target.value, op: 'eq', value: x.showIf?.value || '' } : null }
                          : x,
                      ),
                    )
                  }
                  className="border px-2 py-1.5 text-[13px]"
                  style={{ borderColor: 'var(--line)', background: 'transparent' }}
                >
                  <option value="">Always visible</option>
                  {fields
                    .filter((other) => other.id !== f.id)
                    .map((other) => (
                      <option key={other.id} value={other.id}>
                        Show if {other.label} is
                      </option>
                    ))}
                </select>
                {f.showIf?.fieldId ? (
                  <input
                    value={f.showIf.value}
                    onChange={(e) =>
                      setFields((all) => all.map((x, i) => (i === idx && x.showIf ? { ...x, showIf: { ...x.showIf, value: e.target.value } } : x)))
                    }
                    placeholder="Value, e.g. Yes"
                    className="border px-2 py-1.5 text-[13px]"
                    style={{ borderColor: 'var(--line)' }}
                  />
                ) : null}
                <button
                  type="button"
                  className="text-[12px]"
                  style={{ color: '#b91c1c' }}
                  onClick={() => setFields((all) => all.filter((_, i) => i !== idx))}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="flex gap-2">
            <button
              type="button"
              className="border px-3 py-2 text-[13px]"
              style={{ borderColor: 'var(--line)' }}
              onClick={() => setFields((f) => [...f, makeField({ label: 'New field', type: 'short_text' })])}
            >
              Add field
            </button>
            <button type="button" onClick={saveFields} className="px-3 py-2 text-[13px] font-semibold text-white" style={{ background: '#00B369' }}>
              {busy === 'fields' ? 'Saving…' : 'Save form'}
            </button>
          </div>
        </div>
      ) : null}

      {tab === 'analytics' && !analytics ? (
        <p className="text-[14px]" style={{ color: 'var(--ink-soft)' }}>
          Loading analytics…
        </p>
      ) : null}

      {tab === 'analytics' && analytics ? (
        <div className="space-y-6">
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              post({ action: 'ask', question: ask }).then((d) => setAnswer(d?.answer || ''));
            }}
          >
            <input
              value={ask}
              onChange={(e) => setAsk(e.target.value)}
              placeholder="Ask: how many confirmed? which department is highest?"
              className="flex-1 border px-3 py-2 text-[14px]"
              style={{ borderColor: 'var(--line)' }}
            />
            <button type="submit" className="px-3 py-2 text-[13px] font-semibold text-white" style={{ background: '#00B369' }}>
              Ask
            </button>
          </form>
          {answer ? (
            <p className="border p-4 text-[14.5px] leading-relaxed" style={{ borderColor: 'var(--line)' }}>
              {answer}
            </p>
          ) : null}
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="border p-4" style={{ borderColor: 'var(--line)' }}>
              <p className="font-display text-[28px]">{analytics.total}</p>
              <p className="text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                Total records
              </p>
            </div>
            <div className="border p-4" style={{ borderColor: 'var(--line)' }}>
              <p className="font-display text-[28px]">{analytics.confirmationRate}%</p>
              <p className="text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                Completion / confirmation rate
              </p>
            </div>
            {Object.entries(analytics.byStatus).map(([st, n]) => (
              <div key={st} className="border p-4" style={{ borderColor: 'var(--line)' }}>
                <p className="font-display text-[28px]">{n}</p>
                <p className="text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                  {st}
                </p>
              </div>
            ))}
          </div>
          {analytics.calcs.map((c) => (
            <div key={c.label} className="border p-4 text-[14px]" style={{ borderColor: 'var(--line)' }}>
              <p className="font-semibold">{c.label}</p>
              <p style={{ color: 'var(--ink-soft)' }}>
                Sum {c.sum} · Average {Math.round(c.avg * 10) / 10} · Min {c.min} · Max {c.max}
              </p>
            </div>
          ))}
          {analytics.breakdown.map((b) => (
            <div key={b.label}>
              <h3 className="mb-2 font-semibold">{b.label}</h3>
              <ul className="space-y-1 text-[14px]">
                {Object.entries(b.counts).map(([k, n]) => (
                  <li key={k} className="flex justify-between border-b py-1" style={{ borderColor: 'var(--line)' }}>
                    <span>{k}</span>
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : null}

      {tab === 'settings' && canWrite ? (
        <form className="max-w-xl space-y-3" onSubmit={saveSettings}>
          <label className="block text-[13px] font-semibold">
            Name
            <input
              value={settings.name}
              onChange={(e) => setSettings((s) => ({ ...s, name: e.target.value }))}
              className="mt-1 w-full border px-3 py-2 font-normal"
              style={{ borderColor: 'var(--line)' }}
            />
          </label>
          <label className="block text-[13px] font-semibold">
            Description
            <textarea
              value={settings.description}
              onChange={(e) => setSettings((s) => ({ ...s, description: e.target.value }))}
              className="mt-1 w-full border px-3 py-2 font-normal"
              rows={2}
              style={{ borderColor: 'var(--line)' }}
            />
          </label>
          <label className="block text-[13px] font-semibold">
            Who can submit
            <select
              value={settings.submitAccess}
              onChange={(e) => setSettings((s) => ({ ...s, submitAccess: e.target.value }))}
              className="mt-1 w-full border px-3 py-2 font-normal"
              style={{ borderColor: 'var(--line)', background: 'transparent' }}
            >
              <option value="staff">Staff only</option>
              <option value="students">Official students</option>
              <option value="authenticated">Anyone signed in</option>
              <option value="public">Anyone with the link</option>
            </select>
          </label>
          <label className="block text-[13px] font-semibold">
            Visibility
            <select
              value={settings.visibility}
              onChange={(e) => setSettings((s) => ({ ...s, visibility: e.target.value }))}
              className="mt-1 w-full border px-3 py-2 font-normal"
              style={{ borderColor: 'var(--line)', background: 'transparent' }}
            >
              <option value="private">Private</option>
              <option value="internal">Internal</option>
              <option value="public">Public</option>
            </select>
          </label>
          <label className="block text-[13px] font-semibold">
            Statuses (comma separated)
            <input
              value={settings.statuses}
              onChange={(e) => setSettings((s) => ({ ...s, statuses: e.target.value }))}
              className="mt-1 w-full border px-3 py-2 font-normal"
              style={{ borderColor: 'var(--line)' }}
            />
          </label>
          <label className="block text-[13px] font-semibold">
            Maximum submissions
            <input
              type="number"
              min={0}
              value={settings.maxSubmissions}
              onChange={(e) => setSettings((s) => ({ ...s, maxSubmissions: e.target.value }))}
              placeholder="No limit"
              className="mt-1 w-full border px-3 py-2 font-normal"
              style={{ borderColor: 'var(--line)' }}
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-[13px] font-semibold">
              Opens
              <input
                type="datetime-local"
                value={settings.openAt}
                onChange={(e) => setSettings((s) => ({ ...s, openAt: e.target.value }))}
                className="mt-1 w-full border px-3 py-2 font-normal"
                style={{ borderColor: 'var(--line)' }}
              />
            </label>
            <label className="block text-[13px] font-semibold">
              Closes
              <input
                type="datetime-local"
                value={settings.closeAt}
                onChange={(e) => setSettings((s) => ({ ...s, closeAt: e.target.value }))}
                className="mt-1 w-full border px-3 py-2 font-normal"
                style={{ borderColor: 'var(--line)' }}
              />
            </label>
          </div>
          <button type="submit" className="px-3 py-2 text-[13px] font-semibold text-white" style={{ background: '#00B369' }}>
            {busy === 'settings' ? 'Saving…' : 'Save settings'}
          </button>
        </form>
      ) : null}

      {editor ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
          <form
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto border bg-white p-5"
            style={{ borderColor: 'var(--line)' }}
            onSubmit={saveRecord}
          >
            <h2 className="font-display text-[22px]">{editor === 'new' ? 'New record' : 'Record'}</h2>
            <label className="mt-3 block text-[13px] font-semibold">
              Status
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="mt-1 w-full border px-3 py-2 font-normal"
                style={{ borderColor: 'var(--line)', background: 'transparent' }}
              >
                {(dataset?.statuses || []).map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <label className="mt-3 block text-[13px] font-semibold">
              Tags
              <input
                value={editTags}
                onChange={(e) => setEditTags(e.target.value)}
                placeholder="VIP, Follow-up"
                className="mt-1 w-full border px-3 py-2 font-normal"
                style={{ borderColor: 'var(--line)' }}
              />
            </label>
            <div className="mt-3">
              <FormFields
                fields={fields}
                values={values}
                onChange={(id, v) => setValues((cur) => ({ ...cur, [id]: v }))}
                lookups={lookups}
                allowStudentLookup
              />
            </div>
            {audit.length ? (
              <div className="mt-4">
                <p className="text-[12px] font-semibold uppercase tracking-wide" style={{ color: 'var(--ink-soft)' }}>
                  History
                </p>
                <ul className="mt-1 space-y-1 text-[12.5px]">
                  {audit.slice(0, 8).map((a) => (
                    <li key={a.id}>
                      {a.action} · {a.actorName} · {new Date(a.createdAt).toLocaleString()}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setEditor(null)} className="border px-3 py-2 text-[13px]" style={{ borderColor: 'var(--line)' }}>
                Close
              </button>
              {canWrite ? (
                <button type="submit" disabled={busy === 'save'} className="px-3 py-2 text-[13px] font-semibold text-white" style={{ background: '#00B369' }}>
                  Save
                </button>
              ) : null}
            </div>
          </form>
        </div>
      ) : null}

      {importPreview ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto border bg-white p-5" style={{ borderColor: 'var(--line)' }}>
            <h2 className="font-display text-[22px]">Map columns</h2>
            <p className="mt-1 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
              {importPreview.rowCount} rows ready. Match each Excel column to a field. Unmapped columns are skipped.
            </p>
            <ul className="mt-4 space-y-2">
              {importPreview.header.map((h, i) => (
                <li key={`${h}-${i}`} className="grid grid-cols-2 gap-2 text-[13px]">
                  <span className="truncate py-2">{h || `Column ${i + 1}`}</span>
                  <select
                    value={importMap[i] || ''}
                    onChange={(e) => setImportMap((m) => m.map((x, idx) => (idx === i ? e.target.value : x)))}
                    className="border px-2 py-1.5"
                    style={{ borderColor: 'var(--line)', background: 'transparent' }}
                  >
                    <option value="">Skip</option>
                    {importPreview.fields.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" className="border px-3 py-2 text-[13px]" style={{ borderColor: 'var(--line)' }} onClick={() => setImportPreview(null)}>
                Cancel
              </button>
              <button type="button" className="px-3 py-2 text-[13px] font-semibold text-white" style={{ background: '#00B369' }} onClick={() => void confirmImport()}>
                Import {importPreview.rowCount} rows
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
