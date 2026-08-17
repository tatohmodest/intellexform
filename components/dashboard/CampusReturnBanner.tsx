'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

/**
 * When a campus student opens a shared InTelleX tool (library, tutor, …),
 * show a bar that returns them to their institution dashboard.
 */
export default function CampusReturnBanner({ accent = '#00b369' }: { accent?: string }) {
  const params = useSearchParams();
  const campus = params.get('campus');
  const returnTo = params.get('returnTo');
  if (!campus && !returnTo) return null;

  const href =
    returnTo && returnTo.startsWith('/')
      ? returnTo
      : campus
        ? `/dashboard/institutions/${campus}`
        : '/dashboard/institutions';

  const label = campus ? `Back to campus` : 'Back to campus dashboard';

  return (
    <div
      className="mb-4 flex flex-wrap items-center justify-between gap-2 border px-3.5 py-2.5 text-[13px]"
      style={{ borderColor: `${accent}44`, background: `${accent}12` }}
    >
      <span style={{ color: 'var(--ink-soft)' }}>
        You&apos;re using a campus tool
        {campus ? (
          <>
            {' '}
            for <strong style={{ color: 'var(--ink)' }}>{campus}</strong>
          </>
        ) : null}
        .
      </span>
      <Link href={href} className="inline-flex items-center gap-1.5 font-semibold" style={{ color: accent }}>
        <ArrowLeft size={14} />
        {label}
      </Link>
    </div>
  );
}
