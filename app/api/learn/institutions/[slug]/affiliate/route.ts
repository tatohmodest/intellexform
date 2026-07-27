import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import {
  getInstitution,
  joinInstitution,
  verifyInstitutionStudent,
} from '@/lib/learn/ecosystem';
import { upsertAffiliation } from '@/lib/learn/repo';
import type { Affiliation } from '@/lib/learn/identity';

export const dynamic = 'force-dynamic';

/**
 * POST /api/learn/institutions/[slug]/affiliate
 * Affinity verification: matricule/password go to the campus auth path —
 * InTelleX only stores the resulting affiliation on the global identity.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } },
) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const slug = params.slug;
  const institution = await getInstitution(slug);
  if (!institution || institution.visibility !== 'public') {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  const body = await req.json().catch(() => ({}));
  const method = institution.authMethod ?? 'open';

  try {
    if (method === 'open') {
      await joinInstitution(slug, user.uid, user.name);
      const affiliation: Affiliation = {
        institutionSlug: slug,
        institutionName: institution.name,
        role: 'member',
        status: 'verified',
        joinedAt: new Date(),
        verifiedAt: new Date(),
      };
      const learner = await upsertAffiliation(user.uid, affiliation);
      return NextResponse.json({
        ok: true,
        affiliation,
        activeContext: learner?.activeContext,
        redirectTo: `/dashboard/institutions/${slug}`,
      });
    }

    const matricule = String(body.matricule ?? body.studentId ?? '').trim();
    const password = String(body.password ?? '');
    const verified = await verifyInstitutionStudent({
      institution,
      matricule,
      password,
    });
    if (!verified.ok) {
      return NextResponse.json({ error: verified.error }, { status: 401 });
    }

    await joinInstitution(slug, user.uid, user.name);
    const affiliation: Affiliation = {
      institutionSlug: slug,
      institutionName: institution.name,
      role: 'student',
      status: 'verified',
      externalStudentId: verified.studentId,
      department: verified.department ?? null,
      faculty: verified.faculty ?? null,
      program: verified.program ?? null,
      year: verified.year ?? null,
      joinedAt: new Date(),
      verifiedAt: new Date(),
    };
    const learner = await upsertAffiliation(user.uid, affiliation);

    return NextResponse.json({
      ok: true,
      affiliation,
      activeContext: learner?.activeContext,
      redirectTo: `/dashboard/institutions/${slug}`,
    });
  } catch (err) {
    console.error('affiliate failed:', err);
    return NextResponse.json({ error: 'db_unavailable' }, { status: 503 });
  }
}
