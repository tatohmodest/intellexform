import TutorialCourseView from '@/components/tutorials/TutorialCourseView';
import { mongodbTutorial } from '@/lib/tutorials/mongodb';

export const metadata = {
  title: 'MongoDB Tutorial — Intellex',
  description: mongodbTutorial.description,
};

export default function MongodbTutorialPage() {
  return <TutorialCourseView course={mongodbTutorial} eyebrow="MongoDB · Database" />;
}
