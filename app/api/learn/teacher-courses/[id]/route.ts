import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import {
  getTeacherCourse,
  normalizeVideoUrl,
  updateTeacherCourse,
  type TeacherLesson,
} from '@/lib/learn/ecosystem';
import type { ContentVisibility } from '@/lib/learn/identity';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const course = await getTeacherCourse(params.id);
  if (!course) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  const canView =
    course.authorId === session.uid ||
    (course.published &&
      (course.visibility === 'public' ||
        course.visibility === 'network' ||
        course.visibility === 'private'));
  if (!canView) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  return NextResponse.json({ course });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const existing = await getTeacherCourse(params.id);
  if (!existing) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  if (existing.authorId !== session.uid) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const patch: Record<string, unknown> = {};

  if (typeof body.title === 'string') patch.title = body.title.slice(0, 140);
  if (typeof body.description === 'string') patch.description = body.description.slice(0, 4000);
  if (['private', 'network', 'public'].includes(body.visibility)) {
    patch.visibility = body.visibility as ContentVisibility;
  }
  if (typeof body.published === 'boolean') patch.published = body.published;
  if (typeof body.accent === 'string') patch.accent = body.accent;
  if (body.institutionSlug === null || typeof body.institutionSlug === 'string') {
    patch.institutionSlug = body.institutionSlug || null;
  }

  if (Array.isArray(body.lessons)) {
    const lessons: TeacherLesson[] = body.lessons
      .map((l: Record<string, unknown>, i: number) => {
        const raw = String(l.videoUrl || '').trim();
        if (!raw) return null;
        const norm = normalizeVideoUrl(raw);
        return {
          id: String(l.id || `lesson_${i}_${Date.now()}`),
          title: String(l.title || `Lesson ${i + 1}`).slice(0, 120),
          videoUrl: norm.videoUrl,
          videoProvider: norm.videoProvider,
          notes: String(l.notes || '').slice(0, 2000),
        } satisfies TeacherLesson;
      })
      .filter(Boolean) as TeacherLesson[];
    patch.lessons = lessons;
  }

  await updateTeacherCourse(params.id, session.uid, patch);
  const course = await getTeacherCourse(params.id);
  return NextResponse.json({ course });
}
