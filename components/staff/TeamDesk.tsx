'use client';

import { useEffect, useState } from 'react';
import {
  DESK_BLURBS,
  DESK_LABELS,
  DESK_PERMISSIONS,
  PERMISSION_LABELS,
  STAFF_DESKS,
  STAFF_PERMISSIONS,
  type StaffDesk,
  type StaffPermission,
} from '@/lib/staff/permissions';

type Post = {
  userId: string;
  email: string;
  name: string;
  desks: StaffDesk[];
  extraPermissions: StaffPermission[];
  campusSlugs: string[];
  active: boolean;
  grantedBy: string;
};

type Campus = { slug: string; name: string };

export default function TeamDesk({
  actorPermissions,
  actorCampusSlugs,
}: {
  actorPermissions: StaffPermission[];
  actorCampusSlugs: string[];
}) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [email, setEmail] = useState('');
  const [preset, setPreset] = useState<StaffDesk | ''>('');
  const [perms, setPerms] = useState<StaffPermission[]>(['staff.access', 'students.read']);
  const [campusSlugs, setCampusSlugs] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);

  const isDirector = actorPermissions.includes('director.view');
  const grantable = isDirector
    ? [...STAFF_PERMISSIONS]
    : STAFF_PERMISSIONS.filter((p) => actorPermissions.includes(p));
  const campusOptions = actorCampusSlugs.length
    ? campuses.filter((c) => actorCampusSlugs.includes(c.slug))
    : campuses;

  async function load() {
    const [team, camp] = await Promise.all([fetch('/api/staff/team'), fetch('/api/staff/campuses')]);
    const teamData = await team.json().catch(() => ({}));
    const campData = await camp.json().catch(() => ({}));
    if (team.ok) setPosts(teamData.posts || []);
    if (camp.ok) setCampuses(campData.campuses || []);
    setLoading(false);
  }

  useEffect(() => {
    load().catch(() => setLoading(false));
  }, []);

  function applyPreset(d: StaffDesk | '') {
    setPreset(d);
    if (!d) return;
    setPerms(DESK_PERMISSIONS[d].filter((p) => actorPermissions.includes(p)));
  }

  function togglePerm(p: StaffPermission) {
    setPerms((cur) => (cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p]));
  }

  function toggleCampus(slug: string) {
    setCampusSlugs((cur) => (cur.includes(slug) ? cur.filter((x) => x !== slug) : [...cur, slug]));
  }

  async function grant() {
    setBusy(true);
    setMsg('');
    try {
      const res = await fetch('/api/staff/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          desks: preset ? [preset] : [],
          extraPermissions: preset ? [] : perms,
          campusSlugs,
          active: true,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not appoint staff');
      setEmail('');
      setMsg(`Appointed ${data.post?.email || email}.`);
      await load();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Could not appoint staff');
    } finally {
      setBusy(false);
    }
  }

  async function revoke(userId: string) {
    if (!confirm('Revoke this staff post? They will lose these responsibilities immediately.')) return;
    const res = await fetch('/api/staff/team', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMsg(data.error || 'Could not revoke');
      return;
    }
    await load();
  }

  return (
    <div className="space-y-8">
      <form
        className="border p-4"
        style={{ borderColor: 'var(--line)' }}
        onSubmit={(e) => {
          e.preventDefault();
          grant();
        }}
      >
        <h2 className="mb-1 font-display text-[20px]">Appoint staff</h2>
        <p className="mb-4 text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>
          They must already have an InTelleX account. You only grant modules you have, and only for
          campuses you manage. Empty campus list means the whole institution.
        </p>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="colleague@example.com"
          className="mb-3 w-full border px-3 py-2.5 text-[14px]"
          style={{ borderColor: 'var(--line)', background: 'transparent' }}
        />
        <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide" style={{ color: 'var(--ink-soft)' }}>
          Optional preset
        </p>
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => applyPreset('')}
            className="border px-3 py-1.5 text-[12.5px]"
            style={{ borderColor: preset === '' ? 'var(--ink)' : 'var(--line)' }}
          >
            Custom
          </button>
          {STAFF_DESKS.filter((d) =>
            isDirector ? true : DESK_PERMISSIONS[d].every((p) => actorPermissions.includes(p)),
          ).map((d) => (
              <button
                key={d}
                type="button"
                title={DESK_BLURBS[d]}
                onClick={() => applyPreset(d)}
                className="border px-3 py-1.5 text-[12.5px]"
                style={{ borderColor: preset === d ? 'var(--ink)' : 'var(--line)' }}
              >
                {DESK_LABELS[d]}
              </button>
            ))}
        </div>
        <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide" style={{ color: 'var(--ink-soft)' }}>
          Permissions
        </p>
        <div className="mb-4 grid gap-1 sm:grid-cols-2">
          {grantable.map((p) => (
            <label key={p} className="flex items-center gap-2 text-[13px]">
              <input type="checkbox" checked={perms.includes(p)} onChange={() => togglePerm(p)} />
              {PERMISSION_LABELS[p]}
            </label>
          ))}
        </div>
        {campusOptions.length > 0 ? (
          <>
            <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide" style={{ color: 'var(--ink-soft)' }}>
              Campus scope
            </p>
            <div className="mb-4 flex flex-wrap gap-2">
              {campusOptions.map((c) => (
                <label key={c.slug} className="flex items-center gap-2 border px-3 py-1.5 text-[13px]" style={{ borderColor: 'var(--line)' }}>
                  <input type="checkbox" checked={campusSlugs.includes(c.slug)} onChange={() => toggleCampus(c.slug)} />
                  {c.name}
                </label>
              ))}
            </div>
          </>
        ) : (
          <p className="mb-4 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
            No campuses yet — this person will have institution-wide scope. Create campuses first if you want to limit them.
          </p>
        )}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={busy}
            className="px-4 py-2 text-[13px] font-semibold text-white"
            style={{ background: '#00B369' }}
          >
            {busy ? 'Saving…' : 'Appoint'}
          </button>
          {msg ? (
            <span className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
              {msg}
            </span>
          ) : null}
        </div>
      </form>

      <section>
        <h2 className="mb-3 font-display text-[20px]">People with staff posts</h2>
        {loading ? (
          <p style={{ color: 'var(--ink-soft)' }}>Loading…</p>
        ) : posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed px-4 py-8 text-center" style={{ borderColor: 'var(--line)' }}>
            <p className="font-display text-[18px]">No staff appointed yet</p>
            <p className="mt-1 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
              Appoint a secretary, finance officer, or a custom set of permissions. HR only appears if you grant it.
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
                        <span className="text-[12px]" style={{ color: '#b91c1c' }}>
                          revoked
                        </span>
                      ) : null}
                    </p>
                    <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                      {p.email}
                    </p>
                    <p className="mt-1 text-[13px]">
                      {(p.desks || []).map((d) => DESK_LABELS[d]).join(' · ') || 'Custom permissions'}
                    </p>
                    <p className="text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                      {p.campusSlugs?.length ? p.campusSlugs.join(', ') : 'Entire institution'}
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
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
