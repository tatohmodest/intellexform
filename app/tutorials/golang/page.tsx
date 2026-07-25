import TutorialCourseView from '@/components/tutorials/TutorialCourseView';
import { golangTutorial } from '@/lib/tutorials/golang';

export const metadata = {
  title: 'Go (Golang) Tutorial — Intellex',
  description: golangTutorial.description,
};

export default function GolangTutorialPage() {
  return <TutorialCourseView course={golangTutorial} eyebrow="Go · Golang" />;
}
