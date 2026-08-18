import { redirect } from 'next/navigation';
import { Wallet } from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import { formatXAF } from '@/lib/staff/permissions';
import { getOwnFinance } from '@/lib/staff/store';

export const dynamic = 'force-dynamic';

export default async function StudentFeesPage() {
  const session = getSessionUser();
  if (!session) redirect('/login?next=/dashboard/fees');
  const finance = await getOwnFinance(session.uid);

  return (
    <div className="mx-auto max-w-[720px]">
      <header className="mb-8 border-b pb-6" style={{ borderColor: 'var(--line)' }}>
        <div className="tab mb-2 inline-flex items-center gap-1.5">
          <Wallet size={11} /> School fees
        </div>
        <h1 className="font-display text-[30px] leading-tight">Your fees</h1>
        <p className="mt-2 text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
          Student ID {finance.studentCode}. Pay via the channels your institution publishes; finance staff record receipts here.
        </p>
      </header>

      <section className="mb-8 grid gap-3 sm:grid-cols-3">
        {[
          ['Total fees', formatXAF(finance.totalXAF)],
          ['Amount paid', formatXAF(finance.paidXAF)],
          ['Outstanding', formatXAF(finance.outstandingXAF)],
        ].map(([label, value]) => (
          <div key={label} className="border p-4" style={{ borderColor: 'var(--line)' }}>
            <p className="font-display text-[22px]">{value}</p>
            <p className="font-mono text-[10px] uppercase tracking-wide" style={{ color: 'var(--ink-soft)' }}>
              {label}
            </p>
          </div>
        ))}
      </section>

      <section className="mb-8">
        <h2 className="mb-3 font-display text-[20px]">Charges</h2>
        {finance.charges.length === 0 ? (
          <div className="rounded-2xl border border-dashed px-4 py-8 text-center" style={{ borderColor: 'var(--line)' }}>
            <p className="font-display text-[18px]">No fees posted yet</p>
            <p className="mt-1 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
              When finance posts a charge, it will show here with your balance.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {finance.charges.map((c) => (
              <li key={c.id} className="flex items-center justify-between border px-4 py-3" style={{ borderColor: 'var(--line)' }}>
                <span>
                  <span className="block font-semibold">{c.title}</span>
                  <span className="text-[12px] capitalize" style={{ color: 'var(--ink-soft)' }}>
                    {c.status}
                  </span>
                </span>
                <span className="text-[14px]">{formatXAF(Math.max(0, c.amountXAF - c.paidXAF))} due</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-display text-[20px]">Payment history</h2>
        {finance.payments.length === 0 ? (
          <p className="text-[14px]" style={{ color: 'var(--ink-soft)' }}>
            No receipts yet.
          </p>
        ) : (
          <ul className="space-y-2">
            {finance.payments.map((p) => (
              <li key={p.id} className="border px-4 py-3 text-[14px]" style={{ borderColor: 'var(--line)' }}>
                {formatXAF(p.amountXAF)} · {p.method}
                {p.receiptCode ? ` · ${p.receiptCode}` : ''}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
