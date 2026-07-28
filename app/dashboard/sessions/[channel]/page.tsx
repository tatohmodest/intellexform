import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/getUser';
import { getBookingByChannel } from '@/lib/learn/repo';
import {
  getClassSessionByChannel,
} from '@/lib/learn/courseClassSessions';
import { isEnrolledInCourse } from '@/lib/learn/ecosystem';
import AgoraRoom from '@/components/dashboard/AgoraRoom';
import EndClassButton from '@/components/dashboard/EndClassButton';

export const dynamic = 'force-dynamic';

export default async function SessionRoomPage({
  params,
}: {
  params: { channel: string };
}) {
  const session = getSessionUser();
  if (!session) redirect(`/login?next=/dashboard/sessions/${params.channel}`);

  const booking = await getBookingByChannel(session.uid, params.channel);
  const classSession = await getClassSessionByChannel(params.channel);

  // Course class: allow host or enrolled students only.
  if (classSession) {
    const isHost = classSession.instructorId === session.uid;
    const enrolled = await isEnrolledInCourse(classSession.courseId, session.uid);
    if (!isHost && !enrolled) {
      redirect(`/dashboard/courses/instructor/${classSession.courseId}`);
    }

    return (
      <div className="mx-auto max-w-[1100px]">
        {isHost && classSession.status === 'live' ? (
          <EndClassButton
            sessionId={classSession.id}
            courseTitle={classSession.courseTitle}
          />
        ) : null}
        {classSession.status === 'ended' ? (
          <div
            className="mb-4 border px-4 py-3 text-[13.5px]"
            style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}
          >
            This class session has ended
            {classSession.endAt
              ? ` · finished ${new Date(classSession.endAt).toLocaleString()}`
              : ''}
            .
          </div>
        ) : null}
        <AgoraRoom
          channel={params.channel}
          displayName={session.name}
          title={`${classSession.courseTitle} · live class`}
        />
      </div>
    );
  }

  const title = booking ? booking.topic : 'Live session';

  return (
    <AgoraRoom
      channel={params.channel}
      displayName={session.name}
      title={title}
    />
  );
}
