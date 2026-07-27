import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import {
  createInstitution,
  listPublicInstitutions,
  myInstitutionSlugs,
} from '@/lib/learn/ecosystem';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const [institutions, mine] = await Promise.all([
    listPublicInstitutions(),
    myInstitutionSlugs(user.uid),
  ]);
  return NextResponse.json({ institutions, memberOf: Array.from(mine) });
}

/** POST /api/learn/institutions — open a new campus in the ecosystem. */
export async function POST(req: NextRequest) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const name = String(body.name ?? '').trim();
  if (name.length < 3) return NextResponse.json({ error: 'invalid_name' }, { status: 400 });

  try {
    const result = await createInstitution({
      name,
      tagline: String(body.tagline ?? '').trim(),
      about: String(body.about ?? '').trim(),
      color: String(body.color ?? '#00b369'),
      emoji: String(body.emoji ?? '🎓'),
      visibility: body.visibility === 'private' ? 'private' : 'public',
      ownerId: user.uid,
      ownerName: user.name,
    });
    if ('error' in result) return NextResponse.json(result, { status: 400 });
    return NextResponse.json({ ok: true, slug: result.slug });
  } catch (err) {
    console.error('createInstitution failed:', err);
    return NextResponse.json({ error: 'db_unavailable' }, { status: 503 });
  }
}
