import TutorialCourseView from '@/components/tutorials/TutorialCourseView';
import { getTutorial } from '@/lib/tutorials';

const arduinoTutorial = getTutorial('arduino')!;

export const metadata = {
  title: 'Arduino Tutorial - Intellex',
  description: arduinoTutorial.description,
};

export default function Page() {
  return <TutorialCourseView course={arduinoTutorial} eyebrow="Arduino · Embedded" />;
}
