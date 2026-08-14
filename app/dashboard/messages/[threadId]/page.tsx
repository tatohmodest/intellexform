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
      <h1 className="mb-4 font-display text-[28px]">Conversation</h1>
      <MessagesInbox userId={session.uid} initialThreadId={params.threadId} />
    </div>
  );
}
