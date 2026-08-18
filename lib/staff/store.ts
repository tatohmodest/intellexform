/**
 * InTelleX institutional operations — staff posts, student records, fees, audit.
 * All privileged writes go through requireStaff / requirePlatformAdmin.
 */

import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/repo';
import { getSessionUser } from '@/lib/auth/getUser';
import { getLearner } from '@/lib/learn/repo';
import { createNotificationsForUsers } from '@/lib/learn/notifications';
import {
  DESK_PERMISSIONS,
  STUDENT_STATUSES,
  isStaffDesk,
  isStaffPermission,
  permissionsForDesks,
  type StaffDesk,
  type StaffPermission,
  type StudentStatus,
} from '@/lib/staff/permissions';

export type StaffPost = {
  userId: string;
  email: string;
  name: string;
  desks: StaffDesk[];
  extraPermissions: StaffPermission[];
  active: boolean;
  grantedBy: string;
  grantedAt: Date;
  updatedAt: Date;
};

export type StaffActor = {
  userId: string;
  email: string;
  name: string;
  post: StaffPost;
  permissions: StaffPermission[];
};

export class StaffAuthError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function postsCol() {
  const db = await getDb();
  await db.collection('staff_posts').createIndex({ userId: 1 }, { unique: true }).catch(() => {});
  await db.collection('staff_posts').createIndex({ email: 1 }).catch(() => {});
  return db.collection('staff_posts');
}

async function recordsCol() {
  const db = await getDb();
  await db.collection('student_records').createIndex({ userId: 1 }, { unique: true }).catch(() => {});
  await db.collection('student_records').createIndex({ studentCode: 1 }, { unique: true }).catch(() => {});
  await db.collection('student_records').createIndex({ status: 1 }).catch(() => {});
  return db.collection('student_records');
}

async function feesCol() {
  const db = await getDb();
  await db.collection('fee_structures').createIndex({ active: 1, createdAt: -1 }).catch(() => {});
  return db.collection('fee_structures');
}

async function chargesCol() {
  const db = await getDb();
  await db.collection('fee_charges').createIndex({ studentUserId: 1, createdAt: -1 }).catch(() => {});
  await db.collection('fee_charges').createIndex({ status: 1 }).catch(() => {});
  return db.collection('fee_charges');
}

async function paymentsCol() {
  const db = await getDb();
  await db.collection('fee_payments').createIndex({ studentUserId: 1, createdAt: -1 }).catch(() => {});
  await db.collection('fee_payments').createIndex({ chargeId: 1 }).catch(() => {});
  return db.collection('fee_payments');
}

async function auditCol() {
  const db = await getDb();
  await db.collection('staff_audit').createIndex({ createdAt: -1 }).catch(() => {});
  await db.collection('staff_audit').createIndex({ actorId: 1, createdAt: -1 }).catch(() => {});
  return db.collection('staff_audit');
}

async function admissionsCol() {
  const db = await getDb();
  await db.collection('staff_admissions').createIndex({ email: 1 }).catch(() => {});
  await db.collection('staff_admissions').createIndex({ status: 1, createdAt: -1 }).catch(() => {});
  return db.collection('staff_admissions');
}

export function permissionsOf(post: StaffPost): StaffPermission[] {
  const fromDesks = permissionsForDesks(post.desks || []);
  return Array.from(new Set([...fromDesks, ...(post.extraPermissions || [])]));
}

export function hasPermission(post: StaffPost, permission: StaffPermission) {
  if (!post.active) return false;
  return permissionsOf(post).includes(permission);
}

export async function writeStaffAudit(opts: {
  actorId: string;
  actorName: string;
  actorEmail: string;
  action: string;
  entityType: string;
  entityId?: string;
  summary: string;
  before?: unknown;
  after?: unknown;
}) {
  const col = await auditCol();
  await col.insertOne({
    ...opts,
    createdAt: new Date(),
  });
}

export async function getStaffPost(userId: string): Promise<StaffPost | null> {
  const col = await postsCol();
  const doc = await col.findOne({ userId, active: true });
  if (!doc) return null;
  return {
    userId: String(doc.userId),
    email: String(doc.email || ''),
    name: String(doc.name || ''),
    desks: Array.isArray(doc.desks) ? (doc.desks as StaffDesk[]) : [],
    extraPermissions: Array.isArray(doc.extraPermissions)
      ? (doc.extraPermissions as StaffPermission[])
      : [],
    active: doc.active !== false,
    grantedBy: String(doc.grantedBy || ''),
    grantedAt: new Date(doc.grantedAt || Date.now()),
    updatedAt: new Date(doc.updatedAt || Date.now()),
  };
}

export async function requireStaff(permission: StaffPermission): Promise<StaffActor> {
  const session = getSessionUser();
  if (!session) throw new StaffAuthError('Sign in required.', 401);
  const post = await getStaffPost(session.uid);
  if (!post || !hasPermission(post, permission)) {
    throw new StaffAuthError('You do not have permission for this staff action.', 403);
  }
  return {
    userId: session.uid,
    email: session.email,
    name: session.name,
    post,
    permissions: permissionsOf(post),
  };
}

export async function listStaffPosts(): Promise<StaffPost[]> {
  const col = await postsCol();
  const rows = await col.find({}).sort({ updatedAt: -1 }).limit(200).toArray();
  return rows.map((doc) => ({
    userId: String(doc.userId),
    email: String(doc.email || ''),
    name: String(doc.name || ''),
    desks: Array.isArray(doc.desks) ? (doc.desks as StaffDesk[]) : [],
    extraPermissions: Array.isArray(doc.extraPermissions)
      ? (doc.extraPermissions as StaffPermission[])
      : [],
    active: doc.active !== false,
    grantedBy: String(doc.grantedBy || ''),
    grantedAt: new Date(doc.grantedAt || Date.now()),
    updatedAt: new Date(doc.updatedAt || Date.now()),
  }));
}

export async function upsertStaffPost(opts: {
  email: string;
  desks: StaffDesk[];
  extraPermissions?: StaffPermission[];
  active?: boolean;
  grantedBy: string;
}): Promise<StaffPost | { error: string; status: number }> {
  const email = opts.email.trim().toLowerCase();
  if (!email.includes('@')) return { error: 'Enter a valid email.', status: 400 };
  const desks = opts.desks.filter(isStaffDesk);
  if (!desks.length) return { error: 'Choose at least one desk.', status: 400 };
  const extraPermissions = (opts.extraPermissions || []).filter(isStaffPermission);

  const db = await getDb();
  const learner = await db.collection('learners').findOne({
    email: { $regex: new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
  });
  if (!learner?.lbId) {
    return {
      error: 'No InTelleX account exists for that email. They must sign up first.',
      status: 404,
    };
  }

  const now = new Date();
  const col = await postsCol();
  const existing = await col.findOne({ userId: learner.lbId });
  await col.updateOne(
    { userId: learner.lbId },
    {
      $set: {
        userId: String(learner.lbId),
        email: String(learner.email || email),
        name: String(learner.name || email.split('@')[0]),
        desks,
        extraPermissions,
        active: opts.active !== false,
        grantedBy: opts.grantedBy,
        updatedAt: now,
      },
      $setOnInsert: { grantedAt: now },
    },
    { upsert: true },
  );

  await writeStaffAudit({
    actorId: 'platform-admin',
    actorName: opts.grantedBy,
    actorEmail: opts.grantedBy,
    action: existing ? 'staff.post.update' : 'staff.post.grant',
    entityType: 'staff_post',
    entityId: String(learner.lbId),
    summary: `${opts.grantedBy} ${existing ? 'updated' : 'granted'} staff desks (${desks.join(', ')}) for ${email}`,
    before: existing
      ? { desks: existing.desks, active: existing.active }
      : null,
    after: { desks, extraPermissions, active: opts.active !== false },
  });

  const post = await getStaffPost(String(learner.lbId));
  if (!post) {
    const all = await col.findOne({ userId: learner.lbId });
    return {
      userId: String(learner.lbId),
      email: String(learner.email || email),
      name: String(learner.name || ''),
      desks,
      extraPermissions,
      active: opts.active !== false,
      grantedBy: opts.grantedBy,
      grantedAt: new Date(all?.grantedAt || now),
      updatedAt: now,
    };
  }
  return post;
}

export async function revokeStaffPost(userId: string, grantedBy: string) {
  const col = await postsCol();
  const existing = await col.findOne({ userId });
  await col.updateOne(
    { userId },
    { $set: { active: false, updatedAt: new Date() } },
  );
  await writeStaffAudit({
    actorId: 'platform-admin',
    actorName: grantedBy,
    actorEmail: grantedBy,
    action: 'staff.post.revoke',
    entityType: 'staff_post',
    entityId: userId,
    summary: `${grantedBy} revoked staff access for ${existing?.email || userId}`,
    before: existing ? { desks: existing.desks, active: existing.active } : null,
    after: { active: false },
  });
}

function newStudentCode() {
  const year = new Date().getFullYear();
  const n = Math.floor(10000 + Math.random() * 90000);
  return `INT-${year}-${n}`;
}

async function ensureStudentRecord(userId: string, fallback?: { name?: string; email?: string }) {
  const col = await recordsCol();
  const existing = await col.findOne({ userId });
  if (existing) return existing;
  const learner = await getLearner(userId);
  const now = new Date();
  let code = newStudentCode();
  while (await col.findOne({ studentCode: code })) {
    code = newStudentCode();
  }
  const doc = {
    _id: new ObjectId(),
    userId,
    studentCode: code,
    status: 'active' as StudentStatus,
    program: '',
    department: '',
    faculty: '',
    year: '',
    phone: '',
    notes: '',
    name: learner?.name || fallback?.name || '',
    email: learner?.email || fallback?.email || '',
    createdAt: now,
    updatedAt: now,
  };
  await col.insertOne(doc);
  return doc;
}

export async function listStudents(opts: {
  q?: string;
  status?: string;
  page?: number;
}) {
  const db = await getDb();
  const page = Math.max(1, opts.page || 1);
  const pageSize = 40;
  const query: Record<string, unknown> = {};
  const recCol = await recordsCol();
  if (opts.q?.trim()) {
    const q = opts.q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const recHits = await recCol
      .find({
        $or: [
          { studentCode: { $regex: q, $options: 'i' } },
          { program: { $regex: q, $options: 'i' } },
          { department: { $regex: q, $options: 'i' } },
        ],
      })
      .project({ userId: 1 })
      .limit(80)
      .toArray();
    const extraIds = recHits.map((r) => String(r.userId));
    query.$or = [
      { name: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } },
      ...(extraIds.length ? [{ lbId: { $in: extraIds } }] : []),
    ];
  }
  const total = await db.collection('learners').countDocuments(query);
  const learners = await db
    .collection('learners')
    .find(query, { projection: { _id: 0, passwordHash: 0 } })
    .sort({ lastLoginAt: -1, createdAt: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .toArray();

  const ids = learners.map((l) => String(l.lbId));
  const records = await recCol.find({ userId: { $in: ids } }).toArray();
  const recById = new Map(records.map((r) => [String(r.userId), r]));

  const chCol = await chargesCol();
  const balances = await chCol
    .aggregate([
      { $match: { studentUserId: { $in: ids } } },
      {
        $group: {
          _id: '$studentUserId',
          charged: { $sum: '$amountXAF' },
          paid: { $sum: '$paidXAF' },
        },
      },
    ])
    .toArray();
  const balById = new Map(balances.map((b) => [String(b._id), b]));

  const rows = [];
  for (const l of learners) {
    const id = String(l.lbId);
    let rec = recById.get(id);
    if (!rec) {
      rec = await ensureStudentRecord(id, {
        name: String(l.name || ''),
        email: String(l.email || ''),
      });
    }
    if (opts.status && rec.status !== opts.status) continue;
    const bal = balById.get(id);
    rows.push({
      userId: id,
      studentCode: String(rec.studentCode || ''),
      name: String(l.name || rec.name || ''),
      email: String(l.email || rec.email || ''),
      status: String(rec.status || 'active'),
      program: String(rec.program || ''),
      department: String(rec.department || ''),
      year: String(rec.year || ''),
      lastLoginAt: l.lastLoginAt || null,
      outstandingXAF: Math.max(0, Number(bal?.charged || 0) - Number(bal?.paid || 0)),
    });
  }

  return { students: rows, total, page, pageSize };
}

export async function getStudentDetail(userId: string) {
  const learner = await getLearner(userId);
  if (!learner) return null;
  const rec = await ensureStudentRecord(userId, { name: learner.name, email: learner.email });
  const db = await getDb();
  const enrollments = await db
    .collection('course_enrollments')
    .find({ studentId: userId })
    .project({ courseTitle: 1, courseId: 1, createdAt: 1 })
    .sort({ createdAt: -1 })
    .limit(40)
    .toArray();
  const catalogue = await db
    .collection('enrollments')
    .find({ userId })
    .project({ courseSlug: 1, enrolledAt: 1 })
    .sort({ enrolledAt: -1 })
    .limit(40)
    .toArray();
  const chCol = await chargesCol();
  const charges = await chCol.find({ studentUserId: userId }).sort({ createdAt: -1 }).limit(50).toArray();
  const payCol = await paymentsCol();
  const payments = await payCol.find({ studentUserId: userId }).sort({ createdAt: -1 }).limit(50).toArray();
  const outstandingXAF = charges.reduce(
    (sum, c) => sum + Math.max(0, Number(c.amountXAF || 0) - Number(c.paidXAF || 0)),
    0,
  );

  return {
    userId,
    name: learner.name,
    email: learner.email,
    avatar: learner.avatar || null,
    xp: learner.xp || 0,
    streakCount: learner.streakCount || 0,
    record: {
      studentCode: String(rec.studentCode),
      status: rec.status as StudentStatus,
      program: String(rec.program || ''),
      department: String(rec.department || ''),
      faculty: String(rec.faculty || ''),
      year: String(rec.year || ''),
      phone: String(rec.phone || ''),
      notes: String(rec.notes || ''),
    },
    courses: [
      ...enrollments.map((e) => ({
        id: String(e.courseId || ''),
        title: String(e.courseTitle || 'Course'),
        kind: 'instructor' as const,
      })),
      ...catalogue.map((e) => ({
        id: String(e.courseSlug || ''),
        title: String(e.courseSlug || 'Catalogue course'),
        kind: 'catalogue' as const,
      })),
    ],
    charges: charges.map((c) => ({
      id: String(c._id),
      title: String(c.title || 'Fee'),
      amountXAF: Number(c.amountXAF || 0),
      paidXAF: Number(c.paidXAF || 0),
      status: String(c.status || 'open'),
      createdAt: c.createdAt,
    })),
    payments: payments.map((p) => ({
      id: String(p._id),
      amountXAF: Number(p.amountXAF || 0),
      method: String(p.method || 'other'),
      reference: String(p.reference || ''),
      receiptCode: String(p.receiptCode || ''),
      note: String(p.note || ''),
      createdAt: p.createdAt,
    })),
    outstandingXAF,
  };
}

export async function updateStudentRecord(
  actor: StaffActor,
  userId: string,
  patch: Partial<{
    status: StudentStatus;
    program: string;
    department: string;
    faculty: string;
    year: string;
    phone: string;
    notes: string;
  }>,
) {
  if (patch.status && !STUDENT_STATUSES.includes(patch.status)) {
    throw new StaffAuthError('Invalid student status.', 400);
  }
  if (patch.status && !hasPermission(actor.post, 'students.status')) {
    throw new StaffAuthError('You cannot change student status.', 403);
  }
  const rec = await ensureStudentRecord(userId);
  const col = await recordsCol();
  const next = {
    ...(patch.program !== undefined ? { program: String(patch.program).slice(0, 120) } : {}),
    ...(patch.department !== undefined ? { department: String(patch.department).slice(0, 120) } : {}),
    ...(patch.faculty !== undefined ? { faculty: String(patch.faculty).slice(0, 120) } : {}),
    ...(patch.year !== undefined ? { year: String(patch.year).slice(0, 40) } : {}),
    ...(patch.phone !== undefined ? { phone: String(patch.phone).slice(0, 40) } : {}),
    ...(patch.notes !== undefined ? { notes: String(patch.notes).slice(0, 2000) } : {}),
    ...(patch.status ? { status: patch.status } : {}),
    updatedAt: new Date(),
  };
  await col.updateOne({ userId }, { $set: next });
  await writeStaffAudit({
    actorId: actor.userId,
    actorName: actor.name,
    actorEmail: actor.email,
    action: patch.status ? 'student.status.change' : 'student.record.update',
    entityType: 'student_record',
    entityId: userId,
    summary: patch.status
      ? `${actor.name} changed student status ${rec.status} → ${patch.status}`
      : `${actor.name} updated student record`,
    before: {
      status: rec.status,
      program: rec.program,
      department: rec.department,
    },
    after: next,
  });
  return getStudentDetail(userId);
}

export async function listFeeStructures() {
  const col = await feesCol();
  const rows = await col.find({}).sort({ createdAt: -1 }).limit(80).toArray();
  return rows.map((r) => ({
    id: String(r._id),
    title: String(r.title),
    amountXAF: Number(r.amountXAF || 0),
    program: String(r.program || ''),
    active: r.active !== false,
    createdAt: r.createdAt,
  }));
}

export async function createFeeStructure(
  actor: StaffActor,
  opts: { title: string; amountXAF: number; program?: string },
) {
  const title = opts.title.trim().slice(0, 160);
  const amountXAF = Math.round(Number(opts.amountXAF) || 0);
  if (!title) throw new StaffAuthError('Enter a fee title.', 400);
  if (amountXAF < 1) throw new StaffAuthError('Enter an amount in XAF.', 400);
  const col = await feesCol();
  const doc = {
    title,
    amountXAF,
    program: String(opts.program || '').slice(0, 120),
    active: true,
    createdBy: actor.userId,
    createdAt: new Date(),
  };
  const res = await col.insertOne(doc);
  await writeStaffAudit({
    actorId: actor.userId,
    actorName: actor.name,
    actorEmail: actor.email,
    action: 'fees.structure.create',
    entityType: 'fee_structure',
    entityId: res.insertedId.toString(),
    summary: `${actor.name} created fee “${title}” (${amountXAF} XAF)`,
    after: doc,
  });
  return { id: res.insertedId.toString(), ...doc };
}

export async function chargeFee(
  actor: StaffActor,
  opts: { structureId?: string; studentUserId?: string; title?: string; amountXAF?: number; allActive?: boolean },
) {
  const structures = await feesCol();
  let title = opts.title?.trim() || '';
  let amountXAF = Math.round(Number(opts.amountXAF) || 0);
  if (opts.structureId && ObjectId.isValid(opts.structureId)) {
    const st = await structures.findOne({ _id: new ObjectId(opts.structureId) });
    if (st) {
      title = String(st.title);
      amountXAF = Number(st.amountXAF || 0);
    }
  }
  if (!title || amountXAF < 1) throw new StaffAuthError('Choose a fee structure or enter title and amount.', 400);

  const targets: string[] = [];
  if (opts.allActive) {
    const db = await getDb();
    const learners = await db
      .collection('learners')
      .find({})
      .project({ lbId: 1, name: 1, email: 1 })
      .limit(500)
      .toArray();
    for (const l of learners) {
      const id = String(l.lbId);
      await ensureStudentRecord(id, { name: String(l.name || ''), email: String(l.email || '') });
      const rec = await (await recordsCol()).findOne({ userId: id });
      if (!rec || rec.status === 'active' || rec.status === 'admitted') targets.push(id);
    }
  } else if (opts.studentUserId) {
    await ensureStudentRecord(opts.studentUserId);
    targets.push(opts.studentUserId);
  }
  if (!targets.length) throw new StaffAuthError('Choose a student or charge all active students.', 400);

  const ch = await chargesCol();
  const now = new Date();
  const docs = targets.map((studentUserId) => ({
    studentUserId,
    structureId: opts.structureId || null,
    title,
    amountXAF,
    paidXAF: 0,
    status: 'open',
    createdBy: actor.userId,
    createdAt: now,
  }));
  if (docs.length) await ch.insertMany(docs);
  await writeStaffAudit({
    actorId: actor.userId,
    actorName: actor.name,
    actorEmail: actor.email,
    action: 'fees.charge.create',
    entityType: 'fee_charge',
    summary: `${actor.name} charged “${title}” to ${docs.length} student${docs.length === 1 ? '' : 's'}`,
    after: { title, amountXAF, count: docs.length },
  });
  return { charged: docs.length, title, amountXAF };
}

export async function recordFeePayment(
  actor: StaffActor,
  opts: {
    studentUserId: string;
    chargeId: string;
    amountXAF: number;
    method: string;
    reference?: string;
    note?: string;
  },
) {
  const amountXAF = Math.round(Number(opts.amountXAF) || 0);
  if (amountXAF < 1) throw new StaffAuthError('Enter a payment amount.', 400);
  if (!ObjectId.isValid(opts.chargeId)) throw new StaffAuthError('Invalid charge.', 400);
  const ch = await chargesCol();
  const charge = await ch.findOne({
    _id: new ObjectId(opts.chargeId),
    studentUserId: opts.studentUserId,
  });
  if (!charge) throw new StaffAuthError('Charge not found.', 404);
  const due = Math.max(0, Number(charge.amountXAF || 0) - Number(charge.paidXAF || 0));
  const applied = Math.min(amountXAF, due || amountXAF);
  const paidXAF = Number(charge.paidXAF || 0) + applied;
  const status = paidXAF >= Number(charge.amountXAF || 0) ? 'paid' : 'partial';
  await ch.updateOne({ _id: charge._id }, { $set: { paidXAF, status, updatedAt: new Date() } });
  const pay = await paymentsCol();
  const method = String(opts.method || 'other').slice(0, 40);
  const year = new Date().getFullYear();
  const receiptCode = `RCP-${year}-${Math.floor(100000 + Math.random() * 900000)}`;
  const doc = {
    studentUserId: opts.studentUserId,
    chargeId: opts.chargeId,
    amountXAF: applied,
    method,
    receiptCode,
    reference: String(opts.reference || '').slice(0, 80),
    note: String(opts.note || '').slice(0, 400),
    recordedBy: actor.userId,
    recordedByName: actor.name,
    createdAt: new Date(),
  };
  const res = await pay.insertOne(doc);
  await writeStaffAudit({
    actorId: actor.userId,
    actorName: actor.name,
    actorEmail: actor.email,
    action: 'fees.payment.record',
    entityType: 'fee_payment',
    entityId: res.insertedId.toString(),
    summary: `${actor.name} recorded ${applied} XAF (${method}) for student ${opts.studentUserId}`,
    after: doc,
  });
  return { id: res.insertedId.toString(), ...doc, chargeStatus: status };
}

export async function listOutstandingFees() {
  const ch = await chargesCol();
  const open = await ch
    .find({ $expr: { $gt: ['$amountXAF', '$paidXAF'] } })
    .sort({ createdAt: -1 })
    .limit(80)
    .toArray();
  const ids = Array.from(new Set(open.map((c) => String(c.studentUserId))));
  const db = await getDb();
  const learners = await db
    .collection('learners')
    .find({ lbId: { $in: ids } }, { projection: { lbId: 1, name: 1, email: 1 } })
    .toArray();
  const byId = new Map(learners.map((l) => [String(l.lbId), l]));
  return open.map((c) => {
    const l = byId.get(String(c.studentUserId));
    return {
      id: String(c._id),
      studentUserId: String(c.studentUserId),
      name: String(l?.name || 'Student'),
      email: String(l?.email || ''),
      title: String(c.title),
      amountXAF: Number(c.amountXAF || 0),
      paidXAF: Number(c.paidXAF || 0),
      outstandingXAF: Math.max(0, Number(c.amountXAF || 0) - Number(c.paidXAF || 0)),
    };
  });
}

async function ingestAdmissions() {
  const db = await getDb();
  const col = await admissionsCol();
  const [regs, reqs] = await Promise.all([
    db.collection('registrations').find({}).sort({ createdAt: -1 }).limit(80).toArray(),
    db.collection('requests').find({}).sort({ createdAt: -1 }).limit(80).toArray(),
  ]);
  for (const r of regs) {
    const email = String(r.email || '').trim().toLowerCase();
    if (!email) continue;
    const exists = await col.findOne({ source: 'registration', sourceId: String(r._id) });
    if (exists) continue;
    await col.insertOne({
      source: 'registration',
      sourceId: String(r._id),
      name: String(r.fullName || r.name || email.split('@')[0]),
      email,
      program: String(r.field || r.plan || ''),
      phone: String(r.whatsapp || r.phone || ''),
      status: 'pending',
      notes: '',
      createdAt: r.createdAt ? new Date(r.createdAt) : new Date(),
      updatedAt: new Date(),
    });
  }
  for (const r of reqs) {
    const email = String(r.email || '').trim().toLowerCase();
    if (!email) continue;
    const exists = await col.findOne({ source: 'request', sourceId: String(r._id) });
    if (exists) continue;
    await col.insertOne({
      source: 'request',
      sourceId: String(r._id),
      name: String(r.fullName || email.split('@')[0]),
      email,
      program: String(r.field || r.plan || ''),
      phone: String(r.whatsapp || ''),
      status: 'pending',
      notes: String(r.message || ''),
      createdAt: r.createdAt ? new Date(r.createdAt) : new Date(),
      updatedAt: new Date(),
    });
  }
}

export async function listAdmissions() {
  await ingestAdmissions().catch(() => {});
  const col = await admissionsCol();
  const rows = await col.find({}).sort({ createdAt: -1 }).limit(120).toArray();
  return rows.map((r) => ({
    id: String(r._id),
    name: String(r.name),
    email: String(r.email),
    program: String(r.program || ''),
    phone: String(r.phone || ''),
    status: String(r.status || 'pending'),
    notes: String(r.notes || ''),
    source: String(r.source || ''),
    createdAt: r.createdAt,
  }));
}

export async function decideAdmission(
  actor: StaffActor,
  id: string,
  decision: 'admitted' | 'rejected' | 'waitlisted',
  notes?: string,
) {
  if (!ObjectId.isValid(id)) throw new StaffAuthError('Invalid application.', 400);
  const col = await admissionsCol();
  const row = await col.findOne({ _id: new ObjectId(id) });
  if (!row) throw new StaffAuthError('Application not found.', 404);
  await col.updateOne(
    { _id: row._id },
    {
      $set: {
        status: decision,
        notes: notes !== undefined ? String(notes).slice(0, 1000) : row.notes,
        decidedBy: actor.userId,
        decidedAt: new Date(),
        updatedAt: new Date(),
      },
    },
  );
  if (decision === 'admitted' && row.email) {
    const db = await getDb();
    const learner = await db.collection('learners').findOne({
      email: { $regex: new RegExp(`^${String(row.email).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
    });
    if (learner?.lbId) {
      await ensureStudentRecord(String(learner.lbId), {
        name: String(learner.name || row.name),
        email: String(learner.email || row.email),
      });
      await (await recordsCol()).updateOne(
        { userId: String(learner.lbId) },
        { $set: { status: 'admitted', program: row.program || '', updatedAt: new Date() } },
      );
    }
  }
  await writeStaffAudit({
    actorId: actor.userId,
    actorName: actor.name,
    actorEmail: actor.email,
    action: 'admissions.decide',
    entityType: 'staff_admission',
    entityId: id,
    summary: `${actor.name} marked application ${row.email} as ${decision}`,
    before: { status: row.status },
    after: { status: decision },
  });
  return { ok: true, status: decision };
}

export async function publishAnnouncement(
  actor: StaffActor,
  opts: { title: string; body: string; audience: 'everyone' | 'students' | 'staff' },
) {
  const title = opts.title.trim().slice(0, 160);
  const body = opts.body.trim().slice(0, 4000);
  if (!title || !body) throw new StaffAuthError('Title and body are required.', 400);
  const db = await getDb();
  await db.collection('staff_announcements').insertOne({
    title,
    body,
    audience: opts.audience,
    authorId: actor.userId,
    authorName: actor.name,
    createdAt: new Date(),
  });
  if (opts.audience !== 'staff') {
    const ids = (await db.collection('learners').distinct('lbId')).map(String).slice(0, 400);
    await createNotificationsForUsers(ids, {
      title,
      body,
      href: '/dashboard/notifications',
      kind: 'system',
    }).catch(() => 0);
  }
  await writeStaffAudit({
    actorId: actor.userId,
    actorName: actor.name,
    actorEmail: actor.email,
    action: 'announcement.publish',
    entityType: 'staff_announcement',
    summary: `${actor.name} published “${title}”`,
    after: { title, audience: opts.audience },
  });
  return { ok: true };
}

export async function listAnnouncements() {
  const db = await getDb();
  const rows = await db
    .collection('staff_announcements')
    .find({})
    .sort({ createdAt: -1 })
    .limit(40)
    .toArray();
  return rows.map((r) => ({
    id: String(r._id),
    title: String(r.title),
    body: String(r.body),
    audience: String(r.audience || 'everyone'),
    authorName: String(r.authorName || ''),
    createdAt: r.createdAt,
  }));
}

export async function staffHomeStats() {
  const db = await getDb();
  const rec = await recordsCol();
  const ch = await chargesCol();
  const adm = await admissionsCol();
  const [students, pendingAdmissions, staffCount, openCharges] = await Promise.all([
    db.collection('learners').countDocuments(),
    adm.countDocuments({ status: 'pending' }),
    (await postsCol()).countDocuments({ active: true }),
    ch
      .aggregate([
        { $project: { due: { $subtract: ['$amountXAF', '$paidXAF'] } } },
        { $match: { due: { $gt: 0 } } },
        { $group: { _id: null, n: { $sum: 1 }, xaf: { $sum: '$due' } } },
      ])
      .toArray(),
  ]);
  const outstanding = openCharges[0] || { n: 0, xaf: 0 };
  const recentAudit = await (await auditCol())
    .find({})
    .sort({ createdAt: -1 })
    .limit(8)
    .toArray();
  const statusCounts = await rec
    .aggregate([{ $group: { _id: '$status', n: { $sum: 1 } } }])
    .toArray();
  return {
    students,
    pendingAdmissions,
    staffCount,
    outstandingCount: Number(outstanding.n || 0),
    outstandingXAF: Number(outstanding.xaf || 0),
    statusCounts: statusCounts.map((s) => ({ status: String(s._id || 'active'), n: Number(s.n || 0) })),
    activity: recentAudit.map((a) => ({
      id: String(a._id),
      summary: String(a.summary || a.action),
      actorName: String(a.actorName || ''),
      createdAt: a.createdAt,
    })),
  };
}

export async function directorSnapshot() {
  const home = await staffHomeStats();
  const db = await getDb();
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const newLearners = await db.collection('learners').countDocuments({
    createdAt: { $gte: weekAgo },
  });
  const mentors = await db.collection('learners').countDocuments({ roles: 'mentor' });
  const paidWeek = await (await paymentsCol())
    .aggregate([
      { $match: { createdAt: { $gte: weekAgo } } },
      { $group: { _id: null, xaf: { $sum: '$amountXAF' } } },
    ])
    .toArray();
  return {
    ...home,
    newLearners7d: newLearners,
    mentors,
    collected7dXAF: Number(paidWeek[0]?.xaf || 0),
    desks: Object.keys(DESK_PERMISSIONS),
  };
}

export async function listStaffAudit(limit = 80) {
  const col = await auditCol();
  const rows = await col
    .find({})
    .sort({ createdAt: -1 })
    .limit(Math.min(200, Math.max(1, limit)))
    .toArray();
  return rows.map((a) => ({
    id: String(a._id),
    action: String(a.action || ''),
    summary: String(a.summary || a.action || ''),
    actorName: String(a.actorName || ''),
    actorEmail: String(a.actorEmail || ''),
    entityType: String(a.entityType || ''),
    entityId: a.entityId ? String(a.entityId) : null,
    createdAt: a.createdAt,
  }));
}

export async function getOwnFinance(userId: string) {
  const rec = await ensureStudentRecord(userId);
  const chCol = await chargesCol();
  const charges = await chCol.find({ studentUserId: userId }).sort({ createdAt: -1 }).limit(50).toArray();
  const payCol = await paymentsCol();
  const payments = await payCol.find({ studentUserId: userId }).sort({ createdAt: -1 }).limit(50).toArray();
  const totalXAF = charges.reduce((sum, c) => sum + Number(c.amountXAF || 0), 0);
  const paidXAF = charges.reduce((sum, c) => sum + Number(c.paidXAF || 0), 0);
  return {
    studentCode: String(rec.studentCode || ''),
    status: String(rec.status || 'active'),
    totalXAF,
    paidXAF,
    outstandingXAF: Math.max(0, totalXAF - paidXAF),
    charges: charges.map((c) => ({
      id: String(c._id),
      title: String(c.title || 'Fee'),
      amountXAF: Number(c.amountXAF || 0),
      paidXAF: Number(c.paidXAF || 0),
      status: String(c.status || 'open'),
      createdAt: c.createdAt,
    })),
    payments: payments.map((p) => ({
      id: String(p._id),
      amountXAF: Number(p.amountXAF || 0),
      method: String(p.method || 'other'),
      receiptCode: String(p.receiptCode || ''),
      reference: String(p.reference || ''),
      createdAt: p.createdAt,
    })),
  };
}

export function answerDirectorQuestion(
  question: string,
  snap: Awaited<ReturnType<typeof directorSnapshot>>,
): string {
  const q = question.trim().toLowerCase();
  if (!q) return 'Ask about enrollment, outstanding fees, admissions, or this week’s activity.';

  const xaf = (n: number) => `${Math.round(n).toLocaleString('en-US')} XAF`;
  const active = snap.statusCounts.find((s) => s.status === 'active')?.n ?? snap.students;

  if (q.includes('outstanding') || q.includes('owe') || (q.includes('fee') && q.includes('how much'))) {
    return `Outstanding school fees: ${xaf(snap.outstandingXAF)} across ${snap.outstandingCount} open charge${snap.outstandingCount === 1 ? '' : 's'}. Collected in the last 7 days: ${xaf(snap.collected7dXAF)}.`;
  }
  if (q.includes('revenue') || q.includes('collected') || q.includes('payment')) {
    return `Fees collected in the last 7 days: ${xaf(snap.collected7dXAF)}. Outstanding balance remains ${xaf(snap.outstandingXAF)}.`;
  }
  if (q.includes('admission') || q.includes('applicant') || q.includes('application')) {
    return `Pending applications: ${snap.pendingAdmissions}. Review them in Admissions before they stall.`;
  }
  if (q.includes('mentor') || q.includes('instructor')) {
    return `Approved instructors/mentors: ${snap.mentors}. Staff posts currently active: ${snap.staffCount}.`;
  }
  if (q.includes('staff')) {
    return `Active staff posts: ${snap.staffCount}. Only platform administrators can grant or revoke staff desks.`;
  }
  if (q.includes('new') || q.includes('this week') || q.includes('trend') || q.includes('enroll')) {
    return `Enrollment: ${snap.students} learners in InTelleX. ${snap.newLearners7d} joined in the last 7 days. Active student records: ${active}.`;
  }
  if (q.includes('active') || q.includes('how many student') || q.includes('student')) {
    const byStatus = snap.statusCounts
      .map((s) => `${s.status.replace(/_/g, ' ')} ${s.n}`)
      .join(', ');
    return `There are ${snap.students} learner accounts. Student-record statuses: ${byStatus || 'none yet'}.`;
  }
  if (q.includes('today') || q.includes('summar') || q.includes('alert') || q.includes('important')) {
    const latest = snap.activity[0]?.summary || 'No recent staff activity.';
    return `Today’s picture: ${snap.students} learners, ${snap.pendingAdmissions} pending applications, ${snap.outstandingCount} outstanding fee files (${xaf(snap.outstandingXAF)}). Latest action: ${latest}`;
  }
  if (q.includes('department') || q.includes('completion') || q.includes('course')) {
    return `Course completion and department rankings need class-level analytics as more academic records are attached. Current enrollment is ${snap.students} learners, with ${snap.newLearners7d} new this week.`;
  }

  return `InTelleX currently has ${snap.students} learners, ${snap.pendingAdmissions} pending applications, ${snap.staffCount} staff, and ${xaf(snap.outstandingXAF)} in outstanding fees. Ask about students, fees, admissions, or this week’s activity.`;
}

export { DESK_PERMISSIONS };
