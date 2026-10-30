import TutorialCourseView from '@/components/tutorials/TutorialCourseView';
import { getTutorial } from '@/lib/tutorials';

const mongodbTutorial = getTutorial('mongodb')!;

export const metadata = {
  title: 'MongoDB Tutorial - Intellex',
  description: mongodbTutorial.description,
};

export default function MongodbTutorialPage() {
  return <TutorialCourseView course={mongodbTutorial} eyebrow="MongoDB · Database" />;
}
