import type { TutorialCourse } from '../types';
import { groupIntoSections, getLessonNav, LEVEL_META } from '../shared';
import { beginnerLessons } from './beginner';
import { intermediateLessons } from './intermediate';
import { advancedLessons } from './advanced';

const LEVEL_SUMMARIES = {
  beginner: {
    ...LEVEL_META.beginner,
    summary:
      'Build Hardware DNA: Von Neumann vs Harvard, Iron Law performance, RISC-V/MIPS ISA, ALU design, and the single-cycle datapath.',
  },
  intermediate: {
    ...LEVEL_META.intermediate,
    summary:
      'Pipeline for ILP, defeat structural/data/control hazards, and design caches that minimize AMAT.',
  },
  advanced: {
    ...LEVEL_META.advanced,
    summary:
      'Master virtual memory, TLBs, interrupts, DMA, multicore coherence (MSI/MESI), and synthesize a full architecture portfolio.',
  },
};

const allLessons = [...beginnerLessons, ...intermediateLessons, ...advancedLessons].sort(
  (a, b) => a.order - b.order,
);

export const computerArchitectureTutorial: TutorialCourse = {
  slug: 'computer-architecture',
  title: 'Computer Architecture Tutorial',
  shortTitle: 'Computer Architecture',
  description:
    'A complete CSE 203 path — Computer Architecture and Organization from abstraction and ISA through ALU, single-cycle and pipelined datapaths, hazards, caches, virtual memory, DMA, and multicore coherence.',
  tagline: 'Learn how hardware executes',
  audience:
    'CS/engineering students and developers who want to bridge high-level code with processors, memory hierarchies, and parallel machines',
  totalLessons: allLessons.length,
  sections: groupIntoSections(allLessons, LEVEL_SUMMARIES),
  tag: 'CS Foundations',
  highlights: [
    'RISC-V / MIPS assembly, formats, and hand tracing',
    'ALU, single-cycle blueprint, and 5-stage pipelines',
    'Hazard detection, forwarding, caches, and AMAT',
    'Virtual memory, DMA, MESI coherence, and capstone synthesis',
  ],
};

export function getAllComputerArchitectureLessons() {
  return allLessons;
}

export function getComputerArchitectureLesson(slug: string) {
  return allLessons.find((lesson) => lesson.slug === slug);
}

export function getComputerArchitectureLessonNav(slug: string) {
  return getLessonNav(allLessons, slug);
}
