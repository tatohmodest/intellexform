'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Globe2, Loader2, Save } from 'lucide-react';
import AdminGate from '@/components/admin/AdminGate';
import AdminShell from '@/components/admin/AdminShell';
import { CAPABILITY_PACKS, MODULE_CATALOG, type CapabilityPack } from '@/lib/eduos/capabilities';

export default function AdminInstitutionDetailPage() {
  return (
    <AdminGate>
      {({ email, logout }) => (
        <AdminShell email={email} onLogout={logout}>
          <InstitutionEditor />
        </AdminShell>
      )}
    </AdminGate>
  );
}

function InstitutionEditor() {
  const params = useParams();
  const id = String(params.id || '');
  const router = useRouter();
  const [inst, setInst] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    email: '',
    website: '',
    country: '',
    primaryColor: '#00b369',
    logoUrl: '',
    coverUrl: '',
    status: 'ACTIVE',
    capabilityPack: 'foundation' as CapabilityPack,
    enabledModules: [] as string[],
    visibility: 'PRIVATE',
  });
  const [domainForm, setDomainForm] = useState({
    domain: '',
    subdomain: '',
    notes: '',
  });

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/platform?resource=institutions&id=${encodeURIComponent(id)}`)
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || 'Not found');
        setInst(data);
        setForm({
          name: String(data.name || ''),
          description: String(data.description || ''),
          email: String(data.email || ''),
          website: String(data.website || ''),
          country: String(data.country || ''),
          primaryColor: String(data.primaryColor || '#00b369'),
          logoUrl: String(data.logoUrl || ''),
          coverUrl: String(data.coverUrl || ''),
          status: String(data.status || 'ACTIVE'),
          capabilityPack: (data.capabilityPack as CapabilityPack) || 'foundation',
          enabledModules: (data.enabledModules as string[]) || [],
          visibility: String(data.visibility || 'PRIVATE'),
        });
        setDomainForm({
          domain: String(data.pendingCustomDomain || data.customDomain || ''),
          subdomain: String(data.subdomain || ''),
          notes: '',
        });
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed'));
  }, [id]);

  async function save() {
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/admin/platform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_institution', id, ...form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      setInst(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setBusy(false);
    }
  }

  async function provision() {
    setBusy(true);
    try {
      const res = await fetch('/api/admin/platform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'provision_institution', id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Provision failed');
      setInst(data);
      setForm((f) => ({ ...f, status: String(data.status || f.status) }));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Provision failed');
    } finally {
      setBusy(false);
    }
  }

  async function manageDomain(domainAction: string, extra: Record<string, unknown> = {}) {
    if (!inst?.slug) return;
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/admin/platform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'manage_institution_domain',
          slug: inst.slug,
          domainAction,
          domain: domainForm.domain || undefined,
          subdomain: domainForm.subdomain || null,
          notes: domainForm.notes || undefined,
          ...extra,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Domain action failed');
      if (data.institution) {
        setInst(data.institution);
        setDomainForm({
          domain: String(
            data.institution.pendingCustomDomain || data.institution.customDomain || '',
          ),
          subdomain: String(data.institution.subdomain || ''),
          notes: '',
        });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Domain action failed');
    } finally {
      setBusy(false);
    }
  }

  if (!inst && !error) {
    return (
      <p className="flex items-center gap-2 text-sm" style={{ color: 'var(--ink-soft)' }}>
        <Loader2 size={14} className="animate-spin" /> Loading institution…
      </p>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <Link
        href="/admin/institutions"
        className="inline-flex items-center gap-1.5 text-[13px] font-semibold"
        style={{ color: 'var(--ink-soft)' }}
      >
        <ArrowLeft size={14} /> All institutions
      </Link>

      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: 'var(--ink-soft)' }}>
          Full edit · {String(inst?.slug || id)}
        </p>
        <h1 className="font-display text-[28px]">{form.name || 'Institution'}</h1>
      </div>

      {error ? (
        <p className="text-sm" style={{ color: '#b91c1c' }}>
          {error}
        </p>
      ) : null}

      <div className="grid gap-4">
        {(
          [
            ['name', 'Name'],
            ['email', 'Email'],
            ['website', 'Website'],
            ['country', 'Country'],
            ['primaryColor', 'Primary color'],
            ['logoUrl', 'Logo URL'],
            ['coverUrl', 'Cover URL'],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="block">
            <span className="mb-1 block text-xs font-semibold uppercase" style={{ color: 'var(--ink-soft)' }}>
              {label}
            </span>
            <input
              className="form-input !rounded-none"
              value={form[key]}
              onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            />
          </label>
        ))}

        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase" style={{ color: 'var(--ink-soft)' }}>
            About
          </span>
          <textarea
            className="form-input !rounded-none"
            rows={4}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase" style={{ color: 'var(--ink-soft)' }}>
              Status
            </span>
            <select
              className="form-input !rounded-none"
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
            >
              {['PENDING', 'PROVISIONING', 'ACTIVE', 'SUSPENDED', 'REJECTED', 'ARCHIVED'].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase" style={{ color: 'var(--ink-soft)' }}>
              Visibility
            </span>
            <select
              className="form-input !rounded-none"
              value={form.visibility}
              onChange={(e) => setForm((f) => ({ ...f, visibility: e.target.value }))}
            >
              <option value="PUBLIC">PUBLIC</option>
              <option value="PRIVATE">PRIVATE</option>
            </select>
          </label>
        </div>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase" style={{ color: 'var(--ink-soft)' }}>
            Capability pack
          </span>
          <select
            className="form-input !rounded-none"
            value={form.capabilityPack}
            onChange={(e) =>
              setForm((f) => ({ ...f, capabilityPack: e.target.value as CapabilityPack }))
            }
          >
            {Object.entries(CAPABILITY_PACKS).map(([k, v]) => (
              <option key={k} value={k}>
                {v.name}
              </option>
            ))}
            <option value="custom">Custom</option>
          </select>
        </label>

        {form.capabilityPack === 'custom' ? (
          <div className="grid max-w-full gap-2 overflow-hidden sm:grid-cols-2">
            {MODULE_CATALOG.map((m) => {
              const on = form.enabledModules.includes(m.id);
              return (
                <label key={m.id} className="flex min-w-0 gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="mt-1 shrink-0"
                    checked={on}
                    onChange={() =>
                      setForm((f) => ({
                        ...f,
                        enabledModules: on
                          ? f.enabledModules.filter((x) => x !== m.id)
                          : [...f.enabledModules, m.id],
                      }))
                    }
                  />
                  <span className="min-w-0 break-words">{m.name}</span>
                </label>
              );
            })}
          </div>
        ) : null}
      </div>

      <div className="space-y-3 border p-4" style={{ borderColor: 'var(--line)' }}>
        <h2 className="inline-flex items-center gap-2 font-display text-lg">
          <Globe2 size={16} /> Campus domain
        </h2>
        <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
          InTelleX can approve, change, or revoke the hostname for this campus interface. Point a
          CNAME to <code>{String(inst?.cnameTarget || 'cname.intellex.cm')}</code>.
        </p>
        <div className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
          Status: <strong style={{ color: 'var(--ink)' }}>{String(inst?.domainStatus || 'none')}</strong>
          {inst?.customDomain ? <> · Active: {String(inst.customDomain)}</> : null}
          {inst?.pendingCustomDomain ? <> · Pending: {String(inst.pendingCustomDomain)}</> : null}
        </div>
        <input
          className="form-input !rounded-none"
          placeholder="learn.school.edu"
          value={domainForm.domain}
          onChange={(e) => setDomainForm((f) => ({ ...f, domain: e.target.value }))}
        />
        <input
          className="form-input !rounded-none"
          placeholder="Optional subdomain label"
          value={domainForm.subdomain}
          onChange={(e) => setDomainForm((f) => ({ ...f, subdomain: e.target.value }))}
        />
        <input
          className="form-input !rounded-none"
          placeholder="Admin notes"
          value={domainForm.notes}
          onChange={(e) => setDomainForm((f) => ({ ...f, notes: e.target.value }))}
        />
        <div className="flex flex-wrap gap-2">
          {inst?.pendingCustomDomain ? (
            <>
              <button
                type="button"
                className="btn btn-primary !rounded-none"
                disabled={busy}
                onClick={() =>
                  manageDomain('approve', { domain: String(inst.pendingCustomDomain) })
                }
              >
                Approve pending
              </button>
              <button
                type="button"
                className="btn !rounded-none"
                disabled={busy}
                onClick={() => manageDomain('reject')}
              >
                Reject
              </button>
            </>
          ) : null}
          <button
            type="button"
            className="btn btn-primary !rounded-none"
            disabled={busy || !domainForm.domain.trim()}
            onClick={() => manageDomain('set')}
          >
            Set / change domain
          </button>
          {inst?.customDomain || inst?.pendingCustomDomain ? (
            <button
              type="button"
              className="btn !rounded-none"
              style={{ color: '#b91c1c' }}
              disabled={busy}
              onClick={() => manageDomain('revoke')}
            >
              Revoke
            </button>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-[13.5px] font-semibold text-white"
          style={{ background: 'var(--green)' }}
          disabled={busy}
          onClick={save}
        >
          {busy ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          Save all changes
        </button>
        <button
          type="button"
          className="btn btn-ghost !rounded-none"
          disabled={busy}
          onClick={provision}
        >
          Provision & activate
        </button>
        <button type="button" className="btn btn-ghost !rounded-none" onClick={() => router.refresh()}>
          Refresh
        </button>
      </div>
    </div>
  );
}
