import TutorialCourseView from '@/components/tutorials/TutorialCourseView';
import { computerArchitectureTutorial } from '@/lib/tutorials/computer-architecture';

export const metadata = {
  title: 'Computer Architecture Tutorial - Intellex',
  description: computerArchitectureTutorial.description,
};

export default function ComputerArchitectureTutorialPage() {
  return (
    <TutorialCourseView
      course={computerArchitectureTutorial}
      eyebrow="CSE 203 · Computer Architecture & Organization"
    />
  );
}
