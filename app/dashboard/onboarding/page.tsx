import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/getUser';
import { getLearner } from '@/lib/learn/repo';
import { isOnboardingComplete } from '@/lib/learn/identity';
import IdentityOnboarding from '@/components/dashboard/IdentityOnboarding';

export const dynamic = 'force-dynamic';

export default async function OnboardingPage() {
  const session = getSessionUser();
  if (!session) redirect('/login?next=/dashboard/onboarding');

  const learner = await getLearner(session.uid);
  if (isOnboardingComplete(learner)) {
    redirect('/dashboard');
  }

  const firstName =
    (learner?.name || session.name || 'there').split(/\s+/)[0] || 'there';

  return <IdentityOnboarding firstName={firstName} />;
}
