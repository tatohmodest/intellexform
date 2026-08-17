import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ClipboardList } from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import { getStudentCommandCenter } from '@/lib/learn/commandCenter';

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
      <header className="mb-5 border-b pb-4 sm:mb-8 sm:pb-6" style={{ borderColor: 'var(--line)' }}>
        <div className="tab mb-2 inline-flex items-center gap-1.5">
          <ClipboardList size={11} /> Assignments
        </div>
        <h1 className="font-display text-[24px] leading-tight sm:text-[30px]">Assignment center</h1>
        <p className="mt-2 max-w-[620px] text-[13.5px] sm:text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
          Every assignment sent to you — due today, upcoming, submitted, and graded.
        </p>
      </header>

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
              className="snap-start inline-flex min-h-[44px] shrink-0 items-center whitespace-nowrap border px-3 py-2 text-[12.5px] font-semibold"
              style={{
                borderColor: isActive ? 'var(--ink)' : 'var(--line)',
                background: isActive ? 'var(--ink)' : 'transparent',
                color: isActive ? '#fff' : 'var(--ink-soft)',
              }}
            >
              {b.label} ({count})
            </Link>
          );
        })}
      </nav>

      {items.length === 0 ? (
        <div
          className="rounded-2xl border border-dashed px-4 py-8 text-center sm:p-10"
          style={{ borderColor: 'var(--line)' }}
        >
          <ClipboardList size={28} className="mx-auto" style={{ color: 'var(--ink-soft)' }} />
          <p className="mt-3 font-display text-[18px] sm:text-[20px]">
            {active === 'all' ? 'No assignments yet' : 'Nothing in this list'}
          </p>
          <p className="mt-1 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
            {active === 'all'
              ? 'When an instructor sends you work, it will show up here — not only in notifications.'
              : 'When instructors publish work, it will appear in the right bucket.'}
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((a) => (
            <li key={a.id}>
              <Link
                href={a.href}
                className="block border p-4 transition-shadow hover:shadow-card"
                style={{ borderColor: 'var(--line)' }}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h2 className="text-[16px] font-semibold leading-snug break-words">{a.title}</h2>
                    <p className="mt-1 text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
                      {a.authorName}
                      {a.dueAt ? ` · due ${new Date(a.dueAt).toLocaleString()}` : ''}
                    </p>
                    <p className="mt-2 text-[12px] font-semibold uppercase tracking-wide">
                      {a.status.replace(/_/g, ' ')}
                      {a.status === 'graded' && a.score != null
                        ? ` · ${a.score}${a.maxScore != null ? `/${a.maxScore}` : ''}`
                        : ''}
                    </p>
                  </div>
                  <span
                    className="inline-flex min-h-[44px] w-full items-center justify-center px-3 py-2 text-[13px] font-semibold text-white sm:w-auto sm:shrink-0"
                    style={{ background: 'var(--green-deep)' }}
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
