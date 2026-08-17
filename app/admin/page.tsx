'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, RefreshCw, ShieldCheck } from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [hint, setHint] = useState('');

  async function requestOtp(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setHint('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/otp/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? 'Could not send code');
        return;
      }
      setHint(`Code sent to ${data.email || email}. Check your inbox.`);
      setStep('otp');
    } catch {
      setError('Could not connect. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? 'Incorrect code');
        return;
      }
      onSuccess();
    } catch {
      setError('Could not connect. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4" style={{ background: 'var(--paper)' }}>
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex justify-center">
            <BrandLogo href={null} height={48} variant="mark" />
          </div>
          <h1 className="font-display text-2xl font-bold">Admin Access</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--ink-soft)' }}>
            InTelleX · OTP for authorized emails
          </p>
        </div>

        {step === 'email' ? (
          <form
            onSubmit={requestOtp}
            className="space-y-5 border p-8"
            style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}
          >
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm font-medium">
                <Mail size={13} style={{ color: 'var(--ink-soft)' }} /> Admin email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@gmail.com"
                autoFocus
                className="form-input !rounded-none"
                required
              />
            </div>
            {error && (
              <p className="px-4 py-3 text-sm" style={{ background: 'rgba(220,38,38,0.08)', color: '#b91c1c' }}>
                {error}
              </p>
            )}
            <button type="submit" disabled={loading || !email} className="btn btn-primary w-full !rounded-none">
              {loading ? <RefreshCw size={15} className="animate-spin" /> : <Mail size={15} />}
              {loading ? 'Sending…' : 'Send one-time code'}
            </button>
            <p className="text-center text-xs" style={{ color: 'var(--ink-soft)' }}>
              Or{' '}
              <a href="/login?next=/admin/overview" className="font-semibold underline" style={{ color: 'var(--green-deep)' }}>
                sign in with your InTelleX account
              </a>
            </p>
          </form>
        ) : (
          <form
            onSubmit={verifyOtp}
            className="space-y-5 border p-8"
            style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}
          >
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm font-medium">
                <Lock size={13} style={{ color: 'var(--ink-soft)' }} /> 6-digit code
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="••••••"
                autoFocus
                className="form-input !rounded-none tracking-[0.35em] text-center text-lg font-semibold"
                required
              />
              {hint && (
                <p className="text-xs" style={{ color: 'var(--green-deep)' }}>
                  {hint}
                </p>
              )}
            </div>
            {error && (
              <p className="px-4 py-3 text-sm" style={{ background: 'rgba(220,38,38,0.08)', color: '#b91c1c' }}>
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="btn btn-primary w-full !rounded-none"
            >
              {loading ? <RefreshCw size={15} className="animate-spin" /> : <ShieldCheck size={15} />}
              {loading ? 'Verifying…' : 'Enter console'}
            </button>
            <button
              type="button"
              className="btn btn-ghost w-full !rounded-none"
              onClick={() => {
                setStep('email');
                setCode('');
                setError('');
              }}
            >
              Use a different email
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

/** /admin = login gate. Console lives on real routes under /admin/*. */
export default function AdminLoginPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch('/api/admin/auth')
      .then((r) => {
        if (r.ok) router.replace('/admin/overview');
        else setChecking(false);
      })
      .catch(() => setChecking(false));
  }, [router]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: 'var(--paper)' }}>
        <RefreshCw size={18} className="animate-spin" style={{ color: 'var(--ink-soft)' }} />
      </div>
    );
  }

  return <LoginForm onSuccess={() => router.replace('/admin/overview')} />;
}
