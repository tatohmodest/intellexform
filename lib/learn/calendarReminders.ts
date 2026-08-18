/**
 * Class-time reminders: 1 day before and ~15 minutes before an event.
 * Dispatched when the learner is on the dashboard (nav-counts / notifications poll).
 */

import { getDb } from '@/lib/repo';
import { ensureLearnCollections } from '@/lib/learn/ecosystem';
import {
  expandMentorWeeklySlots,
  listMentorWeeklySlotsForStudent,
  listPersonalCalendarEvents,
} from '@/lib/learn/calendarEvents';
import { createNotification } from '@/lib/learn/notifications';

type ReminderBucket = 'day' | 'soon';

type Upcoming = {
  eventKey: string;
  title: string;
  startsAt: Date;
};

const DAY_MIN_MS = 12 * 60 * 60 * 1000;
const DAY_MAX_MS = 36 * 60 * 60 * 1000;
const SOON_MAX_MS = 30 * 60 * 1000;

async function remindersCol() {
  await ensureLearnCollections();
  const db = await getDb();
  await db
    .collection('calendar_reminders')
    .createIndex({ userId: 1, eventKey: 1, bucket: 1 }, { unique: true })
    .catch(() => {});
  return db.collection('calendar_reminders');
}

async function listUpcoming(userId: string): Promise<Upcoming[]> {
  const now = new Date();
  const from = new Date(now.getTime() - 5 * 60 * 1000);
  const to = new Date(now.getTime() + DAY_MAX_MS);
  const [personal, slots] = await Promise.all([
    listPersonalCalendarEvents(userId, { from, to }),
    listMentorWeeklySlotsForStudent(userId),
  ]);
  const mentor = expandMentorWeeklySlots(slots, from, to);
  const out: Upcoming[] = [];
  for (const e of personal) {
    out.push({
      eventKey: `personal:${e.id}`,
      title: e.title || 'Calendar event',
      startsAt: new Date(e.startsAt),
    });
  }
  for (const e of mentor) {
    out.push({
      eventKey: e.id,
      title: e.title || 'Class time',
      startsAt: new Date(e.startsAt),
    });
  }
  return out.filter((e) => Number.isFinite(e.startsAt.getTime()));
}

async function claimReminder(
  userId: string,
  eventKey: string,
  bucket: ReminderBucket,
): Promise<boolean> {
  const col = await remindersCol();
  try {
    await col.insertOne({
      userId,
      eventKey,
      bucket,
      createdAt: new Date(),
    });
    return true;
  } catch {
    return false;
  }
}

export async function dispatchCalendarReminders(userId: string): Promise<number> {
  if (!userId) return 0;
  try {
    const now = Date.now();
    const events = await listUpcoming(userId);
    let sent = 0;
    for (const event of events) {
      const ms = event.startsAt.getTime() - now;
      if (ms <= 0) continue;

      if (ms >= DAY_MIN_MS && ms <= DAY_MAX_MS) {
        if (await claimReminder(userId, event.eventKey, 'day')) {
          await createNotification({
            userId,
            title: `Coming up tomorrow: ${event.title}`,
            body: 'Your class or calendar event is about one day away. Open Calendar to review the time.',
            href: '/dashboard/calendar',
            kind: 'system',
            category: 'academic',
            data: { eventKey: event.eventKey, bucket: 'day' },
          }).catch(() => null);
          sent += 1;
        }
      }

      if (ms > 0 && ms <= SOON_MAX_MS) {
        if (await claimReminder(userId, event.eventKey, 'soon')) {
          await createNotification({
            userId,
            title: `Starting soon: ${event.title}`,
            body: 'Your class or calendar event starts in about 15 minutes.',
            href: '/dashboard/calendar',
            kind: 'system',
            category: 'academic',
            data: { eventKey: event.eventKey, bucket: 'soon' },
          }).catch(() => null);
          sent += 1;
        }
      }
    }
    return sent;
  } catch {
    return 0;
  }
}
