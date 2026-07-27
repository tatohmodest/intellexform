import { notFound } from 'next/navigation';
import TutorialLessonView from '@/components/tutorials/TutorialLessonView';
import {
  getAllRustLessons,
  getRustLessonNav,
  rustTutorial,
} from '@/lib/tutorials/rust';

export function generateStaticParams() {
  return getAllRustLessons().map((lesson) => ({ slug: lesson.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const nav = getRustLessonNav(params.slug);
  if (!nav) return { title: 'Lesson not found — Intellex' };
  return {
    title: `${nav.lesson.title} — Rust Tutorial | Intellex`,
    description: nav.lesson.description,
  };
}

export default function LessonPage({ params }: { params: { slug: string } }) {
  const nav = getRustLessonNav(params.slug);
  if (!nav) notFound();
  return (
    <TutorialLessonView
      course={rustTutorial}
      lesson={nav.lesson}
      prev={nav.prev}
      next={nav.next}
      index={nav.index}
    />
  );
}
