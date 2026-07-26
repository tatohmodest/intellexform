import TutorialCourseView from '@/components/tutorials/TutorialCourseView';
import { cssTutorial } from '@/lib/tutorials/css';

export const metadata = {
  title: 'CSS Tutorial - Intellex',
  description: cssTutorial.description,
};

export default function CssTutorialPage() {
  return <TutorialCourseView course={cssTutorial} eyebrow="CSS · Frontend" />;
}
