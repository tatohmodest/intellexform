import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/repo';
import type { LBProfile } from '@/lib/auth/oauth';

/**
 * Learner data layer — users, enrollments, lesson progress, mentorship
 * bookings, XP and streaks. Every read degrades gracefully when Mongo is
 * unreachable so the dashboard still renders.
 */

export interface LearnerDoc {
  lbId: string;
  email: string;
  name: string;
  avatar?: string;
  /** Progressive roles: every account is a student; mentor/admin unlock more UI. */
  roles?: ('student' | 'mentor' | 'admin')[];
  xp: number;
  streakCount: number;
  /** YYYY-MM-DD of the last day the learner did something. */
  lastActiveDay: string | null;
  weeklyGoalMinutes: number;
  createdAt: Date;
  lastLoginAt: Date;
}

export interface EnrollmentDoc {
  userId: string;
  courseSlug: string;
  enrolledAt: Date;
  lastLessonSlug?: string;
  lastTouchedAt?: Date;
  completedAt?: Date | null;
}

export interface ProgressDoc {
  userId: string;
  courseSlug: string;
  lessonSlug: string;
  completedAt: Date;
  minutes: number;
}

export interface BookingDoc {
  _id?: ObjectId;
  userId: string;
  mentorId: string;
  mentorName: string;
  topic: string;
  scheduledAt: Date;
  durationMinutes: number;
  channel: string;
  priceXAF?: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  createdAt: Date;
}

function todayKey(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

// ── Users ─────────────────────────────────────────────────────────────────────

export async function upsertLearnerFromOAuth(profile: LBProfile): Promise<LearnerDoc> {
  const base: LearnerDoc = {
    lbId: profile.sub,
    email: profile.email ?? '',
    name: profile.name ?? 'Learner',
    avatar: profile.picture,
    xp: 0,
    streakCount: 0,
    lastActiveDay: null,
    weeklyGoalMinutes: 150,
    createdAt: new Date(),
    lastLoginAt: new Date(),
  };
  try {
    const db = await getDb();
    const col = db.collection('learners');
    await col.createIndex({ lbId: 1 }, { unique: true }).catch(() => {});
    await col.updateOne(
      { lbId: profile.sub },
      {
        $set: {
          email: base.email,
          name: base.name,
          avatar: base.avatar,
          lastLoginAt: new Date(),
        },
        $setOnInsert: {
          lbId: profile.sub,
          roles: ['student'],
          xp: 0,
          streakCount: 0,
          lastActiveDay: null,
          weeklyGoalMinutes: 150,
          createdAt: new Date(),
        },
      },
      { upsert: true },
    );
    const doc = await col.findOne({ lbId: profile.sub }, { projection: { _id: 0 } });
    return (doc as unknown as LearnerDoc) ?? base;
  } catch (err) {
    console.error('upsertLearnerFromOAuth: DB unavailable, using session-only profile', err);
    return base;
  }
}

export async function getLearner(lbId: string): Promise<LearnerDoc | null> {
  try {
    const db = await getDb();
    const doc = await db
      .collection('learners')
      .findOne({ lbId }, { projection: { _id: 0 } });
    return (doc as unknown as LearnerDoc) ?? null;
  } catch {
    return null;
  }
}

export async function updateLearnerSettings(
  lbId: string,
  patch: Partial<Pick<LearnerDoc, 'name' | 'weeklyGoalMinutes'>>,
) {
  const db = await getDb();
  await db.collection('learners').updateOne({ lbId }, { $set: patch });
}

/** Bump streak + XP for activity today. Returns the new values. */
async function touchActivity(lbId: string, xpGain: number) {
  const db = await getDb();
  const col = db.collection('learners');
  const learner = (await col.findOne({ lbId })) as unknown as LearnerDoc | null;
  if (!learner) return;
  const today = todayKey();
  let streak = learner.streakCount || 0;
  if (learner.lastActiveDay !== today) {
    const yesterday = todayKey(new Date(Date.now() - 24 * 60 * 60 * 1000));
    streak = learner.lastActiveDay === yesterday ? streak + 1 : 1;
  }
  await col.updateOne(
    { lbId },
    { $set: { lastActiveDay: today, streakCount: streak }, $inc: { xp: xpGain } },
  );
}

// ── Enrollments ───────────────────────────────────────────────────────────────

export async function getEnrollments(userId: string): Promise<EnrollmentDoc[]> {
  try {
    const db = await getDb();
    const docs = await db
      .collection('enrollments')
      .find({ userId }, { projection: { _id: 0 } })
      .sort({ lastTouchedAt: -1, enrolledAt: -1 })
      .toArray();
    return docs as unknown as EnrollmentDoc[];
  } catch {
    return [];
  }
}

export async function enroll(userId: string, courseSlug: string) {
  const db = await getDb();
  const col = db.collection('enrollments');
  await col.createIndex({ userId: 1, courseSlug: 1 }, { unique: true }).catch(() => {});
  await col.updateOne(
    { userId, courseSlug },
    {
      $setOnInsert: { userId, courseSlug, enrolledAt: new Date(), completedAt: null },
      $set: { lastTouchedAt: new Date() },
    },
    { upsert: true },
  );
  await touchActivity(userId, 10).catch(() => {});
}

// ── Lesson progress ───────────────────────────────────────────────────────────

export async function getProgress(
  userId: string,
  courseSlug?: string,
): Promise<ProgressDoc[]> {
  try {
    const db = await getDb();
    const query: Record<string, unknown> = { userId };
    if (courseSlug) query.courseSlug = courseSlug;
    const docs = await db
      .collection('lesson_progress')
      .find(query, { projection: { _id: 0 } })
      .toArray();
    return docs as unknown as ProgressDoc[];
  } catch {
    return [];
  }
}

const XP_PER_LESSON = 20;

export async function setLessonComplete(opts: {
  userId: string;
  courseSlug: string;
  lessonSlug: string;
  minutes: number;
  done: boolean;
}) {
  const db = await getDb();
  const col = db.collection('lesson_progress');
  await col
    .createIndex({ userId: 1, courseSlug: 1, lessonSlug: 1 }, { unique: true })
    .catch(() => {});
  if (opts.done) {
    const res = await col.updateOne(
      { userId: opts.userId, courseSlug: opts.courseSlug, lessonSlug: opts.lessonSlug },
      {
        $setOnInsert: {
          userId: opts.userId,
          courseSlug: opts.courseSlug,
          lessonSlug: opts.lessonSlug,
          completedAt: new Date(),
          minutes: opts.minutes,
        },
      },
      { upsert: true },
    );
    if (res.upsertedCount > 0) {
      await touchActivity(opts.userId, XP_PER_LESSON).catch(() => {});
    }
  } else {
    await col.deleteOne({
      userId: opts.userId,
      courseSlug: opts.courseSlug,
      lessonSlug: opts.lessonSlug,
    });
  }
  await db.collection('enrollments').updateOne(
    { userId: opts.userId, courseSlug: opts.courseSlug },
    { $set: { lastLessonSlug: opts.lessonSlug, lastTouchedAt: new Date() } },
  );
}

// ── Mentorship bookings ───────────────────────────────────────────────────────

export async function getBookings(userId: string): Promise<(BookingDoc & { id: string })[]> {
  try {
    const db = await getDb();
    const docs = await db
      .collection('bookings')
      .find({ userId })
      .sort({ scheduledAt: 1 })
      .toArray();
    return docs.map((d) => ({ ...(d as unknown as BookingDoc), id: d._id.toString() }));
  } catch {
    return [];
  }
}

export async function createBooking(booking: Omit<BookingDoc, 'createdAt' | 'status'>) {
  const db = await getDb();
  const doc: BookingDoc = { ...booking, status: 'upcoming', createdAt: new Date() };
  const res = await db
    .collection('bookings')
    .insertOne(doc as unknown as Record<string, unknown>);
  await touchActivity(booking.userId, 5).catch(() => {});
  return res.insertedId.toString();
}

export async function cancelBooking(userId: string, id: string) {
  const db = await getDb();
  await db
    .collection('bookings')
    .updateOne({ _id: new ObjectId(id), userId }, { $set: { status: 'cancelled' } });
}

export async function getBookingByChannel(
  userId: string,
  channel: string,
): Promise<(BookingDoc & { id: string }) | null> {
  try {
    const db = await getDb();
    const doc = await db.collection('bookings').findOne({ userId, channel });
    if (!doc) return null;
    return { ...(doc as unknown as BookingDoc), id: doc._id.toString() };
  } catch {
    return null;
  }
}
