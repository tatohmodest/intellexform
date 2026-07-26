import TutorialCourseView from '@/components/tutorials/TutorialCourseView';
import { pygameTutorial } from '@/lib/tutorials/pygame';

export const metadata = {
  title: 'Pygame Tutorial - Intellex',
  description: pygameTutorial.description,
};

export default function PygameTutorialPage() {
  return <TutorialCourseView course={pygameTutorial} eyebrow="Pygame · Game Dev" />;
}
