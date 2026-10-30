import TutorialCourseView from '@/components/tutorials/TutorialCourseView';
import { getTutorial } from '@/lib/tutorials';

const bashScriptingTutorial = getTutorial('bash-scripting')!;

export const metadata = {
  title: 'Bash Scripting Tutorial - Intellex',
  description: bashScriptingTutorial.description,
};

export default function Page() {
  return <TutorialCourseView course={bashScriptingTutorial} eyebrow="Bash · Automation" />;
}
