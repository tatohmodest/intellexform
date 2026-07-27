import TutorialCourseView from '@/components/tutorials/TutorialCourseView';
import { digitalMarketingTutorial } from '@/lib/tutorials/digital-marketing';

export const metadata = {
  title: 'Digital Marketing Tutorial - Intellex',
  description: digitalMarketingTutorial.description,
};

export default function DigitalMarketingTutorialPage() {
  return <TutorialCourseView course={digitalMarketingTutorial} eyebrow="Digital Marketing" />;
}
