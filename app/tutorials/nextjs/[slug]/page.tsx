import { notFound } from 'next/navigation';
import TutorialLessonView from '@/components/tutorials/TutorialLessonView';
import {
  getAllNextLessons,
  getNextLessonNav,
  nextjsTutorial,
} from '@/lib/tutorials/nextjs';

export function generateStaticParams() {
  return getAllNextLessons().map((lesson) => ({ slug: lesson.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const nav = getNextLessonNav(params.slug);
  if (!nav) return { title: 'Lesson not found — Intellex' };
  return {
    title: `${nav.lesson.title} — Next.js Tutorial | Intellex`,
    description: nav.lesson.description,
  };
}

export default function NextjsLessonPage({ params }: { params: { slug: string } }) {
  const nav = getNextLessonNav(params.slug);
  if (!nav) notFound();

  return (
    <TutorialLessonView
      course={nextjsTutorial}
      lesson={nav.lesson}
      prev={nav.prev}
      next={nav.next}
      index={nav.index}
    />
  );
}
