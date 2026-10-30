import TutorialCourseView from '@/components/tutorials/TutorialCourseView';
import { getTutorial } from '@/lib/tutorials';

const dockerTutorial = getTutorial('docker')!;

export const metadata = {
  title: 'Docker Tutorial - Intellex',
  description: dockerTutorial.description,
};

export default function DockerTutorialPage() {
  return <TutorialCourseView course={dockerTutorial} eyebrow="Docker · Containers" />;
}
