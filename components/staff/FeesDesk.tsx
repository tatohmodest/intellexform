'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatXAF } from '@/lib/staff/permissions';

type Structure = { id: string; title: string; amountXAF: number; program: string; active: boolean };
type Outstanding = {
  id: string;
  studentUserId: string;
  name: string;
  email: string;
  title: string;
  amountXAF: number;
  paidXAF: number;
  outstandingXAF: number;
};
type Course = { id: string; title: string; students: number; source: string };
type StudentHit = { userId: string; name: string; email: string; studentCode: string; status: string };

const METHODS = ['MTN Mobile Money', 'Orange Money', 'Bank transfer', 'Card', 'Cash', 'Other'];

function localNowInput() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function StudentSearch({
  value,
  onPick,
}: {
  value: StudentHit | null;
  onPick: (s: StudentHit | null) => void;
}) {
  const [q, setQ] = useState(value ? `${value.name} · ${value.email}` : '');
  const [hits, setHits] = useState<StudentHit[]>([]);

  useEffect(() => {
    if (value) setQ(`${value.name} · ${value.email}`);
  }, [value]);

  useEffect(() => {
    if (q.trim().length < 2 || value) {
      setHits([]);
      return;
    }
    const t = setTimeout(() => {
      fetch(`/api/staff/students?q=${encodeURIComponent(q.trim())}`)
        .then((r) => r.json())
        .then((d) => setHits((d.students || []).slice(0, 8)))
        .catch(() => setHits([]));
    }, 220);
    return () => clearTimeout(t);
  }, [q, value]);

  return (
    <div className="relative">
      <input
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          if (value) onPick(null);
        }}
        placeholder="Search name, email, or matricule"
        className="w-full border px-3 py-2 text-[14px]"
        style={{ borderColor: 'var(--line)', background: 'transparent' }}
      />
      {hits.length > 0 ? (
        <ul
          className="absolute z-20 mt-1 max-h-56 w-full overflow-auto border bg-paper shadow"
          style={{ borderColor: 'var(--line)' }}
        >
          {hits.map((s) => (
            <li key={s.userId}>
              <button
                type="button"
                className="block w-full px-3 py-2 text-left text-[13px] hover:bg-black/[0.04]"
                onClick={() => {
                  onPick(s);
                  setHits([]);
                }}
              >
                <span className="font-semibold">{s.name}</span>
                <span className="mt-0.5 block" style={{ color: 'var(--ink-soft)' }}>
                  {s.email}
                  {s.studentCode ? ` · ${s.studentCode}` : ''}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default function FeesDesk({
  structures,
  outstanding,
  courses,
  canWrite,
  canPay,
}: {
  structures: Structure[];
  outstanding: Outstanding[];
  courses: Course[];
  canWrite: boolean;
  canPay: boolean;
}) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [program, setProgram] = useState('');
  const [structureId, setStructureId] = useState('');
  const [target, setTarget] = useState<'one' | 'course' | 'all'>('one');
  const [student, setStudent] = useState<StudentHit | null>(null);
  const [courseId, setCourseId] = useState('');
  const [payStudent, setPayStudent] = useState<StudentHit | null>(null);
  const [payAmount, setPayAmount] = useState('');
  const [payAt, setPayAt] = useState(localNowInput());
  const [payMethod, setPayMethod] = useState(METHODS[0]);
  const [payRef, setPayRef] = useState('');
  const [payNote, setPayNote] = useState('');
  const [payChargeId, setPayChargeId] = useState('');
  const [busy, setBusy] = useState('');
  const [msg, setMsg] = useState('');
  const [selectedCharges, setSelectedCharges] = useState<string[]>([]);

  const payCharges = outstanding.filter((o) => o.studentUserId === payStudent?.userId);

  async function post(body: Record<string, unknown>, key: string) {
    setBusy(key);
    setMsg('');
    try {
      const res = await fetch('/api/staff/fees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Request failed');
      setMsg(
        data.charged
          ? `Charged ${data.charged} student${data.charged === 1 ? '' : 's'}.`
          : data.deleted
            ? `Deleted ${data.deleted} fee request${data.deleted === 1 ? '' : 's'}.`
          : data.payment
            ? `Recorded ${formatXAF(Number(data.payment.amountXAF || 0))} (${data.payment.receiptCode}).`
            : 'Saved.',
      );
      setTitle('');
      setAmount('');
      setSelectedCharges([]);
      router.refresh();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setBusy('');
    }
  }

  return (
    <div className="space-y-8">
      {msg ? (
        <p className="text-[14px]" style={{ color: 'var(--ink-soft)' }}>
          {msg}
        </p>
      ) : null}

      {canWrite ? (
        <section className="grid gap-4 lg:grid-cols-2">
          <form
            className="border p-4"
            style={{ borderColor: 'var(--line)' }}
            onSubmit={(e) => {
              e.preventDefault();
              post({ action: 'create', title, amountXAF: Number(amount), program }, 'create');
            }}
          >
            <h2 className="mb-3 font-display text-[20px]">Fee structure</h2>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Tuition · 2026"
              className="mb-2 w-full border px-3 py-2 text-[14px]"
              style={{ borderColor: 'var(--line)', background: 'transparent' }}
            />
            <input
              required
              type="number"
              min={1}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount (XAF)"
              className="mb-2 w-full border px-3 py-2 text-[14px]"
              style={{ borderColor: 'var(--line)', background: 'transparent' }}
            />
            <input
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              placeholder="Program (optional)"
              className="mb-3 w-full border px-3 py-2 text-[14px]"
              style={{ borderColor: 'var(--line)', background: 'transparent' }}
            />
            <button
              type="submit"
              disabled={busy === 'create'}
              className="px-4 py-2 text-[13px] font-semibold text-white"
              style={{ background: '#00B369' }}
            >
              {busy === 'create' ? 'Saving…' : 'Create fee'}
            </button>
          </form>

          <div className="border p-4" style={{ borderColor: 'var(--line)' }}>
            <h2 className="mb-3 font-display text-[20px]">Charge students</h2>
            <select
              value={structureId}
              onChange={(e) => setStructureId(e.target.value)}
              className="mb-3 w-full border px-3 py-2 text-[14px]"
              style={{ borderColor: 'var(--line)', background: 'transparent' }}
            >
              <option value="">Choose a fee structure</option>
              {structures.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title} · {formatXAF(s.amountXAF)}
                </option>
              ))}
            </select>
            <div className="mb-3 flex flex-wrap gap-2 text-[12.5px] font-semibold">
              {(
                [
                  ['one', 'One person'],
                  ['course', 'One course'],
                  ['all', 'All official students'],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTarget(id)}
                  className="border px-3 py-1.5"
                  style={{
                    borderColor: target === id ? 'var(--ink)' : 'var(--line)',
                    background: target === id ? 'var(--ink)' : 'transparent',
                    color: target === id ? '#fff' : 'var(--ink)',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            {target === 'one' ? (
              <div className="mb-3">
                <StudentSearch value={student} onPick={setStudent} />
              </div>
            ) : null}
            {target === 'course' ? (
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="mb-3 w-full border px-3 py-2 text-[14px]"
                style={{ borderColor: 'var(--line)', background: 'transparent' }}
              >
                <option value="">Choose a course</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} · {c.students} student{c.students === 1 ? '' : 's'}
                  </option>
                ))}
              </select>
            ) : null}
            <button
              type="button"
              disabled={
                !structureId ||
                busy === 'charge' ||
                (target === 'one' && !student) ||
                (target === 'course' && !courseId)
              }
              onClick={() =>
                post(
                  {
                    action: 'charge',
                    structureId,
                    studentUserId: target === 'one' ? student?.userId : undefined,
                    courseId: target === 'course' ? courseId : undefined,
                    allActive: target === 'all',
                  },
                  'charge',
                )
              }
              className="border px-4 py-2 text-[13px] font-semibold"
              style={{ borderColor: 'var(--line)' }}
            >
              {busy === 'charge'
                ? 'Charging…'
                : target === 'one'
                  ? 'Charge this person'
                  : target === 'course'
                    ? 'Charge this course'
                    : 'Charge official students'}
            </button>
            <p className="mt-2 text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
              “All official students” only includes admitted/active student records — not every InTelleX user.
            </p>
          </div>
        </section>
      ) : null}

      {canPay ? (
        <section className="border p-4" style={{ borderColor: 'var(--line)' }}>
          <h2 className="mb-1 font-display text-[20px]">Record a payment</h2>
          <p className="mb-4 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
            Staff can log that a student paid a specific amount at a specific time (cash, MoMo, transfer).
          </p>
          <form
            className="grid gap-3 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!payStudent) return;
              post(
                {
                  action: 'pay',
                  studentUserId: payStudent.userId,
                  chargeId: payChargeId || undefined,
                  amountXAF: Number(payAmount),
                  method: payMethod,
                  reference: payRef,
                  note: payNote,
                  paidAt: payAt ? new Date(payAt).toISOString() : undefined,
                },
                'pay-manual',
              );
            }}
          >
            <label className="block text-[13px] font-semibold sm:col-span-2">
              Student
              <div className="mt-1.5 font-normal">
                <StudentSearch value={payStudent} onPick={setPayStudent} />
              </div>
            </label>
            <label className="block text-[13px] font-semibold">
              Amount (XAF)
              <input
                required
                type="number"
                min={1}
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                placeholder="50000"
                className="mt-1.5 w-full border px-3 py-2 font-normal"
                style={{ borderColor: 'var(--line)', background: 'transparent' }}
              />
            </label>
            <label className="block text-[13px] font-semibold">
              Paid at
              <input
                required
                type="datetime-local"
                value={payAt}
                onChange={(e) => setPayAt(e.target.value)}
                className="mt-1.5 w-full border px-3 py-2 font-normal"
                style={{ borderColor: 'var(--line)', background: 'transparent' }}
              />
            </label>
            <label className="block text-[13px] font-semibold">
              Method
              <select
                value={payMethod}
                onChange={(e) => setPayMethod(e.target.value)}
                className="mt-1.5 w-full border px-3 py-2 font-normal"
                style={{ borderColor: 'var(--line)', background: 'transparent' }}
              >
                {METHODS.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </label>
            <label className="block text-[13px] font-semibold">
              Reference / receipt no. (optional)
              <input
                value={payRef}
                onChange={(e) => setPayRef(e.target.value)}
                className="mt-1.5 w-full border px-3 py-2 font-normal"
                style={{ borderColor: 'var(--line)', background: 'transparent' }}
              />
            </label>
            <label className="block text-[13px] font-semibold sm:col-span-2">
              Apply to charge (optional)
              <select
                value={payChargeId}
                onChange={(e) => setPayChargeId(e.target.value)}
                className="mt-1.5 w-full border px-3 py-2 font-normal"
                style={{ borderColor: 'var(--line)', background: 'transparent' }}
              >
                <option value="">Oldest open charge, or create one</option>
                {payCharges.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} · {formatXAF(c.outstandingXAF)} due
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-[13px] font-semibold sm:col-span-2">
              Note (optional)
              <input
                value={payNote}
                onChange={(e) => setPayNote(e.target.value)}
                className="mt-1.5 w-full border px-3 py-2 font-normal"
                style={{ borderColor: 'var(--line)', background: 'transparent' }}
              />
            </label>
            <div>
              <button
                type="submit"
                disabled={busy === 'pay-manual' || !payStudent}
                className="px-4 py-2 text-[13px] font-semibold text-white"
                style={{ background: '#00B369' }}
              >
                {busy === 'pay-manual' ? 'Saving…' : 'Record payment'}
              </button>
            </div>
          </form>
        </section>
      ) : null}

      <section>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-[20px]">Outstanding fees</h2>
          {canWrite && outstanding.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="border px-3 py-1.5 text-[12.5px]"
                style={{ borderColor: 'var(--line)' }}
                onClick={() =>
                  setSelectedCharges(
                    selectedCharges.length === outstanding.length ? [] : outstanding.map((r) => r.id),
                  )
                }
              >
                {selectedCharges.length === outstanding.length ? 'Clear selection' : 'Select all'}
              </button>
              <button
                type="button"
                disabled={!selectedCharges.length || busy === 'delete-selected'}
                onClick={() => {
                  if (!confirm(`Delete ${selectedCharges.length} selected fee request${selectedCharges.length === 1 ? '' : 's'}?`)) return;
                  post({ action: 'delete_charges', chargeIds: selectedCharges }, 'delete-selected');
                }}
                className="border px-3 py-1.5 text-[12.5px] font-semibold disabled:opacity-40"
                style={{ borderColor: 'var(--line)', color: '#b91c1c' }}
              >
                {busy === 'delete-selected' ? 'Deleting…' : `Delete selected (${selectedCharges.length})`}
              </button>
            </div>
          ) : null}
        </div>
        {outstanding.length === 0 ? (
          <div className="rounded-2xl border border-dashed px-4 py-8 text-center" style={{ borderColor: 'var(--line)' }}>
            <p className="font-display text-[18px]">No outstanding balances</p>
            <p className="mt-1 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
              When fees are charged, open balances will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {outstanding.map((row) => (
              <article key={row.id} className="border p-4" style={{ borderColor: 'var(--line)' }}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    {canWrite ? (
                      <input
                        type="checkbox"
                        className="mt-1"
                        checked={selectedCharges.includes(row.id)}
                        onChange={(e) =>
                          setSelectedCharges((ids) =>
                            e.target.checked ? [...ids, row.id] : ids.filter((id) => id !== row.id),
                          )
                        }
                      />
                    ) : null}
                    <div>
                    <p className="font-semibold">{row.name}</p>
                    <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                      {row.email} · {row.title}
                    </p>
                    <p className="mt-1 text-[13px]">
                      {formatXAF(row.outstandingXAF)} due of {formatXAF(row.amountXAF)}
                    </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {canPay ? (
                      <button
                        type="button"
                        className="px-3 py-1.5 text-[12.5px] font-semibold text-white"
                        style={{ background: '#00B369' }}
                        onClick={() => {
                          setPayStudent({
                            userId: row.studentUserId,
                            name: row.name,
                            email: row.email,
                            studentCode: '',
                            status: 'active',
                          });
                          setPayAmount(String(row.outstandingXAF));
                          setPayChargeId(row.id);
                          setPayAt(localNowInput());
                        }}
                      >
                        Fill payment form
                      </button>
                    ) : null}
                    {canWrite ? (
                      <button
                        type="button"
                        disabled={busy === `del-${row.id}`}
                        onClick={() => {
                          if (!confirm(`Delete this fee charge for ${row.name}?`)) return;
                          post({ action: 'delete_charge', chargeId: row.id }, `del-${row.id}`);
                        }}
                        className="border px-3 py-1.5 text-[12.5px] font-semibold"
                        style={{ borderColor: 'var(--line)', color: '#b91c1c' }}
                      >
                        {busy === `del-${row.id}` ? '…' : 'Delete'}
                      </button>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
