'use client';

import { useState } from 'react';
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

const METHODS = ['MTN Mobile Money', 'Orange Money', 'Bank transfer', 'Card', 'Cash', 'Other'];

export default function FeesDesk({
  structures,
  outstanding,
  canWrite,
  canPay,
}: {
  structures: Structure[];
  outstanding: Outstanding[];
  canWrite: boolean;
  canPay: boolean;
}) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [program, setProgram] = useState('');
  const [structureId, setStructureId] = useState('');
  const [payAmt, setPayAmt] = useState<Record<string, string>>({});
  const [method, setMethod] = useState(METHODS[0]);
  const [busy, setBusy] = useState('');
  const [msg, setMsg] = useState('');

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
      setMsg(data.title ? `Charged ${data.charged} student(s).` : 'Saved.');
      setTitle('');
      setAmount('');
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
            <button
              type="button"
              disabled={!structureId || busy === 'charge'}
              onClick={() => post({ action: 'charge', structureId, allActive: true }, 'charge')}
              className="border px-4 py-2 text-[13px] font-semibold"
              style={{ borderColor: 'var(--line)' }}
            >
              {busy === 'charge' ? 'Charging…' : 'Charge all active students'}
            </button>
            <p className="mt-2 text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
              Applies this fee to active and admitted student records. Individual charges can also be recorded on a student profile.
            </p>
          </div>
        </section>
      ) : null}

      <section>
        <h2 className="mb-3 font-display text-[20px]">Outstanding fees</h2>
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
                  <div>
                    <p className="font-semibold">{row.name}</p>
                    <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                      {row.email} · {row.title}
                    </p>
                    <p className="mt-1 text-[13px]">
                      {formatXAF(row.outstandingXAF)} due of {formatXAF(row.amountXAF)}
                    </p>
                  </div>
                  {canPay ? (
                    <form
                      className="flex flex-wrap items-center gap-2"
                      onSubmit={(e) => {
                        e.preventDefault();
                        post(
                          {
                            action: 'pay',
                            studentUserId: row.studentUserId,
                            chargeId: row.id,
                            amountXAF: Number(payAmt[row.id] || row.outstandingXAF),
                            method,
                          },
                          `pay-${row.id}`,
                        );
                      }}
                    >
                      <input
                        type="number"
                        min={1}
                        value={payAmt[row.id] ?? String(row.outstandingXAF)}
                        onChange={(e) => setPayAmt((m) => ({ ...m, [row.id]: e.target.value }))}
                        className="w-28 border px-2 py-1.5 text-[13px]"
                        style={{ borderColor: 'var(--line)', background: 'transparent' }}
                      />
                      <select
                        value={method}
                        onChange={(e) => setMethod(e.target.value)}
                        className="border px-2 py-1.5 text-[13px]"
                        style={{ borderColor: 'var(--line)', background: 'transparent' }}
                      >
                        {METHODS.map((m) => (
                          <option key={m}>{m}</option>
                        ))}
                      </select>
                      <button
                        type="submit"
                        disabled={busy === `pay-${row.id}`}
                        className="px-3 py-1.5 text-[12.5px] font-semibold text-white"
                        style={{ background: '#00B369' }}
                      >
                        Record payment
                      </button>
                    </form>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
