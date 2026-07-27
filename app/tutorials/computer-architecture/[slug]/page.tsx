import { notFound } from 'next/navigation';
import TutorialLessonView from '@/components/tutorials/TutorialLessonView';
import {
  getAllComputerArchitectureLessons,
  getComputerArchitectureLessonNav,
  computerArchitectureTutorial,
} from '@/lib/tutorials/computer-architecture';

export function generateStaticParams() {
  return getAllComputerArchitectureLessons().map((lesson) => ({ slug: lesson.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const nav = getComputerArchitectureLessonNav(params.slug);
  if (!nav) return { title: 'Lesson not found — Intellex' };
  return {
    title: `${nav.lesson.title} — Computer Architecture Tutorial | Intellex`,
    description: nav.lesson.description,
  };
}

export default function ComputerArchitectureLessonPage({
  params,
}: {
  params: { slug: string };
}) {
  const nav = getComputerArchitectureLessonNav(params.slug);
  if (!nav) notFound();

  return (
    <TutorialLessonView
      course={computerArchitectureTutorial}
      lesson={nav.lesson}
      prev={nav.prev}
      next={nav.next}
      index={nav.index}
    />
  );
}
