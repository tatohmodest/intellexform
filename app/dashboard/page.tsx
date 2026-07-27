import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  ArrowRight,
  BookOpen,
  Bot,
  CalendarClock,
  CheckCircle2,
  Clock,
  Flame,
  GraduationCap,
  PlayCircle,
  Plus,
  Video,
  Zap,
} from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import {
  getBookings,
  getEnrollments,
  getLearner,
  getProgress,
} from '@/lib/learn/repo';
import { getCatalog, getCatalogTrack, getNextLesson } from '@/lib/learn/catalog';
import TrackLogo from '@/components/TrackLogo';

export const dynamic = 'force-dynamic';

function firstName(name: string): string {
  return name.split(/\s+/)[0] || name;
}

function greeting(): string {
  const h = new Date().getUTCHours() + 1; // WAT
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export default async function DashboardOverview() {
  const session = getSessionUser();
  if (!session) redirect('/login?next=/dashboard');

  const [learner, enrollments, progress, bookings] = await Promise.all([
    getLearner(session.uid),
    getEnrollments(session.uid),
    getProgress(session.uid),
    getBookings(session.uid),
  ]);

  const completedByCourse = new Map<string, Set<string>>();
  let minutesLearned = 0;
  for (const p of progress) {
    if (!completedByCourse.has(p.courseSlug)) completedByCourse.set(p.courseSlug, new Set());
    completedByCourse.get(p.courseSlug)!.add(p.lessonSlug);
    minutesLearned += p.minutes || 0;
  }

  const continueCards = enrollments
    .map((e) => {
      const track = getCatalogTrack(e.courseSlug);
      if (!track) return null;
      const done = completedByCourse.get(e.courseSlug) ?? new Set<string>();
      const next = getNextLesson(e.courseSlug, done);
      const pct = track.totalLessons
        ? Math.round((done.size / track.totalLessons) * 100)
        : 0;
      return { track, next, pct, done: done.size };
    })
    .filter((c): c is NonNullable<typeof c> => c !== null)
    .slice(0, 3);

  const enrolledSlugs = new Set(enrollments.map((e) => e.courseSlug));
  const recommended = getCatalog()
    .filter((t) => !enrolledSlugs.has(t.slug))
    .slice(0, 4);

  const upcoming = bookings
    .filter((b) => b.status === 'upcoming' && new Date(b.scheduledAt).getTime() > Date.now() - 60 * 60 * 1000)
    .slice(0, 3);

  const lessonsDone = progress.length;
  const hoursLearned = Math.round((minutesLearned / 60) * 10) / 10;
  const streak = learner?.streakCount ?? 0;
  const xp = learner?.xp ?? 0;

  const stats = [
    { icon: Flame, label: 'Day streak', value: String(streak), tint: 'rgba(255,122,0,0.1)', color: '#c2570a' },
    { icon: Zap, label: 'Total XP', value: xp.toLocaleString(), tint: 'rgba(0,179,105,0.1)', color: 'var(--green-deep)' },
    { icon: CheckCircle2, label: 'Lessons completed', value: String(lessonsDone), tint: 'rgba(74,144,226,0.12)', color: 'var(--blue-ink)' },
    { icon: Clock, label: 'Hours learned', value: String(hoursLearned), tint: 'rgba(124,58,237,0.1)', color: '#6d28d9' },
  ];

  return (
    <div className="mx-auto max-w-[1100px]">
      {/* Greeting */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="tab mb-2 inline-flex items-center gap-1.5">
            Your learning HQ
          </div>
          <h1 className="font-display text-[30px] leading-tight sm:text-[34px]">
            {greeting()}, {firstName(learner?.name ?? session.name)}.
          </h1>
          <p className="mt-1 text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
            {streak > 0
              ? `You're on a ${streak}-day streak — keep the fire alive.`
              : 'Complete one lesson today to start a new streak.'}
          </p>
        </div>
        <Link href="/dashboard/tutor" className="btn btn-primary !py-3 text-[14px]">
          <Bot size={16} />
          Ask the AI Tutor
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border p-4 sm:p-5"
            style={{ borderColor: 'var(--line)' }}
          >
            <span
              className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ background: s.tint, color: s.color }}
            >
              <s.icon size={17} />
            </span>
            <div className="font-display text-[24px] leading-none">{s.value}</div>
            <div className="mt-1 text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Continue learning */}
      <section className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-[21px]">Continue learning</h2>
          <Link
            href="/dashboard/courses"
            className="flex items-center gap-1 text-[13.5px] font-semibold"
            style={{ color: 'var(--green-deep)' }}
          >
            All courses <ArrowRight size={14} />
          </Link>
        </div>

        {continueCards.length === 0 ? (
          <div
            className="flex flex-col items-center rounded-2xl border border-dashed px-6 py-12 text-center"
            style={{ borderColor: 'var(--line)' }}
          >
            <span
              className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{ background: 'rgba(0,179,105,0.1)', color: 'var(--green-deep)' }}
            >
              <GraduationCap size={26} />
            </span>
            <h3 className="font-display text-[19px]">Your journey starts here</h3>
            <p className="mt-1 max-w-sm text-[14px]" style={{ color: 'var(--ink-soft)' }}>
              Enroll in your first self-paced track — 17 courses with hundreds of
              hands-on lessons are waiting.
            </p>
            <Link href="/dashboard/courses" className="btn btn-primary mt-5 !py-3 text-[14px]">
              <Plus size={16} /> Browse courses
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {continueCards.map(({ track, next, pct }) => (
              <Link
                key={track.slug}
                href={
                  next
                    ? `/dashboard/courses/${track.slug}/${next.slug}`
                    : `/dashboard/courses/${track.slug}`
                }
                className="group rounded-2xl border p-5 transition-shadow hover:shadow-card"
                style={{ borderColor: 'var(--line)' }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <TrackLogo slug={track.slug} color={track.color} size={44} />
                  <div className="min-w-0">
                    <div className="truncate text-[15px] font-semibold">{track.shortTitle}</div>
                    <div className="mono text-[11px] uppercase tracking-[0.1em]" style={{ color: 'var(--ink-soft)' }}>
                      {track.tag}
                    </div>
                  </div>
                </div>
                <div className="mb-2 flex items-center justify-between text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
                  <span>{pct}% complete</span>
                  <span>{track.totalLessons} lessons</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full" style={{ background: 'var(--paper-dim)' }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${Math.max(pct, 2)}%`, background: 'var(--green)' }}
                  />
                </div>
                <div className="mt-4 flex items-center gap-2 text-[13.5px] font-semibold" style={{ color: 'var(--green-deep)' }}>
                  <PlayCircle size={16} />
                  {next ? (
                    <span className="truncate">Next: {next.title}</span>
                  ) : (
                    <span>Course complete — review it</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Upcoming sessions */}
        <section className="lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-[21px]">Upcoming live sessions</h2>
            <Link
              href="/dashboard/mentorship"
              className="flex items-center gap-1 text-[13.5px] font-semibold"
              style={{ color: 'var(--green-deep)' }}
            >
              Book a mentor <ArrowRight size={14} />
            </Link>
          </div>

          {upcoming.length === 0 ? (
            <div
              className="rounded-2xl border p-6"
              style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}
            >
              <div className="flex items-start gap-4">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: 'rgba(74,144,226,0.14)', color: 'var(--blue-ink)' }}
                >
                  <Video size={20} />
                </span>
                <div>
                  <h3 className="text-[15.5px] font-semibold">No sessions booked yet</h3>
                  <p className="mt-1 text-[13.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                    Book a 1-on-1 with a mentor — live HD video, screen sharing, and a
                    plan tailored to where you are.
                  </p>
                  <Link
                    href="/dashboard/mentorship"
                    className="mt-3 inline-flex items-center gap-1.5 text-[13.5px] font-semibold"
                    style={{ color: 'var(--blue-ink)' }}
                  >
                    Meet the mentors <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.map((b) => {
                const when = new Date(b.scheduledAt);
                return (
                  <div
                    key={b.id}
                    className="flex flex-wrap items-center gap-4 rounded-2xl border p-4"
                    style={{ borderColor: 'var(--line)' }}
                  >
                    <span
                      className="flex h-11 w-11 items-center justify-center rounded-xl"
                      style={{ background: 'rgba(0,179,105,0.1)', color: 'var(--green-deep)' }}
                    >
                      <CalendarClock size={19} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[14.5px] font-semibold">{b.topic}</div>
                      <div className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                        with {b.mentorName} ·{' '}
                        {when.toLocaleDateString('en-GB', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                        })}{' '}
                        at{' '}
                        {when.toLocaleTimeString('en-GB', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                    <Link
                      href={`/dashboard/sessions/${b.channel}`}
                      className="btn btn-primary !px-5 !py-2.5 text-[13px]"
                    >
                      <Video size={15} /> Join room
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Recommended */}
        <section className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-[21px]">Recommended for you</h2>
          </div>
          <div className="space-y-3">
            {recommended.map((t) => (
              <Link
                key={t.slug}
                href={`/dashboard/courses/${t.slug}`}
                className="flex items-center gap-3.5 rounded-2xl border p-4 transition-shadow hover:shadow-card"
                style={{ borderColor: 'var(--line)' }}
              >
                <TrackLogo slug={t.slug} color={t.color} size={40} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[14px] font-semibold">{t.shortTitle}</div>
                  <div className="flex items-center gap-2 text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                    <BookOpen size={11} /> {t.totalLessons} lessons
                    <Clock size={11} /> ~{Math.round(t.totalMinutes / 60)}h
                  </div>
                </div>
                <ArrowRight size={15} style={{ color: 'var(--ink-soft)' }} />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
