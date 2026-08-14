/**
 * Simple 1:1 messaging between learners and instructors/mentors.
 */

import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/repo';
import { ensureLearnCollections } from '@/lib/learn/ecosystem';
import { createNotification } from '@/lib/learn/notifications';

export type MessageThreadView = {
  id: string;
  participantIds: string[];
  participantNames: Record<string, string>;
  subject: string;
  courseContext: string | null;
  lastMessageAt: string;
  lastPreview: string;
  unreadFor: string[];
};

export type MessageView = {
  id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  body: string;
  href: string | null;
  createdAt: string;
};

async function ensureMessaging() {
  await ensureLearnCollections();
  const db = await getDb();
  const names = new Set(
    (await db.listCollections({}, { nameOnly: true }).toArray()).map((c) => c.name),
  );
  if (!names.has('message_threads')) await db.createCollection('message_threads').catch(() => {});
  if (!names.has('messages')) await db.createCollection('messages').catch(() => {});
  await Promise.all([
    db.collection('message_threads').createIndex({ participantIds: 1, lastMessageAt: -1 }),
    db.collection('messages').createIndex({ threadId: 1, createdAt: 1 }),
  ]).catch(() => {});
  return db;
}

function threadView(d: Record<string, unknown>): MessageThreadView {
  return {
    id: String((d._id as ObjectId).toString()),
    participantIds: (d.participantIds as string[]) || [],
    participantNames: (d.participantNames as Record<string, string>) || {},
    subject: String(d.subject || 'Conversation'),
    courseContext: (d.courseContext as string) || null,
    lastMessageAt: new Date(d.lastMessageAt as string | Date).toISOString(),
    lastPreview: String(d.lastPreview || ''),
    unreadFor: (d.unreadFor as string[]) || [],
  };
}

function messageView(d: Record<string, unknown>): MessageView {
  return {
    id: String((d._id as ObjectId).toString()),
    threadId: String(d.threadId),
    senderId: String(d.senderId),
    senderName: String(d.senderName || 'User'),
    body: String(d.body || ''),
    href: (d.href as string) || null,
    createdAt: new Date(d.createdAt as string | Date).toISOString(),
  };
}

export async function listThreadsForUser(userId: string): Promise<MessageThreadView[]> {
  try {
    const db = await ensureMessaging();
    const docs = await db
      .collection('message_threads')
      .find({ participantIds: userId })
      .sort({ lastMessageAt: -1 })
      .limit(100)
      .toArray();
    return docs.map((d) => threadView(d as Record<string, unknown>));
  } catch {
    return [];
  }
}

export async function getThread(threadId: string, userId: string): Promise<MessageThreadView | null> {
  try {
    const db = await ensureMessaging();
    const doc = await db.collection('message_threads').findOne({
      _id: new ObjectId(threadId),
      participantIds: userId,
    });
    return doc ? threadView(doc as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export async function listMessages(threadId: string, userId: string): Promise<MessageView[]> {
  const thread = await getThread(threadId, userId);
  if (!thread) return [];
  const db = await ensureMessaging();
  const docs = await db
    .collection('messages')
    .find({ threadId })
    .sort({ createdAt: 1 })
    .limit(500)
    .toArray();
  return docs.map((d) => messageView(d as Record<string, unknown>));
}

export async function startOrGetThread(opts: {
  fromUserId: string;
  fromName: string;
  toUserId: string;
  toName: string;
  subject?: string;
  courseContext?: string | null;
}): Promise<MessageThreadView> {
  const db = await ensureMessaging();
  const participants = [opts.fromUserId, opts.toUserId].sort();
  const existing = await db.collection('message_threads').findOne({
    participantIds: { $all: participants, $size: 2 },
    ...(opts.courseContext ? { courseContext: opts.courseContext } : {}),
  });
  if (existing) return threadView(existing as Record<string, unknown>);

  const now = new Date();
  const doc = {
    participantIds: participants,
    participantNames: {
      [opts.fromUserId]: opts.fromName,
      [opts.toUserId]: opts.toName,
    },
    subject: (opts.subject || `Chat with ${opts.toName}`).slice(0, 120),
    courseContext: opts.courseContext || null,
    lastMessageAt: now,
    lastPreview: '',
    unreadFor: [] as string[],
    createdAt: now,
  };
  const res = await db.collection('message_threads').insertOne(doc);
  return threadView({ ...doc, _id: res.insertedId });
}

export async function sendMessage(opts: {
  threadId: string;
  senderId: string;
  senderName: string;
  body: string;
  href?: string | null;
}): Promise<MessageView> {
  const db = await ensureMessaging();
  const thread = await db.collection('message_threads').findOne({
    _id: new ObjectId(opts.threadId),
    participantIds: opts.senderId,
  });
  if (!thread) throw new Error('Thread not found');

  const body = opts.body.trim().slice(0, 4000);
  if (!body) throw new Error('Message required');

  const now = new Date();
  const msg = {
    threadId: opts.threadId,
    senderId: opts.senderId,
    senderName: opts.senderName,
    body,
    href: opts.href || null,
    createdAt: now,
  };
  const res = await db.collection('messages').insertOne(msg);

  const others = ((thread.participantIds as string[]) || []).filter((id) => id !== opts.senderId);
  await db.collection('message_threads').updateOne(
    { _id: thread._id },
    {
      $set: {
        lastMessageAt: now,
        lastPreview: body.slice(0, 140),
        unreadFor: others,
      },
    },
  );

  for (const uid of others) {
    await createNotification({
      userId: uid,
      title: `Message from ${opts.senderName}`,
      body: body.slice(0, 160),
      href: `/dashboard/messages/${opts.threadId}`,
      kind: 'message',
    }).catch(() => {});
  }

  return messageView({ ...msg, _id: res.insertedId });
}

export async function markThreadRead(threadId: string, userId: string) {
  const db = await ensureMessaging();
  const threads = db.collection('message_threads');
  const existing = await threads.findOne({
    _id: new ObjectId(threadId),
    participantIds: userId,
  });
  if (!existing) return;
  const unread = Array.isArray(existing.unreadFor)
    ? (existing.unreadFor as string[]).filter((id) => id !== userId)
    : [];
  await threads.updateOne(
    { _id: new ObjectId(threadId) },
    { $set: { unreadFor: unread } },
  );
}

export async function unreadMessageCount(userId: string): Promise<number> {
  try {
    const db = await ensureMessaging();
    return db.collection('message_threads').countDocuments({
      participantIds: userId,
      unreadFor: userId,
    });
  } catch {
    return 0;
  }
}
