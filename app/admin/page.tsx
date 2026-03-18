'use client';

import { useEffect, useState } from 'react';
import { Users, RefreshCw, Search, Calendar, BookOpen, Phone, Mail, MapPin, Briefcase, Zap, Lock, LogOut, Eye, EyeOff, ShieldCheck } from 'lucide-react';

interface Registration {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  ageRange: string;
  program: string;
  learningMode: string;
  startDate: string;
  experienceLevel: string;
  occupation: string;
  motivation: string;
  referralSource: string;
  createdAt: string;
}

const PROGRAM_LABELS: Record<string, string> = {
  fullstack: 'Full Stack',
  mern: 'MERN Stack',
  pern: 'PERN Stack',
  'data-analysis': 'Data Analysis',
  django: 'Django',
  python: 'Python',
  javascript: 'JavaScript',
  'flutter-mobile-design': 'Flutter Mobile',
  'react-native-mobile-design': 'React Native Mobile',
  cybersecurity: 'Cybersecurity',
  'cybersecurity-ceh': 'CEH Prep',
  webfundamentals: 'Web Fundamentals',
  htmlcss: 'HTML & CSS',
  jsessentials: 'JS Essentials',
  'react-basics': 'React Basics',
  'python-basics': 'Python Basics',
};

const MODE_LABELS: Record<string, string> = {
  'self-paced': 'Self-Paced',
  live: 'Live Classes',
  mentorship: 'Mentorship',
  priority: 'Priority Access',
};

function fmt(d: string) {
  return new Date(d).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ── Login screen ──────────────────────────────────────────────────────────────
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
      if (res.ok) {
        onSuccess();
      } else {
        const data = await res.json();
        setError(data.error ?? 'Incorrect password');
      }
    } catch {
      setError('Could not connect. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo area */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gold-500/15 border border-gold-500/25 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={26} className="text-gold-400" />
          </div>
          <h1 className="font-display text-2xl font-bold text-intellex-text">Admin Access</h1>
          <p className="text-sm text-intellex-muted mt-1">Intellex · Registration Dashboard</p>
        </div>

        {/* Form card */}
        <form onSubmit={handleSubmit} className="glass-card p-8 space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-intellex-text/80 flex items-center gap-2">
              <Lock size={13} className="text-intellex-muted" />
              Admin Password
            </label>
            <div className="relative">
              <input
                type={show ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                autoFocus
                className="w-full form-input pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-intellex-muted hover:text-intellex-text transition-colors"
              >
                {show ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gold-500 text-navy-900 font-semibold text-sm hover:bg-gold-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <RefreshCw size={15} className="animate-spin" />
            ) : (
              <ShieldCheck size={15} />
            )}
            {loading ? 'Verifying…' : 'Enter Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/registrations');
      if (res.status === 401) { onLogout(); return; }
      if (!res.ok) throw new Error('Failed to fetch');
      setRegistrations(await res.json());
    } catch {
      setError('Could not load registrations. Check your connection.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    onLogout();
  }

  const filtered = registrations.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.fullName.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.program.toLowerCase().includes(q) ||
      (r.city ?? '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-navy-900 text-intellex-text">
      {/* Header */}
      <div className="border-b border-white/8 bg-navy-900/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gold-500/20 border border-gold-500/30 flex items-center justify-center">
              <Users size={16} className="text-gold-400" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg text-intellex-text">Admin — Registrations</h1>
              <p className="text-xs text-intellex-muted">
                {loading ? 'Loading…' : `${registrations.length} total · ${filtered.length} shown`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-intellex-muted" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, email, program…"
                className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-intellex-text placeholder:text-intellex-muted focus:outline-none focus:border-gold-500/40 w-64"
              />
            </div>
            <button
              onClick={loadData}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-intellex-muted hover:text-intellex-text hover:border-white/20 transition-all"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 hover:bg-red-500/15 transition-all"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Error */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 rounded-xl bg-white/3 border border-white/8 animate-pulse" />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-20 text-intellex-muted">
            <Users size={40} className="mx-auto mb-4 opacity-30" />
            <p className="font-medium">{search ? 'No results match your search' : 'No registrations yet'}</p>
            <p className="text-sm mt-1">{search ? 'Try a different search term' : 'Registrations will appear here once users sign up'}</p>
          </div>
        )}

        {/* Table */}
        {!loading && filtered.length > 0 && (
          <div className="overflow-x-auto rounded-2xl border border-white/8">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white/3 border-b border-white/8">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-intellex-muted tracking-wide">#</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-intellex-muted tracking-wide">NAME</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-intellex-muted tracking-wide">CONTACT</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-intellex-muted tracking-wide">PROGRAM</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-intellex-muted tracking-wide">MODE</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-intellex-muted tracking-wide">LEVEL</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-intellex-muted tracking-wide">REGISTERED</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <>
                    <tr
                      key={r._id}
                      className={`border-b border-white/5 hover:bg-white/3 cursor-pointer transition-colors ${expanded === r._id ? 'bg-white/3' : ''}`}
                      onClick={() => setExpanded(expanded === r._id ? null : r._id)}
                    >
                      <td className="px-4 py-3 text-intellex-muted">{i + 1}</td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-intellex-text">{r.fullName}</p>
                        <p className="text-xs text-intellex-muted">{r.city || '—'} · {r.ageRange || '—'}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-intellex-text">{r.email}</p>
                        <p className="text-xs text-intellex-muted">{r.phone}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-block bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs font-semibold px-2 py-1 rounded-lg">
                          {PROGRAM_LABELS[r.program] ?? r.program}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-intellex-muted text-xs">
                        {MODE_LABELS[r.learningMode] ?? r.learningMode}
                      </td>
                      <td className="px-4 py-3 text-intellex-muted text-xs">
                        {r.experienceLevel?.replace(/-/g, ' ') ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-intellex-muted text-xs whitespace-nowrap">
                        {r.createdAt ? fmt(r.createdAt) : '—'}
                      </td>
                      <td className="px-4 py-3 text-intellex-muted text-xs">
                        <span className="underline underline-offset-2">{expanded === r._id ? 'less' : 'more'}</span>
                      </td>
                    </tr>
                    {expanded === r._id && (
                      <tr key={`${r._id}-detail`} className="bg-white/2 border-b border-white/5">
                        <td colSpan={8} className="px-6 py-5">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div className="space-y-2">
                              <p className="text-xs font-semibold text-intellex-muted tracking-wide mb-3 flex items-center gap-1.5">
                                <Briefcase size={12} /> BACKGROUND
                              </p>
                              <p className="text-xs text-intellex-muted">Occupation</p>
                              <p className="text-sm text-intellex-text">{r.occupation || '—'}</p>
                              <p className="text-xs text-intellex-muted mt-2">Start preference</p>
                              <p className="text-sm text-intellex-text">{r.startDate?.replace(/-/g, ' ') || '—'}</p>
                              <p className="text-xs text-intellex-muted mt-2">Referral source</p>
                              <p className="text-sm text-intellex-text">{r.referralSource?.replace(/-/g, ' ') || '—'}</p>
                            </div>
                            <div className="md:col-span-2 space-y-2">
                              <p className="text-xs font-semibold text-intellex-muted tracking-wide mb-3 flex items-center gap-1.5">
                                <Zap size={12} /> MOTIVATION
                              </p>
                              <p className="text-sm text-intellex-text leading-relaxed">{r.motivation || '—'}</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Stats summary */}
        {!loading && registrations.length > 0 && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Registrations', value: registrations.length, icon: Users },
              {
                label: 'This Month',
                value: registrations.filter((r) => {
                  const d = new Date(r.createdAt);
                  const now = new Date();
                  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                }).length,
                icon: Calendar,
              },
              { label: 'Unique Programs', value: new Set(registrations.map((r) => r.program)).size, icon: BookOpen },
              {
                label: 'Cities Represented',
                value: new Set(registrations.map((r) => r.city).filter(Boolean)).size,
                icon: MapPin,
              },
            ].map((s) => (
              <div key={s.label} className="glass-card p-5">
                <div className="flex items-center gap-2 mb-2">
                  <s.icon size={14} className="text-gold-400" />
                  <p className="text-xs text-intellex-muted">{s.label}</p>
                </div>
                <p className="text-2xl font-bold font-display text-intellex-text">{s.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Root: auth gate ───────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authState, setAuthState] = useState<'checking' | 'unauthenticated' | 'authenticated'>('checking');

  useEffect(() => {
    fetch('/api/admin/auth')
      .then((r) => setAuthState(r.ok ? 'authenticated' : 'unauthenticated'))
      .catch(() => setAuthState('unauthenticated'));
  }, []);

  if (authState === 'checking') {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="flex items-center gap-3 text-intellex-muted">
          <RefreshCw size={18} className="animate-spin" />
          <span className="text-sm">Checking access…</span>
        </div>
      </div>
    );
  }

  if (authState === 'unauthenticated') {
    return <LoginForm onSuccess={() => setAuthState('authenticated')} />;
  }

  return <Dashboard onLogout={() => setAuthState('unauthenticated')} />;
}
