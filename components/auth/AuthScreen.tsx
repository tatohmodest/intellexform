'use client';

import { FormEvent, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Video,
  Bot,
  BookOpen,
  ShieldCheck,
  Flame,
  ArrowRight,
  Mail,
} from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';

type Step = 'form' | 'otp';

export type AuthCampusBrand = {
  slug: string;
  name: string;
  accent: string;
  logoUrl?: string | null;
  homeHref: string;
  loginHref: string;
  signupHref: string;
  portalHref: string;
  tagline?: string;
};

function CampusMark({
  brand,
  invert = false,
}: {
  brand: AuthCampusBrand;
  invert?: boolean;
}) {
  return (
    <Link href={brand.homeHref} className="flex items-center gap-2.5">
      {brand.logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={brand.logoUrl}
          alt={brand.name}
          className={`h-8 w-8 object-contain ${invert ? 'brightness-0 invert' : ''}`}
        />
      ) : (
        <span
          className="flex h-8 w-8 items-center justify-center font-display text-[14px] font-bold text-white"
          style={{ background: brand.accent }}
        >
          {brand.name.charAt(0)}
        </span>
      )}
      <span
        className={`font-display text-[18px] leading-none ${invert ? 'text-white' : ''}`}
        style={invert ? undefined : { color: 'var(--ink)' }}
      >
        {brand.name}
      </span>
    </Link>
  );
}

export default function AuthScreen({
  mode,
  campus = null,
}: {
  mode: 'login' | 'signup';
  campus?: AuthCampusBrand | null;
}) {
  const params = useSearchParams();
  const router = useRouter();
  const defaultNext = campus ? campus.portalHref : '/dashboard';
  const next = params.get('next') || defaultNext;
  const isSignup = mode === 'signup';
  const accent = campus?.accent || '#00B369';

  const [step, setStep] = useState<Step>('form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [resendBusy, setResendBusy] = useState(false);

  const loginHref = campus
    ? `${campus.loginHref}${next !== defaultNext ? `?next=${encodeURIComponent(next)}` : ''}`
    : `/login${next !== '/dashboard' ? `?next=${encodeURIComponent(next)}` : ''}`;
  const signupHref = campus
    ? `${campus.signupHref}${next !== defaultNext ? `?next=${encodeURIComponent(next)}` : ''}`
    : `/signup${next !== '/dashboard' ? `?next=${encodeURIComponent(next)}` : ''}`;

  async function submitForm(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setBusy(true);
    try {
      const endpoint = isSignup ? '/api/auth/signup' : '/api/auth/login';
      const body = isSignup ? { name, email, password } : { email, password };
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; email?: string };
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }
      if (data.email) setEmail(data.email);
      setStep('otp');
      setInfo('We sent a 6-digit code to your email. Enter it below to continue.');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  async function submitOtp(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          code,
          purpose: isSignup ? 'signup' : 'login',
          next,
          campus: campus?.slug || undefined,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        next?: string;
      };
      if (!res.ok) {
        setError(data.error || 'Could not verify that code.');
        return;
      }
      router.replace(data.next || defaultNext);
      router.refresh();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  async function resendCode() {
    setError(null);
    setInfo(null);
    setResendBusy(true);
    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          purpose: isSignup ? 'signup' : 'login',
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error || 'Could not resend the code.');
        return;
      }
      setInfo('A new code is on its way to your inbox.');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setResendBusy(false);
    }
  }

  const panelBg = campus
    ? `radial-gradient(1200px 600px at -10% -10%, ${accent}59, transparent 60%), radial-gradient(900px 500px at 110% 110%, rgba(12,17,22,0.35), transparent 60%), #0C1116`
    : 'radial-gradient(1200px 600px at -10% -10%, rgba(0,179,105,0.35), transparent 60%), radial-gradient(900px 500px at 110% 110%, rgba(74,144,226,0.3), transparent 60%), #0C1116';

  return (
    <div className="flex min-h-screen">
      <div
        className="relative hidden w-[46%] flex-col justify-between overflow-hidden p-12 lg:flex"
        style={{ background: panelBg }}
      >
        <div className="flex items-center gap-2.5">
          {campus ? (
            <CampusMark brand={campus} invert />
          ) : (
            <BrandLogo href="/" height={30} className="brightness-0 invert" />
          )}
          <span className="mono rounded-full border border-white/20 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.14em] text-white/70">
            {campus ? 'Campus' : 'Learning'}
          </span>
        </div>

        <div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-display text-[40px] leading-[1.15] text-white"
          >
            {campus ? (
              <>
                Welcome to{' '}
                <span className="italic" style={{ color: accent }}>
                  {campus.name}
                </span>
              </>
            ) : (
              <>
                Learn like the world is
                <span className="italic" style={{ color: '#1ED77E' }}>
                  {' '}
                  watching you win.
                </span>
              </>
            )}
          </motion.h1>
          <p className="mt-4 max-w-md text-[15.5px] leading-relaxed text-white/70">
            {campus
              ? campus.tagline ||
                `Sign ${isSignup ? 'up' : 'in'} to access courses, mentors, and your ${campus.name} learning dashboard.`
              : 'Self-paced courses with real curricula, live mentorship over crystal-clear video, and an AI tutor that never sleeps. Create your account once — then join any campus that invites you.'}
          </p>

          {!campus && (
            <div className="mt-8 space-y-3.5">
              {[
                { icon: <BookOpen size={16} />, text: '17 course tracks · 500+ hands-on lessons' },
                { icon: <Video size={16} />, text: '1-on-1 mentorship & live classes (HD video)' },
                { icon: <Bot size={16} />, text: 'AI tutor that knows InTelleX + your catalogue' },
                { icon: <Flame size={16} />, text: 'Streaks, XP and certificates that keep you going' },
              ].map((f, i) => (
                <motion.div
                  key={f.text}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.08 }}
                  className="flex items-center gap-3 text-[14px] text-white/85"
                >
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full"
                    style={{ background: 'rgba(30,215,126,0.14)', color: '#1ED77E' }}
                  >
                    {f.icon}
                  </span>
                  {f.text}
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-[12.5px] text-white/50">
          <ShieldCheck size={14} />
          {campus
            ? `Secure email OTP · Powered by InTelleX for ${campus.name}`
            : 'Email verification with a one-time code — your password stays on InTelleX.'}
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-paper px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[420px]"
        >
          <div className="mb-10 lg:hidden">
            {campus ? <CampusMark brand={campus} /> : <BrandLogo href="/" height={28} />}
          </div>

          <div className="tab mb-4 inline-flex items-center gap-1.5">
            {step === 'otp'
              ? 'Check your email'
              : isSignup
                ? campus
                  ? `Join ${campus.name}`
                  : 'Create your account'
                : campus
                  ? `Sign in to ${campus.name}`
                  : 'Welcome back'}
          </div>
          <h2 className="font-display text-[30px] leading-tight">
            {step === 'otp'
              ? 'Enter your code'
              : isSignup
                ? campus
                  ? 'Create your campus account'
                  : 'Start learning in minutes'
                : campus
                  ? 'Continue learning'
                  : 'Sign in to keep learning'}
          </h2>
          <p className="mt-2 text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
            {step === 'otp'
              ? `We emailed a 6-digit code to ${email || 'you'}.`
              : isSignup
                ? 'Email, password, and a quick verification code — then you are in.'
                : 'Use your email and password. We will send a one-time code to confirm it is you.'}
          </p>

          {error && (
            <div
              className="mt-6 rounded-xl border px-4 py-3 text-[13.5px]"
              style={{
                background: 'rgba(196,98,42,0.08)',
                borderColor: 'rgba(196,98,42,0.3)',
                color: '#a14d18',
              }}
            >
              {error}
            </div>
          )}
          {info && !error && (
            <div
              className="mt-6 rounded-xl border px-4 py-3 text-[13.5px]"
              style={{
                background: `${accent}14`,
                borderColor: `${accent}47`,
                color: accent,
              }}
            >
              {info}
            </div>
          )}

          {step === 'form' ? (
            <form onSubmit={submitForm} className="mt-8 space-y-4">
              {isSignup && (
                <label className="block">
                  <span className="mb-1.5 block text-[12.5px] font-semibold">Full name</span>
                  <input
                    className="form-input"
                    autoComplete="name"
                    required
                    minLength={2}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ada Okoro"
                  />
                </label>
              )}
              <label className="block">
                <span className="mb-1.5 block text-[12.5px] font-semibold">Email</span>
                <input
                  className="form-input"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@school.edu"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[12.5px] font-semibold">Password</span>
                <input
                  className="form-input"
                  type="password"
                  autoComplete={isSignup ? 'new-password' : 'current-password'}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isSignup ? 'At least 8 characters' : 'Your password'}
                />
              </label>

              <button
                type="submit"
                disabled={busy}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-[15px] font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60"
                style={{ background: campus ? accent : '#0C1116' }}
              >
                {busy ? 'Sending code…' : isSignup ? 'Create account' : 'Continue'}
                {!busy && <ArrowRight size={16} className="opacity-70" />}
              </button>
            </form>
          ) : (
            <form onSubmit={submitOtp} className="mt-8 space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-[12.5px] font-semibold">6-digit code</span>
                <input
                  className="form-input mono text-center text-[22px] tracking-[0.35em]"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  required
                  minLength={6}
                  maxLength={6}
                  pattern="[0-9]{6}"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="••••••"
                />
              </label>

              <button
                type="submit"
                disabled={busy || code.length !== 6}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-[15px] font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60"
                style={{ background: campus ? accent : '#0C1116' }}
              >
                <Mail size={16} className="opacity-80" />
                {busy ? 'Verifying…' : 'Verify & continue'}
              </button>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[13px]">
                <button
                  type="button"
                  onClick={() => {
                    setStep('form');
                    setCode('');
                    setError(null);
                    setInfo(null);
                  }}
                  className="font-semibold"
                  style={{ color: 'var(--ink-soft)' }}
                >
                  ← Back
                </button>
                <button
                  type="button"
                  disabled={resendBusy}
                  onClick={resendCode}
                  className="font-semibold disabled:opacity-60"
                  style={{ color: accent }}
                >
                  {resendBusy ? 'Sending…' : 'Resend code'}
                </button>
              </div>
            </form>
          )}

          {step === 'form' && (
            <p className="mt-6 text-center text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>
              {isSignup ? (
                <>
                  Already have an account?{' '}
                  <Link href={loginHref} className="font-semibold" style={{ color: accent }}>
                    Sign in
                  </Link>
                </>
              ) : (
                <>
                  {campus ? 'New here?' : 'New to Intellex?'}{' '}
                  <Link href={signupHref} className="font-semibold" style={{ color: accent }}>
                    Create an account
                  </Link>
                </>
              )}
            </p>
          )}

          {campus ? (
            <p className="mt-8 text-center text-[12px]" style={{ color: 'var(--ink-soft)' }}>
              <Link href={campus.homeHref} className="font-semibold" style={{ color: accent }}>
                ← Back to {campus.name}
              </Link>
            </p>
          ) : null}

          <p
            className="mt-6 text-center text-[12px] leading-relaxed"
            style={{ color: 'var(--ink-soft)' }}
          >
            {campus
              ? `By continuing you join ${campus.name}. Email verification keeps your account secure.`
              : 'By continuing you agree to the Intellex terms. We verify your email with a one-time code — no third-party sign-in required.'}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
