import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import {
  getMentorProfile,
  listInstructorStudentGroups,
} from '@/lib/learn/ecosystem';
import MyStudentsPanel from '@/components/dashboard/MyStudentsPanel';

export const dynamic = 'force-dynamic';

export default async function MyStudentsPage() {
  const session = getSessionUser();
  if (!session) redirect('/login?next=/dashboard/students');

  const profile = await getMentorProfile(session.uid);
  if (!profile) redirect('/dashboard/mentor');

  const groups = await listInstructorStudentGroups(session.uid);
  const totalStudents = new Set(
    groups.flatMap((g) => g.students.map((s) => s.studentId)),
  ).size;

  const payload = JSON.parse(JSON.stringify(groups)) as typeof groups;

  return (
    <div className="mx-auto max-w-[1080px] overflow-x-hidden">
      <Link
        href="/dashboard/mentor"
        className="mb-6 inline-flex items-center gap-1.5 border px-3 py-1.5 text-[13px] font-semibold"
        style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
      >
        <ArrowLeft size={14} /> Mentor Studio
      </Link>

      <header className="mb-2 border-b pb-8" style={{ borderColor: 'var(--line)' }}>
        <p
          className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em]"
          style={{ color: 'var(--ink-soft)' }}
        >
          Teaching · roster
        </p>
        <h1 className="font-display text-[40px] leading-[0.95] tracking-tight sm:text-[52px]">
          My
          <br />
          students
        </h1>
        <p className="mt-4 max-w-[420px] text-[15px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
          Everyone enrolled in your courses, organised by what they signed up for. Assign exams or
          assignments per course. Start class here, then review past live sessions in My Classroom.
        </p>
        <Link
          href="/dashboard/classroom"
          className="mt-5 inline-flex border px-3 py-1.5 text-[13.5px] font-semibold"
          style={{ borderColor: 'var(--line)', color: 'var(--green-deep)' }}
        >
          Open My Classroom
        </Link>
      </header>

      <MyStudentsPanel groups={payload} totalStudents={totalStudents} />
    </div>
  );
}
