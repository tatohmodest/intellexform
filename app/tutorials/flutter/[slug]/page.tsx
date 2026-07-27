import { notFound } from 'next/navigation';
import TutorialLessonView from '@/components/tutorials/TutorialLessonView';
import {
  getAllFlutterLessons,
  getFlutterLessonNav,
  flutterTutorial,
} from '@/lib/tutorials/flutter';

export function generateStaticParams() {
  return getAllFlutterLessons().map((lesson) => ({ slug: lesson.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const nav = getFlutterLessonNav(params.slug);
  if (!nav) return { title: 'Lesson not found - Intellex' };
  return {
    title: `${nav.lesson.title} - Flutter Tutorial | Intellex`,
    description: nav.lesson.description,
  };
}

export default function FlutterLessonPage({ params }: { params: { slug: string } }) {
  const nav = getFlutterLessonNav(params.slug);
  if (!nav) notFound();

  return (
    <TutorialLessonView
      course={flutterTutorial}
      lesson={nav.lesson}
      prev={nav.prev}
      next={nav.next}
      index={nav.index}
    />
  );
}
