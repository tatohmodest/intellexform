import TutorialCourseView from '@/components/tutorials/TutorialCourseView';
import { getTutorial } from '@/lib/tutorials';

const cssTutorial = getTutorial('css')!;

export const metadata = {
  title: 'CSS Tutorial - Intellex',
  description: cssTutorial.description,
};

export default function CssTutorialPage() {
  return <TutorialCourseView course={cssTutorial} eyebrow="CSS · Frontend" />;
}
