import Link from 'next/link';
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
    ['Instructors', String(snap.teachers ?? snap.mentors)],
    ['Staff', String(snap.staffCount)],
    ['Pending admissions', String(snap.pendingAdmissions)],
    ['Outstanding fees', formatXAF(snap.outstandingXAF)],
    ['Collected (7d)', formatXAF(snap.collected7dXAF)],
    ['Open fee files', String(snap.outstandingCount)],
  ];

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-[26px] leading-[1.1] tracking-tight sm:text-[32px]">Institution health</h1>
      </header>

      <section className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(([label, value]) => {
          const href = label === 'Instructors' ? '/dashboard/staff/teachers' : label === 'Students' ? '/dashboard/staff/students' : '';
          const inner = (
            <>
              <p className="font-display text-[24px] leading-none">{value}</p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-wide" style={{ color: 'var(--ink-soft)' }}>
                {label}
              </p>
            </>
          );
          return href ? (
            <Link key={label} href={href} className="card p-4">
              {inner}
            </Link>
          ) : (
            <div key={label} className="card p-4">
              {inner}
            </div>
          );
        })}
      </section>

      <div className="mb-8">
        <DirectorAsk />
      </div>

      <section className="mb-8">
        <h2 className="mb-3 font-display text-[20px]">Campuses</h2>
        {snap.campuses.length === 0 ? (
          <div className="rounded-2xl border border-dashed px-4 py-8 text-center" style={{ borderColor: 'var(--line)' }}>
            <p className="font-display text-[18px]">Single-site for now</p>
            <p className="mt-1 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
              Add Buea, Douala, or other campuses when the institution grows. {snap.unassignedStudents} student
              records are not assigned to a campus yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto border" style={{ borderColor: 'var(--line)' }}>
            <table className="w-full text-left text-[14px]">
              <thead>
                <tr className="border-b text-[11px] uppercase tracking-wide" style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}>
                  <th className="px-3 py-2 font-medium">Campus</th>
                  <th className="px-3 py-2 font-medium">City</th>
                  <th className="px-3 py-2 font-medium">Students</th>
                </tr>
              </thead>
              <tbody>
                {snap.campuses.map((c) => (
                  <tr key={c.slug} className="border-b last:border-0" style={{ borderColor: 'var(--line)' }}>
                    <td className="px-3 py-2.5 font-semibold">{c.name}</td>
                    <td className="px-3 py-2.5">{c.city || '—'}</td>
                    <td className="px-3 py-2.5">{c.students}</td>
                  </tr>
                ))}
                <tr>
                  <td className="px-3 py-2.5" style={{ color: 'var(--ink-soft)' }}>
                    Unassigned
                  </td>
                  <td className="px-3 py-2.5">—</td>
                  <td className="px-3 py-2.5">{snap.unassignedStudents}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </section>

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
