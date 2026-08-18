import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import { listClassroomForUser } from '@/lib/learn/courseClassSessions';
import ClassroomPanel from '@/components/dashboard/ClassroomPanel';

export const dynamic = 'force-dynamic';

export default async function ClassroomPage() {
  const session = getSessionUser();
  if (!session) redirect('/login?next=/dashboard/classroom');

  const data = await listClassroomForUser(session.uid);
  const payload = JSON.parse(JSON.stringify(data)) as typeof data;

  return (
    <div className="mx-auto max-w-[1080px] overflow-x-hidden">
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <Link
          href="/dashboard/courses"
          className="inline-flex items-center gap-1.5 border px-3 py-1.5 text-[13px] font-semibold"
          style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
        >
          <ArrowLeft size={14} /> My Courses
        </Link>
        <Link
          href="/dashboard/students"
          className="inline-flex items-center gap-1.5 border px-3 py-1.5 text-[13px] font-semibold"
          style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
        >
          My Students
        </Link>
      </div>

      <header className="mb-2 border-b pb-8" style={{ borderColor: 'var(--line)' }}>
        <p
          className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em]"
          style={{ color: 'var(--ink-soft)' }}
        >
          Live learning · history
        </p>
        <h1 className="font-display text-[40px] leading-[0.95] tracking-tight sm:text-[52px]">
          My
          <br />
          classroom
        </h1>
        <p className="mt-4 max-w-[440px] text-[15px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
          Every live class you host or join - ongoing sessions to enter now, and past activity so
          you can see what happened.
        </p>
      </header>

      <ClassroomPanel
        live={payload.live}
        groups={payload.groups}
        totalSessions={payload.totalSessions}
      />
    </div>
  );
}
