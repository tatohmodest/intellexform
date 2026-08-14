import { notFound } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/getUser';
import { getOnboardingInvite } from '@/lib/admin/onboardingInvites';
import OnboardForm from '@/components/onboard/OnboardForm';
import type { CommercialPlanId } from '@/lib/eduos/plans';
import type { BillingCycle } from '@/lib/eduos/plans';

export const dynamic = 'force-dynamic';

export default async function OnboardPage({ params }: { params: { token: string } }) {
  const invite = await getOnboardingInvite(params.token);
  if (!invite) notFound();

  const session = getSessionUser();

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
        }}
      />
    </main>
  );
}
