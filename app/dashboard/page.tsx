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
    { icon: Flame, label: 'Day streak', value: String(streak), color: '#c2570a' },
    { icon: Zap, label: 'Total XP', value: xp.toLocaleString(), color: 'var(--green-deep)' },
    { icon: CheckCircle2, label: 'Lessons completed', value: String(lessonsDone), color: 'var(--blue-ink)' },
    { icon: Clock, label: 'Hours learned', value: String(hoursLearned), color: 'var(--ink)' },
  ];

  const affiliations = learner?.affiliations ?? [];

  return (
    <div className="mx-auto max-w-[1080px] overflow-x-hidden">
      <header className="mb-10 border-b pb-8" style={{ borderColor: 'var(--line)' }}>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-[540px]">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: 'var(--ink-soft)' }}>
              Learning HQ
            </p>
            <h1 className="mt-2 font-display text-[32px] leading-[0.95] tracking-tight sm:text-[40px]">
              {greeting()}, {firstName(learner?.name ?? session.name)}.
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              {streak > 0
                ? `You're on a ${streak}-day streak - keep the fire alive.`
                : 'Complete one lesson today to start a new streak.'}
              {affiliations.length
                ? ` Affiliated with ${affiliations.map((a) => a.institutionName).join(', ')}.`
                : ' One identity - switch campuses from the context menu.'}
            </p>
          </div>
          <Link
            href="/dashboard/tutor"
            className="inline-flex shrink-0 items-center justify-center gap-2 px-5 py-3 text-[13.5px] font-semibold text-white"
            style={{ background: 'var(--ink)' }}
          >
            <Bot size={16} /> Ask the AI Tutor
          </Link>
        </div>
      </header>

      <div className="mb-12 grid grid-cols-2 gap-px lg:grid-cols-4" style={{ background: 'var(--line)' }}>
        {stats.map((s) => (
          <div key={s.label} className="bg-[var(--paper)] p-5 sm:p-6">
            <s.icon size={16} style={{ color: s.color }} />
            <div className="mt-3 font-display text-[28px] leading-none">{s.value}</div>
            <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--ink-soft)' }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <section className="mb-12">
        <div className="mb-6 flex items-end justify-between gap-4 border-b pb-4" style={{ borderColor: 'var(--line)' }}>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: 'var(--ink-soft)' }}>
              In progress
            </p>
            <h2 className="font-display text-[24px]">Continue learning</h2>
          </div>
          <Link
            href="/dashboard/courses"
            className="flex items-center gap-1 text-[13.5px] font-semibold"
            style={{ color: 'var(--green-deep)' }}
          >
            All courses <ArrowRight size={14} />
          </Link>
        </div>

        {continueCards.length === 0 ? (
          <div className="border border-dashed px-6 py-12 text-center" style={{ borderColor: 'var(--line)' }}>
            <GraduationCap size={26} className="mx-auto mb-4" style={{ color: 'var(--green-deep)' }} />
            <h3 className="font-display text-[19px]">Your journey starts here</h3>
            <p className="mx-auto mt-1 max-w-sm text-[14px]" style={{ color: 'var(--ink-soft)' }}>
              Enroll in a self-paced track - hands-on lessons are waiting.
            </p>
            <Link
              href="/dashboard/courses"
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 text-[13.5px] font-semibold text-white"
              style={{ background: 'var(--green)' }}
            >
              <Plus size={16} /> Browse courses
            </Link>
          </div>
        ) : (
          <ul className="divide-y" style={{ borderColor: 'var(--line)' }}>
            {continueCards.map(({ track, next, pct }, index) => (
              <li key={track.slug}>
                <Link
                  href={
                    next
                      ? `/dashboard/courses/${track.slug}/${next.slug}`
                      : `/dashboard/courses/${track.slug}`
                  }
                  className="grid gap-4 py-6 sm:grid-cols-[72px_1fr_auto] sm:items-center sm:gap-6"
                >
                  <div
                    className="relative flex h-[72px] w-[72px] items-end overflow-hidden"
                    style={{
                      background: `linear-gradient(145deg, ${track.color} 0%, ${track.color}88 45%, #0C1116 100%)`,
                    }}
                  >
                    <span className="absolute right-2 top-2 font-mono text-[10px] text-white/55">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="relative z-[1] p-2">
                      <TrackLogo slug={track.slug} color="#fff" size={28} />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="font-display text-[20px] leading-tight sm:text-[22px]">{track.shortTitle}</div>
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em]" style={{ color: 'var(--ink-soft)' }}>
                      {track.tag} · {pct}% complete · {track.totalLessons} lessons
                    </p>
                    <div className="mt-3 h-1 max-w-md overflow-hidden" style={{ background: 'var(--paper-dim)' }}>
                      <div className="h-full" style={{ width: `${Math.max(pct, 2)}%`, background: 'var(--green)' }} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[13.5px] font-semibold" style={{ color: 'var(--green-deep)' }}>
                    <PlayCircle size={16} />
                    <span className="max-w-[180px] truncate">{next ? next.title : 'Review'}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="grid gap-10 lg:grid-cols-5">
        <section className="lg:col-span-3">
          <div className="mb-4 flex items-end justify-between border-b pb-3" style={{ borderColor: 'var(--line)' }}>
            <h2 className="font-display text-[22px]">Upcoming sessions</h2>
            <Link href="/dashboard/mentorship" className="text-[13px] font-semibold" style={{ color: 'var(--green-deep)' }}>
              Book instructor <ArrowRight size={14} className="inline" />
            </Link>
          </div>
          {upcoming.length === 0 ? (
            <div className="border-t pt-5" style={{ borderColor: 'var(--line)' }}>
              <Video size={18} style={{ color: 'var(--blue-ink)' }} />
              <p className="mt-3 text-[14.5px] font-semibold">No sessions booked yet</p>
              <p className="mt-1 text-[13.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                Book a 1-on-1 with an instructor - live HD video, screen sharing, and a plan tailored to you.
              </p>
              <Link href="/dashboard/mentorship" className="mt-3 inline-flex text-[13.5px] font-semibold" style={{ color: 'var(--blue-ink)' }}>
                Meet instructors →
              </Link>
            </div>
          ) : (
            <ul className="divide-y" style={{ borderColor: 'var(--line)' }}>
              {upcoming.map((b) => {
                const when = new Date(b.scheduledAt);
                return (
                  <li key={b.id} className="flex flex-wrap items-center gap-4 py-4">
                    <CalendarClock size={18} style={{ color: 'var(--green-deep)' }} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[14.5px] font-semibold">{b.topic}</div>
                      <div className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                        with {b.mentorName} ·{' '}
                        {when.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} at{' '}
                        {when.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <Link
                      href={`/dashboard/sessions/${b.channel}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-white"
                      style={{ background: 'var(--ink)' }}
                    >
                      <Video size={15} /> Join room
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="lg:col-span-2">
          <div className="mb-4 border-b pb-3" style={{ borderColor: 'var(--line)' }}>
            <h2 className="font-display text-[22px]">Recommended</h2>
          </div>
          <ul className="divide-y" style={{ borderColor: 'var(--line)' }}>
            {recommended.map((t) => (
              <li key={t.slug}>
                <Link href={`/dashboard/courses/${t.slug}`} className="flex items-center gap-3.5 py-4">
                  <TrackLogo slug={t.slug} color={t.color} size={36} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[14px] font-semibold">{t.shortTitle}</div>
                    <div className="flex items-center gap-2 text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                      <BookOpen size={11} /> {t.totalLessons} lessons
                      <Clock size={11} /> ~{Math.round(t.totalMinutes / 60)}h
                    </div>
                  </div>
                  <ArrowRight size={15} style={{ color: 'var(--ink-soft)' }} />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
