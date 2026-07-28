import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import { getMentorProfile, getMembership } from '@/lib/learn/ecosystem';
import { getLearner } from '@/lib/learn/repo';
import AssessmentStudio from '@/components/dashboard/AssessmentStudio';

export const dynamic = 'force-dynamic';

export default async function TeachAssessmentsPage({
  searchParams,
}: {
  searchParams?: { campus?: string; courseId?: string; kind?: string };
}) {
  const session = getSessionUser();
  if (!session) redirect('/login?next=/dashboard/teach/assessments');

  const campus = searchParams?.campus || null;
  const courseId =
    typeof searchParams?.courseId === 'string' && searchParams.courseId.trim()
      ? searchParams.courseId.trim()
      : null;
  const kindRaw = (searchParams?.kind || '').toLowerCase();
  const initialKind =
    kindRaw === 'exam' || kindRaw === 'assignment'
      ? (kindRaw as 'exam' | 'assignment')
      : null;

  const [profile, learner, membership] = await Promise.all([
    getMentorProfile(session.uid),
    getLearner(session.uid),
    campus ? getMembership(campus, session.uid) : Promise.resolve(null),
  ]);

  const affiliation = campus
    ? (learner?.affiliations || []).find((a) => a.institutionSlug === campus)
    : null;

  const isCampusStaff =
    Boolean(campus) &&
    (membership === 'owner' ||
      ['instructor', 'admin', 'owner'].includes(affiliation?.role || ''));

  if (campus && !isCampusStaff && !profile) {
    redirect(`/dashboard/institutions/${campus}`);
  }
  if (!campus && !profile) {
    redirect('/dashboard/mentor');
  }

  const backHref = campus
    ? `/dashboard/institutions/${campus}?tab=assignments`
    : courseId
      ? '/dashboard/students'
      : '/dashboard/mentor';

  return (
    <div className="mx-auto max-w-[1100px]">
      <Link
        href={backHref}
        className="mb-6 inline-flex items-center gap-1.5 text-[13px] font-semibold"
        style={{ color: 'var(--ink-soft)' }}
      >
        <ArrowLeft size={14} /> {courseId && !campus ? 'My Students' : 'Back'}
      </Link>
      <AssessmentStudio
        institutionSlug={campus}
        campusName={affiliation?.institutionName}
        accent={campus ? '#1f5fa8' : '#00b369'}
        initialCourseId={courseId}
        initialKind={initialKind}
      />
    </div>
  );
}
