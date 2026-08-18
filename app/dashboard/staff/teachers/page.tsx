import { GraduationCap } from 'lucide-react';
import TeachersDesk from '@/components/staff/TeachersDesk';
import { requireStaffPage } from '@/lib/staff/guard';

export const dynamic = 'force-dynamic';

export default async function StaffTeachersPage() {
  const actor = await requireStaffPage('teachers.read');

  return (
    <div>
      <header className="mb-6">
        <div className="tab mb-2 inline-flex items-center gap-1.5">
          <GraduationCap size={11} /> Teachers
        </div>
        <h1 className="font-display text-[28px] leading-tight sm:text-[32px]">Teachers</h1>
        <p className="mt-2 max-w-[640px] text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
          Who is teaching what, how many students they have, and the roster in each course. The
          Director enables this for other staff from Appoint staff — same as fees or Data Workspace.
        </p>
      </header>
      <TeachersDesk canManage={actor.permissions.includes('teachers.manage')} />
    </div>
  );
}
