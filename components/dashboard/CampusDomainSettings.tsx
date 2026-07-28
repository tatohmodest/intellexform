'use client';

import { useCallback, useEffect, useState } from 'react';
import { Globe2, Loader2 } from 'lucide-react';
import type { InstitutionDomainView } from '@/lib/learn/institutionDomains';

export default function CampusDomainSettings({
  slug,
  accent = '#00b369',
}: {
  slug: string;
  accent?: string;
}) {
  const [domain, setDomain] = useState<InstitutionDomainView | null>(null);
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
      setOk('Domain request sent to InTelleX Platform Admin for approval.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit domain');
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

  return (
    <section className="border-t pt-5" style={{ borderColor: 'var(--line)' }}>
      <h3 className="mb-2 inline-flex items-center gap-2 font-display text-[18px]">
        <Globe2 size={16} /> Campus domain
      </h3>
      <p className="mb-4 text-[13.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
        Give this campus its own hostname. Students open your domain and land on your InTelleX
        campus interface. InTelleX Platform Admin approves and can change the domain anytime.
      </p>

      {domain && (
        <div
          className="mb-4 border px-3 py-2.5 text-[13px]"
          style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}
        >
          <div className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--ink-soft)' }}>
            Status · {status}
          </div>
          {domain.customDomain && (
            <p className="mt-1 font-semibold" style={{ color: 'var(--ink)' }}>
              Active: {domain.customDomain}
            </p>
          )}
          {domain.pendingCustomDomain && (
            <p className="mt-1" style={{ color: 'var(--ink-soft)' }}>
              Pending approval: {domain.pendingCustomDomain}
            </p>
          )}
          {domain.subdomain && (
            <p className="mt-1" style={{ color: 'var(--ink-soft)' }}>
              Subdomain: {domain.subdomain}.{domain.cnameTarget}
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
            Optional InTelleX subdomain
          </label>
          <input
            className="form-input !rounded-none text-[13px]"
            placeholder="yourschool"
            value={subdomain}
            onChange={(e) => setSubdomain(e.target.value)}
          />
          <p className="mt-1 text-[12px]" style={{ color: 'var(--ink-soft)' }}>
            Becomes {subdomain || 'yourschool'}.{domain?.cnameTarget || 'cname.intellex.cm'} when
            activated.
          </p>
        </div>

        <div
          className="border px-3 py-2.5 text-[12.5px] leading-relaxed"
          style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}
        >
          Point a <strong style={{ color: 'var(--ink)' }}>CNAME</strong> from your domain to{' '}
          <code style={{ color: 'var(--ink)' }}>{domain?.cnameTarget || 'cname.intellex.cm'}</code>,
          then submit. Platform Admin reviews DNS and activates the domain for this campus.
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center gap-2 px-3 py-2 text-[13px] font-semibold text-white disabled:opacity-60"
            style={{ background: accent }}
          >
            {busy ? <Loader2 size={14} className="animate-spin" /> : null}
            {status === 'active' ? 'Request domain change' : 'Submit domain for approval'}
          </button>
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
