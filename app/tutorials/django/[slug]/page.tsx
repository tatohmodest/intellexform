import { notFound } from 'next/navigation';
import TutorialLessonView from '@/components/tutorials/TutorialLessonView';
import {
  getAllDjangoLessons,
  getDjangoLessonNav,
  djangoTutorial,
} from '@/lib/tutorials/django';

export function generateStaticParams() {
  return getAllDjangoLessons().map((lesson) => ({ slug: lesson.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const nav = getDjangoLessonNav(params.slug);
  if (!nav) return { title: 'Lesson not found — Intellex' };
  return {
    title: `${nav.lesson.title} — Django Tutorial | Intellex`,
    description: nav.lesson.description,
  };
}

export default function DjangoLessonPage({ params }: { params: { slug: string } }) {
  const nav = getDjangoLessonNav(params.slug);
  if (!nav) notFound();

  return (
    <TutorialLessonView
      course={djangoTutorial}
      lesson={nav.lesson}
      prev={nav.prev}
      next={nav.next}
      index={nav.index}
    />
  );
}
