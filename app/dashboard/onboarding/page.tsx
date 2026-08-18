import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/getUser';
import { getLearner } from '@/lib/learn/repo';
import { isOnboardingComplete } from '@/lib/learn/identity';
import { getOrgConfig } from '@/lib/org/config';
import IdentityOnboarding from '@/components/dashboard/IdentityOnboarding';

export const dynamic = 'force-dynamic';

function safeNext(raw: string | undefined | null): string | null {
  const v = String(raw || '').trim();
  if (!v.startsWith('/') || v.startsWith('//')) return null;
  return v;
}

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams?: { next?: string };
}) {
  const session = getSessionUser();
  if (!session) {
    const n = safeNext(searchParams?.next);
    redirect(
      n
        ? `/login?next=${encodeURIComponent(`/dashboard/onboarding?next=${encodeURIComponent(n)}`)}`
        : '/login?next=/dashboard/onboarding',
    );
  }

  const learner = await getLearner(session.uid);
  const after = safeNext(searchParams?.next) || '/dashboard';
  if (isOnboardingComplete(learner)) {
    redirect(after);
  }

  const firstName =
    (learner?.name || session.name || 'there').split(/\s+/)[0] || 'there';
  const org = await getOrgConfig();

  return (
    <IdentityOnboarding
      firstName={firstName}
      institutionName={org.name}
      tagline={org.tagline}
      continueTo={after}
    />
  );
}
