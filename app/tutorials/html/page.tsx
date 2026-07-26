import TutorialCourseView from '@/components/tutorials/TutorialCourseView';
import { htmlTutorial } from '@/lib/tutorials/html';

export const metadata = {
  title: 'HTML Tutorial - Intellex',
  description: htmlTutorial.description,
};

export default function HtmlTutorialPage() {
  return <TutorialCourseView course={htmlTutorial} eyebrow="HTML · Frontend" />;
}
