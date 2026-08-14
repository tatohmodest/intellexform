import Link from 'next/link';
import { redirect } from 'next/navigation';
import { CalendarDays } from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import { getStudentCommandCenter } from '@/lib/learn/commandCenter';
import { getStudentAgenda } from '@/lib/learn/studentAgenda';
import AcademicCalendar from '@/components/dashboard/AcademicCalendar';

export const dynamic = 'force-dynamic';

export default async function StudentCalendarPage() {
  const session = getSessionUser();
  if (!session) redirect('/login?next=/dashboard/calendar');

  const [cc, agenda] = await Promise.all([
    getStudentCommandCenter(session.uid),
    getStudentAgenda(session.uid),
  ]);

  // Merge mentorship / today items into calendar events.
  const events = [...agenda.events];
  for (const item of cc.today) {
    if (item.kind === 'mentorship' || item.kind === 'personal') {
      if (!events.some((e) => e.id === item.id)) {
        events.push({
          id: item.id,
          title: item.title,
          kind: 'course',
          startsAt: new Date().toISOString(),
          href: item.href,
          meta: item.subtitle,
          status: item.urgency,
        });
      }
    }
  }

  return (
    <div className="mx-auto max-w-[960px]">
      <header className="mb-8 border-b pb-6" style={{ borderColor: 'var(--line)' }}>
        <div className="tab mb-2 inline-flex items-center gap-1.5">
          <CalendarDays size={11} /> Calendar
        </div>
        <h1 className="font-display text-[30px] leading-tight">Academic calendar</h1>
        <p className="mt-2 max-w-[620px] text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
          Classes, live sessions, assignment deadlines, and mentorship — day, week, and month.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-[13px] font-semibold">
          <Link href="/dashboard/todos" style={{ color: 'var(--green-deep)' }}>
            Tasks →
          </Link>
          <Link href="/dashboard/assignments" style={{ color: 'var(--ink-soft)' }}>
            Assignments
          </Link>
          <Link href="/dashboard/classroom" style={{ color: 'var(--ink-soft)' }}>
            Classroom
          </Link>
        </div>
      </header>

      <AcademicCalendar events={JSON.parse(JSON.stringify(events))} />
    </div>
  );
}
