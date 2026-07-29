'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  Bot,
  Building2,
  LayoutDashboard,
  Settings,
  type LucideIcon,
} from 'lucide-react';

type Tab = {
  href: string;
  label: string;
  icon: LucideIcon;
  match?: (pathname: string) => boolean;
};

const TABS: Tab[] = [
  {
    href: '/dashboard',
    label: 'Home',
    icon: LayoutDashboard,
    match: (p) => p === '/dashboard',
  },
  {
    href: '/dashboard/courses',
    label: 'Courses',
    icon: BookOpen,
    match: (p) => p.startsWith('/dashboard/courses'),
  },
  {
    href: '/dashboard/tutor',
    label: 'InTelleX AI',
    icon: Bot,
    match: (p) => p.startsWith('/dashboard/tutor'),
  },
  {
    href: '/dashboard/institutions',
    label: 'Campus',
    icon: Building2,
    match: (p) => p.startsWith('/dashboard/institutions'),
  },
  {
    href: '/dashboard/settings',
    label: 'You',
    icon: Settings,
    match: (p) => p.startsWith('/dashboard/settings'),
  },
];

/** Fixed bottom tab bar - mobile / tablet only. */
export default function MobileBottomNav({ accent = '#00b369' }: { accent?: string }) {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t lg:hidden"
      style={{
        borderColor: 'var(--line)',
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(10px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
      aria-label="Primary mobile"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-between px-1 pt-1.5 pb-1.5">
        {TABS.map((tab) => {
          const active = tab.match ? tab.match(pathname) : pathname.startsWith(tab.href);
          const Icon = tab.icon;
          return (
            <li key={tab.href} className="min-w-0 flex-1">
              <Link
                href={tab.href}
                className="flex flex-col items-center gap-0.5 px-1 py-1.5 text-center"
                style={{ color: active ? accent : 'var(--ink-soft)' }}
                aria-current={active ? 'page' : undefined}
              >
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-xl"
                  style={active ? { background: `${accent}1a` } : undefined}
                >
                  <Icon size={20} strokeWidth={active ? 2.25 : 1.75} />
                </span>
                <span
                  className="max-w-full truncate text-[10px] font-semibold leading-tight"
                  style={{ fontWeight: active ? 700 : 500 }}
                >
                  {tab.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
