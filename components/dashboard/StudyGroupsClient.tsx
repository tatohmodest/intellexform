'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2, Users } from 'lucide-react';
import type { StudyGroupView } from '@/lib/learn/discussionTypes';

export default function StudyGroupsClient() {
  const [groups, setGroups] = useState<StudyGroupView[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/learn/discussions?view=groups');
      const data = await res.json();
      setGroups(data.groups || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function create() {
    if (!title.trim()) return;
    setBusy(true);
    try {
      await fetch('/api/learn/discussions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create_group', title, description }),
      });
      setTitle('');
      setDescription('');
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function join(groupId: string) {
    await fetch('/api/learn/discussions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'join_group', groupId }),
    });
    await load();
  }

  return (
    <div className="mx-auto max-w-[860px]">
      <header className="mb-8 border-b pb-6" style={{ borderColor: 'var(--line)' }}>
        <div className="tab mb-2 inline-flex items-center gap-1.5">
          <Users size={11} /> Study groups
        </div>
        <h1 className="font-display text-[30px] leading-tight">Study groups</h1>
        <p className="mt-2 text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
          Form small cohorts, then discuss lessons in the course player.
        </p>
      </header>

      <div className="mb-8 space-y-2 border p-4" style={{ borderColor: 'var(--line)' }}>
        <h2 className="font-display text-[18px]">Create a group</h2>
        <input
          className="form-input !rounded-none"
          placeholder="Group title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="form-input !rounded-none min-h-[70px]"
          placeholder="What will you study together?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          type="button"
          disabled={busy || !title.trim()}
          onClick={create}
          className="px-4 py-2 text-[13px] font-semibold text-white disabled:opacity-50"
          style={{ background: 'var(--green)' }}
        >
          {busy ? <Loader2 size={14} className="inline animate-spin" /> : null} Create
        </button>
      </div>

      {loading ? (
        <p className="text-[14px]" style={{ color: 'var(--ink-soft)' }}>
          Loading…
        </p>
      ) : groups.length === 0 ? (
        <p className="text-[14px]" style={{ color: 'var(--ink-soft)' }}>
          No study groups yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {groups.map((g) => (
            <li key={g.id} className="flex flex-wrap items-center justify-between gap-3 border p-4" style={{ borderColor: 'var(--line)' }}>
              <div>
                <p className="font-semibold">{g.title}</p>
                {g.description ? (
                  <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                    {g.description}
                  </p>
                ) : null}
                <p className="mt-1 font-mono text-[10px] uppercase tracking-wide" style={{ color: 'var(--ink-soft)' }}>
                  {g.memberCount} members
                </p>
              </div>
              {g.isMember ? (
                <span className="text-[12.5px] font-semibold" style={{ color: 'var(--green-deep)' }}>
                  Joined
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => join(g.id)}
                  className="border px-3 py-2 text-[13px] font-semibold"
                  style={{ borderColor: 'var(--ink)' }}
                >
                  Join
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
