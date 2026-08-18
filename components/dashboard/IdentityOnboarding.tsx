'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, Loader2 } from 'lucide-react';
import { INTERESTS, type InterestId } from '@/lib/learn/interests';

export default function IdentityOnboarding({
  firstName,
  institutionName,
  tagline,
  continueTo = '/dashboard',
}: {
  firstName: string;
  institutionName: string;
  tagline?: string;
  continueTo?: string;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<InterestId[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const title = useMemo(
    () => `Welcome to ${institutionName}, ${firstName}`,
    [firstName, institutionName],
  );

  function toggle(id: InterestId) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  async function finish() {
    if (!selected.length) {
      setError('Pick at least one interest so we can personalize your home.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/learn/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ primaryIntent: 'learn', interests: selected }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error === 'interests_required' ? 'Pick at least one interest.' : 'Could not save. Try again.');
        setBusy(false);
        return;
      }
      router.replace(continueTo);
      router.refresh();
    } catch {
      setError('Could not connect.');
      setBusy(false);
    }
  }

  return (
    <div className="relative mx-auto flex min-h-[70vh] max-w-[720px] flex-col justify-center px-1 py-8">
      <div
        className="pointer-events-none absolute inset-x-0 -top-10 h-56 rounded-[40px] opacity-80"
        style={{
          background:
            'radial-gradient(ellipse at 30% 20%, rgba(0,179,105,0.18), transparent 55%), radial-gradient(ellipse at 80% 0%, rgba(31,95,168,0.14), transparent 50%)',
        }}
      />

      <div className="relative">
        <p className="mono mb-2 text-[11px] uppercase tracking-[0.18em]" style={{ color: 'var(--ink-soft)' }}>
          {tagline || 'Learn. Connect. Grow.'}
        </p>
        <h1 className="font-display text-[32px] leading-tight sm:text-[36px]">{title}</h1>
        <p className="mt-2 max-w-lg text-[15px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
          We want to know a little about you. These are personalization preferences — not enrollment.
          You can become a student later.
        </p>

        <h2 className="mt-8 font-display text-[20px]">What are you interested in?</h2>
        <p className="mt-1 text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>
          Select as many as you like.
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 grid gap-2 sm:grid-cols-2"
          >
            {INTERESTS.map((item) => {
              const on = selected.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={busy}
                  onClick={() => toggle(item.id)}
                  className="flex items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 text-left"
                  style={{
                    borderColor: on ? 'var(--ink)' : 'var(--line)',
                    background: on ? 'var(--ink)' : 'transparent',
                    color: on ? '#fff' : 'var(--ink)',
                  }}
                >
                  <span className="font-semibold">{item.label}</span>
                  {on ? <Check size={16} /> : null}
                </button>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {error ? (
          <p className="mt-5 rounded-xl px-4 py-3 text-[13px]" style={{ background: 'rgba(196,98,42,0.08)', color: '#a14d18' }}>
            {error}
          </p>
        ) : null}

        <button
          type="button"
          disabled={busy}
          onClick={finish}
          className="btn btn-primary mt-8 w-full !py-3"
        >
          {busy ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
          Continue to {institutionName}
        </button>
      </div>
    </div>
  );
}
