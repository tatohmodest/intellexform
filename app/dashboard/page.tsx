import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  ArrowRight,
  Bell,
  BookOpen,
  Bot,
  CheckSquare,
  ClipboardList,
  Flame,
  Megaphone,
  Sparkles,
  Trophy,
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
          {isStudent ? (
            <>
              {membership.program || 'Student'}
              {membership.year ? ` · Year ${membership.year}` : ''}
              {membership.matricule ? ` · ${membership.matricule}` : ''}
            </>
          ) : interests.length ? (
            <>Based on your interests: {interests.join(' · ')}</>
          ) : (
            <>Explore {org.name} — learn, book services, and join the public community.</>
          )}
        </p>
        <div className="mt-5 flex flex-wrap gap-2 text-[12.5px] font-semibold">
          <Link
            href="/dashboard/announcements"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-white"
            style={{ background: 'var(--green)' }}
          >
            <Megaphone size={13} /> Announcements
          </Link>
          <Link href="/dashboard/calendar" className="border px-3 py-1.5" style={{ borderColor: 'var(--line)' }}>
            Calendar
          </Link>
          <Link href="/dashboard/assignments" className="border px-3 py-1.5" style={{ borderColor: 'var(--line)' }}>
            Assignments
          </Link>
          <Link href="/dashboard/my-learning" className="border px-3 py-1.5" style={{ borderColor: 'var(--line)' }}>
            My Learning
          </Link>
          <Link href="/dashboard/community" className="border px-3 py-1.5" style={{ borderColor: 'var(--line)' }}>
            Community
          </Link>
          <Link href="/dashboard/notifications" className="border px-3 py-1.5" style={{ borderColor: 'var(--line)' }}>
            Notifications
          </Link>
          {isStudent ? (
            <Link href="/dashboard/fees" className="border px-3 py-1.5" style={{ borderColor: 'var(--line)' }}>
              School fees
            </Link>
          ) : (
            <Link href="/dashboard/apply" className="border px-3 py-1.5" style={{ borderColor: 'var(--line)' }}>
              Become a student
            </Link>
          )}
          {staffPost ? (
            <Link href="/dashboard/staff" className="border px-3 py-1.5" style={{ borderColor: 'var(--line)' }}>
              Staff
            </Link>
          ) : null}
        </div>
      </header>

      {!isStudent ? <BecomeStudentBanner institutionName={org.name} /> : null}

      {visibleAnnouncements.length > 0 ? (
        <section className="mb-10">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--green-deep)' }}>
                From {org.name}
              </p>
              <h2 className="font-display text-[22px]">Announcements</h2>
            </div>
            <Link
              href="/dashboard/announcements"
              className="inline-flex items-center gap-1.5 border px-3 py-1.5 text-[13px] font-semibold"
              style={{ borderColor: 'var(--line)', color: 'var(--green-deep)' }}
            >
              All announcements
            </Link>
          </div>
          <ul className="space-y-3">
            {visibleAnnouncements.slice(0, 3).map((item) => (
              <li key={item.id}>
                <AnnouncementCard item={item} compact />
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section
          className="mb-10 border p-5"
          style={{ borderColor: 'rgba(0,179,105,0.28)', background: 'rgba(0,179,105,0.05)' }}
        >
          <p className="inline-flex items-center gap-2 font-semibold">
            <Megaphone size={16} style={{ color: 'var(--green-deep)' }} /> Announcements
          </p>
          <p className="mt-1 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
            Public and institution notices from {org.name} show up here after staff publish them.
          </p>
          <Link
            href="/dashboard/announcements"
            className="mt-3 inline-flex items-center border px-3 py-1.5 text-[13px] font-semibold"
            style={{ borderColor: 'var(--line)', color: 'var(--green-deep)' }}
          >
            Open announcements
          </Link>
        </section>
      )}

      {recentNotes.length > 0 ? (
        <section className="mb-10">
          <div className="mb-4 flex items-end justify-between gap-3">
            <h2 className="font-display text-[22px]">Recent activity</h2>
            <Link
              href="/dashboard/notifications"
              className="inline-flex items-center gap-1.5 border px-3 py-1.5 text-[13px] font-semibold"
              style={{ borderColor: 'var(--line)', color: 'var(--blue-ink)' }}
            >
              <Bell size={13} /> Notifications
            </Link>
          </div>
          <ul className="divide-y border" style={{ borderColor: 'var(--line)' }}>
            {recentNotes.map((n) => (
              <li key={n.id}>
                <Link
                  href={n.href || '/dashboard/notifications'}
                  className="flex items-start justify-between gap-3 px-4 py-3"
                  style={{ background: n.readAt ? 'transparent' : 'var(--amber-soft)' }}
                >
                  <span>
                    <span className="block font-semibold">{n.title}</span>
                    <span className="mt-0.5 block text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                      {n.body}
                    </span>
                  </span>
                  <ArrowRight size={14} className="mt-1 shrink-0" style={{ color: 'var(--ink-soft)' }} />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <InstitutionForms forms={forms} />
      {!isStudent && application && application.status !== 'draft' ? (
        <Link
          href="/dashboard/application"
          className="mb-8 flex items-center justify-between border p-4"
          style={{ borderColor: 'var(--line)' }}
        >
          <div>
            <p className="font-semibold">My application {application.applicationCode}</p>
            <p className="mt-0.5 text-[13px] capitalize" style={{ color: 'var(--ink-soft)' }}>
              {application.programName || 'Program'} · {application.status.replace(/_/g, ' ')}
            </p>
          </div>
          <ArrowRight size={16} style={{ color: 'var(--ink-soft)' }} />
        </Link>
      ) : null}

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
          <Link
            href="/dashboard/calendar"
            className="inline-flex items-center border px-3 py-1.5 text-[13px] font-semibold"
            style={{ borderColor: 'var(--line)', color: 'var(--green-deep)' }}
          >
            Full calendar
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
          <Link
            href="/dashboard/my-learning"
            className="inline-flex items-center border px-3 py-1.5 text-[13px] font-semibold"
            style={{ borderColor: 'var(--line)', color: 'var(--green-deep)' }}
          >
            My Learning
          </Link>
        </div>
        {cc.continueLearning.length === 0 ? (
          <div className="border border-dashed p-6" style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}>
            Enroll in a course to see continue cards here.{' '}
            <Link
              href="/dashboard/courses"
              className="inline-flex items-center border px-2.5 py-1 font-semibold"
              style={{ borderColor: 'var(--line)', color: 'var(--green-deep)' }}
            >
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
                    <span
                      className="inline-flex shrink-0 items-center border px-3 py-1.5 text-[13px] font-semibold"
                      style={{ borderColor: 'var(--line)', color: 'var(--green-deep)' }}
                    >
                      Continue
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
            <Link
              href="/dashboard/assignments"
              className="inline-flex items-center border px-3 py-1.5 text-[12.5px] font-semibold"
              style={{ borderColor: 'var(--line)', color: 'var(--green-deep)' }}
            >
              Center
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
          <div className="flex flex-col gap-2">
            <Link
              href="/dashboard/announcements"
              className="inline-flex items-center gap-2 px-3 py-2 text-[13.5px] font-semibold text-white"
              style={{ background: 'var(--green)' }}
            >
              <Megaphone size={15} /> Announcements
            </Link>
            <Link
              href="/dashboard/todos"
              className="inline-flex items-center gap-2 border px-3 py-2 text-[13.5px] font-semibold"
              style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
            >
              <CheckSquare size={15} /> My tasks
            </Link>
            <Link
              href="/dashboard/assignments"
              className="inline-flex items-center gap-2 border px-3 py-2 text-[13.5px] font-semibold"
              style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
            >
              <ClipboardList size={15} /> Assignment center
            </Link>
            <Link
              href="/dashboard/achievements"
              className="inline-flex items-center gap-2 border px-3 py-2 text-[13.5px] font-semibold"
              style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
            >
              <Trophy size={15} /> Achievements
            </Link>
            <Link
              href="/dashboard/tutor"
              className="inline-flex items-center gap-2 border px-3 py-2 text-[13.5px] font-semibold"
              style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
            >
              <Bot size={15} /> Ask AI Tutor
            </Link>
            <Link
              href="/dashboard/courses"
              className="inline-flex items-center gap-2 border px-3 py-2 text-[13.5px] font-semibold"
              style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
            >
              <Sparkles size={15} /> Explore courses
            </Link>
          </div>
        </div>
      </section>

      {cc.recommended.length > 0 ? (
        <section className="mb-8">
          <h2 className="mb-4 font-display text-[22px]">
            {interests.length ? 'Recommended for you' : 'Explore'}
          </h2>
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
