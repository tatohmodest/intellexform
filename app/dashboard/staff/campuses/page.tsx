import { Building2 } from 'lucide-react';
import CampusDesk from '@/components/staff/CampusDesk';
import { requireStaffPage } from '@/lib/staff/guard';
import { listCampuses } from '@/lib/staff/org';

export const dynamic = 'force-dynamic';

export default async function StaffCampusesPage() {
  await requireStaffPage('campuses.manage');
  const campuses = await listCampuses();

  return (
    <div>
      <header className="mb-6">
        <div className="tab mb-2 inline-flex items-center gap-1.5">
          <Building2 size={11} /> Campuses
        </div>
        <h1 className="font-display text-[28px] leading-tight sm:text-[32px]">Campuses</h1>
        <p className="mt-2 max-w-[640px] text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
          InTelleX is the institution. Add campuses or branches when the organization has more than
          one site. Staff and students can then be scoped to a campus.
        </p>
      </header>
      <CampusDesk campuses={campuses} />
    </div>
  );
}
