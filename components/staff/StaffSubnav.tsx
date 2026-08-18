'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { staffNavFor } from '@/lib/staff/nav';
import { DESK_LABELS, type StaffDesk, type StaffPermission } from '@/lib/staff/permissions';

export default function StaffSubnav({
  desks,
  permissions,
  campusSlugs,
}: {
  desks: StaffDesk[];
  permissions: StaffPermission[];
  campusSlugs?: string[];
}) {
  const pathname = usePathname();
  const items = staffNavFor(permissions);

  return (
    <div className="mb-6 border-b pb-4" style={{ borderColor: 'var(--line)' }}>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="tab">Institution</span>
        {desks.map((d) => (
          <span
            key={d}
            className="rounded-full border px-2 py-0.5 text-[11px] font-semibold"
            style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}
          >
            {DESK_LABELS[d]}
          </span>
        ))}
        <span
          className="rounded-full border px-2 py-0.5 text-[11px] font-semibold"
          style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}
        >
          {campusSlugs?.length ? campusSlugs.join(', ') : 'Entire institution'}
        </span>
      </div>
      <nav className="-mx-1 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 whitespace-nowrap border px-3 py-2 text-[12.5px] font-semibold"
              style={{
                borderColor: active ? 'var(--ink)' : 'var(--line)',
                background: active ? 'var(--ink)' : 'transparent',
                color: active ? '#fff' : 'var(--ink-soft)',
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
