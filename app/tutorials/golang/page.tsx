import TutorialCourseView from '@/components/tutorials/TutorialCourseView';
import { getTutorial } from '@/lib/tutorials';

const golangTutorial = getTutorial('golang')!;

export const metadata = {
  title: 'Go (Golang) Tutorial - Intellex',
  description: golangTutorial.description,
};

export default function GolangTutorialPage() {
  return <TutorialCourseView course={golangTutorial} eyebrow="Go · Golang" />;
}
