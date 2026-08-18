import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { searchVideoHall } from '@/lib/learn/videoHall';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const q = new URL(req.url).searchParams.get('q') || '';
  if (!q.trim()) return NextResponse.json({ videos: [], source: 'local' });
  const result = await searchVideoHall(q);
  return NextResponse.json(result);
}
