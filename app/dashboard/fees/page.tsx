import { redirect } from 'next/navigation';
import { Wallet } from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import { formatXAF } from '@/lib/staff/permissions';
import { getOwnFinance } from '@/lib/staff/store';
import StudentGate from '@/components/dashboard/StudentGate';

export const dynamic = 'force-dynamic';

function feeWhen(iso: string | Date | undefined): string {
  if (!iso) return '';
  const dt = iso instanceof Date ? iso : new Date(iso);
  if (Number.isNaN(dt.getTime())) return '';
  return dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function isRecent(iso: string | Date | undefined, days = 7): boolean {
  if (!iso) return false;
  const dt = iso instanceof Date ? iso : new Date(iso);
  if (Number.isNaN(dt.getTime())) return false;
  return Date.now() - dt.getTime() < days * 24 * 60 * 60 * 1000;
}

export default async function StudentFeesPage() {
  const session = getSessionUser();
  if (!session) redirect('/login?next=/dashboard/fees');
  const finance = await getOwnFinance(session.uid);
  const openCharges = finance.charges.filter(
    (c) => Math.max(0, c.amountXAF - c.paidXAF) > 0 && c.status !== 'paid',
  );
  const newCharges = openCharges.filter((c) => isRecent(c.createdAt));

  return (
    <StudentGate userId={session.uid}>
    <div className="mx-auto max-w-[720px]">
      <header className="mb-8 border-b pb-6" style={{ borderColor: 'var(--line)' }}>
        <div className="tab mb-2 inline-flex items-center gap-1.5">
          <Wallet size={11} /> School fees
        </div>
        <h1 className="font-display text-[30px] leading-tight">Your fees</h1>
        <p className="mt-2 text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
          Student ID {finance.studentCode || '—'}. Pay via the channels your institution publishes;
          finance staff record receipts here. New charges also appear in Notifications.
        </p>
      </header>

      {finance.outstandingXAF > 0 ? (
        <div
          className="mb-6 border px-4 py-4"
          style={{
            borderColor: 'rgba(200, 60, 60, 0.35)',
            background: 'rgba(200, 60, 60, 0.06)',
          }}
        >
          <p className="font-display text-[22px]">{formatXAF(finance.outstandingXAF)} outstanding</p>
          <p className="mt-1 text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>
            {openCharges.length} open charge{openCharges.length === 1 ? '' : 's'}
            {newCharges.length
              ? ` · ${newCharges.length} posted in the last 7 days`
              : ''}
            . Staff notify you here and in Notifications whenever a fee is allocated.
          </p>
        </div>
      ) : finance.charges.length > 0 ? (
        <div
          className="mb-6 border px-4 py-4"
          style={{
            borderColor: 'rgba(0, 179, 105, 0.35)',
            background: 'rgba(0, 179, 105, 0.08)',
          }}
        >
          <p className="font-display text-[20px]" style={{ color: 'var(--green-deep)' }}>
            You are up to date
          </p>
          <p className="mt-1 text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>
            No outstanding school fees. New allocations will show here and send a notification.
          </p>
        </div>
      ) : null}

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
              When finance allocates a charge, you get a notification and it appears here with your balance.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {finance.charges.map((c) => {
              const due = Math.max(0, c.amountXAF - c.paidXAF);
              const paid = due <= 0 || c.status === 'paid';
              const fresh = !paid && isRecent(c.createdAt);
              return (
                <li
                  key={c.id}
                  className="flex items-center justify-between gap-3 border px-4 py-3"
                  style={{
                    borderColor: paid
                      ? 'rgba(0, 179, 105, 0.35)'
                      : fresh
                        ? 'rgba(200, 60, 60, 0.35)'
                        : 'var(--line)',
                    background: paid
                      ? 'rgba(0, 179, 105, 0.06)'
                      : fresh
                        ? 'rgba(200, 60, 60, 0.05)'
                        : 'transparent',
                  }}
                >
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="block font-semibold">{c.title}</span>
                      {fresh ? (
                        <span
                          className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white"
                          style={{ background: 'var(--green)' }}
                        >
                          New
                        </span>
                      ) : null}
                    </span>
                    <span className="text-[12px] capitalize" style={{ color: 'var(--ink-soft)' }}>
                      {paid ? 'paid' : c.status}
                      {c.createdAt ? ` · posted ${feeWhen(c.createdAt)}` : ''}
                      {c.paidXAF > 0 && !paid ? ` · ${formatXAF(c.paidXAF)} paid so far` : ''}
                    </span>
                  </span>
                  <span
                    className="shrink-0 text-[14px] font-semibold"
                    style={{ color: paid ? 'var(--green-deep)' : undefined }}
                  >
                    {paid ? `${formatXAF(c.amountXAF)} paid` : `${formatXAF(due)} due`}
                  </span>
                </li>
              );
            })}
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
                {p.createdAt ? ` · ${feeWhen(p.createdAt)}` : ''}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
    </StudentGate>
  );
}
