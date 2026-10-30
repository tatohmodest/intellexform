import { formatXAF } from '@/lib/staff/permissions';
import { requireStaffPage } from '@/lib/staff/guard';
import { listStaffAudit, staffHomeStats } from '@/lib/staff/store';

export const dynamic = 'force-dynamic';

export default async function StaffReportsPage() {
  await requireStaffPage('reports.read');
  const [stats, audit] = await Promise.all([staffHomeStats(), listStaffAudit(80)]);

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-[26px] leading-[1.1] tracking-tight sm:text-[32px]">Operational reports</h1>
      </header>

      <section className="mb-8 grid gap-3 sm:grid-cols-3">
        {[
          ['Learners', String(stats.students)],
          ['Staff posts', String(stats.staffCount)],
          ['Outstanding', formatXAF(stats.outstandingXAF)],
        ].map(([label, value]) => (
          <div key={label} className="card p-4">
            <p className="font-display text-[24px]">{value}</p>
            <p className="font-mono text-[10px] uppercase tracking-wide" style={{ color: 'var(--ink-soft)' }}>
              {label}
            </p>
          </div>
        ))}
      </section>

      {stats.statusCounts.length > 0 ? (
        <section className="mb-8">
          <h2 className="mb-3 font-display text-[20px]">Student status</h2>
          <div className="flex flex-wrap gap-2">
            {stats.statusCounts.map((s) => (
              <span key={s.status} className="border px-3 py-1.5 text-[13px]" style={{ borderColor: 'var(--line)' }}>
                {s.status.replace(/_/g, ' ')} · {s.n}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      <section>
        <h2 className="mb-3 font-display text-[20px]">Audit log</h2>
        {audit.length === 0 ? (
          <div className="rounded-2xl border border-dashed px-4 py-8 text-center" style={{ borderColor: 'var(--line)' }}>
            <p className="font-display text-[18px]">Nothing important has been logged yet</p>
            <p className="mt-1 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
              Role grants, status changes, and payments will show here.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {audit.map((a) => (
              <li key={a.id} className="border px-4 py-3 text-[14px]" style={{ borderColor: 'var(--line)' }}>
                <p>{a.summary}</p>
                <p className="mt-0.5 text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                  {a.actorName} · {a.action} · {a.createdAt ? new Date(a.createdAt).toLocaleString() : ''}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
