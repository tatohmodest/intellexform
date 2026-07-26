import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/getUser';
import { getBookingByChannel } from '@/lib/learn/repo';
import AgoraRoom from '@/components/dashboard/AgoraRoom';

export const dynamic = 'force-dynamic';

export default async function SessionRoomPage({
  params,
}: {
  params: { channel: string };
}) {
  const session = getSessionUser();
  if (!session) redirect(`/login?next=/dashboard/sessions/${params.channel}`);

  const booking = await getBookingByChannel(session.uid, params.channel);
  const title = booking ? booking.topic : 'Live session';

  return (
    <AgoraRoom
      channel={params.channel}
      displayName={session.name}
      title={title}
    />
  );
}
