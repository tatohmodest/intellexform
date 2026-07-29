import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/repo';

export type BookRequestStatus = 'pending' | 'fulfilled' | 'rejected';

export type BookRequestDoc = {
  _id?: ObjectId;
  userId: string;
  userName: string;
  userEmail: string;
  title: string;
  authorHint: string;
  reason: string;
  status: BookRequestStatus;
  adminNote: string;
  createdAt: Date;
  updatedAt: Date;
};

export type BookRequestView = Omit<BookRequestDoc, '_id'> & { id: string };

function toView(d: Record<string, unknown>): BookRequestView {
  const { _id, ...rest } = d as unknown as BookRequestDoc & { _id: ObjectId };
  return { ...(rest as Omit<BookRequestDoc, '_id'>), id: _id.toString() };
}

async function ensure() {
  const db = await getDb();
  await Promise.all([
    db.collection('book_requests').createIndex({ userId: 1, createdAt: -1 }),
    db.collection('book_requests').createIndex({ status: 1, createdAt: -1 }),
  ]).catch(() => {});
}

export async function createBookRequest(opts: {
  userId: string;
  userName: string;
  userEmail: string;
  title: string;
  authorHint?: string;
  reason?: string;
}): Promise<BookRequestView> {
  await ensure();
  const db = await getDb();
  const now = new Date();
  const doc: BookRequestDoc = {
    userId: opts.userId,
    userName: opts.userName.slice(0, 120),
    userEmail: opts.userEmail.slice(0, 160),
    title: opts.title.trim().slice(0, 160),
    authorHint: (opts.authorHint || '').trim().slice(0, 120),
    reason: (opts.reason || '').trim().slice(0, 800),
    status: 'pending',
    adminNote: '',
    createdAt: now,
    updatedAt: now,
  };
  const res = await db.collection('book_requests').insertOne(doc as unknown as Record<string, unknown>);
  return toView({ ...doc, _id: res.insertedId } as unknown as Record<string, unknown>);
}

export async function listBookRequestsByUser(userId: string): Promise<BookRequestView[]> {
  try {
    await ensure();
    const db = await getDb();
    const docs = await db
      .collection('book_requests')
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(40)
      .toArray();
    return docs.map((d) => toView(d as Record<string, unknown>));
  } catch {
    return [];
  }
}

export async function listAllBookRequests(limit = 100): Promise<BookRequestView[]> {
  try {
    await ensure();
    const db = await getDb();
    const docs = await db
      .collection('book_requests')
      .find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
    return docs.map((d) => toView(d as Record<string, unknown>));
  } catch {
    return [];
  }
}

export async function updateBookRequestStatus(
  id: string,
  patch: { status: BookRequestStatus; adminNote?: string },
): Promise<boolean> {
  await ensure();
  const db = await getDb();
  let oid: ObjectId;
  try {
    oid = new ObjectId(id);
  } catch {
    return false;
  }
  const res = await db.collection('book_requests').updateOne(
    { _id: oid },
    {
      $set: {
        status: patch.status,
        adminNote: (patch.adminNote || '').slice(0, 400),
        updatedAt: new Date(),
      },
    },
  );
  return res.matchedCount > 0;
}
