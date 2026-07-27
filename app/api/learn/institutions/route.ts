import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import {
  listPublicInstitutions,
  myInstitutionSlugs,
  submitInstitutionApplication,
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

/**
 * POST /api/learn/institutions — submit an institution *application*.
 * Campuses are never created here; Platform Owner/Admin must approve & provision.
 */
export async function POST(req: NextRequest) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const name = String(body.name ?? '').trim();
  if (name.length < 3) return NextResponse.json({ error: 'invalid_name' }, { status: 400 });

  try {
    const result = await submitInstitutionApplication({
      name,
      tagline: String(body.tagline ?? '').trim(),
      about: String(body.about ?? '').trim(),
      color: String(body.color ?? '#00b369'),
      visibility: body.visibility === 'private' ? 'private' : 'public',
      applicantId: user.uid,
      applicantName: user.name,
      applicantEmail: user.email,
      website: String(body.website ?? '').trim() || undefined,
      country: String(body.country ?? '').trim() || undefined,
      institutionType: String(body.institutionType ?? 'OTHER'),
      estimatedStudents: body.estimatedStudents ? Number(body.estimatedStudents) : undefined,
      requestedDeployment: String(body.requestedDeployment ?? 'MANAGED_CLOUD'),
    });
    if ('error' in result) return NextResponse.json(result, { status: 400 });
    return NextResponse.json({
      ok: true,
      pending: true,
      applicationId: result.applicationId,
      status: result.status,
      message:
        'Application submitted. An InTelleX Platform Administrator will review and provision your institution if approved.',
    });
  } catch (err) {
    console.error('submitInstitutionApplication failed:', err);
    return NextResponse.json({ error: 'db_unavailable' }, { status: 503 });
  }
}
