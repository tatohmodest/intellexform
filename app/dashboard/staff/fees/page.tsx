import FeesDesk from '@/components/staff/FeesDesk';
import { requireStaffPage } from '@/lib/staff/guard';
import { listBillableCourses, listFeeStructures, listOutstandingFees } from '@/lib/staff/store';

export const dynamic = 'force-dynamic';

export default async function StaffFeesPage() {
  const actor = await requireStaffPage('fees.read');
  const [structures, outstanding, courses] = await Promise.all([
    listFeeStructures(),
    listOutstandingFees(),
    listBillableCourses(),
  ]);

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-[26px] leading-[1.1] tracking-tight sm:text-[32px]">School fees</h1>
      </header>
      <FeesDesk
        structures={structures}
        outstanding={outstanding}
        courses={courses}
        canWrite={actor.permissions.includes('fees.write')}
        canPay={actor.permissions.includes('fees.record_payment')}
      />
    </div>
  );
}
