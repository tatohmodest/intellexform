import { Suspense } from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/getUser';
import { getLearner } from '@/lib/learn/repo';
import { isOnboardingComplete } from '@/lib/learn/identity';
import { inspectAuthLink } from '@/lib/auth/credentials';
import ResetPasswordScreen from '@/components/auth/ResetPasswordScreen';

export const metadata: Metadata = {
  title: 'Reset password - Intellex',
  description: 'Choose a new Intellex password.',
};

export const dynamic = 'force-dynamic';

function tokenFromParams(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  return String(raw || '')
    .trim()
    .replace(/\s+/g, '');
}

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams?: { token?: string | string[] };
}) {
  const session = getSessionUser();
  if (session) {
    const learner = await getLearner(session.uid);
    redirect(isOnboardingComplete(learner) ? '/dashboard' : '/dashboard/onboarding');
  }

  const token = tokenFromParams(searchParams?.token);
  const peek = token ? await inspectAuthLink(token).catch(() => null) : null;

  if (peek?.purpose === 'verify') {
    redirect(`/verify-email?token=${encodeURIComponent(token)}`);
  }

  let linkError: string | null = null;
  if (!token) {
    linkError = 'This reset link is missing. Request a new one from Forgot password.';
  } else if (!peek) {
    linkError = 'This reset link is invalid. Request a new one from Forgot password.';
  } else if (peek.used) {
    linkError = 'This reset link has already been used. Request a new one if you still need to change your password.';
  } else if (peek.expired) {
    linkError = 'This reset link expired. Request a new one from Forgot password.';
  }

  return (
    <Suspense>
      <ResetPasswordScreen token={token} linkError={linkError} />
    </Suspense>
  );
}
