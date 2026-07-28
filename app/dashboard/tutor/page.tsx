import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/getUser';
import TutorChat from '@/components/dashboard/TutorChat';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'InTelleX AI · Tutor',
  description: 'Interactive InTelleX AI tutor - quiz, plans, explanations, and debugging help.',
};

export default function TutorPage() {
  const session = getSessionUser();
  if (!session) redirect('/login?next=/dashboard/tutor');

  return (
    <Suspense>
      <TutorChat />
    </Suspense>
  );
}
