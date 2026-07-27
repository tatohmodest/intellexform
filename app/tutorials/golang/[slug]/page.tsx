import { notFound } from 'next/navigation';
import TutorialLessonView from '@/components/tutorials/TutorialLessonView';
import {
  getAllGolangLessons,
  getGolangLessonNav,
  golangTutorial,
} from '@/lib/tutorials/golang';

export function generateStaticParams() {
  return getAllGolangLessons().map((lesson) => ({ slug: lesson.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const nav = getGolangLessonNav(params.slug);
  if (!nav) return { title: 'Lesson not found - Intellex' };
  return {
    title: `${nav.lesson.title} - Go Tutorial | Intellex`,
    description: nav.lesson.description,
  };
}

export default function GolangLessonPage({ params }: { params: { slug: string } }) {
  const nav = getGolangLessonNav(params.slug);
  if (!nav) notFound();

  return (
    <TutorialLessonView
      course={golangTutorial}
      lesson={nav.lesson}
      prev={nav.prev}
      next={nav.next}
      index={nav.index}
    />
  );
}
