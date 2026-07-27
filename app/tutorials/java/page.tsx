import TutorialCourseView from '@/components/tutorials/TutorialCourseView';
import { javaTutorial } from '@/lib/tutorials/java';

export const metadata = {
  title: 'Java Tutorial - Intellex',
  description: javaTutorial.description,
};

export default function Page() {
  return <TutorialCourseView course={javaTutorial} eyebrow="Java · Backend" />;
}
