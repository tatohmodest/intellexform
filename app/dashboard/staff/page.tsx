import Link from 'next/link';
import { Briefcase } from 'lucide-react';
import { formatXAF } from '@/lib/staff/permissions';
import { staffNavFor } from '@/lib/staff/nav';
import { requireStaffPage } from '@/lib/staff/guard';
import { staffHomeStats } from '@/lib/staff/store';

export const dynamic = 'force-dynamic';

export default async function StaffHomePage() {
  const actor = await requireStaffPage('staff.access');
  const stats = await staffHomeStats();
  const links = staffNavFor(actor.permissions).filter((l) => l.href !== '/dashboard/staff');
  const name = actor.name.split(/\s+/)[0] || 'there';

  const cards = [
    actor.permissions.includes('students.read')
      ? (['Students', String(stats.students), '/dashboard/staff/students'] as const)
      : null,
    actor.permissions.includes('admissions.read')
      ? (['Pending applications', String(stats.pendingAdmissions), '/dashboard/staff/admissions'] as const)
      : null,
    actor.permissions.includes('fees.read')
      ? (['Outstanding fees', String(stats.outstandingCount), '/dashboard/staff/fees'] as const)
      : null,
    actor.permissions.includes('fees.read')
      ? (['Balance due', formatXAF(stats.outstandingXAF), '/dashboard/staff/fees'] as const)
      : null,
  ].filter((row): row is readonly [string, string, string] => Boolean(row));

  return (
    <div>
      <header className="mb-8">
        <div className="tab mb-2 inline-flex items-center gap-1.5">
          <Briefcase size={11} /> Operations
        </div>
        <h1 className="font-display text-[32px] leading-tight sm:text-[36px]">
          What needs handling today, {name}?
        </h1>
        <p className="mt-2 max-w-[640px] text-[15px]" style={{ color: 'var(--ink-soft)' }}>
          This is the InTelleX staff workspace. Desks are granted by platform administrators.
          You only see what your post allows.
        </p>
      </header>

      <section className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(([label, value, href]) => (
          <Link key={label} href={href} className="border p-4" style={{ borderColor: 'var(--line)' }}>
            <p className="font-display text-[26px] leading-none">{value}</p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-wide" style={{ color: 'var(--ink-soft)' }}>
              {label}
            </p>
          </Link>
        ))}
      </section>

      <section className="mb-8 flex flex-wrap gap-2">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="border px-3 py-2 text-[13px] font-semibold"
            style={{ borderColor: 'var(--line)' }}
          >
            {l.label}
          </Link>
        ))}
      </section>

      <section>
        <h2 className="mb-3 font-display text-[20px]">Recent activity</h2>
        {stats.activity.length === 0 ? (
          <div className="rounded-2xl border border-dashed px-4 py-8 text-center" style={{ borderColor: 'var(--line)' }}>
            <p className="font-display text-[18px]">No staff activity yet</p>
            <p className="mt-1 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
              Status changes, payments, and admissions will appear here.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {stats.activity.map((a) => (
              <li key={a.id} className="border px-4 py-3 text-[14px]" style={{ borderColor: 'var(--line)' }}>
                <p>{a.summary}</p>
                <p className="mt-0.5 text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                  {a.actorName} · {a.createdAt ? new Date(a.createdAt).toLocaleString() : ''}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
