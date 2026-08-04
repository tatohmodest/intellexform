import TutorialCourseView from '@/components/tutorials/TutorialCourseView';
import { networkingTutorial } from '@/lib/tutorials/networking';

export const metadata = {
  title: 'Networking Tutorial - Intellex',
  description: networkingTutorial.description,
};

export default function NetworkingTutorialPage() {
  return <TutorialCourseView course={networkingTutorial} eyebrow="Networking · Infrastructure" />;
}
