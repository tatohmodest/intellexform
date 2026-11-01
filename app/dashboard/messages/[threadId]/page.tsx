import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/getUser';
import MessagesInbox from '@/components/dashboard/MessagesInbox';

export const dynamic = 'force-dynamic';

export default async function MessageThreadPage({
  params,
}: {
  params: { threadId: string };
}) {
  const session = getSessionUser();
  if (!session) redirect(`/login?next=/dashboard/messages/${params.threadId}`);

  return (
    <div className="mx-auto max-w-[1100px]">
      <MessagesInbox userId={session.uid} initialThreadId={params.threadId} />
    </div>
  );
}
