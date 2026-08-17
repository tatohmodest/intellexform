import type { Metadata } from 'next';
import { verifyEmailToken } from '@/lib/auth/credentials';
import VerifyEmailResult from '@/components/auth/VerifyEmailResult';

export const metadata: Metadata = {
  title: 'Verify email - Intellex',
};

export const dynamic = 'force-dynamic';

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams?: { token?: string };
}) {
  const token = String(searchParams?.token || '').trim();
  if (!token) {
    return (
      <VerifyEmailResult
        ok={false}
        error="This verification link is missing. Open the latest email we sent, or sign up again."
        email={null}
      />
    );
  }

  try {
    const result = await verifyEmailToken(token);
    if ('error' in result) {
      return <VerifyEmailResult ok={false} error={result.error} email={null} />;
    }
    return <VerifyEmailResult ok email={result.email} error={null} />;
  } catch (err) {
    console.error('verify-email page failed:', err);
    return (
      <VerifyEmailResult
        ok={false}
        error="Could not verify that link right now. Please try again in a moment."
        email={null}
      />
    );
  }
}
