import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import {
  getMentorProfile,
  listInstructorStudentGroups,
} from '@/lib/learn/ecosystem';
import MyStudentsPanel from '@/components/dashboard/MyStudentsPanel';
import PageHeader from '@/components/dashboard/PageHeader';

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

      <PageHeader
        title="My students"
        actions={
          <>
            <Link href="/dashboard/classroom" className="chip">
              My Classroom
            </Link>
          </>
        }
      />

      <MyStudentsPanel groups={payload} totalStudents={totalStudents} />
    </div>
  );
}
