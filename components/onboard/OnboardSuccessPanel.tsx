'use client';

import { useState } from 'react';
import { Check, CheckCircle2, Copy, Mail } from 'lucide-react';

export type OnboardAccessDetails = {
  slug: string;
  organizationName?: string;
  subdomain?: string;
  platformHost?: string;
  platformUrl?: string;
  subdomainUrl?: string;
  shortPathUrl?: string;
  adminUrl?: string;
  campusUrl?: string;
  emailSent?: boolean;
  emailTo?: string;
};

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  if (!value) return null;

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  }

  return (
    <div
      className="flex flex-wrap items-center gap-2 border px-3 py-2.5 text-left"
      style={{ borderColor: 'var(--line)' }}
    >
      <div className="min-w-0 flex-1">
        <p
          className="font-mono text-[10px] uppercase tracking-[0.12em]"
          style={{ color: 'var(--ink-soft)' }}
        >
          {label}
        </p>
        <p className="mt-0.5 break-all font-mono text-[13px]" style={{ color: 'var(--ink)' }}>
          {value}
        </p>
      </div>
      <button
        type="button"
        onClick={copy}
        className="inline-flex shrink-0 items-center gap-1 border px-2.5 py-1.5 text-[12px] font-semibold"
        style={{ borderColor: 'var(--line)', color: copied ? 'var(--green-deep)' : 'var(--ink)' }}
      >
        {copied ? <Check size={13} /> : <Copy size={13} />}
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}

export default function OnboardSuccessPanel({ access }: { access: OnboardAccessDetails }) {
  const adminHref = access.adminUrl || `/dashboard/institutions/${access.slug}/admin`;
  const campusHref = access.campusUrl || `/dashboard/institutions/${access.slug}`;

  return (
    <div className="mx-auto max-w-[560px] border p-6 sm:p-8" style={{ borderColor: 'var(--line)' }}>
      <div className="text-center">
        <CheckCircle2 size={28} className="mx-auto mb-3" style={{ color: 'var(--green-deep)' }} />
        <h1 className="font-display text-[26px]">Your LMS is ready</h1>
        <p className="mt-2 text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
          {access.organizationName || 'Your campus'} is live on InTelleX. Stay on this page and copy
          your access details — nothing will redirect you away.
        </p>
      </div>

      <div className="mt-6 space-y-2">
        {access.subdomain ? <CopyRow label="Subdomain label" value={access.subdomain} /> : null}
        {access.platformUrl ? (
          <CopyRow label="Public campus site (works now)" value={access.platformUrl} />
        ) : null}
        {access.shortPathUrl ? (
          <CopyRow label="Short link" value={access.shortPathUrl} />
        ) : null}
        {access.subdomainUrl || access.platformHost ? (
          <CopyRow
            label="Subdomain host (DNS wildcard)"
            value={access.subdomainUrl || `https://${access.platformHost}`}
          />
        ) : null}
        <CopyRow label="Admin dashboard" value={adminHref} />
        <CopyRow label="Campus portal" value={campusHref} />
      </div>

      <div
        className="mt-5 flex gap-2.5 border px-3.5 py-3 text-left text-[13px]"
        style={{
          borderColor: access.emailSent ? 'rgba(0,179,105,0.35)' : 'var(--line)',
          background: access.emailSent ? 'rgba(0,179,105,0.06)' : 'var(--paper-dim)',
          color: 'var(--ink-soft)',
        }}
      >
        <Mail size={16} className="mt-0.5 shrink-0" style={{ color: 'var(--green-deep)' }} />
        <span>
          {access.emailSent ? (
            <>
              We emailed the full access details to{' '}
              <strong style={{ color: 'var(--ink)' }}>{access.emailTo}</strong>. Check inbox (and
              spam) so you can open them later.
            </>
          ) : (
            <>
              Copy the links above now. We could not confirm the completion email
              {access.emailTo ? (
                <>
                  {' '}
                  to <strong style={{ color: 'var(--ink)' }}>{access.emailTo}</strong>
                </>
              ) : null}
              — ask the Platform Team to resend if needed.
            </>
          )}
        </span>
      </div>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <a
          href={adminHref}
          className="inline-flex items-center justify-center px-5 py-2.5 text-[13.5px] font-semibold text-white"
          style={{ background: 'var(--green)' }}
        >
          Open admin
        </a>
        <a
          href={campusHref}
          className="inline-flex items-center justify-center border px-5 py-2.5 text-[13.5px] font-semibold"
          style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
        >
          Open campus
        </a>
      </div>
    </div>
  );
}
