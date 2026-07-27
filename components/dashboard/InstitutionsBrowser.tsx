'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Building2, Check, Loader2, Plus, ShieldCheck, Users, X } from 'lucide-react';
import type { InstitutionDoc } from '@/lib/learn/ecosystem';

const COLORS = ['#00b369', '#4a90e2', '#7c3aed', '#e0234e', '#f59e0b', '#0C1116'];

export default function InstitutionsBrowser({
  institutions,
  memberOf,
}: {
  institutions: InstitutionDoc[];
  memberOf: string[];
}) {
  const router = useRouter();
  const memberSet = new Set(memberOf);
  const [applying, setApplying] = useState(false);
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [about, setAbout] = useState('');
  const [website, setWebsite] = useState('');
  const [country, setCountry] = useState('');
  const [color, setColor] = useState('#00b369');
  const [visibility, setVisibility] = useState<'public' | 'private'>('private');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [joining, setJoining] = useState<string | null>(null);

  async function submitApplication(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/learn/institutions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, tagline, about, color, visibility, website, country }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          data.error === 'invalid_name'
            ? 'Please enter a valid institution name (at least 3 characters).'
            : 'Could not submit your application. Please try again.',
        );
        return;
      }
      setSuccess(
        data.message ||
          'Application submitted. An InTelleX Platform Administrator will review it.',
      );
      setName('');
      setTagline('');
      setAbout('');
      setWebsite('');
      setCountry('');
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
        <button onClick={() => { setApplying(true); setSuccess(''); setError(''); }} className="btn btn-primary !py-2.5 text-[13.5px]">
          <Plus size={15} /> Apply to open a campus
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
                    className="flex h-12 w-12 items-center justify-center rounded-2xl font-display text-[18px] font-semibold"
                    style={{ background: `${inst.color}18`, color: inst.color }}
                  >
                    {(inst.name || 'I').charAt(0).toUpperCase()}
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
                      Request to join
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {applying && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-4 sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !busy && setApplying(false)}
          >
            <motion.form
              onSubmit={submitApplication}
              className="max-h-[90vh] w-full max-w-[520px] overflow-y-auto rounded-3xl bg-paper p-6"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <h3 className="font-display text-[21px]">Apply to open a campus</h3>
                  <p className="mt-1 text-[13px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                    Institutions are reviewed and provisioned by InTelleX — like registering an organization, not creating a chat room.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setApplying(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  style={{ background: 'var(--paper-dim)' }}
                >
                  <X size={15} />
                </button>
              </div>

              {success ? (
                <div className="rounded-2xl border px-5 py-6 text-center" style={{ borderColor: 'var(--line)', background: 'rgba(0,179,105,0.06)' }}>
                  <ShieldCheck className="mx-auto mb-3" size={28} style={{ color: 'var(--green-deep)' }} />
                  <p className="text-[14.5px] font-semibold" style={{ color: 'var(--green-deep)' }}>Application received</p>
                  <p className="mt-2 text-[13.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>{success}</p>
                  <button type="button" onClick={() => setApplying(false)} className="btn btn-primary mt-5 !py-2.5 text-[13px]">
                    Done
                  </button>
                </div>
              ) : (
                <>
                  <label className="mb-1.5 block text-[13px] font-semibold">Institution name</label>
                  <input className="form-input mb-4" placeholder="e.g. Seven Advanced Academy" value={name} onChange={(e) => setName(e.target.value)} required minLength={3} />

                  <label className="mb-1.5 block text-[13px] font-semibold">Tagline</label>
                  <input className="form-input mb-4" placeholder="One sentence about your school" value={tagline} onChange={(e) => setTagline(e.target.value)} />

                  <label className="mb-1.5 block text-[13px] font-semibold">About</label>
                  <textarea className="form-input mb-4" rows={3} placeholder="What do you teach? Who is it for?" value={about} onChange={(e) => setAbout(e.target.value)} />

                  <div className="mb-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-[13px] font-semibold">Website</label>
                      <input className="form-input" placeholder="https://" value={website} onChange={(e) => setWebsite(e.target.value)} />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[13px] font-semibold">Country</label>
                      <input className="form-input" placeholder="Cameroon" value={country} onChange={(e) => setCountry(e.target.value)} />
                    </div>
                  </div>

                  <div className="mb-4">
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

                  <label className="mb-1.5 block text-[13px] font-semibold">Intended visibility</label>
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
                          {v === 'public'
                            ? 'May appear in directory after verification'
                            : 'Invite-only — never listed publicly'}
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
                    Submit application for review
                  </button>
                </>
              )}
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
