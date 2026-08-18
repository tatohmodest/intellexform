'use client';

import { useEffect, useState } from 'react';
import type { DataField } from '@/lib/staff/dataTypes';

const COUNTRIES = [
  'Cameroon',
  'Nigeria',
  'Ghana',
  'Kenya',
  'Côte d’Ivoire',
  'South Africa',
  'France',
  'United Kingdom',
  'United States',
  'Canada',
  'Other',
];

export function fieldVisible(field: DataField, values: Record<string, unknown>) {
  if (!field.showIf?.fieldId) return true;
  const current = String(values[field.showIf.fieldId] ?? '');
  if (field.showIf.op === 'neq') return current !== field.showIf.value;
  return current === field.showIf.value;
}

function StudentPicker({
  value,
  onChange,
  onPrefill,
}: {
  value: string;
  onChange: (v: string) => void;
  onPrefill?: (row: Record<string, string>) => void;
}) {
  const [q, setQ] = useState(value);
  const [hits, setHits] = useState<Array<{ userId: string; name: string; email: string; studentCode: string; program: string; department: string; campusSlug: string }>>([]);

  useEffect(() => {
    setQ(value);
  }, [value]);

  useEffect(() => {
    if (q.trim().length < 2) {
      setHits([]);
      return;
    }
    const t = setTimeout(() => {
      fetch(`/api/staff/students?q=${encodeURIComponent(q.trim())}`)
        .then((r) => r.json())
        .then((d) => setHits(d.students || []))
        .catch(() => setHits([]));
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <div className="relative">
      <input
        className="mt-1 w-full border px-3 py-2 text-[14px] font-normal"
        style={{ borderColor: 'var(--line)', background: 'transparent' }}
        value={q}
        placeholder="Search student name or matricule…"
        onChange={(e) => {
          setQ(e.target.value);
          onChange(e.target.value);
        }}
      />
      {hits.length ? (
        <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-auto border bg-white text-[13px] font-normal" style={{ borderColor: 'var(--line)' }}>
          {hits.slice(0, 8).map((s) => (
            <li key={s.userId}>
              <button
                type="button"
                className="block w-full px-3 py-2 text-left hover:bg-[var(--paper-dim)]"
                onClick={() => {
                  onChange(s.name);
                  setQ(s.name);
                  setHits([]);
                  onPrefill?.({
                    name: s.name,
                    email: s.email,
                    matricule: s.studentCode,
                    program: s.program,
                    department: s.department,
                    campus: s.campusSlug,
                  });
                }}
              >
                {s.name}
                <span className="ml-2" style={{ color: 'var(--ink-soft)' }}>
                  {s.studentCode || s.email}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function FormFields({
  fields,
  values,
  onChange,
  lookups,
  allowStudentLookup = false,
}: {
  fields: DataField[];
  values: Record<string, unknown>;
  onChange: (id: string, value: unknown) => void;
  lookups?: { campuses: { slug: string; name: string }[] };
  allowStudentLookup?: boolean;
}) {
  function prefillFromStudent(row: Record<string, string>) {
    for (const f of fields) {
      if (!f.autoFrom || values[f.id]) continue;
      const mapped = row[f.autoFrom];
      if (mapped) onChange(f.id, mapped);
    }
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {fields
        .filter((f) => !f.formula)
        .filter((f) => fieldVisible(f, values))
        .map((f) => {
          const value = values[f.id] ?? f.defaultValue ?? '';
          const common = {
            className: 'mt-1 w-full border px-3 py-2 text-[14px] font-normal',
            style: { borderColor: 'var(--line)', background: 'transparent' } as React.CSSProperties,
          };
          const options =
            f.type === 'campus'
              ? (lookups?.campuses || []).map((c) => c.name)
              : f.type === 'yes_no'
                ? ['Yes', 'No']
                : f.type === 'country'
                  ? COUNTRIES
                  : f.options;

          return (
            <label
              key={f.id}
              className={`block text-[13px] font-semibold ${f.type === 'long_text' || f.type === 'address' ? 'sm:col-span-2' : ''}`}
            >
              {f.label}
              {f.required ? ' *' : ''}
              {f.description ? (
                <span className="mt-0.5 block font-normal" style={{ color: 'var(--ink-soft)' }}>
                  {f.description}
                </span>
              ) : null}
              {f.type === 'long_text' || f.type === 'address' ? (
                <textarea
                  {...common}
                  rows={3}
                  value={String(value)}
                  placeholder={f.placeholder}
                  onChange={(e) => onChange(f.id, e.target.value)}
                />
              ) : f.type === 'student' && allowStudentLookup ? (
                <StudentPicker
                  value={String(value)}
                  onChange={(v) => onChange(f.id, v)}
                  onPrefill={prefillFromStudent}
                />
              ) : f.type === 'yes_no' ||
                f.type === 'radio' ||
                f.type === 'dropdown' ||
                f.type === 'campus' ||
                f.type === 'country' ||
                ((f.type === 'department' || f.type === 'faculty' || f.type === 'program') && options.length > 0) ? (
                <select {...common} value={String(value)} onChange={(e) => onChange(f.id, e.target.value)}>
                  <option value="">Choose…</option>
                  {options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : f.type === 'multi_select' || f.type === 'checkbox' ? (
                <div className="mt-1 grid gap-1 font-normal">
                  {f.options.map((opt) => {
                    const selected = Array.isArray(value) ? value.map(String) : String(value).split(',').filter(Boolean);
                    const on = selected.includes(opt);
                    return (
                      <label key={opt} className="flex items-center gap-2 text-[14px] font-normal">
                        <input
                          type="checkbox"
                          checked={on}
                          onChange={() =>
                            onChange(f.id, on ? selected.filter((x) => x !== opt) : [...selected, opt])
                          }
                        />
                        {opt}
                      </label>
                    );
                  })}
                </div>
              ) : f.type === 'number' ? (
                <input {...common} type="number" value={String(value)} onChange={(e) => onChange(f.id, e.target.value)} />
              ) : f.type === 'date' ? (
                <input {...common} type="date" value={String(value)} onChange={(e) => onChange(f.id, e.target.value)} />
              ) : f.type === 'time' ? (
                <input {...common} type="time" value={String(value)} onChange={(e) => onChange(f.id, e.target.value)} />
              ) : f.type === 'datetime' ? (
                <input {...common} type="datetime-local" value={String(value)} onChange={(e) => onChange(f.id, e.target.value)} />
              ) : f.type === 'file' || f.type === 'image' ? (
                <input
                  {...common}
                  type="file"
                  accept={f.type === 'image' ? 'image/*' : undefined}
                  onChange={(e) => onChange(f.id, e.target.files?.[0]?.name || '')}
                />
              ) : (
                <input
                  {...common}
                  type={f.type === 'email' ? 'email' : f.type === 'url' ? 'url' : f.type === 'phone' ? 'tel' : 'text'}
                  value={String(value)}
                  placeholder={f.type === 'signature' ? 'Type your full name as signature' : f.placeholder}
                  onChange={(e) => onChange(f.id, e.target.value)}
                />
              )}
            </label>
          );
        })}
    </div>
  );
}
