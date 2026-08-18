import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/repo';
import { getLearner } from '@/lib/learn/repo';
import { getOrgConfig } from '@/lib/org/config';
import { activateStudentMembership } from '@/lib/learn/studentAccess';
import { createNotification } from '@/lib/learn/notifications';

export const APPLICATION_STATUSES = [
  'draft',
  'submitted',
  'under_review',
  'documents_required',
  'accepted',
  'rejected',
  'waitlisted',
  'withdrawn',
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export type StudentApplication = {
  id: string;
  applicationCode: string;
  userId: string;
  status: ApplicationStatus;
  personal: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    nationality: string;
  };
  contact: {
    email: string;
    phone: string;
    city: string;
    address: string;
  };
  programId: string;
  programName: string;
  academic: {
    lastSchool: string;
    qualification: string;
    yearCompleted: string;
  };
  emergency: {
    name: string;
    phone: string;
    relationship: string;
  };
  documents: Array<{ kind: string; url: string; name: string }>;
  paid: boolean;
  feeXAF: number;
  submittedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

const EMPTY_PERSONAL = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  gender: '',
  nationality: '',
};

const EMPTY_CONTACT = { email: '', phone: '', city: '', address: '' };
const EMPTY_ACADEMIC = { lastSchool: '', qualification: '', yearCompleted: '' };
const EMPTY_EMERGENCY = { name: '', phone: '', relationship: '' };

async function col() {
  const db = await getDb();
  await Promise.all([
    db.collection('student_applications').createIndex({ userId: 1, createdAt: -1 }).catch(() => {}),
    db.collection('student_applications').createIndex({ applicationCode: 1 }, { unique: true }).catch(() => {}),
  ]);
  return db.collection('student_applications');
}

function newApplicationCode() {
  const year = new Date().getFullYear();
  const n = Math.floor(10000 + Math.random() * 90000);
  return `APP-${year}-${n}`;
}

function toView(d: Record<string, unknown>): StudentApplication {
  const personal = (d.personal as StudentApplication['personal']) || EMPTY_PERSONAL;
  const contact = (d.contact as StudentApplication['contact']) || EMPTY_CONTACT;
  const academic = (d.academic as StudentApplication['academic']) || EMPTY_ACADEMIC;
  const emergency = (d.emergency as StudentApplication['emergency']) || EMPTY_EMERGENCY;
  return {
    id: String(d._id),
    applicationCode: String(d.applicationCode || ''),
    userId: String(d.userId),
    status: (APPLICATION_STATUSES.includes(d.status as ApplicationStatus)
      ? d.status
      : 'draft') as ApplicationStatus,
    personal: { ...EMPTY_PERSONAL, ...personal },
    contact: { ...EMPTY_CONTACT, ...contact },
    programId: String(d.programId || ''),
    programName: String(d.programName || ''),
    academic: { ...EMPTY_ACADEMIC, ...academic },
    emergency: { ...EMPTY_EMERGENCY, ...emergency },
    documents: Array.isArray(d.documents)
      ? (d.documents as StudentApplication['documents'])
      : [],
    paid: Boolean(d.paid),
    feeXAF: Number(d.feeXAF || 0),
    submittedAt: d.submittedAt ? new Date(d.submittedAt as Date).toISOString() : null,
    createdAt: new Date(d.createdAt as Date).toISOString(),
    updatedAt: new Date(d.updatedAt as Date).toISOString(),
  };
}

export async function getMyApplication(userId: string): Promise<StudentApplication | null> {
  const c = await col();
  const row = await c.find({ userId }).sort({ createdAt: -1 }).limit(1).next();
  return row ? toView(row as Record<string, unknown>) : null;
}

export async function saveApplicationDraft(
  userId: string,
  patch: Partial<
    Pick<
      StudentApplication,
      'personal' | 'contact' | 'programId' | 'programName' | 'academic' | 'emergency' | 'documents'
    >
  >,
): Promise<StudentApplication> {
  const c = await col();
  const existing = await c.findOne({
    userId,
    status: { $in: ['draft', 'documents_required'] },
  });
  const org = await getOrgConfig();
  const learner = await getLearner(userId);
  const now = new Date();
  const nameParts = String(learner?.name || '').split(/\s+/);
  const base = {
    personal: {
      ...EMPTY_PERSONAL,
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' '),
      ...(existing?.personal as object),
      ...patch.personal,
    },
    contact: {
      ...EMPTY_CONTACT,
      email: learner?.email || '',
      ...(existing?.contact as object),
      ...patch.contact,
    },
    programId: patch.programId ?? existing?.programId ?? '',
    programName: patch.programName ?? existing?.programName ?? '',
    academic: { ...EMPTY_ACADEMIC, ...(existing?.academic as object), ...patch.academic },
    emergency: { ...EMPTY_EMERGENCY, ...(existing?.emergency as object), ...patch.emergency },
    documents: patch.documents ?? existing?.documents ?? [],
    feeXAF: org.registration.feeXAF,
    updatedAt: now,
  };

  if (existing) {
    await c.updateOne({ _id: existing._id }, { $set: base });
    const row = await c.findOne({ _id: existing._id });
    return toView(row as Record<string, unknown>);
  }

  let applicationCode = newApplicationCode();
  while (await c.findOne({ applicationCode })) applicationCode = newApplicationCode();
  const inserted = await c.insertOne({
    ...base,
    userId,
    applicationCode,
    status: 'draft',
    paid: false,
    createdAt: now,
  });
  const row = await c.findOne({ _id: inserted.insertedId });
  return toView(row as Record<string, unknown>);
}

export async function submitApplication(userId: string): Promise<StudentApplication> {
  const draft = await saveApplicationDraft(userId, {});
  if (!draft.programName) {
    throw Object.assign(new Error('Choose a program before submitting.'), { status: 400 });
  }
  if (!draft.personal.firstName || !draft.contact.phone) {
    throw Object.assign(new Error('Add your name and phone number before submitting.'), { status: 400 });
  }

  const c = await col();
  const now = new Date();
  await c.updateOne(
    { _id: new ObjectId(draft.id) },
    {
      $set: {
        status: 'submitted',
        submittedAt: now,
        updatedAt: now,
      },
    },
  );

  const db = await getDb();
  const admissions = db.collection('staff_admissions');
  const existing = await admissions.findOne({ source: 'in_app', sourceId: draft.id });
  const payload = {
    source: 'in_app',
    sourceId: draft.id,
    userId,
    applicationCode: draft.applicationCode,
    name: `${draft.personal.firstName} ${draft.personal.lastName}`.trim(),
    email: draft.contact.email || '',
    program: draft.programName,
    phone: draft.contact.phone,
    status: 'pending',
    notes: [
      draft.academic.lastSchool && `School: ${draft.academic.lastSchool}`,
      draft.academic.qualification && `Qualification: ${draft.academic.qualification}`,
      draft.emergency.name && `Emergency: ${draft.emergency.name} (${draft.emergency.phone})`,
    ]
      .filter(Boolean)
      .join('\n'),
    updatedAt: now,
  };
  if (existing) {
    await admissions.updateOne({ _id: existing._id }, { $set: payload });
  } else {
    await admissions.insertOne({ ...payload, createdAt: now });
  }

  const org = await getOrgConfig();
  await createNotification({
    userId,
    title: 'Application submitted',
    body: `Your ${org.name} student application (${draft.applicationCode}) is in review.`,
    href: '/dashboard/application',
    kind: 'institution',
  }).catch(() => null);

  const row = await c.findOne({ _id: new ObjectId(draft.id) });
  return toView(row as Record<string, unknown>);
}

export async function withdrawApplication(userId: string): Promise<StudentApplication | null> {
  const mine = await getMyApplication(userId);
  if (!mine || mine.status === 'accepted') return mine;
  const c = await col();
  await c.updateOne(
    { _id: new ObjectId(mine.id) },
    { $set: { status: 'withdrawn', updatedAt: new Date() } },
  );
  const db = await getDb();
  await db.collection('staff_admissions').updateOne(
    { source: 'in_app', sourceId: mine.id },
    { $set: { status: 'withdrawn', updatedAt: new Date() } },
  );
  return getMyApplication(userId);
}

export async function syncApplicationDecision(opts: {
  sourceId?: string | null;
  email?: string | null;
  userId?: string | null;
  decision: 'admitted' | 'rejected' | 'waitlisted';
  program?: string | null;
}) {
  const c = await col();
  const query: Record<string, unknown> = {};
  if (opts.sourceId && ObjectId.isValid(opts.sourceId)) query._id = new ObjectId(opts.sourceId);
  else if (opts.userId) query.userId = opts.userId;
  else if (opts.email) query['contact.email'] = String(opts.email).toLowerCase();
  else return;

  const row = await c.findOne(query);
  if (!row) return;
  const status: ApplicationStatus =
    opts.decision === 'admitted'
      ? 'accepted'
      : opts.decision === 'waitlisted'
        ? 'waitlisted'
        : 'rejected';
  await c.updateOne({ _id: row._id }, { $set: { status, updatedAt: new Date() } });

  if (opts.decision === 'admitted' && row.userId) {
    await activateStudentMembership({
      userId: String(row.userId),
      program: opts.program || String(row.programName || ''),
      email: String((row.contact as { email?: string })?.email || ''),
      name: `${(row.personal as { firstName?: string })?.firstName || ''} ${(row.personal as { lastName?: string })?.lastName || ''}`.trim(),
      status: 'active',
    });
  }
}
