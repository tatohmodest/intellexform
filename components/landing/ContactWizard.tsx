'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  GraduationCap,
  Loader2,
  MessageCircle,
  MessageSquare,
  PartyPopper,
  Phone,
  Target,
  User,
  Users,
} from 'lucide-react';
import type { ContactType } from '@/lib/types';

const LEARNER_TOPICS = [
  'Orientation — help me choose a path',
  'Full-Stack Web Development',
  'Data / AI',
  'Cybersecurity',
  'Digital Marketing',
  'Live mentorship',
  'Subscription plans',
  'Not sure yet - help me choose',
];

const INSTITUTION_INTERESTS = [
  'How the platform works',
  'How integration / onboarding works',
  'Partner our university / school',
  'Digital Learning (video courses)',
  'Live Teaching',
  'AI Learning for our campus',
  'Digital Library',
  'Career / Community modules',
  'Custom enterprise capabilities',
  'Demo / discovery call',
];

const MENTORSHIP_MODES = ['Live tutoring - online', 'Live tutoring - onsite', 'Not sure yet'];

type Intent = ContactType;

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 36 }).map((_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 480,
        y: -(100 + Math.random() * 320),
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
          animate={{ opacity: [1, 1, 0], x: p.x, y: [0, p.y, p.y + 240], rotate: p.rot }}
          transition={{ duration: 1.5 + Math.random(), delay: p.delay, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}

function normalizeType(raw: string | null): Intent | null {
  if (!raw) return null;
  if (raw === 'institution' || raw === 'campus' || raw === 'partner') return 'institution';
  if (raw === 'mentorship' || raw === 'mentor' || raw === 'quote') return 'mentorship';
  if (raw === 'learner' || raw === 'student') return 'learner';
  if (raw === 'other') return 'other';
  return null;
}

export default function ContactWizard() {
  const params = useSearchParams();
  const preset = normalizeType(params.get('type'));

  const [step, setStep] = useState(preset ? 1 : 0);
  const [dir, setDir] = useState(1);
  const [contactType, setContactType] = useState<Intent>(preset || 'learner');
  const [fullName, setFullName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [field, setField] = useState('');
  const [plan, setPlan] = useState('');
  const [message, setMessage] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [country, setCountry] = useState('');
  const [estimatedStudents, setEstimatedStudents] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState<{ whatsappUrl: string } | null>(null);

  const isInstitution = contactType === 'institution';
  const isMentorship = contactType === 'mentorship';
  const total = isInstitution ? 6 : 5;

  const go = (to: number, d: number) => {
    setDir(d);
    setError('');
    setStep(to);
  };
  const next = () => go(Math.min(step + 1, total - 1), 1);
  const back = () => go(Math.max(step - 1, 0), -1);

  function pickIntent(type: Intent) {
    setContactType(type);
    setField('');
    setPlan('');
    setTimeout(() => go(1, 1), 200);
  }

  const canContinue = (() => {
    if (step === 0) return false;
    if (step === 1) return fullName.trim().length >= 2;
    if (step === 2) return whatsapp.trim().length >= 6;
    if (isInstitution) {
      if (step === 3) return institutionName.trim().length >= 2;
      if (step === 4) return field.length > 0;
      return true;
    }
    if (step === 3) return field.length > 0 || isMentorship;
    return true;
  })();

  async function submit() {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactType,
          fullName,
          whatsapp,
          email,
          field: field || (isMentorship ? plan || 'Live mentorship' : 'General'),
          plan: isMentorship ? plan || field : plan || (isInstitution ? 'Campus partnership' : '-'),
          message,
          institutionName,
          roleTitle,
          country,
          estimatedStudents,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setDone({ whatsappUrl: data.whatsappUrl });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  const progress = done ? 100 : Math.round(((step + (canContinue || step === 0 ? 0.4 : 0)) / total) * 100);
  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d * 40 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d * -40 }),
  };
  const labelCls = 'font-mono text-[11px] uppercase tracking-[0.14em]';

  return (
    <div
      className="relative flex min-h-[480px] flex-col overflow-hidden rounded-[22px] border p-6 shadow-card sm:p-8"
      style={{ background: 'var(--paper)', borderColor: 'var(--line)' }}
    >
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <span className={labelCls} style={{ color: 'var(--green-deep)' }}>
            {done ? 'Sent' : `Step ${Math.min(step + 1, total)} of ${total}`}
          </span>
          <span className={labelCls} style={{ color: 'var(--ink-soft)' }}>
            {Math.min(100, Math.round(progress))}%
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full" style={{ background: 'var(--paper-dim)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, var(--green), var(--blue))' }}
            animate={{ width: `${Math.min(100, progress)}%` }}
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
          <h3 className="mb-2 font-display text-[24px]">Thanks, {fullName.split(' ')[0]}!</h3>
          <p className="mb-5 max-w-sm text-sm" style={{ color: 'var(--ink-soft)' }}>
            {isInstitution
              ? 'Your institution inquiry is saved. Continue on WhatsApp with the Platform Team - or we will follow up by email.'
              : 'Your message is saved. Continue on WhatsApp if you want a faster reply.'}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href={done.whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              <MessageCircle size={18} /> Continue on WhatsApp
            </a>
            {!isInstitution && (
              <Link href="/signup" className="btn btn-ghost">
                Create InTelleX account
              </Link>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="relative flex-1">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={`${contactType}-${step}`}
                custom={dir}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="flex h-full flex-col"
              >
                {step === 0 && (
                  <StepShell icon={Users} kicker="Contact InTelleX" title="Who should we help?">
                    <div className="grid gap-2.5 sm:grid-cols-2">
                      <OptionCard
                        label="I'm a learner"
                        hint="Courses, plans, AI tutor"
                        selected={contactType === 'learner'}
                        onClick={() => pickIntent('learner')}
                      />
                      <OptionCard
                        label="I represent an institution"
                        hint="Campus partnership & capabilities"
                        selected={contactType === 'institution'}
                        onClick={() => pickIntent('institution')}
                      />
                      <OptionCard
                        label="Live mentorship quote"
                        hint="Online or onsite tutoring"
                        selected={contactType === 'mentorship'}
                        onClick={() => pickIntent('mentorship')}
                      />
                      <OptionCard
                        label="Something else"
                        hint="General questions"
                        selected={contactType === 'other'}
                        onClick={() => pickIntent('other')}
                      />
                    </div>
                    <p className="mt-4 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                      Ready to learn now?{' '}
                      <Link href="/signup" className="font-semibold" style={{ color: 'var(--green-deep)' }}>
                        Create an account
                      </Link>
                    </p>
                  </StepShell>
                )}

                {step === 1 && (
                  <StepShell icon={User} kicker="About you" title="What should we call you?">
                    <input
                      autoFocus
                      className="form-input text-lg"
                      placeholder="Your name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && canContinue && next()}
                    />
                    {isInstitution && (
                      <input
                        className="form-input mt-3"
                        placeholder="Your role (Dean, IT lead, founder…)"
                        value={roleTitle}
                        onChange={(e) => setRoleTitle(e.target.value)}
                      />
                    )}
                  </StepShell>
                )}

                {step === 2 && (
                  <StepShell icon={Phone} kicker="Reach you" title="WhatsApp number">
                    <input
                      autoFocus
                      type="tel"
                      className="form-input text-lg"
                      placeholder="6XX XXX XXX"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && canContinue && next()}
                    />
                    <input
                      type="email"
                      className="form-input mt-3"
                      placeholder={isInstitution ? 'Work email (recommended)' : 'Email (optional)'}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </StepShell>
                )}

                {isInstitution && step === 3 && (
                  <StepShell icon={Building2} kicker="Your campus" title="Institution details">
                    <input
                      autoFocus
                      className="form-input text-lg"
                      placeholder="Institution name"
                      value={institutionName}
                      onChange={(e) => setInstitutionName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && canContinue && next()}
                    />
                    <input
                      className="form-input mt-3"
                      placeholder="Country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    />
                    <input
                      className="form-input mt-3"
                      placeholder="Approx. students (optional)"
                      value={estimatedStudents}
                      onChange={(e) => setEstimatedStudents(e.target.value)}
                    />
                  </StepShell>
                )}

                {((!isInstitution && step === 3) || (isInstitution && step === 4)) && (
                  <StepShell
                    icon={isMentorship ? GraduationCap : Target}
                    kicker="Interest"
                    title={
                      isInstitution
                        ? 'What do you want to explore?'
                        : isMentorship
                          ? 'How do you want to learn?'
                          : 'What brings you here?'
                    }
                  >
                    <div className="grid max-h-[240px] gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
                      {(isInstitution
                        ? INSTITUTION_INTERESTS
                        : isMentorship
                          ? MENTORSHIP_MODES
                          : LEARNER_TOPICS
                      ).map((f) => (
                        <OptionCard
                          key={f}
                          label={f}
                          selected={field === f || plan === f}
                          onClick={() => {
                            if (isMentorship) {
                              setPlan(f);
                              setField(f);
                            } else {
                              setField(f);
                            }
                            setTimeout(() => go(step + 1, 1), 220);
                          }}
                        />
                      ))}
                    </div>
                  </StepShell>
                )}

                {((!isInstitution && step === 4) || (isInstitution && step === 5)) && (
                  <StepShell icon={MessageSquare} kicker="Almost done" title="Anything else we should know?">
                    <textarea
                      autoFocus
                      className="form-input"
                      rows={4}
                      placeholder={
                        isInstitution
                          ? 'Systems you use, timeline, capabilities you need…'
                          : 'Goals, questions, preferred schedule… (optional)'
                      }
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    <div
                      className="mt-3 rounded-xl p-3 text-[13px]"
                      style={{ background: 'var(--paper-dim)', color: 'var(--ink-soft)' }}
                    >
                      <span className="font-semibold" style={{ color: 'var(--ink)' }}>
                        {isInstitution ? institutionName || 'Institution' : contactType}
                      </span>
                      {' · '}
                      {field || plan || '-'}
                    </div>
                  </StepShell>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {error && (
            <p
              className="mt-3 rounded-lg px-3 py-2 text-sm"
              style={{ background: 'rgba(220,38,38,0.08)', color: '#b91c1c' }}
            >
              {error}
            </p>
          )}

          {step > 0 && (
            <div className="mt-5 flex items-center justify-between gap-3">
              <button
                onClick={() => (step === 1 && !preset ? go(0, -1) : back())}
                className="flex items-center gap-1.5 text-sm font-semibold"
                style={{ color: 'var(--ink-soft)' }}
              >
                <ArrowLeft size={16} /> Back
              </button>

              {step < total - 1 ? (
                <button onClick={next} disabled={!canContinue} className="btn btn-primary disabled:opacity-40">
                  Continue <ArrowRight size={18} />
                </button>
              ) : (
                <button onClick={submit} disabled={loading || !canContinue} className="btn btn-primary">
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                  {loading ? 'Sending…' : 'Send message'}
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function StepShell({
  icon: Icon,
  kicker,
  title,
  children,
}: {
  icon: typeof User;
  kicker: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col">
      <div
        className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl"
        style={{ background: 'rgba(0,179,105,0.1)', color: 'var(--green-deep)' }}
      >
        <Icon size={20} />
      </div>
      <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: 'var(--green-deep)' }}>
        {kicker}
      </div>
      <h3 className="mb-4 font-display text-[22px] leading-snug sm:text-[24px]">{title}</h3>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function OptionCard({
  label,
  hint,
  selected,
  onClick,
}: {
  label: string;
  hint?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-between gap-2 rounded-xl border px-3.5 py-3 text-left text-[13.5px] transition-all hover:-translate-y-0.5"
      style={{
        borderColor: selected ? 'var(--green)' : 'var(--line)',
        background: selected ? 'rgba(0,179,105,0.08)' : 'var(--paper)',
        boxShadow: selected ? 'inset 0 0 0 1px var(--green)' : 'none',
      }}
    >
      <span>
        <span className="block font-medium">{label}</span>
        {hint ? (
          <span className="mt-0.5 block text-[12px]" style={{ color: 'var(--ink-soft)' }}>
            {hint}
          </span>
        ) : null}
      </span>
      <span
        className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border"
        style={{
          borderColor: selected ? 'var(--green)' : 'var(--line)',
          background: selected ? 'var(--green)' : 'transparent',
        }}
      >
        {selected && <Check size={13} style={{ color: '#fff' }} />}
      </span>
    </button>
  );
}
