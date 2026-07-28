import { notFound, redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/getUser';
import { getMyCourseSections } from '@/lib/learn/myCourses';
import CoursesSectionGrid from '@/components/dashboard/CoursesSectionGrid';

export const dynamic = 'force-dynamic';

export default async function CourseSectionBrowsePage({
  params,
}: {
  params: { sectionId: string };
}) {
  const session = getSessionUser();
  if (!session) {
    redirect(`/login?next=/dashboard/courses/browse/${params.sectionId}`);
  }

  let section: Awaited<ReturnType<typeof getMyCourseSections>>['sections'][number] | undefined;

  try {
    const data = await getMyCourseSections(session.uid);
    section = data.sections.find((s) => s.id === params.sectionId);
  } catch (err) {
    console.error('getMyCourseSections (browse) failed:', err);
  }

  if (!section) notFound();

  return (
    <div className="mx-auto max-w-[1080px] overflow-x-hidden">
      <CoursesSectionGrid section={section} />
    </div>
  );
}
