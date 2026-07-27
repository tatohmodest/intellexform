import TutorialCourseView from '@/components/tutorials/TutorialCourseView';
import { nextjsTutorial } from '@/lib/tutorials/nextjs';

export const metadata = {
  title: 'Next.js Tutorial - Intellex',
  description: nextjsTutorial.description,
};

export default function NextjsTutorialPage() {
  return <TutorialCourseView course={nextjsTutorial} eyebrow="Next.js · React included" />;
}
