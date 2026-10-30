import TutorialCourseView from '@/components/tutorials/TutorialCourseView';
import { getTutorial } from '@/lib/tutorials';

const flutterTutorial = getTutorial('flutter')!;

export const metadata = {
  title: 'Flutter Tutorial - Intellex',
  description: flutterTutorial.description,
};

export default function FlutterTutorialPage() {
  return <TutorialCourseView course={flutterTutorial} eyebrow="Flutter · Dart included" />;
}
