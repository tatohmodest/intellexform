import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { getInstitution, getMembership, updateInstitutionPolicy } from '@/lib/learn/ecosystem';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } },
) {
  const inst = await getInstitution(params.slug);
  if (!inst) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  return NextResponse.json({
    allowInstructorSales: Boolean(inst.allowInstructorSales),
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { slug: string } },
) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const membership = await getMembership(params.slug, session.uid);
  if (membership !== 'owner') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const result = await updateInstitutionPolicy(params.slug, session.uid, {
    allowInstructorSales: Boolean(body.allowInstructorSales),
  });
  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ ok: true, allowInstructorSales: Boolean(body.allowInstructorSales) });
}
