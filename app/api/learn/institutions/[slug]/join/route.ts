import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { getInstitution, joinInstitution } from '@/lib/learn/ecosystem';

export const dynamic = 'force-dynamic';

export async function POST(_req: NextRequest, { params }: { params: { slug: string } }) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const inst = await getInstitution(params.slug);
  if (!inst) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  if (inst.visibility === 'private') {
    return NextResponse.json({ error: 'invite_only' }, { status: 403 });
  }
  try {
    await joinInstitution(params.slug, user.uid, user.name);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('joinInstitution failed:', err);
    return NextResponse.json({ error: 'db_unavailable' }, { status: 503 });
  }
}
