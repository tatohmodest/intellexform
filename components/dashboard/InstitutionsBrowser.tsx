'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Building2, Check, Loader2, Plus, Users, X } from 'lucide-react';
import type { InstitutionDoc } from '@/lib/learn/ecosystem';

const COLORS = ['#00b369', '#4a90e2', '#7c3aed', '#e0234e', '#f59e0b', '#0C1116'];
const EMOJIS = ['🎓', '🏫', '🏛️', '🚀', '💼', '🧠', '🌍', '⚡'];

export default function InstitutionsBrowser({
  institutions,
  memberOf,
}: {
  institutions: InstitutionDoc[];
  memberOf: string[];
}) {
  const router = useRouter();
  const memberSet = new Set(memberOf);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [about, setAbout] = useState('');
  const [color, setColor] = useState('#00b369');
  const [emoji, setEmoji] = useState('🎓');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [joining, setJoining] = useState<string | null>(null);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/learn/institutions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, tagline, about, color, emoji, visibility }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          data.error === 'slug_taken'
            ? 'An institution with that name already exists.'
            : 'Could not create the institution. Please try again.',
        );
        return;
      }
      router.push(`/dashboard/institutions/${data.slug}`);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function join(slug: string) {
    setJoining(slug);
    try {
      const res = await fetch(`/api/learn/institutions/${slug}/join`, { method: 'POST' });
      if (res.ok) router.refresh();
    } finally {
      setJoining(null);
    }
  }

  return (
    <>
      <div className="mb-6 flex justify-end">
        <button onClick={() => setCreating(true)} className="btn btn-primary !py-2.5 text-[13.5px]">
          <Plus size={15} /> Open your campus
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {institutions.map((inst) => {
          const isMember = memberSet.has(inst.slug);
          return (
            <div
              key={inst.slug}
              className="overflow-hidden rounded-2xl border transition-shadow hover:shadow-card"
              style={{ borderColor: 'var(--line)' }}
            >
              <div className="h-2" style={{ background: inst.color }} />
              <div className="p-5">
                <div className="mb-3 flex items-center gap-3.5">
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-2xl text-[22px]"
                    style={{ background: `${inst.color}18` }}
                  >
                    {inst.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <Link href={`/dashboard/institutions/${inst.slug}`}>
                      <div className="truncate text-[15.5px] font-semibold">{inst.name}</div>
                    </Link>
                    <div className="flex items-center gap-1.5 text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                      <Users size={11} /> {inst.memberCount.toLocaleString()} member{inst.memberCount === 1 ? '' : 's'}
                    </div>
                  </div>
                </div>
                <p className="mb-4 line-clamp-2 text-[13.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                  {inst.tagline || inst.about}
                </p>
                <div className="flex items-center gap-2.5">
                  <Link
                    href={`/dashboard/institutions/${inst.slug}`}
                    className="btn btn-ghost !px-4 !py-2 text-[12.5px]"
                  >
                    Visit campus
                  </Link>
                  {isMember ? (
                    <span className="flex items-center gap-1.5 text-[12.5px] font-semibold" style={{ color: 'var(--green-deep)' }}>
                      <Check size={13} /> Member
                    </span>
                  ) : (
                    <button
                      onClick={() => join(inst.slug)}
                      disabled={joining === inst.slug}
                      className="btn btn-primary !px-4 !py-2 text-[12.5px]"
                    >
                      {joining === inst.slug ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
                      Join
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create modal */}
      <AnimatePresence>
        {creating && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-4 sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !busy && setCreating(false)}
          >
            <motion.form
              onSubmit={create}
              className="max-h-[90vh] w-full max-w-[480px] overflow-y-auto rounded-3xl bg-paper p-6"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <h3 className="font-display text-[21px]">Open your campus</h3>
                  <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                    A school, academy, company or study group — live in minutes.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCreating(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  style={{ background: 'var(--paper-dim)' }}
                >
                  <X size={15} />
                </button>
              </div>

              <label className="mb-1.5 block text-[13px] font-semibold">Institution name</label>
              <input className="form-input mb-4" placeholder="e.g. Seven Advanced Academy" value={name} onChange={(e) => setName(e.target.value)} required minLength={3} />

              <label className="mb-1.5 block text-[13px] font-semibold">Tagline</label>
              <input className="form-input mb-4" placeholder="One sentence about your school" value={tagline} onChange={(e) => setTagline(e.target.value)} />

              <label className="mb-1.5 block text-[13px] font-semibold">About</label>
              <textarea className="form-input mb-4" rows={3} placeholder="What do you teach? Who is it for?" value={about} onChange={(e) => setAbout(e.target.value)} />

              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold">Brand color</label>
                  <div className="flex flex-wrap gap-1.5">
                    {COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        className="h-7 w-7 rounded-full border-2"
                        style={{ background: c, borderColor: color === c ? 'var(--ink)' : 'transparent' }}
                        aria-label={`Color ${c}`}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold">Crest</label>
                  <div className="flex flex-wrap gap-1">
                    {EMOJIS.map((e) => (
                      <button
                        key={e}
                        type="button"
                        onClick={() => setEmoji(e)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[17px]"
                        style={{ background: emoji === e ? 'var(--paper-dim)' : 'transparent' }}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <label className="mb-1.5 block text-[13px] font-semibold">Visibility</label>
              <div className="mb-5 grid grid-cols-2 gap-2">
                {(['public', 'private'] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setVisibility(v)}
                    className="rounded-xl border px-4 py-3 text-left"
                    style={
                      visibility === v
                        ? { borderColor: 'var(--green)', background: 'rgba(0,179,105,0.07)' }
                        : { borderColor: 'var(--line)' }
                    }
                  >
                    <div className="text-[13.5px] font-semibold capitalize">{v}</div>
                    <div className="text-[11.5px]" style={{ color: 'var(--ink-soft)' }}>
                      {v === 'public' ? 'Discoverable, anyone can join' : 'Invite-only, hidden from directory'}
                    </div>
                  </button>
                ))}
              </div>

              {error && (
                <p className="mb-4 rounded-xl px-4 py-3 text-[13px]" style={{ background: 'rgba(196,98,42,0.08)', color: '#a14d18' }}>
                  {error}
                </p>
              )}

              <button type="submit" disabled={busy} className="btn btn-primary w-full !py-3.5 text-[14px]">
                {busy ? <Loader2 size={16} className="animate-spin" /> : <Building2 size={16} />}
                Create institution
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
