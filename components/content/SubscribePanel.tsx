'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Award, Loader2, Lock, MessageCircle, Sparkles } from 'lucide-react';
import { buildWhatsappLink } from '@/lib/whatsapp';
import type { ContentAccessConfig, LessonLevel } from '@/lib/contentAccess';

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
}: {
  config: ContentAccessConfig;
  level: LessonLevel;
  returnPath: string;
  kind: 'tutorial' | 'course';
  slug: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState('');

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

  const fullPrice = config.oneTimePriceXAF;
  const levelPrice = config.levelPrices[level];

  const waFull = buildWhatsappLink(
    [
      'Hello InTelleX! I want to subscribe to a payable tutorial.',
      '',
      `• Track: ${config.title}`,
      `• Plan: Full curriculum`,
      `• Amount: ${formatXAF(fullPrice)}`,
      config.certificateGuarantee ? '• Certificate guarantee: yes' : '',
      '',
      'I will pay via MoMo / Orange Money after confirmation.',
    ]
      .filter(Boolean)
      .join('\n'),
  );

  const waLevel = buildWhatsappLink(
    [
      'Hello InTelleX! I want to unlock a tutorial level.',
      '',
      `• Track: ${config.title}`,
      `• Level: ${LEVEL_LABEL[level]}`,
      `• Amount: ${formatXAF(levelPrice)}`,
      config.certificateGuarantee ? '• Certificate guarantee: yes' : '',
      '',
      'I will pay via MoMo / Orange Money after confirmation.',
    ]
      .filter(Boolean)
      .join('\n'),
  );

  return (
    <div className="space-y-4">
      {config.certificateGuarantee && (
        <div
          className="flex items-start gap-3 rounded-2xl border px-4 py-3"
          style={{ borderColor: 'rgba(0,179,105,0.35)', background: 'rgba(0,179,105,0.08)' }}
        >
          <Award size={18} style={{ color: 'var(--green-deep)', marginTop: 2 }} />
          <div>
            <div className="text-[14px] font-semibold" style={{ color: 'var(--green-deep)' }}>
              Certificate guarantee
            </div>
            <p className="mt-0.5 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
              Finish this path and earn a completion certificate — guaranteed by the admin pricing rules
              for this track.
            </p>
          </div>
        </div>
      )}

      {config.pricingNote && (
        <p className="text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>
          {config.pricingNote}
        </p>
      )}

      {(config.mode === 'one_time' || config.mode === 'per_level') && (
        <div
          className="rounded-2xl border p-5"
          style={{ borderColor: 'var(--line)', background: 'var(--paper)' }}
        >
          <div className="flex items-center gap-2 text-[13px] font-semibold" style={{ color: 'var(--blue-ink)' }}>
            <Sparkles size={15} /> Full curriculum
          </div>
          <p className="mt-1 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
            Unlock beginner, intermediate, and pro levels in one go.
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
              {fullPrice === 0 ? 'Unlock free' : 'Subscribe · unlock'}
            </button>
            {fullPrice > 0 && (
              <a
                href={waFull}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost !py-2.5 !px-4 text-[13px]"
              >
                <MessageCircle size={14} /> Pay on WhatsApp
              </a>
            )}
          </div>
        </div>
      )}

      {config.mode === 'per_level' && (
        <div
          className="rounded-2xl border p-5"
          style={{ borderColor: 'var(--line)', background: 'var(--paper)' }}
        >
          <div className="flex items-center gap-2 text-[13px] font-semibold" style={{ color: 'var(--green-deep)' }}>
            <Lock size={15} /> {LEVEL_LABEL[level]} only
          </div>
          <p className="mt-1 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
            Unlock just the level you need right now. Other levels stay locked until you subscribe to them.
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {(Object.keys(LEVEL_LABEL) as LessonLevel[]).map((lv) => (
              <div
                key={lv}
                className="rounded-xl border px-3 py-2 text-center"
                style={{
                  borderColor: lv === level ? 'rgba(0,179,105,0.4)' : 'var(--line)',
                  background: lv === level ? 'rgba(0,179,105,0.06)' : 'var(--paper-dim)',
                }}
              >
                <div className="text-[11px] uppercase tracking-wide" style={{ color: 'var(--ink-soft)' }}>
                  {LEVEL_LABEL[lv]}
                </div>
                <div className="mt-0.5 text-[14px] font-semibold">{formatXAF(config.levelPrices[lv])}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={busy !== null}
              onClick={() => subscribe(level)}
              className="btn btn-amber !py-2.5 !px-5 text-[13.5px]"
            >
              {busy === level ? <Loader2 size={15} className="animate-spin" /> : null}
              Unlock {LEVEL_LABEL[level]}
            </button>
            {levelPrice > 0 && (
              <a
                href={waLevel}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost !py-2.5 !px-4 text-[13px]"
              >
                <MessageCircle size={14} /> Pay on WhatsApp
              </a>
            )}
          </div>
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
