import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import {
  ClassGroupError,
  addMembers,
  createChannel,
  createGroup,
  deleteGroup,
  deleteGroupMessage,
  getGroupWorkspace,
  listChannelMessages,
  listGroupsForUser,
  removeMember,
  sendGroupMessage,
  setGroupBanned,
  updateGroupSettings,
} from '@/lib/learn/classGroups';

export const dynamic = 'force-dynamic';

function fail(err: unknown) {
  if (err instanceof ClassGroupError) {
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
  console.error('class groups:', err);
  return NextResponse.json({ error: 'Could not complete that.' }, { status: 500 });
}

export async function GET(req: NextRequest) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  try {
    const url = new URL(req.url);
    const groupId = url.searchParams.get('groupId');
    const channelId = url.searchParams.get('channelId');
    if (channelId) {
      const messages = await listChannelMessages(
        session.uid,
        channelId,
        url.searchParams.get('after') || undefined,
      );
      return NextResponse.json({ messages });
    }
    if (groupId) {
      const workspace = await getGroupWorkspace(session.uid, groupId);
      return NextResponse.json(workspace);
    }
    const data = await listGroupsForUser(session.uid);
    return NextResponse.json(data);
  } catch (err) {
    return fail(err);
  }
}

export async function POST(req: NextRequest) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const action = String(body.action || '');
  const actor = { userId: session.uid, name: session.name || 'Student' };

  try {
    if (action === 'create_group') {
      const created = await createGroup(actor, {
        title: String(body.title || ''),
        description: body.description,
        courseId: body.courseId,
        rules: body.rules,
        membersCanInvite: Boolean(body.membersCanInvite),
        membersCanPost: body.membersCanPost !== false,
      });
      return NextResponse.json({ ok: true, ...created });
    }
    if (action === 'create_channel') {
      const created = await createChannel(actor, {
        groupId: String(body.groupId || ''),
        name: String(body.name || ''),
        topic: body.topic,
      });
      return NextResponse.json({ ok: true, ...created });
    }
    if (action === 'add_members') {
      const result = await addMembers(actor, {
        groupId: String(body.groupId || ''),
        userIds: Array.isArray(body.userIds) ? body.userIds.map(String) : [],
      });
      return NextResponse.json({ ok: true, ...result });
    }
    if (action === 'remove_member') {
      const result = await removeMember(actor, {
        groupId: String(body.groupId || ''),
        userId: String(body.userId || ''),
      });
      return NextResponse.json(result);
    }
    if (action === 'delete_group') {
      const result = await deleteGroup(actor, String(body.groupId || ''));
      return NextResponse.json(result);
    }
    if (action === 'update_group') {
      const result = await updateGroupSettings(actor, {
        groupId: String(body.groupId || ''),
        rules: typeof body.rules === 'string' ? body.rules : undefined,
        membersCanInvite: typeof body.membersCanInvite === 'boolean' ? body.membersCanInvite : undefined,
        membersCanPost: typeof body.membersCanPost === 'boolean' ? body.membersCanPost : undefined,
        description: typeof body.description === 'string' ? body.description : undefined,
      });
      return NextResponse.json(result);
    }
    if (action === 'ban_group' || action === 'unban_group') {
      const result = await setGroupBanned(actor, String(body.groupId || ''), action === 'ban_group');
      return NextResponse.json(result);
    }
    if (action === 'send') {
      const message = await sendGroupMessage(actor, {
        channelId: String(body.channelId || ''),
        body: body.body,
        attachments: Array.isArray(body.attachments) ? body.attachments : [],
      });
      return NextResponse.json({ ok: true, message });
    }
    if (action === 'delete_message') {
      const result = await deleteGroupMessage(actor, String(body.messageId || ''));
      return NextResponse.json(result);
    }
    return NextResponse.json({ error: 'Unknown action.' }, { status: 400 });
  } catch (err) {
    return fail(err);
  }
}
