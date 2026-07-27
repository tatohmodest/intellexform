import { notFound } from 'next/navigation';
import TutorialLessonView from '@/components/tutorials/TutorialLessonView';
import {
  getAllDataAnalysisLessons,
  getDataAnalysisLessonNav,
  dataAnalysisTutorial,
} from '@/lib/tutorials/data-analysis';

export function generateStaticParams() {
  return getAllDataAnalysisLessons().map((lesson) => ({ slug: lesson.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const nav = getDataAnalysisLessonNav(params.slug);
  if (!nav) return { title: 'Lesson not found - Intellex' };
  return {
    title: `${nav.lesson.title} - Data Analysis Tutorial | Intellex`,
    description: nav.lesson.description,
  };
}

export default function DataAnalysisLessonPage({ params }: { params: { slug: string } }) {
  const nav = getDataAnalysisLessonNav(params.slug);
  if (!nav) notFound();

  return (
    <TutorialLessonView
      course={dataAnalysisTutorial}
      lesson={nav.lesson}
      prev={nav.prev}
      next={nav.next}
      index={nav.index}
    />
  );
}
