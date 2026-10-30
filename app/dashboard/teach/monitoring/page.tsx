import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/getUser';
import { getRoles } from '@/lib/learn/ecosystem';
import { listStudentsNeedingAttention } from '@/lib/learn/studentMonitoring';
import MessageStudentButton from '@/components/dashboard/MessageStudentButton';
import PageHeader from '@/components/dashboard/PageHeader';

export const dynamic = 'force-dynamic';

export default async function StudentMonitoringPage() {
  const session = getSessionUser();
  if (!session) redirect('/login?next=/dashboard/teach/monitoring');

  const roles = await getRoles(session.uid);
  if (!roles.includes('mentor') && !roles.includes('admin')) {
    redirect('/dashboard/mentor');
  }

  const atRisk = await listStudentsNeedingAttention(session.uid);

  return (
    <div className="mx-auto max-w-[960px]">
      <PageHeader
        title="Student monitoring"
        actions={
          <>
            <Link href="/dashboard/teach/grading" className="chip">
              Grading
            </Link>
            <Link href="/dashboard/students" className="chip">
              Roster
            </Link>
          </>
        }
      />

      {atRisk.length === 0 ? (
        <div className="border border-dashed p-10 text-center" style={{ borderColor: 'var(--line)' }}>
          <p className="font-display text-[20px]">No students flagged</p>
          <p className="mt-1 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
            Everyone with recent activity looks on track.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {atRisk.map((r) => (
            <li
              key={`${r.courseId}-${r.studentId}`}
              className="border p-4"
              style={{
                borderColor:
                  r.risk === 'high'
                    ? 'rgba(185,28,28,0.55)'
                    : r.risk === 'medium'
                      ? 'rgba(185,28,28,0.35)'
                      : 'var(--line)',
              }}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{r.studentName}</p>
                    <span
                      className="font-mono text-[10px] uppercase tracking-wide"
                      style={{
                        color:
                          r.risk === 'high'
                            ? '#b91c1c'
                            : r.risk === 'medium'
                              ? '#c2410c'
                              : 'var(--ink-soft)',
                      }}
                    >
                      {r.risk} risk
                    </span>
                  </div>
                  <p className="text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
                    {r.courseTitle}
                    {r.studentEmail ? ` · ${r.studentEmail}` : ''}
                    {r.progressPct != null ? ` · ${r.progressPct}% progress` : ''}
                  </p>
                  <ul className="mt-2 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                    {r.reasons.map((reason) => (
                      <li key={reason}>⚠ {reason}</li>
                    ))}
                  </ul>
                </div>
                <MessageStudentButton
                  studentId={r.studentId}
                  studentName={r.studentName}
                  courseTitle={r.courseTitle}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
