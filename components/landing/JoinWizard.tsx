'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Check, Loader2, MessageCircle, Sparkles, PartyPopper,
} from 'lucide-react';

const FIELDS = [
  'Full-Stack Web Development',
  'MERN Stack',
  'PERN Stack',
  'Web Dev Fundamentals',
  'Python',
  'JavaScript',
  'Java',
  'Data Analysis / Data Science',
  'Machine Learning',
  'Cybersecurity',
  'Digital Marketing',
  'Branding',
  'Not sure yet — help me choose',
  'Special Program — Full-Stack in 3 Weeks (AI-assisted)',
];

const PLANS = [
  'Monthly — 1,999 XAF',
  'Yearly — 22,560 XAF',
  'Single course — from 4,999 XAF',
  'Special Program — Full-Stack in 3 Weeks (150,000 XAF)',
  'Live tutoring — online',
  'Live tutoring — onsite',
  'AI Tutor — pay as you go',
  'AI Tutor — pay once',
];

const TOTAL = 5;

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 44 }).map((_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 520,
        y: -(120 + Math.random() * 360),
        rot: Math.random() * 720 - 360,
        delay: Math.random() * 0.25,
        color: ['#00b369', '#4a90e2', '#E3A23A', '#0C1116'][i % 4],
        size: 6 + Math.random() * 8,
      })),
    [],
  );
  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-start justify-center overflow-hidden">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute top-1/2 rounded-[2px]"
          style={{ width: p.size, height: p.size * 1.4, background: p.color }}
          initial={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
          animate={{ opacity: [1, 1, 0], x: p.x, y: [0, p.y, p.y + 260], rotate: p.rot }}
          transition={{ duration: 1.6 + Math.random(), delay: p.delay, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}

export default function JoinWizard() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [fullName, setFullName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [field, setField] = useState('');
  const [plan, setPlan] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState<{ whatsappUrl: string } | null>(null);

  const go = (to: number, d: number) => {
    setDir(d);
    setError('');
    setStep(to);
  };
  const next = () => go(Math.min(step + 1, TOTAL - 1), 1);
  const back = () => go(Math.max(step - 1, 0), -1);

  const canContinue =
    (step === 0 && fullName.trim().length >= 2) ||
    (step === 1 && whatsapp.trim().length >= 6) ||
    step === 2 ||
    step === 3 ||
    step === 4;

  function pick(kind: 'field' | 'plan', value: string) {
    if (kind === 'field') setField(value);
    else setPlan(value);
    setTimeout(() => go(step + 1, 1), 260);
  }

  async function submit() {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, whatsapp, field, plan, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setDone({ whatsappUrl: data.whatsappUrl });
      window.open(data.whatsappUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  const progress = done ? 100 : Math.round(((step + (canContinue ? 1 : 0)) / TOTAL) * 100);

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d * 40 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d * -40 }),
  };

  const labelCls = 'font-mono text-[11px] uppercase tracking-[0.14em]';

  return (
    <div
      className="relative flex min-h-[460px] flex-col overflow-hidden rounded-[22px] border p-6 shadow-card sm:p-8"
      style={{ background: 'var(--paper)', borderColor: 'var(--line)' }}
    >
      {/* progress */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <span className={labelCls} style={{ color: 'var(--green-deep)' }}>
            {done ? 'Done!' : `Step ${step + 1} of ${TOTAL}`}
          </span>
          <span className={labelCls} style={{ color: 'var(--ink-soft)' }}>{progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full" style={{ background: 'var(--paper-dim)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, var(--green), var(--blue))' }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          />
        </div>
      </div>

      {done ? (
        <div className="relative flex flex-1 flex-col items-center justify-center text-center">
          <Confetti />
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 16 }}
            className="mb-4 flex h-16 w-16 items-center justify-center rounded-full"
            style={{ background: 'rgba(0,179,105,0.15)' }}
          >
            <PartyPopper size={30} style={{ color: 'var(--green-deep)' }} />
          </motion.div>
          <h3 className="mb-2 font-display text-[26px]">You&apos;re in, {fullName.split(' ')[0]}! 🎉</h3>
          <p className="mb-6 max-w-sm text-sm" style={{ color: 'var(--ink-soft)' }}>
            We&apos;ve saved your spot and opened WhatsApp with your choices. Tap below if it didn&apos;t open.
          </p>
          <a href={done.whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            <MessageCircle size={18} /> Continue on WhatsApp
          </a>
        </div>
      ) : (
        <>
          <div className="relative flex-1">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={step}
                custom={dir}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="flex h-full flex-col"
              >
                {step === 0 && (
                  <StepShell emoji="👋" kicker="Let's begin" title="First, what should we call you?">
                    <input
                      autoFocus
                      className="form-input text-lg"
                      placeholder="Your name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && canContinue && next()}
                    />
                  </StepShell>
                )}

                {step === 1 && (
                  <StepShell emoji="📱" kicker={`Nice to meet you, ${fullName.split(' ')[0] || 'friend'}`} title="What's your WhatsApp number?">
                    <input
                      autoFocus
                      type="tel"
                      className="form-input text-lg"
                      placeholder="6XX XXX XXX"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && canContinue && next()}
                    />
                    <p className="mt-2 text-xs" style={{ color: 'var(--ink-soft)' }}>We&apos;ll send payment details & your onboarding here.</p>
                  </StepShell>
                )}

                {step === 2 && (
                  <StepShell emoji="🎯" kicker="Pick your path" title="What do you want to learn?">
                    <div className="grid max-h-[230px] gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
                      {FIELDS.map((f) => (
                        <OptionCard key={f} label={f} selected={field === f} onClick={() => pick('field', f)} />
                      ))}
                    </div>
                  </StepShell>
                )}

                {step === 3 && (
                  <StepShell emoji="💳" kicker="Almost there" title="How do you want to learn it?">
                    <div className="grid max-h-[230px] gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
                      {PLANS.map((p) => (
                        <OptionCard key={p} label={p} selected={plan === p} onClick={() => pick('plan', p)} />
                      ))}
                    </div>
                  </StepShell>
                )}

                {step === 4 && (
                  <StepShell emoji="🚀" kicker="Last one" title="Anything you'd like us to know?">
                    <textarea
                      autoFocus
                      className="form-input"
                      rows={4}
                      placeholder="Your goal, your level, questions… (optional)"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    <div className="mt-3 rounded-xl p-3 text-[13px]" style={{ background: 'var(--paper-dim)', color: 'var(--ink-soft)' }}>
                      <span className="font-semibold" style={{ color: 'var(--ink)' }}>{field || '—'}</span> · {plan || '—'}
                    </div>
                  </StepShell>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {error && (
            <p className="mt-3 rounded-lg px-3 py-2 text-sm" style={{ background: 'rgba(220,38,38,0.08)', color: '#b91c1c' }}>{error}</p>
          )}

          {/* nav */}
          <div className="mt-5 flex items-center justify-between gap-3">
            <button
              onClick={back}
              disabled={step === 0}
              className="flex items-center gap-1.5 text-sm font-semibold disabled:opacity-30"
              style={{ color: 'var(--ink-soft)' }}
            >
              <ArrowLeft size={16} /> Back
            </button>

            {step < 4 ? (
              <button onClick={next} disabled={!canContinue} className="btn btn-primary disabled:opacity-40">
                Continue <ArrowRight size={18} />
              </button>
            ) : (
              <button onClick={submit} disabled={loading} className="btn btn-primary">
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                {loading ? 'Sending…' : 'Finish & get started'}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function StepShell({ emoji, kicker, title, children }: { emoji: string; kicker: string; title: string; children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-1 text-[26px]">{emoji}</div>
      <div className="mb-1 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: 'var(--green-deep)' }}>
        <Sparkles size={12} /> {kicker}
      </div>
      <h3 className="mb-4 font-display text-[22px] leading-snug sm:text-[24px]">{title}</h3>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function OptionCard({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between gap-2 rounded-xl border px-3.5 py-3 text-left text-[13.5px] transition-all hover:-translate-y-0.5"
      style={{
        borderColor: selected ? 'var(--green)' : 'var(--line)',
        background: selected ? 'rgba(0,179,105,0.08)' : 'var(--paper)',
        boxShadow: selected ? 'inset 0 0 0 1px var(--green)' : 'none',
      }}
    >
      <span>{label}</span>
      <span
        className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border"
        style={{ borderColor: selected ? 'var(--green)' : 'var(--line)', background: selected ? 'var(--green)' : 'transparent' }}
      >
        {selected && <Check size={13} style={{ color: '#fff' }} />}
      </span>
    </button>
  );
}
