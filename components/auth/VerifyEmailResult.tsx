'use client';

import Link from 'next/link';
import { ArrowRight, Mail } from 'lucide-react';
import AuthChrome, { AuthAlert } from '@/components/auth/AuthChrome';

export default function VerifyEmailResult({
  ok,
  error,
  email,
}: {
  ok: boolean;
  error: string | null;
  email: string | null;
}) {
  const loginHref = '/login?verified=1';

  return (
    <AuthChrome
      campus={false}
      tab={ok ? 'Email confirmed' : 'Verification'}
      title={ok ? 'You can sign in now' : 'Could not verify that link'}
      subtitle={
        ok
          ? `Thanks${email ? ` — ${email} is verified` : ''}. Come back and sign in with the password you chose.`
          : 'The link may have expired or already been used. You can sign in if you already verified, or request a new link from Sign up.'
      }
    >
      {error && !ok && <AuthAlert kind="error">{error}</AuthAlert>}
      {ok && (
        <AuthAlert kind="info">
          Your email is verified. Sign in with your password to open your dashboard.
        </AuthAlert>
      )}

      <div className="mt-8 space-y-3">
        <Link
          href={ok ? loginHref : '/login'}
          className="flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-[15px] font-semibold text-white"
          style={{ background: '#0C1116' }}
        >
          {ok ? 'Sign in' : 'Go to sign in'}
          <ArrowRight size={16} className="opacity-70" />
        </Link>
        {!ok && (
          <Link
            href="/signup"
            className="flex w-full items-center justify-center gap-2 rounded-full border px-6 py-4 text-[15px] font-semibold"
            style={{ borderColor: 'var(--line)' }}
          >
            <Mail size={16} />
            Create account again
          </Link>
        )}
      </div>
    </AuthChrome>
  );
}
