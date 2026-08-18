import { Users } from 'lucide-react';
import StudentDesk from '@/components/staff/StudentDesk';
import { requireStaffPage } from '@/lib/staff/guard';

export const dynamic = 'force-dynamic';

export default async function StaffStudentsPage() {
  await requireStaffPage('students.read');

  return (
    <div>
      <header className="mb-6">
        <div className="tab mb-2 inline-flex items-center gap-1.5">
          <Users size={11} /> Students
        </div>
        <h1 className="font-display text-[28px] leading-tight sm:text-[32px]">Student management</h1>
        <p className="mt-2 max-w-[620px] text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
        Search enrolled learners by program, level, class, or course — then open a record to update it.
      </p>
      </header>
      <StudentDesk />
    </div>
  );
}
