import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/repo';
import type { LBProfile } from '@/lib/auth/oauth';
import type {
  ActiveContext,
  Affiliation,
  JoinPath,
  PrimaryIntent,
} from '@/lib/learn/identity';
import { PERSONAL_CONTEXT } from '@/lib/learn/identity';
import { XP } from '@/lib/learn/xp';

/**
 * Learner data layer - global InTelleX identity, enrollments, progress,
 * mentorship bookings, XP and streaks. Affiliations attach campuses to the
 * same passport; they never create a second account.
 */

export interface LearnerDoc {
  lbId: string;
  email: string;
  name: string;
  avatar?: string;
  /** Progressive platform roles (mentor/admin unlock more UI). */
  roles?: ('student' | 'mentor' | 'admin')[];
  /** First-run onboarding finished. */
  onboardingComplete?: boolean;
  primaryIntent?: PrimaryIntent | null;
  joinPath?: JoinPath | null;
  /** Campus / org affiliations on this global identity. */
  affiliations?: Affiliation[];
  /** Current workspace context (Personal / campus / teaching…). */
  activeContext?: ActiveContext;
  xp: number;
  streakCount: number;
  /** YYYY-MM-DD of the last day the learner did something. */
  lastActiveDay: string | null;
  weeklyGoalMinutes: number;
  /** Preferences - locale, notifications, motion, career profile. */
  preferences?: {
    locale?: string;
    emailNotifications?: boolean;
    sessionReminders?: boolean;
    reducedMotion?: boolean;
    marketingEmails?: boolean;
    /** Category notification toggles (default on). */
    notifyAcademic?: boolean;
    notifySocial?: boolean;
    notifyInstitution?: boolean;
    notifySystem?: boolean;
    bio?: string;
    skills?: string[];
    goals?: string[];
    portfolioPublic?: boolean;
    portfolioSlug?: string;
  };
  /** Latest instructor badge label after mentor approval. */
  instructorBadge?: string | null;
  instructorBadgeLabels?: string[];
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
  completedAt?: Date | null;
  minutes: number;
  /** Last playback position for resume (seconds). */
  lastPositionSec?: number;
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
  /** True when the student paid via PayUnit before the booking was created. */
  paid?: boolean;
  platformXAF?: number;
  instructorXAF?: number;
  commissionRate?: number;
  isTrial?: boolean;
  transactionId?: string;
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
    roles: ['student'],
    onboardingComplete: false,
    primaryIntent: null,
    joinPath: null,
    affiliations: [],
    activeContext: PERSONAL_CONTEXT,
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
          onboardingComplete: false,
          primaryIntent: null,
          joinPath: null,
          affiliations: [],
          activeContext: PERSONAL_CONTEXT,
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
  patch: Partial<
    Pick<LearnerDoc, 'name' | 'weeklyGoalMinutes' | 'avatar' | 'preferences'>
  >,
) {
  const db = await getDb();
  const $set: Record<string, unknown> = {};
  if (patch.name !== undefined) $set.name = patch.name;
  if (patch.weeklyGoalMinutes !== undefined) $set.weeklyGoalMinutes = patch.weeklyGoalMinutes;
  if (patch.avatar !== undefined) $set.avatar = patch.avatar;
  if (patch.preferences !== undefined) {
    for (const [k, v] of Object.entries(patch.preferences)) {
      $set[`preferences.${k}`] = v;
    }
  }
  if (Object.keys($set).length === 0) return;
  await db.collection('learners').updateOne({ lbId }, { $set });
}

/** Complete first-run onboarding - identity stays global; intent only personalizes. */
export async function completeLearnerOnboarding(
  lbId: string,
  opts: {
    primaryIntent: PrimaryIntent;
    joinPath?: JoinPath | null;
  },
): Promise<LearnerDoc | null> {
  const db = await getDb();
  const path = opts.joinPath === 'exploring' ? 'intellex' : opts.joinPath;
  const activeContext: ActiveContext =
    opts.primaryIntent === 'teach' && path === 'intellex'
      ? { kind: 'teaching', institutionSlug: null }
      : PERSONAL_CONTEXT;

  await db.collection('learners').updateOne(
    { lbId },
    {
      $set: {
        onboardingComplete: true,
        primaryIntent: opts.primaryIntent,
        joinPath: path ?? null,
        activeContext,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        lbId,
        roles: ['student'],
        affiliations: [],
        xp: 0,
        streakCount: 0,
        lastActiveDay: null,
        weeklyGoalMinutes: 150,
        createdAt: new Date(),
      },
    },
    { upsert: true },
  );
  return getLearner(lbId);
}

/** Attach a campus affiliation to the global identity (never a second account). */
export async function upsertAffiliation(
  lbId: string,
  affiliation: Affiliation,
): Promise<LearnerDoc | null> {
  const db = await getDb();
  const learner = await getLearner(lbId);
  const existing = learner?.affiliations ?? [];
  const prior = existing.find((a) => a.institutionSlug === affiliation.institutionSlug);
  const merged: Affiliation = {
    ...prior,
    ...affiliation,
    profileComplete: affiliation.profileComplete ?? prior?.profileComplete ?? false,
  };
  const without = existing.filter((a) => a.institutionSlug !== affiliation.institutionSlug);
  const affiliations = [...without, merged];
  await db.collection('learners').updateOne(
    { lbId },
    {
      $set: {
        affiliations,
        activeContext: {
          kind: 'institution',
          institutionSlug: affiliation.institutionSlug,
        },
        updatedAt: new Date(),
      },
    },
  );
  return getLearner(lbId);
}

export async function completeCampusProfile(
  lbId: string,
  institutionSlug: string,
  patch: {
    program?: string;
    year?: string;
    emergencyContact?: string;
    photoUrl?: string;
    department?: string;
  },
): Promise<LearnerDoc | null> {
  const learner = await getLearner(lbId);
  const existing = learner?.affiliations ?? [];
  const idx = existing.findIndex((a) => a.institutionSlug === institutionSlug);
  if (idx < 0) return null;
  const next = [...existing];
  next[idx] = {
    ...next[idx],
    program: patch.program?.trim() || next[idx].program || null,
    year: patch.year?.trim() || next[idx].year || null,
    emergencyContact: patch.emergencyContact?.trim() || next[idx].emergencyContact || null,
    photoUrl: patch.photoUrl?.trim() || next[idx].photoUrl || null,
    department: patch.department?.trim() || next[idx].department || null,
    profileComplete: true,
  };
  const db = await getDb();
  await db.collection('learners').updateOne(
    { lbId },
    { $set: { affiliations: next, updatedAt: new Date() } },
  );
  return getLearner(lbId);
}

export async function setActiveContext(
  lbId: string,
  context: ActiveContext,
): Promise<LearnerDoc | null> {
  const db = await getDb();
  await db.collection('learners').updateOne(
    { lbId },
    { $set: { activeContext: context, updatedAt: new Date() } },
  );
  return getLearner(lbId);
}

/**
 * Bump streak + XP for activity today (learner or instructor).
 * No-ops when the user has no learner passport yet.
 */
export async function awardXp(lbId: string, xpGain: number) {
  if (!lbId || xpGain <= 0) return;
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
  let mongo: EnrollmentDoc[] = [];
  try {
    const db = await getDb();
    const docs = await db
      .collection('enrollments')
      .find({ userId }, { projection: { _id: 0 } })
      .sort({ lastTouchedAt: -1, enrolledAt: -1 })
      .toArray();
    mongo = docs as unknown as EnrollmentDoc[];
  } catch {
    mongo = [];
  }

  // Phase 4: merge Prisma org LMS enrollments (preferred for tenant courses).
  let prismaRows: EnrollmentDoc[] = [];
  try {
    const { resolvePrismaUserId, listPrismaEnrollmentsForUser } = await import(
      '@/lib/orgLms/learnerPlane'
    );
    const learner = await getLearner(userId).catch(() => null);
    const prismaUserId = await resolvePrismaUserId({
      userId,
      email: learner?.email,
    });
    if (prismaUserId) {
      prismaRows = await listPrismaEnrollmentsForUser(prismaUserId);
    }
  } catch {
    prismaRows = [];
  }

  const bySlug = new Map<string, EnrollmentDoc>();
  for (const row of mongo) bySlug.set(row.courseSlug, row);
  for (const row of prismaRows) bySlug.set(row.courseSlug, row);
  return Array.from(bySlug.values()).sort((a, b) => {
    const at = new Date(a.lastTouchedAt || a.enrolledAt).getTime();
    const bt = new Date(b.lastTouchedAt || b.enrolledAt).getTime();
    return bt - at;
  });
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
  await awardXp(userId, XP.ENROLL_TRACK).catch(() => {});
}

// ── Lesson progress ───────────────────────────────────────────────────────────

export async function getProgress(
  userId: string,
  courseSlug?: string,
): Promise<ProgressDoc[]> {
  let mongo: ProgressDoc[] = [];
  try {
    const db = await getDb();
    const query: Record<string, unknown> = { userId };
    if (courseSlug) query.courseSlug = courseSlug;
    const docs = await db
      .collection('lesson_progress')
      .find(query, { projection: { _id: 0 } })
      .toArray();
    mongo = docs as unknown as ProgressDoc[];
  } catch {
    mongo = [];
  }

  let prismaRows: ProgressDoc[] = [];
  try {
    const { resolvePrismaUserId, listPrismaProgressForUser } = await import(
      '@/lib/orgLms/learnerPlane'
    );
    const learner = await getLearner(userId).catch(() => null);
    const prismaUserId = await resolvePrismaUserId({
      userId,
      email: learner?.email,
    });
    if (prismaUserId) {
      prismaRows = await listPrismaProgressForUser(prismaUserId, courseSlug);
    }
  } catch {
    prismaRows = [];
  }

  const key = (p: ProgressDoc) => `${p.courseSlug}::${p.lessonSlug}`;
  const map = new Map<string, ProgressDoc>();
  for (const row of mongo) map.set(key(row), row);
  for (const row of prismaRows) map.set(key(row), row);
  return Array.from(map.values());
}

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
    const existing = await col.findOne({
      userId: opts.userId,
      courseSlug: opts.courseSlug,
      lessonSlug: opts.lessonSlug,
    });
    const res = await col.updateOne(
      { userId: opts.userId, courseSlug: opts.courseSlug, lessonSlug: opts.lessonSlug },
      {
        $set: {
          completedAt: existing?.completedAt || new Date(),
          minutes: opts.minutes,
          userId: opts.userId,
          courseSlug: opts.courseSlug,
          lessonSlug: opts.lessonSlug,
        },
      },
      { upsert: true },
    );
    if (res.upsertedCount > 0 || !existing?.completedAt) {
      if (!existing?.completedAt) {
        await awardXp(opts.userId, XP.COMPLETE_LESSON).catch(() => {});
      }
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

/** Persist video/audio playback position without marking complete. */
export async function setLessonPosition(opts: {
  userId: string;
  courseSlug: string;
  lessonSlug: string;
  positionSec: number;
  minutes?: number;
}) {
  const db = await getDb();
  const col = db.collection('lesson_progress');
  await col
    .createIndex({ userId: 1, courseSlug: 1, lessonSlug: 1 }, { unique: true })
    .catch(() => {});
  const positionSec = Math.max(0, Math.round(opts.positionSec));
  await col.updateOne(
    {
      userId: opts.userId,
      courseSlug: opts.courseSlug,
      lessonSlug: opts.lessonSlug,
    },
    {
      $set: {
        lastPositionSec: positionSec,
        userId: opts.userId,
        courseSlug: opts.courseSlug,
        lessonSlug: opts.lessonSlug,
        minutes: opts.minutes ?? Math.max(1, Math.round(positionSec / 60)),
      },
      $setOnInsert: {
        completedAt: null,
      },
    },
    { upsert: true },
  );
  await db.collection('enrollments').updateOne(
    { userId: opts.userId, courseSlug: opts.courseSlug },
    { $set: { lastLessonSlug: opts.lessonSlug, lastTouchedAt: new Date() } },
    { upsert: false },
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
  await awardXp(booking.userId, XP.BOOK_MENTORSHIP).catch(() => {});
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
