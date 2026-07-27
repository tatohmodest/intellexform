import TutorialCourseView from '@/components/tutorials/TutorialCourseView';
import { djangoTutorial } from '@/lib/tutorials/django';

export const metadata = {
  title: 'Django Tutorial - Intellex',
  description: djangoTutorial.description,
};

export default function DjangoTutorialPage() {
  return <TutorialCourseView course={djangoTutorial} eyebrow="Django · Python web" />;
}
