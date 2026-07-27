import type { TutorialCourse } from '../types';
import { groupIntoSections, getLessonNav, LEVEL_META } from '../shared';
import { beginnerLessons } from './beginner';
import { intermediateLessons } from './intermediate';
import { advancedLessons } from './advanced';

const LEVEL_SUMMARIES = {
  beginner: {
    ...LEVEL_META.beginner,
    summary: "Scripts, variables, quoting, conditionals, loops, and pipes.",
  },
  intermediate: {
    ...LEVEL_META.intermediate,
    summary: "Arrays, getopts, find/xargs, traps, and safer scripting.",
  },
  advanced: {
    ...LEVEL_META.advanced,
    summary: "Shellcheck, testing, security, and automation capstones.",
  },
};

const allLessons = [...beginnerLessons, ...intermediateLessons, ...advancedLessons].sort(
  (a, b) => a.order - b.order,
);

export const bashScriptingTutorial: TutorialCourse = {
  slug: "bash-scripting",
  title: "Bash Scripting Tutorial",
  shortTitle: "Bash Scripting",
  description: "A complete Bash scripting path from first scripts to robust automation: quoting, pipelines, functions, getopts, debugging, and production-safe tooling.",
  tagline: "Automate the command line with discipline",
  audience: "Developers and admins who want reliable shell automation",
  totalLessons: allLessons.length,
  sections: groupIntoSections(allLessons, LEVEL_SUMMARIES),
  tag: "DevOps",
  highlights: ["Safe quoting and pipefail habits","Text processing with grep/sed/awk","CLI flags and idempotent scripts","Bootstrap and toolkit capstones"],
};

export function getAllBashScriptingLessons() {
  return allLessons;
}

export function getBashScriptingLesson(slug: string) {
  return allLessons.find((lesson) => lesson.slug === slug);
}

export function getBashScriptingLessonNav(slug: string) {
  return getLessonNav(allLessons, slug);
}
