'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Building2,
  Users,
  Wallet,
  Network,
  ClipboardCheck,
  LayoutDashboard,
  RefreshCw,
  Ban,
  CheckCircle2,
  XCircle,
  Eye,
  Plus,
  Trash2,
  Shield,
  Globe2,
} from 'lucide-react';
import { CAPABILITY_PACKS, MODULE_CATALOG, type CapabilityPack } from '@/lib/eduos/capabilities';
import { COMMERCIAL_PLANS, type CommercialPlanId } from '@/lib/eduos/plans';
import { formatXAF } from '@/lib/format';
import ImageUploadField from '@/components/media/ImageUploadField';
import ColorPickerField from '@/components/media/ColorPickerField';
import { normalizeHexColor } from '@/lib/imageColor';

type Section =
  | 'overview'
  | 'institutions'
  | 'personnel'
  | 'finance'
  | 'governance'
  | 'connections'
  | 'onboarding'
  | 'catalogue';

function fmt(d: string | Date | null | undefined) {
  if (!d) return '-';
  return new Date(d).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function moneyXaf(n: number | null | undefined) {
  return formatXAF(n ?? 0);
}

async function apiGet(resource: string, params: Record<string, string> = {}) {
  const qs = new URLSearchParams({ resource, ...params });
  const res = await fetch(`/api/admin/platform?${qs}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

async function apiPost(body: Record<string, unknown>) {
  const res = await fetch('/api/admin/platform', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

function Stat({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}>
      <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--ink-soft)' }}>
        {label}
      </p>
      <p className="mt-1 font-display text-2xl font-bold">{value}</p>
      {hint ? (
        <p className="mt-1 text-xs" style={{ color: 'var(--ink-soft)' }}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function Badge({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: 'ok' | 'warn' | 'bad' | 'neutral' }) {
  const bg =
    tone === 'ok'
      ? 'rgba(0,179,105,0.12)'
      : tone === 'warn'
        ? 'rgba(217,119,6,0.12)'
        : tone === 'bad'
          ? 'rgba(220,38,38,0.12)'
          : 'var(--paper-dim)';
  const color =
    tone === 'ok' ? 'var(--green-deep)' : tone === 'warn' ? '#b45309' : tone === 'bad' ? '#b91c1c' : 'var(--ink-soft)';
  return (
    <span className="inline-flex rounded-full px-2 py-0.5 text-xs font-semibold" style={{ background: bg, color }}>
      {children}
    </span>
  );
}

export default function PlatformControlPlane({
  initialSection = 'overview',
}: {
  initialSection?: Section;
}) {
  const [section, setSection] = useState<Section>(initialSection);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [overview, setOverview] = useState<Record<string, unknown> | null>(null);
  const [institutions, setInstitutions] = useState<Record<string, unknown>[]>([]);
  const [selectedInst, setSelectedInst] = useState<Record<string, unknown> | null>(null);
  const [personnel, setPersonnel] = useState<Record<string, unknown>[]>([]);
  const [finance, setFinance] = useState<Record<string, unknown> | null>(null);
  const [governance, setGovernance] = useState<Record<string, unknown> | null>(null);
  const [connections, setConnections] = useState<Record<string, unknown> | null>(null);
  const [onboarding, setOnboarding] = useState<Record<string, unknown> | null>(null);
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    ownerEmail: '',
    capabilityPack: 'foundation' as CapabilityPack,
    country: '',
  });
  const [purgeMsg, setPurgeMsg] = useState('');

  useEffect(() => {
    setSection(initialSection);
    setSelectedInst(null);
  }, [initialSection]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      if (section === 'overview') setOverview(await apiGet('overview'));
      if (section === 'institutions') {
        setInstitutions(await apiGet('institutions', q ? { q } : {}));
      }
      if (section === 'personnel') {
        setPersonnel(await apiGet('personnel', q ? { q } : {}));
      }
      if (section === 'finance') setFinance(await apiGet('finance'));
      if (section === 'governance') setGovernance(await apiGet('governance'));
      if (section === 'connections') setConnections(await apiGet('connections'));
      if (section === 'onboarding') setOnboarding(await apiGet('onboarding_invites'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [section, q]);

  useEffect(() => {
    load();
  }, [load]);

  async function openInstitution(id: string) {
    setBusy(true);
    setError('');
    try {
      setSelectedInst(await apiGet('institutions', { id }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setBusy(false);
    }
  }

  async function run(action: string, body: Record<string, unknown> = {}) {
    setBusy(true);
    setError('');
    try {
      const result = await apiPost({ action, ...body });
      await load();
      if (selectedInst && (body.id || body.userId || selectedInst.id)) {
        const id = String(body.id || selectedInst.id);
        if (action.includes('institution') || action.includes('membership') || action.includes('provision')) {
          try {
            setSelectedInst(await apiGet('institutions', { id }));
          } catch {
            /* ignore */
          }
        }
      }
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed');
      throw err;
    } finally {
      setBusy(false);
    }
  }

  const NAV: { id: Section; label: string; icon: typeof Users }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'institutions', label: 'Institutions', icon: Building2 },
    { id: 'personnel', label: 'Personnel', icon: Users },
    { id: 'finance', label: 'Finance', icon: Wallet },
    { id: 'governance', label: 'Applications', icon: ClipboardCheck },
    { id: 'connections', label: 'Connections', icon: Network },
    { id: 'onboarding', label: 'Onboarding', icon: ClipboardCheck },
    { id: 'catalogue', label: 'Catalogue', icon: Trash2 },
  ];

  const ov = overview as {
    institutions?: { total: number; byStatus: Record<string, number> };
    users?: number;
    memberships?: number;
    courses?: number;
    finance?: {
      paidRevenueXaf: number;
      pendingWithdrawals: number;
      activeSubscriptions: number;
      walletBalanceTotal: number;
    };
    queue?: {
      institutionApplications: number;
      instructorApplications: number;
      mentorApplications: number;
    };
    recentAudit?: Array<Record<string, unknown>>;
  } | null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold">
            {NAV.find((n) => n.id === section)?.label || 'Platform'}
          </h2>
          <p className="mt-1 max-w-2xl text-sm" style={{ color: 'var(--ink-soft)' }}>
            Supabase / Prisma control plane. Institutions from Mongo are synced here so you can edit
            every campus - including InTelleX.
          </p>
        </div>
        <button type="button" onClick={load} className="btn btn-ghost" disabled={loading || busy}>
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* Keep in-page section switcher only when used as embedded overview hub */}
      {initialSection === 'overview' && section === 'overview' ? null : null}

      <div className="hidden">
        {NAV.map((n) => (
          <button key={n.id} type="button" onClick={() => setSection(n.id)}>
            {n.label}
          </button>
        ))}
      </div>

      {error ? (
        <div className="rounded-xl px-4 py-3 text-sm" style={{ background: 'rgba(220,38,38,0.08)', color: '#b91c1c' }}>
          {error}
        </div>
      ) : null}

      {loading && !overview && section === 'overview' ? (
        <p className="py-12 text-center text-sm" style={{ color: 'var(--ink-soft)' }}>
          Loading platform data…
        </p>
      ) : null}

      {section === 'overview' && ov ? (
        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Institutions" value={ov.institutions?.total ?? 0} hint={JSON.stringify(ov.institutions?.byStatus || {})} />
            <Stat label="Users" value={ov.users ?? 0} hint={`${ov.memberships ?? 0} active memberships`} />
            <Stat label="Paid revenue" value={moneyXaf(ov.finance?.paidRevenueXaf)} hint={`${ov.finance?.activeSubscriptions ?? 0} active subs`} />
            <Stat
              label="Pending withdrawals"
              value={ov.finance?.pendingWithdrawals ?? 0}
              hint={`Wallets total ${ov.finance?.walletBalanceTotal ?? 0}`}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat label="Inst. applications" value={ov.queue?.institutionApplications ?? 0} />
            <Stat label="Instructor apps" value={ov.queue?.instructorApplications ?? 0} />
            <Stat label="Mentor apps" value={ov.queue?.mentorApplications ?? 0} />
          </div>
          <div>
            <h3 className="mb-3 font-display text-lg font-semibold">Recent audit</h3>
            <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: 'var(--line)' }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: 'var(--paper-dim)' }}>
                    {['When', 'Action', 'Entity', 'Summary', 'Actor'].map((h) => (
                      <th key={h} className="px-3 py-2 text-left text-xs" style={{ color: 'var(--ink-soft)' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(ov.recentAudit || []).map((a) => (
                    <tr key={String(a.id)} className="border-t" style={{ borderColor: 'var(--line)' }}>
                      <td className="px-3 py-2">{fmt(a.createdAt as string)}</td>
                      <td className="px-3 py-2">{String(a.action)}</td>
                      <td className="px-3 py-2">
                        {String(a.entityType || '-')}
                      </td>
                      <td className="px-3 py-2">{String(a.summary || '-')}</td>
                      <td className="px-3 py-2">
                        {String((a.actor as { email?: string } | null)?.email || '-')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}

      {section === 'institutions' ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <input
                className="form-input flex-1"
                placeholder="Search institutions…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <button type="button" className="btn btn-primary" onClick={() => setCreateOpen(true)}>
                <Plus size={14} /> Create
              </button>
            </div>
            <div className="space-y-2">
              {institutions.map((inst) => (
                <div
                  key={String(inst.id)}
                  className="w-full rounded-2xl border p-4 text-left"
                  style={{
                    borderColor: selectedInst?.id === inst.id ? 'var(--green-deep)' : 'var(--line)',
                    background: 'var(--paper-dim)',
                  }}
                >
                  <button type="button" className="w-full text-left" onClick={() => openInstitution(String(inst.id))}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold">{String(inst.name)}</p>
                        <p className="text-xs" style={{ color: 'var(--ink-soft)' }}>
                          /{String(inst.slug)} · pack {String(inst.capabilityPack)}
                        </p>
                      </div>
                      <Badge
                        tone={
                          inst.status === 'ACTIVE' ? 'ok' : inst.status === 'SUSPENDED' ? 'bad' : 'warn'
                        }
                      >
                        {String(inst.status)}
                      </Badge>
                    </div>
                    <p className="mt-2 text-xs" style={{ color: 'var(--ink-soft)' }}>
                      {(inst._count as { memberships?: number; courses?: number })?.memberships ?? 0} members ·{' '}
                      {(inst._count as { courses?: number })?.courses ?? 0} courses
                      {inst.customDomain || inst.pendingCustomDomain ? (
                        <span className="mt-1 block text-[11px]" style={{ color: 'var(--ink-soft)' }}>
                          Domain: {String(inst.customDomain || inst.pendingCustomDomain)}
                          {inst.pendingCustomDomain ? ' · pending' : ''}
                        </span>
                      ) : null}
                    </p>
                  </button>
                  <a
                    href={`/admin/institutions/${String(inst.id)}`}
                    className="mt-3 inline-block text-[12.5px] font-semibold"
                    style={{ color: 'var(--green-deep)' }}
                  >
                    Open full editor →
                  </a>
                </div>
              ))}
              {!loading && institutions.length === 0 ? (
                <p className="py-8 text-center text-sm" style={{ color: 'var(--ink-soft)' }}>
                  No institutions yet. Create one or approve an application.
                </p>
              ) : null}
            </div>
          </div>

          <div className="rounded-2xl border p-5" style={{ borderColor: 'var(--line)' }}>
            {!selectedInst ? (
              <p className="py-16 text-center text-sm" style={{ color: 'var(--ink-soft)' }}>
                Select an institution to view personnel, courses, packs, and withdrawals.
              </p>
            ) : (
              <InstitutionDetail
                inst={selectedInst}
                busy={busy}
                onProvision={() => run('provision_institution', { id: selectedInst.id })}
                onUpdatePack={async (pack, modules) => {
                  await run('update_institution', {
                    id: selectedInst.id,
                    capabilityPack: pack,
                    enabledModules: modules,
                  });
                }}
                onStatus={async (status) => {
                  await run('update_institution', { id: selectedInst.id, status });
                }}
                onBrand={async (fields) => {
                  await run('update_institution', { id: selectedInst.id, ...fields });
                }}
                onSuspendMember={async (membershipId, suspend) => {
                  await run('suspend_membership', { membershipId, suspend });
                }}
                onDomain={async (payload) => {
                  const result = (await run('manage_institution_domain', {
                    slug: selectedInst.slug,
                    id: selectedInst.id,
                    ...payload,
                  })) as { institution?: Record<string, unknown> };
                  if (result?.institution) setSelectedInst(result.institution);
                }}
              />
            )}
          </div>
        </div>
      ) : null}

      {section === 'personnel' ? (
        <div className="space-y-3">
          <input
            className="form-input max-w-md"
            placeholder="Search users by email or name…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: 'var(--line)' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'var(--paper-dim)' }}>
                  {['User', 'Role', 'Campuses', 'Wallet', 'Status', ''].map((h) => (
                    <th key={h || 'a'} className="px-3 py-2 text-left text-xs" style={{ color: 'var(--ink-soft)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {personnel.map((u) => {
                  const banned = Boolean(u.bannedAt);
                  const memberships = (u.memberships as Array<Record<string, unknown>>) || [];
                  return (
                    <tr key={String(u.id)} className="border-t" style={{ borderColor: 'var(--line)' }}>
                      <td className="px-3 py-3">
                        <p className="font-semibold">{String(u.name || u.email)}</p>
                        <p className="text-xs" style={{ color: 'var(--ink-soft)' }}>
                          {String(u.email)}
                        </p>
                      </td>
                      <td className="px-3 py-3">{String(u.globalRole)}</td>
                      <td className="px-3 py-3 text-xs">
                        {memberships
                          .map((m) => (m.institution as { name?: string })?.name)
                          .filter(Boolean)
                          .join(', ') || '-'}
                      </td>
                      <td className="px-3 py-3">
                        {(u.wallet as { balance?: number } | null)?.balance ?? 0}
                      </td>
                      <td className="px-3 py-3">
                        <Badge tone={banned ? 'bad' : 'ok'}>{banned ? 'Banned' : 'Active'}</Badge>
                      </td>
                      <td className="px-3 py-3">
                        <button
                          type="button"
                          className="btn btn-ghost"
                          style={{ padding: '6px 10px', color: banned ? 'var(--green-deep)' : '#b91c1c' }}
                          disabled={busy}
                          onClick={() =>
                            run(banned ? 'unban_user' : 'ban_user', {
                              userId: u.id,
                              reason: banned ? undefined : 'Platform ban by admin',
                            })
                          }
                        >
                          <Ban size={14} /> {banned ? 'Unban' : 'Ban'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {section === 'finance' && finance ? (
        <FinancePanel finance={finance} busy={busy} onReview={(id, decision) => run('review_withdrawal', { id, decision })} />
      ) : null}

      {section === 'governance' && governance ? (
        <GovernancePanel
          data={governance}
          busy={busy}
          onReviewInst={(id, decision, pack) =>
            run('review_institution_application', { id, decision, capabilityPack: pack })
          }
        />
      ) : null}

      {section === 'connections' && connections ? (
        <ConnectionsPanel data={connections} />
      ) : null}

      {section === 'onboarding' ? (
        <OnboardingInvitesPanel
          data={onboarding}
          busy={busy}
          onCreate={async (payload) => {
            const r = await run('create_onboarding_invite', payload);
            setOnboarding(await apiGet('onboarding_invites'));
            return r;
          }}
          onRefresh={load}
        />
      ) : null}

      {section === 'catalogue' ? (
        <div className="max-w-xl space-y-4 rounded-2xl border p-6" style={{ borderColor: 'var(--line)' }}>
          <h3 className="font-display text-lg font-semibold">Mongo catalogue cleanup</h3>
          <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>
            Imported Udemy-style courses are no longer seeded. Purge leftovers from the Mongo
            `courses` collection. New catalogue entries should come from Course Studio / admin create
            only. Prisma courses live under each institution.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="btn btn-primary"
              disabled={busy}
              onClick={async () => {
                const r = await run('purge_imported_catalogue');
                setPurgeMsg(`Removed ${r.deleted} imported courses (${r.before} → ${r.after}).`);
              }}
            >
              <Trash2 size={14} /> Purge imported / non-Intellex
            </button>
            <button
              type="button"
              className="btn"
              style={{ background: 'rgba(220,38,38,0.1)', color: '#b91c1c' }}
              disabled={busy}
              onClick={async () => {
                if (!confirm('Delete ALL Mongo catalogue courses?')) return;
                const r = await run('purge_all_catalogue');
                setPurgeMsg(`Wiped catalogue: deleted ${r.deleted}.`);
              }}
            >
              Wipe entire Mongo catalogue
            </button>
          </div>
          {purgeMsg ? (
            <p className="text-sm" style={{ color: 'var(--green-deep)' }}>
              {purgeMsg}
            </p>
          ) : null}
        </div>
      ) : null}

      {createOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(19,32,25,0.55)' }}
          onClick={() => setCreateOpen(false)}
        >
          <div
            className="w-full max-w-md space-y-4 rounded-2xl border p-6"
            style={{ borderColor: 'var(--line)', background: 'var(--paper)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display text-xl font-bold">Create institution</h3>
            <input
              className="form-input"
              placeholder="Institution name"
              value={createForm.name}
              onChange={(e) => setCreateForm((f) => ({ ...f, name: e.target.value }))}
            />
            <input
              className="form-input"
              placeholder="Official email"
              value={createForm.email}
              onChange={(e) => setCreateForm((f) => ({ ...f, email: e.target.value }))}
            />
            <input
              className="form-input"
              placeholder="Owner email (optional)"
              value={createForm.ownerEmail}
              onChange={(e) => setCreateForm((f) => ({ ...f, ownerEmail: e.target.value }))}
            />
            <input
              className="form-input"
              placeholder="Country"
              value={createForm.country}
              onChange={(e) => setCreateForm((f) => ({ ...f, country: e.target.value }))}
            />
            <select
              className="form-input"
              value={createForm.capabilityPack}
              onChange={(e) =>
                setCreateForm((f) => ({ ...f, capabilityPack: e.target.value as CapabilityPack }))
              }
            >
              {Object.entries(CAPABILITY_PACKS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.name}
                </option>
              ))}
              <option value="custom">Custom</option>
            </select>
            <div className="flex gap-2">
              <button
                type="button"
                className="btn btn-primary flex-1"
                disabled={busy || !createForm.name.trim()}
                onClick={async () => {
                  const inst = await run('create_institution', createForm);
                  setCreateOpen(false);
                  setCreateForm({
                    name: '',
                    email: '',
                    ownerEmail: '',
                    capabilityPack: 'foundation',
                    country: '',
                  });
                  if (inst?.id) {
                    setSelectedInst(inst);
                    setSection('institutions');
                  }
                }}
              >
                Create
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => setCreateOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function InstitutionDetail({
  inst,
  busy,
  onProvision,
  onUpdatePack,
  onStatus,
  onBrand,
  onSuspendMember,
  onDomain,
}: {
  inst: Record<string, unknown>;
  busy: boolean;
  onProvision: () => Promise<unknown>;
  onUpdatePack: (pack: CapabilityPack, modules: string[]) => Promise<unknown>;
  onStatus: (status: string) => Promise<unknown>;
  onBrand: (fields: Record<string, string | null>) => Promise<unknown>;
  onSuspendMember: (membershipId: string, suspend: boolean) => Promise<unknown>;
  onDomain: (payload: {
    domainAction: string;
    domain?: string;
    subdomain?: string | null;
    notes?: string;
  }) => Promise<unknown>;
}) {
  const [pack, setPack] = useState<CapabilityPack>(
    (inst.capabilityPack as CapabilityPack) || 'foundation',
  );
  const [modules, setModules] = useState<string[]>(
    (inst.enabledModules as string[]) || (inst.resolvedModules as string[]) || [],
  );
  const [logoUrl, setLogoUrl] = useState(String(inst.logoUrl || ''));
  const [coverUrl, setCoverUrl] = useState(String(inst.coverUrl || ''));
  const [primaryColor, setPrimaryColor] = useState(String(inst.primaryColor || '#00b369'));
  const [description, setDescription] = useState(String(inst.description || ''));
  const [domainInput, setDomainInput] = useState(
    String(inst.pendingCustomDomain || inst.customDomain || ''),
  );
  const [subdomainInput, setSubdomainInput] = useState(String(inst.subdomain || ''));
  const [domainNotes, setDomainNotes] = useState('');

  useEffect(() => {
    setPack((inst.capabilityPack as CapabilityPack) || 'foundation');
    setModules((inst.enabledModules as string[]) || (inst.resolvedModules as string[]) || []);
    setLogoUrl(String(inst.logoUrl || ''));
    setCoverUrl(String(inst.coverUrl || ''));
    setPrimaryColor(String(inst.primaryColor || '#00b369'));
    setDescription(String(inst.description || ''));
    setDomainInput(String(inst.pendingCustomDomain || inst.customDomain || ''));
    setSubdomainInput(String(inst.subdomain || ''));
  }, [inst]);

  const memberships = (inst.memberships as Array<Record<string, unknown>>) || [];
  const courses = (inst.courses as Array<Record<string, unknown>>) || [];
  const withdrawals = (inst.withdrawalRequests as Array<Record<string, unknown>>) || [];
  const federation = inst.federationLink as Record<string, unknown> | null;
  const cnameTarget = String(inst.cnameTarget || 'cname.intellex.cm');
  const domainStatus = String(inst.domainStatus || 'none');
  const hasPending = Boolean(inst.pendingCustomDomain);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-xl font-bold">{String(inst.name)}</h3>
          <p className="text-xs" style={{ color: 'var(--ink-soft)' }}>
            {String(inst.slug)} · {String(inst.deploymentModel)} · created {fmt(inst.createdAt as string)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {inst.status !== 'ACTIVE' ? (
            <button type="button" className="btn btn-primary" disabled={busy} onClick={() => onProvision()}>
              <CheckCircle2 size={14} /> Provision & activate
            </button>
          ) : (
            <button
              type="button"
              className="btn"
              style={{ background: 'rgba(220,38,38,0.1)', color: '#b91c1c' }}
              disabled={busy}
              onClick={() => onStatus('SUSPENDED')}
            >
              Suspend campus
            </button>
          )}
          {inst.status === 'SUSPENDED' ? (
            <button type="button" className="btn btn-primary" disabled={busy} onClick={() => onStatus('ACTIVE')}>
              Restore
            </button>
          ) : null}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Stat label="Members" value={(inst._count as { memberships?: number })?.memberships ?? memberships.length} />
        <Stat label="Courses" value={(inst._count as { courses?: number })?.courses ?? courses.length} />
      </div>

      <div className="space-y-2 overflow-hidden rounded-xl border p-4" style={{ borderColor: 'var(--line)' }}>
        <div className="flex items-center gap-2">
          <Globe2 size={14} />
          <h4 className="font-semibold">Campus domain</h4>
        </div>
        <p className="text-xs" style={{ color: 'var(--ink-soft)' }}>
          Approve owner requests or set/change the hostname so this campus opens on its own domain.
          CNAME target: <code>{cnameTarget}</code>
        </p>
        <div className="rounded-lg border px-3 py-2 text-xs" style={{ borderColor: 'var(--line)' }}>
          <div>Status: <strong>{domainStatus}</strong></div>
          {inst.customDomain ? <div>Active: {String(inst.customDomain)}</div> : null}
          {hasPending ? <div>Pending: {String(inst.pendingCustomDomain)}</div> : null}
          {inst.subdomain ? (
            <div>
              Subdomain: {String(inst.subdomain)}.{cnameTarget}
            </div>
          ) : null}
          {inst.domainNotes ? <div className="mt-1 opacity-80">{String(inst.domainNotes)}</div> : null}
        </div>
        <input
          className="form-input !rounded-none"
          placeholder="learn.school.edu"
          value={domainInput}
          onChange={(e) => setDomainInput(e.target.value)}
        />
        <input
          className="form-input !rounded-none"
          placeholder="Optional subdomain label"
          value={subdomainInput}
          onChange={(e) => setSubdomainInput(e.target.value)}
        />
        <input
          className="form-input !rounded-none"
          placeholder="Admin notes (optional)"
          value={domainNotes}
          onChange={(e) => setDomainNotes(e.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          {hasPending ? (
            <>
              <button
                type="button"
                className="btn btn-primary !rounded-none"
                disabled={busy}
                onClick={() =>
                  onDomain({
                    domainAction: 'approve',
                    domain: String(inst.pendingCustomDomain),
                    subdomain: subdomainInput || null,
                    notes: domainNotes || undefined,
                  })
                }
              >
                Approve pending
              </button>
              <button
                type="button"
                className="btn !rounded-none"
                disabled={busy}
                onClick={() =>
                  onDomain({
                    domainAction: 'reject',
                    notes: domainNotes || 'Rejected by Platform Admin',
                  })
                }
              >
                Reject
              </button>
            </>
          ) : null}
          <button
            type="button"
            className="btn btn-primary !rounded-none"
            disabled={busy || !domainInput.trim()}
            onClick={() =>
              onDomain({
                domainAction: 'set',
                domain: domainInput.trim(),
                subdomain: subdomainInput || null,
                notes: domainNotes || undefined,
              })
            }
          >
            Set / change domain
          </button>
          {inst.customDomain || hasPending ? (
            <button
              type="button"
              className="btn !rounded-none"
              style={{ color: '#b91c1c' }}
              disabled={busy}
              onClick={() =>
                onDomain({
                  domainAction: 'revoke',
                  notes: domainNotes || 'Domain revoked by Platform Admin',
                })
              }
            >
              Revoke domain
            </button>
          ) : null}
        </div>
      </div>

      <div className="space-y-3 overflow-hidden rounded-xl border p-4" style={{ borderColor: 'var(--line)' }}>
        <h4 className="font-semibold">Branding (logo & cover)</h4>
        <p className="text-xs" style={{ color: 'var(--ink-soft)' }}>
          Upload images to Cloudinary - we store the generated links. Color can be picked visually or auto-sampled from an upload.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <ImageUploadField
            label="Logo"
            kind="logo"
            ownerId={String(inst.id || inst.slug || 'campus')}
            value={logoUrl}
            autoColor
            onChange={setLogoUrl}
            onColorExtracted={setPrimaryColor}
            previewHeight={110}
          />
          <ImageUploadField
            label="Cover image"
            kind="cover"
            ownerId={String(inst.id || inst.slug || 'campus')}
            value={coverUrl}
            autoColor={!logoUrl}
            onChange={setCoverUrl}
            onColorExtracted={(hex) => {
              if (!logoUrl) setPrimaryColor(hex);
            }}
            previewHeight={110}
          />
        </div>
        <ColorPickerField
          label="Primary color"
          value={primaryColor}
          onChange={(c) => setPrimaryColor(normalizeHexColor(c))}
        />
        <textarea
          className="form-input !rounded-none"
          rows={3}
          placeholder="About / description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          type="button"
          className="btn btn-primary !rounded-none"
          disabled={busy}
          onClick={() =>
            onBrand({
              logoUrl: logoUrl || null,
              coverUrl: coverUrl || null,
              primaryColor: normalizeHexColor(primaryColor),
              description,
            })
          }
        >
          Save branding
        </button>
      </div>

      <div className="space-y-2 overflow-hidden rounded-xl border p-4" style={{ borderColor: 'var(--line)' }}>
        <div className="flex items-center gap-2">
          <Shield size={14} />
          <h4 className="font-semibold">Capability pack</h4>
        </div>
        <select className="form-input" value={pack} onChange={(e) => setPack(e.target.value as CapabilityPack)}>
          {Object.entries(CAPABILITY_PACKS).map(([k, v]) => (
            <option key={k} value={k}>
              {v.name} - {v.summary}
            </option>
          ))}
          <option value="custom">Custom modules</option>
        </select>
        {pack === 'custom' ? (
          <div className="grid max-w-full gap-2 overflow-hidden sm:grid-cols-2">
            {MODULE_CATALOG.map((m) => {
              const on = modules.includes(m.id);
              return (
                <label key={m.id} className="flex min-w-0 items-start gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="mt-1 shrink-0"
                    checked={on}
                    onChange={() =>
                      setModules((prev) => (on ? prev.filter((x) => x !== m.id) : [...prev, m.id]))
                    }
                  />
                  <span className="min-w-0 break-words">
                    <span className="font-medium">{m.name}</span>
                    <span className="block text-xs" style={{ color: 'var(--ink-soft)' }}>
                      {m.tagline}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        ) : (
          <p className="text-xs" style={{ color: 'var(--ink-soft)' }}>
            Modules: {(CAPABILITY_PACKS[pack as Exclude<CapabilityPack, 'custom'>]?.modules || []).join(', ') || 'Core only'}
          </p>
        )}
        <button
          type="button"
          className="btn btn-primary"
          disabled={busy}
          onClick={() => onUpdatePack(pack, pack === 'custom' ? modules : [])}
        >
          Save privileges
        </button>
      </div>

      {federation ? (
        <div className="rounded-xl border p-4 text-sm" style={{ borderColor: 'var(--line)' }}>
          <p className="font-semibold">Federation link</p>
          <p style={{ color: 'var(--ink-soft)' }}>
            Health: {String(federation.healthStatus)} · last check {fmt(federation.lastHealthAt as string)}
          </p>
        </div>
      ) : (
        <p className="text-xs" style={{ color: 'var(--ink-soft)' }}>
          No federation link yet (created on provision).
        </p>
      )}

      <div>
        <h4 className="mb-2 font-semibold">Personnel</h4>
        <div className="space-y-2">
          {memberships.map((m) => {
            const user = m.user as Record<string, unknown>;
            const suspended = Boolean(m.suspendedAt);
            return (
              <div
                key={String(m.id)}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border px-3 py-2 text-sm"
                style={{ borderColor: 'var(--line)' }}
              >
                <div>
                  <p className="font-medium">{String(user?.name || user?.email)}</p>
                  <p className="text-xs" style={{ color: 'var(--ink-soft)' }}>
                    {String(m.role)} {user?.bannedAt ? '· platform banned' : ''}
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-ghost"
                  style={{ padding: '6px 10px' }}
                  disabled={busy}
                  onClick={() => onSuspendMember(String(m.id), !suspended)}
                >
                  {suspended ? 'Restore' : 'Suspend'}
                </button>
              </div>
            );
          })}
          {memberships.length === 0 ? (
            <p className="text-xs" style={{ color: 'var(--ink-soft)' }}>
              No members yet.
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <h4 className="mb-2 font-semibold">Courses (Prisma)</h4>
        <div className="space-y-1 text-sm">
          {courses.map((c) => (
            <div key={String(c.id)} className="flex justify-between gap-2 border-b py-2" style={{ borderColor: 'var(--line)' }}>
              <span>{String(c.title)}</span>
              <Badge>{String(c.status)}</Badge>
            </div>
          ))}
          {courses.length === 0 ? (
            <p className="text-xs" style={{ color: 'var(--ink-soft)' }}>
              No Prisma courses for this campus yet.
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <h4 className="mb-2 font-semibold">Withdrawals</h4>
        {withdrawals.map((w) => (
          <div key={String(w.id)} className="border-b py-2 text-sm" style={{ borderColor: 'var(--line)' }}>
            {String((w.user as { email?: string })?.email)} · {String(w.amountCents)} {String(w.currency)} ·{' '}
            <Badge tone={w.status === 'pending' ? 'warn' : w.status === 'rejected' ? 'bad' : 'ok'}>
              {String(w.status)}
            </Badge>
          </div>
        ))}
        {withdrawals.length === 0 ? (
          <p className="text-xs" style={{ color: 'var(--ink-soft)' }}>
            No withdrawal requests.
          </p>
        ) : null}
      </div>
    </div>
  );
}

function FinancePanel({
  finance,
  busy,
  onReview,
}: {
  finance: Record<string, unknown>;
  busy: boolean;
  onReview: (id: string, decision: 'approved' | 'rejected' | 'paid') => Promise<unknown>;
}) {
  const income = finance.income as { paidXaf: number; paidCount: number; pendingXaf: number };
  const spend = finance.spend as { refundedXaf: number; withdrawalsByStatusCents: Record<string, number> };
  const withdrawals = (finance.withdrawals as Array<Record<string, unknown>>) || [];
  const wallets = (finance.wallets as Array<Record<string, unknown>>) || [];
  const orders = (finance.recentOrders as Array<Record<string, unknown>>) || [];

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Paid income" value={moneyXaf(income?.paidXaf)} hint={`${income?.paidCount ?? 0} orders`} />
        <Stat label="Pending orders" value={moneyXaf(income?.pendingXaf)} />
        <Stat label="Refunds" value={moneyXaf(spend?.refundedXaf)} />
        <Stat
          label="Withdrawal pending"
          value={spend?.withdrawalsByStatusCents?.pending ?? 0}
          hint="Amount units as stored (cents/XAF)"
        />
      </div>

      <div>
        <h3 className="mb-3 font-display text-lg font-semibold">Withdrawal queue</h3>
        <p className="mb-3 text-xs" style={{ color: 'var(--ink-soft)' }}>
          Approve only when wallet balance covers the request. Banned instructors cannot be paid out.
        </p>
        <div className="space-y-2">
          {withdrawals.map((w) => {
            const user = w.user as Record<string, unknown>;
            const wallet = user?.wallet as { balance?: number } | null;
            const bal = wallet?.balance ?? 0;
            const ok = Number(w.amountCents) <= bal && !user?.bannedAt;
            return (
              <div
                key={String(w.id)}
                className="rounded-2xl border p-4"
                style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">
                      {String(user?.name || user?.email)} · {String(w.amountCents)} {String(w.currency)}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--ink-soft)' }}>
                      Wallet {bal} · {(w.institution as { name?: string } | null)?.name || 'Independent'} ·{' '}
                      {fmt(w.createdAt as string)}
                    </p>
                    {!ok && w.status === 'pending' ? (
                      <p className="mt-1 text-xs" style={{ color: '#b91c1c' }}>
                        Cannot approve: {user?.bannedAt ? 'user banned' : 'insufficient balance'}
                      </p>
                    ) : null}
                  </div>
                  <Badge tone={w.status === 'pending' ? 'warn' : w.status === 'rejected' ? 'bad' : 'ok'}>
                    {String(w.status)}
                  </Badge>
                </div>
                {w.status === 'pending' ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="btn btn-primary"
                      disabled={busy || !ok}
                      onClick={() => onReview(String(w.id), 'approved')}
                    >
                      <CheckCircle2 size={14} /> Approve & debit wallet
                    </button>
                    <button
                      type="button"
                      className="btn"
                      style={{ background: 'rgba(220,38,38,0.1)', color: '#b91c1c' }}
                      disabled={busy}
                      onClick={() => onReview(String(w.id), 'rejected')}
                    >
                      <XCircle size={14} /> Reject
                    </button>
                  </div>
                ) : null}
              </div>
            );
          })}
          {withdrawals.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>
              No withdrawal requests yet.
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="mb-2 font-semibold">Top wallets</h3>
          {wallets.map((w) => (
            <div key={String(w.id)} className="flex justify-between border-b py-2 text-sm" style={{ borderColor: 'var(--line)' }}>
              <span>{String((w.user as { email?: string })?.email)}</span>
              <span>{String(w.balance)}</span>
            </div>
          ))}
        </div>
        <div>
          <h3 className="mb-2 font-semibold">Recent orders</h3>
          {orders.map((o) => (
            <div key={String(o.id)} className="flex justify-between border-b py-2 text-sm" style={{ borderColor: 'var(--line)' }}>
              <span>
                {String((o.user as { email?: string })?.email)} · {String(o.status)}
              </span>
              <span>{moneyXaf(o.amountXaf as number)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GovernancePanel({
  data,
  busy,
  onReviewInst,
}: {
  data: Record<string, unknown>;
  busy: boolean;
  onReviewInst: (id: string, decision: 'approve' | 'reject', pack: CapabilityPack) => Promise<unknown>;
}) {
  const institutions = (data.institutions as Array<Record<string, unknown>>) || [];
  const instructors = (data.instructors as Array<Record<string, unknown>>) || [];
  const mentors = (data.mentors as Array<Record<string, unknown>>) || [];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-3 font-display text-lg font-semibold">Institution applications (Supabase)</h3>
        {institutions.map((a) => (
          <div key={String(a.id)} className="mb-3 rounded-2xl border p-4" style={{ borderColor: 'var(--line)' }}>
            <p className="font-semibold">{String(a.name)}</p>
            <p className="text-xs" style={{ color: 'var(--ink-soft)' }}>
              {(a.applicant as { email?: string })?.email} · {String(a.officialEmail)} · {fmt(a.createdAt as string)}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                className="btn btn-primary"
                disabled={busy}
                onClick={() => onReviewInst(String(a.id), 'approve', 'professional')}
              >
                Approve → Professional pack
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                disabled={busy}
                onClick={() => onReviewInst(String(a.id), 'approve', 'foundation')}
              >
                Approve → Foundation
              </button>
              <button
                type="button"
                className="btn"
                style={{ background: 'rgba(220,38,38,0.1)', color: '#b91c1c' }}
                disabled={busy}
                onClick={() => onReviewInst(String(a.id), 'reject', 'foundation')}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
        {institutions.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>No pending institution applications.</p>
        ) : null}
      </div>

      <div>
        <h3 className="mb-2 font-semibold">Instructor applications</h3>
        {instructors.map((a) => (
          <div key={String(a.id)} className="border-b py-2 text-sm" style={{ borderColor: 'var(--line)' }}>
            {(a.applicant as { email?: string })?.email} → {(a.institution as { name?: string })?.name} ·{' '}
            {String(a.status)}
          </div>
        ))}
        {instructors.length === 0 ? (
          <p className="text-xs" style={{ color: 'var(--ink-soft)' }}>None pending.</p>
        ) : null}
      </div>

      <div>
        <h3 className="mb-2 font-semibold">Mentor / instructor applications</h3>
        <p className="mb-2 text-xs" style={{ color: 'var(--ink-soft)' }}>
          Review CV, ID, and intro video under{' '}
          <a href="/admin/applications" className="font-semibold underline">
            Applications
          </a>
          .
        </p>
        {mentors.map((a) => (
          <div key={String(a.id)} className="border-b py-2 text-sm" style={{ borderColor: 'var(--line)' }}>
            {(a.applicant as { email?: string; name?: string })?.name ||
              (a.applicant as { email?: string })?.email}{' '}
            · {String(a.title)} · {String(a.status)}
          </div>
        ))}
        {mentors.length === 0 ? (
          <p className="text-xs" style={{ color: 'var(--ink-soft)' }}>None pending.</p>
        ) : null}
      </div>
    </div>
  );
}

function ConnectionsPanel({ data }: { data: Record<string, unknown> }) {
  const federation = (data.federation as Array<Record<string, unknown>>) || [];
  const verifications = (data.verifications as Array<Record<string, unknown>>) || [];
  const audit = (data.audit as Array<Record<string, unknown>>) || [];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-3 font-display text-lg font-semibold">Federation / under the hood</h3>
        {federation.map((f) => (
          <div key={String(f.id)} className="mb-2 rounded-xl border p-3 text-sm" style={{ borderColor: 'var(--line)' }}>
            <div className="flex items-center gap-2">
              <Eye size={14} />
              <span className="font-semibold">{(f.institution as { name?: string })?.name}</span>
              <Badge tone={f.healthStatus === 'healthy' ? 'ok' : 'warn'}>{String(f.healthStatus)}</Badge>
            </div>
            <p className="mt-1 text-xs" style={{ color: 'var(--ink-soft)' }}>
              {String(f.deploymentModel)} · host {String(f.databaseHost || 'shared')} · activated{' '}
              {fmt(f.activatedAt as string)}
            </p>
          </div>
        ))}
        {federation.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>
            No federation links. Provision an institution to create one.
          </p>
        ) : null}
      </div>

      <div>
        <h3 className="mb-2 font-semibold">Cross-institution verifications</h3>
        {verifications.map((v) => (
          <div key={String(v.id)} className="border-b py-2 text-sm" style={{ borderColor: 'var(--line)' }}>
            {(v.requester as { email?: string })?.email} → {(v.target as { name?: string })?.name} ·{' '}
            {String(v.status)}
          </div>
        ))}
        {verifications.length === 0 ? (
          <p className="text-xs" style={{ color: 'var(--ink-soft)' }}>None yet.</p>
        ) : null}
      </div>

      <div>
        <h3 className="mb-2 font-semibold">Audit trail</h3>
        <div className="max-h-96 overflow-y-auto rounded-2xl border" style={{ borderColor: 'var(--line)' }}>
          {audit.map((a) => (
            <div key={String(a.id)} className="border-b px-3 py-2 text-xs" style={{ borderColor: 'var(--line)' }}>
              <span className="font-semibold">{String(a.action)}</span> {String(a.summary || '')} ·{' '}
              {fmt(a.createdAt as string)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function OnboardingInvitesPanel({
  data,
  busy,
  onCreate,
  onRefresh,
}: {
  data: Record<string, unknown> | null;
  busy: boolean;
  onCreate: (payload: Record<string, unknown>) => Promise<Record<string, unknown>>;
  onRefresh: () => Promise<void>;
}) {
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState<CommercialPlanId>('builder');
  const [lastUrl, setLastUrl] = useState('');
  const invites = ((data?.invites as Array<Record<string, unknown>>) || []);

  return (
    <div className="space-y-6">
      <div className="max-w-xl space-y-3 border p-5" style={{ borderColor: 'var(--line)' }}>
        <h3 className="font-display text-lg font-semibold">Generate onboarding link</h3>
        <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>
          Assign a plan to a specific email. They sign in with that address, pick allowed
          capabilities, and we provision their campus. Plans: Starter, Builder, Pro, Enterprise,
          Institution.
        </p>
        <input
          className="form-input !rounded-none"
          placeholder="partner@school.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <select
          className="form-input !rounded-none"
          value={plan}
          onChange={(e) => setPlan(e.target.value as CommercialPlanId)}
        >
          {(Object.keys(COMMERCIAL_PLANS) as CommercialPlanId[]).map((id) => (
            <option key={id} value={id}>
              {COMMERCIAL_PLANS[id].name} - {COMMERCIAL_PLANS[id].summary}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="btn btn-primary !rounded-none"
          disabled={busy || !email.includes('@')}
          onClick={async () => {
            const r = await onCreate({ email, plan });
            setLastUrl(String(r.url || ''));
            await onRefresh();
          }}
        >
          Create invite link
        </button>
        {lastUrl ? (
          <p className="break-all text-sm" style={{ color: 'var(--green-deep)' }}>
            Share: {lastUrl}
          </p>
        ) : null}
      </div>

      <div>
        <h3 className="mb-3 font-semibold">Recent invites</h3>
        <div className="overflow-x-auto border" style={{ borderColor: 'var(--line)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--paper-dim)' }}>
                {['Email', 'Plan', 'Status', 'Expires', 'Link'].map((h) => (
                  <th key={h} className="px-3 py-2 text-left text-xs" style={{ color: 'var(--ink-soft)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invites.map((inv) => (
                <tr key={String(inv.token || inv.id)} className="border-t" style={{ borderColor: 'var(--line)' }}>
                  <td className="px-3 py-2">{String(inv.email)}</td>
                  <td className="px-3 py-2">{String(inv.plan)}</td>
                  <td className="px-3 py-2">{String(inv.status)}</td>
                  <td className="px-3 py-2">{fmt(inv.expiresAt as string)}</td>
                  <td className="px-3 py-2 font-mono text-xs">
                    /onboard/{String(inv.token).slice(0, 10)}…
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {invites.length === 0 ? (
            <p className="p-4 text-sm" style={{ color: 'var(--ink-soft)' }}>
              No invites yet.
            </p>
          ) : null}
        </div>
      </div>

      <div className="border p-5" style={{ borderColor: 'var(--line)' }}>
        <h3 className="mb-2 font-display text-lg font-semibold">Plan map (pinpoint later)</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(Object.keys(COMMERCIAL_PLANS) as CommercialPlanId[]).map((id) => {
            const p = COMMERCIAL_PLANS[id];
            return (
              <div key={id} className="min-w-0 border p-3" style={{ borderColor: 'var(--line)' }}>
                <p className="font-semibold">{p.name}</p>
                <p className="mt-1 break-words text-xs" style={{ color: 'var(--ink-soft)' }}>
                  {p.summary}
                </p>
                <ul className="mt-2 list-inside list-disc text-xs" style={{ color: 'var(--ink-soft)' }}>
                  {p.highlights.map((h) => (
                    <li key={h} className="break-words">
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
