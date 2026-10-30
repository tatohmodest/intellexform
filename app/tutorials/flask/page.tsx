import TutorialCourseView from '@/components/tutorials/TutorialCourseView';
import { getTutorial } from '@/lib/tutorials';

const flaskTutorial = getTutorial('flask')!;

export const metadata = {
  title: 'Flask Tutorial - Intellex',
  description: flaskTutorial.description,
};

export default function FlaskTutorialPage() {
  return <TutorialCourseView course={flaskTutorial} eyebrow="Flask · Python web" />;
}
