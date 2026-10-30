import TutorialCourseView from '@/components/tutorials/TutorialCourseView';
import { getTutorial } from '@/lib/tutorials';

const microsoftSuiteTutorial = getTutorial('microsoft-suite')!;

export const metadata = {
  title: 'Microsoft Suite Tutorial - Intellex',
  description: microsoftSuiteTutorial.description,
};

export default function MicrosoftSuiteTutorialPage() {
  return <TutorialCourseView course={microsoftSuiteTutorial} eyebrow="Microsoft 365" />;
}
