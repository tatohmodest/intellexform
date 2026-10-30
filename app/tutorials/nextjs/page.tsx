import TutorialCourseView from '@/components/tutorials/TutorialCourseView';
import { getTutorial } from '@/lib/tutorials';

const nextjsTutorial = getTutorial('nextjs')!;

export const metadata = {
  title: 'Next.js Tutorial - Intellex',
  description: nextjsTutorial.description,
};

export default function NextjsTutorialPage() {
  return <TutorialCourseView course={nextjsTutorial} eyebrow="Next.js · React included" />;
}
