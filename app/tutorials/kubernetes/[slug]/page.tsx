import { notFound } from 'next/navigation';
import TutorialLessonView from '@/components/tutorials/TutorialLessonView';
import {
  getAllKubernetesLessons,
  getKubernetesLessonNav,
  kubernetesTutorial,
} from '@/lib/tutorials/kubernetes';

export function generateStaticParams() {
  return getAllKubernetesLessons().map((lesson) => ({ slug: lesson.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const nav = getKubernetesLessonNav(params.slug);
  if (!nav) return { title: 'Lesson not found — Intellex' };
  return {
    title: `${nav.lesson.title} — Kubernetes Tutorial | Intellex`,
    description: nav.lesson.description,
  };
}

export default function LessonPage({ params }: { params: { slug: string } }) {
  const nav = getKubernetesLessonNav(params.slug);
  if (!nav) notFound();
  return (
    <TutorialLessonView
      course={kubernetesTutorial}
      lesson={nav.lesson}
      prev={nav.prev}
      next={nav.next}
      index={nav.index}
    />
  );
}
