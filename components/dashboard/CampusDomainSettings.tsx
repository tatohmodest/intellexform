'use client';

import { useCallback, useEffect, useState } from 'react';
import { Globe2, Loader2 } from 'lucide-react';
import type { InstitutionDomainView } from '@/lib/learn/institutionDomains';

type DnsInstructions = {
  type: string;
  name: string;
  value: string;
  ttl: string;
  host: string;
};

export default function CampusDomainSettings({
  slug,
  accent = '#00b369',
}: {
  slug: string;
  accent?: string;
}) {
  const [domain, setDomain] = useState<InstitutionDomainView | null>(null);
  const [dnsInstructions, setDnsInstructions] = useState<DnsInstructions | null>(null);
  const [customDomain, setCustomDomain] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');

  const load = useCallback(async () => {
    const res = await fetch(`/api/learn/institutions/${encodeURIComponent(slug)}/domain`);
    const data = await res.json();
    if (res.ok && data.domain) {
      setDomain(data.domain);
      setDnsInstructions(data.dnsInstructions || null);
      setCustomDomain(data.domain.pendingCustomDomain || data.domain.customDomain || '');
      setSubdomain(data.domain.subdomain || '');
    }
  }, [slug]);

  useEffect(() => {
    load().catch(() => {});
  }, [load]);

  async function requestDomain(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    setOk('');
    try {
      const res = await fetch(`/api/learn/institutions/${encodeURIComponent(slug)}/domain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'request',
          domain: customDomain,
          subdomain: subdomain || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const map: Record<string, string> = {
          invalid_domain: 'Enter a valid hostname (e.g. learn.yourschool.edu).',
          platform_host: 'That host belongs to InTelleX itself.',
          domain_taken: 'Another campus already uses that domain.',
          subdomain_taken: 'That subdomain is already taken.',
          forbidden: 'Only the campus owner can change the domain.',
        };
        throw new Error(map[data.error] || data.error || 'Could not submit domain');
      }
      setDomain(data.domain);
      setDnsInstructions(data.dnsInstructions || null);
      setOk('Domain saved. Add the DNS CNAME below, then click Verify Domain.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit domain');
    } finally {
      setBusy(false);
    }
  }

  async function verifyDomain() {
    setBusy(true);
    setError('');
    setOk('');
    try {
      const res = await fetch(`/api/learn/institutions/${encodeURIComponent(slug)}/domain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify' }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.dns?.message || data.error || 'DNS verification failed');
      }
      setDomain(data.domain);
      setOk(data.dns?.message || 'Domain verified and activated.');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not verify domain');
    } finally {
      setBusy(false);
    }
  }

  async function cancelPending() {
    setBusy(true);
    setError('');
    try {
      const res = await fetch(`/api/learn/institutions/${encodeURIComponent(slug)}/domain`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not cancel');
      setDomain(data.domain);
      setOk('Pending request cancelled.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not cancel');
    } finally {
      setBusy(false);
    }
  }

  const status = domain?.domainStatus || 'none';
  const instructions = dnsInstructions;

  return (
    <section className="border-t pt-5" style={{ borderColor: 'var(--line)' }}>
      <h3 className="mb-2 inline-flex items-center gap-2 font-display text-[18px]">
        <Globe2 size={16} /> Domains
      </h3>
      <p className="mb-4 text-[13.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
        Every organization gets an Intellex subdomain. Connect your own custom domain so learners
        open your LMS on your brand. DNS ownership is verified automatically.
      </p>

      {domain && (
        <div
          className="mb-4 border px-3 py-2.5 text-[13px]"
          style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}
        >
          <div className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--ink-soft)' }}>
            Status · {status}
          </div>
          {domain.subdomain && (
            <p className="mt-1 font-semibold" style={{ color: 'var(--ink)' }}>
              Intellex domain: {domain.subdomain}.{domain.cnameTarget}
            </p>
          )}
          {domain.customDomain && (
            <p className="mt-1 font-semibold" style={{ color: 'var(--ink)' }}>
              Custom domain: {domain.customDomain}
            </p>
          )}
          {domain.pendingCustomDomain && (
            <p className="mt-1" style={{ color: 'var(--ink-soft)' }}>
              Pending verification: {domain.pendingCustomDomain}
            </p>
          )}
          {domain.domainNotes && (
            <p className="mt-1 text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
              {domain.domainNotes}
            </p>
          )}
        </div>
      )}

      <form onSubmit={requestDomain} className="space-y-3">
        <div>
          <label className="mb-1 block text-[12.5px] font-semibold">Custom domain</label>
          <input
            className="form-input !rounded-none text-[13px]"
            placeholder="learn.yourschool.edu"
            value={customDomain}
            onChange={(e) => setCustomDomain(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-[12.5px] font-semibold">
            Intellex subdomain
          </label>
          <input
            className="form-input !rounded-none text-[13px]"
            placeholder="yourschool"
            value={subdomain}
            onChange={(e) => setSubdomain(e.target.value)}
          />
          <p className="mt-1 text-[12px]" style={{ color: 'var(--ink-soft)' }}>
            Becomes {subdomain || 'yourschool'}.{domain?.cnameTarget || 'cname.intellex.cm'}
          </p>
        </div>

        {instructions ? (
          <div
            className="border px-3 py-2.5 text-[12.5px] leading-relaxed"
            style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}
          >
            <p className="font-semibold" style={{ color: 'var(--ink)' }}>
              DNS instructions for {instructions.host}
            </p>
            <ul className="mt-2 space-y-1 font-mono text-[12px]" style={{ color: 'var(--ink)' }}>
              <li>Type: {instructions.type}</li>
              <li>Name: {instructions.name}</li>
              <li>Value: {instructions.value}</li>
              <li>TTL: {instructions.ttl}</li>
            </ul>
            <p className="mt-2">
              Add this record at Cloudflare, GoDaddy, Namecheap, or your DNS provider. You do not
              need to transfer the domain to Intellex.
            </p>
          </div>
        ) : (
          <div
            className="border px-3 py-2.5 text-[12.5px] leading-relaxed"
            style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}
          >
            Point a <strong style={{ color: 'var(--ink)' }}>CNAME</strong> from your domain to{' '}
            <code style={{ color: 'var(--ink)' }}>{domain?.cnameTarget || 'cname.intellex.cm'}</code>,
            then verify.
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center gap-2 px-3 py-2 text-[13px] font-semibold text-white disabled:opacity-60"
            style={{ background: accent }}
          >
            {busy ? <Loader2 size={14} className="animate-spin" /> : null}
            {status === 'active' ? 'Update domain' : 'Connect custom domain'}
          </button>
          {Boolean(domain?.pendingCustomDomain || domain?.customDomain) && (
            <button
              type="button"
              disabled={busy}
              onClick={verifyDomain}
              className="border px-3 py-2 text-[13px] font-semibold disabled:opacity-60"
              style={{ borderColor: 'var(--line)' }}
            >
              Verify Domain
            </button>
          )}
          {Boolean(domain?.pendingCustomDomain) && (
            <button
              type="button"
              disabled={busy}
              onClick={cancelPending}
              className="border px-3 py-2 text-[13px] font-semibold disabled:opacity-60"
              style={{ borderColor: 'var(--line)' }}
            >
              Cancel pending
            </button>
          )}
        </div>
      </form>

      {ok && (
        <p className="mt-2 text-[13px]" style={{ color: 'var(--green-deep)' }}>
          {ok}
        </p>
      )}
      {error && (
        <p className="mt-2 text-[13px]" style={{ color: '#b91c1c' }}>
          {error}
        </p>
      )}
    </section>
  );
}
