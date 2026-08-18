import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { verifyEmailToken } from '@/lib/auth/credentials';
import VerifyEmailResult from '@/components/auth/VerifyEmailResult';

export const metadata: Metadata = {
  title: 'Verify email - Intellex',
};

export const dynamic = 'force-dynamic';

function tokenFromParams(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  return String(raw || '')
    .trim()
    .replace(/\s+/g, '');
}

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams?: { token?: string | string[] };
}) {
  const token = tokenFromParams(searchParams?.token);
  if (!token) {
    return (
      <VerifyEmailResult
        ok={false}
        error="This verification link is missing. Open the latest email we sent, or sign up again."
        email={null}
      />
    );
  }

  let result: Awaited<ReturnType<typeof verifyEmailToken>>;
  try {
    result = await verifyEmailToken(token);
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

  if ('redirect' in result) {
    redirect(result.redirect);
  }
  if ('error' in result) {
    return <VerifyEmailResult ok={false} error={result.error} email={null} />;
  }
  return <VerifyEmailResult ok email={result.email} error={null} />;
}
