import { ClipboardCheck } from 'lucide-react';
import AdmissionsDesk from '@/components/staff/AdmissionsDesk';
import { requireStaffPage } from '@/lib/staff/guard';
import { listAdmissions } from '@/lib/staff/store';

export const dynamic = 'force-dynamic';

export default async function StaffAdmissionsPage() {
  const actor = await requireStaffPage('admissions.read');
  const applications = await listAdmissions();

  return (
    <div>
      <header className="mb-6">
        <div className="tab mb-2 inline-flex items-center gap-1.5">
          <ClipboardCheck size={11} /> Admissions
        </div>
        <h1 className="font-display text-[28px] leading-tight sm:text-[32px]">Admissions</h1>
        <p className="mt-2 max-w-[620px] text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
          Review join requests and registrations. Admit upgrades the same account. You can also delete a request.
        </p>
      </header>
      <AdmissionsDesk
        applications={applications}
        canDecide={actor.permissions.includes('admissions.decide')}
      />
    </div>
  );
}
