import TutorialCourseView from '@/components/tutorials/TutorialCourseView';
import { javascriptTutorial } from '@/lib/tutorials/javascript';

export const metadata = {
  title: 'JavaScript Tutorial - Intellex',
  description: javascriptTutorial.description,
};

export default function JavaScriptTutorialPage() {
  return <TutorialCourseView course={javascriptTutorial} eyebrow="Frontend JavaScript" />;
}
