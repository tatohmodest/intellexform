import { Suspense } from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/getUser';
import { getLearner } from '@/lib/learn/repo';
import { isOnboardingComplete } from '@/lib/learn/identity';
import ResetPasswordScreen from '@/components/auth/ResetPasswordScreen';

export const metadata: Metadata = {
  title: 'Reset password - Intellex',
  description: 'Choose a new Intellex password.',
};

export const dynamic = 'force-dynamic';

export default async function ResetPasswordPage() {
  const session = getSessionUser();
  if (session) {
    const learner = await getLearner(session.uid);
    redirect(isOnboardingComplete(learner) ? '/dashboard' : '/dashboard/onboarding');
  }
  return (
    <Suspense>
      <ResetPasswordScreen />
    </Suspense>
  );
}
