'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Award,
  CheckCircle2,
  Clock,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import AdminGate from '@/components/admin/AdminGate';
import AdminShell from '@/components/admin/AdminShell';

type LearnerOption = {
  lbId: string;
  name: string;
  email: string;
  activeSubscription?: {
    plan: string;
    startsAt: string;
    endsAt: string;
    priceXAF: number;
  } | null;
};

type GrantRecord = {
  id: string;
  userId: string;
  learnerName: string;
  learnerEmail: string;
  plan: string;
  status: string;
  startsAt: string | null;
  endsAt: string | null;
  priceXAF: number;
  source: string;
  grantedBy: string | null;
  note: string | null;
  createdAt: string | null;
};

function SubscriptionsConsole() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LearnerOption[]>([]);
  const [searching, setSearching] = useState(false);
  const [recentGrants, setRecentGrants] = useState<GrantRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form State
  const [selectedUser, setSelectedUser] = useState<LearnerOption | null>(null);
  const [customIdentifier, setCustomIdentifier] = useState('');
  const [plan, setPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [months, setMonths] = useState<number>(1);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadRecent = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/subscriptions');
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to fetch subscriptions');
      setRecentGrants(data.recent || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading subscriptions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRecent();
  }, [loadRecent]);

  async function searchUsers(qStr: string) {
    if (!qStr.trim()) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const res = await fetch(`/api/admin/subscriptions?q=${encodeURIComponent(qStr.trim())}`);
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setSearchResults(data.learners || []);
      }
    } catch {
      /* ignore */
    } finally {
      setSearching(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) searchUsers(query);
      else setSearchResults([]);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  async function handleGrant(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const target = selectedUser?.email || selectedUser?.lbId || customIdentifier.trim();
    if (!target) {
      setError('Please select a learner or enter an email/user ID.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: target,
          plan,
          months,
          note: note.trim() || undefined,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          data.error === 'learner_not_found'
            ? 'No learner found with that email or ID. Please check spelling.'
            : data.error || 'Failed to grant subscription',
        );
      }

      setSuccessMsg(
        `Successfully granted ${months} month(s) of Intellex ${plan} subscription privileges to ${
          data.grant?.learnerName || target
        }!`,
      );
      setSelectedUser(null);
      setCustomIdentifier('');
      setQuery('');
      setNote('');
      await loadRecent();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Grant failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-6" style={{ borderColor: 'var(--line)' }}>
        <div>
          <div className="tab mb-2 inline-flex items-center gap-1.5">
            <Award size={11} /> Admin Controls
          </div>
          <h1 className="font-display text-[26px] font-bold">User Subscription Privileges</h1>
          <p className="mt-1 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
            Grant students 1-month or multi-month access to InTelleX packages, certification paths, and premium courses.
          </p>
        </div>
        <button
          type="button"
          onClick={loadRecent}
          disabled={loading}
          className="btn btn-ghost inline-flex items-center gap-2"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-xl border p-4 text-sm font-medium" style={{ borderColor: 'rgba(220,38,38,0.3)', background: 'rgba(220,38,38,0.06)', color: '#b91c1c' }}>
          {error}
        </div>
      )}

      {successMsg && (
        <div className="rounded-xl border p-4 text-sm font-medium" style={{ borderColor: 'rgba(0,179,105,0.3)', background: 'rgba(0,179,105,0.08)', color: 'var(--green-deep)' }}>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        </div>
      )}

      {/* Grant Form & Search Panel */}
      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        {/* Left Column: Grant Action Form */}
        <section className="rounded-2xl border p-6 space-y-6" style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}>
          <h2 className="font-display text-[18px] font-semibold flex items-center gap-2">
            <ShieldCheck size={18} style={{ color: 'var(--green-deep)' }} /> Grant Subscription Privileges
          </h2>

          <form onSubmit={handleGrant} className="space-y-5">
            {/* Learner Selection */}
            <div>
              <label className="block text-[13px] font-semibold mb-2">
                1. Select Learner
              </label>

              {selectedUser ? (
                <div className="flex items-center justify-between rounded-xl border p-3" style={{ borderColor: 'var(--green-deep)', background: 'rgba(0,179,105,0.06)' }}>
                  <div className="flex items-center gap-3">
                    <UserCheck size={18} style={{ color: 'var(--green-deep)' }} />
                    <div>
                      <div className="font-semibold text-[14px]">{selectedUser.name}</div>
                      <div className="text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                        {selectedUser.email || selectedUser.lbId}
                        {selectedUser.activeSubscription ? ' · Has active plan' : ' · No active plan'}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedUser(null)}
                    className="text-[12px] font-semibold underline"
                    style={{ color: 'var(--ink-soft)' }}
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--ink-soft)' }} />
                    <input
                      type="text"
                      className="form-input w-full !pl-9 text-[14px]"
                      placeholder="Search student by name or email…"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                    {searching && (
                      <Loader2 size={14} className="animate-spin absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--ink-soft)' }} />
                    )}
                  </div>

                  {searchResults.length > 0 && (
                    <ul className="max-h-48 overflow-y-auto rounded-xl border divide-y" style={{ borderColor: 'var(--line)', background: 'var(--paper)' }}>
                      {searchResults.map((user) => (
                        <li key={user.lbId}>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedUser(user);
                              setQuery('');
                              setSearchResults([]);
                            }}
                            className="w-full text-left p-3 hover:bg-black/5 flex items-center justify-between text-[13px]"
                          >
                            <div>
                              <span className="font-semibold block">{user.name}</span>
                              <span style={{ color: 'var(--ink-soft)' }}>{user.email || user.lbId}</span>
                            </div>
                            {user.activeSubscription && (
                              <span className="text-[11px] font-semibold rounded-full px-2 py-0.5" style={{ background: 'rgba(0,179,105,0.12)', color: 'var(--green-deep)' }}>
                                Active: {user.activeSubscription.plan}
                              </span>
                            )}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                    Or enter email directly:{' '}
                    <input
                      type="email"
                      className="form-input !py-1 text-[13px] mt-1"
                      placeholder="student@gmail.com"
                      value={customIdentifier}
                      onChange={(e) => setCustomIdentifier(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Duration / Package Settings */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-[13px] font-semibold mb-1.5">
                  2. Plan Tier
                </label>
                <select
                  className="form-input text-[13.5px]"
                  value={plan}
                  onChange={(e) => setPlan(e.target.value as 'monthly' | 'yearly')}
                >
                  <option value="monthly">Monthly Certification Access</option>
                  <option value="yearly">Yearly Full Package Access</option>
                </select>
              </div>

              <div>
                <label className="block text-[13px] font-semibold mb-1.5">
                  3. Access Duration
                </label>
                <select
                  className="form-input text-[13.5px]"
                  value={months}
                  onChange={(e) => setMonths(Number(e.target.value))}
                >
                  <option value={1}>1 Month (Standard Grant)</option>
                  <option value={2}>2 Months Access</option>
                  <option value={3}>3 Months Access</option>
                  <option value={6}>6 Months Access</option>
                  <option value={12}>12 Months (Full Year)</option>
                </select>
              </div>
            </div>

            {/* Admin Note */}
            <div>
              <label className="block text-[13px] font-semibold mb-1.5">
                4. Admin Note / Reason (Optional)
              </label>
              <input
                type="text"
                className="form-input text-[13.5px]"
                placeholder="e.g. 1 Month free package grant for top student / scholarship"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={submitting || (!selectedUser && !customIdentifier.trim())}
              className="btn btn-primary w-full py-3 text-[14px] font-semibold inline-flex justify-center items-center gap-2"
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              {submitting ? 'Granting privileges…' : `Grant ${months} Month(s) Access Now`}
            </button>
          </form>
        </section>

        {/* Right Column: Privilege Info Card */}
        <aside className="rounded-2xl border p-6 space-y-4" style={{ borderColor: 'var(--line)', background: 'var(--paper)' }}>
          <h3 className="font-display text-[16px] font-semibold">What is unlocked with this grant?</h3>
          <ul className="space-y-3 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={15} className="shrink-0 mt-0.5" style={{ color: 'var(--green-deep)' }} />
              <span><strong>Full Guided Tutorials:</strong> Unlocks all Intermediate & Advanced course lessons across all tracks.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={15} className="shrink-0 mt-0.5" style={{ color: 'var(--green-deep)' }} />
              <span><strong>InTelleX Library:</strong> Includes all paid & premium ecosystem books.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={15} className="shrink-0 mt-0.5" style={{ color: 'var(--green-deep)' }} />
              <span><strong>InTelleX AI Tutor:</strong> Full access to AI course assist and quiz generation.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={15} className="shrink-0 mt-0.5" style={{ color: 'var(--green-deep)' }} />
              <span><strong>Certification Badges:</strong> Course completion verification & official certificates.</span>
            </li>
          </ul>

          <div className="rounded-xl border p-3 text-[12px]" style={{ borderColor: 'rgba(0,179,105,0.2)', background: 'rgba(0,179,105,0.04)' }}>
            <strong>Note:</strong> Admin grants immediately override previous expired plans and take effect instantly on student dashboards.
          </div>
        </aside>
      </div>

      {/* Subscription Grants History */}
      <section className="space-y-4">
        <h2 className="font-display text-[20px] font-bold">Recent Subscription Grants & History</h2>

        <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: 'var(--line)' }}>
          <table className="w-full text-left text-[13.5px]">
            <thead>
              <tr style={{ background: 'var(--paper-dim)', borderColor: 'var(--line)' }} className="border-b text-[12px] font-semibold uppercase tracking-wider text-[var(--ink-soft)]">
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Granted By</th>
                <th className="px-4 py-3">Expires</th>
                <th className="px-4 py-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--line)' }}>
              {recentGrants.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-[14px]" style={{ color: 'var(--ink-soft)' }}>
                    No subscription grants recorded yet.
                  </td>
                </tr>
              ) : (
                recentGrants.map((g) => {
                  const isActive = g.status === 'active' && g.endsAt && new Date(g.endsAt) > new Date();
                  return (
                    <tr key={g.id} className="hover:bg-black/5">
                      <td className="px-4 py-3 font-medium">
                        <div>{g.learnerName}</div>
                        <div className="text-[11.5px]" style={{ color: 'var(--ink-soft)' }}>{g.learnerEmail || g.userId}</div>
                      </td>
                      <td className="px-4 py-3 capitalize font-semibold">{g.plan}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-[12px] rounded-md px-2 py-0.5 font-medium" style={{ background: g.source === 'admin_grant' ? 'rgba(74,144,226,0.12)' : 'var(--paper-dim)', color: g.source === 'admin_grant' ? '#2563eb' : 'var(--ink-soft)' }}>
                          {g.source === 'admin_grant' ? 'Admin Grant' : 'Payment'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-[12px] rounded-full px-2.5 py-0.5 font-semibold" style={{ background: isActive ? 'rgba(0,179,105,0.12)' : 'rgba(220,38,38,0.12)', color: isActive ? 'var(--green-deep)' : '#b91c1c' }}>
                          {isActive ? 'Active' : 'Expired'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                        {g.grantedBy || 'Self-subscribed'}
                      </td>
                      <td className="px-4 py-3 text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                        {g.endsAt ? new Date(g.endsAt).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-4 py-3 text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                        {g.note || '-'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default function AdminSubscriptionsPage() {
  return (
    <AdminGate>
      {({ email, logout }) => (
        <AdminShell email={email} onLogout={logout} title="Subscriptions">
          <SubscriptionsConsole />
        </AdminShell>
      )}
    </AdminGate>
  );
}
