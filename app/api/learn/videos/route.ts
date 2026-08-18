import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { isAdminEmail } from '@/lib/adminAuth';
import {
  addAdminVideo,
  listVideoHall,
  removeAdminVideo,
} from '@/lib/learn/videoHall';
import type { VideoLevel } from '@/lib/learn/videos';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const videos = await listVideoHall();
  return NextResponse.json({ videos, isAdmin: isAdminEmail(session.email) });
}

export async function POST(req: NextRequest) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (!isAdminEmail(session.email)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }
  const body = await req.json().catch(() => ({}));
  const youtubeUrlOrId = String(body.youtubeUrl || body.youtubeId || '').trim();
  const title = String(body.title || '').trim();
  const levelRaw = String(body.level || 'Beginner');
  const level: VideoLevel =
    levelRaw === 'Intermediate' || levelRaw === 'Advanced' ? levelRaw : 'Beginner';
  try {
    const video = await addAdminVideo({
      youtubeUrlOrId,
      title,
      channel: typeof body.channel === 'string' ? body.channel : undefined,
      category: typeof body.category === 'string' ? body.category : undefined,
      duration: typeof body.duration === 'string' ? body.duration : undefined,
      level,
      description: typeof body.description === 'string' ? body.description : undefined,
      addedBy: session.uid,
    });
    return NextResponse.json({ video });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'save_failed';
    const status = msg === 'invalid_youtube' || msg === 'title_required' ? 400 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}

export async function DELETE(req: NextRequest) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (!isAdminEmail(session.email)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }
  const id = new URL(req.url).searchParams.get('id') || '';
  const ok = await removeAdminVideo(id);
  if (!ok) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
