import TutorialCourseView from '@/components/tutorials/TutorialCourseView';
import { getTutorial } from '@/lib/tutorials';

const rustTutorial = getTutorial('rust')!;

export const metadata = {
  title: 'Rust Tutorial - Intellex',
  description: rustTutorial.description,
};

export default function Page() {
  return <TutorialCourseView course={rustTutorial} eyebrow="Rust · Systems" />;
}
