import TutorialCourseView from '@/components/tutorials/TutorialCourseView';
import { postgresqlTutorial } from '@/lib/tutorials/postgresql';

export const metadata = {
  title: 'PostgreSQL Tutorial - Intellex',
  description: postgresqlTutorial.description,
};

export default function PostgresqlTutorialPage() {
  return <TutorialCourseView course={postgresqlTutorial} eyebrow="PostgreSQL · Database" />;
}
