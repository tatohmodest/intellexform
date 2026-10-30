import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Users } from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import { getBookings } from '@/lib/learn/repo';
import { getAllMentors } from '@/lib/learn/ecosystem';
import MentorDirectory, { type BookingView } from '@/components/dashboard/MentorDirectory';
import PageHeader from '@/components/dashboard/PageHeader';

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
    <div className="mx-auto max-w-[1080px] overflow-x-hidden">
      <PageHeader
        title="Mentorship"
        actions={
          <>
            <Link href="/dashboard/mentor" className="chip">
              Instructor studio
            </Link>
          </>
        }
      />

      {mentors.length === 0 ? (
        <div className="border border-dashed px-6 py-16 text-center" style={{ borderColor: 'var(--line)' }}>
          <Users size={28} className="mx-auto mb-4" style={{ color: 'var(--ink-soft)' }} />
          <h2 className="font-display text-[22px]">No instructors listed yet</h2>
          <p className="mx-auto mt-2 max-w-md text-[14px]" style={{ color: 'var(--ink-soft)' }}>
            Live mentor profiles appear here once instructors are approved. Apply to teach from
            Instructor studio, or ask Platform Admin to approve mentor applications.
          </p>
          <Link
            href="/dashboard/mentor"
            className="mt-6 inline-flex px-5 py-2.5 text-[13.5px] font-semibold text-white"
            style={{ background: 'var(--green)' }}
          >
            Open instructor studio
          </Link>
        </div>
      ) : (
        <MentorDirectory mentors={mentors} bookings={bookingViews} />
      )}
    </div>
  );
}
