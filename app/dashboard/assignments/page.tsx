import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ClipboardList } from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import { getStudentCommandCenter } from '@/lib/learn/commandCenter';

export const dynamic = 'force-dynamic';

const BUCKETS = [
  { id: 'due_today', label: 'Due today' },
  { id: 'overdue', label: 'Overdue' },
  { id: 'due_week', label: 'Due this week' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'submitted', label: 'Submitted' },
  { id: 'graded', label: 'Graded' },
] as const;

export default async function AssignmentsIndexPage({
  searchParams,
}: {
  searchParams?: { bucket?: string };
}) {
  const session = getSessionUser();
  if (!session) redirect('/login?next=/dashboard/assignments');

  const cc = await getStudentCommandCenter(session.uid);
  const active =
    BUCKETS.find((b) => b.id === searchParams?.bucket)?.id ||
    (cc.assignmentBuckets.due_today.length
      ? 'due_today'
      : cc.assignmentBuckets.overdue.length
        ? 'overdue'
        : 'due_week');

  const items = cc.assignmentBuckets[active] || [];

  return (
    <div className="mx-auto max-w-[920px]">
      <header className="mb-8 border-b pb-6" style={{ borderColor: 'var(--line)' }}>
        <div className="tab mb-2 inline-flex items-center gap-1.5">
          <ClipboardList size={11} /> Assignments
        </div>
        <h1 className="font-display text-[30px] leading-tight">Assignment center</h1>
        <p className="mt-2 max-w-[620px] text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
          Due today, this week, submitted, and graded — with a clear next action on every item.
        </p>
      </header>

      <nav className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {BUCKETS.map((b) => {
          const count = cc.assignmentBuckets[b.id]?.length || 0;
          const isActive = active === b.id;
          return (
            <Link
              key={b.id}
              href={`/dashboard/assignments?bucket=${b.id}`}
              className="shrink-0 border px-3 py-2 text-[12.5px] font-semibold"
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
          className="rounded-2xl border border-dashed p-10 text-center"
          style={{ borderColor: 'var(--line)' }}
        >
          <ClipboardList size={28} style={{ color: 'var(--ink-soft)' }} />
          <p className="mt-3 font-display text-[20px]">Nothing in this list</p>
          <p className="mt-1 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
            When instructors publish work, it will appear in the right bucket.
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
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-[16px] font-semibold">{a.title}</h2>
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
                    className="shrink-0 px-3 py-2 text-[13px] font-semibold text-white"
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
