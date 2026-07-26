import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { enroll, getEnrollments } from '@/lib/learn/repo';
import { getCatalogTrack } from '@/lib/learn/catalog';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const enrollments = await getEnrollments(user.uid);
  return NextResponse.json({ enrollments });
}

export async function POST(req: NextRequest) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const courseSlug = String(body.courseSlug ?? '');
  if (!getCatalogTrack(courseSlug)) {
    return NextResponse.json({ error: 'unknown_course' }, { status: 400 });
  }
  try {
    await enroll(user.uid, courseSlug);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('enroll failed:', err);
    return NextResponse.json({ error: 'db_unavailable' }, { status: 503 });
  }
}
