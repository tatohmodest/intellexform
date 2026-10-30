import TutorialCourseView from '@/components/tutorials/TutorialCourseView';
import { getTutorial } from '@/lib/tutorials';

const reactTutorial = getTutorial('react')!;

export const metadata = {
  title: 'React Tutorial - Intellex',
  description: reactTutorial.description,
};

export default function ReactTutorialPage() {
  return <TutorialCourseView course={reactTutorial} eyebrow="Frontend React" />;
}
