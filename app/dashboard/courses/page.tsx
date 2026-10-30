import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/getUser';
import { getMyCourseSections } from '@/lib/learn/myCourses';
import { getLearner } from '@/lib/learn/repo';
import { interestLabels } from '@/lib/learn/interests';
import CoursesBrowser from '@/components/dashboard/CoursesBrowser';
import PageHeader from '@/components/dashboard/PageHeader';

export const dynamic = 'force-dynamic';

export default async function CoursesPage() {
  const session = getSessionUser();
  if (!session) redirect('/login?next=/dashboard/courses');

  const learner = await getLearner(session.uid);
  const interestText = interestLabels(learner?.preferences?.interests || []).join(' · ');

  let sections: Awaited<ReturnType<typeof getMyCourseSections>>['sections'] = [];
  let total = 0;
  let inProgress = 0;

  try {
    const data = await getMyCourseSections(session.uid);
    sections = data.sections;
    total = data.total;
    inProgress = data.inProgress;
  } catch (err) {
    console.error('getMyCourseSections failed:', err);
  }

  return (
    <div className="mx-auto max-w-[1080px] overflow-x-hidden">
      <PageHeader
        title="Courses"
        description={interestText ? `Picked for ${interestText}.` : null}
      >
        <div className="no-scrollbar -mx-4 mt-5 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          {[
            { href: '/dashboard/courses', label: 'All' },
            { href: '/dashboard/classroom', label: 'Live classes' },
            { href: '/dashboard/courses/browse/suggested-self-paced', label: 'Self-paced' },
            { href: '/dashboard/courses/browse/suggested-tutoring', label: 'Tutoring' },
            { href: '/dashboard/courses/browse/suggested-free', label: 'Free' },
          ].map((chip, i) => (
            <Link key={chip.href} href={chip.href} className={i === 0 ? 'chip chip-primary' : 'chip'}>
              {chip.label}
            </Link>
          ))}
        </div>
      </PageHeader>

      <CoursesBrowser sections={sections} total={total} inProgress={inProgress} />
    </div>
  );
}
