import { notFound } from 'next/navigation';
import TutorialLessonView from '@/components/tutorials/TutorialLessonView';
import {
  getAllPygameLessons,
  getPygameLessonNav,
  pygameTutorial,
} from '@/lib/tutorials/pygame';

export function generateStaticParams() {
  return getAllPygameLessons().map((lesson) => ({ slug: lesson.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const nav = getPygameLessonNav(params.slug);
  if (!nav) return { title: 'Lesson not found - Intellex' };
  return {
    title: `${nav.lesson.title} - Pygame Tutorial | Intellex`,
    description: nav.lesson.description,
  };
}

export default function PygameLessonPage({ params }: { params: { slug: string } }) {
  const nav = getPygameLessonNav(params.slug);
  if (!nav) notFound();

  return (
    <TutorialLessonView
      course={pygameTutorial}
      lesson={nav.lesson}
      prev={nav.prev}
      next={nav.next}
      index={nav.index}
    />
  );
}
