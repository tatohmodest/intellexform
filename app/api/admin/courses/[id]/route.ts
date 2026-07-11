import { NextRequest, NextResponse } from 'next/server';
import { updateCourseById, deleteCourseById } from '@/lib/repo';
import { verifySessionToken, COOKIE_NAME } from '@/lib/adminAuth';
import { normalizeCoursePayload, slugify } from '@/lib/courseForm';

export const dynamic = 'force-dynamic';

function authed(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  return Boolean(token && verifySessionToken(token));
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!authed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const patch = normalizeCoursePayload(body);
    if (!patch.name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    if (body.slug) patch.slug = slugify(String(body.slug));
    await updateCourseById(params.id, patch);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin course update error:', error);
    return NextResponse.json({ error: 'Could not update course' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!authed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    await deleteCourseById(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin course delete error:', error);
    return NextResponse.json({ error: 'Could not delete course' }, { status: 500 });
  }
}
