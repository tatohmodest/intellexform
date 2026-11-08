import Link from 'next/link';
import { redirect } from 'next/navigation';
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
      <PageHeader art="/hero_mentor.webp" tone="mint"
        title="Instructors"
        description="Learn one-on-one with approved InTelleX instructors. Book a session, join the room, grow faster."
        actions={
          <>
            <Link href="/dashboard/mentor" className="chip">
              Instructor studio
            </Link>
          </>
        }
      />

      {mentors.length === 0 ? (
        <div className="grid items-center gap-6 overflow-hidden rounded-[28px] bg-white p-6 sm:p-10 md:grid-cols-[1fr_320px]">
          <div>
            <h2 className="text-[24px] font-bold text-[var(--navy)]">Instructors are on their way</h2>
            <p className="mt-2 max-w-md text-[15px] leading-relaxed text-[var(--ink-soft)]">
              Instructor profiles appear here once they are approved. You can apply to teach from the instructor studio.
            </p>
            <Link href="/dashboard/mentor" className="btn btn-primary mt-6 !px-5">
              Open instructor studio
            </Link>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/doodles/loving.svg" alt="" className="mx-auto hidden h-48 w-auto md:block" />
        </div>
      ) : (
        <MentorDirectory mentors={mentors} bookings={bookingViews} />
      )}
    </div>
  );
}
