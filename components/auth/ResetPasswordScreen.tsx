'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthChrome, { AuthAlert, AuthSubmit } from '@/components/auth/AuthChrome';

export default function ResetPasswordScreen({
  token,
  linkError,
}: {
  token: string;
  linkError: string | null;
}) {
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(linkError);
  const [busy, setBusy] = useState(false);
  const blocked = Boolean(linkError);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (blocked) return;
    setError(null);
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('The two passwords do not match.');
      return;
    }
    setBusy(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
        signal: AbortSignal.timeout(30_000),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error || 'Could not reset that password.');
        return;
      }
      router.replace('/login?reset=1');
      router.refresh();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthChrome
      campus={false}
      tab="Account recovery"
      title="Choose a new password"
      subtitle="Pick a password you will remember, then sign in with it."
    >
      {error && <AuthAlert kind="error">{error}</AuthAlert>}

      {!blocked && (
      <form onSubmit={submit} className="mt-8 space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-[12.5px] font-semibold">New password</span>
          <input
            className="form-input"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[12.5px] font-semibold">Confirm password</span>
          <input
            className="form-input"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Repeat the new password"
          />
        </label>
        <AuthSubmit busy={busy} label="Update password" busyLabel="Saving…" />
      </form>
      )}

      <p className="mt-6 text-center text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>
        <Link href="/forgot-password" className="font-semibold" style={{ color: 'var(--green-deep)' }}>
          Request a new link
        </Link>
        {' · '}
        <Link href="/login" className="font-semibold" style={{ color: 'var(--green-deep)' }}>
          Sign in
        </Link>
      </p>
    </AuthChrome>
  );
}
