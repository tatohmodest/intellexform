import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowRight, ClipboardList } from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import { getLearner } from '@/lib/learn/repo';
import { listPublishedForStudent } from '@/lib/learn/assessments';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 12;

export default async function AssignmentsIndexPage({
  searchParams,
}: {
  searchParams?: { page?: string };
}) {
  const session = getSessionUser();
  if (!session) redirect('/login?next=/dashboard/assignments');

  const page = Math.max(1, Number(searchParams?.page || '1'));
  const learner = await getLearner(session.uid);
  const institutionSlug =
    learner?.activeContext?.kind === 'institution'
      ? learner.activeContext.institutionSlug
      : null;

  const assessments = await listPublishedForStudent({
    studentId: session.uid,
    institutionSlug,
    page,
    pageSize: PAGE_SIZE + 1,
  });

  const assignments = assessments.filter((a) => a.kind === 'assignment');
  const items = assignments.slice(0, PAGE_SIZE);
  const hasNext = assignments.length > PAGE_SIZE;

  return (
    <div className="mx-auto max-w-[920px]">
      <header className="mb-8 border-b pb-6" style={{ borderColor: 'var(--line)' }}>
        <div className="tab mb-2 inline-flex items-center gap-1.5">
          <ClipboardList size={11} /> Assignments
        </div>
        <h1 className="font-display text-[30px] leading-tight">My assignments</h1>
        <p className="mt-2 max-w-[620px] text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
          Assignments from all your instructors, ordered by publish time. Open any item to read,
          review attached documents, and submit your work.
        </p>
      </header>

      {items.length === 0 ? (
        <div
          className="rounded-2xl border border-dashed p-10 text-center"
          style={{ borderColor: 'var(--line)' }}
        >
          <ClipboardList size={28} style={{ color: 'var(--ink-soft)' }} />
          <p className="mt-3 font-display text-[20px]">No assignments yet</p>
          <p className="mt-1 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
            When instructors publish assignments, they will appear here.
          </p>
        </div>
      ) : (
        <>
          <ul className="space-y-3">
            {items.map((a) => (
              <li key={a.id}>
                <Link
                  href={`/dashboard/assignments/${a.id}`}
                  className="flex items-start justify-between gap-4 rounded-2xl border p-4 transition-shadow hover:shadow-card"
                  style={{ borderColor: 'var(--line)' }}
                >
                  <div className="min-w-0">
                    <h2 className="line-clamp-2 text-[16px] font-semibold">{a.title}</h2>
                    <p className="mt-1 text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
                      by {a.authorName} · sent {new Date(a.createdAt).toLocaleString()}
                      {a.dueAt ? ` · due ${new Date(a.dueAt).toLocaleString()}` : ''}
                    </p>
                    {a.instructions ? (
                      <p
                        className="mt-2 line-clamp-2 text-[13.5px] leading-relaxed"
                        style={{ color: 'var(--ink-soft)' }}
                      >
                        {a.instructions}
                      </p>
                    ) : null}
                  </div>
                  <span
                    className="mt-0.5 inline-flex shrink-0 items-center gap-1 text-[12.5px] font-semibold"
                    style={{ color: 'var(--green-deep)' }}
                  >
                    Open <ArrowRight size={13} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <nav className="mt-6 flex items-center justify-between">
            <Link
              href={page > 1 ? `/dashboard/assignments?page=${page - 1}` : '#'}
              aria-disabled={page <= 1}
              className="border px-3 py-2 text-[13px] font-semibold disabled:pointer-events-none"
              style={{
                borderColor: 'var(--line)',
                color: page > 1 ? 'var(--ink)' : 'var(--ink-soft)',
                pointerEvents: page > 1 ? 'auto' : 'none',
                opacity: page > 1 ? 1 : 0.5,
              }}
            >
              Previous
            </Link>
            <span className="font-mono text-[11px] uppercase tracking-[0.12em]" style={{ color: 'var(--ink-soft)' }}>
              Page {page}
            </span>
            <Link
              href={hasNext ? `/dashboard/assignments?page=${page + 1}` : '#'}
              aria-disabled={!hasNext}
              className="border px-3 py-2 text-[13px] font-semibold disabled:pointer-events-none"
              style={{
                borderColor: 'var(--line)',
                color: hasNext ? 'var(--ink)' : 'var(--ink-soft)',
                pointerEvents: hasNext ? 'auto' : 'none',
                opacity: hasNext ? 1 : 0.5,
              }}
            >
              Next
            </Link>
          </nav>
        </>
      )}
    </div>
  );
}
