import TutorialCourseView from '@/components/tutorials/TutorialCourseView';
import { bashScriptingTutorial } from '@/lib/tutorials/bash-scripting';

export const metadata = {
  title: 'Bash Scripting Tutorial — Intellex',
  description: bashScriptingTutorial.description,
};

export default function Page() {
  return <TutorialCourseView course={bashScriptingTutorial} eyebrow="Bash · Automation" />;
}
