import { ObjectId } from 'mongodb';
import crypto from 'crypto';
import { getDb } from '@/lib/repo';
import { ensureLearnCollections } from '@/lib/learn/ecosystem';

export type CourseClassSessionStatus = 'live' | 'ended';

export type CourseClassSessionDoc = {
  _id?: ObjectId;
  courseId: string;
  courseTitle: string;
  instructorId: string;
  instructorName: string;
  /** Agora channel — students join via /dashboard/sessions/{channel} */
  channel: string;
  status: CourseClassSessionStatus;
  startAt: Date;
  endAt: Date | null;
  createdAt: Date;
};

export type CourseClassSessionView = {
  id: string;
  courseId: string;
  courseTitle: string;
  instructorId: string;
  instructorName: string;
  channel: string;
  status: CourseClassSessionStatus;
  startAt: string;
  endAt: string | null;
  createdAt: string;
  /** Minutes between start and end (or now if still live). */
  durationMinutes: number;
};

let ensured = false;

export async function ensureCourseClassSessionCollection() {
  await ensureLearnCollections();
  if (ensured) return;
  const db = await getDb();
  const names = new Set(
    (await db.listCollections({}, { nameOnly: true }).toArray()).map((c) => c.name),
  );
  if (!names.has('course_class_sessions')) {
    await db.createCollection('course_class_sessions').catch(() => {});
  }
  await Promise.all([
    db.collection('course_class_sessions').createIndex({ courseId: 1, status: 1 }),
    db.collection('course_class_sessions').createIndex({ instructorId: 1, startAt: -1 }),
    db.collection('course_class_sessions').createIndex({ channel: 1 }, { unique: true }),
    db.collection('course_class_sessions').createIndex({ status: 1, startAt: -1 }),
  ]).catch(() => {});
  ensured = true;
}

function toView(d: Record<string, unknown>): CourseClassSessionView {
  const startAt = new Date(d.startAt as string | Date);
  const endAt = d.endAt ? new Date(d.endAt as string | Date) : null;
  const endMs = endAt ? endAt.getTime() : Date.now();
  const durationMinutes = Math.max(0, Math.round((endMs - startAt.getTime()) / 60000));
  return {
    id: String((d._id as ObjectId).toString()),
    courseId: String(d.courseId),
    courseTitle: String(d.courseTitle || 'Course'),
    instructorId: String(d.instructorId),
    instructorName: String(d.instructorName || 'Instructor'),
    channel: String(d.channel),
    status: d.status === 'ended' ? 'ended' : 'live',
    startAt: startAt.toISOString(),
    endAt: endAt ? endAt.toISOString() : null,
    createdAt: new Date(d.createdAt as string | Date).toISOString(),
    durationMinutes,
  };
}

/** Active live class for a course, if any. */
export async function getLiveClassForCourse(
  courseId: string,
): Promise<CourseClassSessionView | null> {
  try {
    await ensureCourseClassSessionCollection();
    const db = await getDb();
    const doc = await db.collection('course_class_sessions').findOne({
      courseId,
      status: 'live',
    });
    return doc ? toView(doc as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

/** Map of courseId → live session for enrolled course cards. */
export async function getLiveClassesForCourses(
  courseIds: string[],
): Promise<Map<string, CourseClassSessionView>> {
  const map = new Map<string, CourseClassSessionView>();
  const ids = Array.from(new Set(courseIds.filter(Boolean)));
  if (!ids.length) return map;
  try {
    await ensureCourseClassSessionCollection();
    const db = await getDb();
    const docs = await db
      .collection('course_class_sessions')
      .find({ courseId: { $in: ids }, status: 'live' })
      .toArray();
    for (const doc of docs) {
      const view = toView(doc as Record<string, unknown>);
      map.set(view.courseId, view);
    }
  } catch {
    /* ignore */
  }
  return map;
}

export async function getClassSessionByChannel(
  channel: string,
): Promise<CourseClassSessionView | null> {
  try {
    await ensureCourseClassSessionCollection();
    const db = await getDb();
    const doc = await db.collection('course_class_sessions').findOne({ channel });
    return doc ? toView(doc as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export async function getClassSessionById(
  id: string,
): Promise<CourseClassSessionView | null> {
  try {
    await ensureCourseClassSessionCollection();
    const db = await getDb();
    const oid = new ObjectId(id);
    const doc = await db.collection('course_class_sessions').findOne({ _id: oid });
    return doc ? toView(doc as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

/** Live sessions across courses owned/taught by this instructor. */
export async function listLiveClassesForInstructor(
  instructorId: string,
): Promise<CourseClassSessionView[]> {
  try {
    await ensureCourseClassSessionCollection();
    const db = await getDb();
    const docs = await db
      .collection('course_class_sessions')
      .find({ instructorId, status: 'live' })
      .sort({ startAt: -1 })
      .toArray();
    return docs.map((d) => toView(d as Record<string, unknown>));
  } catch {
    return [];
  }
}

/**
 * Start a live class for a course. Ends any existing live session on that
 * course first (shouldn't happen often), then creates a new one.
 */
export async function startCourseClass(opts: {
  courseId: string;
  courseTitle: string;
  instructorId: string;
  instructorName: string;
}): Promise<CourseClassSessionView> {
  await ensureCourseClassSessionCollection();
  const db = await getDb();
  const now = new Date();

  // Close any stray live session on this course.
  await db.collection('course_class_sessions').updateMany(
    { courseId: opts.courseId, status: 'live' },
    { $set: { status: 'ended', endAt: now } },
  );

  const channel = `cls-${opts.courseId.slice(0, 16)}-${crypto.randomBytes(3).toString('hex')}`;
  const doc: CourseClassSessionDoc = {
    courseId: opts.courseId,
    courseTitle: opts.courseTitle.slice(0, 160),
    instructorId: opts.instructorId,
    instructorName: opts.instructorName.slice(0, 120),
    channel,
    status: 'live',
    startAt: now,
    endAt: null,
    createdAt: now,
  };
  const res = await db.collection('course_class_sessions').insertOne(doc);
  return toView({ ...doc, _id: res.insertedId } as unknown as Record<string, unknown>);
}

/** Mark a live class as ended. Only the host instructor may end it. */
export async function endCourseClass(
  sessionId: string,
  instructorId: string,
): Promise<CourseClassSessionView | null> {
  await ensureCourseClassSessionCollection();
  const db = await getDb();
  let oid: ObjectId;
  try {
    oid = new ObjectId(sessionId);
  } catch {
    return null;
  }
  const existing = await db.collection('course_class_sessions').findOne({ _id: oid });
  if (!existing) return null;
  if (String(existing.instructorId) !== instructorId) return null;

  const now = new Date();
  if (existing.status === 'live') {
    await db.collection('course_class_sessions').updateOne(
      { _id: oid },
      { $set: { status: 'ended', endAt: now } },
    );
  }
  const updated = await db.collection('course_class_sessions').findOne({ _id: oid });
  return updated ? toView(updated as Record<string, unknown>) : null;
}

/** Recent class sessions for admin verification (start/end audit). */
export async function listRecentCourseClasses(
  limit = 50,
): Promise<CourseClassSessionView[]> {
  try {
    await ensureCourseClassSessionCollection();
    const db = await getDb();
    const docs = await db
      .collection('course_class_sessions')
      .find({})
      .sort({ startAt: -1 })
      .limit(limit)
      .toArray();
    return docs.map((d) => toView(d as Record<string, unknown>));
  } catch {
    return [];
  }
}

export async function countCourseClassSessions(): Promise<number> {
  try {
    await ensureCourseClassSessionCollection();
    const db = await getDb();
    return db.collection('course_class_sessions').countDocuments();
  } catch {
    return 0;
  }
}
