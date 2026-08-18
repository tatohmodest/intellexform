'use client';

import { useEffect, useState } from 'react';
import {
  DESK_BLURBS,
  DESK_LABELS,
  STAFF_DESKS,
  STAFF_PERMISSIONS,
  PERMISSION_LABELS,
  type StaffDesk,
  type StaffPermission,
} from '@/lib/staff/permissions';

type Post = {
  userId: string;
  email: string;
  name: string;
  desks: StaffDesk[];
  extraPermissions: StaffPermission[];
  active: boolean;
  grantedBy: string;
  grantedAt: string | Date;
};

export default function AdminStaffDesk() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [email, setEmail] = useState('');
  const [desks, setDesks] = useState<StaffDesk[]>(['secretary']);
  const [extra, setExtra] = useState<StaffPermission[]>([]);
  const [showExtra, setShowExtra] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch('/api/admin/staff');
    const data = await res.json().catch(() => ({}));
    if (res.ok) setPosts(data.posts || []);
    setLoading(false);
  }

  useEffect(() => {
    load().catch(() => setLoading(false));
  }, []);

  function toggleDesk(d: StaffDesk) {
    setDesks((cur) => (cur.includes(d) ? cur.filter((x) => x !== d) : [...cur, d]));
  }

  function toggleExtra(p: StaffPermission) {
    setExtra((cur) => (cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p]));
  }

  async function grant() {
    setBusy(true);
    setMsg('');
    try {
      const res = await fetch('/api/admin/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, desks, extraPermissions: extra, active: true }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not grant staff');
      setEmail('');
      setMsg(`Staff access granted for ${data.post?.email || email}.`);
      await load();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Could not grant staff');
    } finally {
      setBusy(false);
    }
  }

  async function revoke(userId: string) {
    if (!confirm('Revoke this staff post? They will lose the Staff workspace immediately.')) return;
    const res = await fetch('/api/admin/staff', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    if (res.ok) await load();
  }

  async function restore(post: Post) {
    const res = await fetch('/api/admin/staff', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: post.email,
        desks: post.desks.length ? post.desks : ['secretary'],
        extraPermissions: post.extraPermissions,
        active: true,
      }),
    });
    if (res.ok) await load();
  }

  return (
    <div className="mx-auto max-w-[920px] space-y-8">
      <header>
        <p className="font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: 'var(--ink-soft)' }}>
          Platform admin
        </p>
        <h1 className="mt-1 font-display text-[32px] leading-tight">Staff posts</h1>
        <p className="mt-2 max-w-[640px] text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
          Only platform administrators can designate staff. People cannot assign themselves a desk.
          The person must already have an InTelleX account. After you grant a post, they see Staff on
          the normal dashboard — not in /admin.
        </p>
      </header>

      <form
        className="border p-4"
        style={{ borderColor: 'var(--line)' }}
        onSubmit={(e) => {
          e.preventDefault();
          grant();
        }}
      >
        <h2 className="mb-3 font-display text-[20px]">Grant staff access</h2>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="staff@example.com"
          className="mb-4 w-full border px-3 py-2.5 text-[14px]"
          style={{ borderColor: 'var(--line)', background: 'transparent' }}
        />
        <div className="grid gap-2 sm:grid-cols-2">
          {STAFF_DESKS.map((d) => (
            <label key={d} className="flex cursor-pointer items-start gap-2 border p-3" style={{ borderColor: 'var(--line)' }}>
              <input type="checkbox" checked={desks.includes(d)} onChange={() => toggleDesk(d)} className="mt-1" />
              <span>
                <span className="block text-[13.5px] font-semibold">{DESK_LABELS[d]}</span>
                <span className="block text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                  {DESK_BLURBS[d]}
                </span>
              </span>
            </label>
          ))}
        </div>
        <button
          type="button"
          className="mt-3 text-[12.5px] font-semibold"
          style={{ color: 'var(--green-deep)' }}
          onClick={() => setShowExtra((v) => !v)}
        >
          {showExtra ? 'Hide extra permissions' : 'Add extra permissions'}
        </button>
        {showExtra ? (
          <div className="mt-2 grid gap-1 sm:grid-cols-2">
            {STAFF_PERMISSIONS.map((p) => (
              <label key={p} className="flex items-center gap-2 text-[13px]">
                <input type="checkbox" checked={extra.includes(p)} onChange={() => toggleExtra(p)} />
                {PERMISSION_LABELS[p]}
              </label>
            ))}
          </div>
        ) : null}
        <div className="mt-4 flex items-center gap-3">
          <button
            type="submit"
            disabled={busy || !desks.length}
            className="px-4 py-2 text-[13px] font-semibold text-white"
            style={{ background: '#00B369' }}
          >
            {busy ? 'Saving…' : 'Grant staff post'}
          </button>
          {msg ? (
            <span className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
              {msg}
            </span>
          ) : null}
        </div>
      </form>

      <section>
        <h2 className="mb-3 font-display text-[20px]">Current posts</h2>
        {loading ? (
          <p style={{ color: 'var(--ink-soft)' }}>Loading…</p>
        ) : posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed px-4 py-8 text-center" style={{ borderColor: 'var(--line)' }}>
            <p className="font-display text-[18px]">No staff designated yet</p>
            <p className="mt-1 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
              Grant a secretary, finance, or director desk to someone who already has an account.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((p) => (
              <article key={p.userId} className="border p-4" style={{ borderColor: 'var(--line)' }}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">
                      {p.name}{' '}
                      {!p.active ? (
                        <span className="text-[12px] font-medium" style={{ color: '#b91c1c' }}>
                          revoked
                        </span>
                      ) : null}
                    </p>
                    <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                      {p.email}
                    </p>
                    <p className="mt-1 text-[13px]">
                      {(p.desks || []).map((d) => DESK_LABELS[d]).join(' · ') || 'No desk'}
                    </p>
                    <p className="mt-1 text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                      Granted by {p.grantedBy}
                    </p>
                  </div>
                  {p.active ? (
                    <button
                      type="button"
                      onClick={() => revoke(p.userId)}
                      className="border px-3 py-1.5 text-[12.5px] font-semibold"
                      style={{ borderColor: 'var(--line)', color: '#b91c1c' }}
                    >
                      Revoke
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => restore(p)}
                      className="border px-3 py-1.5 text-[12.5px] font-semibold"
                      style={{ borderColor: 'var(--line)' }}
                    >
                      Restore
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
