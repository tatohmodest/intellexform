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
        <h1 className="font-display text-[26px] leading-[1.1] tracking-tight sm:text-[32px]">Admissions</h1>
      </header>
      <AdmissionsDesk
        applications={applications}
        canDecide={actor.permissions.includes('admissions.decide')}
      />
    </div>
  );
}
