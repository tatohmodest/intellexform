import TutorialCourseView from '@/components/tutorials/TutorialCourseView';
import { getTutorial } from '@/lib/tutorials';

const computerArchitectureTutorial = getTutorial('computer-architecture')!;

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
