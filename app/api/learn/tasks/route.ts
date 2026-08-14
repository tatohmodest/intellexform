import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import {
  createPersonalTask,
  deletePersonalTask,
  listPersonalTasks,
  updatePersonalTask,
} from '@/lib/learn/personalTasks';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const tasks = await listPersonalTasks(session.uid);
  return NextResponse.json({ tasks });
}

export async function POST(req: NextRequest) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  try {
    const task = await createPersonalTask({
      userId: session.uid,
      title: String(body.title || ''),
      dueAt: body.dueAt ? String(body.dueAt) : null,
    });
    return NextResponse.json({ ok: true, task });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed' },
      { status: 400 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const task = await updatePersonalTask({
    userId: session.uid,
    id: String(body.id || ''),
    done: typeof body.done === 'boolean' ? body.done : undefined,
    title: typeof body.title === 'string' ? body.title : undefined,
  });
  if (!task) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  return NextResponse.json({ ok: true, task });
}

export async function DELETE(req: NextRequest) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  await deletePersonalTask(session.uid, id);
  return NextResponse.json({ ok: true });
}
