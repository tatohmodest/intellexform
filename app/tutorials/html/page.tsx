import TutorialCourseView from '@/components/tutorials/TutorialCourseView';
import { getTutorial } from '@/lib/tutorials';

const htmlTutorial = getTutorial('html')!;

export const metadata = {
  title: 'HTML Tutorial - Intellex',
  description: htmlTutorial.description,
};

export default function HtmlTutorialPage() {
  return <TutorialCourseView course={htmlTutorial} eyebrow="HTML · Frontend" />;
}
