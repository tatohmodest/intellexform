import type { TutorialCourse } from '../types';
import { groupIntoSections, getLessonNav, LEVEL_META } from '../shared';
import { beginnerLessons } from './beginner';
import { intermediateLessons } from './intermediate';
import { advancedLessons } from './advanced';

const LEVEL_SUMMARIES = {
  beginner: {
    ...LEVEL_META.beginner,
    summary:
      'Install Docker, learn images, containers, Dockerfiles, volumes, networks, and Compose basics.',
  },
  intermediate: {
    ...LEVEL_META.intermediate,
    summary:
      'Level up with multi-stage builds, Compose apps, registries, env/config, debugging, and real stacks.',
  },
  advanced: {
    ...LEVEL_META.advanced,
    summary:
      'Go pro with security, CI/CD, production patterns, Swarm/K8s intro, and portfolio Docker projects.',
  },
};

const allLessons = [...beginnerLessons, ...intermediateLessons, ...advancedLessons].sort(
  (a, b) => a.order - b.order,
);

export const dockerTutorial: TutorialCourse = {
  slug: 'docker',
  title: 'Docker Tutorial',
  shortTitle: 'Docker',
  description:
    'A complete Docker path from beginner to pro — containers, images, Dockerfiles, Compose, networking, security, and real multi-service projects.',
  tagline: 'Build, ship, and run anywhere',
  audience: 'Developers and learners ready to containerize apps and run reliable local/prod stacks',
  totalLessons: allLessons.length,
  sections: groupIntoSections(allLessons, LEVEL_SUMMARIES),
  tag: 'DevOps',
  highlights: [
    'Images, containers, and Dockerfiles made clear',
    'Compose for real multi-service apps',
    'Networking, volumes, registries, and security',
    'Projects with Node, Python, Go, and databases',
  ],
};

export function getAllDockerLessons() {
  return allLessons;
}

export function getDockerLesson(slug: string) {
  return allLessons.find((lesson) => lesson.slug === slug);
}

export function getDockerLessonNav(slug: string) {
  return getLessonNav(allLessons, slug);
}
