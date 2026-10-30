import TutorialCourseView from '@/components/tutorials/TutorialCourseView';
import { getTutorial } from '@/lib/tutorials';

const nodejsExpressTutorial = getTutorial('nodejs-express')!;

export const metadata = {
  title: 'Node.js & Express Tutorial - Intellex',
  description: nodejsExpressTutorial.description,
};

export default function NodejsExpressTutorialPage() {
  return <TutorialCourseView course={nodejsExpressTutorial} eyebrow="Node.js · Express" />;
}
