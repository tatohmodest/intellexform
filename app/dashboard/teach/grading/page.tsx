import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ClipboardCheck } from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import { getRoles } from '@/lib/learn/ecosystem';
import { getInstructorMonitoringSummary } from '@/lib/learn/studentMonitoring';

export const dynamic = 'force-dynamic';

export default async function GradingCenterPage() {
  const session = getSessionUser();
  if (!session) redirect('/login?next=/dashboard/teach/grading');

  const roles = await getRoles(session.uid);
  if (!roles.includes('mentor') && !roles.includes('admin')) {
    redirect('/dashboard/mentor');
  }

  const summary = await getInstructorMonitoringSummary(session.uid);

  return (
    <div className="mx-auto max-w-[960px]">
      <header className="mb-8 border-b pb-6" style={{ borderColor: 'var(--line)' }}>
        <div className="tab mb-2 inline-flex items-center gap-1.5">
          <ClipboardCheck size={11} /> Grading
        </div>
        <h1 className="font-display text-[30px] leading-tight">Grading center</h1>
        <p className="mt-2 text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
          {summary.pendingSubmissionCount} submission
          {summary.pendingSubmissionCount === 1 ? '' : 's'} awaiting feedback across{' '}
          {summary.needsGrading.length} assignment
          {summary.needsGrading.length === 1 ? '' : 's'}.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-[13px] font-semibold">
          <Link href="/dashboard/teach" style={{ color: 'var(--green-deep)' }}>
            Teaching home →
          </Link>
          <Link href="/dashboard/teach/monitoring" style={{ color: 'var(--ink-soft)' }}>
            Student monitoring
          </Link>
          <Link href="/dashboard/teach/assessments" style={{ color: 'var(--ink-soft)' }}>
            Assessment studio
          </Link>
        </div>
      </header>

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
                className="flex flex-wrap items-center justify-between gap-3 border p-4"
                style={{ borderColor: 'var(--line)' }}
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
