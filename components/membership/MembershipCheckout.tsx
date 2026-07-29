'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, Sparkles } from 'lucide-react';
import {
  STUDENT_MONTHLY_XAF,
  STUDENT_YEARLY_XAF,
  type CertPlan,
} from '@/lib/learn/studentMembership';

export default function MembershipCheckout({ signedIn }: { signedIn: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState<CertPlan | null>(null);
  const [error, setError] = useState('');
  const yearlySave = STUDENT_MONTHLY_XAF * 12 - STUDENT_YEARLY_XAF;

  async function pay(plan: CertPlan) {
    if (!signedIn) {
      router.push('/signup?next=/membership');
      return;
    }
    setError('');
    setBusy(plan);
    try {
      const res = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind: 'cert_subscription', plan }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        router.push('/login?next=/membership');
        return;
      }
      if (!res.ok || !data.transactionUrl) {
        throw new Error(data.error || 'Could not start payment');
      }
      window.location.href = data.transactionUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
      setBusy(null);
    }
  }

  return (
    <div
      className="rounded-[24px] border p-6 sm:p-7"
      style={{ borderColor: 'var(--ink)', background: 'var(--paper)' }}
    >
      <div className="mb-1 flex items-center gap-2 text-[13px] font-semibold">
        <Sparkles size={15} style={{ color: 'var(--green-deep)' }} />
        InTelleX Student plans
      </div>
      <p className="mb-5 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
        {signedIn
          ? 'Choose monthly or yearly. You will be redirected to PayUnit.'
          : 'Create a free account, then complete membership checkout.'}
      </p>

      <button
        type="button"
        className="mb-3 flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition hover:shadow-card"
        style={{ borderColor: 'var(--line)' }}
        disabled={busy !== null}
        onClick={() => pay('monthly')}
      >
        <div>
          <div className="text-[14px] font-semibold">Monthly</div>
          <div className="text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
            Best to start
          </div>
        </div>
        <div className="text-right">
          <div className="font-display text-[22px]" style={{ color: 'var(--green-deep)' }}>
            {busy === 'monthly' ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>{STUDENT_MONTHLY_XAF.toLocaleString('en-US')}</>
            )}
          </div>
          <div className="text-[11px]" style={{ color: 'var(--ink-soft)' }}>XAF / month</div>
        </div>
      </button>

      <button
        type="button"
        className="flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition hover:shadow-card"
        style={{ borderColor: 'rgba(0,179,105,0.45)', background: 'rgba(0,179,105,0.06)' }}
        disabled={busy !== null}
        onClick={() => pay('yearly')}
      >
        <div>
          <div className="text-[14px] font-semibold">Yearly · save 10%</div>
          <div className="text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
            Save {yearlySave.toLocaleString('en-US')} XAF vs monthly
          </div>
        </div>
        <div className="text-right">
          <div className="font-display text-[22px]" style={{ color: 'var(--green-deep)' }}>
            {busy === 'yearly' ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>{STUDENT_YEARLY_XAF.toLocaleString('en-US')}</>
            )}
          </div>
          <div className="text-[11px]" style={{ color: 'var(--ink-soft)' }}>XAF / year</div>
        </div>
      </button>

      {error && (
        <p className="mt-3 text-[13px]" style={{ color: '#b91c1c' }}>{error}</p>
      )}

      {!signedIn && (
        <p className="mt-4 text-center text-[13px]" style={{ color: 'var(--ink-soft)' }}>
          Already have an account?{' '}
          <Link href="/login?next=/membership" className="font-semibold" style={{ color: 'var(--green-deep)' }}>
            Log in
          </Link>
        </p>
      )}
    </div>
  );
}
