'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Check,
  CreditCard,
  Download,
  ExternalLink,
  Loader2,
  RefreshCw,
  UserCheck,
  Video,
  X,
  type LucideIcon,
} from 'lucide-react';

type MentorApp = {
  id: string;
  name: string;
  email?: string | null;
  title: string;
  expertise: string[];
  bio: string;
  priceXAF: number;
  sessionMinutes: number;
  resumeUrl?: string;
  idFrontUrl?: string;
  idBackUrl?: string;
  introVideoUrl?: string;
  introVideoBytes?: number | null;
  status: string;
  createdAt: string;
  reviewNote?: string | null;
};

function fmt(d?: string) {
  if (!d) return '-';
  return new Date(d).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function fmtBytes(n?: number | null) {
  if (!n) return '';
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

export default function AdminApplications() {
  const [mentors, setMentors] = useState<MentorApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/applications');
      if (!res.ok) {
        setError('Could not load applications.');
        return;
      }
      const data = await res.json();
      setMentors(data.mentors ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function act(id: string, action: 'approve' | 'reject') {
    let note = '';
    if (action === 'reject') {
      const entered = window.prompt('Optional rejection note for the applicant:');
      if (entered === null) return;
      note = entered;
    }
    setBusyId(id);
    setError('');
    try {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'mentor', action, note }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? 'Action failed');
        return;
      }
      await load();
    } finally {
      setBusyId(null);
    }
  }

  const pending = mentors.filter((m) => m.status === 'submitted' || m.status === 'under_review');
  const others = mentors.filter((m) => m.status !== 'submitted' && m.status !== 'under_review');

  if (loading && mentors.length === 0) {
    return (
      <div className="flex items-center justify-center gap-3 py-20" style={{ color: 'var(--ink-soft)' }}>
        <RefreshCw size={18} className="animate-spin" /> Loading applications…
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-[22px]">Mentor applications</h2>
          <p className="text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>
            Review CV, ID, and intro video - approve to grant Mentor Studio access.
          </p>
        </div>
        <button type="button" onClick={load} className="btn btn-ghost !py-2 text-[13px]">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {error && (
        <p className="rounded-xl px-4 py-3 text-sm" style={{ background: 'rgba(220,38,38,0.08)', color: '#b91c1c' }}>
          {error}
        </p>
      )}

      <Section title={`Pending (${pending.length})`}>
        {pending.length === 0 ? (
          <Empty text="No pending mentor applications." />
        ) : (
          <div className="space-y-4">
            {pending.map((app) => (
              <ApplicationCard
                key={app.id}
                app={app}
                busy={busyId === app.id}
                onApprove={() => act(app.id, 'approve')}
                onReject={() => act(app.id, 'reject')}
                onError={setError}
              />
            ))}
          </div>
        )}
      </Section>

      {others.length > 0 && (
        <Section title={`Resolved (${others.length})`}>
          <div className="space-y-4">
            {others.map((app) => (
              <ApplicationCard key={app.id} app={app} busy={false} onError={setError} />
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-3 font-display text-[17px]">{title}</h3>
      {children}
    </section>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed px-5 py-8 text-sm" style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}>
      {text}
    </div>
  );
}

function ApplicationCard({
  app,
  busy,
  onApprove,
  onReject,
  onError,
}: {
  app: MentorApp;
  busy: boolean;
  onApprove?: () => void;
  onReject?: () => void;
  onError?: (msg: string) => void;
}) {
  const [dlBusy, setDlBusy] = useState(false);
  const pending = app.status === 'submitted' || app.status === 'under_review';

  async function downloadResume() {
    if (!app.resumeUrl) return;
    setDlBusy(true);
    onError?.('');
    try {
      // Server issues a 302 to a signed Cloudinary attachment URL — open it
      // directly so the browser downloads the real PDF (not a JSON error body).
      const url = `/api/admin/applications/${app.id}/resume`;
      const win = window.open(url, '_blank', 'noopener,noreferrer');
      if (!win) {
        // Popup blocked — navigate same tab.
        window.location.assign(url);
      }
    } catch {
      onError?.('Could not download CV. Check your connection and try again.');
    } finally {
      setDlBusy(false);
    }
  }

  return (
    <article className="rounded-2xl border p-5" style={{ borderColor: 'var(--line)' }}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-semibold">{app.name}</h4>
            <StatusPill status={app.status} />
          </div>
          <p className="mt-0.5 text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>
            {app.title} · {(app.expertise ?? []).join(', ') || '-'}
          </p>
          <p className="mt-1 text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
            {app.email || 'No email'} · {fmt(app.createdAt)} ·{' '}
            {app.priceXAF?.toLocaleString()} XAF / {app.sessionMinutes} min
            {app.introVideoBytes ? ` · video ${fmtBytes(app.introVideoBytes)}` : ''}
          </p>
        </div>
        {pending && onApprove && onReject && (
          <div className="flex gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={onApprove}
              className="btn btn-primary !py-2 text-[13px]"
            >
              {busy ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              Approve mentor
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={onReject}
              className="btn !py-2 text-[13px]"
              style={{ background: 'rgba(220,38,38,0.1)', color: '#b91c1c' }}
            >
              <X size={14} /> Reject
            </button>
          </div>
        )}
      </div>

      {app.bio && (
        <p className="mt-3 text-[13.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
          {app.bio}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {app.resumeUrl ? (
          <button
            type="button"
            onClick={downloadResume}
            disabled={dlBusy}
            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors hover:border-[var(--green-deep)] disabled:opacity-60"
            style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
          >
            {dlBusy ? (
              <Loader2 size={12} className="animate-spin" style={{ color: 'var(--green-deep)' }} />
            ) : (
              <Download size={12} style={{ color: 'var(--green-deep)' }} />
            )}
            Download CV
          </button>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] opacity-50" style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}>
            <Download size={12} /> CV missing
          </span>
        )}
        <DocLink href={app.idFrontUrl} icon={CreditCard} label="ID front" />
        <DocLink href={app.idBackUrl} icon={CreditCard} label="ID back" />
        <DocLink href={app.introVideoUrl} icon={Video} label="Intro video" />
      </div>

      {app.status === 'approved' && (
        <p className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-medium" style={{ color: 'var(--green-deep)' }}>
          <UserCheck size={13} /> Mentor access granted
        </p>
      )}
      {app.reviewNote && (
        <p className="mt-2 text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
          Note: {app.reviewNote}
        </p>
      )}
    </article>
  );
}

function StatusPill({ status }: { status: string }) {
  const colors: Record<string, { bg: string; color: string }> = {
    submitted: { bg: 'rgba(74,144,226,0.12)', color: 'var(--blue-ink)' },
    under_review: { bg: 'rgba(255,122,0,0.12)', color: '#c2570a' },
    approved: { bg: 'rgba(0,179,105,0.12)', color: 'var(--green-deep)' },
    rejected: { bg: 'rgba(220,38,38,0.1)', color: '#b91c1c' },
  };
  const c = colors[status] ?? { bg: 'var(--paper-dim)', color: 'var(--ink-soft)' };
  return (
    <span className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide" style={{ background: c.bg, color: c.color }}>
      {status.replace('_', ' ')}
    </span>
  );
}

function DocLink({
  href,
  icon: Icon,
  label,
}: {
  href?: string;
  icon: LucideIcon;
  label: string;
}) {
  if (!href) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] opacity-50" style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}>
        <Icon size={12} /> {label} missing
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors hover:border-[var(--green-deep)]"
      style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
    >
      <Icon size={12} style={{ color: 'var(--green-deep)' }} />
      {label}
      <ExternalLink size={11} style={{ color: 'var(--ink-soft)' }} />
    </a>
  );
}
