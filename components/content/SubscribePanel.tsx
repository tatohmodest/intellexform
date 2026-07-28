'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Award, Loader2, Lock, Sparkles } from 'lucide-react';
import type { ContentAccessConfig, LessonLevel } from '@/lib/contentAccess';
import {
  CERT_MONTHLY_XAF,
  CERT_YEARLY_XAF,
  type CertPlan,
} from '@/lib/learn/certPricing';

const LEVEL_LABEL: Record<LessonLevel, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Pro / Advanced',
};

function formatXAF(n: number) {
  return `${n.toLocaleString('en-US')} XAF`;
}

export default function SubscribePanel({
  config,
  level,
  returnPath,
  kind,
  slug,
  gateReason = 'subscribe_required',
}: {
  config: ContentAccessConfig;
  level: LessonLevel;
  returnPath: string;
  kind: 'tutorial' | 'course';
  slug: string;
  /** cert_required = platform cert plan; subscribe_required = admin-priced track */
  gateReason?: 'subscribe_required' | 'cert_required';
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function payCert(plan: CertPlan) {
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
        router.push(`/login?next=${encodeURIComponent(returnPath)}`);
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

  async function subscribe(scope: 'full' | LessonLevel) {
    setError('');
    setBusy(scope);
    try {
      const res = await fetch('/api/learn/content/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind, slug, scope }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        router.push(`/login?next=${encodeURIComponent(returnPath)}`);
        return;
      }
      if (!res.ok) throw new Error(data.error || 'Could not subscribe');
      router.push(returnPath);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Subscribe failed');
    } finally {
      setBusy(null);
    }
  }

  const showCertPlan = gateReason === 'cert_required' || config.mode === 'free';
  const fullPrice = config.oneTimePriceXAF;
  const yearlySave = CERT_MONTHLY_XAF * 12 - CERT_YEARLY_XAF;

  return (
    <div className="space-y-4">
      <div
        className="flex items-start gap-3 border px-4 py-3"
        style={{ borderColor: 'rgba(0,179,105,0.35)', background: 'rgba(0,179,105,0.08)' }}
      >
        <Award size={18} style={{ color: 'var(--green-deep)', marginTop: 2 }} />
        <div>
          <div className="text-[14px] font-semibold" style={{ color: 'var(--green-deep)' }}>
            Subscribe to get certified
          </div>
          <p className="mt-0.5 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
            Beginner lessons stay free. Intermediate through Pro unlock with a certification plan —
            finish the path and earn your certificate.
          </p>
        </div>
      </div>

      {showCertPlan && (
        <div className="space-y-3 border p-5" style={{ borderColor: 'var(--ink)', background: 'var(--paper)' }}>
          <div className="flex items-center gap-2 text-[13px] font-semibold" style={{ color: 'var(--ink)' }}>
            <Sparkles size={15} /> Certification plans
          </div>
          <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
            Unlock Intermediate → Pro on free courses. Pay with PayUnit (MoMo, Orange Money, card).
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              disabled={busy !== null}
              onClick={() => payCert('monthly')}
              className="border p-4 text-left disabled:opacity-60"
              style={{ borderColor: 'var(--line)' }}
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--ink-soft)' }}>
                Monthly
              </div>
              <div className="mt-1 font-display text-[24px] leading-none">
                {formatXAF(CERT_MONTHLY_XAF)}
                <span className="text-[13px] font-sans font-normal" style={{ color: 'var(--ink-soft)' }}>
                  {' '}/ mo
                </span>
              </div>
              <div className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold" style={{ color: 'var(--green-deep)' }}>
                {busy === 'monthly' ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} />}
                Pay monthly
              </div>
            </button>

            <button
              type="button"
              disabled={busy !== null}
              onClick={() => payCert('yearly')}
              className="border p-4 text-left disabled:opacity-60"
              style={{ borderColor: 'var(--green-deep)', background: 'rgba(0,179,105,0.06)' }}
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--green-deep)' }}>
                Yearly · 10% off
              </div>
              <div className="mt-1 font-display text-[24px] leading-none">
                {formatXAF(CERT_YEARLY_XAF)}
                <span className="text-[13px] font-sans font-normal" style={{ color: 'var(--ink-soft)' }}>
                  {' '}/ yr
                </span>
              </div>
              <p className="mt-1 text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                Save {formatXAF(yearlySave)} vs paying monthly
              </p>
              <div className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold" style={{ color: 'var(--green-deep)' }}>
                {busy === 'yearly' ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} />}
                Pay yearly
              </div>
            </button>
          </div>
        </div>
      )}

      {!showCertPlan && (config.mode === 'one_time' || config.mode === 'per_level') && (
        <div className="border p-5" style={{ borderColor: 'var(--line)', background: 'var(--paper)' }}>
          <div className="flex items-center gap-2 text-[13px] font-semibold" style={{ color: 'var(--blue-ink)' }}>
            <Sparkles size={15} /> Full curriculum
          </div>
          <p className="mt-1 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
            Unlock beginner, intermediate, and pro levels for this track.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="font-display text-[28px]">{formatXAF(fullPrice)}</span>
            <button
              type="button"
              disabled={busy !== null}
              onClick={() => subscribe('full')}
              className="btn btn-primary !py-2.5 !px-5 text-[13.5px]"
            >
              {busy === 'full' ? <Loader2 size={15} className="animate-spin" /> : <Lock size={14} />}
              {fullPrice === 0 ? 'Unlock free' : 'Unlock track'}
            </button>
          </div>
          {config.mode === 'per_level' && (
            <button
              type="button"
              disabled={busy !== null}
              onClick={() => subscribe(level)}
              className="btn btn-ghost mt-3 !py-2.5 !px-5 text-[13.5px]"
            >
              {busy === level ? <Loader2 size={15} className="animate-spin" /> : null}
              Unlock {LEVEL_LABEL[level]} only · {formatXAF(config.levelPrices[level])}
            </button>
          )}
        </div>
      )}

      {error && (
        <p className="text-[13px]" style={{ color: '#b42318' }}>
          {error}
        </p>
      )}
    </div>
  );
}
