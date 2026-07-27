import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import {
  getInstitution,
  joinInstitution,
  verifyInstitutionStudent,
} from '@/lib/learn/ecosystem';
import { upsertAffiliation } from '@/lib/learn/repo';
import type { Affiliation, AffiliationRole } from '@/lib/learn/identity';

export const dynamic = 'force-dynamic';

/**
 * POST /api/learn/institutions/[slug]/affiliate
 * Credentials verified against the campus path - InTelleX stores affiliation only.
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
  const role: AffiliationRole =
    body.role === 'instructor' ? 'instructor' : method === 'open' ? 'member' : 'student';

  try {
    if (method === 'open') {
      await joinInstitution(slug, user.uid, user.name);
      const affiliation: Affiliation = {
        institutionSlug: slug,
        institutionName: institution.name,
        role,
        status: 'verified',
        profileComplete: true,
        joinedAt: new Date(),
        verifiedAt: new Date(),
      };
      const learner = await upsertAffiliation(user.uid, affiliation);
      return NextResponse.json({
        ok: true,
        affiliation,
        needsProfileComplete: false,
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
      role,
      status: 'verified',
      externalStudentId: verified.studentId,
      department: verified.department ?? null,
      faculty: verified.faculty ?? null,
      program: verified.program ?? null,
      year: verified.year ?? null,
      profileComplete: false,
      joinedAt: new Date(),
      verifiedAt: new Date(),
    };
    const learner = await upsertAffiliation(user.uid, affiliation);
    const saved = (learner?.affiliations ?? []).find((a) => a.institutionSlug === slug);
    const needsProfileComplete = !saved?.profileComplete;

    return NextResponse.json({
      ok: true,
      affiliation: saved ?? affiliation,
      needsProfileComplete,
      activeContext: learner?.activeContext,
      redirectTo: `/dashboard/institutions/${slug}`,
    });
  } catch (err) {
    console.error('affiliate failed:', err);
    return NextResponse.json({ error: 'db_unavailable' }, { status: 503 });
  }
}
