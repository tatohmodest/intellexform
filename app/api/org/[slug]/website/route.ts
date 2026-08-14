import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { assertOrgStaff } from '@/lib/orgLms';
import { getOrgWebsite, updateOrgWebsite, type OrgWebsiteConfig } from '@/lib/orgLms/website';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } },
) {
  const site = await getOrgWebsite(params.slug);
  if (!site) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  const session = getSessionUser();
  let canEdit = false;
  if (session) {
    const auth = await assertOrgStaff({
      slug: params.slug,
      userId: session.uid,
      email: session.email,
    });
    canEdit = !('error' in auth);
  }

  // Guests only see published sites (staff always can preview).
  if (!site.config.published && !canEdit) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  return NextResponse.json({
    config: site.config,
    branding: {
      primaryColor: site.institution.primaryColor,
      secondaryColor: site.institution.secondaryColor,
      logoUrl: site.institution.logoUrl,
      coverUrl: site.institution.coverUrl,
      name: site.institution.name,
    },
    canEdit,
  });
}

export async function PATCH(
  req: NextRequest,
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
    return NextResponse.json(
      { error: auth.error },
      { status: auth.error === 'forbidden' ? 403 : 404 },
    );
  }

  // Only owners/admins may edit the public website (not instructors).
  if (!['INSTITUTION_OWNER', 'ORG_ADMIN'].includes(auth.role)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  try {
    const updated = await updateOrgWebsite(auth.institutionId, {
      platformName: body.platformName,
      tagline: body.tagline,
      about: body.about,
      ctaLabel: body.ctaLabel,
      ctaHref: body.ctaHref,
      showCourses: body.showCourses,
      showCapabilities: body.showCapabilities,
      heroStyle: body.heroStyle,
      navLinks: body.navLinks as OrgWebsiteConfig['navLinks'] | undefined,
      footerNote: body.footerNote,
      published: body.published,
      primaryColor: body.primaryColor,
      secondaryColor: body.secondaryColor,
      logoUrl: body.logoUrl,
      coverUrl: body.coverUrl,
    });
    const site = await getOrgWebsite(params.slug);
    return NextResponse.json({
      ok: true,
      config: site?.config,
      branding: {
        primaryColor: updated.primaryColor,
        secondaryColor: updated.secondaryColor,
        logoUrl: updated.logoUrl,
        coverUrl: updated.coverUrl,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed' },
      { status: 400 },
    );
  }
}
