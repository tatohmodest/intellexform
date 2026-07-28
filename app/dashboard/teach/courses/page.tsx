import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import { getMentorProfile, getMembership } from '@/lib/learn/ecosystem';
import { getLearner } from '@/lib/learn/repo';
import CourseStudio from '@/components/dashboard/CourseStudio';

export const dynamic = 'force-dynamic';

export default async function TeachingCourseStudioPage({
  searchParams,
}: {
  searchParams?: { campus?: string };
}) {
  const session = getSessionUser();
  if (!session) redirect('/login?next=/dashboard/teach/courses');

  const campus = searchParams?.campus || null;
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
      affiliation?.role === 'instructor' ||
      affiliation?.role === 'admin' ||
      affiliation?.role === 'owner');

  if (campus && !isCampusStaff && !profile) {
    redirect(`/dashboard/institutions/${campus}`);
  }
  if (!campus && !profile) {
    redirect('/dashboard/mentor');
  }

  const campusName =
    affiliation?.institutionName || (campus ? campus.replace(/-/g, ' ') : undefined);

  return (
    <div className="mx-auto max-w-[1100px]">
      <Link
        href={campus ? `/dashboard/institutions/${campus}?tab=courses` : '/dashboard/mentor'}
        className="mb-6 inline-flex items-center gap-1.5 text-[13px] font-semibold"
        style={{ color: 'var(--ink-soft)' }}
      >
        <ArrowLeft size={14} /> {campus ? 'Back to campus' : 'Back to Mentor Studio'}
      </Link>
      <CourseStudio
        institutionSlug={campus}
        campusName={campusName}
        accent={campus ? '#1f5fa8' : '#00b369'}
        canAllocateInstructor={membership === 'owner'}
      />
    </div>
  );
}
