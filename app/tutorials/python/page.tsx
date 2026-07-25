import TutorialCourseView from '@/components/tutorials/TutorialCourseView';
import { pythonTutorial } from '@/lib/tutorials/python';

export const metadata = {
  title: 'Python Tutorial — Intellex',
  description: pythonTutorial.description,
};

export default function PythonTutorialPage() {
  return <TutorialCourseView course={pythonTutorial} eyebrow="Python programming" />;
}
