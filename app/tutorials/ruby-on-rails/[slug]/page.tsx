import { getTutorial, getTutorialLessons, getTutorialLessonNav } from '@/lib/tutorials';
import GatedTutorialLesson from '@/components/tutorials/GatedTutorialLesson';

const COURSE_SLUG = 'ruby-on-rails';

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return getTutorialLessons(COURSE_SLUG).map((lesson) => ({ slug: lesson.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const course = getTutorial(COURSE_SLUG);
  const nav = getTutorialLessonNav(COURSE_SLUG, params.slug);
  if (!nav || !course) return { title: 'Lesson not found - Intellex' };
  return {
    title: `${nav.lesson.title} - ${course.shortTitle} Tutorial | Intellex`,
    description: nav.lesson.description,
  };
}

export default function TutorialLessonRoute({ params }: { params: { slug: string } }) {
  return <GatedTutorialLesson courseSlug={COURSE_SLUG} lessonSlug={params.slug} />;
}
