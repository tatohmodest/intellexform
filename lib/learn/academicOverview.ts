/**
 * Academic overview — program / cohort / GPA / credits (soft fields + enrollments).
 */

import { getLearner, getEnrollments, getProgress } from '@/lib/learn/repo';
import { getCatalogTrack } from '@/lib/learn/catalog';
import { getMyCourseSections } from '@/lib/learn/myCourses';
import type { Affiliation } from '@/lib/learn/identity';

export type AcademicProgramCard = {
  institutionSlug: string;
  institutionName: string;
  program: string | null;
  cohort: string | null;
  year: string | null;
  department: string | null;
  faculty: string | null;
  gpa: number | null;
  creditsEarned: number | null;
  creditsRequired: number | null;
  status: string;
};

export type AcademicOverview = {
  programs: AcademicProgramCard[];
  coursesCompleted: number;
  coursesInProgress: number;
  estimatedCreditsFromCourses: number;
  journey: { label: string; detail: string; href: string }[];
};

function numOrNull(v: unknown): number | null {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string' && v.trim() && !Number.isNaN(Number(v))) return Number(v);
  return null;
}

export async function getAcademicOverview(userId: string): Promise<AcademicOverview> {
  const [learner, enrollments, progress, courseData] = await Promise.all([
    getLearner(userId).catch(() => null),
    getEnrollments(userId).catch(() => []),
    getProgress(userId).catch(() => []),
    getMyCourseSections(userId).catch(() => ({ sections: [], total: 0, inProgress: 0 })),
  ]);

  const affiliations = (learner?.affiliations || []) as Array<
    Affiliation & {
      cohort?: string | null;
      gpa?: number | string | null;
      creditsEarned?: number | string | null;
      creditsRequired?: number | string | null;
    }
  >;

  const prefs = learner?.preferences as
    | {
        academicGpa?: number;
        academicCreditsEarned?: number;
        academicCreditsRequired?: number;
        academicCohort?: string;
      }
    | undefined;

  const programs: AcademicProgramCard[] = affiliations
    .filter((a) => a.status === 'verified' || a.program)
    .map((a) => ({
      institutionSlug: a.institutionSlug,
      institutionName: a.institutionName,
      program: a.program || null,
      cohort: a.cohort || prefs?.academicCohort || null,
      year: a.year || null,
      department: a.department || null,
      faculty: a.faculty || null,
      gpa: numOrNull(a.gpa) ?? prefs?.academicGpa ?? null,
      creditsEarned: numOrNull(a.creditsEarned) ?? prefs?.academicCreditsEarned ?? null,
      creditsRequired: numOrNull(a.creditsRequired) ?? prefs?.academicCreditsRequired ?? null,
      status: a.status,
    }));

  // Soft personal academic prefs when no campus affiliation yet
  if (!programs.length && (prefs?.academicGpa != null || prefs?.academicCreditsEarned != null)) {
    programs.push({
      institutionSlug: 'personal',
      institutionName: 'Personal learning path',
      program: learner?.primaryIntent === 'learn' ? 'Self-paced' : null,
      cohort: prefs.academicCohort || null,
      year: null,
      department: null,
      faculty: null,
      gpa: prefs.academicGpa ?? null,
      creditsEarned: prefs.academicCreditsEarned ?? null,
      creditsRequired: prefs.academicCreditsRequired ?? null,
      status: 'verified',
    });
  }

  const doneByCourse = new Map<string, Set<string>>();
  for (const p of progress) {
    if (!p.completedAt) continue;
    if (!doneByCourse.has(p.courseSlug)) doneByCourse.set(p.courseSlug, new Set());
    doneByCourse.get(p.courseSlug)!.add(p.lessonSlug);
  }

  let coursesCompleted = 0;
  for (const e of enrollments) {
    const track = getCatalogTrack(e.courseSlug);
    if (!track) continue;
    const done = doneByCourse.get(e.courseSlug)?.size || 0;
    if (track.totalLessons && done >= track.totalLessons) coursesCompleted += 1;
  }

  const enrolled =
    courseData.sections.find((s) => s.id === 'enrolled')?.courses.filter((c) => c.enrolled) || [];
  const completedFromSections = enrolled.filter((c) => c.pct >= 100).length;
  coursesCompleted = Math.max(coursesCompleted, completedFromSections);
  const coursesInProgress = enrolled.filter((c) => c.pct > 0 && c.pct < 100).length;

  // Soft credit estimate: 3 credits per completed course when org has not set credits
  const estimatedCreditsFromCourses = coursesCompleted * 3;

  const journey: AcademicOverview['journey'] = [];
  if (programs[0]?.program) {
    journey.push({
      label: 'Program',
      detail: programs[0].program,
      href: `/dashboard/institutions/${programs[0].institutionSlug}`,
    });
  }
  if (programs[0]?.cohort) {
    journey.push({
      label: 'Cohort',
      detail: programs[0].cohort,
      href: '/dashboard/academic',
    });
  }
  journey.push({
    label: 'In progress',
    detail: `${coursesInProgress} course${coursesInProgress === 1 ? '' : 's'}`,
    href: '/dashboard/my-learning',
  });
  journey.push({
    label: 'Completed',
    detail: `${coursesCompleted} course${coursesCompleted === 1 ? '' : 's'}`,
    href: '/dashboard/portfolio',
  });
  journey.push({
    label: 'Assignments',
    detail: 'Open your work queue',
    href: '/dashboard/assignments',
  });

  return {
    programs,
    coursesCompleted,
    coursesInProgress,
    estimatedCreditsFromCourses,
    journey,
  };
}
