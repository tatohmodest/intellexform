import TutorialCourseView from '@/components/tutorials/TutorialCourseView';
import { microsoftSuiteTutorial } from '@/lib/tutorials/microsoft-suite';

export const metadata = {
  title: 'Microsoft Suite Tutorial - Intellex',
  description: microsoftSuiteTutorial.description,
};

export default function MicrosoftSuiteTutorialPage() {
  return <TutorialCourseView course={microsoftSuiteTutorial} eyebrow="Microsoft 365" />;
}
