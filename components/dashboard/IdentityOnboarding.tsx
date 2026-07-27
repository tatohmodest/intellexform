'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Building2,
  CheckCircle2,
  Compass,
  GraduationCap,
  Loader2,
  Search,
  Sparkles,
  Users,
} from 'lucide-react';

type Intent = 'learn' | 'teach' | 'institution';
type JoinPath = 'exploring' | 'institution' | 'both';

type InstitutionHit = {
  slug: string;
  name: string;
  tagline: string;
  color: string;
  authMethod?: string;
  country?: string | null;
  memberCount: number;
};

const INTENTS: {
  id: Intent;
  title: string;
  body: string;
  icon: typeof BookOpen;
}[] = [
  {
    id: 'learn',
    title: 'Learn',
    body: 'Courses, mentors, AI tutor, and certificates — your personal InTelleX passport.',
    icon: BookOpen,
  },
  {
    id: 'teach',
    title: 'Teach',
    body: 'Guide learners as a mentor or instructor. Privileges are earned after review.',
    icon: Users,
  },
  {
    id: 'institution',
    title: 'Represent an institution',
    body: 'Apply to bring your school or academy onto the InTelleX network.',
    icon: Building2,
  },
];

const JOIN_PATHS: {
  id: JoinPath;
  title: string;
  body: string;
  icon: typeof Compass;
}[] = [
  {
    id: 'exploring',
    title: "I'm exploring InTelleX",
    body: 'Browse courses, mentorship, and the AI tutor — no campus required.',
    icon: Compass,
  },
  {
    id: 'institution',
    title: "I'm joining my institution",
    body: 'Search your campus, verify with matricule, then open that workspace.',
    icon: GraduationCap,
  },
  {
    id: 'both',
    title: 'Both',
    body: 'Use InTelleX personally and affiliate with a campus when you are ready.',
    icon: Sparkles,
  },
];

export default function IdentityOnboarding({ firstName }: { firstName: string }) {
  const router = useRouter();
  const [step, setStep] = useState<'intent' | 'path' | 'search' | 'verify'>('intent');
  const [intent, setIntent] = useState<Intent | null>(null);
  const [joinPath, setJoinPath] = useState<JoinPath | null>(null);
  const [query, setQuery] = useState('');
  const [hits, setHits] = useState<InstitutionHit[]>([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState<InstitutionHit | null>(null);
  const [matricule, setMatricule] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (step !== 'search') return;
    const t = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `/api/learn/institutions?q=${encodeURIComponent(query)}`,
        );
        if (res.ok) {
          const data = await res.json();
          setHits(data.institutions ?? []);
        }
      } finally {
        setSearching(false);
      }
    }, 220);
    return () => clearTimeout(t);
  }, [query, step]);

  const title = useMemo(() => {
    if (step === 'intent') return `Welcome to InTelleX, ${firstName}`;
    if (step === 'path') return 'How are you joining today?';
    if (step === 'search') return 'Search your institution';
    return `Verify with ${selected?.name ?? 'your campus'}`;
  }, [step, firstName, selected]);

  async function finishOnboarding(opts: {
    primaryIntent: Intent;
    joinPath?: JoinPath | null;
    next?: string;
    continueToSearch?: boolean;
  }) {
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/learn/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          primaryIntent: opts.primaryIntent,
          joinPath: opts.joinPath ?? null,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? 'Could not save your profile');
        return;
      }
      if (opts.continueToSearch) {
        setStep('search');
        return;
      }
      router.replace(opts.next ?? '/dashboard');
      router.refresh();
    } catch {
      setError('Could not connect. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  async function chooseIntent(id: Intent) {
    setIntent(id);
    setError('');
    if (id === 'learn') {
      setStep('path');
      return;
    }
    if (id === 'teach') {
      await finishOnboarding({
        primaryIntent: 'teach',
        next: '/dashboard/mentor',
      });
      return;
    }
    await finishOnboarding({
      primaryIntent: 'institution',
      next: '/dashboard/institutions',
    });
  }

  async function choosePath(id: JoinPath) {
    setJoinPath(id);
    if (id === 'exploring') {
      await finishOnboarding({ primaryIntent: 'learn', joinPath: id, next: '/dashboard' });
      return;
    }
    await finishOnboarding({
      primaryIntent: 'learn',
      joinPath: id,
      continueToSearch: true,
    });
  }

  async function affiliate() {
    if (!selected) return;
    setBusy(true);
    setError('');
    try {
      const res = await fetch(`/api/learn/institutions/${selected.slug}/affiliate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matricule, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          data.error === 'password_required'
            ? 'Enter your campus password / PIN.'
            : data.error === 'invalid_matricule'
              ? 'Check your matricule and try again.'
              : 'Campus could not verify those credentials.',
        );
        return;
      }
      router.replace(data.redirectTo || `/dashboard/institutions/${selected.slug}`);
      router.refresh();
    } catch {
      setError('Could not connect. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  function pickInstitution(inst: InstitutionHit) {
    setSelected(inst);
    if ((inst.authMethod ?? 'open') === 'open') {
      setBusy(true);
      fetch(`/api/learn/institutions/${inst.slug}/affiliate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
        .then(async (res) => {
          const data = await res.json().catch(() => ({}));
          if (!res.ok) {
            setError('Could not join this campus.');
            return;
          }
          router.replace(data.redirectTo || `/dashboard/institutions/${inst.slug}`);
          router.refresh();
        })
        .catch(() => setError('Could not connect.'))
        .finally(() => setBusy(false));
      return;
    }
    setStep('verify');
  }

  return (
    <div className="relative mx-auto flex min-h-[70vh] max-w-[640px] flex-col justify-center px-1 py-8">
      <div
        className="pointer-events-none absolute inset-x-0 -top-10 h-56 rounded-[40px] opacity-80"
        style={{
          background:
            'radial-gradient(ellipse at 30% 20%, rgba(0,179,105,0.18), transparent 55%), radial-gradient(ellipse at 80% 0%, rgba(31,95,168,0.14), transparent 50%)',
        }}
      />

      <div className="relative">
        <p className="mono mb-2 text-[11px] uppercase tracking-[0.18em]" style={{ color: 'var(--ink-soft)' }}>
          One identity · many contexts
        </p>
        <h1 className="font-display text-[32px] leading-tight sm:text-[36px]">{title}</h1>
        <p className="mt-2 max-w-lg text-[15px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
          {step === 'intent' &&
            'You are creating an InTelleX identity — not a university account. Campuses become affiliations on this passport.'}
          {step === 'path' &&
            'This personalizes your home. You can affiliate with a campus anytime without creating another login.'}
          {step === 'search' &&
            'Find your campus on the network. Academic records stay with them — InTelleX only stores the affiliation.'}
          {step === 'verify' &&
            'Credentials are checked with your institution. InTelleX never keeps your campus password.'}
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            className="mt-8 space-y-3"
          >
            {step === 'intent' &&
              INTENTS.map((item) => (
                <ChoiceCard
                  key={item.id}
                  title={item.title}
                  body={item.body}
                  icon={item.icon}
                  disabled={busy}
                  onClick={() => chooseIntent(item.id)}
                />
              ))}

            {step === 'path' &&
              JOIN_PATHS.map((item) => (
                <ChoiceCard
                  key={item.id}
                  title={item.title}
                  body={item.body}
                  icon={item.icon}
                  disabled={busy}
                  onClick={() => choosePath(item.id)}
                />
              ))}

            {step === 'search' && (
              <div className="space-y-4">
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--ink-soft)' }}
                  />
                  <input
                    className="form-input pl-11"
                    placeholder="University of Buea, Saint Monica…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="max-h-[340px] space-y-2 overflow-y-auto pr-1">
                  {searching && (
                    <p className="flex items-center gap-2 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                      <Loader2 size={14} className="animate-spin" /> Searching…
                    </p>
                  )}
                  {!searching && hits.length === 0 && (
                    <p className="rounded-2xl border border-dashed px-4 py-6 text-[13.5px]" style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}>
                      No campuses matched. Try another name, or{' '}
                      <button
                        type="button"
                        className="font-semibold underline"
                        style={{ color: 'var(--green-deep)' }}
                        onClick={() => router.replace('/dashboard')}
                      >
                        continue exploring InTelleX
                      </button>
                      .
                    </p>
                  )}
                  {hits.map((inst) => (
                    <button
                      key={inst.slug}
                      type="button"
                      disabled={busy}
                      onClick={() => pickInstitution(inst)}
                      className="flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition-colors hover:border-[var(--green-deep)]"
                      style={{ borderColor: 'var(--line)' }}
                    >
                      <span
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[13px] font-bold text-white"
                        style={{ background: inst.color || '#00b369' }}
                      >
                        {inst.name.slice(0, 1)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-semibold">{inst.name}</span>
                        <span className="block truncate text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
                          {inst.tagline}
                          {inst.country ? ` · ${inst.country}` : ''}
                          {inst.authMethod === 'matricule' ? ' · Matricule login' : ''}
                        </span>
                      </span>
                      <ArrowRight size={16} style={{ color: 'var(--ink-soft)' }} />
                    </button>
                  ))}
                </div>
                {joinPath === 'both' && (
                  <button
                    type="button"
                    className="btn btn-ghost w-full !py-2.5 text-[13.5px]"
                    onClick={() => router.replace('/dashboard')}
                  >
                    Skip for now — go to my InTelleX home
                  </button>
                )}
              </div>
            )}

            {step === 'verify' && selected && (
              <div className="space-y-4 rounded-3xl border p-5 sm:p-6" style={{ borderColor: 'var(--line)' }}>
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-xl text-white font-bold"
                    style={{ background: selected.color }}
                  >
                    {selected.name.slice(0, 1)}
                  </span>
                  <div>
                    <div className="font-semibold">{selected.name}</div>
                    <div className="text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
                      Student verification · {selected.authMethod || 'campus auth'}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold">Matricule / student ID</label>
                  <input
                    className="form-input"
                    value={matricule}
                    onChange={(e) => setMatricule(e.target.value)}
                    placeholder="e.g. SMU/2024/0142"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold">Campus password</label>
                  <input
                    type="password"
                    className="form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Checked by your institution — not stored here"
                  />
                </div>
                <button
                  type="button"
                  disabled={busy || !matricule || !password}
                  onClick={affiliate}
                  className="btn btn-primary w-full !py-3"
                >
                  {busy ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                  Enter campus workspace
                </button>
                <button
                  type="button"
                  className="btn btn-ghost w-full !py-2.5 text-[13px]"
                  onClick={() => {
                    setStep('search');
                    setSelected(null);
                    setPassword('');
                  }}
                >
                  Choose a different institution
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {error && (
          <p className="mt-5 rounded-xl px-4 py-3 text-[13px]" style={{ background: 'rgba(196,98,42,0.08)', color: '#a14d18' }}>
            {error}
          </p>
        )}

        {busy && step !== 'verify' && step !== 'search' && (
          <p className="mt-4 flex items-center gap-2 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
            <Loader2 size={14} className="animate-spin" /> Setting up your identity…
          </p>
        )}
      </div>
    </div>
  );
}

function ChoiceCard({
  title,
  body,
  icon: Icon,
  onClick,
  disabled,
}: {
  title: string;
  body: string;
  icon: typeof BookOpen;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="group flex w-full items-start gap-4 rounded-3xl border px-5 py-4 text-left transition-all hover:-translate-y-0.5 hover:border-[var(--green-deep)] disabled:opacity-60"
      style={{ borderColor: 'var(--line)', background: 'var(--paper)' }}
    >
      <span
        className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
        style={{ background: 'rgba(0,179,105,0.12)', color: 'var(--green-deep)' }}
      >
        <Icon size={20} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-[18px] leading-tight">{title}</span>
        <span className="mt-1 block text-[13.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
          {body}
        </span>
      </span>
      <ArrowRight
        size={18}
        className="mt-2 shrink-0 opacity-40 transition-opacity group-hover:opacity-100"
        style={{ color: 'var(--green-deep)' }}
      />
    </button>
  );
}
