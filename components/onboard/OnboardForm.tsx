'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Loader2, Lock } from 'lucide-react';
import {
  COMMERCIAL_PLANS,
  type BillingCycle,
  type CommercialPlanId,
} from '@/lib/eduos/plans';
import { MODULE_CATALOG } from '@/lib/eduos/capabilities';

type InvitePayload = {
  token: string;
  email: string;
  plan: CommercialPlanId;
  allowedModules: string[];
  billingOptions: BillingCycle[];
  status: string;
  note?: string | null;
  expiresAt: string;
};

export default function OnboardForm({
  invite,
  sessionEmail,
}: {
  invite: InvitePayload;
  sessionEmail: string | null;
}) {
  const router = useRouter();
  const plan = COMMERCIAL_PLANS[invite.plan];
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [country, setCountry] = useState('');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(
    invite.billingOptions[0] || 'yearly',
  );
  const [selected, setSelected] = useState<string[]>(invite.allowedModules);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState<{ slug: string } | null>(null);

  const emailMatch = useMemo(() => {
    if (!sessionEmail) return false;
    return sessionEmail.trim().toLowerCase() === invite.email.toLowerCase();
  }, [sessionEmail, invite.email]);

  useEffect(() => {
    setSelected(invite.allowedModules);
  }, [invite.allowedModules]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
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
          billingCycle,
          selectedModules: selected,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Could not complete onboarding');
        return;
      }
      setDone({ slug: data.slug });
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
        <h1 className="font-display text-[26px]">Campus provisioned</h1>
        <p className="mt-2 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
          Your institution is live on InTelleX.
        </p>
        <a
          href={`/dashboard/institutions/${done.slug}`}
          className="mt-6 inline-flex px-5 py-2.5 text-[13.5px] font-semibold text-white"
          style={{ background: 'var(--green)' }}
        >
          Open campus
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[720px]">
      <header className="mb-8 border-b pb-8" style={{ borderColor: 'var(--line)' }}>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: 'var(--ink-soft)' }}>
          Institution onboarding
        </p>
        <h1 className="mt-2 font-display text-[34px] leading-[0.95]">Set up your campus</h1>
        <p className="mt-3 text-[15px]" style={{ color: 'var(--ink-soft)' }}>
          Assigned to <strong style={{ color: 'var(--ink)' }}>{invite.email}</strong> · plan{' '}
          <strong style={{ color: 'var(--ink)' }}>{plan?.name}</strong>
        </p>
        <p className="mt-2 text-[13.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
          {plan?.summary}
        </p>
      </header>

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

      <form onSubmit={submit} className="space-y-5">
        <div>
          <label className="mb-1 block text-[13px] font-semibold">Institution / company name</label>
          <input className="form-input !rounded-none" required value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-[13px] font-semibold">About</label>
          <textarea
            className="form-input !rounded-none"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What should learners know about your campus?"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-[13px] font-semibold">Website</label>
            <input className="form-input !rounded-none" value={website} onChange={(e) => setWebsite(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-[13px] font-semibold">Country</label>
            <input className="form-input !rounded-none" value={country} onChange={(e) => setCountry(e.target.value)} />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-[13px] font-semibold">Billing</label>
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
        </div>

        <div className="overflow-hidden border-t pt-5" style={{ borderColor: 'var(--line)' }}>
          <h2 className="font-display text-[20px]">Capabilities you want</h2>
          <p className="mt-1 mb-4 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
            Restricted to what your {plan?.name} invite allows. Core campus is always included.
          </p>
          {invite.allowedModules.length === 0 ? (
            <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
              Starter · Core only. Additional modules can be added later by Platform Admin.
            </p>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {invite.allowedModules.map((id) => {
                const meta = MODULE_CATALOG.find((m) => m.id === id);
                const on = selected.includes(id);
                return (
                  <label key={id} className="flex min-w-0 items-start gap-2 border p-3 text-sm" style={{ borderColor: 'var(--line)' }}>
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

        {error ? (
          <p className="text-sm" style={{ color: '#b91c1c' }}>
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={busy || !emailMatch || !name.trim()}
          className="inline-flex items-center gap-2 px-6 py-3 text-[13.5px] font-semibold text-white disabled:opacity-50"
          style={{ background: 'var(--ink)' }}
        >
          {busy ? <Loader2 size={15} className="animate-spin" /> : null}
          Provision my campus
        </button>
      </form>
    </div>
  );
}
