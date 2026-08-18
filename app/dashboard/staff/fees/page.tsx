import { Wallet } from 'lucide-react';
import FeesDesk from '@/components/staff/FeesDesk';
import { requireStaffPage } from '@/lib/staff/guard';
import { listFeeStructures, listOutstandingFees } from '@/lib/staff/store';

export const dynamic = 'force-dynamic';

export default async function StaffFeesPage() {
  const actor = await requireStaffPage('fees.read');
  const [structures, outstanding] = await Promise.all([listFeeStructures(), listOutstandingFees()]);

  return (
    <div>
      <header className="mb-6">
        <div className="tab mb-2 inline-flex items-center gap-1.5">
          <Wallet size={11} /> Finance
        </div>
        <h1 className="font-display text-[28px] leading-tight sm:text-[32px]">School fees</h1>
        <p className="mt-2 max-w-[620px] text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
          Create fee structures, charge students, and record MTN, Orange Money, bank, or card payments with receipts.
        </p>
      </header>
      <FeesDesk
        structures={structures}
        outstanding={outstanding}
        canWrite={actor.permissions.includes('fees.write')}
        canPay={actor.permissions.includes('fees.record_payment')}
      />
    </div>
  );
}
