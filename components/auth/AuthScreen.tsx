'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Mail } from 'lucide-react';
import AuthChrome, { AuthAlert, AuthSubmit } from '@/components/auth/AuthChrome';

function withParams(path: string, next: string, campus: string | null) {
  const q = new URLSearchParams();
  if (next && next !== '/dashboard') q.set('next', next);
  if (campus) q.set('campus', campus);
  const s = q.toString();
  return s ? `${path}?${s}` : path;
}

function timedOut(err: unknown) {
  return (
    (err instanceof DOMException && err.name === 'AbortError') ||
    (err instanceof Error && err.name === 'TimeoutError')
  );
}

/**
 * Shared InTelleX credentials auth.
 * Optional `campus` query binds the session to an institution after login.
 */
export default function AuthScreen({ mode }: { mode: 'login' | 'signup' }) {
  const params = useSearchParams();
  const router = useRouter();
  const campus = (params.get('campus') || '').trim().toLowerCase().slice(0, 64) || null;
  const defaultNext = campus ? `/dashboard/institutions/${campus}` : '/dashboard';
  const next = params.get('next') || defaultNext;
  const justVerified = params.get('verified') === '1';
  const justReset = params.get('reset') === '1';
  const sessionExpired = params.get('expired') === '1';
  const isSignup = mode === 'signup';

  const [step, setStep] = useState<'form' | 'otp' | 'check-email'>('form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(
    !isSignup && justVerified
      ? 'Email verified. Sign in with your password.'
      : !isSignup && justReset
        ? 'Password updated. Sign in with your new password.'
        : !isSignup && sessionExpired
          ? 'Your previous session is no longer valid. Sign in again.'
          : null,
  );
  const [busy, setBusy] = useState(false);
  const [resendBusy, setResendBusy] = useState(false);
  const [lockSec, setLockSec] = useState(0);

  const loginHref = withParams('/login', next, campus);
  const signupHref = withParams('/signup', next, campus);
  const forgotHref = withParams('/forgot-password', next, campus);

  useEffect(() => {
    if (lockSec <= 0) return undefined;
    const id = window.setTimeout(() => setLockSec((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearTimeout(id);
  }, [lockSec]);

  async function submitForm(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setBusy(true);
    try {
      const endpoint = isSignup ? '/api/auth/signup' : '/api/auth/login';
      const body = isSignup
        ? { name, email, password }
        : { email, password };
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(30_000),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        email?: string;
        otpRequired?: boolean;
        unverified?: boolean;
        retryAfterSec?: number;
      };
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        if (typeof data.retryAfterSec === 'number' && data.retryAfterSec > 0) {
          setLockSec(data.retryAfterSec);
        }
        if (data.unverified) setStep('check-email');
        return;
      }
      if (isSignup) {
        if (data.email) setEmail(data.email);
        setStep('check-email');
        setInfo('We sent a verification link to your email. Open it, then come back and sign in.');
        return;
      }
      if (data.email) setEmail(data.email);
      setOtp('');
      setStep('otp');
      setInfo('We emailed a 6-digit code. Enter it here to finish signing in.');
    } catch (err) {
      setError(timedOut(err) ? 'That took too long. Please try again.' : 'Network error. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  async function submitOtp(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setBusy(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otp, next, campus: campus || undefined }),
        signal: AbortSignal.timeout(30_000),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        next?: string;
        remainingAttempts?: number;
        retryAfterSec?: number;
      };
      if (!res.ok) {
        setError(data.error || 'Incorrect code.');
        if (typeof data.retryAfterSec === 'number' && data.retryAfterSec > 0) {
          setLockSec(data.retryAfterSec);
        }
        return;
      }
      router.replace(data.next || defaultNext);
      router.refresh();
    } catch (err) {
      setError(timedOut(err) ? 'That took too long. Please try again.' : 'Network error. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  async function resendLink() {
    setError(null);
    setInfo(null);
    setResendBusy(true);
    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        signal: AbortSignal.timeout(30_000),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error || 'Could not resend the email.');
        return;
      }
      setInfo('A new verification link is on its way to your inbox.');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setResendBusy(false);
    }
  }

  async function resendOtp() {
    setError(null);
    setInfo(null);
    setResendBusy(true);
    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        signal: AbortSignal.timeout(30_000),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        retryAfterSec?: number;
      };
      if (!res.ok) {
        setError(data.error || 'Could not resend the code.');
        if (typeof data.retryAfterSec === 'number' && data.retryAfterSec > 0) {
          setLockSec(data.retryAfterSec);
        }
        return;
      }
      setOtp('');
      setInfo('A new code is on its way to your inbox.');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setResendBusy(false);
    }
  }

  const checkingEmail = step === 'check-email';
  const enteringOtp = step === 'otp';
  const otpLocked = enteringOtp && lockSec > 0;

  return (
    <AuthChrome
      campus={Boolean(campus)}
      tab={
        checkingEmail
          ? 'Check your email'
          : enteringOtp
            ? 'Enter your code'
            : isSignup
              ? 'Create your account'
              : 'Welcome back'
      }
      title={
        checkingEmail
          ? 'Verify your email'
          : enteringOtp
            ? 'Check your inbox'
            : isSignup
              ? 'Start learning in minutes'
              : 'Sign in to keep learning'
      }
      subtitle={
        checkingEmail
          ? `We sent a verification link to ${email || 'you'}. Open it to confirm your account, then sign in.`
          : enteringOtp
            ? `We sent a 6-digit code to ${email || 'you'}. You have 4 tries. After 4 misses, wait one minute.`
            : isSignup
              ? 'Email and password — we will send a link so you can verify, then come back and sign in.'
              : 'Email or matricule, plus the password for this same account. We then email a sign-in code.'
      }
      footer={
        <p
          className="mt-10 text-center text-[12px] leading-relaxed"
          style={{ color: 'var(--ink-soft)' }}
        >
          By continuing you agree to the Intellex terms. Sign-in codes expire in 10 minutes.
        </p>
      }
    >
      {error && <AuthAlert kind="error">{error}</AuthAlert>}
      {info && !error && <AuthAlert kind="info">{info}</AuthAlert>}

      {checkingEmail ? (
        <div className="mt-8 space-y-4">
          <div
            className="flex items-start gap-3 rounded-2xl border px-4 py-4 text-[14px]"
            style={{ borderColor: 'var(--line)' }}
          >
            <Mail size={18} className="mt-0.5 shrink-0" style={{ color: 'var(--green-deep)' }} />
            <p style={{ color: 'var(--ink-soft)' }}>
              Click <strong style={{ color: 'var(--ink)' }}>Verify email</strong> in the message.
              After that, return here and sign in with your password.
            </p>
          </div>
          <Link
            href={loginHref}
            className="flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-[15px] font-semibold text-white"
            style={{ background: '#0C1116' }}
          >
            Continue to sign in
            <ArrowRight size={16} className="opacity-70" />
          </Link>
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[13px]">
            <button
              type="button"
              onClick={() => {
                setStep('form');
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
              onClick={resendLink}
              className="font-semibold disabled:opacity-60"
              style={{ color: 'var(--green-deep)' }}
            >
              {resendBusy ? 'Sending…' : 'Resend link'}
            </button>
          </div>
        </div>
      ) : enteringOtp ? (
        <form onSubmit={submitOtp} className="mt-8 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-[12.5px] font-semibold">6-digit code</span>
            <input
              className="form-input tracking-[0.35em]"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="••••••"
              disabled={otpLocked}
            />
          </label>
          {otpLocked ? (
            <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
              Wait {lockSec}s, then try again.
            </p>
          ) : null}
          <AuthSubmit
            busy={busy || otpLocked}
            label="Confirm code"
            busyLabel={otpLocked ? `Wait ${lockSec}s` : 'Checking…'}
          />
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[13px]">
            <button
              type="button"
              onClick={() => {
                setStep('form');
                setOtp('');
                setError(null);
                setInfo(null);
                setLockSec(0);
              }}
              className="font-semibold"
              style={{ color: 'var(--ink-soft)' }}
            >
              ← Back
            </button>
            <button
              type="button"
              disabled={resendBusy || otpLocked}
              onClick={resendOtp}
              className="font-semibold disabled:opacity-60"
              style={{ color: 'var(--green-deep)' }}
            >
              {resendBusy ? 'Sending…' : 'Resend code'}
            </button>
          </div>
        </form>
      ) : (
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
            <span className="mb-1.5 block text-[12.5px] font-semibold">
              {isSignup ? 'Email' : 'Email or matricule'}
            </span>
            <input
              className="form-input"
              type={isSignup ? 'email' : 'text'}
              autoComplete={isSignup ? 'email' : 'username'}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={isSignup ? 'example@example.com' : 'you@email.com or INT-2026-00421'}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 flex items-center justify-between text-[12.5px] font-semibold">
              Password
              {!isSignup && (
                <Link href={forgotHref} className="font-semibold" style={{ color: 'var(--green-deep)' }}>
                  Forgot password?
                </Link>
              )}
            </span>
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

          <AuthSubmit
            busy={busy}
            label={isSignup ? 'Create account' : 'Sign in'}
            busyLabel={isSignup ? 'Sending link…' : 'Sending code…'}
          />
        </form>
      )}

      {!checkingEmail && !enteringOtp && (
        <p className="mt-6 text-center text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>
          {isSignup ? (
            <>
              Already have an account?{' '}
              <Link href={loginHref} className="font-semibold" style={{ color: 'var(--green-deep)' }}>
                Sign in
              </Link>
            </>
          ) : (
            <>
              New to Intellex?{' '}
              <Link href={signupHref} className="font-semibold" style={{ color: 'var(--green-deep)' }}>
                Create an account
              </Link>
            </>
          )}
        </p>
      )}
    </AuthChrome>
  );
}
