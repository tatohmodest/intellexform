/**
 * Course discussions + study groups (upvote, pin, official answers).
 */

import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/repo';
import { ensureLearnCollections } from '@/lib/learn/ecosystem';
import { createNotification } from '@/lib/learn/notifications';
import type {
  DiscussionPostView,
  DiscussionReplyView,
  StudyGroupView,
} from '@/lib/learn/discussionTypes';

export type { DiscussionPostView, DiscussionReplyView, StudyGroupView };

async function ensureDiscussions() {
  await ensureLearnCollections();
  const db = await getDb();
  const names = new Set(
    (await db.listCollections({}, { nameOnly: true }).toArray()).map((c) => c.name),
  );
  for (const name of ['discussion_posts', 'discussion_replies', 'study_groups']) {
    if (!names.has(name)) await db.createCollection(name).catch(() => {});
  }
  await Promise.all([
    db.collection('discussion_posts').createIndex({ courseKey: 1, lessonKey: 1, pinned: -1, createdAt: -1 }),
    db.collection('discussion_replies').createIndex({ postId: 1, createdAt: 1 }),
    db.collection('study_groups').createIndex({ memberIds: 1, createdAt: -1 }),
    db.collection('study_groups').createIndex({ courseKey: 1 }),
  ]).catch(() => {});
  return db;
}

function postView(d: Record<string, unknown>, userId?: string): DiscussionPostView {
  const upvotes = (d.upvotes as string[]) || [];
  return {
    id: String((d._id as ObjectId).toString()),
    courseKey: String(d.courseKey || ''),
    lessonKey: (d.lessonKey as string) || null,
    groupId: (d.groupId as string) || null,
    title: String(d.title || 'Discussion'),
    body: String(d.body || ''),
    authorId: String(d.authorId || ''),
    authorName: String(d.authorName || 'Learner'),
    upvoteCount: upvotes.length,
    upvotedByMe: userId ? upvotes.includes(userId) : false,
    pinned: Boolean(d.pinned),
    officialAnswerId: (d.officialAnswerId as string) || null,
    replyCount: Number(d.replyCount || 0),
    createdAt: new Date(d.createdAt as string | Date).toISOString(),
  };
}

function replyView(d: Record<string, unknown>): DiscussionReplyView {
  return {
    id: String((d._id as ObjectId).toString()),
    postId: String(d.postId),
    body: String(d.body || ''),
    authorId: String(d.authorId || ''),
    authorName: String(d.authorName || 'Learner'),
    isOfficial: Boolean(d.isOfficial),
    createdAt: new Date(d.createdAt as string | Date).toISOString(),
  };
}

function groupView(d: Record<string, unknown>, userId?: string): StudyGroupView {
  const memberIds = (d.memberIds as string[]) || [];
  return {
    id: String((d._id as ObjectId).toString()),
    title: String(d.title || 'Study group'),
    courseKey: (d.courseKey as string) || null,
    description: String(d.description || ''),
    memberIds,
    memberCount: memberIds.length,
    createdBy: String(d.createdBy || ''),
    createdAt: new Date(d.createdAt as string | Date).toISOString(),
    isMember: userId ? memberIds.includes(userId) : false,
  };
}

export async function listDiscussionPosts(opts: {
  courseKey: string;
  lessonKey?: string | null;
  userId?: string;
  limit?: number;
}): Promise<DiscussionPostView[]> {
  const db = await ensureDiscussions();
  const query: Record<string, unknown> = { courseKey: opts.courseKey };
  if (opts.lessonKey) query.lessonKey = opts.lessonKey;
  const docs = await db
    .collection('discussion_posts')
    .find(query)
    .sort({ pinned: -1, upvoteCount: -1, createdAt: -1 })
    .limit(opts.limit || 40)
    .toArray();
  return docs.map((d) => postView(d as Record<string, unknown>, opts.userId));
}

export async function createDiscussionPost(opts: {
  courseKey: string;
  lessonKey?: string | null;
  groupId?: string | null;
  title: string;
  body: string;
  authorId: string;
  authorName: string;
}): Promise<DiscussionPostView> {
  const db = await ensureDiscussions();
  const doc = {
    courseKey: opts.courseKey.slice(0, 200),
    lessonKey: opts.lessonKey || null,
    groupId: opts.groupId || null,
    title: opts.title.trim().slice(0, 160) || 'Discussion',
    body: opts.body.trim().slice(0, 4000),
    authorId: opts.authorId,
    authorName: opts.authorName.slice(0, 80),
    upvotes: [] as string[],
    upvoteCount: 0,
    pinned: false,
    officialAnswerId: null as string | null,
    replyCount: 0,
    createdAt: new Date(),
  };
  const res = await db.collection('discussion_posts').insertOne(doc);
  return postView({ ...doc, _id: res.insertedId }, opts.authorId);
}

export async function listReplies(postId: string): Promise<DiscussionReplyView[]> {
  const db = await ensureDiscussions();
  const docs = await db
    .collection('discussion_replies')
    .find({ postId })
    .sort({ isOfficial: -1, createdAt: 1 })
    .limit(100)
    .toArray();
  return docs.map((d) => replyView(d as Record<string, unknown>));
}

export async function addReply(opts: {
  postId: string;
  body: string;
  authorId: string;
  authorName: string;
  isOfficial?: boolean;
}): Promise<DiscussionReplyView | null> {
  const db = await ensureDiscussions();
  let oid: ObjectId;
  try {
    oid = new ObjectId(opts.postId);
  } catch {
    return null;
  }
  const post = await db.collection('discussion_posts').findOne({ _id: oid });
  if (!post) return null;

  const doc = {
    postId: opts.postId,
    body: opts.body.trim().slice(0, 4000),
    authorId: opts.authorId,
    authorName: opts.authorName.slice(0, 80),
    isOfficial: Boolean(opts.isOfficial),
    createdAt: new Date(),
  };
  const res = await db.collection('discussion_replies').insertOne(doc);
  const replyId = res.insertedId.toString();

  const $set: Record<string, unknown> = {};
  if (opts.isOfficial) $set.officialAnswerId = replyId;
  await db.collection('discussion_posts').updateOne(
    { _id: oid },
    {
      $inc: { replyCount: 1 },
      ...(Object.keys($set).length ? { $set } : {}),
    },
  );

  if (post.authorId && post.authorId !== opts.authorId) {
    await createNotification({
      userId: String(post.authorId),
      title: opts.isOfficial ? 'Official answer on your question' : 'New reply to your discussion',
      body: `${opts.authorName}: ${opts.body.slice(0, 120)}`,
      href: `/dashboard/discussions?post=${opts.postId}`,
      kind: 'note',
      category: 'social',
    }).catch(() => {});
  }

  return replyView({ ...doc, _id: res.insertedId });
}

export async function toggleUpvote(postId: string, userId: string): Promise<DiscussionPostView | null> {
  const db = await ensureDiscussions();
  let oid: ObjectId;
  try {
    oid = new ObjectId(postId);
  } catch {
    return null;
  }
  const post = await db.collection('discussion_posts').findOne({ _id: oid });
  if (!post) return null;
  const upvotes = Array.isArray(post.upvotes) ? ([...post.upvotes] as string[]) : [];
  const idx = upvotes.indexOf(userId);
  if (idx >= 0) upvotes.splice(idx, 1);
  else upvotes.push(userId);
  await db.collection('discussion_posts').updateOne(
    { _id: oid },
    { $set: { upvotes, upvoteCount: upvotes.length } },
  );
  return postView({ ...post, upvotes, upvoteCount: upvotes.length }, userId);
}

export async function setPinned(postId: string, pinned: boolean, actorId: string): Promise<boolean> {
  const db = await ensureDiscussions();
  let oid: ObjectId;
  try {
    oid = new ObjectId(postId);
  } catch {
    return false;
  }
  const res = await db.collection('discussion_posts').updateOne(
    { _id: oid },
    { $set: { pinned, pinnedBy: actorId, pinnedAt: new Date() } },
  );
  return res.matchedCount > 0;
}

export async function listStudyGroups(userId: string): Promise<StudyGroupView[]> {
  const db = await ensureDiscussions();
  const docs = await db
    .collection('study_groups')
    .find({ $or: [{ memberIds: userId }, { createdBy: userId }] })
    .sort({ createdAt: -1 })
    .limit(40)
    .toArray();
  // Also surface open groups (not full) — keep simple: member or creator first
  const open = await db
    .collection('study_groups')
    .find({})
    .sort({ createdAt: -1 })
    .limit(20)
    .toArray();
  const map = new Map<string, StudyGroupView>();
  for (const d of [...docs, ...open]) {
    const v = groupView(d as Record<string, unknown>, userId);
    map.set(v.id, v);
  }
  return Array.from(map.values()).slice(0, 40);
}

export async function createStudyGroup(opts: {
  title: string;
  description?: string;
  courseKey?: string | null;
  createdBy: string;
  creatorName: string;
}): Promise<StudyGroupView> {
  const db = await ensureDiscussions();
  const doc = {
    title: opts.title.trim().slice(0, 120) || 'Study group',
    description: (opts.description || '').trim().slice(0, 500),
    courseKey: opts.courseKey || null,
    memberIds: [opts.createdBy],
    memberNames: { [opts.createdBy]: opts.creatorName },
    createdBy: opts.createdBy,
    createdAt: new Date(),
  };
  const res = await db.collection('study_groups').insertOne(doc);
  return groupView({ ...doc, _id: res.insertedId }, opts.createdBy);
}

export async function joinStudyGroup(groupId: string, userId: string, userName: string): Promise<StudyGroupView | null> {
  const db = await ensureDiscussions();
  let oid: ObjectId;
  try {
    oid = new ObjectId(groupId);
  } catch {
    return null;
  }
  await db.collection('study_groups').updateOne(
    { _id: oid },
    {
      $addToSet: { memberIds: userId },
      $set: { [`memberNames.${userId}`]: userName.slice(0, 80) },
    },
  );
  const doc = await db.collection('study_groups').findOne({ _id: oid });
  return doc ? groupView(doc as Record<string, unknown>, userId) : null;
}
