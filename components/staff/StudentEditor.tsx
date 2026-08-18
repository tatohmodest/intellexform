'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { STUDENT_STATUSES, type StudentStatus } from '@/lib/staff/permissions';

export default function StudentEditor({
  userId,
  canWrite,
  canStatus,
  record,
  campuses,
}: {
  userId: string;
  canWrite: boolean;
  canStatus: boolean;
  record: {
    status: StudentStatus;
    program: string;
    department: string;
    faculty: string;
    year: string;
    phone: string;
    notes: string;
    campusSlug: string;
    classHead?: boolean;
  };
  campuses: { slug: string; name: string }[];
}) {
  const router = useRouter();
  const [form, setForm] = useState(record);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  if (!canWrite) return null;

  async function save() {
    setBusy(true);
    setMsg('');
    try {
      const res = await fetch(`/api/staff/students/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(canStatus ? form : { ...form, status: undefined }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not save');
      setMsg('Saved.');
      router.refresh();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Could not save');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="border p-4" style={{ borderColor: 'var(--line)' }}>
      <h2 className="mb-3 font-display text-[20px]">Student record</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {canStatus ? (
          <label className="text-[13px]">
            <span className="mb-1 block" style={{ color: 'var(--ink-soft)' }}>
              Status
            </span>
            <select
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as StudentStatus }))}
              className="w-full border px-3 py-2"
              style={{ borderColor: 'var(--line)', background: 'transparent' }}
            >
              {STUDENT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <label className="text-[13px]">
          <span className="mb-1 block" style={{ color: 'var(--ink-soft)' }}>
            Campus
          </span>
          <select
            value={form.campusSlug || ''}
            onChange={(e) => setForm((f) => ({ ...f, campusSlug: e.target.value }))}
            className="w-full border px-3 py-2"
            style={{ borderColor: 'var(--line)', background: 'transparent' }}
          >
            <option value="">Unassigned</option>
            {campuses.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        {[
          ['program', 'Program'],
          ['department', 'Department'],
          ['faculty', 'Faculty'],
          ['year', 'Level / year'],
          ['phone', 'Phone'],
        ].map(([key, label]) => (
          <label key={key} className="text-[13px]">
            <span className="mb-1 block" style={{ color: 'var(--ink-soft)' }}>
              {label}
            </span>
            <input
              value={(form as Record<string, string>)[key] || ''}
              onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
              className="w-full border px-3 py-2"
              style={{ borderColor: 'var(--line)', background: 'transparent' }}
            />
          </label>
        ))}
        <label className="flex items-center gap-2 text-[13px] sm:col-span-2">
          <input
            type="checkbox"
            checked={Boolean(form.classHead)}
            onChange={(e) => setForm((f) => ({ ...f, classHead: e.target.checked }))}
          />
          <span>
            Class head
            <span className="mt-0.5 block text-[12px]" style={{ color: 'var(--ink-soft)' }}>
              Can create course groups and add classmates to the chat rooms.
            </span>
          </span>
        </label>
      </div>
      <label className="mt-3 block text-[13px]">
        <span className="mb-1 block" style={{ color: 'var(--ink-soft)' }}>
          Notes
        </span>
        <textarea
          value={form.notes}
          onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          rows={3}
          className="w-full border px-3 py-2"
          style={{ borderColor: 'var(--line)', background: 'transparent' }}
        />
      </label>
      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={busy}
          className="px-4 py-2 text-[13px] font-semibold text-white"
          style={{ background: '#00B369' }}
        >
          {busy ? 'Saving…' : 'Save record'}
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
