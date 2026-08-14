import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import {
  getThread,
  listMessages,
  listThreadsForUser,
  markThreadRead,
  sendMessage,
  startOrGetThread,
} from '@/lib/learn/messaging';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const threadId = new URL(req.url).searchParams.get('threadId');
  if (threadId) {
    const thread = await getThread(threadId, session.uid);
    if (!thread) return NextResponse.json({ error: 'not_found' }, { status: 404 });
    const messages = await listMessages(threadId, session.uid);
    await markThreadRead(threadId, session.uid);
    return NextResponse.json({ thread, messages });
  }
  const threads = await listThreadsForUser(session.uid);
  return NextResponse.json({ threads });
}

export async function POST(req: NextRequest) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const action = String(body.action || 'send');

  try {
    if (action === 'start') {
      const thread = await startOrGetThread({
        fromUserId: session.uid,
        fromName: session.name || 'User',
        toUserId: String(body.toUserId || ''),
        toName: String(body.toName || 'User'),
        subject: body.subject ? String(body.subject) : undefined,
        courseContext: body.courseContext ? String(body.courseContext) : null,
      });
      if (body.body) {
        await sendMessage({
          threadId: thread.id,
          senderId: session.uid,
          senderName: session.name || 'User',
          body: String(body.body),
          href: body.href ? String(body.href) : null,
        });
      }
      return NextResponse.json({ ok: true, thread });
    }

    const message = await sendMessage({
      threadId: String(body.threadId || ''),
      senderId: session.uid,
      senderName: session.name || 'User',
      body: String(body.body || ''),
      href: body.href ? String(body.href) : null,
    });
    return NextResponse.json({ ok: true, message });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed' },
      { status: 400 },
    );
  }
}
