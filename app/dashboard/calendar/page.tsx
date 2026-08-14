import Link from 'next/link';
import { redirect } from 'next/navigation';
import { CalendarDays, ClipboardList, Radio } from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import { getStudentAgenda } from '@/lib/learn/studentAgenda';

export const dynamic = 'force-dynamic';

function dayKey(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default async function StudentCalendarPage() {
  const session = getSessionUser();
  if (!session) redirect('/login?next=/dashboard/calendar');

  const { events } = await getStudentAgenda(session.uid);

  const byDay = new Map<string, typeof events>();
  for (const e of events) {
    const key = dayKey(e.startsAt);
    const list = byDay.get(key) || [];
    list.push(e);
    byDay.set(key, list);
  }

  return (
    <div className="mx-auto max-w-[920px]">
      <header className="mb-8 border-b pb-6" style={{ borderColor: 'var(--line)' }}>
        <div className="tab mb-2 inline-flex items-center gap-1.5">
          <CalendarDays size={11} /> Calendar
        </div>
        <h1 className="font-display text-[30px] leading-tight">My calendar</h1>
        <p className="mt-2 max-w-[620px] text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
          Assignment deadlines, live classes, and recent class holdings in one place.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-[13px] font-semibold">
          <Link href="/dashboard/todos" style={{ color: 'var(--green-deep)' }}>
            Open to-do list →
          </Link>
          <Link href="/dashboard/classroom" style={{ color: 'var(--ink-soft)' }}>
            My Classroom
          </Link>
          <Link href="/dashboard/assignments" style={{ color: 'var(--ink-soft)' }}>
            Assignments
          </Link>
        </div>
      </header>

      {events.length === 0 ? (
        <div
          className="rounded-2xl border border-dashed p-10 text-center"
          style={{ borderColor: 'var(--line)' }}
        >
          <CalendarDays size={28} style={{ color: 'var(--ink-soft)' }} />
          <p className="mt-3 font-display text-[20px]">Nothing scheduled yet</p>
          <p className="mt-1 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
            When instructors publish assignments or start live classes, they show up here.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Array.from(byDay.entries()).map(([day, dayEvents]) => (
            <section key={day}>
              <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: 'var(--ink-soft)' }}>
                {day}
              </h2>
              <ul className="space-y-2">
                {dayEvents.map((e) => (
                  <li key={e.id}>
                    <Link
                      href={e.href}
                      className="flex items-start gap-3 border p-4 transition-shadow hover:shadow-card"
                      style={{ borderColor: 'var(--line)' }}
                    >
                      <span
                        className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center"
                        style={{
                          background:
                            e.kind === 'live_class'
                              ? 'rgba(220,38,38,0.1)'
                              : 'rgba(0,179,105,0.1)',
                          color: e.kind === 'live_class' ? '#b91c1c' : 'var(--green-deep)',
                        }}
                      >
                        {e.kind === 'live_class' ? <Radio size={16} /> : <ClipboardList size={16} />}
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold">{e.title}</p>
                        <p className="mt-0.5 text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
                          {new Date(e.startsAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                          {e.meta ? ` · ${e.meta}` : ''}
                          {e.status === 'overdue' ? ' · Overdue' : ''}
                          {e.status === 'live' ? ' · Live now' : ''}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
