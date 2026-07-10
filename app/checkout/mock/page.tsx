'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, Lock, Smartphone } from 'lucide-react';
import { formatXAF } from '@/lib/format';

function MockInner() {
  const params = useSearchParams();
  const router = useRouter();
  const transactionId = params.get('transaction_id') || '';
  const course = params.get('course') || 'Your course';
  const amount = Number(params.get('amount') || 0);
  const [loading, setLoading] = useState<'success' | 'failed' | null>(null);

  async function complete(outcome: 'success' | 'failed') {
    setLoading(outcome);
    try {
      await fetch('/api/payments/mock-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId, outcome }),
      });
    } finally {
      router.push(`/checkout/return?transaction_id=${transactionId}`);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4" style={{ background: 'var(--paper-dim)' }}>
      <div className="w-full max-w-md rounded-[20px] border bg-paper p-8 shadow-card" style={{ borderColor: 'var(--line)' }}>
        <div className="mb-6 flex items-center gap-2 font-mono text-xs uppercase tracking-wide" style={{ color: 'var(--green-deep)' }}>
          <Lock size={14} /> Secure checkout · Sandbox
        </div>
        <p className="mb-1 text-sm" style={{ color: 'var(--ink-soft)' }}>You are paying for</p>
        <h1 className="mb-4 font-display text-[22px]">{course}</h1>
        <div className="mb-6 rounded-xl border p-4" style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}>
          <div className="flex items-center justify-between">
            <span className="text-sm" style={{ color: 'var(--ink-soft)' }}>Total</span>
            <span className="font-display text-[22px] font-semibold">{formatXAF(amount)}</span>
          </div>
        </div>
        <p className="mb-4 flex items-center gap-2 text-xs" style={{ color: 'var(--ink-soft)' }}>
          <Smartphone size={14} /> Pay with MTN MoMo, Orange Money or card via PayUnit.
        </p>
        <button onClick={() => complete('success')} disabled={loading !== null} className="btn btn-primary mb-3 w-full">
          {loading === 'success' ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
          Pay {formatXAF(amount)} now
        </button>
        <button onClick={() => complete('failed')} disabled={loading !== null} className="btn btn-ghost w-full">
          Cancel payment
        </button>
        <p className="mt-4 text-center text-[11px]" style={{ color: 'var(--ink-soft)' }}>
          Sandbox checkout — shown because PayUnit API keys aren&apos;t configured yet. Add them to enable
          real MoMo / Orange / card payments.
        </p>
      </div>
    </div>
  );
}

export default function MockCheckoutPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center">Loading…</div>}>
      <MockInner />
    </Suspense>
  );
}
