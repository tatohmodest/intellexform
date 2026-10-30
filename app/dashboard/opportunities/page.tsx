import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/getUser';
import { listOpportunities } from '@/lib/learn/portfolio';
import PageHeader from '@/components/dashboard/PageHeader';

export const dynamic = 'force-dynamic';

export default async function OpportunitiesPage() {
  const session = getSessionUser();
  if (!session) redirect('/login?next=/dashboard/opportunities');

  const items = await listOpportunities();

  return (
    <div className="mx-auto max-w-[920px]">
      <PageHeader
        title="Opportunities"
        actions={
          <>
            <Link href="/dashboard/portfolio" className="chip">
              Portfolio
            </Link>
          </>
        }
      />

      <ul className="space-y-3">
        {items.map((o) => (
          <li key={o.id} className="card p-4">
            <p className="font-mono text-[10px] uppercase tracking-wide" style={{ color: 'var(--ink-soft)' }}>
              {o.kind} · {o.org}
            </p>
            <h2 className="mt-1 font-display text-[20px]">{o.title}</h2>
            <p className="mt-2 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
              {o.summary}
            </p>
            {o.href ? (
              <Link href={o.href} className="mt-3 inline-block text-[13px] font-semibold" style={{ color: 'var(--green-deep)' }}>
                View →
              </Link>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
