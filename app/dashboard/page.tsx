import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  ArrowRight,
  BookOpen,
  Bot,
  CheckSquare,
  ClipboardList,
  Flame,
  Sparkles,
  Trophy,
  Zap,
} from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import { getStudentCommandCenter } from '@/lib/learn/commandCenter';
import { getLearner } from '@/lib/learn/repo';
import { getStaffPost } from '@/lib/staff/store';

export const dynamic = 'force-dynamic';

function firstName(name: string): string {
  return name.split(/\s+/)[0] || name;
}

function greeting(): string {
  const h = new Date().getUTCHours() + 1;
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export default async function DashboardOverview() {
  const session = getSessionUser();
  if (!session) redirect('/login?next=/dashboard');

  // Campus students land on their institution dashboard (tier features), not personal Today.
  const learner = await getLearner(session.uid);
  const ctx = learner?.activeContext;
  if (ctx?.kind === 'institution' && ctx.institutionSlug) {
    redirect(`/dashboard/institutions/${ctx.institutionSlug}`);
  }

  const cc = await getStudentCommandCenter(session.uid);
  const staffPost = await getStaffPost(session.uid).catch(() => null);
  const name = firstName(cc.learner?.name ?? session.name);

  return (
    <div className="mx-auto max-w-[1080px] overflow-x-hidden">
      <header className="mb-8 border-b pb-8" style={{ borderColor: 'var(--line)' }}>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: 'var(--ink-soft)' }}>
          Today
        </p>
        <h1 className="mt-2 font-display text-[34px] leading-[0.95] tracking-tight sm:text-[44px]">
          {greeting()}, {name}.
        </h1>
        <p className="mt-3 text-[16px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
          {cc.focusCount > 0 ? (
            <>
              You have <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{cc.focusCount} things</span> to
              focus on today.
            </>
          ) : (
            <>You&apos;re clear for now — keep the streak alive with a short lesson.</>
          )}
        </p>
        <div className="mt-5 flex flex-wrap gap-2 text-[12.5px] font-semibold">
          <Link href="/dashboard/calendar" className="border px-3 py-1.5" style={{ borderColor: 'var(--line)' }}>
            Calendar
          </Link>
          <Link href="/dashboard/assignments" className="border px-3 py-1.5" style={{ borderColor: 'var(--line)' }}>
            Assignments
          </Link>
          <Link href="/dashboard/my-learning" className="border px-3 py-1.5" style={{ borderColor: 'var(--line)' }}>
            My Learning
          </Link>
          <Link href="/dashboard/tutor" className="border px-3 py-1.5" style={{ borderColor: 'var(--line)' }}>
            AI Tutor
          </Link>
          <Link href="/dashboard/fees" className="border px-3 py-1.5" style={{ borderColor: 'var(--line)' }}>
            School fees
          </Link>
          {staffPost ? (
            <Link href="/dashboard/staff" className="border px-3 py-1.5" style={{ borderColor: 'var(--line)' }}>
              Staff
            </Link>
          ) : null}
        </div>
      </header>

      {cc.attention.length > 0 ? (
        <section className="mb-10">
          <h2 className="mb-3 font-display text-[20px]">Attention required</h2>
          <ul className="space-y-2">
            {cc.attention.map((a) => (
              <li key={a.id}>
                <Link
                  href={a.href}
                  className="flex items-start justify-between gap-4 border p-4"
                  style={{
                    borderColor:
                      a.severity === 'high'
                        ? 'rgba(185,28,28,0.35)'
                        : 'var(--line)',
                    background:
                      a.severity === 'high' ? 'rgba(185,28,28,0.04)' : 'transparent',
                  }}
                >
                  <div>
                    <p className="font-semibold">{a.title}</p>
                    <p className="mt-0.5 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                      {a.detail}
                    </p>
                  </div>
                  <ArrowRight size={16} className="mt-1 shrink-0" style={{ color: 'var(--ink-soft)' }} />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mb-10">
        <div className="mb-4 flex items-end justify-between gap-3">
          <h2 className="font-display text-[22px]">Today</h2>
          <Link href="/dashboard/calendar" className="text-[13px] font-semibold" style={{ color: 'var(--green-deep)' }}>
            Full calendar →
          </Link>
        </div>
        {cc.today.length === 0 ? (
          <div className="border border-dashed p-8 text-center" style={{ borderColor: 'var(--line)' }}>
            <p className="font-display text-[18px]">No timed items today</p>
            <p className="mt-1 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
              Continue a course or set a personal task.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <Link
                href="/dashboard/my-learning"
                className="px-4 py-2.5 text-[13px] font-semibold text-white"
                style={{ background: 'var(--ink)' }}
              >
                Continue learning
              </Link>
              <Link
                href="/dashboard/todos"
                className="border px-4 py-2.5 text-[13px] font-semibold"
                style={{ borderColor: 'var(--line)' }}
              >
                Add a task
              </Link>
            </div>
          </div>
        ) : (
          <ul className="divide-y border" style={{ borderColor: 'var(--line)' }}>
            {cc.today.map((item) => (
              <li key={item.id} className="flex flex-wrap items-center gap-4 px-4 py-4 sm:flex-nowrap">
                <div className="w-16 shrink-0 font-mono text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                  {item.timeLabel}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                    {item.subtitle}
                  </p>
                </div>
                <Link
                  href={item.href}
                  className="shrink-0 px-3.5 py-2 text-[13px] font-semibold text-white"
                  style={{
                    background: item.urgency === 'now' ? '#b91c1c' : 'var(--green-deep)',
                  }}
                >
                  {item.actionLabel}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mb-10">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="font-display text-[22px]">Continue learning</h2>
          <Link href="/dashboard/my-learning" className="text-[13px] font-semibold" style={{ color: 'var(--green-deep)' }}>
            My Learning →
          </Link>
        </div>
        {cc.continueLearning.length === 0 ? (
          <div className="border border-dashed p-6" style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}>
            Enroll in a course to see continue cards here.{' '}
            <Link href="/dashboard/courses" className="font-semibold" style={{ color: 'var(--green-deep)' }}>
              Browse courses
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {cc.continueLearning.map((row) => (
              <li key={row.course.id}>
                <Link
                  href={row.href}
                  className="block border p-4 transition-shadow hover:shadow-card"
                  style={{ borderColor: 'var(--line)' }}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{row.course.title}</p>
                      <p className="mt-0.5 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                        {row.nextTitle}
                      </p>
                    </div>
                    <span className="text-[13px] font-semibold" style={{ color: 'var(--green-deep)' }}>
                      Continue →
                    </span>
                  </div>
                  <div className="mt-3 h-1.5 w-full" style={{ background: 'var(--paper-dim)' }}>
                    <div
                      className="h-full"
                      style={{
                        width: `${Math.min(100, Math.max(0, row.course.pct))}%`,
                        background: 'var(--green-deep)',
                      }}
                    />
                  </div>
                  <p className="mt-1.5 font-mono text-[11px]" style={{ color: 'var(--ink-soft)' }}>
                    {Math.round(row.course.pct)}% complete
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Flame, label: 'Day streak', value: String(cc.stats.streak) },
          { icon: Zap, label: 'XP', value: cc.stats.xp.toLocaleString() },
          {
            icon: BookOpen,
            label: 'Weekly learning',
            value: `${cc.stats.weeklyHours}h / ${cc.stats.weeklyGoalHours}h`,
          },
          { icon: Trophy, label: 'Lessons done', value: String(cc.stats.lessonsDone) },
        ].map((s) => (
          <div key={s.label} className="border p-4" style={{ borderColor: 'var(--line)' }}>
            <s.icon size={16} style={{ color: 'var(--green-deep)' }} />
            <p className="mt-2 font-display text-[24px] leading-none">{s.value}</p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--ink-soft)' }}>
              {s.label}
            </p>
          </div>
        ))}
      </section>

      <section className="mb-10 grid gap-6 lg:grid-cols-2">
        <div className="border p-5" style={{ borderColor: 'var(--line)' }}>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-[18px]">Assignments</h2>
            <Link href="/dashboard/assignments" className="text-[12.5px] font-semibold" style={{ color: 'var(--green-deep)' }}>
              Center →
            </Link>
          </div>
          <ul className="space-y-2 text-[13.5px]">
            <li>
              Due today:{' '}
              <strong>{cc.assignmentBuckets.due_today.length}</strong>
            </li>
            <li>
              This week:{' '}
              <strong>{cc.assignmentBuckets.due_week.length}</strong>
            </li>
            <li>
              Overdue:{' '}
              <strong>{cc.assignmentBuckets.overdue.length}</strong>
            </li>
            <li>
              Graded:{' '}
              <strong>{cc.assignmentBuckets.graded.length}</strong>
            </li>
          </ul>
        </div>
        <div className="border p-5" style={{ borderColor: 'var(--line)' }}>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-[18px]">Quick actions</h2>
          </div>
          <div className="flex flex-col gap-2 text-[13.5px] font-semibold">
            <Link href="/dashboard/todos" className="inline-flex items-center gap-2" style={{ color: 'var(--ink)' }}>
              <CheckSquare size={15} /> My tasks
            </Link>
            <Link href="/dashboard/assignments" className="inline-flex items-center gap-2" style={{ color: 'var(--ink)' }}>
              <ClipboardList size={15} /> Assignment center
            </Link>
            <Link href="/dashboard/achievements" className="inline-flex items-center gap-2" style={{ color: 'var(--ink)' }}>
              <Trophy size={15} /> Achievements
            </Link>
            <Link href="/dashboard/tutor" className="inline-flex items-center gap-2" style={{ color: 'var(--ink)' }}>
              <Bot size={15} /> Ask AI Tutor
            </Link>
            <Link href="/dashboard/courses" className="inline-flex items-center gap-2" style={{ color: 'var(--ink)' }}>
              <Sparkles size={15} /> Explore courses
            </Link>
          </div>
        </div>
      </section>

      {cc.recommended.length > 0 ? (
        <section className="mb-8">
          <h2 className="mb-4 font-display text-[22px]">Recommended for you</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {cc.recommended.map((r) => (
              <Link
                key={r.slug}
                href={r.href}
                className="border p-4"
                style={{ borderColor: 'var(--line)' }}
              >
                <p className="font-semibold">{r.title}</p>
                <p className="mt-1 text-[12.5px] font-semibold" style={{ color: 'var(--green-deep)' }}>
                  Start →
                </p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
