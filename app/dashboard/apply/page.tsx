import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/getUser';
import { isOfficialStudent } from '@/lib/learn/studentAccess';
import StudentApplicationWizard from '@/components/dashboard/StudentApplicationWizard';

export const dynamic = 'force-dynamic';

export default async function ApplyPage() {
  const session = getSessionUser();
  if (!session) redirect('/login?next=/dashboard/apply');
  if (await isOfficialStudent(session.uid)) redirect('/dashboard');
  return <StudentApplicationWizard />;
}
