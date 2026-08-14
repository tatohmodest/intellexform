import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/getUser';
import StudyGroupsClient from '@/components/dashboard/StudyGroupsClient';

export const dynamic = 'force-dynamic';

export default function StudyGroupsPage() {
  const session = getSessionUser();
  if (!session) redirect('/login?next=/dashboard/study-groups');
  return <StudyGroupsClient />;
}
