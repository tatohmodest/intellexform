import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/getUser';
import { getAllCourses } from '@/lib/repo';
import { hasActiveCertSubscription } from '@/lib/learn/certSubscription';
import EmbeddedUdemyBrowser from '@/components/dashboard/EmbeddedUdemyBrowser';

export const dynamic = 'force-dynamic';

export default async function MyLearningPage() {
  const session = getSessionUser();
  if (!session) redirect('/login?next=/dashboard/my-learning');

  const [courses, isMember] = await Promise.all([
    getAllCourses(),
    hasActiveCertSubscription(session.uid),
  ]);

  return (
    <EmbeddedUdemyBrowser
      isMember={isMember}
      userEmail={session.email || session.uid}
      courses={courses}
    />
  );
}
