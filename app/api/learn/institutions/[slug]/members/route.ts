import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import {
  getAllMentors,
  getMembership,
  listInstitutionMembers,
} from '@/lib/learn/ecosystem';

export const dynamic = 'force-dynamic';

/**
 * GET /api/learn/institutions/[slug]/members
 * Campus owners list members so they can allocate an instructor to a course.
 * ?role=instructor narrows to members who have an approved mentor profile.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } },
) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const membership = await getMembership(params.slug, session.uid);
  if (membership !== 'owner') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const members = await listInstitutionMembers(params.slug);

  if (req.nextUrl.searchParams.get('role') === 'instructor') {
    const mentors = await getAllMentors();
    const mentorById = new Map(mentors.map((m) => [m.id, m]));
    const instructors = members
      .filter((m) => mentorById.has(m.userId))
      .map((m) => ({
        ...m,
        title: mentorById.get(m.userId)?.title ?? '',
        avatarUrl: mentorById.get(m.userId)?.avatarUrl ?? null,
      }));
    return NextResponse.json({ members: instructors });
  }

  return NextResponse.json({ members });
}
