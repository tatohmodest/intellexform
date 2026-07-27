'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  RefreshCw, Search, Lock, LogOut, ShieldCheck, Mail,
  Users, MessageSquare, ShoppingBag, BookOpen, GraduationCap, ClipboardCheck,
} from 'lucide-react';
import { formatXAF } from '@/lib/format';
import AdminCourses from '@/components/admin/AdminCourses';
import AdminLearning from '@/components/admin/AdminLearning';
import AdminApplications from '@/components/admin/AdminApplications';
import BrandLogo from '@/components/BrandLogo';

type Tab = 'learning' | 'applications' | 'requests' | 'orders' | 'registrations' | 'courses';

interface RequestRow {
  _id: string;
  contactType?: string;
  fullName: string;
  whatsapp: string;
  email?: string;
  field: string;
  plan: string;
  message?: string;
  institutionName?: string;
  createdAt: string;
}
interface OrderRow {
  _id: string;
  fullName: string;
  whatsapp: string;
  email?: string;
  courseName: string;
  amountXAF: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
}
interface RegistrationRow {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  program: string;
  createdAt: string;
}

function fmt(d: string) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [hint, setHint] = useState('');

  async function requestOtp(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setHint('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/otp/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? 'Could not send code');
        return;
      }
      setHint(`Code sent to ${data.email || email}. Check your inbox.`);
      setStep('otp');
    } catch {
      setError('Could not connect. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? 'Incorrect code');
        return;
      }
      onSuccess();
    } catch {
      setError('Could not connect. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4" style={{ background: 'var(--paper)' }}>
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex justify-center">
            <BrandLogo href={null} height={48} variant="mark" />
          </div>
          <h1 className="font-display text-2xl font-bold">Admin Access</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--ink-soft)' }}>
            InTelleX · OTP for authorized emails
          </p>
        </div>

        {step === 'email' ? (
          <form
            onSubmit={requestOtp}
            className="space-y-5 rounded-[20px] border p-8"
            style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}
          >
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm font-medium">
                <Mail size={13} style={{ color: 'var(--ink-soft)' }} /> Admin email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@gmail.com"
                autoFocus
                className="form-input"
                required
              />
              <p className="text-xs" style={{ color: 'var(--ink-soft)' }}>
                Only allowlisted InTelleX admins receive a code. If you are already signed in with that
                account, open /admin again — you skip OTP.
              </p>
            </div>
            {error && (
              <p className="rounded-xl px-4 py-3 text-sm" style={{ background: 'rgba(220,38,38,0.08)', color: '#b91c1c' }}>
                {error}
              </p>
            )}
            <button type="submit" disabled={loading || !email} className="btn btn-primary w-full">
              {loading ? <RefreshCw size={15} className="animate-spin" /> : <Mail size={15} />}
              {loading ? 'Sending…' : 'Send one-time code'}
            </button>
            <p className="text-center text-xs" style={{ color: 'var(--ink-soft)' }}>
              Or{' '}
              <a href="/login?next=/admin" className="font-semibold underline" style={{ color: 'var(--green-deep)' }}>
                sign in with Looping Binary
              </a>{' '}
              using your admin email to enter without OTP.
            </p>
          </form>
        ) : (
          <form
            onSubmit={verifyOtp}
            className="space-y-5 rounded-[20px] border p-8"
            style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}
          >
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm font-medium">
                <Lock size={13} style={{ color: 'var(--ink-soft)' }} /> 6-digit code
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="••••••"
                autoFocus
                className="form-input tracking-[0.35em] text-center text-lg font-semibold"
                required
              />
              {hint && (
                <p className="text-xs" style={{ color: 'var(--green-deep)' }}>
                  {hint}
                </p>
              )}
            </div>
            {error && (
              <p className="rounded-xl px-4 py-3 text-sm" style={{ background: 'rgba(220,38,38,0.08)', color: '#b91c1c' }}>
                {error}
              </p>
            )}
            <button type="submit" disabled={loading || code.length !== 6} className="btn btn-primary w-full">
              {loading ? <RefreshCw size={15} className="animate-spin" /> : <ShieldCheck size={15} />}
              {loading ? 'Verifying…' : 'Enter Dashboard'}
            </button>
            <button
              type="button"
              className="btn btn-ghost w-full"
              onClick={() => {
                setStep('email');
                setCode('');
                setError('');
              }}
            >
              Use a different email
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Dashboard({ onLogout, adminEmail }: { onLogout: () => void; adminEmail?: string }) {
  const [tab, setTab] = useState<Tab>('learning');
  const [requests, setRequests] = useState<RequestRow[]>([]);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [registrations, setRegistrations] = useState<RegistrationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [rq, or, rg] = await Promise.all([
        fetch('/api/admin/requests'),
        fetch('/api/admin/orders'),
        fetch('/api/admin/registrations'),
      ]);
      if (rq.status === 401 || or.status === 401 || rg.status === 401) { onLogout(); return; }
      setRequests(rq.ok ? await rq.json() : []);
      setOrders(or.ok ? await or.json() : []);
      setRegistrations(rg.ok ? await rg.json() : []);
    } finally {
      setLoading(false);
    }
  }, [onLogout]);

  useEffect(() => { loadData(); }, [loadData]);

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    onLogout();
  }

  const q = search.toLowerCase();
  const fReq = requests.filter((r) =>
    `${r.contactType || ''} ${r.fullName} ${r.field} ${r.plan} ${r.whatsapp} ${r.institutionName || ''} ${r.email || ''}`
      .toLowerCase()
      .includes(q),
  );
  const fOrd = orders.filter((o) => `${o.fullName} ${o.courseName} ${o.whatsapp}`.toLowerCase().includes(q));
  const fReg = registrations.filter((r) => `${r.fullName} ${r.email} ${r.program}`.toLowerCase().includes(q));

  const TABS: { id: Tab; label: string; icon: typeof Users; count: number | null }[] = [
    { id: 'learning', label: 'Learning', icon: GraduationCap, count: null },
    { id: 'applications', label: 'Applications', icon: ClipboardCheck, count: null },
    { id: 'requests', label: 'Requests', icon: MessageSquare, count: requests.length },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, count: orders.length },
    { id: 'registrations', label: 'Registrations', icon: Users, count: registrations.length },
    { id: 'courses', label: 'Courses', icon: BookOpen, count: null },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--paper)' }}>
      <div className="sticky top-0 z-40 border-b backdrop-blur" style={{ borderColor: 'var(--line)', background: 'rgba(251,248,240,0.9)' }}>
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <BrandLogo href="/" height={28} variant="full" />
            <div>
              <h1 className="font-display text-lg font-bold">Admin</h1>
              <p className="text-xs" style={{ color: 'var(--ink-soft)' }}>
                {adminEmail ? `${adminEmail} · ` : ''}
                {loading ? 'Loading…' : `${requests.length} requests · ${orders.length} orders · ${registrations.length} registrations`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--ink-soft)' }} />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…" className="form-input w-56 pl-9" />
            </div>
            <button onClick={loadData} className="btn btn-ghost" style={{ padding: '9px 16px' }}>
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
            <button onClick={handleLogout} className="btn" style={{ padding: '9px 16px', background: 'rgba(220,38,38,0.1)', color: '#b91c1c' }}>
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
        <div className="mx-auto flex max-w-7xl gap-1 px-6">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors"
              style={{
                borderColor: tab === t.id ? 'var(--green-deep)' : 'transparent',
                color: tab === t.id ? 'var(--green-deep)' : 'var(--ink-soft)',
              }}
            >
              <t.icon size={15} /> {t.label}
              {t.count !== null && (
                <span className="rounded-full px-1.5 text-xs" style={{ background: 'var(--paper-dim)' }}>{t.count}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {tab === 'learning' && <AdminLearning />}
        {tab === 'applications' && <AdminApplications />}
        {tab === 'requests' && (
          <Table
            head={['#', 'TYPE', 'NAME', 'WHATSAPP', 'FIELD / CAMPUS', 'PLAN', 'MESSAGE', 'CREATED']}
            rows={fReq.map((r, i) => [
              String(i + 1),
              r.contactType || 'learner',
              r.fullName,
              r.whatsapp,
              r.institutionName ? `${r.field} (${r.institutionName})` : r.field,
              r.plan,
              r.message || '—',
              fmt(r.createdAt),
            ])}
            empty={loading ? 'Loading…' : 'No requests yet'}
          />
        )}
        {tab === 'orders' && (
          <Table
            head={['#', 'NAME', 'WHATSAPP', 'COURSE', 'AMOUNT', 'PAYMENT', 'STATUS', 'CREATED']}
            rows={fOrd.map((o, i) => [
              String(i + 1), o.fullName, o.whatsapp, o.courseName, formatXAF(o.amountXAF), o.paymentMethod, o.status, fmt(o.createdAt),
            ])}
            empty={loading ? 'Loading…' : 'No orders yet'}
          />
        )}
        {tab === 'registrations' && (
          <Table
            head={['#', 'NAME', 'EMAIL', 'PHONE', 'PROGRAM', 'CREATED']}
            rows={fReg.map((r, i) => [
              String(i + 1), r.fullName, r.email, r.phone, r.program, fmt(r.createdAt),
            ])}
            empty={loading ? 'Loading…' : 'No registrations yet'}
          />
        )}
        {tab === 'courses' && <AdminCourses />}
      </div>
    </div>
  );
}

function Table({ head, rows, empty }: { head: string[]; rows: string[][]; empty: string }) {
  if (rows.length === 0) {
    return <div className="py-20 text-center" style={{ color: 'var(--ink-soft)' }}>{empty}</div>;
  }
  return (
    <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: 'var(--line)' }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: 'var(--paper-dim)' }}>
            {head.map((h) => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold tracking-wide" style={{ color: 'var(--ink-soft)' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t" style={{ borderColor: 'var(--line)' }}>
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 align-top" style={{ color: j === 1 ? 'var(--ink)' : 'var(--ink-soft)', fontWeight: j === 1 ? 600 : 400, maxWidth: 260 }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminPage() {
  const [authState, setAuthState] = useState<'checking' | 'unauthenticated' | 'authenticated'>('checking');
  const [adminEmail, setAdminEmail] = useState('');

  useEffect(() => {
    fetch('/api/admin/auth')
      .then(async (r) => {
        if (!r.ok) {
          setAuthState('unauthenticated');
          return;
        }
        const data = await r.json().catch(() => ({}));
        setAdminEmail(data.email || '');
        setAuthState('authenticated');
      })
      .catch(() => setAuthState('unauthenticated'));
  }, []);

  if (authState === 'checking') {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: 'var(--paper)' }}>
        <div className="flex items-center gap-3" style={{ color: 'var(--ink-soft)' }}>
          <RefreshCw size={18} className="animate-spin" /> <span className="text-sm">Checking access…</span>
        </div>
      </div>
    );
  }
  if (authState === 'unauthenticated') {
    return (
      <LoginForm
        onSuccess={() => {
          setAuthState('authenticated');
          fetch('/api/admin/auth')
            .then((r) => (r.ok ? r.json() : null))
            .then((d) => setAdminEmail(d?.email || ''))
            .catch(() => {});
        }}
      />
    );
  }
  return (
    <Dashboard
      adminEmail={adminEmail}
      onLogout={() => {
        setAuthState('unauthenticated');
        setAdminEmail('');
      }}
    />
  );
}
