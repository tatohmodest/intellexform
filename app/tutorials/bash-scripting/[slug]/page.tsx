import { notFound } from 'next/navigation';
import TutorialLessonView from '@/components/tutorials/TutorialLessonView';
import {
  getAllBashScriptingLessons,
  getBashScriptingLessonNav,
  bashScriptingTutorial,
} from '@/lib/tutorials/bash-scripting';

export function generateStaticParams() {
  return getAllBashScriptingLessons().map((lesson) => ({ slug: lesson.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const nav = getBashScriptingLessonNav(params.slug);
  if (!nav) return { title: 'Lesson not found - Intellex' };
  return {
    title: `${nav.lesson.title} - Bash Scripting Tutorial | Intellex`,
    description: nav.lesson.description,
  };
}

export default function LessonPage({ params }: { params: { slug: string } }) {
  const nav = getBashScriptingLessonNav(params.slug);
  if (!nav) notFound();
  return (
    <TutorialLessonView
      course={bashScriptingTutorial}
      lesson={nav.lesson}
      prev={nav.prev}
      next={nav.next}
      index={nav.index}
    />
  );
}
