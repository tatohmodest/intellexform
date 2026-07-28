import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/getUser';
import NotificationsInbox from '@/components/dashboard/NotificationsInbox';

export const dynamic = 'force-dynamic';

export default function NotificationsPage() {
  const session = getSessionUser();
  if (!session) redirect('/login?next=/dashboard/notifications');
  return <NotificationsInbox />;
}
