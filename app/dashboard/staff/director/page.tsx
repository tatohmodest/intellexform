import { Landmark } from 'lucide-react';
import DirectorAsk from '@/components/staff/DirectorAsk';
import { formatXAF } from '@/lib/staff/permissions';
import { requireStaffPage } from '@/lib/staff/guard';
import { directorSnapshot } from '@/lib/staff/store';

export const dynamic = 'force-dynamic';

export default async function DirectorPage() {
  await requireStaffPage('director.view');
  const snap = await directorSnapshot();

  const cards = [
    ['Students', String(snap.students)],
    ['New this week', String(snap.newLearners7d)],
    ['Instructors', String(snap.mentors)],
    ['Staff', String(snap.staffCount)],
    ['Pending admissions', String(snap.pendingAdmissions)],
    ['Outstanding fees', formatXAF(snap.outstandingXAF)],
    ['Collected (7d)', formatXAF(snap.collected7dXAF)],
    ['Open fee files', String(snap.outstandingCount)],
  ];

  return (
    <div>
      <header className="mb-6">
        <div className="tab mb-2 inline-flex items-center gap-1.5">
          <Landmark size={11} /> Director
        </div>
        <h1 className="font-display text-[28px] leading-tight sm:text-[32px]">Institution health</h1>
        <p className="mt-2 max-w-[640px] text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
          A director view of InTelleX — enrollment, fees, admissions, and alerts — not a secretary desk.
        </p>
      </header>

      <section className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(([label, value]) => (
          <div key={label} className="border p-4" style={{ borderColor: 'var(--line)' }}>
            <p className="font-display text-[24px] leading-none">{value}</p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-wide" style={{ color: 'var(--ink-soft)' }}>
              {label}
            </p>
          </div>
        ))}
      </section>

      <div className="mb-8">
        <DirectorAsk />
      </div>

      <section>
        <h2 className="mb-3 font-display text-[20px]">Alerts</h2>
        <ul className="space-y-2">
          {snap.pendingAdmissions > 0 ? (
            <li className="border px-4 py-3 text-[14px]" style={{ borderColor: 'var(--line)' }}>
              {snap.pendingAdmissions} application{snap.pendingAdmissions === 1 ? '' : 's'} waiting for a decision.
            </li>
          ) : null}
          {snap.outstandingCount > 0 ? (
            <li className="border px-4 py-3 text-[14px]" style={{ borderColor: 'var(--line)' }}>
              {snap.outstandingCount} outstanding fee file{snap.outstandingCount === 1 ? '' : 's'} totalling{' '}
              {formatXAF(snap.outstandingXAF)}.
            </li>
          ) : null}
          {snap.pendingAdmissions === 0 && snap.outstandingCount === 0 ? (
            <li className="rounded-2xl border border-dashed px-4 py-8 text-center" style={{ borderColor: 'var(--line)' }}>
              <p className="font-display text-[18px]">No urgent alerts</p>
              <p className="mt-1 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
                Admissions and fees are clear for now.
              </p>
            </li>
          ) : null}
        </ul>
      </section>
    </div>
  );
}
