import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  Bot,
  Briefcase,
  CalendarDays,
  CheckSquare,
  ClipboardList,
  Clock,
  Flame,
  Megaphone,
  Sparkles,
  Trophy,
  Wallet,
  Zap,
} from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import { getStudentCommandCenter } from '@/lib/learn/commandCenter';
import { getLearner } from '@/lib/learn/repo';
import { getStaffPost } from '@/lib/staff/store';
import { getOrgConfig } from '@/lib/org/config';
import { getStudentMembership } from '@/lib/learn/studentAccess';
import { getMyApplication } from '@/lib/learn/applications';
import { interestLabels } from '@/lib/learn/interests';
import BecomeStudentBanner from '@/components/dashboard/BecomeStudentBanner';
import InstitutionForms from '@/components/dashboard/InstitutionForms';
import AnnouncementCard from '@/components/dashboard/AnnouncementCard';
import { listFillableDatasetsForUser } from '@/lib/staff/dataWorkspace';
import { listVisibleAnnouncements } from '@/lib/staff/store';
import { listNotifications } from '@/lib/learn/notifications';

export const dynamic = 'force-dynamic';

/** Rotating pastel surfaces, as in the reference dashboards. */
const COURSE_DOODLES = ['readingside', 'sittingreading', 'reading', 'plant', 'laying', 'coffee'];
const DOTS = ['#00b369', '#0C1116', '#9ca3af', '#5ce39a'];

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

  const learner = await getLearner(session.uid);
  const [cc, staffPost, org, membership, application, recentNotes] = await Promise.all([
    getStudentCommandCenter(session.uid),
    getStaffPost(session.uid).catch(() => null),
    getOrgConfig(),
    getStudentMembership(session.uid),
    getMyApplication(session.uid),
    listNotifications(session.uid, 4).catch(() => []),
  ]);
  const name = firstName(cc.learner?.name ?? session.name);
  const interests = interestLabels(learner?.preferences?.interests || []);
  const isStudent = membership.isStudent;
  const [forms, visibleAnnouncements] = await Promise.all([
    listFillableDatasetsForUser({ userId: session.uid, isStudent }).catch(() => []),
    listVisibleAnnouncements({ isStudent }).catch(() => []),
  ]);

  const stats = [
    { icon: Flame, label: 'Day streak', value: String(cc.stats.streak) },
    { icon: Zap, label: 'XP earned', value: cc.stats.xp.toLocaleString() },
    { icon: Clock, label: 'This week', value: `${cc.stats.weeklyHours}h / ${cc.stats.weeklyGoalHours}h` },
    { icon: Trophy, label: 'Lessons done', value: String(cc.stats.lessonsDone) },
  ];
  const assignmentStats = [
    { label: 'Due today', value: cc.assignmentBuckets.due_today.length },
    { label: 'This week', value: cc.assignmentBuckets.due_week.length },
    { label: 'Overdue', value: cc.assignmentBuckets.overdue.length, alert: true },
    { label: 'Graded', value: cc.assignmentBuckets.graded.length },
  ];
  const quickLinks = [
    { href: '/dashboard/my-learning', icon: BookOpen, label: 'My Learning' },
    { href: '/dashboard/assignments', icon: ClipboardList, label: 'Assignments' },
    { href: '/dashboard/calendar', icon: CalendarDays, label: 'Calendar' },
    { href: '/dashboard/todos', icon: CheckSquare, label: 'Tasks' },
    { href: '/dashboard/tutor', icon: Bot, label: 'AI Tutor' },
    ...(isStudent ? [{ href: '/dashboard/fees', icon: Wallet, label: 'Fees' }] : []),
    ...(staffPost ? [{ href: '/dashboard/staff', icon: Briefcase, label: 'Staff' }] : []),
  ];
  const subtitle = isStudent
    ? [membership.program || 'Student', membership.year ? `Year ${membership.year}` : '', membership.matricule || '']
        .filter(Boolean)
        .join(' · ')
    : interests.join(' · ');

  return (
    <div className="mx-auto max-w-[1180px] overflow-x-hidden">
      {/* ── Welcome banner ────────────────────────────────────── */}
      <section className="relative grid overflow-hidden rounded-[20px] border border-[#e7e9ec] bg-white md:grid-cols-[1.3fr_1fr]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 opacity-70 md:block"
          style={{
            backgroundImage: 'radial-gradient(#e7e9ec 1px, transparent 1px)',
            backgroundSize: '18px 18px',
            maskImage: 'linear-gradient(to left, #000 40%, transparent)',
            WebkitMaskImage: 'linear-gradient(to left, #000 40%, transparent)',
          }}
        />
        <div className="relative z-10 p-6 sm:p-8">
          <p className="inline-flex items-center gap-2 text-[13.5px] font-medium text-[#4b5563]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--green)]" />
            {greeting()}
          </p>
          <h1 className="mt-2 text-[32px] leading-tight sm:text-[42px]">Hi, {name}</h1>
          <p className="mt-2 max-w-[440px] text-[15.5px] text-[#4b5563]">
            {subtitle || 'What would you like to learn today?'}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={cc.continueLearning[0]?.href || '/dashboard/courses'}
              className="btn btn-primary !px-5"
            >
              {cc.continueLearning.length ? 'Continue learning' : 'Get started'} <ArrowRight size={16} />
            </Link>
            <Link href="/programmes" className="btn btn-ghost !px-5">
              Explore programmes
            </Link>
          </div>
        </div>
        <div className="relative hidden items-end justify-center md:flex">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/doodles/readingside.svg" alt="" className="relative h-[210px] w-auto select-none pb-3" />
        </div>
      </section>

      {/* Quick links */}
      <nav className="no-scrollbar -mx-3 mt-4 flex gap-2 overflow-x-auto px-3 sm:mx-0 sm:flex-wrap sm:px-0" aria-label="Quick links">
        {quickLinks.map((q) => (
          <Link
            key={q.href}
            href={q.href}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#e7e9ec] bg-white px-4 py-2 text-[13.5px] font-medium text-[var(--ink)] transition-colors hover:border-[rgba(0,179,105,0.5)]"
          >
            <q.icon size={15} /> {q.label}
          </Link>
        ))}
      </nav>

      {/* Stats */}
      <section className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center gap-3.5 rounded-[20px] border border-[#e7e9ec] bg-white p-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#e7e9ec] bg-[#effaf4] text-[var(--green-deep)]">
              <s.icon size={19} strokeWidth={1.75} />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[22px] font-medium leading-none tracking-[-0.03em]">{s.value}</p>
              <p className="mt-1 truncate text-[12.5px] text-[#4b5563]">{s.label}</p>
            </div>
          </div>
        ))}
      </section>

      {!isStudent ? (
        <div className="mt-6">
          <BecomeStudentBanner institutionName={org.name} compact />
        </div>
      ) : null}

      {!isStudent && application && application.status !== 'draft' ? (
        <Link
          href="/dashboard/application"
          className="mt-6 flex items-center justify-between rounded-3xl bg-white p-5 transition-shadow hover:shadow-[0_14px_34px_-24px_rgba(18,50,79,0.5)]"
        >
          <div>
            <p className="font-bold text-[var(--navy)]">Application {application.applicationCode}</p>
            <p className="mt-0.5 text-[13px] capitalize text-[var(--ink-soft)]">
              {application.programName || 'Program'} · {application.status.replace(/_/g, ' ')}
            </p>
          </div>
          <ArrowRight size={16} className="text-[var(--navy)]" />
        </Link>
      ) : null}

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-9">
          {/* ── My courses ──────────────────────────────────── */}
          <section>
            <SectionTitle title="My courses" href="/dashboard/my-learning" linkLabel="See all" />
            {cc.continueLearning.length === 0 ? (
              <div className="grid items-center gap-4 overflow-hidden rounded-3xl bg-white sm:grid-cols-[1fr_220px]">
                <div className="p-6">
                  <p className="text-[17px] font-bold text-[var(--navy)]">No courses in progress yet</p>
                  <p className="mt-1 text-[14px] text-[var(--ink-soft)]">
                    Pick a programme or a self-paced course to get started.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link href="/programmes" className="btn btn-primary">
                      Explore programmes
                    </Link>
                    <Link href="/dashboard/courses" className="btn btn-soft">
                      Browse courses
                    </Link>
                  </div>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/doodles/sittingreading.svg" alt="" className="hidden h-40 w-auto justify-self-center sm:block" />
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {cc.continueLearning.map((row, i) => {
                  const pct = Math.min(100, Math.max(0, Math.round(row.course.pct)));
                  return (
                    <Link
                      key={row.course.id}
                      href={row.href}
                      className="group flex flex-col rounded-3xl bg-white p-4 transition-shadow hover:shadow-[0_18px_40px_-26px_rgba(18,50,79,0.55)]"
                    >
                      <div className="relative flex h-28 items-center justify-center overflow-hidden rounded-xl border border-[#e7e9ec] bg-[#fafbfa]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`/doodles/${COURSE_DOODLES[i % COURSE_DOODLES.length]}.svg`} alt="" className="h-24 w-auto select-none" />
                      </div>
                      <p className="mt-4 line-clamp-2 text-[15.5px] font-bold leading-snug text-[var(--navy)]">{row.course.title}</p>
                      <div className="mt-auto pt-4">
                        <div className="flex items-center justify-between text-[12.5px]">
                          <span className="text-[var(--ink-soft)]">Progress</span>
                          <span className="font-bold text-[var(--green-deep)]">{pct}%</span>
                        </div>
                        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[var(--paper-dim)]">
                          <div className="h-full rounded-full bg-[var(--green)]" style={{ width: `${pct}%` }} />
                        </div>
                        {row.nextTitle ? (
                          <p className="mt-3 truncate text-[12.5px] text-[var(--navy)]/70">
                            Next: <span className="font-semibold">{row.nextTitle}</span>
                          </p>
                        ) : null}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>

          {/* ── Needs attention: colourful task cards ─────────── */}
          {cc.attention.length > 0 ? (
            <section>
              <SectionTitle title="Needs your attention" />
              <div className="grid gap-4 sm:grid-cols-2">
                {cc.attention.map((a) => {
                  const urgent = a.severity === 'high';
                  return (
                    <Link
                      key={a.id}
                      href={a.href}
                      className={`group flex min-h-[150px] flex-col rounded-[20px] border bg-white p-5 transition-colors ${
                        urgent ? 'border-[#f3c3c4]' : 'border-[#e7e9ec] hover:border-[rgba(0,179,105,0.5)]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-[16px] font-medium leading-snug">{a.title}</p>
                        {a.severity === 'high' ? (
                          <span className="shrink-0 rounded-full bg-[#ff7a59] px-2.5 py-0.5 text-[11.5px] font-bold text-white">Urgent</span>
                        ) : null}
                      </div>
                      <p className="mt-1.5 line-clamp-2 text-[13.5px] text-[#4b5563]">{a.detail}</p>
                      <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[13.5px] font-medium text-[var(--green-deep)]">
                        Open <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          ) : null}

          {cc.recommended.length > 0 ? (
            <section>
              <SectionTitle title={interests.length ? 'Recommended for you' : 'Explore'} href="/dashboard/courses" linkLabel="Courses" />
              <div className="grid gap-3 sm:grid-cols-2">
                {cc.recommended.map((r) => (
                  <Link
                    key={r.slug}
                    href={r.href}
                    className="group flex items-center gap-3 rounded-2xl bg-white p-4 transition-colors hover:border-[rgba(0,179,105,0.5)]"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#e7e9ec] bg-[#effaf4] text-[var(--green-deep)]">
                      <BookOpen size={17} />
                    </span>
                    <p className="min-w-0 flex-1 truncate font-medium">{r.title}</p>
                    <ArrowRight size={15} className="shrink-0 text-[var(--navy)] transition-transform group-hover:translate-x-0.5" />
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          <InstitutionForms forms={forms} />
        </div>

        {/* ── Right column ────────────────────────────────────── */}
        <aside className="min-w-0 space-y-8">
          <section>
            <SectionTitle title="Today" href="/dashboard/calendar" linkLabel="Calendar" />
            {cc.today.length === 0 ? (
              <div className="rounded-3xl bg-white p-5">
                <p className="text-[14px] text-[var(--ink-soft)]">Nothing scheduled today.</p>
                <Link href="/dashboard/todos" className="mt-3 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-[var(--green-deep)]">
                  <CheckSquare size={14} /> Add a task
                </Link>
              </div>
            ) : (
              <ul className="space-y-3">
                {cc.today.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-4 rounded-2xl border border-[#e7e9ec] bg-white py-3.5 pl-4 pr-3"
                      style={{ boxShadow: `inset 3px 0 0 ${item.urgency === 'now' ? '#e5484d' : 'var(--green)'}` }}
                    >
                      <div className="w-14 shrink-0 text-[14px] font-bold text-[var(--navy)]">{item.timeLabel}</div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14px] font-semibold text-[var(--navy)]">{item.title}</p>
                        <p className="truncate text-[12.5px] text-[var(--navy)]/65">{item.subtitle}</p>
                      </div>
                      <span
                        className="shrink-0 rounded-full px-2.5 py-1 text-[11.5px] font-bold text-white"
                        style={{ background: item.urgency === 'now' ? '#e5484d' : 'var(--green-deep)' }}
                      >
                        {item.actionLabel}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <SectionTitle title="Assignments" href="/dashboard/assignments" linkLabel="Open" />
            <div className="grid grid-cols-2 gap-3">
              {assignmentStats.map((a, i) => (
                <div key={a.label} className="rounded-2xl bg-white p-4">
                  <p
                    className="text-[26px] font-medium leading-none tracking-[-0.03em]"
                    style={{ color: a.alert && a.value > 0 ? '#e5484d' : 'var(--navy)' }}
                  >
                    {a.value}
                  </p>
                  <p className="mt-1.5 flex items-center gap-1.5 text-[12.5px] text-[var(--ink-soft)]">
                    <span className="h-2 w-2 rounded-full" style={{ background: DOTS[i % DOTS.length] }} />
                    {a.label}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <SectionTitle title="Announcements" href="/dashboard/announcements" linkLabel="All" />
            {visibleAnnouncements.length > 0 ? (
              <ul className="space-y-3">
                {visibleAnnouncements.slice(0, 2).map((item) => (
                  <li key={item.id}>
                    <AnnouncementCard item={item} compact />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex items-center gap-3 rounded-2xl bg-white p-4 text-[14px] text-[var(--ink-soft)]">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--pastel-butter)] text-[var(--navy)]">
                  <Megaphone size={16} />
                </span>
                No announcements yet.
              </div>
            )}
          </section>

          {recentNotes.length > 0 ? (
            <section>
              <SectionTitle title="Reminders" href="/dashboard/notifications" linkLabel="All" />
              <ul className="space-y-2.5">
                {recentNotes.map((n) => (
                  <li key={n.id}>
                    <Link
                      href={n.href || '/dashboard/notifications'}
                      className="flex items-start gap-3 rounded-2xl bg-white p-3.5"
                    >
                      <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[var(--navy)]"
                        style={{ background: n.readAt ? 'var(--paper-dim)' : 'var(--pastel-sky)' }}
                      >
                        <Bell size={15} />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[14px] font-semibold text-[var(--navy)]">{n.title}</span>
                        <span className="mt-0.5 line-clamp-2 block text-[12.5px] text-[var(--ink-soft)]">{n.body}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {/* Help card */}
          <Link
            href="/dashboard/tutor"
            className="block overflow-hidden rounded-[20px] border border-[rgba(0,179,105,0.45)] bg-[#f3fbf7] p-5 transition-colors hover:border-[var(--green)]"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#e7e9ec] bg-white text-[var(--green-deep)]">
                <Sparkles size={19} />
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/doodles/coffee.svg" alt="" className="h-20 w-auto select-none" />
            </div>
            <p className="mt-3 text-[17px] font-medium">Need a hand?</p>
            <p className="mt-1 text-[13.5px] text-[#4b5563]">Ask the AI Tutor about any lesson, exercise or career question.</p>
            <span className="btn btn-primary mt-4 !px-4 !py-2 text-[13.5px]">
              Open AI Tutor <ArrowRight size={14} />
            </span>
          </Link>
        </aside>
      </div>
    </div>
  );
}

function SectionTitle({ title, href, linkLabel }: { title: string; href?: string; linkLabel?: string }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-[21px] leading-tight">{title}</h2>
      {href ? (
        <Link href={href} className="inline-flex items-center gap-1 text-[13.5px] font-semibold text-[var(--green-deep)]">
          {linkLabel} <ArrowRight size={13} />
        </Link>
      ) : null}
    </div>
  );
}
