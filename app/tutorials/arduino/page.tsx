import TutorialCourseView from '@/components/tutorials/TutorialCourseView';
import { arduinoTutorial } from '@/lib/tutorials/arduino';

export const metadata = {
  title: 'Arduino Tutorial - Intellex',
  description: arduinoTutorial.description,
};

export default function Page() {
  return <TutorialCourseView course={arduinoTutorial} eyebrow="Arduino · Embedded" />;
}
