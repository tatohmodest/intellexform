import TutorialCourseView from '@/components/tutorials/TutorialCourseView';
import { getTutorial } from '@/lib/tutorials';

const djangoTutorial = getTutorial('django')!;

export const metadata = {
  title: 'Django Tutorial - Intellex',
  description: djangoTutorial.description,
};

export default function DjangoTutorialPage() {
  return <TutorialCourseView course={djangoTutorial} eyebrow="Django · Python web" />;
}
