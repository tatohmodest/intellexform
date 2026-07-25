import TutorialCourseView from '@/components/tutorials/TutorialCourseView';
import { dockerTutorial } from '@/lib/tutorials/docker';

export const metadata = {
  title: 'Docker Tutorial — Intellex',
  description: dockerTutorial.description,
};

export default function DockerTutorialPage() {
  return <TutorialCourseView course={dockerTutorial} eyebrow="Docker · Containers" />;
}
