/**
 * Student agenda: calendar events + derived todos from assignments & live classes.
 */

import { getLearner } from '@/lib/learn/repo';
import { listPublishedForStudent } from '@/lib/learn/assessments';
import { listOngoingClassesForUser, listClassroomForUser } from '@/lib/learn/courseClassSessions';
import { getMyCourseSections } from '@/lib/learn/myCourses';

export type AgendaEvent = {
  id: string;
  title: string;
  kind: 'assignment' | 'live_class' | 'course';
  startsAt: string;
  endsAt?: string | null;
  href: string;
  meta?: string;
  status?: string;
};

export type StudentTodo = {
  id: string;
  title: string;
  detail: string;
  href: string;
  priority: 'high' | 'medium' | 'low';
  dueAt?: string | null;
  kind: 'assignment' | 'live_class' | 'course' | 'general';
  doneHint?: boolean;
};

export async function getStudentAgenda(userId: string): Promise<{
  events: AgendaEvent[];
  todos: StudentTodo[];
}> {
  const learner = await getLearner(userId).catch(() => null);
  const institutionSlug =
    learner?.activeContext?.kind === 'institution'
      ? learner.activeContext.institutionSlug
      : null;

  const [assignments, ongoing, classroom, courseData] = await Promise.all([
    listPublishedForStudent({
      studentId: userId,
      institutionSlug,
      kind: 'assignment',
      page: 1,
      pageSize: 40,
    }).catch(() => []),
    listOngoingClassesForUser(userId).catch(() => []),
    listClassroomForUser(userId).catch(() => ({ live: [], groups: [], totalSessions: 0 })),
    getMyCourseSections(userId).catch(() => ({ sections: [], total: 0, inProgress: 0 })),
  ]);

  const events: AgendaEvent[] = [];
  const todos: StudentTodo[] = [];
  const now = Date.now();

  for (const session of ongoing) {
    events.push({
      id: `live-${session.id}`,
      title: session.courseTitle,
      kind: 'live_class',
      startsAt: session.startAt,
      endsAt: session.endAt,
      href: `/dashboard/sessions/${session.channel}`,
      meta: `Live now · ${session.instructorName}`,
      status: 'live',
    });
    todos.push({
      id: `todo-live-${session.id}`,
      title: `Join live class: ${session.courseTitle}`,
      detail: `With ${session.instructorName}`,
      href: `/dashboard/sessions/${session.channel}`,
      priority: 'high',
      kind: 'live_class',
    });
  }

  for (const a of assignments) {
    if (a.dueAt) {
      const dueMs = new Date(a.dueAt).getTime();
      events.push({
        id: `asg-${a.id}`,
        title: a.title,
        kind: 'assignment',
        startsAt: new Date(a.dueAt).toISOString(),
        href: `/dashboard/assignments/${a.id}`,
        meta: `Due · ${a.authorName}`,
        status: dueMs < now ? 'overdue' : 'upcoming',
      });
    }

    const dueMs = a.dueAt ? new Date(a.dueAt).getTime() : null;
    const overdue = dueMs !== null && dueMs < now;
    const dueSoon = dueMs !== null && dueMs >= now && dueMs - now < 7 * 24 * 60 * 60 * 1000;
    if (!a.dueAt || overdue || dueSoon) {
      todos.push({
        id: `todo-asg-${a.id}`,
        title: a.title,
        detail: a.dueAt
          ? overdue
            ? `Overdue · was due ${new Date(a.dueAt).toLocaleString()}`
            : `Due ${new Date(a.dueAt).toLocaleString()}`
          : `From ${a.authorName}`,
        href: `/dashboard/assignments/${a.id}`,
        priority: overdue ? 'high' : dueSoon ? 'medium' : 'low',
        dueAt: a.dueAt ? new Date(a.dueAt).toISOString() : null,
        kind: 'assignment',
      });
    }
  }

  // Recent past live sessions still worth reviewing (last 48h ended).
  for (const group of classroom.groups || []) {
    for (const past of group.past.slice(0, 2)) {
      const end = past.endAt ? new Date(past.endAt).getTime() : 0;
      if (end && now - end < 48 * 60 * 60 * 1000) {
        events.push({
          id: `past-${past.id}`,
          title: `${past.courseTitle} (ended)`,
          kind: 'live_class',
          startsAt: past.startAt,
          endsAt: past.endAt,
          href: `/dashboard/classroom`,
          meta: 'Recent class holding',
          status: 'ended',
        });
      }
    }
  }

  // Nudge continue learning on enrolled courses.
  const enrolledSection =
    courseData.sections.find((s) => s.id === 'enrolled') ||
    courseData.sections.find((s) => s.courses.some((c) => c.enrolled));
  const continueCourses = (enrolledSection?.courses || [])
    .filter((c) => c.enrolled && c.pct < 100)
    .slice(0, 4);
  for (const c of continueCourses) {
    todos.push({
      id: `todo-course-${c.id}`,
      title: `Continue: ${c.title}`,
      detail: c.deliveryMode
        ? `${String(c.deliveryMode).replace(/_/g, ' ')} · ${Math.round(c.pct)}% complete`
        : c.kind
          ? `${c.kind} · ${Math.round(c.pct)}% complete`
          : `${Math.round(c.pct)}% complete`,
      href: c.continueHref || c.href || '/dashboard/courses',
      priority: 'low',
      kind: 'course',
    });
  }

  events.sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());

  const priorityRank = { high: 0, medium: 1, low: 2 };
  todos.sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority]);

  return { events, todos };
}
