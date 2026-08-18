import { getDb } from '@/lib/repo';
import { getLearner, upsertAffiliation } from '@/lib/learn/repo';
import { getOrgConfig } from '@/lib/org/config';

export const OFFICIAL_STUDENT_STATUSES = ['active', 'admitted'] as const;

export type StudentMembership = {
  isStudent: boolean;
  status: string | null;
  matricule: string | null;
  program: string | null;
  department: string | null;
  year: string | null;
  campusSlug: string | null;
  cohort: string | null;
  classHead: boolean;
};

function emptyMembership(): StudentMembership {
  return {
    isStudent: false,
    status: null,
    matricule: null,
    program: null,
    department: null,
    year: null,
    campusSlug: null,
    cohort: null,
    classHead: false,
  };
}

async function recordsCol() {
  const db = await getDb();
  await Promise.all([
    db.collection('student_records').createIndex({ userId: 1 }, { unique: true }).catch(() => {}),
    db.collection('student_records').createIndex({ studentCode: 1 }, { unique: true, sparse: true }).catch(() => {}),
    db.collection('student_records').createIndex({ matricule: 1 }, { unique: true, sparse: true }).catch(() => {}),
    db.collection('learners').createIndex({ matricule: 1 }, { unique: true, sparse: true }).catch(() => {}),
  ]);
  return db.collection('student_records');
}

export async function getStudentMembership(userId: string): Promise<StudentMembership> {
  if (!userId) return emptyMembership();
  try {
    const col = await recordsCol();
    const rec = await col.findOne({ userId });
    const learner = await getLearner(userId);
    const status = String(rec?.status || learner?.studentStatus || '');
    const matricule = String(rec?.matricule || rec?.studentCode || learner?.matricule || '') || null;
    const isStudent = OFFICIAL_STUDENT_STATUSES.includes(
      status as (typeof OFFICIAL_STUDENT_STATUSES)[number],
    );
    return {
      isStudent,
      status: status || null,
      matricule,
      program: String(rec?.program || '') || null,
      department: String(rec?.department || '') || null,
      year: String(rec?.year || '') || null,
      campusSlug: String(rec?.campusSlug || '') || null,
      cohort: String(rec?.cohort || learner?.preferences?.academicCohort || '') || null,
      classHead: Boolean(rec?.classHead) && isStudent,
    };
  } catch {
    return emptyMembership();
  }
}

export async function isClassHead(userId: string): Promise<boolean> {
  const m = await getStudentMembership(userId);
  return m.classHead;
}

export async function isOfficialStudent(userId: string): Promise<boolean> {
  const m = await getStudentMembership(userId);
  return m.isStudent;
}

function newMatricule(year = new Date().getFullYear()) {
  const n = Math.floor(10000 + Math.random() * 90000);
  return `INT-${year}-${n}`;
}

/** Upgrade the existing account — never create a second login. */
export async function activateStudentMembership(opts: {
  userId: string;
  program?: string | null;
  department?: string | null;
  year?: string | null;
  campusSlug?: string | null;
  name?: string | null;
  email?: string | null;
  status?: 'admitted' | 'active';
}): Promise<StudentMembership> {
  const col = await recordsCol();
  const org = await getOrgConfig();
  const learner = await getLearner(opts.userId);
  const existing = await col.findOne({ userId: opts.userId });
  let matricule = String(existing?.matricule || existing?.studentCode || learner?.matricule || '');
  if (!matricule) {
    matricule = newMatricule();
    while (await col.findOne({ $or: [{ matricule }, { studentCode: matricule }] })) {
      matricule = newMatricule();
    }
  }
  const now = new Date();
  const status = opts.status || 'active';
  const doc = {
    userId: opts.userId,
    studentCode: matricule,
    matricule,
    status,
    program: opts.program ?? existing?.program ?? '',
    department: opts.department ?? existing?.department ?? '',
    faculty: existing?.faculty ?? '',
    year: opts.year ?? existing?.year ?? '',
    phone: existing?.phone ?? '',
    notes: existing?.notes ?? '',
    campusSlug: opts.campusSlug ?? existing?.campusSlug ?? '',
    name: opts.name || learner?.name || existing?.name || '',
    email: opts.email || learner?.email || existing?.email || '',
    updatedAt: now,
  };
  await col.updateOne(
    { userId: opts.userId },
    { $set: doc, $setOnInsert: { createdAt: now } },
    { upsert: true },
  );

  const db = await getDb();
  await db.collection('learners').updateOne(
    { lbId: opts.userId },
    {
      $set: {
        matricule,
        studentStatus: status,
        updatedAt: now,
      },
    },
  );

  await upsertAffiliation(opts.userId, {
    institutionSlug: org.slug,
    institutionName: org.name,
    role: 'student',
    status: 'verified',
    externalStudentId: matricule,
    program: String(doc.program || '') || null,
    department: String(doc.department || '') || null,
    year: String(doc.year || '') || null,
    profileComplete: true,
    verifiedAt: now,
    joinedAt: existing?.createdAt || now,
  }).catch(() => null);

  return getStudentMembership(opts.userId);
}

export async function findAccountByMatricule(raw: string): Promise<{
  userId: string;
  email: string;
} | null> {
  const code = String(raw || '').trim();
  if (!code || code.includes('@')) return null;
  const escaped = code.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = { $regex: `^${escaped}$`, $options: 'i' as const };
  const db = await getDb();
  const rec = await db.collection('student_records').findOne({
    $or: [{ matricule: match }, { studentCode: match }],
  });
  if (rec?.userId) {
    const learner = await getLearner(String(rec.userId));
    const email = String(rec.email || learner?.email || '').trim().toLowerCase();
    if (email) return { userId: String(rec.userId), email };
  }
  const learner = await db.collection('learners').findOne({ matricule: match });
  if (learner?.lbId && learner.email) {
    return { userId: String(learner.lbId), email: String(learner.email).toLowerCase() };
  }
  return null;
}
