import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/repo';
import { ensureLearnCollections } from '@/lib/learn/ecosystem';
import { getLearner } from '@/lib/learn/repo';
import {
  CATEGORY_LABELS,
  categoryForKind,
  type NotificationCategory,
  type NotificationKind,
  type NotificationView,
} from '@/lib/learn/notificationTypes';

export type { NotificationCategory, NotificationKind, NotificationView };
export { CATEGORY_LABELS, categoryForKind };

export type NotificationDoc = {
  _id?: ObjectId;
  userId: string;
  title: string;
  body: string;
  href?: string | null;
  kind: NotificationKind;
  category: NotificationCategory;
  data?: Record<string, unknown>;
  readAt?: Date | null;
  createdAt: Date;
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
    db.collection('notifications').createIndex({ userId: 1, category: 1, createdAt: -1 }),
  ]).catch(() => {});
}

function toView(d: Record<string, unknown>): NotificationView {
  const id = String((d._id as ObjectId).toString());
  const readAt = d.readAt ? new Date(d.readAt as string | Date).toISOString() : null;
  const createdAt = new Date(d.createdAt as string | Date).toISOString();
  const kind = (d.kind as NotificationKind) || 'system';
  const category =
    (d.category as NotificationCategory) || categoryForKind(kind);
  return {
    id,
    userId: String(d.userId),
    title: String(d.title),
    body: String(d.body),
    href: (d.href as string) || null,
    kind,
    category,
    data: (d.data as Record<string, unknown>) || undefined,
    readAt,
    createdAt,
  };
}

async function categoryEnabled(userId: string, category: NotificationCategory): Promise<boolean> {
  try {
    const learner = await getLearner(userId);
    const prefs = learner?.preferences;
    if (!prefs) return true;
    if (category === 'academic' && prefs.notifyAcademic === false) return false;
    if (category === 'social' && prefs.notifySocial === false) return false;
    if (category === 'institution' && prefs.notifyInstitution === false) return false;
    if (category === 'system' && prefs.notifySystem === false) return false;
    return true;
  } catch {
    return true;
  }
}

export async function createNotification(opts: {
  userId: string;
  title: string;
  body: string;
  href?: string | null;
  kind?: NotificationKind;
  category?: NotificationCategory;
  data?: Record<string, unknown>;
}): Promise<string | null> {
  const kind = opts.kind || 'system';
  const category = opts.category || categoryForKind(kind);
  if (!(await categoryEnabled(opts.userId, category))) return null;

  await ensureNotificationCollections();
  const db = await getDb();
  const title = opts.title.slice(0, 160);
  const body = opts.body.slice(0, 1000);
  const href = opts.href || null;
  const res = await db.collection('notifications').insertOne({
    userId: opts.userId,
    title,
    body,
    href,
    kind,
    category,
    data: opts.data || {},
    readAt: null,
    createdAt: new Date(),
  });
  const id = res.insertedId.toString();
  const { dispatchNotificationPush } = await import('@/lib/push/webPush');
  void dispatchNotificationPush({
    userId: opts.userId,
    notificationId: id,
    title,
    body,
    href,
    kind,
    category,
  });
  return id;
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
  const kind = payload.kind || 'system';
  const category = payload.category || categoryForKind(kind);

  const docs: Record<string, unknown>[] = [];
  for (const userId of unique) {
    if (!(await categoryEnabled(userId, category))) continue;
    docs.push({
      userId,
      title: payload.title.slice(0, 160),
      body: payload.body.slice(0, 1000),
      href: payload.href || null,
      kind,
      category,
      data: payload.data || {},
      readAt: null,
      createdAt: now,
    });
  }
  if (!docs.length) return 0;
  const res = await db.collection('notifications').insertMany(docs);
  const { dispatchNotificationPushToUsers } = await import('@/lib/push/webPush');
  void dispatchNotificationPushToUsers(
    docs.map((d) => String(d.userId)),
    {
      title: payload.title,
      body: payload.body,
      href: payload.href,
      kind,
      category,
    },
  );
  return res.insertedCount;
}

export async function listNotifications(
  userId: string,
  limit = 40,
  opts?: { page?: number; category?: NotificationCategory | 'all' },
): Promise<NotificationView[]> {
  await ensureNotificationCollections();
  const db = await getDb();
  const page = Math.max(1, Number(opts?.page) || 1);
  const skip = (page - 1) * Math.max(1, limit);
  const query: Record<string, unknown> = { userId };
  if (opts?.category && opts.category !== 'all') {
    query.category = opts.category;
  }
  const docs = await db
    .collection('notifications')
    .find(query)
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

export function uniqueUserIds(ids: string[], exclude?: string | null): string[] {
  const skip = String(exclude || '').trim();
  return Array.from(
    new Set(ids.map((id) => String(id || '').trim()).filter((id) => id && id !== skip)),
  ).slice(0, 500);
}

export async function listActiveStaffUserIds(): Promise<string[]> {
  try {
    const db = await getDb();
    const rows = await db
      .collection('staff_posts')
      .find({ active: true })
      .project({ userId: 1 })
      .limit(200)
      .toArray();
    return rows.map((r) => String(r.userId || '')).filter(Boolean);
  } catch {
    return [];
  }
}

export async function listInstitutionMemberIds(slug?: string | null): Promise<string[]> {
  try {
    const db = await getDb();
    const query: Record<string, unknown> = {};
    if (slug) query.institutionSlug = slug;
    const rows = await db
      .collection('institution_members')
      .find(query)
      .project({ userId: 1 })
      .limit(500)
      .toArray();
    return rows.map((r) => String(r.userId || '')).filter(Boolean);
  } catch {
    return [];
  }
}

export async function listOfficialStudentIds(campusSlug?: string | null): Promise<string[]> {
  try {
    const db = await getDb();
    const query: Record<string, unknown> = { status: { $in: ['active', 'admitted'] } };
    if (campusSlug) query.campusSlug = campusSlug;
    const rows = await db
      .collection('student_records')
      .find(query)
      .project({ userId: 1 })
      .limit(500)
      .toArray();
    return rows.map((r) => String(r.userId || '')).filter(Boolean);
  } catch {
    return [];
  }
}

/** Official students + campus affiliates + (optionally) staff. */
export async function listInstitutionNotifyIds(opts?: {
  campusSlug?: string | null;
  institutionSlug?: string | null;
  exclude?: string | null;
  includeStaff?: boolean;
}): Promise<string[]> {
  const slug = opts?.institutionSlug || opts?.campusSlug || null;
  const [members, students, staff] = await Promise.all([
    listInstitutionMemberIds(slug),
    listOfficialStudentIds(opts?.campusSlug || null),
    opts?.includeStaff === false ? Promise.resolve([] as string[]) : listActiveStaffUserIds(),
  ]);
  return uniqueUserIds([...members, ...students, ...staff], opts?.exclude);
}

export async function resolveAnnouncementNotifyIds(opts: {
  audience: 'everyone' | 'students' | 'staff';
  campusSlug?: string | null;
  authorId?: string | null;
}): Promise<string[]> {
  if (opts.audience === 'staff') {
    return uniqueUserIds(await listActiveStaffUserIds(), opts.authorId);
  }
  if (opts.audience === 'students') {
    const [students, members] = await Promise.all([
      listOfficialStudentIds(opts.campusSlug || null),
      listInstitutionMemberIds(opts.campusSlug || null),
    ]);
    return uniqueUserIds([...students, ...members], opts.authorId);
  }
  return listInstitutionNotifyIds({
    campusSlug: opts.campusSlug,
    includeStaff: true,
    exclude: opts.authorId,
  });
}

export async function notifyGradePosted(opts: {
  studentId: string;
  studentName?: string;
  instructorId: string;
  assessmentTitle: string;
  kind: 'assignment' | 'exam';
  assessmentId: string;
  score?: number | null;
  maxScore?: number | null;
}): Promise<void> {
  const href =
    opts.kind === 'exam'
      ? `/dashboard/exams/${opts.assessmentId}`
      : `/dashboard/assignments/${opts.assessmentId}`;
  const scoreLabel =
    typeof opts.score === 'number' && typeof opts.maxScore === 'number'
      ? ` Score: ${opts.score}/${opts.maxScore}.`
      : '';
  await createNotification({
    userId: opts.studentId,
    title: `Grade posted: ${opts.assessmentTitle}`,
    body: `Your ${opts.kind} has been graded.${scoreLabel} Open it in your dashboard.`,
    href,
    kind: opts.kind,
    data: { assessmentId: opts.assessmentId },
  }).catch(() => null);
  const staff = await listActiveStaffUserIds();
  await createNotificationsForUsers(
    uniqueUserIds(staff, opts.instructorId).filter((id) => id !== opts.studentId),
    {
      title: `Grade posted: ${opts.assessmentTitle}`,
      body: `${opts.studentName || 'A student'} received a grade on ${
        opts.kind === 'exam' ? 'an exam' : 'an assignment'
      }.${scoreLabel}`,
      href,
      kind: 'institution',
      data: { assessmentId: opts.assessmentId, studentId: opts.studentId },
    },
  ).catch(() => 0);
}
