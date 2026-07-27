import { Suspense } from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/getUser';
import AuthScreen from '@/components/auth/AuthScreen';

export const metadata: Metadata = {
  title: 'Sign in — Intellex',
  description: 'Sign in to Intellex with your LoopingBinary account.',
};

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  if (getSessionUser()) redirect('/dashboard');
  return (
    <Suspense>
      <AuthScreen mode="login" />
    </Suspense>
  );
}
