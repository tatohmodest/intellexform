import TutorialCourseView from '@/components/tutorials/TutorialCourseView';
import { kubernetesTutorial } from '@/lib/tutorials/kubernetes';

export const metadata = {
  title: 'Kubernetes Tutorial - Intellex',
  description: kubernetesTutorial.description,
};

export default function Page() {
  return <TutorialCourseView course={kubernetesTutorial} eyebrow="Kubernetes · DevOps" />;
}
