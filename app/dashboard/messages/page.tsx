import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/getUser';
import MessagesInbox from '@/components/dashboard/MessagesInbox';
import PageHeader from '@/components/dashboard/PageHeader';

export const dynamic = 'force-dynamic';

export default async function MessagesPage({
  searchParams,
}: {
  searchParams?: { compose?: string };
}) {
  const session = getSessionUser();
  if (!session) redirect('/login?next=/dashboard/messages');

  return (
    <div className="mx-auto max-w-[1100px]">
      <PageHeader art="/mentor_session.webp" tone="sky"
        title="Messages"
      />
      <MessagesInbox userId={session.uid} />
    </div>
  );
}
