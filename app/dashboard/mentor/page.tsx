import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  BookMarked,
  CalendarClock,
  GraduationCap,
  PenLine,
  Plus,
  Users,
  Video,
  Wallet,
} from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import {
  getBookEarnings,
  getMentorBookings,
  getMentorProfile,
  listBooksByAuthor,
} from '@/lib/learn/ecosystem';
import MentorApply from '@/components/dashboard/MentorApply';
import NewBookButton from '@/components/dashboard/NewBookButton';

export const dynamic = 'force-dynamic';

export default async function MentorStudioPage() {
  const session = getSessionUser();
  if (!session) redirect('/login?next=/dashboard/mentor');

  const profile = await getMentorProfile(session.uid);
  if (!profile) {
    return <MentorApply />;
  }

  const [bookings, books, bookEarnings] = await Promise.all([
    getMentorBookings(session.uid),
    listBooksByAuthor(session.uid),
    getBookEarnings(session.uid),
  ]);

  const now = Date.now();
  const upcoming = bookings.filter(
    (b) => b.status === 'upcoming' && new Date(b.scheduledAt).getTime() > now - 60 * 60 * 1000,
  );
  const past = bookings.filter((b) => b.status !== 'cancelled' && new Date(b.scheduledAt).getTime() <= now);
  const students = new Set(bookings.map((b) => b.userId)).size;
  const sessionRevenue = bookings
    .filter((b) => b.status !== 'cancelled')
    .reduce((sum, b) => sum + (b.priceXAF ?? 0), 0);

  const stats = [
    { icon: CalendarClock, label: 'Upcoming sessions', value: String(upcoming.length), tint: 'rgba(0,179,105,0.1)', color: 'var(--green-deep)' },
    { icon: Users, label: 'Students mentored', value: String(students), tint: 'rgba(74,144,226,0.12)', color: 'var(--blue-ink)' },
    { icon: Wallet, label: 'Session revenue', value: `${sessionRevenue.toLocaleString()} XAF`, tint: 'rgba(124,58,237,0.1)', color: '#6d28d9' },
    { icon: BookMarked, label: 'Book earnings', value: `${bookEarnings.toLocaleString()} XAF`, tint: 'rgba(255,122,0,0.1)', color: '#c2570a' },
  ];

  return (
    <div className="mx-auto max-w-[1100px]">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="tab mb-2 inline-flex items-center gap-1.5">
            <GraduationCap size={11} />
            Mentor Studio
          </div>
          <h1 className="font-display text-[30px] leading-tight">
            Welcome back, {profile.name.split(/\s+/)[0]}.
          </h1>
          <p className="mt-1 text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
            {profile.title} · {profile.priceXAF.toLocaleString()} XAF / {profile.sessionMinutes} min
          </p>
        </div>
        <div className="flex gap-2.5">
          <Link href="/dashboard/mentor/profile" className="btn btn-ghost !py-2.5 text-[13.5px]">
            <PenLine size={15} /> Edit profile
          </Link>
          <NewBookButton />
        </div>
      </div>

      {/* Stats */}
      <div className="mb-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border p-4 sm:p-5" style={{ borderColor: 'var(--line)' }}>
            <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: s.tint, color: s.color }}>
              <s.icon size={17} />
            </span>
            <div className="font-display text-[20px] leading-none sm:text-[24px]">{s.value}</div>
            <div className="mt-1 text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Sessions */}
        <section>
          <h2 className="mb-4 font-display text-[21px]">Upcoming sessions</h2>
          {upcoming.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-6 text-[13.5px]" style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}>
              No sessions booked yet. Students find you in the mentorship directory — a
              complete profile with clear skills gets booked faster.
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.map((b) => {
                const when = new Date(b.scheduledAt);
                return (
                  <div key={b.id} className="flex flex-wrap items-center gap-3 rounded-2xl border p-4" style={{ borderColor: 'var(--line)' }}>
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: 'rgba(0,179,105,0.1)', color: 'var(--green-deep)' }}>
                      <CalendarClock size={17} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[14px] font-semibold">{b.topic}</div>
                      <div className="text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
                        {when.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}{' '}
                        at {when.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} · {b.durationMinutes} min
                      </div>
                    </div>
                    <Link href={`/dashboard/sessions/${b.channel}`} className="btn btn-primary !px-4 !py-2 text-[12.5px]">
                      <Video size={14} /> Join
                    </Link>
                  </div>
                );
              })}
            </div>
          )}

          {past.length > 0 && (
            <>
              <h3 className="mb-3 mt-8 font-display text-[17px]">Past sessions</h3>
              <div className="space-y-2">
                {past.slice(0, 5).map((b) => (
                  <div key={b.id} className="flex items-center justify-between rounded-xl border px-4 py-3 text-[13px]" style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}>
                    <span className="truncate">{b.topic}</span>
                    <span>{new Date(b.scheduledAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        {/* Books */}
        <section>
          <h2 className="mb-4 font-display text-[21px]">My books</h2>
          {books.length === 0 ? (
            <div className="flex flex-col items-start rounded-2xl border border-dashed p-6" style={{ borderColor: 'var(--line)' }}>
              <p className="mb-4 text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>
                Write once, earn forever. Publish books, cheatsheets and guides to the
                Intellex library — free to grow your audience, or priced in XAF.
              </p>
              <NewBookButton />
            </div>
          ) : (
            <div className="space-y-3">
              {books.map((b) => (
                <Link
                  key={b.id}
                  href={`/dashboard/mentor/books/${b.id}`}
                  className="flex items-center gap-3.5 rounded-2xl border p-4 transition-shadow hover:shadow-card"
                  style={{ borderColor: 'var(--line)' }}
                >
                  <span
                    className="flex h-12 w-10 shrink-0 items-center justify-center rounded-lg font-display text-[16px] font-semibold"
                    style={{ background: `${b.coverColor}1c`, color: b.coverColor }}
                  >
                    {(b.title || 'B').charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[14px] font-semibold">{b.title}</div>
                    <div className="text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                      {b.chapters.length} chapter{b.chapters.length === 1 ? '' : 's'} ·{' '}
                      {b.priceXAF > 0 ? `${b.priceXAF.toLocaleString()} XAF` : 'Free'} · {b.sales} sale{b.sales === 1 ? '' : 's'}
                    </div>
                  </div>
                  <span
                    className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                    style={
                      b.published
                        ? { background: 'rgba(0,179,105,0.1)', color: 'var(--green-deep)' }
                        : { background: 'var(--paper-dim)', color: 'var(--ink-soft)' }
                    }
                  >
                    {b.published ? 'Published' : 'Draft'}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
