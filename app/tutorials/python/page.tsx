import TutorialCourseView from '@/components/tutorials/TutorialCourseView';
import { getTutorial } from '@/lib/tutorials';

const pythonTutorial = getTutorial('python')!;

export const metadata = {
  title: 'Python Tutorial - Intellex',
  description: pythonTutorial.description,
};

export default function PythonTutorialPage() {
  return <TutorialCourseView course={pythonTutorial} eyebrow="Python programming" />;
}
