import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import { getAssessment, getSubmission, publicAssessment } from '@/lib/learn/assessments';
import ExamPlayer from '@/components/dashboard/ExamPlayer';

export const dynamic = 'force-dynamic';

export default async function TakeExamPage({ params }: { params: { id: string } }) {
  const session = getSessionUser();
  if (!session) redirect(`/login?next=/dashboard/exams/${params.id}`);

  const assessment = await getAssessment(params.id);
  if (!assessment || assessment.kind !== 'exam' || !assessment.published) notFound();

  const existing = await getSubmission(params.id, session.uid);
  if (
    existing &&
    (existing.status === 'submitted' ||
      existing.status === 'graded' ||
      existing.status === 'terminated')
  ) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <h1 className="font-display text-[28px]">Attempt already closed</h1>
        <p className="mt-2 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
          Status: {existing.status}
          {typeof existing.score === 'number'
            ? ` · Score ${existing.score}/${existing.maxScore ?? '—'}`
            : ''}
        </p>
        {existing.terminatedReason && (
          <p className="mt-2 text-[13px]" style={{ color: '#b91c1c' }}>
            Reason: {existing.terminatedReason}
          </p>
        )}
        <Link href="/dashboard" className="mt-6 inline-block text-[13px] font-semibold" style={{ color: 'var(--green-deep)' }}>
          ← Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[900px] px-4 py-8">
      <Link href="/dashboard" className="mb-6 inline-flex items-center gap-1 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
        <ArrowLeft size={14} /> Leave only if you have not started
      </Link>
      <ExamPlayer assessment={publicAssessment(assessment)} />
    </div>
  );
}
