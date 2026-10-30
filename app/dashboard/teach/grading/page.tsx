import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/getUser';
import { getRoles } from '@/lib/learn/ecosystem';
import {
  getInstructorMonitoringSummary,
  listPendingGradeQueue,
} from '@/lib/learn/studentMonitoring';
import RapidGradePanel from '@/components/dashboard/RapidGradePanel';
import PageHeader from '@/components/dashboard/PageHeader';

export const dynamic = 'force-dynamic';

export default async function GradingCenterPage() {
  const session = getSessionUser();
  if (!session) redirect('/login?next=/dashboard/teach/grading');

  const roles = await getRoles(session.uid);
  if (!roles.includes('mentor') && !roles.includes('admin')) {
    redirect('/dashboard/mentor');
  }

  const [summary, queue] = await Promise.all([
    getInstructorMonitoringSummary(session.uid),
    listPendingGradeQueue(session.uid),
  ]);

  return (
    <div className="mx-auto max-w-[960px]">
      <PageHeader
        title="Grading"
        description={`${summary.pendingSubmissionCount} awaiting feedback`}
        actions={
          <>
            <Link href="/dashboard/teach" className="chip">
              Teaching
            </Link>
            <Link href="/dashboard/teach/monitoring" className="chip">
              Monitoring
            </Link>
            <Link href="/dashboard/teach/assessments" className="chip">
              Assessments
            </Link>
          </>
        }
      />

      <section className="mb-10">
        <h2 className="mb-3 font-display text-[22px]">Rapid grade</h2>
        <RapidGradePanel initialQueue={queue} />
      </section>

      <h2 className="mb-3 font-display text-[22px]">By assignment</h2>
      {summary.needsGrading.length === 0 ? (
        <div className="border border-dashed p-10 text-center" style={{ borderColor: 'var(--line)' }}>
          <p className="font-display text-[20px]">You&apos;re caught up</p>
          <p className="mt-1 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
            No submitted assignments waiting for a grade.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {summary.needsGrading.map((g) => (
            <li key={g.assessmentId}>
              <Link
                href={`/dashboard/teach/assessments?assessment=${g.assessmentId}`}
                className="flex flex-wrap items-center justify-between gap-3 card p-4"
              >
                <div>
                  <p className="font-semibold">{g.title}</p>
                  <p className="text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
                    {g.kind}
                  </p>
                </div>
                <span
                  className="px-3 py-2 text-[13px] font-semibold text-white"
                  style={{ background: 'var(--ink)' }}
                >
                  Grade {g.pendingCount}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
