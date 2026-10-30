import TutorialCourseView from '@/components/tutorials/TutorialCourseView';
import { getTutorial } from '@/lib/tutorials';

const javaTutorial = getTutorial('java')!;

export const metadata = {
  title: 'Java Tutorial - Intellex',
  description: javaTutorial.description,
};

export default function Page() {
  return <TutorialCourseView course={javaTutorial} eyebrow="Java · Backend" />;
}
