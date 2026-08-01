import { redirect, notFound } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/getUser';
import {
  canStudentAccessAssessment,
  getAssessment,
  getSubmission,
  publicAssessment,
} from '@/lib/learn/assessments';
import AssignmentSubmitClient from '@/components/dashboard/AssignmentSubmitClient';

export const dynamic = 'force-dynamic';

export default async function AssignmentPage({ params }: { params: { id: string } }) {
  const session = getSessionUser();
  if (!session) redirect(`/login?next=/dashboard/assignments/${params.id}`);

  const assessment = await getAssessment(params.id);
  if (!assessment || assessment.kind !== 'assignment' || !assessment.published) notFound();

  const canAccess = await canStudentAccessAssessment(assessment, session.uid);
  if (!canAccess) notFound();

  const submission = await getSubmission(params.id, session.uid);

  return (
    <div className="px-4 py-8">
      <AssignmentSubmitClient
        assessment={publicAssessment(assessment)}
        initial={submission}
      />
    </div>
  );
}
