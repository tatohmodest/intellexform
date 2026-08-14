'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2, UserPlus, Users } from 'lucide-react';

type Member = {
  id: string;
  role: string;
  title?: string | null;
  isActive: boolean;
  suspendedAt?: string | null;
  joinedAt: string;
  user: {
    id: string;
    email: string | null;
    name: string | null;
    image?: string | null;
  };
};

export default function CampusPeoplePanel({
  slug,
  accent = '#00b369',
  mode,
}: {
  slug: string;
  accent?: string;
  mode: 'students' | 'instructors';
}) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [searchQ, setSearchQ] = useState('');
  const [searchHits, setSearchHits] = useState<
    Array<{
      id: string;
      email: string | null;
      name: string | null;
      mentorProfile?: { verified: boolean; expertise: string[]; tier: string } | null;
    }>
  >([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `/api/org/${encodeURIComponent(slug)}/members?role=${mode}`,
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load');
      setMembers(data.members || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setLoading(false);
    }
  }, [slug, mode]);

  useEffect(() => {
    load().catch(() => {});
  }, [load]);

  async function addMember(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch(`/api/org/${encodeURIComponent(slug)}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name: name || undefined,
          role: mode === 'instructors' ? 'INSTRUCTOR' : 'STUDENT',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not add');
      setEmail('');
      setName('');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setBusy(false);
    }
  }

  async function toggleSuspend(membershipId: string, suspend: boolean) {
    setBusy(true);
    try {
      const res = await fetch(`/api/org/${encodeURIComponent(slug)}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: suspend ? 'suspend' : 'restore',
          membershipId,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed');
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setBusy(false);
    }
  }

  async function runSearch() {
    if (searchQ.trim().length < 2) return;
    const res = await fetch(
      `/api/org/${encodeURIComponent(slug)}/members?search=${encodeURIComponent(searchQ)}`,
    );
    const data = await res.json();
    if (res.ok) setSearchHits(data.users || []);
  }

  async function addFromSearch(hit: { email: string | null; name: string | null }) {
    if (!hit.email) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/org/${encodeURIComponent(slug)}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: hit.email,
          name: hit.name || undefined,
          role: mode === 'instructors' ? 'INSTRUCTOR' : 'STUDENT',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not add');
      setSearchHits([]);
      setSearchQ('');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setBusy(false);
    }
  }

  const title = mode === 'students' ? 'Students' : 'Instructors';

  return (
    <section className="space-y-5">
      <div className="flex items-center gap-2.5">
        <Users size={17} style={{ color: accent }} />
        <h2 className="font-display text-[21px]">{title}</h2>
      </div>

      {mode === 'instructors' ? (
        <div className="border p-4" style={{ borderColor: 'var(--line)' }}>
          <p className="text-[13px] font-semibold">Search Intellex users</p>
          <p className="mt-1 text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
            Add verified mentors or existing accounts without creating duplicates.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <input
              className="form-input !rounded-none max-w-xs"
              placeholder="Name or email"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
            />
            <button
              type="button"
              className="border px-3 py-2 text-[13px] font-semibold"
              style={{ borderColor: 'var(--line)' }}
              onClick={runSearch}
            >
              Search
            </button>
          </div>
          {searchHits.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {searchHits.map((h) => (
                <li
                  key={h.id}
                  className="flex flex-wrap items-center justify-between gap-2 border px-3 py-2 text-[13px]"
                  style={{ borderColor: 'var(--line)' }}
                >
                  <div>
                    <p className="font-semibold">{h.name || h.email}</p>
                    <p style={{ color: 'var(--ink-soft)' }}>
                      {h.email}
                      {h.mentorProfile?.verified ? ' · Verified mentor' : ''}
                      {h.mentorProfile?.expertise?.length
                        ? ` · ${h.mentorProfile.expertise.slice(0, 3).join(', ')}`
                        : ''}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={busy}
                    className="px-3 py-1.5 text-[12px] font-semibold text-white"
                    style={{ background: accent }}
                    onClick={() => addFromSearch(h)}
                  >
                    Add as instructor
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      <form onSubmit={addMember} className="flex flex-wrap gap-2 border p-4" style={{ borderColor: 'var(--line)' }}>
        <div className="flex items-center gap-2 text-[13px] font-semibold">
          <UserPlus size={14} /> Add by email
        </div>
        <input
          className="form-input !rounded-none"
          placeholder="Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="form-input !rounded-none"
          type="email"
          required
          placeholder="email@school.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center gap-2 px-3 py-2 text-[13px] font-semibold text-white disabled:opacity-60"
          style={{ background: accent }}
        >
          {busy ? <Loader2 size={14} className="animate-spin" /> : null}
          Add {mode === 'students' ? 'student' : 'instructor'}
        </button>
      </form>

      {error ? (
        <p className="text-[13px]" style={{ color: '#b91c1c' }}>
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
          Loading…
        </p>
      ) : members.length === 0 ? (
        <div
          className="border border-dashed p-6 text-[13.5px]"
          style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}
        >
          {mode === 'students'
            ? 'No students yet. Add your first student or share an enrollment invite.'
            : 'No instructors yet. Search Intellex’s verified mentor network or invite by email.'}
        </div>
      ) : (
        <div className="overflow-x-auto border" style={{ borderColor: 'var(--line)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--paper-dim)' }}>
                {['Name', 'Email', 'Role', 'Status', ''].map((h) => (
                  <th key={h} className="px-3 py-2 text-left text-xs" style={{ color: 'var(--ink-soft)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} className="border-t" style={{ borderColor: 'var(--line)' }}>
                  <td className="px-3 py-2 font-semibold">{m.user.name || '—'}</td>
                  <td className="px-3 py-2">{m.user.email}</td>
                  <td className="px-3 py-2">{m.role}</td>
                  <td className="px-3 py-2">
                    {m.suspendedAt ? 'Suspended' : m.isActive ? 'Active' : 'Inactive'}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button
                      type="button"
                      disabled={busy}
                      className="text-[12px] font-semibold"
                      style={{ color: accent }}
                      onClick={() => toggleSuspend(m.id, !m.suspendedAt)}
                    >
                      {m.suspendedAt ? 'Restore' : 'Suspend'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
