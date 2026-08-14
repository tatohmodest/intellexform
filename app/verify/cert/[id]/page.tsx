import Link from 'next/link';
import { ShieldCheck, ShieldX } from 'lucide-react';
import { verifyCertificate } from '@/lib/learn/portfolio';

export const dynamic = 'force-dynamic';

export default async function VerifyCertificatePage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { u?: string };
}) {
  const result = await verifyCertificate(decodeURIComponent(params.id), searchParams.u || null);

  return (
    <main className="mx-auto flex min-h-screen max-w-[560px] flex-col justify-center px-4 py-16">
      <div className="border p-8 text-center" style={{ borderColor: 'var(--line)' }}>
        {result.valid ? (
          <ShieldCheck size={36} className="mx-auto" style={{ color: 'var(--green-deep)' }} />
        ) : (
          <ShieldX size={36} className="mx-auto" style={{ color: '#b91c1c' }} />
        )}
        <h1 className="mt-4 font-display text-[28px]">
          {result.valid ? 'Certificate verified' : 'Could not verify'}
        </h1>
        {result.valid ? (
          <>
            <p className="mt-3 text-[15px] font-semibold">{result.title}</p>
            <p className="mt-1 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
              Issued to {result.holderName}
              {result.earnedAt ? ` · ${new Date(result.earnedAt).toLocaleDateString()}` : ''}
            </p>
          </>
        ) : (
          <p className="mt-3 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
            This certificate id is invalid or the holder link is incomplete.
          </p>
        )}
        <Link href="/" className="mt-8 inline-block text-[13px] font-semibold" style={{ color: 'var(--green-deep)' }}>
          Back to Intellex
        </Link>
      </div>
    </main>
  );
}
