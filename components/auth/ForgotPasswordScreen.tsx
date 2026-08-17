'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import AuthChrome, { AuthAlert, AuthSubmit } from '@/components/auth/AuthChrome';

function withParams(path: string, next: string, campus: string | null) {
  const q = new URLSearchParams();
  if (next && next !== '/dashboard') q.set('next', next);
  if (campus) q.set('campus', campus);
  const s = q.toString();
  return s ? `${path}?${s}` : path;
}

export default function ForgotPasswordScreen() {
  const params = useSearchParams();
  const campus = (params.get('campus') || '').trim().toLowerCase().slice(0, 64) || null;
  const defaultNext = campus ? `/dashboard/institutions/${campus}` : '/dashboard';
  const next = params.get('next') || defaultNext;
  const loginHref = withParams('/login', next, campus);

  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        signal: AbortSignal.timeout(30_000),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error || 'Could not send the reset email.');
        return;
      }
      setSent(true);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthChrome
      campus={Boolean(campus)}
      tab="Account recovery"
      title="Forgot your password?"
      subtitle="Enter the email on your account. If it is verified, we will send a reset link."
    >
      {error && <AuthAlert kind="error">{error}</AuthAlert>}
      {sent && !error && (
        <AuthAlert kind="info">
          If an account exists for that email, a reset link is on its way. Check your inbox and spam
          folder.
        </AuthAlert>
      )}

      <form onSubmit={submit} className="mt-8 space-y-4">
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
        <AuthSubmit busy={busy} label="Send reset link" busyLabel="Sending…" />
      </form>

      <p className="mt-6 text-center text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>
        Remembered it?{' '}
        <Link href={loginHref} className="font-semibold" style={{ color: 'var(--green-deep)' }}>
          Sign in
        </Link>
      </p>
    </AuthChrome>
  );
}
