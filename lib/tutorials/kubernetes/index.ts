import type { TutorialCourse } from '../types';
import { groupIntoSections, getLessonNav, LEVEL_META } from '../shared';
import { beginnerLessons } from './beginner';
import { intermediateLessons } from './intermediate';
import { advancedLessons } from './advanced';

const LEVEL_SUMMARIES = {
  beginner: {
    ...LEVEL_META.beginner,
    summary: "Cluster concepts, kubectl, pods, deployments, and services.",
  },
  intermediate: {
    ...LEVEL_META.intermediate,
    summary: "Config/secrets, probes, storage, ingress, and rollout strategies.",
  },
  advanced: {
    ...LEVEL_META.advanced,
    summary: "RBAC, Helm/Kustomize, observability, GitOps preview, and capstones.",
  },
};

const allLessons = [...beginnerLessons, ...intermediateLessons, ...advancedLessons].sort(
  (a, b) => a.order - b.order,
);

export const kubernetesTutorial: TutorialCourse = {
  slug: "kubernetes",
  title: "Kubernetes Tutorial",
  shortTitle: "Kubernetes",
  description: "A complete Kubernetes path from pods and deployments to services, ingress, Helm, RBAC, autoscaling, and production operations.",
  tagline: "Orchestrate containers in production",
  audience: "Developers and DevOps engineers deploying containerized workloads",
  totalLessons: allLessons.length,
  sections: groupIntoSections(allLessons, LEVEL_SUMMARIES),
  tag: "DevOps",
  highlights: ["Declarative YAML you can actually apply","Debugging CrashLoops and bad rollouts","Helm and Kustomize workflows","Security and production operations"],
};

export function getAllKubernetesLessons() {
  return allLessons;
}

export function getKubernetesLesson(slug: string) {
  return allLessons.find((lesson) => lesson.slug === slug);
}

export function getKubernetesLessonNav(slug: string) {
  return getLessonNav(allLessons, slug);
}
