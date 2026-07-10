'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  RefreshCw, Search, Lock, LogOut, Eye, EyeOff, ShieldCheck,
  Users, MessageSquare, ShoppingBag,
} from 'lucide-react';
import { formatXAF } from '@/lib/format';

type Tab = 'requests' | 'orders' | 'registrations';

interface RequestRow {
  _id: string;
  fullName: string;
  whatsapp: string;
  field: string;
  plan: string;
  message?: string;
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
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) onSuccess();
      else setError((await res.json()).error ?? 'Incorrect password');
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
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: 'var(--amber-soft)' }}>
            <ShieldCheck size={26} style={{ color: 'var(--green-deep)' }} />
          </div>
          <h1 className="font-display text-2xl font-bold">Admin Access</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--ink-soft)' }}>Intellex · Dashboard</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5 rounded-[20px] border p-8" style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}>
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-medium">
              <Lock size={13} style={{ color: 'var(--ink-soft)' }} /> Admin Password
            </label>
            <div className="relative">
              <input
                type={show ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                autoFocus
                className="form-input pr-10"
                required
              />
              <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--ink-soft)' }}>
                {show ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          {error && <p className="rounded-xl px-4 py-3 text-sm" style={{ background: 'rgba(220,38,38,0.08)', color: '#b91c1c' }}>{error}</p>}
          <button type="submit" disabled={loading || !password} className="btn btn-primary w-full">
            {loading ? <RefreshCw size={15} className="animate-spin" /> : <ShieldCheck size={15} />}
            {loading ? 'Verifying…' : 'Enter Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>('requests');
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
  const fReq = requests.filter((r) => `${r.fullName} ${r.field} ${r.plan} ${r.whatsapp}`.toLowerCase().includes(q));
  const fOrd = orders.filter((o) => `${o.fullName} ${o.courseName} ${o.whatsapp}`.toLowerCase().includes(q));
  const fReg = registrations.filter((r) => `${r.fullName} ${r.email} ${r.program}`.toLowerCase().includes(q));

  const TABS: { id: Tab; label: string; icon: typeof Users; count: number }[] = [
    { id: 'requests', label: 'Requests', icon: MessageSquare, count: requests.length },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, count: orders.length },
    { id: 'registrations', label: 'Registrations', icon: Users, count: registrations.length },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--paper)' }}>
      <div className="sticky top-0 z-40 border-b backdrop-blur" style={{ borderColor: 'var(--line)', background: 'rgba(251,248,240,0.9)' }}>
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div>
            <h1 className="font-display text-lg font-bold">Intellex Admin</h1>
            <p className="text-xs" style={{ color: 'var(--ink-soft)' }}>
              {loading ? 'Loading…' : `${requests.length} requests · ${orders.length} orders · ${registrations.length} registrations`}
            </p>
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
              <span className="rounded-full px-1.5 text-xs" style={{ background: 'var(--paper-dim)' }}>{t.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {tab === 'requests' && (
          <Table
            head={['#', 'NAME', 'WHATSAPP', 'FIELD', 'PLAN', 'MESSAGE', 'CREATED']}
            rows={fReq.map((r, i) => [
              String(i + 1), r.fullName, r.whatsapp, r.field, r.plan, r.message || '—', fmt(r.createdAt),
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

  useEffect(() => {
    fetch('/api/admin/auth')
      .then((r) => setAuthState(r.ok ? 'authenticated' : 'unauthenticated'))
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
  if (authState === 'unauthenticated') return <LoginForm onSuccess={() => setAuthState('authenticated')} />;
  return <Dashboard onLogout={() => setAuthState('unauthenticated')} />;
}
