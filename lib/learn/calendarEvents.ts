/**
 * Interactive calendar: personal events (Google Calendar–style todos) +
 * mentor-set weekly recurring school/call times for allocated students.
 */

import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/repo';
import { ensureLearnCollections } from '@/lib/learn/ecosystem';

export type CalendarEventSource = 'personal' | 'mentor';

export type PersonalCalendarEventView = {
  id: string;
  title: string;
  notes: string;
  startsAt: string;
  endsAt: string | null;
  allDay: boolean;
  source: 'personal';
  editable: true;
  kind: 'personal';
  href: string;
  meta?: string;
};

export type MentorWeeklySlotView = {
  id: string;
  mentorId: string;
  mentorName: string;
  studentId: string;
  studentName: string;
  title: string;
  /** 0 = Sunday … 6 = Saturday (JS Date.getDay()) */
  dayOfWeek: number;
  /** "HH:mm" local wall time */
  startTime: string;
  endTime: string;
  kind: 'school' | 'call' | 'mentorship';
  createdAt: string;
};

export type ExpandedCalendarEvent = {
  id: string;
  title: string;
  kind: string;
  startsAt: string;
  endsAt?: string | null;
  href: string;
  meta?: string;
  status?: string;
  source: CalendarEventSource | 'system';
  editable: boolean;
  slotId?: string;
};

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

async function eventsCol() {
  await ensureLearnCollections();
  const db = await getDb();
  await db
    .collection('calendar_events')
    .createIndex({ userId: 1, startsAt: 1 })
    .catch(() => {});
  return db.collection('calendar_events');
}

async function slotsCol() {
  await ensureLearnCollections();
  const db = await getDb();
  await Promise.all([
    db.collection('mentor_weekly_slots').createIndex({ studentId: 1, dayOfWeek: 1 }),
    db.collection('mentor_weekly_slots').createIndex({ mentorId: 1, studentId: 1 }),
  ]).catch(() => {});
  return db.collection('mentor_weekly_slots');
}

function parseTime(hhmm: string): { h: number; m: number } | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm.trim());
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h < 0 || h > 23 || min < 0 || min > 59) return null;
  return { h, m: min };
}

function toPersonalView(d: Record<string, unknown>): PersonalCalendarEventView {
  return {
    id: String((d._id as ObjectId).toString()),
    title: String(d.title || ''),
    notes: String(d.notes || ''),
    startsAt: new Date(d.startsAt as string | Date).toISOString(),
    endsAt: d.endsAt ? new Date(d.endsAt as string | Date).toISOString() : null,
    allDay: Boolean(d.allDay),
    source: 'personal',
    editable: true,
    kind: 'personal',
    href: '/dashboard/calendar',
    meta: d.notes ? String(d.notes).slice(0, 80) : 'Your event',
  };
}

function toSlotView(d: Record<string, unknown>): MentorWeeklySlotView {
  return {
    id: String((d._id as ObjectId).toString()),
    mentorId: String(d.mentorId || ''),
    mentorName: String(d.mentorName || 'Mentor'),
    studentId: String(d.studentId || ''),
    studentName: String(d.studentName || 'Student'),
    title: String(d.title || 'Scheduled time'),
    dayOfWeek: Number(d.dayOfWeek) || 0,
    startTime: String(d.startTime || '09:00'),
    endTime: String(d.endTime || '10:00'),
    kind: (['school', 'call', 'mentorship'].includes(String(d.kind))
      ? String(d.kind)
      : 'call') as MentorWeeklySlotView['kind'],
    createdAt: new Date(d.createdAt as string | Date).toISOString(),
  };
}

export async function listPersonalCalendarEvents(
  userId: string,
  opts?: { from?: Date; to?: Date },
): Promise<PersonalCalendarEventView[]> {
  try {
    const c = await eventsCol();
    const filter: Record<string, unknown> = { userId };
    if (opts?.from || opts?.to) {
      filter.startsAt = {};
      if (opts.from) (filter.startsAt as Record<string, Date>).$gte = opts.from;
      if (opts.to) (filter.startsAt as Record<string, Date>).$lte = opts.to;
    }
    const docs = await c.find(filter).sort({ startsAt: 1 }).limit(200).toArray();
    return docs.map((d) => toPersonalView(d as Record<string, unknown>));
  } catch {
    return [];
  }
}

export async function createPersonalCalendarEvent(opts: {
  userId: string;
  title: string;
  notes?: string;
  startsAt: string;
  endsAt?: string | null;
  allDay?: boolean;
}): Promise<PersonalCalendarEventView> {
  const title = opts.title.trim().slice(0, 160);
  if (title.length < 1) throw new Error('Title required');
  const startsAt = new Date(opts.startsAt);
  if (Number.isNaN(startsAt.getTime())) throw new Error('Invalid start time');
  let endsAt: Date | null = null;
  if (opts.endsAt) {
    endsAt = new Date(opts.endsAt);
    if (Number.isNaN(endsAt.getTime())) endsAt = null;
  }
  const now = new Date();
  const doc = {
    userId: opts.userId,
    title,
    notes: (opts.notes || '').trim().slice(0, 800),
    startsAt,
    endsAt,
    allDay: Boolean(opts.allDay),
    createdAt: now,
    updatedAt: now,
  };
  const c = await eventsCol();
  const res = await c.insertOne(doc);
  return toPersonalView({ ...doc, _id: res.insertedId });
}

export async function updatePersonalCalendarEvent(opts: {
  userId: string;
  id: string;
  title?: string;
  notes?: string;
  startsAt?: string;
  endsAt?: string | null;
  allDay?: boolean;
}): Promise<PersonalCalendarEventView | null> {
  const c = await eventsCol();
  let oid: ObjectId;
  try {
    oid = new ObjectId(opts.id);
  } catch {
    return null;
  }
  const patch: Record<string, unknown> = { updatedAt: new Date() };
  if (typeof opts.title === 'string' && opts.title.trim()) {
    patch.title = opts.title.trim().slice(0, 160);
  }
  if (typeof opts.notes === 'string') patch.notes = opts.notes.trim().slice(0, 800);
  if (opts.startsAt) {
    const d = new Date(opts.startsAt);
    if (!Number.isNaN(d.getTime())) patch.startsAt = d;
  }
  if (opts.endsAt === null) patch.endsAt = null;
  else if (opts.endsAt) {
    const d = new Date(opts.endsAt);
    if (!Number.isNaN(d.getTime())) patch.endsAt = d;
  }
  if (typeof opts.allDay === 'boolean') patch.allDay = opts.allDay;
  await c.updateOne({ _id: oid, userId: opts.userId }, { $set: patch });
  const doc = await c.findOne({ _id: oid, userId: opts.userId });
  return doc ? toPersonalView(doc as Record<string, unknown>) : null;
}

export async function deletePersonalCalendarEvent(userId: string, id: string): Promise<boolean> {
  const c = await eventsCol();
  let oid: ObjectId;
  try {
    oid = new ObjectId(id);
  } catch {
    return false;
  }
  const res = await c.deleteOne({ _id: oid, userId });
  return res.deletedCount > 0;
}

export async function listMentorWeeklySlotsForStudent(
  studentId: string,
): Promise<MentorWeeklySlotView[]> {
  try {
    const c = await slotsCol();
    const docs = await c.find({ studentId }).sort({ dayOfWeek: 1, startTime: 1 }).toArray();
    return docs.map((d) => toSlotView(d as Record<string, unknown>));
  } catch {
    return [];
  }
}

export async function listMentorWeeklySlotsByMentor(
  mentorId: string,
  studentId?: string,
): Promise<MentorWeeklySlotView[]> {
  try {
    const c = await slotsCol();
    const filter: Record<string, unknown> = { mentorId };
    if (studentId) filter.studentId = studentId;
    const docs = await c.find(filter).sort({ studentName: 1, dayOfWeek: 1, startTime: 1 }).toArray();
    return docs.map((d) => toSlotView(d as Record<string, unknown>));
  } catch {
    return [];
  }
}

export async function createMentorWeeklySlot(opts: {
  mentorId: string;
  mentorName: string;
  studentId: string;
  studentName: string;
  title?: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  kind?: MentorWeeklySlotView['kind'];
}): Promise<MentorWeeklySlotView> {
  const dayOfWeek = Math.max(0, Math.min(6, Math.floor(opts.dayOfWeek)));
  const start = parseTime(opts.startTime);
  const end = parseTime(opts.endTime);
  if (!start || !end) throw new Error('Invalid time');
  const startMins = start.h * 60 + start.m;
  const endMins = end.h * 60 + end.m;
  if (endMins <= startMins) throw new Error('End must be after start');

  const kind = opts.kind || 'call';
  const title =
    (opts.title || '').trim().slice(0, 120) ||
    (kind === 'school' ? 'School time' : kind === 'mentorship' ? 'Mentorship' : 'Call with mentor');

  const now = new Date();
  const doc = {
    mentorId: opts.mentorId,
    mentorName: opts.mentorName.slice(0, 120),
    studentId: opts.studentId,
    studentName: opts.studentName.slice(0, 120),
    title,
    dayOfWeek,
    startTime: `${String(start.h).padStart(2, '0')}:${String(start.m).padStart(2, '0')}`,
    endTime: `${String(end.h).padStart(2, '0')}:${String(end.m).padStart(2, '0')}`,
    kind,
    createdAt: now,
    updatedAt: now,
  };
  const c = await slotsCol();
  const res = await c.insertOne(doc);
  return toSlotView({ ...doc, _id: res.insertedId });
}

export async function deleteMentorWeeklySlot(opts: {
  id: string;
  mentorId: string;
}): Promise<boolean> {
  const c = await slotsCol();
  let oid: ObjectId;
  try {
    oid = new ObjectId(opts.id);
  } catch {
    return false;
  }
  const res = await c.deleteOne({ _id: oid, mentorId: opts.mentorId });
  return res.deletedCount > 0;
}

/** Expand weekly mentor slots into concrete occurrences in [from, to]. */
export function expandMentorWeeklySlots(
  slots: MentorWeeklySlotView[],
  from: Date,
  to: Date,
): ExpandedCalendarEvent[] {
  const events: ExpandedCalendarEvent[] = [];
  const cursor = new Date(from);
  cursor.setHours(0, 0, 0, 0);
  const end = new Date(to);
  end.setHours(23, 59, 59, 999);

  while (cursor <= end) {
    const dow = cursor.getDay();
    for (const slot of slots) {
      if (slot.dayOfWeek !== dow) continue;
      const start = parseTime(slot.startTime);
      const finish = parseTime(slot.endTime);
      if (!start || !finish) continue;
      const startsAt = new Date(cursor);
      startsAt.setHours(start.h, start.m, 0, 0);
      const endsAt = new Date(cursor);
      endsAt.setHours(finish.h, finish.m, 0, 0);
      if (startsAt < from || startsAt > end) continue;
      const dateKey = startsAt.toISOString().slice(0, 10);
      events.push({
        id: `mentor-slot-${slot.id}-${dateKey}`,
        title: slot.title,
        kind: slot.kind,
        startsAt: startsAt.toISOString(),
        endsAt: endsAt.toISOString(),
        href: '/dashboard/calendar',
        meta: `Set by ${slot.mentorName} · every ${DAY_NAMES[slot.dayOfWeek]}`,
        status: 'locked',
        source: 'mentor',
        editable: false,
        slotId: slot.id,
      });
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return events;
}

export { DAY_NAMES };

/** Build a wide window of expanded calendar items for the UI. */
export async function getInteractiveCalendarPayload(userId: string): Promise<{
  personal: PersonalCalendarEventView[];
  mentorSlots: MentorWeeklySlotView[];
  mentorEvents: ExpandedCalendarEvent[];
}> {
  const from = new Date();
  from.setDate(from.getDate() - 14);
  from.setHours(0, 0, 0, 0);
  const to = new Date();
  to.setDate(to.getDate() + 90);
  to.setHours(23, 59, 59, 999);

  const [personal, mentorSlots] = await Promise.all([
    listPersonalCalendarEvents(userId, { from, to }),
    listMentorWeeklySlotsForStudent(userId),
  ]);

  return {
    personal,
    mentorSlots,
    mentorEvents: expandMentorWeeklySlots(mentorSlots, from, to),
  };
}
