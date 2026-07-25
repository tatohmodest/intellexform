import TutorialCourseView from '@/components/tutorials/TutorialCourseView';
import { nodejsExpressTutorial } from '@/lib/tutorials/nodejs-express';

export const metadata = {
  title: 'Node.js & Express Tutorial — Intellex',
  description: nodejsExpressTutorial.description,
};

export default function NodejsExpressTutorialPage() {
  return <TutorialCourseView course={nodejsExpressTutorial} eyebrow="Node.js · Express" />;
}
