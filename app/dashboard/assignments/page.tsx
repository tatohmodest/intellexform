import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ClipboardList } from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import { getStudentCommandCenter } from '@/lib/learn/commandCenter';
import PageHeader from '@/components/dashboard/PageHeader';

export const dynamic = 'force-dynamic';

const BUCKETS = [
  { id: 'all', label: 'All' },
  { id: 'due_today', label: 'Due today' },
  { id: 'overdue', label: 'Overdue' },
  { id: 'due_week', label: 'Due this week' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'submitted', label: 'Submitted' },
  { id: 'graded', label: 'Graded' },
] as const;

type BucketId = (typeof BUCKETS)[number]['id'];

export default async function AssignmentsIndexPage({
  searchParams,
}: {
  searchParams?: { bucket?: string };
}) {
  const session = getSessionUser();
  if (!session) redirect('/login?next=/dashboard/assignments');

  const cc = await getStudentCommandCenter(session.uid);
  const requested = BUCKETS.find((b) => b.id === searchParams?.bucket)?.id;
  const firstWithItems =
    BUCKETS.find((b) => (cc.assignmentBuckets[b.id as BucketId]?.length || 0) > 0)?.id || 'all';
  const active: BucketId = requested || firstWithItems;
  const items = cc.assignmentBuckets[active] || [];

  return (
    <div className="mx-auto w-full max-w-[920px] overflow-x-hidden">
      <PageHeader art="/eco_learning.webp" tone="butter" title="Assignments" />

      <nav
        className="-mx-1 mb-5 flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mb-6"
        aria-label="Assignment lists"
      >
        {BUCKETS.map((b) => {
          const count = cc.assignmentBuckets[b.id]?.length || 0;
          const isActive = active === b.id;
          return (
            <Link
              key={b.id}
              href={`/dashboard/assignments?bucket=${b.id}`}
              className={`chip snap-start shrink-0 ${isActive ? 'chip-primary' : ''}`}
            >
              {b.label} <span className="opacity-60">{count}</span>
            </Link>
          );
        })}
      </nav>

      {items.length === 0 ? (
        <div className="card px-4 py-10 text-center sm:p-12">
          <ClipboardList size={28} className="mx-auto" style={{ color: 'var(--ink-soft)' }} />
          <p className="mt-3 font-display text-[18px] sm:text-[20px]">
            {active === 'all' ? 'No assignments yet' : 'Nothing in this list'}
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((a) => (
            <li key={a.id}>
              <Link
                href={a.href}
                className="card block p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <h2 className="text-[16px] font-semibold leading-snug break-words">{a.title}</h2>
                    <p className="muted mt-1 text-[12.5px]">
                      {a.authorName}
                      {a.dueAt ? ` · due ${new Date(a.dueAt).toLocaleString()}` : ''}
                    </p>
                    <p className="mt-2 inline-flex rounded-full px-2 py-0.5 font-mono text-[10.5px] uppercase tracking-[0.1em]" style={{ background: 'var(--paper-dim)' }}>
                      {a.status.replace(/_/g, ' ')}
                      {a.status === 'graded' && a.score != null
                        ? ` · ${a.score}${a.maxScore != null ? `/${a.maxScore}` : ''}`
                        : ''}
                    </p>
                  </div>
                  <span
                    className="chip chip-primary w-full justify-center sm:w-auto sm:shrink-0"
                  >
                    {a.status === 'graded'
                      ? 'View feedback'
                      : a.status === 'submitted'
                        ? 'View submission'
                        : 'Open assignment'}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
