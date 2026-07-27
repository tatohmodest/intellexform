import TutorialCourseView from '@/components/tutorials/TutorialCourseView';
import { nestjsTutorial } from '@/lib/tutorials/nestjs';

export const metadata = {
  title: 'NestJS Tutorial - Intellex',
  description: nestjsTutorial.description,
};

export default function NestjsTutorialPage() {
  return <TutorialCourseView course={nestjsTutorial} eyebrow="NestJS · TypeScript included" />;
}
