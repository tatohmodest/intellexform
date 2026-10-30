import TutorialCourseView from '@/components/tutorials/TutorialCourseView';
import { getTutorial } from '@/lib/tutorials';

const postgresqlTutorial = getTutorial('postgresql')!;

export const metadata = {
  title: 'PostgreSQL Tutorial - Intellex',
  description: postgresqlTutorial.description,
};

export default function PostgresqlTutorialPage() {
  return <TutorialCourseView course={postgresqlTutorial} eyebrow="PostgreSQL · Database" />;
}
