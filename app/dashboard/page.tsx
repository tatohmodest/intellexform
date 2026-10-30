import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  ArrowRight,
  Bell,
  BookOpen,
  Bot,
  Briefcase,
  CalendarDays,
  CheckSquare,
  ClipboardList,
  Flame,
  Megaphone,
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
import PageHeader from '@/components/dashboard/PageHeader';
import { listFillableDatasetsForUser } from '@/lib/staff/dataWorkspace';
import { listVisibleAnnouncements } from '@/lib/staff/store';
import { listNotifications } from '@/lib/learn/notifications';

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
    { icon: Zap, label: 'XP', value: cc.stats.xp.toLocaleString() },
    { icon: BookOpen, label: 'This week', value: `${cc.stats.weeklyHours}h / ${cc.stats.weeklyGoalHours}h` },
    { icon: Trophy, label: 'Lessons done', value: String(cc.stats.lessonsDone) },
  ];
  const assignmentStats = [
    { label: 'Due today', value: cc.assignmentBuckets.due_today.length },
    { label: 'This week', value: cc.assignmentBuckets.due_week.length },
    { label: 'Overdue', value: cc.assignmentBuckets.overdue.length, alert: true },
    { label: 'Graded', value: cc.assignmentBuckets.graded.length },
  ];

  return (
    <div className="mx-auto max-w-[1080px] overflow-x-hidden">
      <PageHeader
        title={`${greeting()}, ${name}.`}
        description={
          isStudent ? (
            <>
              {membership.program || 'Student'}
              {membership.year ? ` · Year ${membership.year}` : ''}
              {membership.matricule ? ` · ${membership.matricule}` : ''}
            </>
          ) : interests.length ? (
            interests.join(' · ')
          ) : null
        }
      >
        <div className="no-scrollbar -mx-4 mt-5 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          <Link href="/dashboard/my-learning" className="chip chip-primary">
            <BookOpen size={14} /> My Learning
          </Link>
          <Link href="/dashboard/assignments" className="chip">
            <ClipboardList size={14} /> Assignments
          </Link>
          <Link href="/dashboard/calendar" className="chip">
            <CalendarDays size={14} /> Calendar
          </Link>
          <Link href="/dashboard/todos" className="chip">
            <CheckSquare size={14} /> Tasks
          </Link>
          <Link href="/dashboard/tutor" className="chip">
            <Bot size={14} /> AI Tutor
          </Link>
          {isStudent ? (
            <Link href="/dashboard/fees" className="chip">
              <Wallet size={14} /> Fees
            </Link>
          ) : null}
          {staffPost ? (
            <Link href="/dashboard/staff" className="chip">
              <Briefcase size={14} /> Staff
            </Link>
          ) : null}
        </div>
      </PageHeader>

      <section className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card flex items-center gap-3 p-4">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
              style={{ background: 'rgba(0,179,105,0.10)', color: 'var(--green-deep)' }}
            >
              <s.icon size={17} />
            </span>
            <div className="min-w-0">
              <p className="truncate font-display text-[20px] leading-none">{s.value}</p>
              <p className="muted mt-1 truncate text-[12px]">{s.label}</p>
            </div>
          </div>
        ))}
      </section>

      {!isStudent ? <BecomeStudentBanner institutionName={org.name} compact /> : null}

      {cc.attention.length > 0 ? (
        <section className="mb-8">
          <SectionTitle title="Needs attention" />
          <ul className="space-y-2">
            {cc.attention.map((a) => (
              <li key={a.id}>
                <Link
                  href={a.href}
                  className="card flex items-center justify-between gap-4 p-4"
                  style={
                    a.severity === 'high'
                      ? { borderColor: 'rgba(185,28,28,0.35)', background: 'rgba(185,28,28,0.04)' }
                      : undefined
                  }
                >
                  <div className="min-w-0">
                    <p className="font-semibold">{a.title}</p>
                    <p className="muted mt-0.5 truncate text-[13px]">{a.detail}</p>
                  </div>
                  <ArrowRight size={16} className="muted shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {!isStudent && application && application.status !== 'draft' ? (
        <Link href="/dashboard/application" className="card mb-8 flex items-center justify-between p-4">
          <div>
            <p className="font-semibold">Application {application.applicationCode}</p>
            <p className="muted mt-0.5 text-[13px] capitalize">
              {application.programName || 'Program'} · {application.status.replace(/_/g, ' ')}
            </p>
          </div>
          <ArrowRight size={16} className="muted" />
        </Link>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-8">
          <section>
            <SectionTitle title="Today" href="/dashboard/calendar" linkLabel="Calendar" />
            {cc.today.length === 0 ? (
              <div className="card flex flex-wrap items-center justify-between gap-3 p-5">
                <p className="muted text-[14px]">Nothing scheduled today.</p>
                <Link href="/dashboard/todos" className="chip">
                  <CheckSquare size={14} /> Add a task
                </Link>
              </div>
            ) : (
              <ul className="card divide-y overflow-hidden" style={{ borderColor: 'var(--line)' }}>
                {cc.today.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center gap-4 px-4 py-3.5"
                    style={{ borderColor: 'var(--line)' }}
                  >
                    <div className="muted w-14 shrink-0 font-mono text-[12px]">{item.timeLabel}</div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{item.title}</p>
                      <p className="muted truncate text-[13px]">{item.subtitle}</p>
                    </div>
                    <Link
                      href={item.href}
                      className="chip shrink-0 text-white"
                      style={{
                        background: item.urgency === 'now' ? '#b91c1c' : 'var(--green-deep)',
                        borderColor: 'transparent',
                      }}
                    >
                      {item.actionLabel}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <SectionTitle title="Continue learning" href="/dashboard/my-learning" linkLabel="All" />
            {cc.continueLearning.length === 0 ? (
              <div className="card flex flex-wrap items-center justify-between gap-3 p-5">
                <p className="muted text-[14px]">No courses in progress.</p>
                <Link href="/dashboard/courses" className="chip chip-primary">
                  Browse courses
                </Link>
              </div>
            ) : (
              <ul className="space-y-3">
                {cc.continueLearning.map((row) => {
                  const pct = Math.min(100, Math.max(0, row.course.pct));
                  return (
                    <li key={row.course.id}>
                      <Link href={row.href} className="card block p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate font-semibold">{row.course.title}</p>
                            <p className="muted mt-0.5 truncate text-[13px]">{row.nextTitle}</p>
                          </div>
                          <span className="font-mono text-[12px]" style={{ color: 'var(--green-deep)' }}>
                            {Math.round(pct)}%
                          </span>
                        </div>
                        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full" style={{ background: 'var(--paper-dim)' }}>
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'var(--green)' }} />
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {cc.recommended.length > 0 ? (
            <section>
              <SectionTitle
                title={interests.length ? 'Recommended' : 'Explore'}
                href="/dashboard/courses"
                linkLabel="Courses"
              />
              <div className="grid gap-3 sm:grid-cols-2">
                {cc.recommended.map((r) => (
                  <Link key={r.slug} href={r.href} className="card group flex items-center justify-between gap-3 p-4">
                    <p className="min-w-0 truncate font-semibold">{r.title}</p>
                    <ArrowRight size={15} className="shrink-0 transition-transform group-hover:translate-x-0.5" style={{ color: 'var(--green-deep)' }} />
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          <InstitutionForms forms={forms} />
        </div>

        <aside className="min-w-0 space-y-8">
          <section>
            <SectionTitle title="Assignments" href="/dashboard/assignments" linkLabel="Open" />
            <div className="card grid grid-cols-2 gap-px overflow-hidden" style={{ background: 'var(--line)' }}>
              {assignmentStats.map((a) => (
                <div key={a.label} className="bg-paper p-4">
                  <p
                    className="font-display text-[22px] leading-none"
                    style={a.alert && a.value > 0 ? { color: '#b91c1c' } : undefined}
                  >
                    {a.value}
                  </p>
                  <p className="muted mt-1.5 text-[12px]">{a.label}</p>
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
              <div className="card muted flex items-center gap-2.5 p-4 text-[14px]">
                <Megaphone size={15} style={{ color: 'var(--green-deep)' }} /> No announcements yet.
              </div>
            )}
          </section>

          {recentNotes.length > 0 ? (
            <section>
              <SectionTitle title="Activity" href="/dashboard/notifications" linkLabel="All" />
              <ul className="card divide-y overflow-hidden">
                {recentNotes.map((n) => (
                  <li key={n.id} style={{ borderColor: 'var(--line)' }}>
                    <Link
                      href={n.href || '/dashboard/notifications'}
                      className="flex items-start gap-2.5 px-4 py-3"
                      style={{ background: n.readAt ? 'transparent' : 'var(--amber-soft)' }}
                    >
                      <Bell size={14} className="muted mt-1 shrink-0" />
                      <span className="min-w-0">
                        <span className="block truncate text-[14px] font-semibold">{n.title}</span>
                        <span className="muted mt-0.5 line-clamp-2 block text-[12.5px]">{n.body}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </aside>
      </div>
    </div>
  );
}

function SectionTitle({ title, href, linkLabel }: { title: string; href?: string; linkLabel?: string }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="font-display text-[19px] leading-tight">{title}</h2>
      {href ? (
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-[13px] font-semibold"
          style={{ color: 'var(--green-deep)' }}
        >
          {linkLabel} <ArrowRight size={13} />
        </Link>
      ) : null}
    </div>
  );
}
