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
        <h1 className="font-display text-[26px] leading-[1.1] tracking-tight sm:text-[32px]">Campuses</h1>
      </header>
      <CampusDesk campuses={campuses} />
    </div>
  );
}
