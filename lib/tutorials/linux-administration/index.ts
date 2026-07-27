import type { TutorialCourse } from '../types';
import { groupIntoSections, getLessonNav, LEVEL_META } from '../shared';
import { beginnerLessons } from './beginner';
import { intermediateLessons } from './intermediate';
import { advancedLessons } from './advanced';

const LEVEL_SUMMARIES = {
  beginner: {
    ...LEVEL_META.beginner,
    summary: "Terminal fluency, files, permissions, users, and systemd basics.",
  },
  intermediate: {
    ...LEVEL_META.intermediate,
    summary: "Packages, networking, SSH hardening, disks, and logs.",
  },
  advanced: {
    ...LEVEL_META.advanced,
    summary: "Automation, containers on Linux, hardening, and production drills.",
  },
};

const allLessons = [...beginnerLessons, ...intermediateLessons, ...advancedLessons].sort(
  (a, b) => a.order - b.order,
);

export const linuxAdministrationTutorial: TutorialCourse = {
  slug: "linux-administration",
  title: "Linux Administration Tutorial",
  shortTitle: "Linux Administration",
  description: "A complete Linux administration path: filesystem, users, systemd, networking, packages, storage, security hardening, and ops capstones.",
  tagline: "Run and harden real Linux servers",
  audience: "Aspiring sysadmins, DevOps engineers, and developers who own servers",
  totalLessons: allLessons.length,
  sections: groupIntoSections(allLessons, LEVEL_SUMMARIES),
  tag: "DevOps",
  highlights: ["Real admin commands with context","systemd, networking, and storage","SSH hardening and firewalls","Incident and bootstrap capstones"],
};

export function getAllLinuxAdministrationLessons() {
  return allLessons;
}

export function getLinuxAdministrationLesson(slug: string) {
  return allLessons.find((lesson) => lesson.slug === slug);
}

export function getLinuxAdministrationLessonNav(slug: string) {
  return getLessonNav(allLessons, slug);
}
