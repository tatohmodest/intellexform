import { Suspense } from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/getUser';
import AuthScreen from '@/components/auth/AuthScreen';

export const metadata: Metadata = {
  title: 'Sign up — Intellex',
  description:
    'Create your Intellex account with LoopingBinary — self-paced courses, live mentorship and AI tutoring.',
};

export const dynamic = 'force-dynamic';

export default function SignupPage() {
  if (getSessionUser()) redirect('/dashboard');
  return (
    <Suspense>
      <AuthScreen mode="signup" />
    </Suspense>
  );
}
