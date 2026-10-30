import TutorialCourseView from '@/components/tutorials/TutorialCourseView';
import { getTutorial } from '@/lib/tutorials';

const linuxAdministrationTutorial = getTutorial('linux-administration')!;

export const metadata = {
  title: 'Linux Administration Tutorial - Intellex',
  description: linuxAdministrationTutorial.description,
};

export default function Page() {
  return <TutorialCourseView course={linuxAdministrationTutorial} eyebrow="Linux · Ops" />;
}
