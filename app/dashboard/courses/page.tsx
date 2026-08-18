import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/getUser';
import { getMyCourseSections } from '@/lib/learn/myCourses';
import { getLearner } from '@/lib/learn/repo';
import { interestLabels } from '@/lib/learn/interests';
import CoursesBrowser from '@/components/dashboard/CoursesBrowser';

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
      <header className="mb-2 border-b pb-8" style={{ borderColor: 'var(--line)' }}>
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: 'var(--ink-soft)' }}>
          Learning paths
        </p>
        <h1 className="font-display text-[40px] leading-[0.95] tracking-tight sm:text-[52px]">
          My
          <br />
          courses
        </h1>
        <p className="mt-4 max-w-[420px] text-[15px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
          Courses you are enrolled in come first.
          {interestText
            ? ` Recommended for you because you selected ${interestText}.`
            : ' Filter by live, self-paced, free, or tutoring.'}
        </p>
        <div className="mt-5 flex flex-wrap gap-2 text-[12.5px] font-semibold">
          {[
            { href: '/dashboard/courses', label: 'All' },
            { href: '/dashboard/classroom', label: 'Live classes' },
            { href: '/dashboard/courses/browse/suggested-self-paced', label: 'Self-paced' },
            { href: '/dashboard/courses/browse/suggested-tutoring', label: 'Tutoring / live' },
            { href: '/dashboard/courses/browse/suggested-free', label: 'Free' },
            { href: '/dashboard/calendar', label: 'Calendar' },
            { href: '/dashboard/todos', label: 'To-do' },
          ].map((chip) => (
            <Link
              key={chip.href + chip.label}
              href={chip.href}
              className="border px-3 py-1.5"
              style={{ borderColor: 'var(--line)' }}
            >
              {chip.label}
            </Link>
          ))}
        </div>
      </header>

      <CoursesBrowser sections={sections} total={total} inProgress={inProgress} />
    </div>
  );
}
