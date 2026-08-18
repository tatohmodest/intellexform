/**
 * Dashboard sidebar / mobile-nav count badges.
 * Always return a number (including 0) for each badged route.
 */

import { getDb } from '@/lib/repo';
import { ensureLearnCollections, listPublishedBooks } from '@/lib/learn/ecosystem';
import { unreadNotificationCount } from '@/lib/learn/notifications';
import { unreadMessageCount } from '@/lib/learn/messaging';
import { listGroupsForUser } from '@/lib/learn/classGroups';
import { listVisibleAnnouncements, getOwnFinance } from '@/lib/staff/store';
import { isOfficialStudent } from '@/lib/learn/studentAccess';
import {
  expandMentorWeeklySlots,
  listMentorWeeklySlotsForStudent,
  listPersonalCalendarEvents,
} from '@/lib/learn/calendarEvents';
import { listPublishedForStudent, listSubmissionsForStudent } from '@/lib/learn/assessments';
import { listPersonalTasks } from '@/lib/learn/personalTasks';
import { listPublishedNotesForStudent } from '@/lib/learn/notes';
import { listOpportunities } from '@/lib/learn/portfolio';
import {
  NAV_SEEN_HREFS,
  ZERO_NAV_COUNTS,
  type NavCounts,
  type NavSeenHref,
} from '@/lib/learn/navCountTypes';

export type { NavCounts, NavBadgeHref, NavSeenHref } from '@/lib/learn/navCountTypes';
export {
  NAV_BADGE_HREFS,
  NAV_SEEN_HREFS,
  ZERO_NAV_COUNTS,
  isNavBadgeHref,
} from '@/lib/learn/navCountTypes';

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

async function safe<T>(p: Promise<T>, fallback: T): Promise<T> {
  try {
    return await p;
  } catch {
    return fallback;
  }
}

async function seenCol() {
  await ensureLearnCollections();
  const db = await getDb();
  await db
    .collection('nav_seen')
    .createIndex({ userId: 1, href: 1 }, { unique: true })
    .catch(() => {});
  return db.collection('nav_seen');
}

function fallbackSince(): Date {
  return new Date(Date.now() - WEEK_MS);
}

export async function markNavSeen(userId: string, href: string): Promise<void> {
  if (!NAV_SEEN_HREFS.includes(href as NavSeenHref)) return;
  const col = await seenCol();
  await col.updateOne(
    { userId, href },
    { $set: { userId, href, seenAt: new Date() } },
    { upsert: true },
  );
}

async function seenSince(userId: string, href: NavSeenHref): Promise<Date> {
  try {
    const col = await seenCol();
    const doc = await col.findOne({ userId, href });
    if (doc?.seenAt) return new Date(doc.seenAt as string | Date);
  } catch {
    /* fall through */
  }
  return fallbackSince();
}

function createdAfter(value: unknown, since: Date): boolean {
  if (!value) return false;
  const dt = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(dt.getTime())) return false;
  return dt.getTime() > since.getTime();
}

export async function getNavCounts(userId: string): Promise<NavCounts> {
  const counts: NavCounts = { ...ZERO_NAV_COUNTS };
  if (!userId) return counts;

  const [isStudent, announceSince, communitySince, librarySince, notesSince, oppSince] = await Promise.all([
    safe(isOfficialStudent(userId), false),
    seenSince(userId, '/dashboard/announcements'),
    seenSince(userId, '/dashboard/community'),
    seenSince(userId, '/dashboard/library'),
    seenSince(userId, '/dashboard/notes'),
    seenSince(userId, '/dashboard/opportunities'),
  ]);

  const now = new Date();
  const calFrom = now;
  const calTo = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const [
    notifications,
    messages,
    announcements,
    groups,
    personalEvents,
    mentorSlots,
    assignments,
    tasks,
    books,
    notes,
    opportunities,
    finance,
  ] = await Promise.all([
    safe(unreadNotificationCount(userId), 0),
    safe(unreadMessageCount(userId), 0),
    safe(listVisibleAnnouncements({ isStudent }), []),
    safe(listGroupsForUser(userId), { classHead: false, isStaff: false, courses: [], groups: [] }),
    safe(listPersonalCalendarEvents(userId, { from: calFrom, to: calTo }), []),
    safe(listMentorWeeklySlotsForStudent(userId), []),
    safe(listPublishedForStudent({ studentId: userId, pageSize: 100 }), []),
    safe(listPersonalTasks(userId), []),
    safe(listPublishedBooks(), []),
    safe(listPublishedNotesForStudent({ studentId: userId, pageSize: 100 }), []),
    safe(listOpportunities(), []),
    safe(getOwnFinance(userId), {
      isStudent: false,
      studentCode: '',
      status: '',
      totalXAF: 0,
      paidXAF: 0,
      outstandingXAF: 0,
      charges: [],
      payments: [],
    }),
  ]);

  const newAnnouncements = announcements.filter((a) => createdAfter(a.createdAt, announceSince)).length;
  const newCommunity = announcements.filter((a) => createdAfter(a.createdAt, communitySince)).length;
  const groupUnread = groups.groups.reduce((sum, g) => sum + (Number(g.unread) || 0), 0);
  const mentorSoon = expandMentorWeeklySlots(mentorSlots, calFrom, calTo).length;
  const calendarSoon = personalEvents.length + mentorSoon;

  const assignmentIds = assignments.map((a) => a.id);
  const submissions = await safe(
    listSubmissionsForStudent(userId, assignmentIds),
    [],
  );
  const done = new Set(
    submissions
      .filter((s) => s.status === 'submitted' || s.status === 'graded' || s.status === 'late')
      .map((s) => s.assessmentId),
  );
  const openAssignments = assignments.filter((a) => !done.has(a.id)).length;
  const openTasks = tasks.filter((t) => !t.done).length;
  const newBooks = books.filter((b) => createdAfter(b.createdAt, librarySince)).length;
  const newNotes = notes.filter((n) => createdAfter(n.createdAt || n.updatedAt, notesSince)).length;
  const newOpps = opportunities.filter(
    (o) => !String(o.id).startsWith('default-') && createdAfter(o.createdAt, oppSince),
  ).length;
  const openFees = finance.charges.filter(
    (c) => Math.max(0, Number(c.amountXAF || 0) - Number(c.paidXAF || 0)) > 0 && c.status !== 'paid',
  ).length;

  counts['/dashboard/notifications'] = notifications;
  counts['/dashboard/messages'] = messages;
  counts['/dashboard/announcements'] = newAnnouncements;
  counts['/dashboard/community'] = newCommunity;
  counts['/dashboard/study-groups'] = groupUnread;
  counts['/dashboard/calendar'] = calendarSoon;
  counts['/dashboard/assignments'] = openAssignments;
  counts['/dashboard/todos'] = openTasks;
  counts['/dashboard/library'] = newBooks;
  counts['/dashboard/notes'] = newNotes;
  counts['/dashboard/opportunities'] = newOpps;
  counts['/dashboard/fees'] = openFees;

  return counts;
}
