import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { assertOrgStaff, getOrgLmsSummary } from '@/lib/orgLms';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } },
) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const auth = await assertOrgStaff({
    slug: params.slug,
    userId: session.uid,
    email: session.email,
  });
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.error === 'forbidden' ? 403 : 404 });
  }

  const summary = await getOrgLmsSummary(params.slug);
  return NextResponse.json({ summary });
}
