import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import { listOpportunities } from '@/lib/learn/portfolio';

export const dynamic = 'force-dynamic';

export default async function OpportunitiesPage() {
  const session = getSessionUser();
  if (!session) redirect('/login?next=/dashboard/opportunities');

  const items = await listOpportunities();

  return (
    <div className="mx-auto max-w-[920px]">
      <header className="mb-8 border-b pb-6" style={{ borderColor: 'var(--line)' }}>
        <div className="tab mb-2 inline-flex items-center gap-1.5">
          <Sparkles size={11} /> Career
        </div>
        <h1 className="font-display text-[30px] leading-tight">Opportunities</h1>
        <p className="mt-2 text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
          Internships, projects, mentorship, and competitions — published by campuses and Intellex.
        </p>
        <Link href="/dashboard/portfolio" className="mt-3 inline-block text-[13px] font-semibold" style={{ color: 'var(--green-deep)' }}>
          Open portfolio →
        </Link>
      </header>

      <ul className="space-y-3">
        {items.map((o) => (
          <li key={o.id} className="border p-4" style={{ borderColor: 'var(--line)' }}>
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
