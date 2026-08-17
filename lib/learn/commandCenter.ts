/**
 * Student & instructor command centers — "What should I do today?"
 */

import { getBookings, getLearner, getProgress, getEnrollments } from '@/lib/learn/repo';
import { getCatalog, getCatalogTrack, getNextLesson } from '@/lib/learn/catalog';
import {
  listPublishedForStudent,
  listSubmissionsForStudent,
  listNeedsGradingForAuthor,
  type AssessmentView,
  type SubmissionView,
} from '@/lib/learn/assessments';
import {
  listOngoingClassesForUser,
  listClassroomForUser,
  listLiveClassesForInstructor,
} from '@/lib/learn/courseClassSessions';
import { getMyCourseSections, type MyCourseCard } from '@/lib/learn/myCourses';
import { listPersonalTasks } from '@/lib/learn/personalTasks';
import { getMentorBookings, listBooksByAuthor } from '@/lib/learn/ecosystem';
import { unreadNotificationCount } from '@/lib/learn/notifications';

export type TodayItem = {
  id: string;
  timeLabel: string;
  title: string;
  subtitle: string;
  href: string;
  actionLabel: string;
  kind: 'live_class' | 'assignment' | 'mentorship' | 'course' | 'personal' | 'grading';
  urgency: 'now' | 'today' | 'soon';
};

export type AssignmentBucketItem = {
  id: string;
  title: string;
  authorName: string;
  dueAt: string | null;
  href: string;
  status: 'due_today' | 'due_week' | 'upcoming' | 'submitted' | 'graded' | 'overdue' | 'open';
  score?: number | null;
  maxScore?: number | null;
  courseLabel?: string | null;
};

export type AttentionItem = {
  id: string;
  title: string;
  detail: string;
  href: string;
  severity: 'high' | 'medium' | 'low';
};

function startOfDay(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function endOfDay(d = new Date()) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

function endOfWeek(d = new Date()) {
  const x = endOfDay(d);
  const day = x.getDay();
  const add = day === 0 ? 0 : 7 - day;
  x.setDate(x.getDate() + add);
  return x;
}

function timeLabel(iso: string | Date) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function submissionMap(rows: SubmissionView[]) {
  const map = new Map<string, SubmissionView>();
  for (const s of rows) map.set(s.assessmentId, s);
  return map;
}

function bucketAssignment(
  a: AssessmentView,
  sub: SubmissionView | undefined,
  now: number,
): AssignmentBucketItem['status'] {
  if (sub?.status === 'graded') return 'graded';
  if (sub?.status === 'submitted' || sub?.status === 'late') return 'submitted';
  const dueMs = a.dueAt ? new Date(a.dueAt).getTime() : null;
  if (dueMs !== null && dueMs < now) return 'overdue';
  if (dueMs !== null) {
    const sod = startOfDay().getTime();
    const eod = endOfDay().getTime();
    if (dueMs >= sod && dueMs <= eod) return 'due_today';
    if (dueMs <= endOfWeek().getTime()) return 'due_week';
    return 'upcoming';
  }
  return 'open';
}

export async function getStudentCommandCenter(userId: string) {
  const learner = await getLearner(userId).catch(() => null);
  const institutionSlug =
    learner?.activeContext?.kind === 'institution'
      ? learner.activeContext.institutionSlug
      : null;

  const [
    assignments,
    ongoing,
    classroom,
    courseData,
    bookings,
    personalTasks,
    enrollments,
    progress,
    unread,
  ] = await Promise.all([
    listPublishedForStudent({
      studentId: userId,
      institutionSlug,
      kind: 'assignment',
      page: 1,
      pageSize: 200,
    }).catch(() => [] as AssessmentView[]),
    listOngoingClassesForUser(userId).catch(() => []),
    listClassroomForUser(userId).catch(() => ({ live: [], groups: [], totalSessions: 0 })),
    getMyCourseSections(userId).catch(() => ({ sections: [], total: 0, inProgress: 0 })),
    getBookings(userId).catch(() => []),
    listPersonalTasks(userId).catch(() => []),
    getEnrollments(userId).catch(() => []),
    getProgress(userId).catch(() => []),
    unreadNotificationCount(userId).catch(() => 0),
  ]);

  const subs = await listSubmissionsForStudent(
    userId,
    assignments.map((a) => a.id),
  ).catch(() => [] as SubmissionView[]);
  const byAssessment = submissionMap(subs);
  const now = Date.now();

  const assignmentItems: AssignmentBucketItem[] = assignments.map((a) => {
    const sub = byAssessment.get(a.id);
    const status = bucketAssignment(a, sub, now);
    return {
      id: a.id,
      title: a.title,
      authorName: a.authorName,
      dueAt: a.dueAt ? new Date(a.dueAt).toISOString() : null,
      href: `/dashboard/assignments/${a.id}`,
      status,
      score: sub?.score ?? null,
      maxScore: sub?.maxScore ?? null,
      courseLabel: a.courseId || null,
    };
  });

  const buckets = {
    all: assignmentItems,
    due_today: assignmentItems.filter((a) => a.status === 'due_today'),
    due_week: assignmentItems.filter((a) => a.status === 'due_week'),
    upcoming: assignmentItems.filter((a) => a.status === 'upcoming' || a.status === 'open'),
    submitted: assignmentItems.filter((a) => a.status === 'submitted'),
    graded: assignmentItems.filter((a) => a.status === 'graded'),
    overdue: assignmentItems.filter((a) => a.status === 'overdue'),
  };

  const today: TodayItem[] = [];

  for (const s of ongoing) {
    today.push({
      id: `live-${s.id}`,
      timeLabel: 'Now',
      title: s.courseTitle,
      subtitle: `Live class · ${s.instructorName}`,
      href: `/dashboard/sessions/${s.channel}`,
      actionLabel: 'Join',
      kind: 'live_class',
      urgency: 'now',
    });
  }

  for (const a of buckets.due_today) {
    today.push({
      id: `asg-today-${a.id}`,
      timeLabel: a.dueAt ? timeLabel(a.dueAt) : 'Today',
      title: a.title,
      subtitle: `Assignment · ${a.authorName}`,
      href: a.href,
      actionLabel: 'Open',
      kind: 'assignment',
      urgency: 'today',
    });
  }

  for (const a of buckets.overdue.slice(0, 3)) {
    today.push({
      id: `asg-over-${a.id}`,
      timeLabel: 'Overdue',
      title: a.title,
      subtitle: `Was due · ${a.authorName}`,
      href: a.href,
      actionLabel: 'Submit',
      kind: 'assignment',
      urgency: 'now',
    });
  }

  const upcomingBookings = bookings.filter(
    (b) =>
      b.status === 'upcoming' &&
      new Date(b.scheduledAt).getTime() > now - 60 * 60 * 1000 &&
      new Date(b.scheduledAt).getTime() <= endOfDay().getTime(),
  );
  for (const b of upcomingBookings) {
    today.push({
      id: `book-${b.id}`,
      timeLabel: timeLabel(b.scheduledAt),
      title: b.topic || 'Mentorship session',
      subtitle: `With ${b.mentorName}`,
      href: `/dashboard/sessions/${b.channel}`,
      actionLabel: 'Join',
      kind: 'mentorship',
      urgency: 'today',
    });
  }

  for (const t of personalTasks.filter((p) => !p.done).slice(0, 3)) {
    const dueToday =
      t.dueAt &&
      new Date(t.dueAt).getTime() >= startOfDay().getTime() &&
      new Date(t.dueAt).getTime() <= endOfDay().getTime();
    if (dueToday || !t.dueAt) {
      today.push({
        id: `task-${t.id}`,
        timeLabel: t.dueAt ? timeLabel(t.dueAt) : 'Today',
        title: t.title,
        subtitle: 'Personal task',
        href: '/dashboard/todos',
        actionLabel: 'View',
        kind: 'personal',
        urgency: 'today',
      });
    }
  }

  // Continue learning cards
  const enrolled =
    courseData.sections.find((s) => s.id === 'enrolled')?.courses.filter((c) => c.enrolled) ||
    [];
  const continueLearning = enrolled
    .filter((c) => c.pct < 100)
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 4);

  const completedByCourse = new Map<string, Set<string>>();
  for (const p of progress) {
    if (!completedByCourse.has(p.courseSlug)) completedByCourse.set(p.courseSlug, new Set());
    completedByCourse.get(p.courseSlug)!.add(p.lessonSlug);
  }

  const continueWithLesson = continueLearning.map((c) => {
    const track = getCatalogTrack(c.slug);
    const done = completedByCourse.get(c.slug) ?? new Set<string>();
    const next = track ? getNextLesson(c.slug, done) : null;
    return {
      course: c,
      nextTitle: next?.title || (c.pct > 0 ? 'Continue where you left off' : 'Start the first lesson'),
      href: c.continueHref || c.href,
    };
  });

  // Also catalogue enrollments not in instructor cards
  const catalogContinue = enrollments
    .map((e) => {
      const track = getCatalogTrack(e.courseSlug);
      if (!track) return null;
      const done = completedByCourse.get(e.courseSlug) ?? new Set<string>();
      if (track.totalLessons && done.size >= track.totalLessons) return null;
      const next = getNextLesson(e.courseSlug, done);
      const pct = track.totalLessons ? Math.round((done.size / track.totalLessons) * 100) : 0;
      return {
        course: {
          id: e.courseSlug,
          slug: e.courseSlug,
          title: track.title,
          pct,
          continueHref: next
            ? `/dashboard/courses/${e.courseSlug}/${next.slug}`
            : `/dashboard/courses/${e.courseSlug}`,
          href: `/dashboard/courses/${e.courseSlug}`,
        } as Pick<MyCourseCard, 'id' | 'slug' | 'title' | 'pct' | 'continueHref' | 'href'>,
        nextTitle: next?.title || 'Continue',
        href: next
          ? `/dashboard/courses/${e.courseSlug}/${next.slug}`
          : `/dashboard/courses/${e.courseSlug}`,
      };
    })
    .filter(Boolean)
    .slice(0, 3) as {
    course: Pick<MyCourseCard, 'id' | 'slug' | 'title' | 'pct' | 'continueHref' | 'href'>;
    nextTitle: string;
    href: string;
  }[];

  const attention: AttentionItem[] = [];
  if (buckets.overdue.length) {
    attention.push({
      id: 'overdue',
      title: `${buckets.overdue.length} overdue assignment${buckets.overdue.length === 1 ? '' : 's'}`,
      detail: 'Submit as soon as you can to stay on track.',
      href: '/dashboard/assignments?bucket=overdue',
      severity: 'high',
    });
  }
  if (buckets.due_today.length) {
    attention.push({
      id: 'due-today',
      title: `${buckets.due_today.length} due today`,
      detail: 'Finish these before the day ends.',
      href: '/dashboard/assignments?bucket=due_today',
      severity: 'high',
    });
  }
  if (ongoing.length === 0 && continueWithLesson[0] && continueWithLesson[0].course.pct < 30) {
    attention.push({
      id: 'continue',
      title: 'You have a course waiting',
      detail: `Continue ${continueWithLesson[0].course.title}`,
      href: continueWithLesson[0].href,
      severity: 'medium',
    });
  }
  if (unread > 0) {
    attention.push({
      id: 'notif',
      title: `${unread} unread notification${unread === 1 ? '' : 's'}`,
      detail: 'Check academic and system updates.',
      href: '/dashboard/notifications',
      severity: 'low',
    });
  }

  const recommended = getCatalog()
    .filter((t) => !enrollments.some((e) => e.courseSlug === t.slug))
    .slice(0, 4)
    .map((t) => ({
      slug: t.slug,
      title: t.title,
      href: `/dashboard/courses/${t.slug}`,
      color: t.color,
    }));

  const learningBuckets = {
    currently: enrolled.filter((c) => c.pct > 0 && c.pct < 100),
    upcoming: enrolled.filter((c) => c.pct === 0),
    completed: enrolled.filter((c) => c.pct >= 100),
    recommended: courseData.sections
      .filter((s) => s.id.startsWith('suggested'))
      .flatMap((s) => s.courses)
      .slice(0, 8),
  };

  const focusCount = today.filter((t) => t.urgency === 'now' || t.urgency === 'today').length;

  const minutesLearned = progress.reduce((sum, p) => sum + (p.minutes || 0), 0);
  const weeklyGoal = learner?.weeklyGoalMinutes || 600;
  // Approximate "this week" minutes from recent progress (best-effort).
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
  const weeklyMinutes = progress
    .filter((p) => p.completedAt && new Date(p.completedAt).getTime() >= weekAgo)
    .reduce((sum, p) => sum + (p.minutes || 0), 0);

  return {
    learner,
    focusCount,
    today,
    attention,
    continueLearning: [...continueWithLesson, ...catalogContinue].slice(0, 5),
    assignmentBuckets: buckets,
    learningBuckets,
    personalTasks,
    recommended,
    classroom,
    stats: {
      streak: learner?.streakCount ?? 0,
      xp: learner?.xp ?? 0,
      lessonsDone: progress.length,
      hoursLearned: Math.round((minutesLearned / 60) * 10) / 10,
      weeklyHours: Math.round((weeklyMinutes / 60) * 10) / 10,
      weeklyGoalHours: Math.round((weeklyGoal / 60) * 10) / 10,
      unread,
      inProgress: courseData.inProgress,
    },
  };
}

export async function getInstructorCommandCenter(userId: string) {
  const [live, grading, bookings, books, classroom] = await Promise.all([
    listLiveClassesForInstructor(userId).catch(() => []),
    listNeedsGradingForAuthor(userId).catch(() => []),
    getMentorBookings(userId).catch(() => []),
    listBooksByAuthor(userId).catch(() => []),
    listClassroomForUser(userId).catch(() => ({ live: [], groups: [], totalSessions: 0 })),
  ]);

  const now = Date.now();
  const today: TodayItem[] = [];

  for (const s of live) {
    today.push({
      id: `live-${s.id}`,
      timeLabel: 'Now',
      title: s.courseTitle,
      subtitle: 'Live class in progress',
      href: `/dashboard/sessions/${s.channel}`,
      actionLabel: 'Teach',
      kind: 'live_class',
      urgency: 'now',
    });
  }

  for (const g of grading.slice(0, 5)) {
    today.push({
      id: `grade-${g.assessmentId}`,
      timeLabel: 'Grade',
      title: g.title,
      subtitle: `${g.pendingCount} submission${g.pendingCount === 1 ? '' : 's'} awaiting grading`,
      href: `/dashboard/teach/assessments?assessment=${g.assessmentId}`,
      actionLabel: 'Grade',
      kind: 'grading',
      urgency: 'today',
    });
  }

  const upcomingSessions = bookings.filter(
    (b) =>
      b.status === 'upcoming' &&
      new Date(b.scheduledAt).getTime() > now - 60 * 60 * 1000 &&
      new Date(b.scheduledAt).getTime() <= endOfDay().getTime(),
  );
  for (const b of upcomingSessions) {
    today.push({
      id: `ms-${String(b.id || b.channel)}`,
      timeLabel: timeLabel(b.scheduledAt),
      title: b.topic || 'Mentor session',
      subtitle: 'Mentorship',
      href: `/dashboard/sessions/${b.channel}`,
      actionLabel: 'Open',
      kind: 'mentorship',
      urgency: 'today',
    });
  }

  const attention: AttentionItem[] = [];
  const pendingGrades = grading.reduce((n, g) => n + g.pendingCount, 0);
  if (pendingGrades > 0) {
    attention.push({
      id: 'grading',
      title: `${pendingGrades} submission${pendingGrades === 1 ? '' : 's'} need grading`,
      detail: `${grading.length} assignment${grading.length === 1 ? '' : 's'} with pending work`,
      href: '/dashboard/teach/assessments',
      severity: 'high',
    });
  }
  if (live.length) {
    attention.push({
      id: 'live',
      title: `${live.length} live class${live.length === 1 ? '' : 'es'} right now`,
      detail: 'Students may be waiting in the room.',
      href: '/dashboard/classroom',
      severity: 'high',
    });
  }
  attention.push({
    id: 'courses',
    title: 'Manage your courses',
    detail: 'Update lessons, publish content, or start a class.',
    href: '/dashboard/teach/courses',
    severity: 'medium',
  });

  return {
    today,
    attention,
    grading,
    live,
    booksCount: books.length,
    classroomGroups: classroom.groups.length,
    upcomingSessions: upcomingSessions.length,
  };
}
