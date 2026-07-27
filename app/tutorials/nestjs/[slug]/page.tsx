import { notFound } from 'next/navigation';
import TutorialLessonView from '@/components/tutorials/TutorialLessonView';
import {
  getAllNestjsLessons,
  getNestjsLessonNav,
  nestjsTutorial,
} from '@/lib/tutorials/nestjs';

export function generateStaticParams() {
  return getAllNestjsLessons().map((lesson) => ({ slug: lesson.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const nav = getNestjsLessonNav(params.slug);
  if (!nav) return { title: 'Lesson not found - Intellex' };
  return {
    title: `${nav.lesson.title} - NestJS Tutorial | Intellex`,
    description: nav.lesson.description,
  };
}

export default function NestjsLessonPage({ params }: { params: { slug: string } }) {
  const nav = getNestjsLessonNav(params.slug);
  if (!nav) notFound();

  return (
    <TutorialLessonView
      course={nestjsTutorial}
      lesson={nav.lesson}
      prev={nav.prev}
      next={nav.next}
      index={nav.index}
    />
  );
}
