import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import {
  getTeacherCourse,
  normalizeVideoUrl,
  updateTeacherCourse,
  type CourseAudience,
  type CourseDeliveryMode,
  type CourseLevel,
  type CourseLiveSchedule,
  type TeacherCoursePatch,
  type TeacherLesson,
} from '@/lib/learn/ecosystem';
import type { ContentVisibility } from '@/lib/learn/identity';

const DELIVERY_MODES: CourseDeliveryMode[] = ['self_paced', 'live', 'hybrid'];
const LEVELS: CourseLevel[] = ['beginner', 'intermediate', 'advanced', 'all'];
const AUDIENCES: CourseAudience[] = ['allocated', 'open', 'institution'];

function stringList(raw: unknown, max: number, len: number): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((x) => String(x).trim().slice(0, len))
    .filter(Boolean)
    .slice(0, max);
}

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
    course.instructorId === session.uid ||
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
  const canEdit =
    existing.authorId === session.uid || existing.instructorId === session.uid;
  if (!canEdit) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const patch: TeacherCoursePatch = {};

  if (typeof body.title === 'string') patch.title = body.title.slice(0, 140);
  if (typeof body.subtitle === 'string') patch.subtitle = body.subtitle.slice(0, 200);
  if (typeof body.description === 'string') patch.description = body.description.slice(0, 4000);
  if (['private', 'network', 'public'].includes(body.visibility)) {
    patch.visibility = body.visibility as ContentVisibility;
  }
  if (typeof body.published === 'boolean') patch.published = body.published;
  if (typeof body.accent === 'string') patch.accent = body.accent;
  if (body.institutionSlug === null || typeof body.institutionSlug === 'string') {
    patch.institutionSlug = body.institutionSlug || null;
  }

  // Card artwork
  if (body.coverUrl === null || typeof body.coverUrl === 'string') {
    patch.coverUrl = body.coverUrl || null;
  }
  if (body.coverPublicId === null || typeof body.coverPublicId === 'string') {
    patch.coverPublicId = body.coverPublicId || null;
  }

  // Catalogue metadata
  if (typeof body.category === 'string') patch.category = body.category.slice(0, 60);
  if (typeof body.language === 'string') patch.language = body.language.slice(0, 40);
  if (LEVELS.includes(body.level)) patch.level = body.level as CourseLevel;
  if (Array.isArray(body.tags)) patch.tags = stringList(body.tags, 8, 30);

  // Delivery & commercials
  if (DELIVERY_MODES.includes(body.deliveryMode)) {
    patch.deliveryMode = body.deliveryMode as CourseDeliveryMode;
  }
  if (body.durationHours === null || typeof body.durationHours === 'number') {
    patch.durationHours =
      typeof body.durationHours === 'number' && body.durationHours > 0
        ? Math.min(Math.round(body.durationHours * 10) / 10, 999)
        : null;
  }
  if (typeof body.priceXAF === 'number' && body.priceXAF >= 0) {
    patch.priceXAF = Math.min(Math.round(body.priceXAF), 5_000_000);
  }
  if (AUDIENCES.includes(body.audience)) patch.audience = body.audience as CourseAudience;
  if (body.seats === null || typeof body.seats === 'number') {
    patch.seats =
      typeof body.seats === 'number' && body.seats > 0
        ? Math.min(Math.round(body.seats), 100_000)
        : null;
  }
  if (typeof body.certificate === 'boolean') patch.certificate = body.certificate;

  if (body.liveSchedule === null) {
    patch.liveSchedule = null;
  } else if (body.liveSchedule && typeof body.liveSchedule === 'object') {
    const s = body.liveSchedule as Record<string, unknown>;
    const schedule: CourseLiveSchedule = {
      startDate: s.startDate ? String(s.startDate).slice(0, 40) : null,
      endDate: s.endDate ? String(s.endDate).slice(0, 40) : null,
      sessionsPerWeek:
        typeof s.sessionsPerWeek === 'number' && s.sessionsPerWeek > 0
          ? Math.min(Math.round(s.sessionsPerWeek), 14)
          : null,
      sessionTime: s.sessionTime ? String(s.sessionTime).slice(0, 10) : null,
      timezone: s.timezone ? String(s.timezone).slice(0, 60) : null,
      meetingUrl: s.meetingUrl ? String(s.meetingUrl).slice(0, 500) : null,
    };
    patch.liveSchedule = schedule;
  }

  // Value proposition
  if (Array.isArray(body.outcomes)) patch.outcomes = stringList(body.outcomes, 10, 160);
  if (Array.isArray(body.requirements)) {
    patch.requirements = stringList(body.requirements, 10, 160);
  }

  // Only the campus creator can reassign the delivering instructor.
  if (existing.authorId === session.uid) {
    if (body.instructorId === null || typeof body.instructorId === 'string') {
      patch.instructorId = body.instructorId || null;
    }
    if (body.instructorName === null || typeof body.instructorName === 'string') {
      patch.instructorName = body.instructorName || null;
    }
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
          durationMinutes:
            typeof l.durationMinutes === 'number' && l.durationMinutes > 0
              ? Math.min(Math.round(l.durationMinutes), 1000)
              : null,
          preview: Boolean(l.preview),
        } satisfies TeacherLesson;
      })
      .filter(Boolean) as TeacherLesson[];
    patch.lessons = lessons;
  }

  await updateTeacherCourse(params.id, session.uid, patch);
  const course = await getTeacherCourse(params.id);
  return NextResponse.json({ course });
}
