import TutorialCourseView from '@/components/tutorials/TutorialCourseView';
import { cppTutorial } from '@/lib/tutorials/cpp';

export const metadata = {
  title: 'C++ Tutorial — Intellex',
  description: cppTutorial.description,
};

export default function Page() {
  return <TutorialCourseView course={cppTutorial} eyebrow="C++ · Systems" />;
}
