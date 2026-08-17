'use client';

import { FormEvent, useState } from 'react';
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
  const isSignup = mode === 'signup';

  const [step, setStep] = useState<'form' | 'check-email'>(isSignup ? 'form' : 'form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(
    !isSignup && justVerified
      ? 'Email verified. Sign in with your password.'
      : !isSignup && justReset
        ? 'Password updated. Sign in with your new password.'
        : null,
  );
  const [busy, setBusy] = useState(false);
  const [resendBusy, setResendBusy] = useState(false);

  const loginHref = withParams('/login', next, campus);
  const signupHref = withParams('/signup', next, campus);
  const forgotHref = withParams('/forgot-password', next, campus);

  async function submitForm(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setBusy(true);
    try {
      const endpoint = isSignup ? '/api/auth/signup' : '/api/auth/login';
      const body = isSignup
        ? { name, email, password }
        : { email, password, next, campus: campus || undefined };
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(30_000),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        email?: string;
        next?: string;
        unverified?: boolean;
      };
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        if (data.unverified) setStep('check-email');
        return;
      }
      if (isSignup) {
        if (data.email) setEmail(data.email);
        setStep('check-email');
        setInfo('We sent a verification link to your email. Open it, then come back and sign in.');
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

  const checkingEmail = step === 'check-email';

  return (
    <AuthChrome
      campus={Boolean(campus)}
      tab={checkingEmail ? 'Check your email' : isSignup ? 'Create your account' : 'Welcome back'}
      title={
        checkingEmail
          ? 'Verify your email'
          : isSignup
            ? 'Start learning in minutes'
            : 'Sign in to keep learning'
      }
      subtitle={
        checkingEmail
          ? `We sent a verification link to ${email || 'you'}. Open it to confirm your account, then sign in.`
          : isSignup
            ? 'Email and password — we will send a link so you can verify, then come back and sign in.'
            : 'Use the email and password you created after verifying your inbox.'
      }
      footer={
        <p
          className="mt-10 text-center text-[12px] leading-relaxed"
          style={{ color: 'var(--ink-soft)' }}
        >
          By continuing you agree to the Intellex terms. We verify your email with a private link —
          no third-party sign-in required.
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
            <span className="mb-1.5 block text-[12.5px] font-semibold">Email</span>
            <input
              className="form-input"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@example.com"
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
            busyLabel={isSignup ? 'Sending link…' : 'Signing in…'}
          />
        </form>
      )}

      {!checkingEmail && (
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
