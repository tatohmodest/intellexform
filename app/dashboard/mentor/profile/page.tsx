import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/getUser';
import { getMentorProfile } from '@/lib/learn/ecosystem';
import MentorProfileForm from '@/components/dashboard/MentorProfileForm';

export const dynamic = 'force-dynamic';

export default async function MentorProfilePage() {
  const session = getSessionUser();
  if (!session) redirect('/login?next=/dashboard/mentor/profile');

  const profile = await getMentorProfile(session.uid);
  if (!profile) redirect('/dashboard/mentor');

  return <MentorProfileForm profile={profile} />;
}
