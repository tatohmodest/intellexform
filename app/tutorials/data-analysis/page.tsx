import TutorialCourseView from '@/components/tutorials/TutorialCourseView';
import { getTutorial } from '@/lib/tutorials';

const dataAnalysisTutorial = getTutorial('data-analysis')!;

export const metadata = {
  title: 'Data Analysis Tutorial - Intellex',
  description: dataAnalysisTutorial.description,
};

export default function DataAnalysisTutorialPage() {
  return <TutorialCourseView course={dataAnalysisTutorial} eyebrow="Data Analysis · Python" />;
}
