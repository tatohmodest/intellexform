'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Loader2, Smartphone } from 'lucide-react';
import { formatXAF } from '@/lib/format';

export type PayOperator = 'MTN' | 'ORANGE';

type Phase = 'form' | 'sending' | 'waiting' | 'paid' | 'failed';

type VerifyResult = {
  status?: string;
  paid?: boolean;
  continueHref?: string;
  courseName?: string;
};

export default function DirectPayForm({
  amountXAF,
  label,
  extraBody,
  onPaid,
  compact,
  loginHref,
}: {
  amountXAF: number;
  label: string;
  extraBody: Record<string, unknown>;
  onPaid?: (data: VerifyResult) => void;
  compact?: boolean;
  loginHref?: string;
}) {
  const router = useRouter();
  const [operator, setOperator] = useState<PayOperator>('MTN');
  const [phone, setPhone] = useState('');
  const [phase, setPhase] = useState<Phase>('form');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [mock, setMock] = useState(false);
  const [continueHref, setContinueHref] = useState('');

  useEffect(() => {
    if (phase !== 'waiting' || !transactionId) return undefined;
    let stop = false;
    let ticks = 0;
    async function tick() {
      try {
        const res = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transactionId }),
        });
        const data = (await res.json().catch(() => ({}))) as VerifyResult;
        if (stop) return;
        if (data.paid) {
          setPhase('paid');
          setContinueHref(data.continueHref || '');
          onPaid?.(data);
          router.refresh();
          return;
        }
        if (data.status === 'failed') {
          setPhase('failed');
          setError('Payment was not completed. Try again.');
        }
      } catch {
        /* keep waiting */
      }
    }
    tick();
    const id = window.setInterval(() => {
      ticks += 1;
      if (ticks > 80) {
        window.clearInterval(id);
        return;
      }
      tick();
    }, 3000);
    return () => {
      stop = true;
      window.clearInterval(id);
    };
  }, [phase, transactionId, onPaid, router]);

  async function startPay() {
    setError('');
    setPhase('sending');
    try {
      const res = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...extraBody,
          phone,
          operator,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        transactionId?: string;
        mock?: boolean;
        message?: string;
        direct?: boolean;
      };
      if (res.status === 401) {
        if (loginHref) {
          router.push(loginHref);
          return;
        }
        setPhase('form');
        setError('Sign in to pay.');
        return;
      }
      if (!res.ok || !data.transactionId) {
        throw new Error(data.error || 'Could not start payment');
      }
      setTransactionId(data.transactionId);
      setMock(Boolean(data.mock));
      setMessage(
        data.message ||
          `Approve the payment on your ${operator === 'ORANGE' ? 'Orange Money' : 'MTN MoMo'} phone.`,
      );
      setPhase('waiting');
    } catch (err) {
      setPhase('form');
      setError(err instanceof Error ? err.message : 'Could not start payment');
    }
  }

  async function confirmMock() {
    if (!transactionId) return;
    setError('');
    try {
      const done = await fetch('/api/payments/mock-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId, outcome: 'success' }),
      });
      if (!done.ok) throw new Error('Could not confirm sandbox payment');
      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId }),
      });
      const data = (await res.json().catch(() => ({}))) as VerifyResult;
      if (data.paid) {
        setPhase('paid');
        setContinueHref(data.continueHref || '');
        onPaid?.(data);
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not confirm payment');
    }
  }

  if (phase === 'paid') {
    return (
      <div className="rounded-2xl border px-4 py-5 text-center" style={{ borderColor: 'rgba(0,179,105,0.35)', background: 'rgba(0,179,105,0.08)' }}>
        <CheckCircle2 size={22} className="mx-auto" style={{ color: 'var(--green-deep)' }} />
        <p className="mt-2 text-[14.5px] font-semibold">Payment confirmed</p>
        <p className="mt-1 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
          Access is unlocking on this page. Stay here — you do not need to leave Intellex.
        </p>
        {continueHref ? (
          <button
            type="button"
            className="btn btn-primary mt-4 !px-5 !py-2.5 text-[13.5px]"
            onClick={() => router.push(continueHref)}
          >
            Continue
          </button>
        ) : null}
      </div>
    );
  }

  if (phase === 'waiting' || phase === 'sending') {
    return (
      <div className="rounded-2xl border px-4 py-5" style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}>
        <div className="flex items-start gap-3">
          <Loader2 size={18} className="mt-0.5 animate-spin" style={{ color: 'var(--green-deep)' }} />
          <div>
            <p className="text-[14.5px] font-semibold">
              {phase === 'sending' ? 'Sending the prompt to your phone…' : 'Approve on your phone'}
            </p>
            <p className="mt-1 text-[13.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              {message ||
                `Check your ${operator === 'ORANGE' ? 'Orange Money' : 'MTN MoMo'} handset and approve ${formatXAF(amountXAF)}. Stay on this page — we confirm it here.`}
            </p>
          </div>
        </div>
        {mock ? (
          <button
            type="button"
            className="btn btn-primary mt-4 w-full !py-2.5 text-[13.5px]"
            onClick={confirmMock}
          >
            Confirm sandbox payment
          </button>
        ) : null}
        {error ? (
          <p className="mt-3 text-[13px]" style={{ color: '#b91c1c' }}>
            {error}
          </p>
        ) : null}
        {phase === 'waiting' ? (
          <button
            type="button"
            className="mt-3 text-[13px] font-semibold"
            style={{ color: 'var(--green-deep)' }}
            onClick={() => {
              setPhase('form');
              setTransactionId('');
            }}
          >
            Use a different number
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <form
      className={compact ? 'space-y-3' : 'space-y-3 rounded-2xl border p-4'}
      style={compact ? undefined : { borderColor: 'var(--line)', background: 'var(--paper-dim)' }}
      onSubmit={(e) => {
        e.preventDefault();
        startPay();
      }}
    >
      <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
        Pay on this page with MTN MoMo or Orange Money. A prompt is sent to your phone — no redirect.
      </p>
      <div className="grid grid-cols-2 gap-2">
        {(['MTN', 'ORANGE'] as const).map((op) => {
          const active = operator === op;
          return (
            <button
              key={op}
              type="button"
              onClick={() => setOperator(op)}
              className="rounded-xl border px-3 py-2.5 text-[13.5px] font-semibold"
              style={{
                borderColor: active ? 'var(--green-deep)' : 'var(--line)',
                background: active ? 'rgba(0,179,105,0.1)' : 'var(--paper)',
                color: 'var(--ink)',
              }}
            >
              {op === 'MTN' ? 'MTN MoMo' : 'Orange Money'}
            </button>
          );
        })}
      </div>
      <label className="block text-[13px] font-semibold">
        Mobile number
        <input
          className="form-input mt-1.5"
          inputMode="tel"
          autoComplete="tel"
          placeholder="6XX XXX XXX"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </label>
      {error || phase === 'failed' ? (
        <p className="text-[13px]" style={{ color: '#b91c1c' }}>
          {error || 'Payment did not go through. Try again.'}
        </p>
      ) : null}
      <button type="submit" className="btn btn-primary w-full !py-3 text-[14px]" disabled={!phone.trim()}>
        <Smartphone size={16} />
        {label} · {formatXAF(amountXAF)}
      </button>
    </form>
  );
}
