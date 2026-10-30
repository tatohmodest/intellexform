import TutorialCourseView from '@/components/tutorials/TutorialCourseView';
import { getTutorial } from '@/lib/tutorials';

const digitalMarketingTutorial = getTutorial('digital-marketing')!;

export const metadata = {
  title: 'Digital Marketing Tutorial - Intellex',
  description: digitalMarketingTutorial.description,
};

export default function DigitalMarketingTutorialPage() {
  return <TutorialCourseView course={digitalMarketingTutorial} eyebrow="Digital Marketing" />;
}
