import { notFound } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/getUser';
import { getOnboardingInvite } from '@/lib/admin/onboardingInvites';
import OnboardForm from '@/components/onboard/OnboardForm';
import type { CommercialPlanId } from '@/lib/eduos/plans';
import type { BillingCycle } from '@/lib/eduos/plans';
import { prisma } from '@/lib/db/prisma';
import { platformCnameTarget } from '@/lib/learn/institutionDomains';
import { getSiteUrl } from '@/lib/seo/share';
import type { OnboardAccessDetails } from '@/components/onboard/OnboardSuccessPanel';

export const dynamic = 'force-dynamic';

async function buildCompletedAccess(opts: {
  slug: string;
  email: string;
  organizationName?: string | null;
  institutionId?: string | null;
}): Promise<OnboardAccessDetails> {
  let subdomain = opts.slug;
  let orgName = opts.organizationName || opts.slug;
  if (opts.institutionId) {
    try {
      const inst = await prisma.institution.findUnique({
        where: { id: opts.institutionId },
        select: { subdomain: true, slug: true, name: true },
      });
      if (inst) {
        subdomain = String(inst.subdomain || inst.slug);
        orgName = inst.name || orgName;
      }
    } catch {
      /* ignore */
    }
  }
  const cname = platformCnameTarget();
  const platformHost = `${subdomain}.${cname}`;
  const site = getSiteUrl().replace(/\/$/, '');
  return {
    slug: opts.slug,
    organizationName: orgName || undefined,
    subdomain,
    platformHost,
    platformUrl: `${site}/site/${opts.slug}`,
    shortPathUrl: `${site}/${opts.slug}`,
    subdomainUrl: `https://${platformHost}`,
    adminUrl: `${site}/dashboard/institutions/${opts.slug}/admin`,
    campusUrl: `${site}/dashboard/institutions/${opts.slug}`,
    emailTo: opts.email,
    emailSent: true,
  };
}

export default async function OnboardPage({ params }: { params: { token: string } }) {
  const invite = await getOnboardingInvite(params.token);
  if (!invite) notFound();

  const session = getSessionUser();

  let completedAccess: OnboardAccessDetails | null = null;
  if (invite.status === 'completed' && invite.provisionedSlug) {
    completedAccess = await buildCompletedAccess({
      slug: invite.provisionedSlug,
      email: invite.email,
      organizationName: invite.organizationName,
      institutionId: invite.provisionedInstitutionId,
    });
  }

  return (
    <main className="min-h-screen px-4 py-10 sm:px-6" style={{ background: 'var(--paper)' }}>
      <OnboardForm
        sessionEmail={session?.email ?? null}
        invite={{
          token: invite.token,
          email: invite.email,
          contactName: invite.contactName,
          organizationName: invite.organizationName,
          organizationType: invite.organizationType,
          plan: invite.plan as CommercialPlanId,
          allowedModules: invite.allowedModules,
          billingOptions: invite.billingOptions as BillingCycle[],
          databaseMode: invite.databaseMode,
          suggestedSubdomain: invite.suggestedSubdomain,
          status: invite.status,
          note: invite.note,
          expiresAt: new Date(invite.expiresAt).toISOString(),
          provisionedSlug: invite.provisionedSlug || null,
          completedAccess,
        }}
      />
    </main>
  );
}
