import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/repo';
import { type Mentor, type MentorSlot } from '@/lib/learn/mentors';
import type { ContentVisibility, InstitutionAuthMethod } from '@/lib/learn/identity';
import type {
  TeacherCourseBase,
  TeacherCourseView,
  TeacherLesson,
  VideoProvider,
} from '@/lib/learn/courseTypes';
import { awardXp } from '@/lib/learn/repo';
import { XP, countInstructorEnrollsToday } from '@/lib/learn/xp';

export type {
  CourseAudience,
  CourseDeliveryMode,
  CourseLevel,
  CourseLiveSchedule,
  TeacherCourseBase,
  TeacherCourseView,
  TeacherLesson,
  VideoProvider,
} from '@/lib/learn/courseTypes';
export { courseDurationHours, deliveryModeLabel } from '@/lib/learn/courseTypes';
import {
  MENTOR_DOC_REQUEST_ITEMS,
  type MentorApplicationDoc,
  type MentorApplicationStatus,
  type MentorDocRequestItem,
  type MentorDocumentRequest,
} from '@/lib/learn/mentorApplication';

export type {
  MentorApplicationDoc,
  MentorApplicationStatus,
  MentorDocRequestItem,
  MentorDocumentRequest,
} from '@/lib/learn/mentorApplication';
export { MENTOR_DOC_REQUEST_ITEMS } from '@/lib/learn/mentorApplication';

/**
 * Ecosystem data layer - roles, mentor profiles, the book library &
 * publishing portal, and institutions (the multi-tenant "EduOS" foundation).
 *
 * All collections are created explicitly with indexes by
 * ensureLearnCollections(), so the database schema is visible and verifiable
 * from the admin dashboard.
 */

export type LearnerRole = 'student' | 'mentor' | 'admin';

// ── Explicit collection creation ──────────────────────────────────────────────

export const LEARN_COLLECTIONS = [
  'learners',
  'enrollments',
  'lesson_progress',
  'bookings',
  'mentor_profiles',
  'mentor_applications',
  'books',
  'book_purchases',
  'teacher_courses',
  'institutions',
  'institution_members',
  'institution_posts',
] as const;

let ensured = false;

/** Create every learning collection + its indexes (idempotent). */
export async function ensureLearnCollections() {
  if (ensured) return;
  const db = await getDb();
  const existing = new Set(
    (await db.listCollections({}, { nameOnly: true }).toArray()).map((c) => c.name),
  );
  for (const name of LEARN_COLLECTIONS) {
    if (!existing.has(name)) await db.createCollection(name).catch(() => {});
  }
  await Promise.all([
    db.collection('learners').createIndex({ lbId: 1 }, { unique: true }),
    db.collection('enrollments').createIndex({ userId: 1, courseSlug: 1 }, { unique: true }),
    db
      .collection('lesson_progress')
      .createIndex({ userId: 1, courseSlug: 1, lessonSlug: 1 }, { unique: true }),
    db.collection('bookings').createIndex({ userId: 1, scheduledAt: 1 }),
    db.collection('bookings').createIndex({ mentorId: 1, scheduledAt: 1 }),
    db.collection('mentor_profiles').createIndex({ lbId: 1 }, { unique: true }),
    db.collection('mentor_applications').createIndex({ lbId: 1, status: 1 }),
    db.collection('mentor_applications').createIndex({ status: 1, createdAt: -1 }),
    db.collection('books').createIndex({ published: 1, createdAt: -1 }),
    db.collection('books').createIndex({ authorId: 1 }),
    db.collection('book_purchases').createIndex({ userId: 1, bookId: 1 }, { unique: true }),
    db.collection('teacher_courses').createIndex({ authorId: 1, updatedAt: -1 }),
    db.collection('teacher_courses').createIndex({ institutionSlug: 1, published: 1 }),
    db.collection('teacher_courses').createIndex({ visibility: 1, published: 1, createdAt: -1 }),
    db.collection('institutions').createIndex({ slug: 1 }, { unique: true }),
    db
      .collection('institution_members')
      .createIndex({ institutionSlug: 1, userId: 1 }, { unique: true }),
    db.collection('institution_posts').createIndex({ institutionSlug: 1, createdAt: -1 }),
  ]).catch(() => {});
  await seedBooks(db);
  await seedIntellexInstitution(db);
  ensured = true;
}

// ── Roles ─────────────────────────────────────────────────────────────────────

export async function getRoles(lbId: string): Promise<LearnerRole[]> {
  try {
    const db = await getDb();
    const doc = await db
      .collection('learners')
      .findOne({ lbId }, { projection: { roles: 1 } });
    const roles = (doc?.roles as LearnerRole[] | undefined) ?? [];
    return roles.length ? roles : ['student'];
  } catch {
    return ['student'];
  }
}

async function grantRole(lbId: string, role: LearnerRole, name?: string) {
  const db = await getDb();
  await db.collection('learners').updateOne(
    { lbId },
    {
      $addToSet: { roles: role },
      $setOnInsert: {
        lbId,
        name: name ?? 'Learner',
        email: '',
        xp: 0,
        streakCount: 0,
        lastActiveDay: null,
        weeklyGoalMinutes: 150,
        createdAt: new Date(),
      },
    },
    { upsert: true },
  );
}

// ── Mentor profiles (dynamic mentors alongside the seed directory) ────────────

export interface MentorProfileDoc {
  lbId: string;
  name: string;
  title: string;
  expertise: string[];
  bio: string;
  languages: string[];
  priceXAF: number;
  sessionMinutes: number;
  accent: string;
  initials: string;
  slots: MentorSlot[];
  rating: number;
  sessionsCompleted: number;
  active: boolean;
  /** e.g. "InTelleX Instructor" or "{Campus} Instructor" */
  instructorBadge?: string | null;
  badgeInstitutionSlug?: string | null;
  /** Profile photo students see in the directory. */
  avatarUrl?: string | null;
  /** Short self-introduction video (carried over from the application). */
  introVideoUrl?: string | null;
  createdAt: Date;
}

function initialsOf(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join('') || 'MX'
  );
}

export async function becomeMentor(opts: {
  lbId: string;
  name: string;
  title: string;
  expertise: string[];
  bio: string;
  priceXAF: number;
  sessionMinutes: number;
  slots: MentorSlot[];
  instructorBadge?: string | null;
  badgeInstitutionSlug?: string | null;
  avatarUrl?: string | null;
  introVideoUrl?: string | null;
}): Promise<void> {
  await ensureLearnCollections();
  const db = await getDb();
  const doc: MentorProfileDoc = {
    lbId: opts.lbId,
    name: opts.name,
    title: opts.title.slice(0, 90),
    expertise: opts.expertise.slice(0, 6).map((e) => e.slice(0, 30)),
    bio: opts.bio.slice(0, 500),
    languages: ['English'],
    priceXAF: Math.max(0, Math.min(opts.priceXAF, 1_000_000)),
    sessionMinutes: [30, 45, 60].includes(opts.sessionMinutes) ? opts.sessionMinutes : 45,
    accent: '#00b369',
    initials: initialsOf(opts.name),
    slots: opts.slots.slice(0, 10),
    rating: 5,
    sessionsCompleted: 0,
    active: true,
    instructorBadge: opts.instructorBadge || null,
    badgeInstitutionSlug: opts.badgeInstitutionSlug || null,
    avatarUrl: opts.avatarUrl || null,
    introVideoUrl: opts.introVideoUrl || null,
    createdAt: new Date(),
  };
  const { createdAt, rating, sessionsCompleted, ...updatable } = doc;
  await db.collection('mentor_profiles').updateOne(
    { lbId: opts.lbId },
    {
      $set: updatable,
      $setOnInsert: { createdAt, rating, sessionsCompleted },
    },
    { upsert: true },
  );
  await grantRole(opts.lbId, 'mentor', opts.name);
}

/**
 * Mentorship is a privilege - applications enter a review queue.
 * Role is NOT granted until a Platform/Institution admin approves.
 * Applicants must attach CV, ID (front/back), and a short intro video.
 */
export async function submitMentorApplication(opts: {
  lbId: string;
  name: string;
  email?: string;
  title: string;
  expertise: string[];
  bio: string;
  priceXAF: number;
  sessionMinutes: number;
  slots: MentorSlot[];
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  resumeUrl: string;
  resumePublicId?: string;
  resumeResourceType?: string;
  resumeFormat?: string;
  resumeSource?: 'google_drive' | 'cloudinary';
  institutionSlug?: string;
  institutionName?: string;
  idFrontUrl: string;
  idBackUrl: string;
  introVideoUrl: string;
  introVideoBytes?: number;
}): Promise<{ applicationId: string; status: 'submitted' }> {
  await ensureLearnCollections();
  const db = await getDb();
  const existing = await db.collection('mentor_applications').findOne({
    lbId: opts.lbId,
    status: { $in: ['submitted', 'under_review'] },
  });
  if (existing) {
    return { applicationId: String(existing._id), status: 'submitted' };
  }
  const res = await db.collection('mentor_applications').insertOne({
    lbId: opts.lbId,
    name: opts.name,
    email: opts.email ?? null,
    title: opts.title.slice(0, 90),
    expertise: opts.expertise.slice(0, 8),
    bio: opts.bio.slice(0, 2000),
    priceXAF: Math.max(0, Math.min(opts.priceXAF, 1_000_000)),
    sessionMinutes: opts.sessionMinutes,
    slots: opts.slots.slice(0, 10),
    linkedinUrl: opts.linkedinUrl ?? null,
    githubUrl: opts.githubUrl ?? null,
    portfolioUrl: opts.portfolioUrl ?? null,
    resumeUrl: opts.resumeUrl,
    resumePublicId: opts.resumePublicId ?? null,
    resumeResourceType: opts.resumeResourceType ?? null,
    resumeFormat: opts.resumeFormat ?? null,
    resumeSource: opts.resumeSource ?? 'cloudinary',
    institutionSlug: opts.institutionSlug ?? null,
    institutionName: opts.institutionName ?? null,
    idFrontUrl: opts.idFrontUrl,
    idBackUrl: opts.idBackUrl,
    introVideoUrl: opts.introVideoUrl,
    introVideoBytes: opts.introVideoBytes ?? null,
    status: 'submitted',
    reviewNote: null,
    reviewedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return { applicationId: res.insertedId.toString(), status: 'submitted' };
}

export async function getPendingMentorApplication(
  lbId: string,
): Promise<MentorApplicationDoc | null> {
  try {
    const db = await getDb();
    const doc = await db.collection('mentor_applications').findOne({
      lbId,
      status: { $in: ['submitted', 'under_review'] },
    });
    if (!doc) return null;
    const { _id, ...rest } = doc;
    return { id: _id.toString(), ...(rest as Omit<MentorApplicationDoc, 'id'>) };
  } catch {
    return null;
  }
}

/** Approve a mentor application → create mentor profile + grant role. */
export async function approveMentorApplication(
  applicationId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  await ensureLearnCollections();
  const db = await getDb();
  let oid: ObjectId;
  try {
    oid = new ObjectId(applicationId);
  } catch {
    return { ok: false, error: 'invalid_id' };
  }
  const app = await db.collection('mentor_applications').findOne({ _id: oid });
  if (!app) return { ok: false, error: 'not_found' };
  if (app.status === 'approved') return { ok: true };
  if (!['submitted', 'under_review'].includes(String(app.status))) {
    return { ok: false, error: 'not_pending' };
  }

  let badgeOrg = String(app.institutionName || '').trim();
  const badgeSlug = String(app.institutionSlug || '').trim() || 'intellex';
  if (!badgeOrg && badgeSlug && badgeSlug !== 'intellex') {
    const inst = await db.collection('institutions').findOne({ slug: badgeSlug });
    badgeOrg = String(inst?.name || '').trim();
  }
  if (!badgeOrg) badgeOrg = 'InTelleX';
  const instructorBadge = `${badgeOrg} Instructor`;

  await becomeMentor({
    lbId: String(app.lbId),
    name: String(app.name),
    title: String(app.title),
    expertise: Array.isArray(app.expertise) ? app.expertise.map(String) : [],
    bio: String(app.bio ?? ''),
    priceXAF: Number(app.priceXAF ?? 0),
    sessionMinutes: Number(app.sessionMinutes ?? 45),
    slots: Array.isArray(app.slots) ? (app.slots as MentorSlot[]) : [],
    instructorBadge,
    badgeInstitutionSlug: badgeSlug,
    // Carry the onboarding intro video + avatar onto the public profile.
    introVideoUrl: typeof app.introVideoUrl === 'string' ? app.introVideoUrl : null,
    avatarUrl:
      (await db
        .collection('learners')
        .findOne({ lbId: String(app.lbId) }, { projection: { avatar: 1 } })
        .then((l) => (typeof l?.avatar === 'string' ? l.avatar : null))
        .catch(() => null)) ?? null,
  });

  // Persist badge on learner passport for Achievements.
  await db.collection('learners').updateOne(
    { lbId: String(app.lbId) },
    {
      $addToSet: { instructorBadgeLabels: instructorBadge },
      $set: {
        instructorBadge,
        instructorBadgeSlug: badgeSlug,
        updatedAt: new Date(),
      },
    },
  );

  await db.collection('mentor_applications').updateOne(
    { _id: oid },
    {
      $set: {
        status: 'approved',
        reviewedAt: new Date(),
        updatedAt: new Date(),
        instructorBadge,
        documentRequest: null,
      },
    },
  );

  try {
    const { createNotification } = await import('@/lib/learn/notifications');
    await createNotification({
      userId: String(app.lbId),
      title: `You're an ${instructorBadge}`,
      body: `Your instructor application was approved. Your ${instructorBadge} badge is live in Mentor Studio and Achievements.`,
      href: '/dashboard/mentor',
      kind: 'badge',
      data: { instructorBadge, institutionSlug: badgeSlug },
    });
  } catch (err) {
    console.error('instructor badge notify failed:', err);
  }

  return { ok: true };
}

export async function rejectMentorApplication(
  applicationId: string,
  note?: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const db = await getDb();
  let oid: ObjectId;
  try {
    oid = new ObjectId(applicationId);
  } catch {
    return { ok: false, error: 'invalid_id' };
  }
  const app = await db.collection('mentor_applications').findOne({ _id: oid });
  if (!app) return { ok: false, error: 'not_found' };
  if (!['submitted', 'under_review'].includes(String(app.status))) {
    return { ok: false, error: 'not_pending' };
  }
  await db.collection('mentor_applications').updateOne(
    { _id: oid },
    {
      $set: {
        status: 'rejected',
        reviewNote: (note ?? '').slice(0, 500) || null,
        reviewedAt: new Date(),
        updatedAt: new Date(),
        documentRequest: null,
      },
    },
  );
  return { ok: true };
}

const DOC_ITEM_SET = new Set<MentorDocRequestItem>([
  'resume',
  'id_front',
  'id_back',
  'intro_video',
]);

function normalizeDocItems(raw: unknown): MentorDocRequestItem[] {
  if (!Array.isArray(raw)) return [];
  return Array.from(
    new Set(
      raw
        .map((x) => String(x) as MentorDocRequestItem)
        .filter((x) => DOC_ITEM_SET.has(x)),
    ),
  );
}

/** Admin asks a pending applicant to re-send specific documents (1-N). */
export async function requestMentorDocuments(
  applicationId: string,
  items: MentorDocRequestItem[],
  note?: string,
): Promise<{ ok: true; items: MentorDocRequestItem[] } | { ok: false; error: string }> {
  await ensureLearnCollections();
  const db = await getDb();
  let oid: ObjectId;
  try {
    oid = new ObjectId(applicationId);
  } catch {
    return { ok: false, error: 'invalid_id' };
  }
  const app = await db.collection('mentor_applications').findOne({ _id: oid });
  if (!app) return { ok: false, error: 'not_found' };
  if (!['submitted', 'under_review'].includes(String(app.status))) {
    return { ok: false, error: 'not_pending' };
  }
  const normalized = normalizeDocItems(items);
  if (!normalized.length) return { ok: false, error: 'items_required' };

  const request: MentorDocumentRequest = {
    items: normalized,
    note: (note ?? '').slice(0, 800) || null,
    requestedAt: new Date(),
    status: 'open',
    fulfilledAt: null,
  };

  await db.collection('mentor_applications').updateOne(
    { _id: oid },
    {
      $set: {
        documentRequest: request,
        status: 'under_review',
        updatedAt: new Date(),
      },
    },
  );

  const labels = normalized
    .map((id) => MENTOR_DOC_REQUEST_ITEMS.find((x) => x.id === id)?.label || id)
    .join(', ');

  try {
    const { createNotification } = await import('@/lib/learn/notifications');
    await createNotification({
      userId: String(app.lbId),
      title: 'Admins need updated documents',
      body: `Please re-send: ${labels}.${request.note ? ` Note: ${request.note}` : ''} Open Mentor Studio to upload.`,
      href: '/dashboard/mentor',
      kind: 'system',
      data: { applicationId, items: normalized },
    });
  } catch (err) {
    console.error('document request notify failed:', err);
  }

  return { ok: true, items: normalized };
}

/** Applicant fulfills an open document request with only the asked items. */
export async function fulfillMentorDocumentRequest(
  lbId: string,
  updates: {
    resumeUrl?: string;
    resumeSource?: 'google_drive' | 'cloudinary';
    resumePublicId?: string;
    resumeResourceType?: string;
    resumeFormat?: string;
    idFrontUrl?: string;
    idBackUrl?: string;
    introVideoUrl?: string;
    introVideoBytes?: number;
  },
): Promise<{ ok: true } | { ok: false; error: string }> {
  await ensureLearnCollections();
  const db = await getDb();
  const app = await db.collection('mentor_applications').findOne({
    lbId,
    status: { $in: ['submitted', 'under_review'] },
  });
  if (!app) return { ok: false, error: 'not_found' };
  const req = app.documentRequest as MentorDocumentRequest | null | undefined;
  if (!req || req.status !== 'open' || !Array.isArray(req.items) || !req.items.length) {
    return { ok: false, error: 'no_open_request' };
  }

  const items = normalizeDocItems(req.items);
  const $set: Record<string, unknown> = {
    updatedAt: new Date(),
    status: 'under_review',
    'documentRequest.status': 'fulfilled',
    'documentRequest.fulfilledAt': new Date(),
  };

  for (const item of items) {
    if (item === 'resume') {
      if (!updates.resumeUrl) return { ok: false, error: 'resume_required' };
      $set.resumeUrl = updates.resumeUrl;
      $set.resumeSource = updates.resumeSource || 'cloudinary';
      if (updates.resumePublicId) $set.resumePublicId = updates.resumePublicId;
      if (updates.resumeResourceType) $set.resumeResourceType = updates.resumeResourceType;
      if (updates.resumeFormat) $set.resumeFormat = updates.resumeFormat;
    }
    if (item === 'id_front') {
      if (!updates.idFrontUrl) return { ok: false, error: 'id_front_required' };
      $set.idFrontUrl = updates.idFrontUrl;
    }
    if (item === 'id_back') {
      if (!updates.idBackUrl) return { ok: false, error: 'id_back_required' };
      $set.idBackUrl = updates.idBackUrl;
    }
    if (item === 'intro_video') {
      if (!updates.introVideoUrl) return { ok: false, error: 'intro_video_required' };
      $set.introVideoUrl = updates.introVideoUrl;
      if (typeof updates.introVideoBytes === 'number') {
        $set.introVideoBytes = updates.introVideoBytes;
      }
    }
  }

  await db.collection('mentor_applications').updateOne({ _id: app._id }, { $set });
  return { ok: true };
}

export async function getMentorProfile(lbId: string): Promise<MentorProfileDoc | null> {
  try {
    const db = await getDb();
    const doc = await db
      .collection('mentor_profiles')
      .findOne({ lbId }, { projection: { _id: 0 } });
    return (doc as unknown as MentorProfileDoc) ?? null;
  } catch {
    return null;
  }
}

export async function updateMentorProfile(
  lbId: string,
  patch: Partial<
    Pick<
      MentorProfileDoc,
      | 'title'
      | 'bio'
      | 'expertise'
      | 'priceXAF'
      | 'sessionMinutes'
      | 'slots'
      | 'active'
      | 'avatarUrl'
      | 'introVideoUrl'
    >
  >,
) {
  const db = await getDb();
  await db.collection('mentor_profiles').updateOne({ lbId }, { $set: patch });
}

/** Live mentor / instructor directory only - no mock seed profiles. */
export async function getAllMentors(): Promise<Mentor[]> {
  try {
    const db = await getDb();
    const docs = await db
      .collection('mentor_profiles')
      .find({ active: true }, { projection: { _id: 0 } })
      .toArray();
    return (docs as unknown as MentorProfileDoc[]).map((d) => ({
      id: d.lbId,
      name: d.name,
      title: d.title,
      expertise: d.expertise,
      bio: d.bio,
      rating: d.rating,
      sessionsCompleted: d.sessionsCompleted,
      languages: d.languages,
      priceXAF: d.priceXAF,
      sessionMinutes: d.sessionMinutes,
      accent: d.accent,
      initials: d.initials,
      slots: d.slots,
      avatarUrl: d.avatarUrl ?? null,
      introVideoUrl: d.introVideoUrl ?? null,
      instructorBadge: d.instructorBadge || null,
    }));
  } catch {
    return [];
  }
}

export async function findMentor(id: string): Promise<Mentor | null> {
  const all = await getAllMentors();
  return all.find((m) => m.id === id) ?? null;
}

/** Sessions booked with this mentor (for the mentor dashboard). */
export async function getMentorBookings(mentorId: string) {
  try {
    const db = await getDb();
    const docs = await db
      .collection('bookings')
      .find({ mentorId })
      .sort({ scheduledAt: 1 })
      .toArray();
    return docs.map((d) => ({
      id: d._id.toString(),
      userId: d.userId as string,
      topic: d.topic as string,
      scheduledAt: d.scheduledAt as Date,
      durationMinutes: d.durationMinutes as number,
      channel: d.channel as string,
      status: d.status as string,
      priceXAF: (d.priceXAF as number) ?? 0,
      paid: Boolean(d.paid),
      platformXAF: (d.platformXAF as number) ?? 0,
      instructorXAF: (d.instructorXAF as number) ?? 0,
      isTrial: Boolean(d.isTrial),
    }));
  } catch {
    return [];
  }
}

// ── Books (library + mentor publishing portal) ────────────────────────────────

export interface BookChapter {
  title: string;
  content: string;
}

export interface BookDoc {
  _id?: ObjectId;
  authorId: string;
  authorName: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  coverColor: string;
  coverEmoji: string;
  priceXAF: number;
  chapters: BookChapter[];
  published: boolean;
  sales: number;
  createdAt: Date;
  updatedAt: Date;
}

export type BookView = Omit<BookDoc, '_id'> & { id: string };

function toBookView(d: Record<string, unknown>): BookView {
  const { _id, ...rest } = d as unknown as BookDoc & { _id: ObjectId };
  return { ...(rest as Omit<BookDoc, '_id'>), id: _id.toString() };
}

export async function listPublishedBooks(): Promise<BookView[]> {
  try {
    await ensureLearnCollections();
    const db = await getDb();
    const docs = await db
      .collection('books')
      .find({ published: true })
      .sort({ createdAt: -1 })
      .toArray();
    return docs.map((d) => toBookView(d as Record<string, unknown>));
  } catch {
    return [];
  }
}

export async function listBooksByAuthor(authorId: string): Promise<BookView[]> {
  try {
    const db = await getDb();
    const docs = await db
      .collection('books')
      .find({ authorId })
      .sort({ updatedAt: -1 })
      .toArray();
    return docs.map((d) => toBookView(d as Record<string, unknown>));
  } catch {
    return [];
  }
}

export async function getBook(id: string): Promise<BookView | null> {
  try {
    const db = await getDb();
    const doc = await db.collection('books').findOne({ _id: new ObjectId(id) });
    return doc ? toBookView(doc as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export async function createBook(opts: {
  authorId: string;
  authorName: string;
  title: string;
}): Promise<string> {
  await ensureLearnCollections();
  const db = await getDb();
  const doc: BookDoc = {
    authorId: opts.authorId,
    authorName: opts.authorName,
    title: opts.title.slice(0, 120) || 'Untitled book',
    subtitle: '',
    description: '',
    category: 'Programming',
    coverColor: '#00b369',
    coverEmoji: 'B',
    priceXAF: 0,
    chapters: [{ title: 'Chapter 1', content: '' }],
    published: false,
    sales: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const res = await db
    .collection('books')
    .insertOne(doc as unknown as Record<string, unknown>);
  return res.insertedId.toString();
}

export async function updateBook(
  id: string,
  authorId: string,
  patch: Partial<
    Pick<
      BookDoc,
      | 'title'
      | 'subtitle'
      | 'description'
      | 'category'
      | 'coverColor'
      | 'coverEmoji'
      | 'priceXAF'
      | 'chapters'
      | 'published'
    >
  >,
) {
  const db = await getDb();
  await db
    .collection('books')
    .updateOne(
      { _id: new ObjectId(id), authorId },
      { $set: { ...patch, updatedAt: new Date() } },
    );
}

export async function purchaseBook(userId: string, book: BookView) {
  const db = await getDb();
  const res = await db.collection('book_purchases').updateOne(
    { userId, bookId: book.id },
    {
      $setOnInsert: {
        userId,
        bookId: book.id,
        priceXAF: book.priceXAF,
        authorId: book.authorId,
        createdAt: new Date(),
      },
    },
    { upsert: true },
  );
  if (res.upsertedCount > 0 && book.priceXAF > 0) {
    await db
      .collection('books')
      .updateOne({ _id: new ObjectId(book.id) }, { $inc: { sales: 1 } });
  }
}

export async function getPurchasedBookIds(userId: string): Promise<Set<string>> {
  try {
    const db = await getDb();
    const docs = await db
      .collection('book_purchases')
      .find({ userId }, { projection: { bookId: 1 } })
      .toArray();
    return new Set(docs.map((d) => d.bookId as string));
  } catch {
    return new Set();
  }
}

/** Author earnings from paid book sales. */
export async function getBookEarnings(authorId: string): Promise<number> {
  try {
    const db = await getDb();
    const rows = await db
      .collection('book_purchases')
      .aggregate([
        { $match: { authorId, priceXAF: { $gt: 0 } } },
        { $group: { _id: null, total: { $sum: '$priceXAF' } } },
      ])
      .toArray();
    return (rows[0]?.total as number) ?? 0;
  } catch {
    return 0;
  }
}

// ── Teacher / mentor video courses (campus + InTelleX tutors) ─────────────────

export type TeacherCourseDoc = TeacherCourseBase & { _id?: ObjectId };

function toTeacherCourseView(d: Record<string, unknown>): TeacherCourseView {
  const { _id, ...rest } = d as unknown as TeacherCourseDoc & { _id: ObjectId };
  return { ...(rest as TeacherCourseBase), id: _id.toString() };
}

/** Normalize Drive / YouTube share links into a playable/embeddable URL. */
export function normalizeVideoUrl(raw: string): {
  videoUrl: string;
  videoProvider: VideoProvider;
  embedUrl: string;
} {
  const url = raw.trim();
  const drive = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (drive) {
    const id = drive[1];
    return {
      videoUrl: `https://drive.google.com/file/d/${id}/view`,
      videoProvider: 'drive',
      embedUrl: `https://drive.google.com/file/d/${id}/preview`,
    };
  }
  const driveOpen = url.match(/drive\.google\.com\/open\?id=([^&]+)/);
  if (driveOpen) {
    const id = driveOpen[1];
    return {
      videoUrl: `https://drive.google.com/file/d/${id}/view`,
      videoProvider: 'drive',
      embedUrl: `https://drive.google.com/file/d/${id}/preview`,
    };
  }
  const yt =
    url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{6,})/) ||
    url.match(/youtube\.com\/shorts\/([A-Za-z0-9_-]{6,})/);
  if (yt) {
    const id = yt[1];
    return {
      videoUrl: `https://www.youtube.com/watch?v=${id}`,
      videoProvider: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${id}`,
    };
  }
  if (url.includes('cloudinary.com') || url.includes('res.cloudinary')) {
    return { videoUrl: url, videoProvider: 'cloudinary', embedUrl: url };
  }
  return { videoUrl: url, videoProvider: 'url', embedUrl: url };
}

export async function listTeacherCoursesByAuthor(authorId: string): Promise<TeacherCourseView[]> {
  try {
    await ensureLearnCollections();
    const db = await getDb();
    const docs = await db
      .collection('teacher_courses')
      .find({ authorId })
      .sort({ updatedAt: -1 })
      .toArray();
    return docs.map((d) => toTeacherCourseView(d as Record<string, unknown>));
  } catch {
    return [];
  }
}

export async function listTeacherCoursesForCampus(
  institutionSlug: string,
  opts?: { includeUnpublishedForAuthorId?: string },
): Promise<TeacherCourseView[]> {
  try {
    await ensureLearnCollections();
    const db = await getDb();
    const query: Record<string, unknown> = { institutionSlug };
    if (opts?.includeUnpublishedForAuthorId) {
      query.$or = [
        { published: true },
        { authorId: opts.includeUnpublishedForAuthorId },
      ];
    } else {
      query.published = true;
    }
    const docs = await db
      .collection('teacher_courses')
      .find(query)
      .sort({ updatedAt: -1 })
      .toArray();
    return docs.map((d) => toTeacherCourseView(d as Record<string, unknown>));
  } catch {
    return [];
  }
}

export async function listPublicTeacherCourses(limit = 40): Promise<TeacherCourseView[]> {
  try {
    await ensureLearnCollections();
    const db = await getDb();
    const docs = await db
      .collection('teacher_courses')
      .find({ published: true, visibility: 'public' })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .toArray();
    return docs.map((d) => toTeacherCourseView(d as Record<string, unknown>));
  } catch {
    return [];
  }
}

export async function getTeacherCourse(id: string): Promise<TeacherCourseView | null> {
  try {
    const db = await getDb();
    const doc = await db.collection('teacher_courses').findOne({ _id: new ObjectId(id) });
    return doc ? toTeacherCourseView(doc as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

/** Batch-load teacher courses (avoids N+1 on My Courses). */
export async function getTeacherCoursesByIds(ids: string[]): Promise<TeacherCourseView[]> {
  const unique = Array.from(new Set(ids.map((id) => String(id || '').trim()).filter(Boolean)));
  if (!unique.length) return [];
  try {
    const db = await getDb();
    const objectIds = unique
      .filter((id) => ObjectId.isValid(id))
      .map((id) => new ObjectId(id));
    if (!objectIds.length) return [];
    const docs = await db
      .collection('teacher_courses')
      .find({ _id: { $in: objectIds } })
      .toArray();
    return docs.map((d) => toTeacherCourseView(d as Record<string, unknown>));
  } catch {
    return [];
  }
}

export async function createTeacherCourse(opts: {
  authorId: string;
  authorName: string;
  title: string;
  institutionSlug?: string | null;
  visibility?: ContentVisibility;
  instructorId?: string | null;
  instructorName?: string | null;
  createdByInstitution?: boolean;
}): Promise<string> {
  await ensureLearnCollections();
  const db = await getDb();
  const now = new Date();
  const doc: TeacherCourseDoc = {
    authorId: opts.authorId,
    authorName: opts.authorName,
    institutionSlug: opts.institutionSlug || null,
    title: opts.title.slice(0, 140) || 'Untitled course',
    description: '',
    visibility: opts.visibility || 'private',
    lessons: [],
    published: false,
    accent: '#00b369',
    coverUrl: null,
    coverPublicId: null,
    subtitle: '',
    category: '',
    level: 'all',
    language: 'English',
    tags: [],
    deliveryMode: 'self_paced',
    durationHours: null,
    priceXAF: 0,
    audience: opts.institutionSlug ? 'institution' : 'allocated',
    seats: null,
    certificate: false,
    liveSchedule: null,
    outcomes: [],
    requirements: [],
    instructorId: opts.instructorId || null,
    instructorName: opts.instructorName || null,
    createdByInstitution: Boolean(opts.createdByInstitution),
    createdAt: now,
    updatedAt: now,
  };
  const res = await db.collection('teacher_courses').insertOne(doc as unknown as Record<string, unknown>);
  await awardXp(opts.authorId, XP.CREATE_COURSE).catch(() => {});
  return res.insertedId.toString();
}

export type TeacherCoursePatch = Partial<
  Pick<
    TeacherCourseDoc,
    | 'title'
    | 'description'
    | 'visibility'
    | 'lessons'
    | 'published'
    | 'accent'
    | 'institutionSlug'
    | 'coverUrl'
    | 'coverPublicId'
    | 'subtitle'
    | 'category'
    | 'level'
    | 'language'
    | 'tags'
    | 'deliveryMode'
    | 'durationHours'
    | 'priceXAF'
    | 'audience'
    | 'seats'
    | 'certificate'
    | 'liveSchedule'
    | 'outcomes'
    | 'requirements'
    | 'instructorId'
    | 'instructorName'
  >
>;

/** Author or the allocated instructor may edit. */
export async function updateTeacherCourse(
  id: string,
  editorId: string,
  patch: TeacherCoursePatch,
) {
  const db = await getDb();
  const oid = new ObjectId(id);
  const filter = {
    _id: oid,
    $or: [{ authorId: editorId }, { instructorId: editorId }],
  };
  const existing = await db.collection('teacher_courses').findOne(filter);
  await db.collection('teacher_courses').updateOne(filter, {
    $set: { ...patch, updatedAt: new Date() },
  });
  if (patch.published === true && existing && !existing.published) {
    await awardXp(editorId, XP.PUBLISH_COURSE).catch(() => {});
  }
}

/** Published courses taught by this instructor (author or allocated). */
export async function listCoursesByInstructor(
  instructorId: string,
  opts?: { publishedOnly?: boolean },
): Promise<TeacherCourseView[]> {
  try {
    await ensureLearnCollections();
    const db = await getDb();
    const query: Record<string, unknown> = {
      $or: [{ authorId: instructorId }, { instructorId }],
    };
    if (opts?.publishedOnly !== false) query.published = true;
    const docs = await db
      .collection('teacher_courses')
      .find(query)
      .sort({ updatedAt: -1 })
      .toArray();
    return docs.map((d) => toTeacherCourseView(d as Record<string, unknown>));
  } catch {
    return [];
  }
}

// ── Course enrolments (purchase or instructor-added) ─────────────────────────

export type CourseEnrollmentSource = 'purchase' | 'instructor' | 'free';

export interface CourseEnrollmentDoc {
  _id?: ObjectId;
  courseId: string;
  courseTitle: string;
  studentId: string;
  studentName: string;
  studentEmail?: string | null;
  instructorId: string;
  source: CourseEnrollmentSource;
  /** Gross amount the student paid (0 for free / instructor-added). */
  priceXAF: number;
  /** Platform commission recorded at purchase time. */
  platformXAF: number;
  instructorXAF: number;
  commissionRate: number;
  isTrial: boolean;
  createdAt: Date;
}

export type CourseEnrollmentView = Omit<CourseEnrollmentDoc, '_id'> & { id: string };

async function ensureCourseEnrollmentCollection() {
  await ensureLearnCollections();
  const db = await getDb();
  const names = new Set(
    (await db.listCollections({}, { nameOnly: true }).toArray()).map((c) => c.name),
  );
  if (!names.has('course_enrollments')) {
    await db.createCollection('course_enrollments').catch(() => {});
  }
  await Promise.all([
    db
      .collection('course_enrollments')
      .createIndex({ courseId: 1, studentId: 1 }, { unique: true }),
    db.collection('course_enrollments').createIndex({ studentId: 1, createdAt: -1 }),
    db.collection('course_enrollments').createIndex({ instructorId: 1, createdAt: -1 }),
  ]).catch(() => {});
}

/** How many times this student already paid this instructor (drives commission). */
export async function countPaidPurchases(
  instructorId: string,
  studentId: string,
): Promise<number> {
  try {
    await ensureCourseEnrollmentCollection();
    const db = await getDb();
    const [courses, sessions] = await Promise.all([
      db.collection('course_enrollments').countDocuments({
        instructorId,
        studentId,
        priceXAF: { $gt: 0 },
      }),
      db.collection('bookings').countDocuments({
        mentorId: instructorId,
        userId: studentId,
        paid: true,
        priceXAF: { $gt: 0 },
        status: { $ne: 'cancelled' },
      }),
    ]);
    return courses + sessions;
  } catch {
    return 0;
  }
}

export async function isEnrolledInCourse(
  courseId: string,
  studentId: string,
): Promise<boolean> {
  try {
    await ensureCourseEnrollmentCollection();
    const db = await getDb();
    const doc = await db.collection('course_enrollments').findOne({ courseId, studentId });
    return Boolean(doc);
  } catch {
    return false;
  }
}

export async function enrollStudentInCourse(opts: {
  course: TeacherCourseView;
  studentId: string;
  studentName: string;
  studentEmail?: string | null;
  source: CourseEnrollmentSource;
  priceXAF: number;
  platformXAF: number;
  instructorXAF: number;
  commissionRate: number;
  isTrial: boolean;
}): Promise<{ created: boolean }> {
  await ensureCourseEnrollmentCollection();
  const db = await getDb();
  const instructorId = opts.course.instructorId || opts.course.authorId;
  const res = await db.collection('course_enrollments').updateOne(
    { courseId: opts.course.id, studentId: opts.studentId },
    {
      $setOnInsert: {
        courseId: opts.course.id,
        courseTitle: opts.course.title,
        studentId: opts.studentId,
        studentName: opts.studentName,
        studentEmail: opts.studentEmail ?? null,
        instructorId,
        source: opts.source,
        priceXAF: opts.priceXAF,
        platformXAF: opts.platformXAF,
        instructorXAF: opts.instructorXAF,
        commissionRate: opts.commissionRate,
        isTrial: opts.isTrial,
        createdAt: new Date(),
      },
    },
    { upsert: true },
  );
  const created = res.upsertedCount > 0;
  await maybeAwardInstructorEnrollXp(instructorId, created);
  return { created };
}

async function maybeAwardInstructorEnrollXp(instructorId: string, created: boolean) {
  if (!created || !instructorId) return;
  const todayCount = await countInstructorEnrollsToday(instructorId);
  if (todayCount > XP.ENROLL_STUDENT_DAILY_CAP) return;
  await awardXp(instructorId, XP.ENROLL_STUDENT).catch(() => {});
}

export async function removeCourseEnrollment(courseId: string, studentId: string) {
  await ensureCourseEnrollmentCollection();
  const db = await getDb();
  await db.collection('course_enrollments').deleteOne({ courseId, studentId });
}

export async function listCourseEnrollments(
  courseId: string,
): Promise<CourseEnrollmentView[]> {
  try {
    await ensureCourseEnrollmentCollection();
    const db = await getDb();
    const docs = await db
      .collection('course_enrollments')
      .find({ courseId })
      .sort({ createdAt: -1 })
      .toArray();
    return docs.map((d) => {
      const { _id, ...rest } = d as unknown as CourseEnrollmentDoc & { _id: ObjectId };
      return { ...(rest as Omit<CourseEnrollmentDoc, '_id'>), id: _id.toString() };
    });
  } catch {
    return [];
  }
}

/** Courses a student was added to or bought. */
export async function listStudentCourseEnrollments(
  studentId: string,
): Promise<CourseEnrollmentView[]> {
  try {
    await ensureCourseEnrollmentCollection();
    const db = await getDb();
    const docs = await db
      .collection('course_enrollments')
      .find({ studentId })
      .sort({ createdAt: -1 })
      .toArray();
    return docs.map((d) => {
      const { _id, ...rest } = d as unknown as CourseEnrollmentDoc & { _id: ObjectId };
      return { ...(rest as Omit<CourseEnrollmentDoc, '_id'>), id: _id.toString() };
    });
  } catch {
    return [];
  }
}

export type InstructorStudentRow = {
  studentId: string;
  studentName: string;
  studentEmail: string | null;
  source: CourseEnrollmentSource;
  priceXAF: number;
  enrolledAt: string;
};

export type InstructorCourseStudents = {
  courseId: string;
  courseTitle: string;
  published: boolean;
  studentCount: number;
  students: InstructorStudentRow[];
};

/**
 * All enrolments across courses this instructor owns or teaches,
 * grouped by course for the My Students page.
 */
export async function listInstructorStudentGroups(
  instructorId: string,
): Promise<InstructorCourseStudents[]> {
  try {
    const [courses, enrollments] = await Promise.all([
      listCoursesByInstructor(instructorId, { publishedOnly: false }),
      (async () => {
        await ensureCourseEnrollmentCollection();
        const db = await getDb();
        return db
          .collection('course_enrollments')
          .find({ instructorId })
          .sort({ createdAt: -1 })
          .toArray();
      })(),
    ]);

    const byCourse = new Map<string, InstructorStudentRow[]>();
    for (const raw of enrollments) {
      const d = raw as unknown as CourseEnrollmentDoc & { _id: ObjectId };
      const list = byCourse.get(d.courseId) || [];
      list.push({
        studentId: d.studentId,
        studentName: d.studentName || 'Student',
        studentEmail: d.studentEmail ?? null,
        source: d.source,
        priceXAF: Number(d.priceXAF) || 0,
        enrolledAt:
          d.createdAt instanceof Date
            ? d.createdAt.toISOString()
            : new Date(d.createdAt).toISOString(),
      });
      byCourse.set(d.courseId, list);
    }

    const groups: InstructorCourseStudents[] = courses.map((c) => {
      const students = byCourse.get(c.id) || [];
      byCourse.delete(c.id);
      return {
        courseId: c.id,
        courseTitle: c.title,
        published: Boolean(c.published),
        studentCount: students.length,
        students,
      };
    });

    // Orphan enrolments whose course was deleted still show up
    for (const [courseId, students] of Array.from(byCourse.entries())) {
      groups.push({
        courseId,
        courseTitle: students[0] ? `Course ${courseId.slice(0, 6)}` : 'Course',
        published: false,
        studentCount: students.length,
        students,
      });
    }

    return groups.sort((a, b) => b.studentCount - a.studentCount || a.courseTitle.localeCompare(b.courseTitle));
  } catch {
    return [];
  }
}

/** Distinct student IDs enrolled in a teacher course. */
export async function listStudentIdsForCourse(courseId: string): Promise<string[]> {
  try {
    await ensureCourseEnrollmentCollection();
    const db = await getDb();
    const ids = await db.collection('course_enrollments').distinct('studentId', { courseId });
    return (ids as string[]).filter(Boolean);
  } catch {
    return [];
  }
}

/** Instructor course revenue after platform commission. */
export async function getCourseEarnings(
  instructorId: string,
): Promise<{ grossXAF: number; instructorXAF: number; platformXAF: number; students: number }> {
  try {
    await ensureCourseEnrollmentCollection();
    const db = await getDb();
    const rows = await db
      .collection('course_enrollments')
      .aggregate([
        { $match: { instructorId } },
        {
          $group: {
            _id: null,
            grossXAF: { $sum: '$priceXAF' },
            instructorXAF: { $sum: '$instructorXAF' },
            platformXAF: { $sum: '$platformXAF' },
            students: { $addToSet: '$studentId' },
          },
        },
      ])
      .toArray();
    const r = rows[0];
    return {
      grossXAF: (r?.grossXAF as number) ?? 0,
      instructorXAF: (r?.instructorXAF as number) ?? 0,
      platformXAF: (r?.platformXAF as number) ?? 0,
      students: ((r?.students as string[]) ?? []).length,
    };
  } catch {
    return { grossXAF: 0, instructorXAF: 0, platformXAF: 0, students: 0 };
  }
}

/** Paid mentorship sessions after platform commission. */
export async function getSessionEarnings(
  mentorId: string,
): Promise<{ grossXAF: number; instructorXAF: number; platformXAF: number; sessions: number }> {
  try {
    const db = await getDb();
    const rows = await db
      .collection('bookings')
      .aggregate([
        {
          $match: {
            mentorId,
            status: { $ne: 'cancelled' },
            $or: [{ paid: true }, { priceXAF: { $gt: 0 } }],
          },
        },
        {
          $group: {
            _id: null,
            grossXAF: { $sum: '$priceXAF' },
            instructorXAF: { $sum: { $ifNull: ['$instructorXAF', 0] } },
            platformXAF: { $sum: { $ifNull: ['$platformXAF', 0] } },
            sessions: { $sum: 1 },
          },
        },
      ])
      .toArray();
    const r = rows[0];
    const grossXAF = (r?.grossXAF as number) ?? 0;
    let instructorXAF = (r?.instructorXAF as number) ?? 0;
    let platformXAF = (r?.platformXAF as number) ?? 0;
    // Legacy unpaid-tracked bookings: treat full price as gross with unknown split.
    if (grossXAF > 0 && instructorXAF === 0 && platformXAF === 0) {
      platformXAF = 0;
      instructorXAF = 0;
    }
    return {
      grossXAF,
      instructorXAF,
      platformXAF,
      sessions: (r?.sessions as number) ?? 0,
    };
  } catch {
    return { grossXAF: 0, instructorXAF: 0, platformXAF: 0, sessions: 0 };
  }
}

/** Combined income ledger for the instructor dashboard. */
export async function getInstructorIncome(instructorId: string) {
  const [courses, sessions, bookEarnings] = await Promise.all([
    getCourseEarnings(instructorId),
    getSessionEarnings(instructorId),
    getBookEarnings(instructorId),
  ]);
  return {
    courses,
    sessions,
    booksXAF: bookEarnings,
    yourTotalXAF: courses.instructorXAF + sessions.instructorXAF + bookEarnings,
    platformTotalXAF: courses.platformXAF + sessions.platformXAF,
    grossTotalXAF: courses.grossXAF + sessions.grossXAF + bookEarnings,
  };
}

/** Owner toggles whether campus instructors may sell extra courses/books. */
export async function updateInstitutionPolicy(
  slug: string,
  ownerId: string,
  patch: { allowInstructorSales?: boolean },
): Promise<{ ok: true } | { error: string }> {
  try {
    const db = await getDb();
    const inst = await db.collection('institutions').findOne({ slug });
    if (!inst) return { error: 'not_found' };
    if (String(inst.ownerId) !== ownerId) return { error: 'forbidden' };
    const $set: Record<string, unknown> = {};
    if (typeof patch.allowInstructorSales === 'boolean') {
      $set.allowInstructorSales = patch.allowInstructorSales;
    }
    if (Object.keys($set).length === 0) return { error: 'empty' };
    await db.collection('institutions').updateOne({ slug }, { $set });
    return { ok: true };
  } catch {
    return { error: 'db_unavailable' };
  }
}

/** Search learners by name or email so instructors can add them to a course. */
export async function searchLearners(
  query: string,
  limit = 12,
): Promise<{ lbId: string; name: string; email: string; avatar?: string | null }[]> {
  const q = query.trim();
  if (q.length < 2) return [];
  try {
    const db = await getDb();
    const safe = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const rx = new RegExp(safe, 'i');
    const docs = await db
      .collection('learners')
      .find(
        { $or: [{ name: rx }, { email: rx }] },
        { projection: { lbId: 1, name: 1, email: 1, avatar: 1 } },
      )
      .limit(limit)
      .toArray();
    return docs.map((d) => ({
      lbId: String(d.lbId),
      name: String(d.name || 'Learner'),
      email: String(d.email || ''),
      avatar: (d.avatar as string) ?? null,
    }));
  } catch {
    return [];
  }
}

/** Institutions this person belongs to (for instructor profiles). */
export async function listUserInstitutions(
  userId: string,
): Promise<{ slug: string; name: string; role: string; color: string; logoUrl?: string | null }[]> {
  try {
    const db = await getDb();
    const members = await db
      .collection('institution_members')
      .find({ userId })
      .project({ institutionSlug: 1, role: 1 })
      .toArray();
    if (!members.length) return [];
    const slugs = members.map((m) => String(m.institutionSlug));
    const institutions = await db
      .collection('institutions')
      .find({ slug: { $in: slugs } })
      .project({ slug: 1, name: 1, color: 1, logoUrl: 1 })
      .toArray();
    const bySlug = new Map(institutions.map((i) => [String(i.slug), i]));
    return members
      .map((m) => {
        const inst = bySlug.get(String(m.institutionSlug));
        if (!inst) return null;
        return {
          slug: String(inst.slug),
          name: String(inst.name),
          role: String(m.role || 'member'),
          color: String(inst.color || '#00b369'),
          logoUrl: (inst.logoUrl as string) ?? null,
        };
      })
      .filter(Boolean) as {
      slug: string;
      name: string;
      role: string;
      color: string;
      logoUrl?: string | null;
    }[];
  } catch {
    return [];
  }
}

// ── Institutions (multi-tenant EduOS foundation) ──────────────────────────────

export interface InstitutionDoc {
  slug: string;
  name: string;
  tagline: string;
  about: string;
  color: string;
  emoji: string;
  coverUrl?: string | null;
  logoUrl?: string | null;
  visibility: 'public' | 'private';
  /** How this campus authenticates students when they affiliate. */
  authMethod?: InstitutionAuthMethod;
  country?: string | null;
  /**
   * Commercial pack: foundation | professional | enterprise | custom.
   * Modules (capabilities) unlock from pack or explicit enabledModules.
   */
  capabilityPack?: 'foundation' | 'professional' | 'enterprise' | 'custom';
  /** Explicit module ids beyond Core - wins over pack when set. */
  enabledModules?: string[];
  branding?: {
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
  };
  /**
   * When true, campus instructors may price and sell their own extra courses
   * (and books) on InTelleX. Core campus teaching stays free either way - 
   * institutions pay instructors off-platform.
   */
  allowInstructorSales?: boolean;
  /** Active custom hostname for this campus (Platform-approved). */
  customDomain?: string | null;
  /** Optional platform subdomain label (e.g. aso → aso.intellex.cm). */
  subdomain?: string | null;
  /** none | pending | active | rejected */
  domainStatus?: 'none' | 'pending' | 'active' | 'rejected';
  pendingCustomDomain?: string | null;
  domainVerifiedAt?: Date | string | null;
  domainNotes?: string | null;
  ownerId: string;
  ownerName: string;
  memberCount: number;
  createdAt: Date;
}

export interface InstitutionPostDoc {
  _id?: ObjectId;
  institutionSlug: string;
  authorId: string;
  authorName: string;
  title: string;
  body: string;
  /** private = campus only · network = partners · public = all InTelleX learners */
  visibility?: 'private' | 'network' | 'public';
  createdAt: Date;
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 48);
}

export async function createInstitution(opts: {
  name: string;
  tagline: string;
  about: string;
  color: string;
  emoji: string;
  visibility: 'public' | 'private';
  ownerId: string;
  ownerName: string;
}): Promise<{ slug: string } | { error: string }> {
  // Internal provisioning path only - public users must submitInstitutionApplication().
  await ensureLearnCollections();
  const db = await getDb();
  const slug = slugify(opts.name);
  if (!slug) return { error: 'invalid_name' };
  const exists = await db.collection('institutions').findOne({ slug });
  if (exists) return { error: 'slug_taken' };
  const doc: InstitutionDoc = {
    slug,
    name: opts.name.slice(0, 80),
    tagline: opts.tagline.slice(0, 140),
    about: opts.about.slice(0, 2000),
    color: /^#[0-9a-fA-F]{6}$/.test(opts.color) ? opts.color : '#00b369',
    emoji: opts.emoji.slice(0, 4) || '',
    visibility: opts.visibility === 'private' ? 'private' : 'public',
    capabilityPack: 'foundation',
    enabledModules: [],
    ownerId: opts.ownerId,
    ownerName: opts.ownerName,
    memberCount: 1,
    createdAt: new Date(),
  };
  await db.collection('institutions').insertOne(doc as unknown as Record<string, unknown>);
  await db.collection('institution_members').insertOne({
    institutionSlug: slug,
    userId: opts.ownerId,
    userName: opts.ownerName,
    role: 'owner',
    joinedAt: new Date(),
  });
  return { slug };
}

/**
 * Institutions are not created by clicking a button.
 * Applications enter a platform review queue (Shopify/GitHub Org style).
 */
export async function submitInstitutionApplication(opts: {
  name: string;
  tagline: string;
  about: string;
  color: string;
  visibility: 'public' | 'private';
  applicantId: string;
  applicantName: string;
  applicantEmail?: string;
  website?: string;
  country?: string;
  institutionType?: string;
  estimatedStudents?: number;
  requestedDeployment?: string;
}): Promise<{ applicationId: string; status: 'submitted' } | { error: string }> {
  await ensureLearnCollections();
  const db = await getDb();
  const name = opts.name.slice(0, 80).trim();
  if (name.length < 3) return { error: 'invalid_name' };
  const slugRequested = slugify(name);
  const pending = await db.collection('institution_applications').findOne({
    applicantId: opts.applicantId,
    status: { $in: ['submitted', 'under_review'] },
  });
  if (pending) {
    return { applicationId: String(pending._id), status: 'submitted' };
  }
  const res = await db.collection('institution_applications').insertOne({
    name,
    slugRequested,
    tagline: opts.tagline.slice(0, 140),
    about: opts.about.slice(0, 2000),
    color: /^#[0-9a-fA-F]{6}$/.test(opts.color) ? opts.color : '#00b369',
    visibility: opts.visibility === 'private' ? 'private' : 'public',
    website: opts.website?.slice(0, 200) ?? null,
    country: opts.country?.slice(0, 80) ?? null,
    institutionType: opts.institutionType ?? 'OTHER',
    estimatedStudents: opts.estimatedStudents ?? null,
    requestedDeployment: opts.requestedDeployment ?? 'MANAGED_CLOUD',
    applicantId: opts.applicantId,
    applicantName: opts.applicantName,
    applicantEmail: opts.applicantEmail ?? null,
    status: 'submitted',
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return { applicationId: res.insertedId.toString(), status: 'submitted' };
}

export async function listPublicInstitutions(): Promise<InstitutionDoc[]> {
  try {
    await ensureLearnCollections();
    const db = await getDb();
    const docs = await db
      .collection('institutions')
      .find({ visibility: 'public' }, { projection: { _id: 0 } })
      .sort({ memberCount: -1, createdAt: 1 })
      .toArray();
    return docs as unknown as InstitutionDoc[];
  } catch {
    return [];
  }
}

/** Case-insensitive name/tagline/country search over public campuses. */
export async function searchInstitutions(query: string, limit = 20): Promise<InstitutionDoc[]> {
  const q = query.trim();
  const all = await listPublicInstitutions();
  if (!q) return all.slice(0, limit);
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  return all
    .map((inst) => {
      const hay = `${inst.name} ${inst.tagline} ${inst.slug} ${inst.country ?? ''}`.toLowerCase();
      const score = terms.reduce((s, t) => s + (hay.includes(t) ? 1 : 0), 0);
      return { inst, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || b.inst.memberCount - a.inst.memberCount)
    .slice(0, limit)
    .map((x) => x.inst);
}

/**
 * Verify a student against an institution's auth method.
 * Credentials are forwarded to the campus (or accepted in demo mode) -
 * InTelleX never stores the campus password.
 */
export async function verifyInstitutionStudent(opts: {
  institution: InstitutionDoc;
  matricule: string;
  password: string;
}): Promise<
  | {
      ok: true;
      studentId: string;
      department?: string;
      faculty?: string;
      program?: string;
      year?: string;
    }
  | { ok: false; error: string }
> {
  const method = opts.institution.authMethod ?? 'open';
  const matricule = opts.matricule.trim();
  if (!matricule) return { ok: false, error: 'matricule_required' };

  if (method === 'open') {
    return { ok: true, studentId: matricule };
  }

  if (method === 'matricule' || method === 'enrollment_code') {
    if (!opts.password || opts.password.length < 3) {
      return { ok: false, error: 'password_required' };
    }
    // Federated verify: if the campus exposes a gateway URL, call it.
    const gateway = process.env.INSTITUTION_VERIFY_URL;
    if (gateway) {
      try {
        const res = await fetch(gateway, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            institutionSlug: opts.institution.slug,
            matricule,
            password: opts.password,
          }),
        });
        if (!res.ok) return { ok: false, error: 'institution_rejected' };
        const data = await res.json().catch(() => ({}));
        return {
          ok: true,
          studentId: String(data.studentId ?? matricule),
          department: data.department ? String(data.department) : undefined,
          faculty: data.faculty ? String(data.faculty) : undefined,
          program: data.program ? String(data.program) : undefined,
          year: data.year ? String(data.year) : undefined,
        };
      } catch {
        return { ok: false, error: 'institution_unreachable' };
      }
    }
    // Demo / bootstrap: accept well-formed credentials; academic data stays local.
    if (matricule.length < 3) return { ok: false, error: 'invalid_matricule' };
    return {
      ok: true,
      studentId: matricule,
      department: 'General',
      program: 'Enrolled student',
      year: '-',
    };
  }

  return { ok: false, error: 'auth_method_unsupported' };
}

export async function getInstitution(slug: string): Promise<InstitutionDoc | null> {
  try {
    await ensureLearnCollections();
    const db = await getDb();
    const doc = await db
      .collection('institutions')
      .findOne({ slug }, { projection: { _id: 0 } });
    return (doc as unknown as InstitutionDoc) ?? null;
  } catch {
    return null;
  }
}

/** Members of a campus - used to allocate an instructor to a course. */
export async function listInstitutionMembers(
  slug: string,
): Promise<{ userId: string; userName: string; role: string }[]> {
  try {
    const db = await getDb();
    const docs = await db
      .collection('institution_members')
      .find({ institutionSlug: slug })
      .project({ userId: 1, userName: 1, role: 1 })
      .limit(500)
      .toArray();
    return docs.map((d) => ({
      userId: String(d.userId),
      userName: String(d.userName || 'Member'),
      role: String(d.role || 'member'),
    }));
  } catch {
    return [];
  }
}

export async function getMembership(
  slug: string,
  userId: string,
): Promise<'owner' | 'member' | null> {
  try {
    const db = await getDb();
    const doc = await db
      .collection('institution_members')
      .findOne({ institutionSlug: slug, userId });
    return (doc?.role as 'owner' | 'member') ?? null;
  } catch {
    return null;
  }
}

export async function joinInstitution(slug: string, userId: string, userName: string) {
  const db = await getDb();
  const res = await db.collection('institution_members').updateOne(
    { institutionSlug: slug, userId },
    { $setOnInsert: { institutionSlug: slug, userId, userName, role: 'member', joinedAt: new Date() } },
    { upsert: true },
  );
  if (res.upsertedCount > 0) {
    await db.collection('institutions').updateOne({ slug }, { $inc: { memberCount: 1 } });
  }
}

export async function myInstitutionSlugs(userId: string): Promise<Set<string>> {
  try {
    const db = await getDb();
    const docs = await db
      .collection('institution_members')
      .find({ userId }, { projection: { institutionSlug: 1 } })
      .toArray();
    return new Set(docs.map((d) => d.institutionSlug as string));
  } catch {
    return new Set();
  }
}

export async function listInstitutionPosts(slug: string): Promise<(InstitutionPostDoc & { id: string })[]> {
  try {
    const db = await getDb();
    const docs = await db
      .collection('institution_posts')
      .find({ institutionSlug: slug })
      .sort({ createdAt: -1 })
      .limit(30)
      .toArray();
    return docs.map((d) => ({ ...(d as unknown as InstitutionPostDoc), id: d._id.toString() }));
  } catch {
    return [];
  }
}

export async function createInstitutionPost(opts: {
  institutionSlug: string;
  authorId: string;
  authorName: string;
  title: string;
  body: string;
  visibility?: 'private' | 'network' | 'public';
}) {
  const db = await getDb();
  await db.collection('institution_posts').insertOne({
    institutionSlug: opts.institutionSlug,
    authorId: opts.authorId,
    authorName: opts.authorName,
    title: opts.title.slice(0, 140),
    body: opts.body.slice(0, 4000),
    visibility: opts.visibility ?? 'private',
    createdAt: new Date(),
  });
}

// ── Admin overview ────────────────────────────────────────────────────────────

export async function getAdminLearningOverview() {
  await ensureLearnCollections();
  const db = await getDb();
  const collections: { name: string; count: number }[] = [];
  for (const name of LEARN_COLLECTIONS) {
    collections.push({ name, count: await db.collection(name).countDocuments() });
  }
  // Course class sessions live outside LEARN_COLLECTIONS (created on demand).
  const { countCourseClassSessions, listRecentCourseClasses } = await import(
    '@/lib/learn/courseClassSessions'
  );
  const classSessionCount = await countCourseClassSessions();
  collections.push({ name: 'course_class_sessions', count: classSessionCount });

  const [
    recentLearners,
    recentEnrollments,
    recentBookings,
    recentBooks,
    recentInstitutions,
    recentClassSessions,
  ] = await Promise.all([
    db.collection('learners').find({}, { projection: { _id: 0, lbId: 1, name: 1, email: 1, xp: 1, streakCount: 1, roles: 1, lastLoginAt: 1 } }).sort({ lastLoginAt: -1 }).limit(25).toArray(),
    db.collection('enrollments').find({}, { projection: { _id: 0 } }).sort({ enrolledAt: -1 }).limit(25).toArray(),
    db.collection('bookings').find({}).sort({ createdAt: -1 }).limit(25).toArray(),
    db.collection('books').find({}, { projection: { chapters: 0 } }).sort({ createdAt: -1 }).limit(25).toArray(),
    db.collection('institutions').find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).limit(25).toArray(),
    listRecentCourseClasses(40),
  ]);
  const revenueRows = await db
    .collection('book_purchases')
    .aggregate([{ $match: { priceXAF: { $gt: 0 } } }, { $group: { _id: null, total: { $sum: '$priceXAF' } } }])
    .toArray();
  return {
    collections,
    bookRevenueXAF: (revenueRows[0]?.total as number) ?? 0,
    recentLearners,
    recentEnrollments,
    recentBookings: recentBookings.map((b) => ({ ...b, _id: b._id.toString() })),
    recentBooks: recentBooks.map((b) => ({ ...b, _id: b._id.toString() })),
    recentInstitutions,
    recentClassSessions,
  };
}

// ── Seeds ─────────────────────────────────────────────────────────────────────

async function seedIntellexInstitution(db: Awaited<ReturnType<typeof getDb>>) {
  // Remove demo campuses that were previously auto-seeded.
  await db.collection('institutions').deleteMany({
    slug: {
      $in: [
        'university-of-buea',
        'saint-monica-university',
        'seven-advanced-academy',
      ],
    },
    ownerId: 'system',
  });

  // Ensure the home InTelleX campus exists - Platform Admin customizes it.
  // Never overwrite branding/copy once an admin has set fields.
  const exists = await db.collection('institutions').findOne({ slug: 'intellex' });
  if (!exists) {
    await db.collection('institutions').insertOne({
      slug: 'intellex',
      name: 'InTelleX',
      tagline: 'The home campus of the InTelleX learning ecosystem',
      about:
        'InTelleX is the founding institution of the ecosystem - public courses, mentorship, certifications, career programs and communities. Other schools, academies and companies join via Platform onboarding.',
      color: '#00b369',
      emoji: '',
      logoUrl: null,
      coverUrl: null,
      visibility: 'public',
      authMethod: 'open',
      country: 'Cameroon',
      capabilityPack: 'enterprise',
      enabledModules: [],
      ownerId: 'system',
      ownerName: 'InTelleX',
      memberCount: 0,
      createdAt: new Date(),
    });
    return;
  }

  const patch: Record<string, unknown> = {};
  if (!exists.authMethod) {
    patch.authMethod = 'open';
    patch.country = exists.country ?? 'Cameroon';
  }
  if (!exists.capabilityPack) {
    patch.capabilityPack = 'enterprise';
    patch.enabledModules = exists.enabledModules ?? [];
  }
  if (Object.keys(patch).length) {
    await db.collection('institutions').updateOne({ slug: 'intellex' }, { $set: patch });
  }
}

const SEED_BOOKS: Array<
  Pick<BookDoc, 'title' | 'subtitle' | 'description' | 'category' | 'coverColor' | 'coverEmoji' | 'chapters'>
> = [
  {
    title: 'The Intellex Web Developer Handbook',
    subtitle: 'From your first HTML tag to a deployed product',
    description:
      'A practical companion to the Intellex web tracks - how the pieces fit together, how to structure projects, and how to think like a working developer.',
    category: 'Programming',
    coverColor: '#00b369',
    coverEmoji: 'G',
    chapters: [
      {
        title: 'How the web actually works',
        content:
          'Every website you visit is a conversation between two computers.\n\nYour browser (the client) asks a server for a page. The server answers with **HTML** (structure), **CSS** (style) and **JavaScript** (behaviour). Everything else - frameworks, databases, APIs - exists to make that conversation richer.\n\nKey ideas:\n- A URL is an address, DNS is the phonebook that resolves it.\n- HTTP is the language of the request/response cycle.\n- The browser builds a DOM from HTML and paints it to the screen.\n\n```text\nBrowser ──request──▶ Server\nBrowser ◀─response── Server (HTML + CSS + JS)\n```\n\nWhen you understand this loop, every technology you learn afterwards has a place to live in your mental model.',
      },
      {
        title: 'Structuring your first real project',
        content:
          'Beginners write files. Developers design folders.\n\nA simple, scalable structure:\n\n```text\nmy-app/\n├── index.html\n├── css/\n│   └── styles.css\n├── js/\n│   └── main.js\n└── assets/\n    └── images/\n```\n\nRules that keep projects healthy:\n- One responsibility per file.\n- Name things for what they do, not what they are.\n- Commit early and often with git.\n\nAs your projects grow, this discipline is what separates a portfolio that impresses from one that scares reviewers away.',
      },
      {
        title: 'From localhost to the internet',
        content:
          'A project that only runs on your laptop is a rehearsal, not a performance.\n\nThe modern deployment path:\n1. Push your code to GitHub.\n2. Connect the repository to a host (Vercel, Netlify, or a VPS).\n3. Every push becomes a live deployment.\n\nThings to check before you ship:\n- Images are compressed.\n- The site works on a phone.\n- Links, forms and titles are correct.\n\nShip small, ship often. Deployed beats perfect.',
      },
    ],
  },
  {
    title: 'Python Cheatsheet Collection',
    subtitle: 'Syntax, patterns and standard-library gems on tap',
    description:
      'The fastest reference for the Intellex Python track: core syntax, data structures, comprehensions, file handling and the patterns you will use every single day.',
    category: 'Programming',
    coverColor: '#3572A5',
    coverEmoji: 'P',
    chapters: [
      {
        title: 'Core syntax at a glance',
        content:
          'Variables, types and control flow - the 20% of Python you use 80% of the time.\n\n```python\nname = "Ada"            # str\nage = 36                 # int\nskills = ["ml", "math"] # list\nprofile = {"name": name, "age": age}  # dict\n\nif age >= 18:\n    print(f"{name} is an adult")\n\nfor skill in skills:\n    print(skill.upper())\n```\n\nRemember: indentation *is* syntax in Python. Four spaces, always.',
      },
      {
        title: 'Comprehensions and slicing',
        content:
          'Pythonic code is compact without being cryptic.\n\n```python\nnums = [1, 2, 3, 4, 5, 6]\n\nevens = [n for n in nums if n % 2 == 0]      # [2, 4, 6]\nsquares = {n: n * n for n in nums}            # dict comprehension\nfirst_three = nums[:3]                        # [1, 2, 3]\nreversed_all = nums[::-1]                     # [6, 5, 4, 3, 2, 1]\n```\n\nIf a comprehension needs more than one condition and one transform, use a regular loop - readability wins.',
      },
      {
        title: 'Files, errors and the standard library',
        content:
          'The patterns you will reach for daily:\n\n```python\nfrom pathlib import Path\nimport json\n\n# Read and write files safely\ndata = json.loads(Path("config.json").read_text())\n\ntry:\n    value = data["missing_key"]\nexcept KeyError:\n    value = "default"\n\nPath("output.txt").write_text("done\\n")\n```\n\nExplore `collections`, `itertools`, and `datetime` before installing a package - the standard library probably already solves it.',
      },
    ],
  },
  {
    title: 'The Career Switch Playbook',
    subtitle: 'A field guide for breaking into tech from anywhere',
    description:
      'How to go from learning to earning: building proof of skill, positioning yourself, finding your first clients or job, and growing once you are in.',
    category: 'Career',
    coverColor: '#7c3aed',
    coverEmoji: 'R',
    chapters: [
      {
        title: 'Proof beats promises',
        content:
          'Nobody hires potential they cannot see.\n\nYour portfolio is your proof. Three focused projects beat thirty tutorials:\n1. **A clone** - proves you can execute (rebuild a real product screen).\n2. **A tool** - proves you can think (solve a problem you actually have).\n3. **A collaboration** - proves you can work with others (contribute or pair up).\n\nEach project needs: a live link, a clear README, and a short write-up of decisions you made. That write-up is what interviewers actually read.',
      },
      {
        title: 'Positioning and the first opportunity',
        content:
          'The market does not reward the most skilled - it rewards the most legible.\n\nMake yourself easy to say yes to:\n- One sentence bio: "I build X for Y using Z."\n- A LinkedIn/GitHub that matches that sentence.\n- Evidence pinned at the top.\n\nFirst opportunities rarely come from job boards. They come from:\n- People who watched you learn in public.\n- Small businesses near you with real problems.\n- Communities where you consistently helped others.\n\nDo work worth talking about, then talk about it.',
      },
    ],
  },
];

async function seedBooks(db: Awaited<ReturnType<typeof getDb>>) {
  const count = await db.collection('books').countDocuments();
  if (count > 0) return;
  const now = new Date();
  await db.collection('books').insertMany(
    SEED_BOOKS.map((b) => ({
      ...b,
      authorId: 'system',
      authorName: 'Intellex Library',
      priceXAF: 0,
      published: true,
      sales: 0,
      createdAt: now,
      updatedAt: now,
    })),
  );
}
