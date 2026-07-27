import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import {
  createInstitutionPost,
  getInstitution,
  getMembership,
} from '@/lib/learn/ecosystem';

export const dynamic = 'force-dynamic';

/** POST - owners publish an announcement to their campus news feed. */
export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const inst = await getInstitution(params.slug);
  if (!inst) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  const membership = await getMembership(params.slug, user.uid);
  if (membership !== 'owner') {
    return NextResponse.json({ error: 'owner_only' }, { status: 403 });
  }
  const body = await req.json().catch(() => ({}));
  const title = String(body.title ?? '').trim();
  const text = String(body.body ?? '').trim();
  if (!title || !text) return NextResponse.json({ error: 'missing_fields' }, { status: 400 });
  try {
    await createInstitutionPost({
      institutionSlug: params.slug,
      authorId: user.uid,
      authorName: user.name,
      title,
      body: text,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('createInstitutionPost failed:', err);
    return NextResponse.json({ error: 'db_unavailable' }, { status: 503 });
  }
}
