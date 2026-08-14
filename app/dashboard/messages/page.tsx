import { redirect } from 'next/navigation';
import { MessageSquare } from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import MessagesInbox from '@/components/dashboard/MessagesInbox';

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
      <header className="mb-6 border-b pb-5" style={{ borderColor: 'var(--line)' }}>
        <div className="tab mb-2 inline-flex items-center gap-1.5">
          <MessageSquare size={11} /> Messages
        </div>
        <h1 className="font-display text-[30px] leading-tight">Inbox</h1>
        <p className="mt-2 text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
          Message instructors, mentors, and students with course context.
          {searchParams?.compose
            ? ' Start a conversation from My Students or a lesson discussion.'
            : ''}
        </p>
      </header>
      <MessagesInbox userId={session.uid} />
    </div>
  );
}
