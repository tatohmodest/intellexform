/**
 * Instructor student monitoring — inactive / at-risk signals (support tool).
 */

import { listInstructorStudentGroups } from '@/lib/learn/ecosystem';
import { getDb } from '@/lib/repo';
import { listNeedsGradingForAuthor } from '@/lib/learn/assessments';

export type StudentRiskRow = {
  studentId: string;
  studentName: string;
  studentEmail: string | null;
  courseId: string;
  courseTitle: string;
  risk: 'medium' | 'low';
  reasons: string[];
  lastActiveAt: string | null;
  enrolledAt: string | null;
};

export async function listStudentsNeedingAttention(
  instructorId: string,
): Promise<StudentRiskRow[]> {
  const groups = await listInstructorStudentGroups(instructorId).catch(() => []);
  const db = await getDb();
  const now = Date.now();
  const rows: StudentRiskRow[] = [];

  for (const g of groups) {
    for (const s of g.students) {
      const reasons: string[] = [];
      let lastActiveAt: string | null = null;
      let enrolledAt: string | null = s.enrolledAt
        ? new Date(s.enrolledAt).toISOString()
        : null;

      try {
        const enrollment = await db.collection('course_enrollments').findOne({
          courseId: g.courseId,
          studentId: s.studentId,
        });
        if (enrollment?.enrolledAt) {
          enrolledAt = new Date(enrollment.enrolledAt as string | Date).toISOString();
        }
        const last =
          (enrollment?.lastTouchedAt as string | Date | undefined) ||
          (enrollment?.updatedAt as string | Date | undefined) ||
          enrollment?.enrolledAt;
        if (last) lastActiveAt = new Date(last as string | Date).toISOString();
      } catch {
        /* ignore */
      }

      const lastMs = lastActiveAt ? new Date(lastActiveAt).getTime() : enrolledAt ? new Date(enrolledAt).getTime() : null;
      if (lastMs && now - lastMs > 14 * 24 * 60 * 60 * 1000) {
        const days = Math.floor((now - lastMs) / (24 * 60 * 60 * 1000));
        reasons.push(`${days} days inactive`);
      } else if (!lastMs && enrolledAt) {
        const enrolledMs = new Date(enrolledAt).getTime();
        if (now - enrolledMs > 7 * 24 * 60 * 60 * 1000) {
          reasons.push('No recorded activity since enrollment');
        }
      }

      if (reasons.length) {
        rows.push({
          studentId: s.studentId,
          studentName: s.studentName,
          studentEmail: s.studentEmail || null,
          courseId: g.courseId,
          courseTitle: g.courseTitle,
          risk: reasons.some((r) => r.includes('inactive') && parseInt(r, 10) >= 14)
            ? 'medium'
            : 'low',
          reasons,
          lastActiveAt,
          enrolledAt,
        });
      }
    }
  }

  return rows.sort((a, b) => {
    const am = a.lastActiveAt ? new Date(a.lastActiveAt).getTime() : 0;
    const bm = b.lastActiveAt ? new Date(b.lastActiveAt).getTime() : 0;
    return am - bm;
  });
}

export async function getInstructorMonitoringSummary(instructorId: string) {
  const [needsGrading, atRisk] = await Promise.all([
    listNeedsGradingForAuthor(instructorId),
    listStudentsNeedingAttention(instructorId),
  ]);
  return {
    needsGrading,
    pendingSubmissionCount: needsGrading.reduce((n, g) => n + g.pendingCount, 0),
    atRisk,
  };
}
