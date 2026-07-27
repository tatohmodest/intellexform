import TutorialCourseView from '@/components/tutorials/TutorialCourseView';
import { flutterTutorial } from '@/lib/tutorials/flutter';

export const metadata = {
  title: 'Flutter Tutorial - Intellex',
  description: flutterTutorial.description,
};

export default function FlutterTutorialPage() {
  return <TutorialCourseView course={flutterTutorial} eyebrow="Flutter · Dart included" />;
}
