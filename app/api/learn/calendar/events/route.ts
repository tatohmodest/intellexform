import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import {
  createPersonalCalendarEvent,
  deletePersonalCalendarEvent,
  getInteractiveCalendarPayload,
  updatePersonalCalendarEvent,
} from '@/lib/learn/calendarEvents';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const payload = await getInteractiveCalendarPayload(session.uid);
  return NextResponse.json(payload);
}

export async function POST(req: NextRequest) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  try {
    const event = await createPersonalCalendarEvent({
      userId: session.uid,
      title: String(body.title || ''),
      notes: String(body.notes || ''),
      startsAt: String(body.startsAt || ''),
      endsAt: body.endsAt ? String(body.endsAt) : null,
      allDay: Boolean(body.allDay),
    });
    return NextResponse.json({ ok: true, event }, { status: 201 });
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
  const event = await updatePersonalCalendarEvent({
    userId: session.uid,
    id: String(body.id || ''),
    title: typeof body.title === 'string' ? body.title : undefined,
    notes: typeof body.notes === 'string' ? body.notes : undefined,
    startsAt: typeof body.startsAt === 'string' ? body.startsAt : undefined,
    endsAt: body.endsAt === null ? null : typeof body.endsAt === 'string' ? body.endsAt : undefined,
    allDay: typeof body.allDay === 'boolean' ? body.allDay : undefined,
  });
  if (!event) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  return NextResponse.json({ ok: true, event });
}

export async function DELETE(req: NextRequest) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const ok = await deletePersonalCalendarEvent(session.uid, id);
  if (!ok) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
