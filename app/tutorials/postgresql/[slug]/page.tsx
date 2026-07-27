import { notFound } from 'next/navigation';
import TutorialLessonView from '@/components/tutorials/TutorialLessonView';
import {
  getAllPostgresqlLessons,
  getPostgresqlLessonNav,
  postgresqlTutorial,
} from '@/lib/tutorials/postgresql';

export function generateStaticParams() {
  return getAllPostgresqlLessons().map((lesson) => ({ slug: lesson.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const nav = getPostgresqlLessonNav(params.slug);
  if (!nav) return { title: 'Lesson not found - Intellex' };
  return {
    title: `${nav.lesson.title} - PostgreSQL Tutorial | Intellex`,
    description: nav.lesson.description,
  };
}

export default function PostgresqlLessonPage({ params }: { params: { slug: string } }) {
  const nav = getPostgresqlLessonNav(params.slug);
  if (!nav) notFound();

  return (
    <TutorialLessonView
      course={postgresqlTutorial}
      lesson={nav.lesson}
      prev={nav.prev}
      next={nav.next}
      index={nav.index}
    />
  );
}
