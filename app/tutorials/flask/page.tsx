import TutorialCourseView from '@/components/tutorials/TutorialCourseView';
import { flaskTutorial } from '@/lib/tutorials/flask';

export const metadata = {
  title: 'Flask Tutorial - Intellex',
  description: flaskTutorial.description,
};

export default function FlaskTutorialPage() {
  return <TutorialCourseView course={flaskTutorial} eyebrow="Flask · Python web" />;
}
