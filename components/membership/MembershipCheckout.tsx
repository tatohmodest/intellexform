'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import {
  STUDENT_MONTHLY_XAF,
  STUDENT_YEARLY_XAF,
  type CertPlan,
} from '@/lib/learn/studentMembership';
import DirectPayForm from '@/components/payments/DirectPayForm';

export default function MembershipCheckout({ signedIn }: { signedIn: boolean }) {
  const router = useRouter();
  const [plan, setPlan] = useState<CertPlan>('yearly');
  const yearlySave = STUDENT_MONTHLY_XAF * 12 - STUDENT_YEARLY_XAF;
  const amount = plan === 'yearly' ? STUDENT_YEARLY_XAF : STUDENT_MONTHLY_XAF;

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
          ? 'Choose monthly or yearly, then pay with MTN MoMo or Orange Money on this page.'
          : 'Create a free account, then complete membership checkout.'}
      </p>

      <button
        type="button"
        className="mb-3 flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition hover:shadow-card"
        style={{
          borderColor: plan === 'monthly' ? 'var(--green-deep)' : 'var(--line)',
          background: plan === 'monthly' ? 'rgba(0,179,105,0.06)' : 'transparent',
        }}
        onClick={() => setPlan('monthly')}
      >
        <div>
          <div className="text-[14px] font-semibold">Monthly</div>
          <div className="text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
            Best to start
          </div>
        </div>
        <div className="text-right">
          <div className="font-display text-[22px]" style={{ color: 'var(--green-deep)' }}>
            {STUDENT_MONTHLY_XAF.toLocaleString('en-US')}
          </div>
          <div className="text-[11px]" style={{ color: 'var(--ink-soft)' }}>XAF / month</div>
        </div>
      </button>

      <button
        type="button"
        className="mb-5 flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition hover:shadow-card"
        style={{
          borderColor: plan === 'yearly' ? 'rgba(0,179,105,0.45)' : 'var(--line)',
          background: 'rgba(0,179,105,0.06)',
        }}
        onClick={() => setPlan('yearly')}
      >
        <div>
          <div className="text-[14px] font-semibold">Yearly · save 10%</div>
          <div className="text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
            Save {yearlySave.toLocaleString('en-US')} XAF vs monthly
          </div>
        </div>
        <div className="text-right">
          <div className="font-display text-[22px]" style={{ color: 'var(--green-deep)' }}>
            {STUDENT_YEARLY_XAF.toLocaleString('en-US')}
          </div>
          <div className="text-[11px]" style={{ color: 'var(--ink-soft)' }}>XAF / year</div>
        </div>
      </button>

      {signedIn ? (
        <DirectPayForm
          key={plan}
          amountXAF={amount}
          label={plan === 'yearly' ? 'Pay yearly' : 'Pay monthly'}
          extraBody={{ kind: 'cert_subscription', plan }}
          loginHref="/login?next=/membership"
          onPaid={() => router.refresh()}
        />
      ) : (
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
