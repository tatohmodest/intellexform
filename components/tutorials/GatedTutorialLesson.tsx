import { notFound, redirect } from 'next/navigation';
import TutorialLessonView from '@/components/tutorials/TutorialLessonView';
import ContentPaywall from '@/components/content/ContentPaywall';
import { getTutorial, getTutorialLessonNav } from '@/lib/tutorials';
import { getSessionUser } from '@/lib/auth/getUser';
import { canAccessContent, getContentAccess, type LessonLevel } from '@/lib/contentAccess';

export const dynamic = 'force-dynamic';

/** Shared gated renderer for every /tutorials/[track]/[slug] lesson. */
export default async function GatedTutorialLesson({
  courseSlug,
  lessonSlug,
}: {
  courseSlug: string;
  lessonSlug: string;
}) {
  const course = getTutorial(courseSlug);
  const nav = getTutorialLessonNav(courseSlug, lessonSlug);
  if (!course || !nav) notFound();

  const session = getSessionUser();
  const access = await getContentAccess('tutorial', courseSlug, course.title);
  const level = nav.lesson.level as LessonLevel;
  const gate = await canAccessContent({
    userId: session?.uid ?? null,
    kind: 'tutorial',
    slug: courseSlug,
    level,
    config: access,
  });

  if (!gate.allowed) {
    if (gate.reason === 'login_required') {
      redirect(`/login?next=/tutorials/${courseSlug}/${lessonSlug}`);
    }
    return (
      <ContentPaywall
        title={course.title}
        shortTitle={course.shortTitle}
        config={access}
        level={level}
        returnPath={`/tutorials/${courseSlug}/${lessonSlug}`}
        kind="tutorial"
        slug={courseSlug}
      />
    );
  }

  return (
    <TutorialLessonView
      course={course}
      lesson={nav.lesson}
      prev={nav.prev}
      next={nav.next}
      index={nav.index}
    />
  );
}
