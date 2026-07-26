import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/getUser';
import TutorChat from '@/components/dashboard/TutorChat';

export const dynamic = 'force-dynamic';

export default function TutorPage() {
  const session = getSessionUser();
  if (!session) redirect('/login?next=/dashboard/tutor');

  return (
    <Suspense>
      <TutorChat />
    </Suspense>
  );
}
