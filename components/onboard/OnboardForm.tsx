'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, ChevronLeft, ChevronRight, Loader2, Lock } from 'lucide-react';
import {
  COMMERCIAL_PLANS,
  type BillingCycle,
  type CommercialPlanId,
} from '@/lib/eduos/plans';
import { MODULE_CATALOG } from '@/lib/eduos/capabilities';
import { DATABASE_MODE_META, type TenantDatabaseMode } from '@/lib/eduos/databaseModes';

type InvitePayload = {
  token: string;
  email: string;
  contactName?: string | null;
  organizationName?: string | null;
  organizationType?: string | null;
  plan: CommercialPlanId;
  allowedModules: string[];
  billingOptions: BillingCycle[];
  databaseMode?: TenantDatabaseMode;
  suggestedSubdomain?: string | null;
  status: string;
  note?: string | null;
  expiresAt: string;
};

const ORG_TYPES = [
  'University',
  'School',
  'Academy',
  'Training Center',
  'Company',
  'Corporate Training',
  'Bootcamp',
  'NGO',
  'Government Organization',
  'Professional Institution',
  'Other',
] as const;

const STRUCTURE_OPTIONS = [
  { id: 'departments', label: 'Departments / Faculties' },
  { id: 'programs', label: 'Programs' },
  { id: 'cohorts', label: 'Cohorts / Classes' },
  { id: 'groups', label: 'Groups' },
  { id: 'levels', label: 'Levels' },
] as const;

const STEPS = [
  { id: 'organization', label: 'Organization' },
  { id: 'platform', label: 'Platform' },
  { id: 'administrator', label: 'Administrator' },
  { id: 'structure', label: 'Structure' },
  { id: 'people', label: 'People' },
  { id: 'modules', label: 'Modules' },
  { id: 'review', label: 'Launch' },
] as const;

export default function OnboardForm({
  invite,
  sessionEmail,
}: {
  invite: InvitePayload;
  sessionEmail: string | null;
}) {
  const router = useRouter();
  const plan = COMMERCIAL_PLANS[invite.plan];
  const dbMode = (invite.databaseMode || 'SHARED') as TenantDatabaseMode;
  const [step, setStep] = useState(0);

  const [name, setName] = useState(invite.organizationName || '');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [institutionType, setInstitutionType] = useState(invite.organizationType || 'Academy');
  const [tagline, setTagline] = useState('');

  const [platformName, setPlatformName] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#00B369');
  const [secondaryColor, setSecondaryColor] = useState('#0B1F17');
  const [subdomain, setSubdomain] = useState(invite.suggestedSubdomain || '');
  const [logoUrl, setLogoUrl] = useState('');

  const [adminFirstName, setAdminFirstName] = useState(
    invite.contactName?.split(' ')[0] || '',
  );
  const [adminLastName, setAdminLastName] = useState(
    invite.contactName?.split(' ').slice(1).join(' ') || '',
  );
  const [adminTitle, setAdminTitle] = useState('');

  const [billingCycle, setBillingCycle] = useState<BillingCycle>(
    invite.billingOptions[0] || 'yearly',
  );
  const [selected, setSelected] = useState<string[]>(invite.allowedModules);
  const [structures, setStructures] = useState<string[]>(['programs', 'cohorts']);
  const [studentRegistration, setStudentRegistration] = useState<
    'public' | 'admin_only' | 'invite_only' | 'code'
  >('invite_only');
  const [instructorMode, setInstructorMode] = useState<
    'admin_create' | 'apply' | 'invite'
  >('admin_create');
  const [instructorCanPublish, setInstructorCanPublish] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState<{ slug: string; platformUrl?: string } | null>(null);

  const emailMatch = useMemo(() => {
    if (!sessionEmail) return false;
    return sessionEmail.trim().toLowerCase() === invite.email.toLowerCase();
  }, [sessionEmail, invite.email]);

  useEffect(() => {
    setSelected(invite.allowedModules);
  }, [invite.allowedModules]);

  useEffect(() => {
    if (name && !platformName) setPlatformName(`${name} Learning`);
    if (name && !subdomain) {
      setSubdomain(
        name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
          .slice(0, 48),
      );
    }
  }, [name, platformName, subdomain]);

  function canNext(): boolean {
    if (step === 0) return name.trim().length >= 2;
    if (step === 1) return platformName.trim().length >= 2 && subdomain.trim().length >= 2;
    if (step === 2) return adminFirstName.trim().length >= 1;
    return true;
  }

  async function submit() {
    setBusy(true);
    setError('');
    try {
      const res = await fetch(`/api/onboard/${invite.token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          website,
          country,
          city,
          address,
          phone,
          institutionType,
          tagline,
          platformName,
          primaryColor,
          secondaryColor,
          subdomain,
          logoUrl,
          adminFirstName,
          adminLastName,
          adminTitle,
          billingCycle,
          selectedModules: selected,
          learningStructure: structures,
          studentRegistration,
          instructorMode,
          instructorCanPublish,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Could not complete onboarding');
        return;
      }
      setDone({ slug: data.slug, platformUrl: data.platformUrl });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  if (invite.status !== 'pending') {
    return (
      <div className="border p-8 text-center" style={{ borderColor: 'var(--line)' }}>
        <Lock size={22} className="mx-auto mb-3" style={{ color: 'var(--ink-soft)' }} />
        <h1 className="font-display text-[24px]">Invite {invite.status}</h1>
        <p className="mt-2 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
          This onboarding link is no longer active.
        </p>
      </div>
    );
  }

  if (done) {
    return (
      <div className="border p-8 text-center" style={{ borderColor: 'var(--line)' }}>
        <CheckCircle2 size={28} className="mx-auto mb-3" style={{ color: 'var(--green-deep)' }} />
        <h1 className="font-display text-[26px]">Your LMS is ready</h1>
        <p className="mt-2 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
          {platformName || name} is live on Intellex.
        </p>
        {done.platformUrl ? (
          <p className="mt-3 font-mono text-[13px]" style={{ color: 'var(--ink)' }}>
            {done.platformUrl}
          </p>
        ) : null}
        <a
          href={`/dashboard/institutions/${done.slug}/admin`}
          className="mt-6 inline-flex px-5 py-2.5 text-[13.5px] font-semibold text-white"
          style={{ background: 'var(--green)' }}
        >
          Open admin
        </a>
        <a
          href={`/dashboard/institutions/${done.slug}`}
          className="mt-3 inline-flex px-5 py-2.5 text-[13.5px] font-semibold border"
          style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
        >
          Open campus
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[760px]">
      <header className="mb-8 border-b pb-8" style={{ borderColor: 'var(--line)' }}>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: 'var(--ink-soft)' }}>
          Launch your LMS
        </p>
        <h1 className="mt-2 font-display text-[34px] leading-[0.95]">Set up your learning platform</h1>
        <p className="mt-3 text-[15px]" style={{ color: 'var(--ink-soft)' }}>
          Assigned to <strong style={{ color: 'var(--ink)' }}>{invite.email}</strong> · plan{' '}
          <strong style={{ color: 'var(--ink)' }}>{plan?.name}</strong>
        </p>
        <p className="mt-2 text-[13.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
          {plan?.summary} Infrastructure: {DATABASE_MODE_META[dbMode].label} (managed by Intellex).
        </p>
      </header>

      <nav className="mb-8 flex flex-wrap gap-2">
        {STEPS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => i <= step && setStep(i)}
            className="border px-3 py-1.5 text-[12px] font-semibold"
            style={{
              borderColor: i === step ? 'var(--green-deep)' : 'var(--line)',
              background: i === step ? 'rgba(0,179,105,0.08)' : 'transparent',
              color: i <= step ? 'var(--ink)' : 'var(--ink-soft)',
            }}
          >
            {i + 1}. {s.label}
          </button>
        ))}
      </nav>

      {!sessionEmail ? (
        <div className="mb-6 border p-4 text-[14px]" style={{ borderColor: 'var(--line)' }}>
          Sign in with <strong>{invite.email}</strong> to continue.
          <a
            href={`/login?next=/onboard/${invite.token}`}
            className="mt-3 block font-semibold"
            style={{ color: 'var(--green-deep)' }}
          >
            Sign in →
          </a>
        </div>
      ) : !emailMatch ? (
        <div className="mb-6 border p-4 text-[14px]" style={{ borderColor: 'var(--line)', color: '#b91c1c' }}>
          You are signed in as {sessionEmail}. This invite is only for {invite.email}. Switch accounts to continue.
        </div>
      ) : null}

      <div className="space-y-5">
        {step === 0 ? (
          <>
            <Field label="Organization name" required>
              <input className="form-input !rounded-none" required value={name} onChange={(e) => setName(e.target.value)} />
            </Field>
            <Field label="Organization type">
              <select
                className="form-input !rounded-none"
                value={institutionType}
                onChange={(e) => setInstitutionType(e.target.value)}
              >
                {ORG_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Description">
              <textarea
                className="form-input !rounded-none"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What should learners know about your organization?"
              />
            </Field>
            <Field label="Slogan / tagline">
              <input className="form-input !rounded-none" value={tagline} onChange={(e) => setTagline(e.target.value)} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Website">
                <input className="form-input !rounded-none" value={website} onChange={(e) => setWebsite(e.target.value)} />
              </Field>
              <Field label="Phone">
                <input className="form-input !rounded-none" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </Field>
              <Field label="Country">
                <input className="form-input !rounded-none" value={country} onChange={(e) => setCountry(e.target.value)} />
              </Field>
              <Field label="City">
                <input className="form-input !rounded-none" value={city} onChange={(e) => setCity(e.target.value)} />
              </Field>
            </div>
            <Field label="Address">
              <input className="form-input !rounded-none" value={address} onChange={(e) => setAddress(e.target.value)} />
            </Field>
          </>
        ) : null}

        {step === 1 ? (
          <>
            <Field label="Platform name" required>
              <input
                className="form-input !rounded-none"
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                placeholder="e.g. ABC Learning"
              />
            </Field>
            <Field label="Intellex subdomain" required>
              <div className="flex items-center gap-2">
                <input
                  className="form-input !rounded-none"
                  value={subdomain}
                  onChange={(e) =>
                    setSubdomain(
                      e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9-]/g, '')
                        .slice(0, 48),
                    )
                  }
                />
                <span className="shrink-0 text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                  .intellex…
                </span>
              </div>
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Primary color">
                <input
                  type="color"
                  className="h-11 w-full cursor-pointer border"
                  style={{ borderColor: 'var(--line)' }}
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                />
              </Field>
              <Field label="Secondary color">
                <input
                  type="color"
                  className="h-11 w-full cursor-pointer border"
                  style={{ borderColor: 'var(--line)' }}
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                />
              </Field>
            </div>
            <Field label="Logo URL (optional)">
              <input
                className="form-input !rounded-none"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://…"
              />
            </Field>
            <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
              Custom domains (learn.yourschool.com) can be connected later from Settings → Domains.
            </p>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="First name" required>
                <input
                  className="form-input !rounded-none"
                  value={adminFirstName}
                  onChange={(e) => setAdminFirstName(e.target.value)}
                />
              </Field>
              <Field label="Last name">
                <input
                  className="form-input !rounded-none"
                  value={adminLastName}
                  onChange={(e) => setAdminLastName(e.target.value)}
                />
              </Field>
            </div>
            <Field label="Job title">
              <input
                className="form-input !rounded-none"
                value={adminTitle}
                onChange={(e) => setAdminTitle(e.target.value)}
                placeholder="Director of Learning"
              />
            </Field>
            <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
              You will be the organization owner for <strong>{invite.email}</strong>. Additional
              administrators can be invited after launch.
            </p>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <h2 className="font-display text-[20px]">Learning structure</h2>
            <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
              Enable only what your organization needs. You can change this later in admin settings.
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {STRUCTURE_OPTIONS.map((opt) => {
                const on = structures.includes(opt.id);
                return (
                  <label
                    key={opt.id}
                    className="flex items-center gap-2 border p-3 text-sm"
                    style={{ borderColor: 'var(--line)' }}
                  >
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={() =>
                        setStructures((prev) =>
                          on ? prev.filter((x) => x !== opt.id) : [...prev, opt.id],
                        )
                      }
                    />
                    <span className="font-semibold">{opt.label}</span>
                  </label>
                );
              })}
            </div>
          </>
        ) : null}

        {step === 4 ? (
          <>
            <h2 className="font-display text-[20px]">Students & instructors</h2>
            <Field label="How students join">
              <select
                className="form-input !rounded-none"
                value={studentRegistration}
                onChange={(e) =>
                  setStudentRegistration(e.target.value as typeof studentRegistration)
                }
              >
                <option value="invite_only">Invitation only</option>
                <option value="admin_only">Admin creates accounts</option>
                <option value="public">Public registration</option>
                <option value="code">Organization / enrollment codes</option>
              </select>
            </Field>
            <Field label="How instructors are added">
              <select
                className="form-input !rounded-none"
                value={instructorMode}
                onChange={(e) => setInstructorMode(e.target.value as typeof instructorMode)}
              >
                <option value="admin_create">Admins create / search Intellex users</option>
                <option value="invite">Invitation links</option>
                <option value="apply">Instructors can apply (approval required)</option>
              </select>
            </Field>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={instructorCanPublish}
                onChange={(e) => setInstructorCanPublish(e.target.checked)}
              />
              Instructors may publish courses without admin review
            </label>
          </>
        ) : null}

        {step === 5 ? (
          <>
            <Field label="Billing">
              <div className="flex flex-wrap gap-2">
                {invite.billingOptions.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBillingCycle(b)}
                    className="border px-3 py-2 text-[13px] font-semibold capitalize"
                    style={{
                      borderColor: billingCycle === b ? 'var(--green-deep)' : 'var(--line)',
                      background: billingCycle === b ? 'rgba(0,179,105,0.08)' : 'transparent',
                    }}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </Field>
            <div className="overflow-hidden border-t pt-5" style={{ borderColor: 'var(--line)' }}>
              <h2 className="font-display text-[20px]">Modules included in your plan</h2>
              <p className="mt-1 mb-4 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                Restricted to what your {plan?.name} invite allows. Core campus is always included.
              </p>
              {invite.allowedModules.length === 0 ? (
                <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                  Starter · Core only. Additional modules can be added later by Intellex Admin.
                </p>
              ) : (
                <div className="grid gap-2 sm:grid-cols-2">
                  {invite.allowedModules.map((id) => {
                    const meta = MODULE_CATALOG.find((m) => m.id === id);
                    const on = selected.includes(id);
                    return (
                      <label
                        key={id}
                        className="flex min-w-0 items-start gap-2 border p-3 text-sm"
                        style={{ borderColor: 'var(--line)' }}
                      >
                        <input
                          type="checkbox"
                          className="mt-1 shrink-0"
                          checked={on}
                          onChange={() =>
                            setSelected((prev) => (on ? prev.filter((x) => x !== id) : [...prev, id]))
                          }
                        />
                        <span className="min-w-0 break-words">
                          <span className="font-semibold">{meta?.name ?? id}</span>
                          <span className="mt-0.5 block text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                            {meta?.tagline}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        ) : null}

        {step === 6 ? (
          <div className="space-y-3 border p-5 text-[14px]" style={{ borderColor: 'var(--line)' }}>
            <h2 className="font-display text-[22px]">Your LMS is ready to launch</h2>
            <Row label="Organization" value={name} />
            <Row label="Platform" value={platformName} />
            <Row label="Type" value={institutionType} />
            <Row label="Administrator" value={`${adminFirstName} ${adminLastName}`.trim()} />
            <Row label="Structure" value={structures.join(', ') || 'None'} />
            <Row label="Students" value={studentRegistration.replace(/_/g, ' ')} />
            <Row label="Instructors" value={instructorMode.replace(/_/g, ' ')} />
            <Row label="Plan" value={`${plan?.name} · ${billingCycle}`} />
            <Row label="Modules" value={selected.length ? selected.join(', ') : 'Core only'} />
            <Row label="Database" value={DATABASE_MODE_META[dbMode].label} />
            <Row label="Subdomain" value={subdomain || '—'} />
          </div>
        ) : null}

        {error ? (
          <p className="text-sm" style={{ color: '#b91c1c' }}>
            {error}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            type="button"
            disabled={step === 0 || busy}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="inline-flex items-center gap-1 border px-4 py-2.5 text-[13px] font-semibold disabled:opacity-40"
            style={{ borderColor: 'var(--line)' }}
          >
            <ChevronLeft size={15} /> Back
          </button>
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              disabled={!emailMatch || !canNext()}
              onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
              className="inline-flex items-center gap-1 px-5 py-2.5 text-[13.5px] font-semibold text-white disabled:opacity-50"
              style={{ background: 'var(--ink)' }}
            >
              Continue <ChevronRight size={15} />
            </button>
          ) : (
            <button
              type="button"
              disabled={busy || !emailMatch || !name.trim()}
              onClick={submit}
              className="inline-flex items-center gap-2 px-6 py-3 text-[13.5px] font-semibold text-white disabled:opacity-50"
              style={{ background: 'var(--ink)' }}
            >
              {busy ? <Loader2 size={15} className="animate-spin" /> : null}
              Create My LMS
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-[13px] font-semibold">
        {label}
        {required ? ' *' : ''}
      </label>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap justify-between gap-2 border-b py-2" style={{ borderColor: 'var(--line)' }}>
      <span style={{ color: 'var(--ink-soft)' }}>{label}</span>
      <span className="font-semibold text-right">{value}</span>
    </div>
  );
}
