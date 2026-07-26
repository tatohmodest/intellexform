import { notFound } from 'next/navigation';
import TutorialLessonView from '@/components/tutorials/TutorialLessonView';
import {
  getAllHtmlLessons,
  getHtmlLessonNav,
  htmlTutorial,
} from '@/lib/tutorials/html';

export function generateStaticParams() {
  return getAllHtmlLessons().map((lesson) => ({ slug: lesson.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const nav = getHtmlLessonNav(params.slug);
  if (!nav) return { title: 'Lesson not found - Intellex' };
  return {
    title: `${nav.lesson.title} - HTML Tutorial | Intellex`,
    description: nav.lesson.description,
  };
}

export default function HtmlLessonPage({ params }: { params: { slug: string } }) {
  const nav = getHtmlLessonNav(params.slug);
  if (!nav) notFound();

  return (
    <TutorialLessonView
      course={htmlTutorial}
      lesson={nav.lesson}
      prev={nav.prev}
      next={nav.next}
      index={nav.index}
    />
  );
}
