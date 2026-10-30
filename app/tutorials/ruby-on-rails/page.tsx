import TutorialCourseView from '@/components/tutorials/TutorialCourseView';
import { getTutorial } from '@/lib/tutorials';

const rubyOnRailsTutorial = getTutorial('ruby-on-rails')!;

export const metadata = {
  title: 'Ruby on Rails Tutorial - Intellex',
  description: rubyOnRailsTutorial.description,
};

export default function Page() {
  return <TutorialCourseView course={rubyOnRailsTutorial} eyebrow="Rails · Full-stack" />;
}
