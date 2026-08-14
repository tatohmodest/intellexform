/**
 * Instructor student monitoring — inactivity, missing work, low progress.
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
  risk: 'high' | 'medium' | 'low';
  reasons: string[];
  lastActiveAt: string | null;
  enrolledAt: string | null;
  progressPct: number | null;
  missingAssignments: number;
};

export async function listStudentsNeedingAttention(
  instructorId: string,
): Promise<StudentRiskRow[]> {
  const groups = await listInstructorStudentGroups(instructorId).catch(() => []);
  const db = await getDb();
  const now = Date.now();
  const rows: StudentRiskRow[] = [];

  const publishedAssignments = await db
    .collection('assessments')
    .find({ authorId: instructorId, published: true, kind: 'assignment' })
    .project({ _id: 1, courseId: 1, title: 1 })
    .limit(80)
    .toArray()
    .catch(() => []);

  for (const g of groups) {
    const courseAssignments = publishedAssignments.filter(
      (a) => !a.courseId || String(a.courseId) === g.courseId,
    );

    for (const s of g.students) {
      const reasons: string[] = [];
      let lastActiveAt: string | null = null;
      let enrolledAt: string | null = s.enrolledAt
        ? new Date(s.enrolledAt).toISOString()
        : null;
      let progressPct: number | null = null;
      let missingAssignments = 0;

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
        if (typeof enrollment?.progressPct === 'number') {
          progressPct = enrollment.progressPct;
        }
      } catch {
        /* ignore */
      }

      // Progress from lesson_progress if available
      if (progressPct == null) {
        try {
          const done = await db.collection('lesson_progress').countDocuments({
            userId: s.studentId,
            courseSlug: g.courseId,
            completedAt: { $ne: null },
          });
          const total = await db.collection('course_lessons').countDocuments({
            courseId: g.courseId,
          }).catch(() => 0);
          if (total > 0) progressPct = Math.round((done / total) * 100);
        } catch {
          /* ignore */
        }
      }

      const lastMs = lastActiveAt
        ? new Date(lastActiveAt).getTime()
        : enrolledAt
          ? new Date(enrolledAt).getTime()
          : null;
      if (lastMs && now - lastMs > 21 * 24 * 60 * 60 * 1000) {
        const days = Math.floor((now - lastMs) / (24 * 60 * 60 * 1000));
        reasons.push(`${days} days inactive`);
      } else if (lastMs && now - lastMs > 14 * 24 * 60 * 60 * 1000) {
        const days = Math.floor((now - lastMs) / (24 * 60 * 60 * 1000));
        reasons.push(`${days} days inactive`);
      } else if (!lastMs && enrolledAt) {
        const enrolledMs = new Date(enrolledAt).getTime();
        if (now - enrolledMs > 7 * 24 * 60 * 60 * 1000) {
          reasons.push('No recorded activity since enrollment');
        }
      }

      if (progressPct != null && progressPct < 20 && enrolledAt) {
        const enrolledMs = new Date(enrolledAt).getTime();
        if (now - enrolledMs > 10 * 24 * 60 * 60 * 1000) {
          reasons.push(`Low progress (${progressPct}%)`);
        }
      }

      if (courseAssignments.length) {
        for (const a of courseAssignments) {
          const aid = String((a._id as { toString(): string }).toString());
          const sub = await db.collection('assessment_submissions').findOne({
            assessmentId: aid,
            studentId: s.studentId,
            status: { $in: ['submitted', 'late', 'graded'] },
          });
          if (!sub) missingAssignments += 1;
        }
        if (missingAssignments >= 2) {
          reasons.push(`${missingAssignments} missing assignments`);
        } else if (missingAssignments === 1) {
          reasons.push('1 missing assignment');
        }
      }

      if (reasons.length) {
        let risk: 'high' | 'medium' | 'low' = 'low';
        if (
          reasons.some((r) => parseInt(r, 10) >= 21) ||
          missingAssignments >= 3 ||
          (progressPct != null && progressPct < 10 && missingAssignments >= 1)
        ) {
          risk = 'high';
        } else if (
          reasons.some((r) => r.includes('inactive') && parseInt(r, 10) >= 14) ||
          missingAssignments >= 2 ||
          reasons.some((r) => r.includes('Low progress'))
        ) {
          risk = 'medium';
        }

        rows.push({
          studentId: s.studentId,
          studentName: s.studentName,
          studentEmail: s.studentEmail || null,
          courseId: g.courseId,
          courseTitle: g.courseTitle,
          risk,
          reasons,
          lastActiveAt,
          enrolledAt,
          progressPct,
          missingAssignments,
        });
      }
    }
  }

  const rank = { high: 0, medium: 1, low: 2 };
  return rows.sort((a, b) => {
    const rd = rank[a.risk] - rank[b.risk];
    if (rd !== 0) return rd;
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
    highRiskCount: atRisk.filter((r) => r.risk === 'high').length,
  };
}

/** Flat queue of pending submissions for rapid grading. */
export async function listPendingGradeQueue(instructorId: string): Promise<
  {
    assessmentId: string;
    assessmentTitle: string;
    studentId: string;
    studentName: string;
    submittedAt: string | null;
    fileUrl: string | null;
  }[]
> {
  const needs = await listNeedsGradingForAuthor(instructorId);
  const db = await getDb();
  const queue: {
    assessmentId: string;
    assessmentTitle: string;
    studentId: string;
    studentName: string;
    submittedAt: string | null;
    fileUrl: string | null;
  }[] = [];

  for (const g of needs) {
    const docs = await db
      .collection('assessment_submissions')
      .find({
        assessmentId: g.assessmentId,
        status: { $in: ['submitted', 'late'] },
      })
      .sort({ submittedAt: 1 })
      .limit(40)
      .toArray();
    for (const d of docs) {
      queue.push({
        assessmentId: g.assessmentId,
        assessmentTitle: g.title,
        studentId: String(d.studentId),
        studentName: String(d.studentName || 'Student'),
        submittedAt: d.submittedAt
          ? new Date(d.submittedAt as string | Date).toISOString()
          : null,
        fileUrl: (d.fileUrl as string) || null,
      });
    }
  }
  return queue;
}
