import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/getUser';
import { getStudentCommandCenter } from '@/lib/learn/commandCenter';
import { getStudentAgenda } from '@/lib/learn/studentAgenda';
import { getInteractiveCalendarPayload } from '@/lib/learn/calendarEvents';
import { getMentorProfile, listInstructorStudentGroups } from '@/lib/learn/ecosystem';
import InteractiveCalendar, {
  type InteractiveCalendarEvent,
} from '@/components/dashboard/InteractiveCalendar';
import MentorSchedulesPanel from '@/components/dashboard/MentorSchedulesPanel';
import PageHeader from '@/components/dashboard/PageHeader';

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
      <PageHeader
        title="Calendar"
        description="Click a day to add an event."
        actions={
          <>
            <Link href="/dashboard/todos" className="chip">
              Tasks
            </Link>
            {mentorProfile ? (
              <Link href="/dashboard/students" className="chip">
                My students
              </Link>
            ) : null}
          </>
        }
      />

      {mentorProfile && mentorStudentOptions.length > 0 ? (
        <div className="mb-8">
          <MentorSchedulesPanel students={mentorStudentOptions} />
        </div>
      ) : null}

      <InteractiveCalendar events={payload} />
    </div>
  );
}
