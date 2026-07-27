import { notFound } from 'next/navigation';
import TutorialLessonView from '@/components/tutorials/TutorialLessonView';
import {
  getAllArduinoLessons,
  getArduinoLessonNav,
  arduinoTutorial,
} from '@/lib/tutorials/arduino';

export function generateStaticParams() {
  return getAllArduinoLessons().map((lesson) => ({ slug: lesson.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const nav = getArduinoLessonNav(params.slug);
  if (!nav) return { title: 'Lesson not found - Intellex' };
  return {
    title: `${nav.lesson.title} - Arduino Tutorial | Intellex`,
    description: nav.lesson.description,
  };
}

export default function LessonPage({ params }: { params: { slug: string } }) {
  const nav = getArduinoLessonNav(params.slug);
  if (!nav) notFound();
  return (
    <TutorialLessonView
      course={arduinoTutorial}
      lesson={nav.lesson}
      prev={nav.prev}
      next={nav.next}
      index={nav.index}
    />
  );
}
