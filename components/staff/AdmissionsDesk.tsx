'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type AppRow = {
  id: string;
  name: string;
  email: string;
  program: string;
  phone: string;
  status: string;
  notes: string;
  source: string;
  applicationCode?: string;
};

export default function AdmissionsDesk({
  applications,
  canDecide,
}: {
  applications: AppRow[];
  canDecide: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function decide(id: string, decision: 'admitted' | 'rejected' | 'waitlisted') {
    setBusy(id + decision);
    setError('');
    try {
      const res = await fetch('/api/staff/admissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, decision }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not update application');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update application');
    } finally {
      setBusy(null);
    }
  }

  if (!applications.length) {
    return (
      <div className="rounded-2xl border border-dashed px-4 py-10 text-center" style={{ borderColor: 'var(--line)' }}>
        <p className="font-display text-[20px]">No applications yet</p>
        <p className="mt-1 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
          Public join requests, registrations, and in-app student applications appear here. Admit
          upgrades the same account — it never creates a second login.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error ? (
        <p className="text-[14px]" style={{ color: '#b91c1c' }}>
          {error}
        </p>
      ) : null}
      {applications.map((app) => (
        <article key={app.id} className="border p-4" style={{ borderColor: 'var(--line)' }}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-semibold">{app.name}</h2>
              <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                {app.email}
                {app.phone ? ` · ${app.phone}` : ''}
              </p>
              <p className="mt-1 text-[13px]">
                {app.applicationCode ? `${app.applicationCode} · ` : ''}
                {app.program || 'Program not specified'} · {app.source} ·{' '}
                <span className="capitalize">{app.status}</span>
              </p>
              {app.notes ? (
                <p className="mt-2 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                  {app.notes}
                </p>
              ) : null}
            </div>
            {canDecide && app.status === 'pending' ? (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={Boolean(busy)}
                  onClick={() => decide(app.id, 'admitted')}
                  className="px-3 py-1.5 text-[12.5px] font-semibold text-white"
                  style={{ background: '#00B369' }}
                >
                  {busy === `${app.id}admitted` ? '…' : 'Admit'}
                </button>
                <button
                  type="button"
                  disabled={Boolean(busy)}
                  onClick={() => decide(app.id, 'waitlisted')}
                  className="border px-3 py-1.5 text-[12.5px] font-semibold"
                  style={{ borderColor: 'var(--line)' }}
                >
                  Waitlist
                </button>
                <button
                  type="button"
                  disabled={Boolean(busy)}
                  onClick={() => decide(app.id, 'rejected')}
                  className="border px-3 py-1.5 text-[12.5px] font-semibold"
                  style={{ borderColor: 'var(--line)', color: '#b91c1c' }}
                >
                  Reject
                </button>
              </div>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}
