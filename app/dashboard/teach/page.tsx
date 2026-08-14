import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowRight, GraduationCap } from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import { getRoles } from '@/lib/learn/ecosystem';
import { getInstructorCommandCenter } from '@/lib/learn/commandCenter';

export const dynamic = 'force-dynamic';

export default async function TeachHomePage() {
  const session = getSessionUser();
  if (!session) redirect('/login?next=/dashboard/teach');

  const roles = await getRoles(session.uid);
  if (!roles.includes('mentor') && !roles.includes('admin')) {
    redirect('/dashboard/mentor');
  }

  const cc = await getInstructorCommandCenter(session.uid);
  const name = session.name.split(/\s+/)[0] || 'Instructor';

  return (
    <div className="mx-auto max-w-[1000px]">
      <header className="mb-8 border-b pb-6" style={{ borderColor: 'var(--line)' }}>
        <div className="tab mb-2 inline-flex items-center gap-1.5">
          <GraduationCap size={11} /> Teaching
        </div>
        <h1 className="font-display text-[32px] leading-tight">Good day, {name}.</h1>
        <p className="mt-2 text-[15px]" style={{ color: 'var(--ink-soft)' }}>
          Your teaching day — classes, grading, and students who need attention.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-[12.5px] font-semibold">
          <Link href="/dashboard/teach/courses" className="border px-3 py-1.5" style={{ borderColor: 'var(--line)' }}>
            Course studio
          </Link>
          <Link href="/dashboard/teach/grading" className="border px-3 py-1.5" style={{ borderColor: 'var(--line)' }}>
            Grading center
          </Link>
          <Link href="/dashboard/teach/monitoring" className="border px-3 py-1.5" style={{ borderColor: 'var(--line)' }}>
            Monitoring
          </Link>
          <Link href="/dashboard/teach/assessments" className="border px-3 py-1.5" style={{ borderColor: 'var(--line)' }}>
            Assignments
          </Link>
          <Link href="/dashboard/classroom" className="border px-3 py-1.5" style={{ borderColor: 'var(--line)' }}>
            Classroom
          </Link>
          <Link href="/dashboard/students" className="border px-3 py-1.5" style={{ borderColor: 'var(--line)' }}>
            My students
          </Link>
          <Link href="/dashboard/messages" className="border px-3 py-1.5" style={{ borderColor: 'var(--line)' }}>
            Messages
          </Link>
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
                    borderColor: a.severity === 'high' ? 'rgba(185,28,28,0.35)' : 'var(--line)',
                  }}
                >
                  <div>
                    <p className="font-semibold">{a.title}</p>
                    <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                      {a.detail}
                    </p>
                  </div>
                  <ArrowRight size={16} className="mt-1" style={{ color: 'var(--ink-soft)' }} />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mb-10">
        <h2 className="mb-4 font-display text-[22px]">Today</h2>
        {cc.today.length === 0 ? (
          <p className="text-[14px]" style={{ color: 'var(--ink-soft)' }}>
            No live classes or grading queued for today. Open Course Studio to teach or publish.
          </p>
        ) : (
          <ul className="divide-y border" style={{ borderColor: 'var(--line)' }}>
            {cc.today.map((item) => (
              <li key={item.id} className="flex flex-wrap items-center gap-4 px-4 py-4">
                <div className="w-16 font-mono text-[12px]" style={{ color: 'var(--ink-soft)' }}>
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
                  className="px-3.5 py-2 text-[13px] font-semibold text-white"
                  style={{ background: 'var(--ink)' }}
                >
                  {item.actionLabel}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {cc.grading.length > 0 ? (
        <section className="mb-8">
          <h2 className="mb-3 font-display text-[20px]">Needs grading</h2>
          <ul className="space-y-2">
            {cc.grading.map((g) => (
              <li key={g.assessmentId}>
                <Link
                  href={`/dashboard/teach/assessments?assessment=${g.assessmentId}`}
                  className="flex justify-between border p-4"
                  style={{ borderColor: 'var(--line)' }}
                >
                  <span className="font-semibold">{g.title}</span>
                  <span className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                    {g.pendingCount} submissions
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
