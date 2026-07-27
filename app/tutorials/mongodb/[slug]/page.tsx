import { notFound } from 'next/navigation';
import TutorialLessonView from '@/components/tutorials/TutorialLessonView';
import {
  getAllMongodbLessons,
  getMongodbLessonNav,
  mongodbTutorial,
} from '@/lib/tutorials/mongodb';

export function generateStaticParams() {
  return getAllMongodbLessons().map((lesson) => ({ slug: lesson.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const nav = getMongodbLessonNav(params.slug);
  if (!nav) return { title: 'Lesson not found - Intellex' };
  return {
    title: `${nav.lesson.title} - MongoDB Tutorial | Intellex`,
    description: nav.lesson.description,
  };
}

export default function MongodbLessonPage({ params }: { params: { slug: string } }) {
  const nav = getMongodbLessonNav(params.slug);
  if (!nav) notFound();

  return (
    <TutorialLessonView
      course={mongodbTutorial}
      lesson={nav.lesson}
      prev={nav.prev}
      next={nav.next}
      index={nav.index}
    />
  );
}
