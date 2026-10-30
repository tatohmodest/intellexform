import TutorialCourseView from '@/components/tutorials/TutorialCourseView';
import { getTutorial } from '@/lib/tutorials';

const cppTutorial = getTutorial('cpp')!;

export const metadata = {
  title: 'C++ Tutorial - Intellex',
  description: cppTutorial.description,
};

export default function Page() {
  return <TutorialCourseView course={cppTutorial} eyebrow="C++ · Systems" />;
}
