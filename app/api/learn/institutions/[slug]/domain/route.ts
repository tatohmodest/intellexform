import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { getMembership } from '@/lib/learn/ecosystem';
import {
  getInstitutionDomain,
  manageInstitutionDomain,
  requestInstitutionDomain,
} from '@/lib/learn/institutionDomains';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } },
) {
  const domain = await getInstitutionDomain(params.slug);
  if (!domain) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  return NextResponse.json({ domain });
}

/**
 * Campus owner requests a domain / change.
 * Platform Admin can also POST with { action, ... } to approve/set/revoke.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } },
) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const action = String(body.action || 'request');

  // Platform-style manage actions require platform admin cookie/role - also
  // allow campus owner only for "request". Admin UI uses /api/admin/platform.
  if (action === 'request') {
    const membership = await getMembership(params.slug, session.uid);
    if (membership !== 'owner') {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }
    const result = await requestInstitutionDomain({
      slug: params.slug,
      ownerId: session.uid,
      domain: String(body.domain || ''),
      subdomain: body.subdomain ?? null,
    });
    if ('error' in result) {
      const status =
        result.error === 'forbidden'
          ? 403
          : result.error === 'not_found'
            ? 404
            : 400;
      return NextResponse.json(result, { status });
    }
    return NextResponse.json(result);
  }

  return NextResponse.json(
    { error: 'Use Platform Admin to approve, set, or revoke domains.' },
    { status: 400 },
  );
}

/** Owner may cancel a pending request. */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { slug: string } },
) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const membership = await getMembership(params.slug, session.uid);
  if (membership !== 'owner') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const current = await getInstitutionDomain(params.slug);
  if (!current) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  if (!current.pendingCustomDomain) {
    return NextResponse.json({ error: 'nothing_pending' }, { status: 400 });
  }

  const result = await manageInstitutionDomain({
    slug: params.slug,
    action: 'cancel_pending',
    notes: 'Pending domain request cancelled by campus owner.',
  });
  if ('error' in result) return NextResponse.json(result, { status: 400 });
  return NextResponse.json(result);
}
