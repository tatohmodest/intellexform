import { Suspense } from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/getUser';
import { getLearner } from '@/lib/learn/repo';
import { isOnboardingComplete } from '@/lib/learn/identity';
import AuthScreen from '@/components/auth/AuthScreen';

export const metadata: Metadata = {
  title: 'Sign in - Intellex',
  description: 'Sign in to Intellex with your LoopingBinary account.',
};

export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  const session = getSessionUser();
  if (session) {
    const learner = await getLearner(session.uid);
    redirect(isOnboardingComplete(learner) ? '/dashboard' : '/dashboard/onboarding');
  }
  return (
    <Suspense>
      <AuthScreen mode="login" />
    </Suspense>
  );
}
