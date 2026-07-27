import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowRight, Users } from 'lucide-react';
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
    <div className="mx-auto max-w-[1080px] overflow-x-hidden">
      <header className="mb-10 border-b pb-8" style={{ borderColor: 'var(--line)' }}>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-[540px]">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: 'var(--ink-soft)' }}>
              Instructors · 1-on-1
            </p>
            <h1 className="mt-2 font-display text-[32px] leading-[0.95] tracking-tight sm:text-[40px]">
              Mentorship
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              Mentors on InTelleX are instructors - practitioners who teach, review work, and
              run live sessions. Book HD video with screen sharing inside your dashboard.
            </p>
          </div>
          <Link
            href="/dashboard/mentor"
            className="inline-flex items-center gap-2 border px-4 py-2.5 text-[13px] font-semibold"
            style={{ borderColor: 'var(--ink)', color: 'var(--ink)' }}
          >
            Instructor studio <ArrowRight size={14} />
          </Link>
        </div>
      </header>

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
