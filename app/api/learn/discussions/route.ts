import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { getRoles } from '@/lib/learn/ecosystem';
import {
  addReply,
  createDiscussionPost,
  createStudyGroup,
  joinStudyGroup,
  listDiscussionPosts,
  listReplies,
  listStudyGroups,
  setPinned,
  toggleUpvote,
} from '@/lib/learn/discussions';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const url = new URL(req.url);
  const view = url.searchParams.get('view') || 'posts';

  if (view === 'groups') {
    const groups = await listStudyGroups(session.uid);
    return NextResponse.json({ groups });
  }

  if (view === 'replies') {
    const postId = url.searchParams.get('postId') || '';
    if (!postId) return NextResponse.json({ error: 'postId required' }, { status: 400 });
    const replies = await listReplies(postId);
    return NextResponse.json({ replies });
  }

  const courseKey = url.searchParams.get('courseKey') || '';
  if (!courseKey) return NextResponse.json({ error: 'courseKey required' }, { status: 400 });
  const lessonKey = url.searchParams.get('lessonKey');
  const posts = await listDiscussionPosts({
    courseKey,
    lessonKey: lessonKey || null,
    userId: session.uid,
  });
  return NextResponse.json({ posts });
}

export async function POST(req: NextRequest) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const action = String(body.action || 'post');

  if (action === 'post') {
    const courseKey = String(body.courseKey || '');
    const text = String(body.body || '').trim();
    if (!courseKey || !text) {
      return NextResponse.json({ error: 'courseKey and body required' }, { status: 400 });
    }
    const post = await createDiscussionPost({
      courseKey,
      lessonKey: body.lessonKey ? String(body.lessonKey) : null,
      groupId: body.groupId ? String(body.groupId) : null,
      title: String(body.title || 'Question'),
      body: text,
      authorId: session.uid,
      authorName: session.name || 'Learner',
    });
    return NextResponse.json({ post });
  }

  if (action === 'reply') {
    const postId = String(body.postId || '');
    const text = String(body.body || '').trim();
    if (!postId || !text) {
      return NextResponse.json({ error: 'postId and body required' }, { status: 400 });
    }
    const roles = await getRoles(session.uid).catch(() => [] as string[]);
    const isOfficial =
      Boolean(body.isOfficial) &&
      (roles.includes('mentor') || roles.includes('admin'));
    const reply = await addReply({
      postId,
      body: text,
      authorId: session.uid,
      authorName: session.name || 'Learner',
      isOfficial,
    });
    if (!reply) return NextResponse.json({ error: 'not_found' }, { status: 404 });
    return NextResponse.json({ reply });
  }

  if (action === 'upvote') {
    const postId = String(body.postId || '');
    if (!postId) return NextResponse.json({ error: 'postId required' }, { status: 400 });
    const post = await toggleUpvote(postId, session.uid);
    if (!post) return NextResponse.json({ error: 'not_found' }, { status: 404 });
    return NextResponse.json({ post });
  }

  if (action === 'pin') {
    const roles = await getRoles(session.uid).catch(() => [] as string[]);
    if (!roles.includes('mentor') && !roles.includes('admin')) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }
    const postId = String(body.postId || '');
    const ok = await setPinned(postId, body.pinned !== false, session.uid);
    if (!ok) return NextResponse.json({ error: 'not_found' }, { status: 404 });
    return NextResponse.json({ ok: true });
  }

  if (action === 'create_group') {
    const title = String(body.title || '').trim();
    if (!title) return NextResponse.json({ error: 'title required' }, { status: 400 });
    const group = await createStudyGroup({
      title,
      description: String(body.description || ''),
      courseKey: body.courseKey ? String(body.courseKey) : null,
      createdBy: session.uid,
      creatorName: session.name || 'Learner',
    });
    return NextResponse.json({ group });
  }

  if (action === 'join_group') {
    const groupId = String(body.groupId || '');
    if (!groupId) return NextResponse.json({ error: 'groupId required' }, { status: 400 });
    const group = await joinStudyGroup(groupId, session.uid, session.name || 'Learner');
    if (!group) return NextResponse.json({ error: 'not_found' }, { status: 404 });
    return NextResponse.json({ group });
  }

  return NextResponse.json({ error: 'unknown_action' }, { status: 400 });
}
