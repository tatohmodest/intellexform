import type { TutorialCourse } from '../types';
import { groupIntoSections, getLessonNav, LEVEL_META } from '../shared';
import { beginnerLessons } from './beginner';
import { intermediateLessons } from './intermediate';
import { advancedLessons } from './advanced';

const LEVEL_SUMMARIES = {
  beginner: {
    ...LEVEL_META.beginner,
    summary: 'OSI/TCP-IP foundations, addressing, DNS, and transport basics.',
  },
  intermediate: {
    ...LEVEL_META.intermediate,
    summary: 'VLANs, routing, firewalls, load balancing, and network observability.',
  },
  advanced: {
    ...LEVEL_META.advanced,
    summary: 'BGP policy, zero trust access, DDoS resilience, SD-WAN, and capstone design.',
  },
};

const allLessons = [...beginnerLessons, ...intermediateLessons, ...advancedLessons].sort(
  (a, b) => a.order - b.order,
);

export const networkingTutorial: TutorialCourse = {
  slug: 'networking',
  title: 'Networking Tutorial',
  shortTitle: 'Networking',
  description:
    'A complete beginner-to-pro networking guide covering IP, DNS, transport, routing, security, observability, and production-grade architecture decisions.',
  tagline: 'Build and operate reliable networks from first principles to production',
  audience: 'Developers, IT students, and engineers who need practical networking depth',
  totalLessons: allLessons.length,
  sections: groupIntoSections(allLessons, LEVEL_SUMMARIES),
  tag: 'Infrastructure',
  highlights: [
    'Layered troubleshooting from L1 to L7',
    'Routing and segmentation for real environments',
    'Security controls: NAT, ACLs, and zero trust',
    'Capstone architecture and outage response',
  ],
};

export function getAllNetworkingLessons() {
  return allLessons;
}

export function getNetworkingLesson(slug: string) {
  return allLessons.find((lesson) => lesson.slug === slug);
}

export function getNetworkingLessonNav(slug: string) {
  return getLessonNav(allLessons, slug);
}
