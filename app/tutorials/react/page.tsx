import TutorialCourseView from '@/components/tutorials/TutorialCourseView';
import { reactTutorial } from '@/lib/tutorials/react';

export const metadata = {
  title: 'React Tutorial - Intellex',
  description: reactTutorial.description,
};

export default function ReactTutorialPage() {
  return <TutorialCourseView course={reactTutorial} eyebrow="Frontend React" />;
}
