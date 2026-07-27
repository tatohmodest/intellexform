import TutorialCourseView from '@/components/tutorials/TutorialCourseView';
import { rubyOnRailsTutorial } from '@/lib/tutorials/ruby-on-rails';

export const metadata = {
  title: 'Ruby on Rails Tutorial - Intellex',
  description: rubyOnRailsTutorial.description,
};

export default function Page() {
  return <TutorialCourseView course={rubyOnRailsTutorial} eyebrow="Rails · Full-stack" />;
}
