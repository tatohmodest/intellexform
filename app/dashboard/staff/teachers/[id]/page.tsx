import Link from 'next/link';
import { notFound } from 'next/navigation';
import TeacherDetail from '@/components/staff/TeacherDetail';
import { requireStaffPage } from '@/lib/staff/guard';
import { getTeacherDetail } from '@/lib/staff/store';

export const dynamic = 'force-dynamic';

export default async function StaffTeacherDetailPage({ params }: { params: { id: string } }) {
  const actor = await requireStaffPage('teachers.read');
  const teacher = await getTeacherDetail(params.id, actor);
  if (!teacher) notFound();

  return (
    <div>
      <Link href="/dashboard/staff/teachers" className="text-[13px] font-semibold" style={{ color: 'var(--green-deep)' }}>
        ← All teachers
      </Link>
      <h1 className="mt-2 font-display text-[30px] leading-tight">{teacher.name}</h1>
      <p className="mb-6 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
        {teacher.email || teacher.title || 'Teacher'}
        {teacher.staffPost?.active ? ' · also staff' : ''}
      </p>
      <TeacherDetail
        initial={teacher}
        canManage={actor.permissions.includes('teachers.manage')}
        canStaff={actor.permissions.includes('staff.manage')}
      />
    </div>
  );
}
