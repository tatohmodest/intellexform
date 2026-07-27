import { notFound } from 'next/navigation';
import TutorialLessonView from '@/components/tutorials/TutorialLessonView';
import {
  getAllJsLessons,
  getJsLessonNav,
  javascriptTutorial,
} from '@/lib/tutorials/javascript';

export function generateStaticParams() {
  return getAllJsLessons().map((lesson) => ({ slug: lesson.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const nav = getJsLessonNav(params.slug);
  if (!nav) return { title: 'Lesson not found - Intellex' };
  return {
    title: `${nav.lesson.title} - JavaScript Tutorial | Intellex`,
    description: nav.lesson.description,
  };
}

export default function JavaScriptLessonPage({ params }: { params: { slug: string } }) {
  const nav = getJsLessonNav(params.slug);
  if (!nav) notFound();

  return (
    <TutorialLessonView
      course={javascriptTutorial}
      lesson={nav.lesson}
      prev={nav.prev}
      next={nav.next}
      index={nav.index}
    />
  );
}
