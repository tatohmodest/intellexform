import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/repo';
import { ensureLearnCollections } from '@/lib/learn/ecosystem';

export type NotificationDoc = {
  _id?: ObjectId;
  userId: string;
  title: string;
  body: string;
  href?: string | null;
  kind: 'assignment' | 'exam' | 'system' | 'badge' | 'note' | 'message';
  data?: Record<string, unknown>;
  readAt?: Date | null;
  createdAt: Date;
};

export type NotificationView = {
  id: string;
  userId: string;
  title: string;
  body: string;
  href?: string | null;
  kind: NotificationDoc['kind'];
  data?: Record<string, unknown>;
  readAt?: string | null;
  createdAt: string;
};

async function ensureNotificationCollections() {
  await ensureLearnCollections();
  const db = await getDb();
  const names = new Set(
    (await db.listCollections({}, { nameOnly: true }).toArray()).map((c) => c.name),
  );
  if (!names.has('notifications')) {
    await db.createCollection('notifications').catch(() => {});
  }
  await Promise.all([
    db.collection('notifications').createIndex({ userId: 1, createdAt: -1 }),
    db.collection('notifications').createIndex({ userId: 1, readAt: 1 }),
  ]).catch(() => {});
}

function toView(d: Record<string, unknown>): NotificationView {
  const id = String((d._id as ObjectId).toString());
  const readAt = d.readAt ? new Date(d.readAt as string | Date).toISOString() : null;
  const createdAt = new Date(d.createdAt as string | Date).toISOString();
  return {
    id,
    userId: String(d.userId),
    title: String(d.title),
    body: String(d.body),
    href: (d.href as string) || null,
    kind: (d.kind as NotificationDoc['kind']) || 'system',
    data: (d.data as Record<string, unknown>) || undefined,
    readAt,
    createdAt,
  };
}

export async function createNotification(opts: {
  userId: string;
  title: string;
  body: string;
  href?: string | null;
  kind?: NotificationDoc['kind'];
  data?: Record<string, unknown>;
}): Promise<string> {
  await ensureNotificationCollections();
  const db = await getDb();
  const res = await db.collection('notifications').insertOne({
    userId: opts.userId,
    title: opts.title.slice(0, 160),
    body: opts.body.slice(0, 1000),
    href: opts.href || null,
    kind: opts.kind || 'system',
    data: opts.data || {},
    readAt: null,
    createdAt: new Date(),
  });
  return res.insertedId.toString();
}

export async function createNotificationsForUsers(
  userIds: string[],
  payload: Omit<Parameters<typeof createNotification>[0], 'userId'>,
): Promise<number> {
  const unique = Array.from(new Set(userIds.filter(Boolean)));
  if (!unique.length) return 0;
  await ensureNotificationCollections();
  const db = await getDb();
  const now = new Date();
  const docs = unique.map((userId) => ({
    userId,
    title: payload.title.slice(0, 160),
    body: payload.body.slice(0, 1000),
    href: payload.href || null,
    kind: payload.kind || 'system',
    data: payload.data || {},
    readAt: null,
    createdAt: now,
  }));
  const res = await db.collection('notifications').insertMany(docs);
  return res.insertedCount;
}

export async function listNotifications(
  userId: string,
  limit = 40,
  opts?: { page?: number },
): Promise<NotificationView[]> {
  await ensureNotificationCollections();
  const db = await getDb();
  const page = Math.max(1, Number(opts?.page) || 1);
  const skip = (page - 1) * Math.max(1, limit);
  const docs = await db
    .collection('notifications')
    .find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();
  return docs.map((d) => toView(d as Record<string, unknown>));
}

export async function unreadNotificationCount(userId: string): Promise<number> {
  await ensureNotificationCollections();
  const db = await getDb();
  return db.collection('notifications').countDocuments({ userId, readAt: null });
}

export async function markNotificationsRead(
  userId: string,
  ids?: string[],
): Promise<void> {
  await ensureNotificationCollections();
  const db = await getDb();
  const filter: Record<string, unknown> = { userId, readAt: null };
  if (ids?.length) {
    filter._id = {
      $in: ids
        .map((id) => {
          try {
            return new ObjectId(id);
          } catch {
            return null;
          }
        })
        .filter(Boolean),
    };
  }
  await db.collection('notifications').updateMany(filter, { $set: { readAt: new Date() } });
}

/** Students to notify when an assessment is published. */
export async function resolveAssignmentAudience(opts: {
  authorId: string;
  institutionSlug?: string | null;
  courseId?: string | null;
  recipientMode?: 'all' | 'course' | 'students';
  recipientStudentIds?: string[];
}): Promise<string[]> {
  const db = await getDb();

  if (opts.recipientMode === 'students') {
    return Array.from(
      new Set((opts.recipientStudentIds || []).map((id) => String(id || '').trim())),
    ).filter((id) => id && id !== opts.authorId);
  }

  // Prefer course roster when the assessment is tied to a teacher course.
  if (opts.recipientMode === 'course' || opts.courseId) {
    const [teacherStudentIds, tutorialStudentIds] = await Promise.all([
      db
        .collection('course_enrollments')
        .distinct('studentId', { courseId: opts.courseId })
        .catch(() => [] as string[]),
      db
        .collection('enrollments')
        .distinct('userId', { courseSlug: opts.courseId })
        .catch(() => [] as string[]),
    ]);
    return Array.from(
      new Set([...(teacherStudentIds as string[]), ...(tutorialStudentIds as string[])]),
    ).filter((id) => id && id !== opts.authorId);
  }

  if (opts.institutionSlug) {
    const members = await db
      .collection('institution_members')
      .find({ institutionSlug: opts.institutionSlug })
      .project({ userId: 1 })
      .toArray();
    return members
      .map((m) => String(m.userId || ''))
      .filter((id) => id && id !== opts.authorId);
  }

  // Fallback: students enrolled in any of this instructor's courses
  const roster = await db
    .collection('course_enrollments')
    .distinct('studentId', { instructorId: opts.authorId })
    .catch(() => [] as string[]);
  if ((roster as string[]).length) {
    return (roster as string[]).filter((id) => id && id !== opts.authorId);
  }

  const enrolled = await db.collection('enrollments').distinct('userId');
  return (enrolled as string[]).filter((id) => id && id !== opts.authorId);
}
