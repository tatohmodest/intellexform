import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import { getRoles } from '@/lib/learn/ecosystem';
import { listStudentsNeedingAttention } from '@/lib/learn/studentMonitoring';
import MessageStudentButton from '@/components/dashboard/MessageStudentButton';

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
      <header className="mb-8 border-b pb-6" style={{ borderColor: 'var(--line)' }}>
        <div className="tab mb-2 inline-flex items-center gap-1.5">
          <AlertTriangle size={11} /> Monitoring
        </div>
        <h1 className="font-display text-[30px] leading-tight">Student monitoring</h1>
        <p className="mt-2 max-w-[640px] text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
          Early signals for students who may need support — inactivity and missing engagement.
          Treat this as a coaching tool, not a judgment.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-[13px] font-semibold">
          <Link href="/dashboard/teach/grading" style={{ color: 'var(--green-deep)' }}>
            Grading center →
          </Link>
          <Link href="/dashboard/students" style={{ color: 'var(--ink-soft)' }}>
            Full roster
          </Link>
        </div>
      </header>

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
                borderColor: r.risk === 'medium' ? 'rgba(185,28,28,0.35)' : 'var(--line)',
              }}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{r.studentName}</p>
                  <p className="text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
                    {r.courseTitle}
                    {r.studentEmail ? ` · ${r.studentEmail}` : ''}
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
