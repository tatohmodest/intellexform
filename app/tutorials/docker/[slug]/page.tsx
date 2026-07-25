import { notFound } from 'next/navigation';
import TutorialLessonView from '@/components/tutorials/TutorialLessonView';
import {
  getAllDockerLessons,
  getDockerLessonNav,
  dockerTutorial,
} from '@/lib/tutorials/docker';

export function generateStaticParams() {
  return getAllDockerLessons().map((lesson) => ({ slug: lesson.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const nav = getDockerLessonNav(params.slug);
  if (!nav) return { title: 'Lesson not found — Intellex' };
  return {
    title: `${nav.lesson.title} — Docker Tutorial | Intellex`,
    description: nav.lesson.description,
  };
}

export default function DockerLessonPage({ params }: { params: { slug: string } }) {
  const nav = getDockerLessonNav(params.slug);
  if (!nav) notFound();

  return (
    <TutorialLessonView
      course={dockerTutorial}
      lesson={nav.lesson}
      prev={nav.prev}
      next={nav.next}
      index={nav.index}
    />
  );
}
