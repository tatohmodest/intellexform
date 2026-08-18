import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/getUser';
import ClassRoomsClient from '@/components/dashboard/ClassRoomsClient';

export const dynamic = 'force-dynamic';

export default function StudyGroupsPage() {
  const session = getSessionUser();
  if (!session) redirect('/login?next=/dashboard/study-groups');
  return (
    <Suspense fallback={<p className="p-6 text-[14px]">Loading rooms…</p>}>
      <ClassRoomsClient userId={session.uid} />
    </Suspense>
  );
}
