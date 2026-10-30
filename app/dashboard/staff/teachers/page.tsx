import TeachersDesk from '@/components/staff/TeachersDesk';
import { requireStaffPage } from '@/lib/staff/guard';

export const dynamic = 'force-dynamic';

export default async function StaffTeachersPage() {
  const actor = await requireStaffPage('teachers.read');

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-[26px] leading-[1.1] tracking-tight sm:text-[32px]">Teachers</h1>
      </header>
      <TeachersDesk canManage={actor.permissions.includes('teachers.manage')} />
    </div>
  );
}
