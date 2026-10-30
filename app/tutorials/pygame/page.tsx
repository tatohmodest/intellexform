import TutorialCourseView from '@/components/tutorials/TutorialCourseView';
import { getTutorial } from '@/lib/tutorials';

const pygameTutorial = getTutorial('pygame')!;

export const metadata = {
  title: 'Pygame Tutorial - Intellex',
  description: pygameTutorial.description,
};

export default function PygameTutorialPage() {
  return <TutorialCourseView course={pygameTutorial} eyebrow="Pygame · Game Dev" />;
}
