import { notFound } from 'next/navigation';
import TutorialLessonView from '@/components/tutorials/TutorialLessonView';
import {
  getAllNodejsExpressLessons,
  getNodejsExpressLessonNav,
  nodejsExpressTutorial,
} from '@/lib/tutorials/nodejs-express';

export function generateStaticParams() {
  return getAllNodejsExpressLessons().map((lesson) => ({ slug: lesson.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const nav = getNodejsExpressLessonNav(params.slug);
  if (!nav) return { title: 'Lesson not found - Intellex' };
  return {
    title: `${nav.lesson.title} - Node.js & Express Tutorial | Intellex`,
    description: nav.lesson.description,
  };
}

export default function NodejsExpressLessonPage({ params }: { params: { slug: string } }) {
  const nav = getNodejsExpressLessonNav(params.slug);
  if (!nav) notFound();

  return (
    <TutorialLessonView
      course={nodejsExpressTutorial}
      lesson={nav.lesson}
      prev={nav.prev}
      next={nav.next}
      index={nav.index}
    />
  );
}
