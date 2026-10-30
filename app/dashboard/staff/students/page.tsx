import StudentDesk from '@/components/staff/StudentDesk';
import { requireStaffPage } from '@/lib/staff/guard';

export const dynamic = 'force-dynamic';

export default async function StaffStudentsPage() {
  await requireStaffPage('students.read');

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-[26px] leading-[1.1] tracking-tight sm:text-[32px]">Student management</h1>
      </header>
      <StudentDesk />
    </div>
  );
}
