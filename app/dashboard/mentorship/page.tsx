import { redirect } from 'next/navigation';
import { Users } from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import { getBookings } from '@/lib/learn/repo';
import { getAllMentors } from '@/lib/learn/ecosystem';
import MentorDirectory, { type BookingView } from '@/components/dashboard/MentorDirectory';

export const dynamic = 'force-dynamic';

export default async function MentorshipPage() {
  const session = getSessionUser();
  if (!session) redirect('/login?next=/dashboard/mentorship');

  const [bookings, mentors] = await Promise.all([
    getBookings(session.uid),
    getAllMentors(),
  ]);
  const bookingViews: BookingView[] = bookings.map((b) => ({
    id: b.id,
    mentorId: b.mentorId,
    mentorName: b.mentorName,
    topic: b.topic,
    scheduledAt: new Date(b.scheduledAt).toISOString(),
    durationMinutes: b.durationMinutes,
    channel: b.channel,
    status: b.status,
  }));

  return (
    <div className="mx-auto max-w-[1100px]">
      <div className="mb-8">
        <div className="tab mb-2 inline-flex items-center gap-1.5">
          <Users size={11} />
          1-on-1 mentorship
        </div>
        <h1 className="font-display text-[30px] leading-tight">Mentorship</h1>
        <p className="mt-1 max-w-xl text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
          Book live sessions with practitioners who&apos;ve shipped real products. HD video,
          screen sharing and a plan tailored to you — right inside your dashboard.
        </p>
      </div>

      <MentorDirectory mentors={mentors} bookings={bookingViews} />
    </div>
  );
}
