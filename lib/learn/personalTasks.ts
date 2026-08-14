/**
 * Personal student tasks (study goals / reminders) — distinct from academic todos.
 */

import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/repo';
import { ensureLearnCollections } from '@/lib/learn/ecosystem';

export type PersonalTaskDoc = {
  _id?: ObjectId;
  userId: string;
  title: string;
  done: boolean;
  dueAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type PersonalTaskView = {
  id: string;
  title: string;
  done: boolean;
  dueAt: string | null;
  createdAt: string;
  source: 'personal';
};

function toView(d: Record<string, unknown>): PersonalTaskView {
  return {
    id: String((d._id as ObjectId).toString()),
    title: String(d.title || ''),
    done: Boolean(d.done),
    dueAt: d.dueAt ? new Date(d.dueAt as string | Date).toISOString() : null,
    createdAt: new Date(d.createdAt as string | Date).toISOString(),
    source: 'personal',
  };
}

async function col() {
  await ensureLearnCollections();
  const db = await getDb();
  await db
    .collection('personal_tasks')
    .createIndex({ userId: 1, done: 1, updatedAt: -1 })
    .catch(() => {});
  return db.collection('personal_tasks');
}

export async function listPersonalTasks(userId: string): Promise<PersonalTaskView[]> {
  try {
    const c = await col();
    const docs = await c.find({ userId }).sort({ done: 1, updatedAt: -1 }).limit(100).toArray();
    return docs.map((d) => toView(d as Record<string, unknown>));
  } catch {
    return [];
  }
}

export async function createPersonalTask(opts: {
  userId: string;
  title: string;
  dueAt?: string | null;
}): Promise<PersonalTaskView> {
  const title = opts.title.trim().slice(0, 200);
  if (title.length < 1) throw new Error('Title required');
  const now = new Date();
  const doc: PersonalTaskDoc = {
    userId: opts.userId,
    title,
    done: false,
    dueAt: opts.dueAt ? new Date(opts.dueAt) : null,
    createdAt: now,
    updatedAt: now,
  };
  const c = await col();
  const res = await c.insertOne(doc as unknown as Record<string, unknown>);
  return toView({ ...doc, _id: res.insertedId });
}

export async function updatePersonalTask(opts: {
  userId: string;
  id: string;
  done?: boolean;
  title?: string;
}): Promise<PersonalTaskView | null> {
  const c = await col();
  const patch: Record<string, unknown> = { updatedAt: new Date() };
  if (typeof opts.done === 'boolean') patch.done = opts.done;
  if (typeof opts.title === 'string' && opts.title.trim()) {
    patch.title = opts.title.trim().slice(0, 200);
  }
  await c.updateOne({ _id: new ObjectId(opts.id), userId: opts.userId }, { $set: patch });
  const doc = await c.findOne({ _id: new ObjectId(opts.id), userId: opts.userId });
  return doc ? toView(doc as Record<string, unknown>) : null;
}

export async function deletePersonalTask(userId: string, id: string) {
  const c = await col();
  await c.deleteOne({ _id: new ObjectId(id), userId });
}
