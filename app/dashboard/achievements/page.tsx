import { redirect } from 'next/navigation';
import {
  Award,
  BookOpenCheck,
  CalendarCheck,
  Flame,
  GraduationCap,
  Medal,
  Rocket,
  Star,
  Trophy,
  Zap,
} from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import { getBookings, getEnrollments, getLearner, getProgress } from '@/lib/learn/repo';
import { getCatalogTrack } from '@/lib/learn/catalog';
import TrackLogo from '@/components/TrackLogo';

export const dynamic = 'force-dynamic';

const LEVELS = [
  { name: 'Spark', minXp: 0 },
  { name: 'Builder', minXp: 200 },
  { name: 'Craftsman', minXp: 600 },
  { name: 'Architect', minXp: 1500 },
  { name: 'Master', minXp: 3500 },
  { name: 'Legend', minXp: 8000 },
];

export default async function AchievementsPage() {
  const session = getSessionUser();
  if (!session) redirect('/login?next=/dashboard/achievements');

  const [learner, enrollments, progress, bookings] = await Promise.all([
    getLearner(session.uid),
    getEnrollments(session.uid),
    getProgress(session.uid),
    getBookings(session.uid),
  ]);

  const xp = learner?.xp ?? 0;
  const streak = learner?.streakCount ?? 0;
  const lessonsDone = progress.length;
  const levelIdx = LEVELS.reduce((acc, l, i) => (xp >= l.minXp ? i : acc), 0);
  const level = LEVELS[levelIdx];
  const nextLevel = LEVELS[levelIdx + 1] ?? null;
  const levelPct = nextLevel
    ? Math.min(
        100,
        Math.round(((xp - level.minXp) / (nextLevel.minXp - level.minXp)) * 100),
      )
    : 100;

  // Certificates: tracks with every lesson completed.
  const byCourse = new Map<string, number>();
  for (const p of progress) byCourse.set(p.courseSlug, (byCourse.get(p.courseSlug) ?? 0) + 1);
  const certificates = enrollments
    .map((e) => getCatalogTrack(e.courseSlug))
    .filter((t): t is NonNullable<typeof t> => t !== null)
    .filter((t) => t.totalLessons > 0 && (byCourse.get(t.slug) ?? 0) >= t.totalLessons);

  const badges = [
    { icon: Rocket, name: 'First Step', desc: 'Complete your first lesson', earned: lessonsDone >= 1 },
    { icon: BookOpenCheck, name: 'Bookworm', desc: 'Complete 10 lessons', earned: lessonsDone >= 10 },
    { icon: Medal, name: 'Half Century', desc: 'Complete 50 lessons', earned: lessonsDone >= 50 },
    { icon: Flame, name: 'On Fire', desc: 'Reach a 7-day streak', earned: streak >= 7 },
    { icon: Star, name: 'Unstoppable', desc: 'Reach a 30-day streak', earned: streak >= 30 },
    { icon: CalendarCheck, name: 'Mentored', desc: 'Book your first mentorship session', earned: bookings.length >= 1 },
    { icon: GraduationCap, name: 'Graduate', desc: 'Finish a full course track', earned: certificates.length >= 1 },
    { icon: Zap, name: 'Powerhouse', desc: 'Earn 1,000 XP', earned: xp >= 1000 },
    ...(learner?.instructorBadgeLabels || []).map((label) => ({
      icon: Award,
      name: label,
      desc: 'Approved instructor for this campus',
      earned: true,
    })),
    ...(!learner?.instructorBadgeLabels?.length && learner?.instructorBadge
      ? [
          {
            icon: Award,
            name: learner.instructorBadge,
            desc: 'Approved instructor for this campus',
            earned: true,
          },
        ]
      : []),
  ];
  const earnedCount = badges.filter((b) => b.earned).length;

  return (
    <div className="mx-auto max-w-[1000px]">
      <div className="mb-8">
        <div className="tab mb-2 inline-flex items-center gap-1.5">
          <Trophy size={11} />
          Progress & rewards
        </div>
        <h1 className="font-display text-[30px] leading-tight">Achievements</h1>
        <p className="mt-1 text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
          Every lesson, streak and session earns you XP, badges and certificates.
        </p>
      </div>

      {/* Level card */}
      <div
        className="mb-10 rounded-3xl p-6 text-white sm:p-8"
        style={{
          background:
            'radial-gradient(800px 400px at 0% 0%, rgba(0,179,105,0.5), transparent 60%), radial-gradient(700px 380px at 100% 100%, rgba(74,144,226,0.4), transparent 60%), #0C1116',
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <div className="mono text-[11px] uppercase tracking-[0.16em] text-white/60">
              Current level
            </div>
            <div className="mt-1 font-display text-[34px] leading-none">{level.name}</div>
            <div className="mt-2 text-[13.5px] text-white/70">
              {xp.toLocaleString()} XP
              {nextLevel
                ? ` · ${(nextLevel.minXp - xp).toLocaleString()} XP to ${nextLevel.name}`
                : ' · Max level reached'}
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="font-display text-[26px]">{lessonsDone}</div>
              <div className="text-[11.5px] text-white/60">lessons</div>
            </div>
            <div className="text-center">
              <div className="font-display text-[26px]">{streak}</div>
              <div className="text-[11.5px] text-white/60">day streak</div>
            </div>
            <div className="text-center">
              <div className="font-display text-[26px]">{earnedCount}/{badges.length}</div>
              <div className="text-[11.5px] text-white/60">badges</div>
            </div>
          </div>
        </div>
        <div className="mt-6 h-2.5 overflow-hidden rounded-full bg-white/15">
          <div
            className="h-full rounded-full"
            style={{ width: `${Math.max(levelPct, 2)}%`, background: '#1ED77E' }}
          />
        </div>
      </div>

      {/* Badges */}
      <h2 className="mb-4 font-display text-[21px]">Badges</h2>
      <div className="mb-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {badges.map((b) => (
          <div
            key={b.name}
            className="rounded-2xl border p-4 text-center"
            style={{
              borderColor: b.earned ? 'rgba(0,179,105,0.35)' : 'var(--line)',
              background: b.earned ? 'rgba(0,179,105,0.05)' : 'var(--paper)',
              opacity: b.earned ? 1 : 0.55,
            }}
          >
            <span
              className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl"
              style={
                b.earned
                  ? { background: 'rgba(0,179,105,0.14)', color: 'var(--green-deep)' }
                  : { background: 'var(--paper-dim)', color: 'var(--ink-soft)' }
              }
            >
              <b.icon size={22} />
            </span>
            <div className="text-[13.5px] font-semibold">{b.name}</div>
            <div className="mt-0.5 text-[12px]" style={{ color: 'var(--ink-soft)' }}>
              {b.desc}
            </div>
          </div>
        ))}
      </div>

      {/* Certificates */}
      <h2 className="mb-4 font-display text-[21px]">Certificates</h2>
      {certificates.length === 0 ? (
        <div
          className="flex items-center gap-4 rounded-2xl border border-dashed p-6"
          style={{ borderColor: 'var(--line)' }}
        >
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
            style={{ background: 'var(--paper-dim)', color: 'var(--ink-soft)' }}
          >
            <Award size={22} />
          </span>
          <div>
            <div className="text-[14.5px] font-semibold">No certificates yet</div>
            <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
              Finish every lesson in a track to earn its certificate of completion.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {certificates.map((c) => (
            <div
              key={c.slug}
              className="rounded-2xl border p-6"
              style={{ borderColor: 'rgba(0,179,105,0.3)', background: 'rgba(0,179,105,0.04)' }}
            >
              <div className="mb-3 flex items-center justify-between">
                <TrackLogo slug={c.slug} color={c.color} size={44} />
                <Award size={20} style={{ color: 'var(--green-deep)' }} />
              </div>
              <div className="font-display text-[18px]">{c.title}</div>
              <div className="mt-1 text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
                Certificate of Completion · {c.totalLessons} lessons · Intellex × LoopingBinary
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
