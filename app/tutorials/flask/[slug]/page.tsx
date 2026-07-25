import { notFound } from 'next/navigation';
import TutorialLessonView from '@/components/tutorials/TutorialLessonView';
import {
  getAllFlaskLessons,
  getFlaskLessonNav,
  flaskTutorial,
} from '@/lib/tutorials/flask';

export function generateStaticParams() {
  return getAllFlaskLessons().map((lesson) => ({ slug: lesson.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const nav = getFlaskLessonNav(params.slug);
  if (!nav) return { title: 'Lesson not found — Intellex' };
  return {
    title: `${nav.lesson.title} — Flask Tutorial | Intellex`,
    description: nav.lesson.description,
  };
}

export default function FlaskLessonPage({ params }: { params: { slug: string } }) {
  const nav = getFlaskLessonNav(params.slug);
  if (!nav) notFound();

  return (
    <TutorialLessonView
      course={flaskTutorial}
      lesson={nav.lesson}
      prev={nav.prev}
      next={nav.next}
      index={nav.index}
    />
  );
}
