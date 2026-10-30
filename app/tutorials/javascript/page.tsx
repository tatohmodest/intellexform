import TutorialCourseView from '@/components/tutorials/TutorialCourseView';
import { getTutorial } from '@/lib/tutorials';

const javascriptTutorial = getTutorial('javascript')!;

export const metadata = {
  title: 'JavaScript Tutorial - Intellex',
  description: javascriptTutorial.description,
};

export default function JavaScriptTutorialPage() {
  return <TutorialCourseView course={javascriptTutorial} eyebrow="Frontend JavaScript" />;
}
