import TutorialCourseView from '@/components/tutorials/TutorialCourseView';
import { getTutorial } from '@/lib/tutorials';

const networkingTutorial = getTutorial('networking')!;

export const metadata = {
  title: 'Networking Tutorial (Beginner to Pro) - Intellex',
  description: networkingTutorial.description,
};

export default function NetworkingTutorialPage() {
  return (
    <TutorialCourseView
      course={networkingTutorial}
      eyebrow="NET 101 · Complete Networking (Beginner to Pro)"
    />
  );
}
