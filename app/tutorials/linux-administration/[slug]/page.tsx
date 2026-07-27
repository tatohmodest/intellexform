import { notFound } from 'next/navigation';
import TutorialLessonView from '@/components/tutorials/TutorialLessonView';
import {
  getAllLinuxAdministrationLessons,
  getLinuxAdministrationLessonNav,
  linuxAdministrationTutorial,
} from '@/lib/tutorials/linux-administration';

export function generateStaticParams() {
  return getAllLinuxAdministrationLessons().map((lesson) => ({ slug: lesson.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const nav = getLinuxAdministrationLessonNav(params.slug);
  if (!nav) return { title: 'Lesson not found - Intellex' };
  return {
    title: `${nav.lesson.title} - Linux Administration Tutorial | Intellex`,
    description: nav.lesson.description,
  };
}

export default function LessonPage({ params }: { params: { slug: string } }) {
  const nav = getLinuxAdministrationLessonNav(params.slug);
  if (!nav) notFound();
  return (
    <TutorialLessonView
      course={linuxAdministrationTutorial}
      lesson={nav.lesson}
      prev={nav.prev}
      next={nav.next}
      index={nav.index}
    />
  );
}
