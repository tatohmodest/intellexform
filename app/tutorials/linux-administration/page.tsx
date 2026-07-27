import TutorialCourseView from '@/components/tutorials/TutorialCourseView';
import { linuxAdministrationTutorial } from '@/lib/tutorials/linux-administration';

export const metadata = {
  title: 'Linux Administration Tutorial — Intellex',
  description: linuxAdministrationTutorial.description,
};

export default function Page() {
  return <TutorialCourseView course={linuxAdministrationTutorial} eyebrow="Linux · Ops" />;
}
