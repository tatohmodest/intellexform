/**
 * Class rooms — Discord-style group chat for official students.
 * Only allocated class heads can create a group and add course mates.
 */

import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/repo';
import { getLearner } from '@/lib/learn/repo';
import { isClassHead, isOfficialStudent } from '@/lib/learn/studentAccess';
import { createNotification, createNotificationsForUsers } from '@/lib/learn/notifications';

export class ClassGroupError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

export type GroupAttachment = {
  name: string;
  url: string;
  kind: 'image' | 'file';
};

export type ClassGroupView = {
  id: string;
  title: string;
  description: string;
  courseId: string | null;
  courseTitle: string | null;
  ownerId: string;
  memberCount: number;
  unread: number;
  lastMessageAt: string | null;
  lastPreview: string;
  isOwner: boolean;
};

export type ChannelView = {
  id: string;
  groupId: string;
  name: string;
  topic: string;
  kind: 'text';
  lastMessageAt: string | null;
  unread: number;
};

export type MemberView = {
  userId: string;
  name: string;
  email: string;
  isOwner: boolean;
  isYou: boolean;
};

export type CourseMateView = {
  userId: string;
  name: string;
  email: string;
  alreadyMember: boolean;
};

export type GroupMessageView = {
  id: string;
  channelId: string;
  groupId: string;
  senderId: string;
  senderName: string;
  body: string;
  attachments: GroupAttachment[];
  createdAt: string;
};

export type StudentCourseOption = {
  id: string;
  title: string;
};

async function dbReady() {
  const db = await getDb();
  await Promise.all([
    db.collection('class_groups').createIndex({ memberIds: 1, updatedAt: -1 }).catch(() => {}),
    db.collection('class_groups').createIndex({ ownerId: 1 }).catch(() => {}),
    db.collection('class_groups').createIndex({ courseId: 1 }).catch(() => {}),
    db.collection('class_group_channels').createIndex({ groupId: 1, slug: 1 }, { unique: true }).catch(() => {}),
    db.collection('class_group_messages').createIndex({ channelId: 1, createdAt: 1 }).catch(() => {}),
    db.collection('class_group_reads').createIndex({ userId: 1, channelId: 1 }, { unique: true }).catch(() => {}),
  ]);
  return db;
}

function slugify(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40) || 'channel';
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');
}

export { initials as groupInitials };

async function requireMember(userId: string, groupId: string) {
  if (!ObjectId.isValid(groupId)) throw new ClassGroupError('Group not found.', 404);
  const db = await dbReady();
  const group = await db.collection('class_groups').findOne({ _id: new ObjectId(groupId) });
  if (!group) throw new ClassGroupError('Group not found.', 404);
  const memberIds = ((group.memberIds as string[]) || []).map(String);
  if (!memberIds.includes(userId)) throw new ClassGroupError('You are not in this group.', 403);
  return { db, group, memberIds, isOwner: String(group.ownerId) === userId };
}

export async function listStudentCourses(userId: string): Promise<StudentCourseOption[]> {
  const db = await getDb();
  const [live, catalog] = await Promise.all([
    db
      .collection('course_enrollments')
      .find({ studentId: userId })
      .project({ courseId: 1, courseTitle: 1 })
      .sort({ createdAt: -1 })
      .limit(40)
      .toArray()
      .catch(() => []),
    db
      .collection('enrollments')
      .find({ userId })
      .project({ courseSlug: 1 })
      .sort({ enrolledAt: -1 })
      .limit(40)
      .toArray()
      .catch(() => []),
  ]);
  const out: StudentCourseOption[] = [];
  const seen = new Set<string>();
  for (const e of live) {
    const id = String(e.courseId || '');
    if (!id || seen.has(id)) continue;
    seen.add(id);
    out.push({ id, title: String(e.courseTitle || 'Course') });
  }
  for (const e of catalog) {
    const id = String(e.courseSlug || '');
    if (!id || seen.has(id)) continue;
    seen.add(id);
    out.push({ id, title: id.replace(/-/g, ' ') });
  }
  return out;
}

export async function listCourseMates(
  actorId: string,
  courseId: string,
  memberIds: string[] = [],
): Promise<CourseMateView[]> {
  if (!courseId) return [];
  const db = await getDb();
  const [fromLive, fromCatalog] = await Promise.all([
    db
      .collection('course_enrollments')
      .find({ courseId })
      .project({ studentId: 1, studentName: 1, studentEmail: 1 })
      .limit(200)
      .toArray()
      .catch(() => []),
    db
      .collection('enrollments')
      .find({ courseSlug: courseId })
      .project({ userId: 1 })
      .limit(200)
      .toArray()
      .catch(() => []),
  ]);
  const ids = new Set<string>();
  const names = new Map<string, string>();
  const emails = new Map<string, string>();
  for (const r of fromLive) {
    const id = String(r.studentId || '');
    if (!id) continue;
    ids.add(id);
    if (r.studentName) names.set(id, String(r.studentName));
    if (r.studentEmail) emails.set(id, String(r.studentEmail));
  }
  for (const r of fromCatalog) {
    const id = String(r.userId || '');
    if (id) ids.add(id);
  }
  ids.delete(actorId);
  const missing = [...ids].filter((id) => !names.has(id));
  if (missing.length) {
    const learners = await db
      .collection('learners')
      .find({ lbId: { $in: missing } }, { projection: { lbId: 1, name: 1, email: 1 } })
      .toArray();
    for (const l of learners) {
      names.set(String(l.lbId), String(l.name || 'Student'));
      emails.set(String(l.lbId), String(l.email || ''));
    }
  }
  const members = new Set(memberIds);
  return [...ids].map((userId) => ({
    userId,
    name: names.get(userId) || 'Student',
    email: emails.get(userId) || '',
    alreadyMember: members.has(userId),
  }));
}

async function unreadForChannel(db: Awaited<ReturnType<typeof dbReady>>, userId: string, channelId: string, lastMessageAt: Date | null) {
  if (!lastMessageAt) return 0;
  const read = await db.collection('class_group_reads').findOne({ userId, channelId });
  const lastRead = read?.lastReadAt ? new Date(read.lastReadAt as Date) : null;
  if (lastRead && lastRead >= lastMessageAt) return 0;
  const q: Record<string, unknown> = { channelId, senderId: { $ne: userId } };
  if (lastRead) q.createdAt = { $gt: lastRead };
  return db.collection('class_group_messages').countDocuments(q);
}

export async function listGroupsForUser(userId: string): Promise<{
  classHead: boolean;
  courses: StudentCourseOption[];
  groups: ClassGroupView[];
}> {
  const [classHead, courses, db] = await Promise.all([
    isClassHead(userId),
    listStudentCourses(userId),
    dbReady(),
  ]);
  const docs = await db
    .collection('class_groups')
    .find({ memberIds: userId })
    .sort({ updatedAt: -1 })
    .limit(80)
    .toArray();
  const groups: ClassGroupView[] = [];
  for (const g of docs) {
    const id = String(g._id);
    const channels = await db
      .collection('class_group_channels')
      .find({ groupId: id })
      .project({ _id: 1, lastMessageAt: 1 })
      .toArray();
    let unread = 0;
    for (const ch of channels) {
      unread += await unreadForChannel(
        db,
        userId,
        String(ch._id),
        ch.lastMessageAt ? new Date(ch.lastMessageAt as Date) : null,
      );
    }
    groups.push({
      id,
      title: String(g.title || 'Group'),
      description: String(g.description || ''),
      courseId: g.courseId ? String(g.courseId) : null,
      courseTitle: g.courseTitle ? String(g.courseTitle) : null,
      ownerId: String(g.ownerId),
      memberCount: ((g.memberIds as string[]) || []).length,
      unread,
      lastMessageAt: g.lastMessageAt ? new Date(g.lastMessageAt as Date).toISOString() : null,
      lastPreview: String(g.lastPreview || ''),
      isOwner: String(g.ownerId) === userId,
    });
  }
  return { classHead, courses, groups };
}

export async function getGroupWorkspace(userId: string, groupId: string) {
  const { db, group, memberIds, isOwner } = await requireMember(userId, groupId);
  const channels = await db
    .collection('class_group_channels')
    .find({ groupId })
    .sort({ createdAt: 1 })
    .toArray();
  const channelViews: ChannelView[] = [];
  for (const ch of channels) {
    const lastAt = ch.lastMessageAt ? new Date(ch.lastMessageAt as Date) : null;
    channelViews.push({
      id: String(ch._id),
      groupId,
      name: String(ch.name),
      topic: String(ch.topic || ''),
      kind: 'text',
      lastMessageAt: lastAt ? lastAt.toISOString() : null,
      unread: await unreadForChannel(db, userId, String(ch._id), lastAt),
    });
  }
  const learners = await db
    .collection('learners')
    .find({ lbId: { $in: memberIds } }, { projection: { lbId: 1, name: 1, email: 1 } })
    .toArray();
  const byId = new Map(learners.map((l) => [String(l.lbId), l]));
  const names = (group.memberNames as Record<string, string>) || {};
  const members: MemberView[] = memberIds.map((id) => ({
    userId: id,
    name: String(byId.get(id)?.name || names[id] || 'Student'),
    email: String(byId.get(id)?.email || ''),
    isOwner: id === String(group.ownerId),
    isYou: id === userId,
  }));
  const mates = isOwner && group.courseId
    ? await listCourseMates(userId, String(group.courseId), memberIds)
    : [];
  return {
    group: {
      id: String(group._id),
      title: String(group.title),
      description: String(group.description || ''),
      courseId: group.courseId ? String(group.courseId) : null,
      courseTitle: group.courseTitle ? String(group.courseTitle) : null,
      ownerId: String(group.ownerId),
      memberCount: memberIds.length,
      isOwner,
    },
    channels: channelViews,
    members,
    mates,
  };
}

async function insertDefaultChannels(db: Awaited<ReturnType<typeof dbReady>>, groupId: string, ownerId: string) {
  const now = new Date();
  const defaults = [
    { name: 'general', topic: 'Everyday chat — plans, questions, memes, whatever helps.' },
    { name: 'notes', topic: 'Drop PDFs, photos of the board, and study packs.' },
    { name: 'ideas', topic: 'Project ideas, exam strategies, and “what if we…”' },
  ];
  await db.collection('class_group_channels').insertMany(
    defaults.map((d) => ({
      groupId,
      name: d.name,
      slug: d.name,
      topic: d.topic,
      kind: 'text',
      createdBy: ownerId,
      lastMessageAt: null,
      createdAt: now,
    })),
  );
}

export async function createGroup(
  actor: { userId: string; name: string },
  opts: { title: string; description?: string; courseId?: string },
) {
  if (!(await isClassHead(actor.userId))) {
    throw new ClassGroupError('Only class heads can create groups.', 403);
  }
  const title = opts.title.trim().slice(0, 80);
  if (title.length < 2) throw new ClassGroupError('Give the group a name.');
  const courses = await listStudentCourses(actor.userId);
  const course = courses.find((c) => c.id === String(opts.courseId || ''));
  if (!course) throw new ClassGroupError('Pick a course you are in so you can add classmates.');

  const db = await dbReady();
  const now = new Date();
  const doc = {
    title,
    description: String(opts.description || '').trim().slice(0, 280),
    courseId: course.id,
    courseTitle: course.title,
    ownerId: actor.userId,
    memberIds: [actor.userId],
    memberNames: { [actor.userId]: actor.name },
    lastPreview: '',
    lastMessageAt: null as Date | null,
    createdAt: now,
    updatedAt: now,
  };
  const res = await db.collection('class_groups').insertOne(doc);
  const groupId = res.insertedId.toString();
  await insertDefaultChannels(db, groupId, actor.userId);
  return { id: groupId };
}

export async function createChannel(
  actor: { userId: string },
  opts: { groupId: string; name: string; topic?: string },
) {
  const { db, isOwner } = await requireMember(actor.userId, opts.groupId);
  if (!isOwner) throw new ClassGroupError('Only the class head can add channels.', 403);
  const name = slugify(opts.name).replace(/-/g, '-');
  const display = opts.name.trim().replace(/^#/, '').slice(0, 32).toLowerCase() || name;
  if (display.length < 2) throw new ClassGroupError('Channel name is too short.');
  const slug = slugify(display);
  const exists = await db.collection('class_group_channels').findOne({ groupId: opts.groupId, slug });
  if (exists) throw new ClassGroupError('That channel already exists.');
  const now = new Date();
  const res = await db.collection('class_group_channels').insertOne({
    groupId: opts.groupId,
    name: slug,
    slug,
    topic: String(opts.topic || '').trim().slice(0, 160),
    kind: 'text',
    createdBy: actor.userId,
    lastMessageAt: null,
    createdAt: now,
  });
  await db.collection('class_groups').updateOne({ _id: new ObjectId(opts.groupId) }, { $set: { updatedAt: now } });
  return { id: res.insertedId.toString(), name: slug };
}

export async function addMembers(
  actor: { userId: string; name: string },
  opts: { groupId: string; userIds: string[] },
) {
  const { db, group, memberIds, isOwner } = await requireMember(actor.userId, opts.groupId);
  if (!isOwner) throw new ClassGroupError('Only the class head can add classmates.', 403);
  const courseId = String(group.courseId || '');
  const mates = await listCourseMates(actor.userId, courseId, memberIds);
  const allowed = new Set(mates.map((m) => m.userId));
  const add = [...new Set(opts.userIds.map(String))].filter((id) => allowed.has(id) && !memberIds.includes(id));
  if (!add.length) throw new ClassGroupError('Pick classmates from this course who are not already in the group.');

  const learners = await db
    .collection('learners')
    .find({ lbId: { $in: add } }, { projection: { lbId: 1, name: 1 } })
    .toArray();
  const names = { ...((group.memberNames as Record<string, string>) || {}) };
  for (const id of add) {
    const l = learners.find((x) => String(x.lbId) === id);
    names[id] = String(l?.name || mates.find((m) => m.userId === id)?.name || 'Student');
  }
  const now = new Date();
  await db.collection('class_groups').updateOne(
    { _id: group._id },
    { $addToSet: { memberIds: { $each: add } }, $set: { memberNames: names, updatedAt: now } },
  );
  await createNotificationsForUsers(add, {
    title: `Added to ${String(group.title)}`,
    body: `${actor.name} added you to the class group. Jump in and say hi.`,
    href: `/dashboard/study-groups?group=${String(group._id)}`,
    kind: 'message',
  }).catch(() => 0);
  return { added: add.length };
}

export async function removeMember(actor: { userId: string }, opts: { groupId: string; userId: string }) {
  const { db, group, isOwner } = await requireMember(actor.userId, opts.groupId);
  const target = String(opts.userId);
  const leaving = target === actor.userId;
  if (!leaving && !isOwner) throw new ClassGroupError('Only the class head can remove people.', 403);
  if (target === String(group.ownerId)) throw new ClassGroupError('The class head stays with the group.');
  await db.collection('class_groups').updateOne(
    { _id: group._id },
    { $pull: { memberIds: target }, $set: { updatedAt: new Date() } } as Record<string, unknown>,
  );
  return { ok: true };
}

export async function deleteGroup(actor: { userId: string }, groupId: string) {
  const { db, isOwner, group } = await requireMember(actor.userId, groupId);
  if (!isOwner) throw new ClassGroupError('Only the class head can delete this group.', 403);
  const channels = await db.collection('class_group_channels').find({ groupId }).project({ _id: 1 }).toArray();
  const channelIds = channels.map((c) => String(c._id));
  await db.collection('class_group_messages').deleteMany({ groupId });
  if (channelIds.length) await db.collection('class_group_reads').deleteMany({ channelId: { $in: channelIds } });
  await db.collection('class_group_channels').deleteMany({ groupId });
  await db.collection('class_groups').deleteOne({ _id: group._id });
  return { ok: true };
}

function messageView(d: Record<string, unknown>): GroupMessageView {
  return {
    id: String((d._id as ObjectId).toString()),
    channelId: String(d.channelId),
    groupId: String(d.groupId),
    senderId: String(d.senderId),
    senderName: String(d.senderName || 'Student'),
    body: String(d.body || ''),
    attachments: Array.isArray(d.attachments) ? (d.attachments as GroupAttachment[]) : [],
    createdAt: new Date(d.createdAt as Date).toISOString(),
  };
}

export async function listChannelMessages(
  userId: string,
  channelId: string,
  after?: string,
): Promise<GroupMessageView[]> {
  if (!ObjectId.isValid(channelId)) return [];
  const db = await dbReady();
  const channel = await db.collection('class_group_channels').findOne({ _id: new ObjectId(channelId) });
  if (!channel) return [];
  await requireMember(userId, String(channel.groupId));
  const q: Record<string, unknown> = { channelId };
  if (after) {
    const t = new Date(after);
    if (!Number.isNaN(t.getTime())) q.createdAt = { $gt: t };
  }
  const docs = await db
    .collection('class_group_messages')
    .find(q)
    .sort({ createdAt: 1 })
    .limit(after ? 80 : 200)
    .toArray();
  await db.collection('class_group_reads').updateOne(
    { userId, channelId },
    { $set: { userId, channelId, lastReadAt: new Date() } },
    { upsert: true },
  );
  return docs.map((d) => messageView(d as Record<string, unknown>));
}

export async function sendGroupMessage(
  actor: { userId: string; name: string },
  opts: { channelId: string; body?: string; attachments?: GroupAttachment[] },
) {
  if (!ObjectId.isValid(opts.channelId)) throw new ClassGroupError('Channel not found.', 404);
  const db = await dbReady();
  const channel = await db.collection('class_group_channels').findOne({ _id: new ObjectId(opts.channelId) });
  if (!channel) throw new ClassGroupError('Channel not found.', 404);
  const { group, memberIds } = await requireMember(actor.userId, String(channel.groupId));
  const body = String(opts.body || '').trim().slice(0, 4000);
  const attachments = (opts.attachments || [])
    .filter((a) => a?.url && a?.name)
    .slice(0, 4)
    .map((a) => ({
      name: String(a.name).slice(0, 120),
      url: String(a.url).slice(0, 600),
      kind: a.kind === 'image' ? ('image' as const) : ('file' as const),
    }));
  if (!body && !attachments.length) throw new ClassGroupError('Write a message or attach a file.');
  const now = new Date();
  const doc = {
    channelId: opts.channelId,
    groupId: String(channel.groupId),
    senderId: actor.userId,
    senderName: actor.name,
    body,
    attachments,
    createdAt: now,
  };
  const res = await db.collection('class_group_messages').insertOne(doc);
  const preview = body || attachments.map((a) => a.name).join(', ');
  await db.collection('class_group_channels').updateOne({ _id: channel._id }, { $set: { lastMessageAt: now } });
  await db.collection('class_groups').updateOne(
    { _id: group._id },
    { $set: { lastMessageAt: now, lastPreview: preview.slice(0, 140), updatedAt: now } },
  );
  await db.collection('class_group_reads').updateOne(
    { userId: actor.userId, channelId: opts.channelId },
    { $set: { userId: actor.userId, channelId: opts.channelId, lastReadAt: now } },
    { upsert: true },
  );

  const mentioned = memberIds.filter((id) => {
    if (id === actor.userId) return false;
    const learnerName = String(((group.memberNames as Record<string, string>) || {})[id] || '');
    if (!learnerName || !body) return false;
    const handle = learnerName.split(/\s+/)[0];
    return body.toLowerCase().includes(`@${handle.toLowerCase()}`);
  });
  if (mentioned.length) {
    await createNotificationsForUsers(mentioned, {
      title: `${actor.name} mentioned you in #${channel.name}`,
      body: preview.slice(0, 160),
      href: `/dashboard/study-groups?group=${String(group._id)}&channel=${opts.channelId}`,
      kind: 'message',
    }).catch(() => 0);
  }

  return messageView({ ...doc, _id: res.insertedId });
}

export async function deleteGroupMessage(actor: { userId: string }, messageId: string) {
  if (!ObjectId.isValid(messageId)) throw new ClassGroupError('Message not found.', 404);
  const db = await dbReady();
  const msg = await db.collection('class_group_messages').findOne({ _id: new ObjectId(messageId) });
  if (!msg) throw new ClassGroupError('Message not found.', 404);
  const { isOwner } = await requireMember(actor.userId, String(msg.groupId));
  if (!isOwner && String(msg.senderId) !== actor.userId) {
    throw new ClassGroupError('You can only delete your own messages.', 403);
  }
  await db.collection('class_group_messages').deleteOne({ _id: msg._id });
  return { ok: true };
}

export async function classHeadStatus(userId: string) {
  const [head, student] = await Promise.all([isClassHead(userId), isOfficialStudent(userId)]);
  return { classHead: head, officialStudent: student };
}

export async function learnerName(userId: string) {
  const learner = await getLearner(userId);
  return learner?.name || 'Student';
}
