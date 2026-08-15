import Link from 'next/link';
import { redirect } from 'next/navigation';
import { CalendarDays } from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import { getStudentCommandCenter } from '@/lib/learn/commandCenter';
import { getStudentAgenda } from '@/lib/learn/studentAgenda';
import { getInteractiveCalendarPayload } from '@/lib/learn/calendarEvents';
import { getMentorProfile, listInstructorStudentGroups } from '@/lib/learn/ecosystem';
import InteractiveCalendar, {
  type InteractiveCalendarEvent,
} from '@/components/dashboard/InteractiveCalendar';
import MentorSchedulesPanel from '@/components/dashboard/MentorSchedulesPanel';

export const dynamic = 'force-dynamic';

export default async function StudentCalendarPage() {
  const session = getSessionUser();
  if (!session) redirect('/login?next=/dashboard/calendar');

  const [cc, agenda, interactive, mentorProfile] = await Promise.all([
    getStudentCommandCenter(session.uid),
    getStudentAgenda(session.uid),
    getInteractiveCalendarPayload(session.uid),
    getMentorProfile(session.uid),
  ]);

  const events: InteractiveCalendarEvent[] = [];

  for (const e of agenda.events) {
    events.push({
      ...e,
      source: 'system',
      editable: false,
    });
  }

  for (const item of cc.today) {
    if (item.kind === 'mentorship' || item.kind === 'personal') {
      if (!events.some((e) => e.id === item.id)) {
        events.push({
          id: item.id,
          title: item.title,
          kind: item.kind === 'personal' ? 'personal' : 'course',
          startsAt: new Date().toISOString(),
          href: item.href,
          meta: item.subtitle,
          status: item.urgency,
          source: item.kind === 'personal' ? 'personal' : 'system',
          editable: item.kind === 'personal',
        });
      }
    }
  }

  for (const p of interactive.personal) {
    events.push({
      id: p.id,
      title: p.title,
      kind: 'personal',
      startsAt: p.startsAt,
      endsAt: p.endsAt,
      href: '/dashboard/calendar',
      meta: p.meta,
      source: 'personal',
      editable: true,
    });
  }

  for (const m of interactive.mentorEvents) {
    events.push(m);
  }

  events.sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());

  let mentorStudentOptions: { studentId: string; studentName: string }[] = [];
  if (mentorProfile) {
    const groups = await listInstructorStudentGroups(session.uid);
    const map = new Map<string, string>();
    for (const g of groups) {
      for (const s of g.students) {
        if (!map.has(s.studentId)) map.set(s.studentId, s.studentName);
      }
    }
    mentorStudentOptions = Array.from(map.entries()).map(([studentId, studentName]) => ({
      studentId,
      studentName,
    }));
  }

  const payload = JSON.parse(JSON.stringify(events)) as InteractiveCalendarEvent[];

  return (
    <div className="mx-auto max-w-[1100px]">
      <header className="mb-8 border-b pb-6" style={{ borderColor: 'var(--line)' }}>
        <div className="tab mb-2 inline-flex items-center gap-1.5">
          <CalendarDays size={11} /> Calendar
        </div>
        <h1 className="font-display text-[30px] leading-tight">Your calendar</h1>
        <p className="mt-2 max-w-[620px] text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
          Click a day or hour to add your own events — like Google Calendar. Mentor school and call
          times appear locked; only they can change those.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-[13px] font-semibold">
          <Link href="/dashboard/todos" style={{ color: 'var(--green-deep)' }}>
            Tasks →
          </Link>
          <Link href="/dashboard/assignments" style={{ color: 'var(--ink-soft)' }}>
            Assignments
          </Link>
          {mentorProfile ? (
            <Link href="/dashboard/students" style={{ color: 'var(--ink-soft)' }}>
              My students · weekly times
            </Link>
          ) : null}
        </div>
      </header>

      {mentorProfile && mentorStudentOptions.length > 0 ? (
        <div className="mb-8">
          <MentorSchedulesPanel students={mentorStudentOptions} />
        </div>
      ) : null}

      <InteractiveCalendar events={payload} />
    </div>
  );
}
