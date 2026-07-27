import { notFound } from 'next/navigation';
import TutorialLessonView from '@/components/tutorials/TutorialLessonView';
import {
  getAllRubyOnRailsLessons,
  getRubyOnRailsLessonNav,
  rubyOnRailsTutorial,
} from '@/lib/tutorials/ruby-on-rails';

export function generateStaticParams() {
  return getAllRubyOnRailsLessons().map((lesson) => ({ slug: lesson.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const nav = getRubyOnRailsLessonNav(params.slug);
  if (!nav) return { title: 'Lesson not found — Intellex' };
  return {
    title: `${nav.lesson.title} — Ruby on Rails Tutorial | Intellex`,
    description: nav.lesson.description,
  };
}

export default function LessonPage({ params }: { params: { slug: string } }) {
  const nav = getRubyOnRailsLessonNav(params.slug);
  if (!nav) notFound();
  return (
    <TutorialLessonView
      course={rubyOnRailsTutorial}
      lesson={nav.lesson}
      prev={nav.prev}
      next={nav.next}
      index={nav.index}
    />
  );
}
