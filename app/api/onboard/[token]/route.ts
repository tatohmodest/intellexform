import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { completeOnboardingInvite } from '@/lib/admin/onboardingInvites';
import type { BillingCycle } from '@/lib/eduos/plans';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest, { params }: { params: { token: string } }) {
  const user = getSessionUser();
  if (!user?.email) {
    return NextResponse.json({ error: 'Sign in with the invited email to continue.' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  try {
    const result = await completeOnboardingInvite({
      token: params.token,
      sessionEmail: user.email,
      name: String(body.name || ''),
      description: body.description ? String(body.description) : undefined,
      website: body.website ? String(body.website) : undefined,
      country: body.country ? String(body.country) : undefined,
      city: body.city ? String(body.city) : undefined,
      phone: body.phone ? String(body.phone) : undefined,
      address: body.address ? String(body.address) : undefined,
      institutionType: body.institutionType ? String(body.institutionType) : undefined,
      platformName: body.platformName ? String(body.platformName) : undefined,
      primaryColor: body.primaryColor ? String(body.primaryColor) : undefined,
      secondaryColor: body.secondaryColor ? String(body.secondaryColor) : undefined,
      tagline: body.tagline ? String(body.tagline) : undefined,
      logoUrl: body.logoUrl ? String(body.logoUrl) : undefined,
      subdomain: body.subdomain ? String(body.subdomain) : undefined,
      adminFirstName: body.adminFirstName ? String(body.adminFirstName) : undefined,
      adminLastName: body.adminLastName ? String(body.adminLastName) : undefined,
      adminTitle: body.adminTitle ? String(body.adminTitle) : undefined,
      billingCycle: (body.billingCycle === 'monthly' ? 'monthly' : 'yearly') as BillingCycle,
      selectedModules: Array.isArray(body.selectedModules)
        ? body.selectedModules.map(String)
        : [],
    });
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error('onboard complete failed:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Could not complete onboarding' },
      { status: 400 },
    );
  }
}
