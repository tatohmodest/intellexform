import TutorialCourseView from '@/components/tutorials/TutorialCourseView';
import { rustTutorial } from '@/lib/tutorials/rust';

export const metadata = {
  title: 'Rust Tutorial — Intellex',
  description: rustTutorial.description,
};

export default function Page() {
  return <TutorialCourseView course={rustTutorial} eyebrow="Rust · Systems" />;
}
