'use client';

import { useState } from 'react';
import { Check, CheckCircle2, Copy, Mail, Shield } from 'lucide-react';

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
  const adminHref = access.adminUrl || `/site/${access.slug}/admin`;
  const campusHref = access.campusUrl || `/dashboard/institutions/${access.slug}`;
  const publicHref = access.platformUrl || `/site/${access.slug}`;

  return (
    <div className="mx-auto max-w-[560px] border p-6 sm:p-8" style={{ borderColor: 'var(--line)' }}>
      <div className="text-center">
        <CheckCircle2 size={28} className="mx-auto mb-3" style={{ color: 'var(--green-deep)' }} />
        <h1 className="font-display text-[26px]">Your campus LMS is live</h1>
        <p className="mt-2 text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
          {access.organizationName || 'Your campus'} now has its own public site, student signup, and
          admin dashboard. Stay here and save your links.
        </p>
      </div>

      <div
        className="mt-6 flex gap-2.5 border px-3.5 py-3.5 text-left text-[13.5px]"
        style={{
          borderColor: 'rgba(0,179,105,0.35)',
          background: 'rgba(0,179,105,0.08)',
          color: 'var(--ink)',
        }}
      >
        <Shield size={18} className="mt-0.5 shrink-0" style={{ color: 'var(--green-deep)' }} />
        <div>
          <p className="font-semibold">Admin dashboard link sent to your email</p>
          <p className="mt-1" style={{ color: 'var(--ink-soft)' }}>
            {access.emailSent ? (
              <>
                Check <strong style={{ color: 'var(--ink)' }}>{access.emailTo}</strong> for the admin
                dashboard link and all access details. Open it anytime to manage courses, branding,
                students, and settings.
              </>
            ) : (
              <>
                Copy the admin link below now
                {access.emailTo ? (
                  <>
                    {' '}
                    (we could not confirm email to{' '}
                    <strong style={{ color: 'var(--ink)' }}>{access.emailTo}</strong>)
                  </>
                ) : null}
                . Ask the Platform Team to resend if needed.
              </>
            )}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <CopyRow label="Admin dashboard (owners)" value={adminHref} />
        <CopyRow label="Admin entry" value={`/site/${access.slug}/admin`} />
        {access.platformUrl ? (
          <CopyRow label="Public campus site (students)" value={access.platformUrl} />
        ) : null}
        {access.shortPathUrl ? (
          <CopyRow label="Short link" value={access.shortPathUrl} />
        ) : null}
        {access.subdomain ? <CopyRow label="Subdomain label" value={access.subdomain} /> : null}
        {access.subdomainUrl || access.platformHost ? (
          <CopyRow
            label="Subdomain host (DNS wildcard)"
            value={access.subdomainUrl || `https://${access.platformHost}`}
          />
        ) : null}
        <CopyRow label="Campus portal (after sign-in)" value={campusHref} />
        <CopyRow
          label="Student sign-in (InTelleX)"
          value={`/login?next=/dashboard/institutions/${access.slug}&campus=${access.slug}`}
        />
      </div>

      <div
        className="mt-5 flex gap-2.5 border px-3.5 py-3 text-left text-[13px]"
        style={{
          borderColor: 'var(--line)',
          background: 'var(--paper-dim)',
          color: 'var(--ink-soft)',
        }}
      >
        <Mail size={16} className="mt-0.5 shrink-0" style={{ color: 'var(--green-deep)' }} />
        <span>
          Share the public site with students. Logo clicks stay on your campus — not InTelleX
          marketing. Preview:{' '}
          <a href={publicHref} className="font-semibold" style={{ color: 'var(--green-deep)' }}>
            open site
          </a>
          .
        </span>
      </div>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <a
          href={adminHref}
          className="inline-flex items-center justify-center px-5 py-2.5 text-[13.5px] font-semibold text-white"
          style={{ background: 'var(--green)' }}
        >
          Open admin dashboard
        </a>
        <a
          href={publicHref}
          className="inline-flex items-center justify-center border px-5 py-2.5 text-[13.5px] font-semibold"
          style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
        >
          View public site
        </a>
      </div>
    </div>
  );
}
