'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  BookOpen,
  Building2,
  ClipboardList,
  LayoutDashboard,
  Megaphone,
  Menu,
  MessageSquare,
  Briefcase,
  GraduationCap,
  Settings,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react';
import { campusNavItems, type ModuleId } from '@/lib/eduos/capabilities';
import NavCountBadge from '@/components/dashboard/NavCountBadge';
import { ZERO_NAV_COUNTS, type NavCounts } from '@/lib/learn/navCountTypes';
import { useT } from '@/components/i18n/I18nRoot';

type Tab = {
  href: string;
  label: string;
  icon: LucideIcon;
  match?: (pathname: string) => boolean;
};

const TABS: Tab[] = [
  {
    href: '/dashboard',
    label: 'Today',
    icon: LayoutDashboard,
    match: (p) => p === '/dashboard',
  },
  {
    href: '/dashboard/my-learning',
    label: 'Learn',
    icon: BookOpen,
    match: (p) =>
      p.startsWith('/dashboard/my-learning') ||
      p.startsWith('/dashboard/courses') ||
      p.startsWith('/dashboard/classroom') ||
      p.startsWith('/dashboard/drive-player'),
  },
  {
    href: '/dashboard/assignments',
    label: 'Work',
    icon: ClipboardList,
    match: (p) =>
      p.startsWith('/dashboard/assignments') ||
      p.startsWith('/dashboard/calendar') ||
      p.startsWith('/dashboard/todos') ||
      p.startsWith('/dashboard/academic'),
  },
  {
    href: '/dashboard/community',
    label: 'Community',
    icon: Users,
    match: (p) =>
      p.startsWith('/dashboard/community') ||
      p.startsWith('/dashboard/messages') ||
      p.startsWith('/dashboard/study-groups') ||
      p.startsWith('/dashboard/announcements'),
  },
];

const MORE_LINKS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: '/dashboard/announcements', label: 'Announcements', icon: Megaphone },
  { href: '/dashboard/messages', label: 'Messages', icon: MessageSquare },
  { href: '/dashboard/academic', label: 'Academic', icon: GraduationCap },
  { href: '/dashboard/fees', label: 'Fees', icon: Briefcase },
  { href: '/dashboard/portfolio', label: 'Portfolio', icon: Briefcase },
  { href: '/dashboard/teach', label: 'Teaching', icon: BookOpen },
  { href: '/dashboard/staff', label: 'Staff', icon: Briefcase },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

/** Fixed bottom tab bar - mobile / tablet only. Campus-aware when in institution context. */
export default function MobileBottomNav({
  accent = '#00b369',
  isMentor = false,
  isStaff = false,
  campusSlug = null,
  campusModules = [],
  campusRole = 'student',
  counts = ZERO_NAV_COUNTS,
}: {
  accent?: string;
  isMentor?: boolean;
  isStaff?: boolean;
  campusSlug?: string | null;
  campusModules?: string[];
  campusRole?: string;
  counts?: NavCounts;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useT();
  const currentTab = searchParams.get('tab');
  const [moreOpen, setMoreOpen] = useState(false);

  const campusTabs: Tab[] | null = campusSlug
    ? (() => {
        const items = campusNavItems({
          slug: campusSlug,
          role: campusRole,
          modules: campusModules as ModuleId[],
        }).slice(0, 4);
        const iconFor = (id: string): LucideIcon => {
          if (id === 'courses') return BookOpen;
          if (id === 'assignments') return ClipboardList;
          if (id === 'calendar' || id === 'events') return LayoutDashboard;
          if (id === 'announcements') return MessageSquare;
          return Building2;
        };
        return items.map((item) => ({
          href: item.href,
          label: item.label.split(' ')[0] || item.label,
          icon: iconFor(item.id),
          match: (p: string) => {
            const onCampus = p.startsWith(`/dashboard/institutions/${campusSlug}`);
            if (!onCampus) return false;
            if (item.id === 'home') return !currentTab;
            return currentTab === item.id;
          },
        }));
      })()
    : null;

  const tabCount = (tab: Tab): number => {
    if (tab.href === '/dashboard') return counts['/dashboard/notifications'];
    if (tab.href === '/dashboard/my-learning') return counts['/dashboard/library'];
    if (tab.href === '/dashboard/assignments') {
      return (
        counts['/dashboard/assignments'] +
        counts['/dashboard/todos'] +
        counts['/dashboard/calendar']
      );
    }
    if (tab.href === '/dashboard/community') {
      return (
        counts['/dashboard/community'] +
        counts['/dashboard/messages'] +
        counts['/dashboard/study-groups']
      );
    }
    return 0;
  };

  const moreCount =
    counts['/dashboard/notifications'] +
    counts['/dashboard/fees'] +
    counts['/dashboard/notes'] +
    counts['/dashboard/opportunities'];
  const tabs = campusTabs || TABS;
  const moreActive = MORE_LINKS.some((l) => pathname.startsWith(l.href));
  const links = MORE_LINKS.filter((l) => {
    if (l.href === '/dashboard/teach') return isMentor;
    if (l.href === '/dashboard/staff') return isStaff;
    return true;
  });
  if (campusSlug) {
    links.unshift({
      href: `/dashboard/institutions/${campusSlug}`,
      label: 'Campus home',
      icon: Building2,
    });
  }

  return (
    <>
      {moreOpen ? (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setMoreOpen(false)}
          aria-hidden
        />
      ) : null}
      {moreOpen ? (
        <div
          className="fixed inset-x-0 bottom-[4.25rem] z-50 mx-auto max-w-lg border p-3 lg:hidden"
          style={{
            borderColor: 'var(--line)',
            background: 'var(--paper, #fff)',
            marginBottom: 'env(safe-area-inset-bottom, 0px)',
          }}
        >
          <div className="mb-2 flex items-center justify-between">
            <p className="font-display text-[16px]">{t('More')}</p>
            <button type="button" onClick={() => setMoreOpen(false)} aria-label={t('Close')}>
              <X size={18} />
            </button>
          </div>
          <ul className="grid grid-cols-2 gap-2">
            {links.map((l) => {
              const Icon = l.icon;
              const active = pathname.startsWith(l.href);
              const badge =
                l.href === '/dashboard/announcements'
                  ? counts['/dashboard/announcements']
                  : l.href === '/dashboard/messages'
                    ? counts['/dashboard/messages']
                    : l.href === '/dashboard/fees'
                      ? counts['/dashboard/fees']
                      : null;
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setMoreOpen(false)}
                    className="flex items-center gap-2 border px-3 py-3 text-[13px] font-semibold"
                    style={{
                      borderColor: active ? accent : 'var(--line)',
                      color: active ? accent : 'var(--ink)',
                    }}
                  >
                    <Icon size={16} />
                    <span className="min-w-0 flex-1 truncate">{t(l.label)}</span>
                    {badge !== null ? <NavCountBadge count={badge} /> : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t lg:hidden"
        style={{
          borderColor: 'var(--line)',
          background: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(10px)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
        aria-label={t('Primary mobile')}
      >
        <ul className="mx-auto flex max-w-lg items-stretch justify-between px-1 pt-1.5 pb-1.5">
          {tabs.map((tab) => {
            const active = tab.match ? tab.match(pathname) : pathname.startsWith(tab.href);
            const Icon = tab.icon;
            const n = campusTabs ? 0 : tabCount(tab);
            return (
              <li key={tab.href} className="min-w-0 flex-1">
                <Link
                  href={tab.href}
                  className="flex flex-col items-center gap-0.5 px-1 py-1.5 text-center"
                  style={{ color: active ? accent : 'var(--ink-soft)' }}
                  aria-current={active ? 'page' : undefined}
                >
                  <span
                    className="relative flex h-8 w-8 items-center justify-center rounded-xl"
                    style={active ? { background: `${accent}1a` } : undefined}
                  >
                    <Icon size={20} strokeWidth={active ? 2.25 : 1.75} />
                    <NavCountBadge count={n} compact />
                  </span>
                  <span
                    className="max-w-full truncate text-[10px] font-semibold leading-tight"
                    style={{ fontWeight: active ? 700 : 500 }}
                  >
                    {t(tab.label)}
                  </span>
                </Link>
              </li>
            );
          })}
          <li className="min-w-0 flex-1">
            <button
              type="button"
              onClick={() => setMoreOpen((o) => !o)}
              className="flex w-full flex-col items-center gap-0.5 px-1 py-1.5 text-center"
              style={{ color: moreOpen || moreActive ? accent : 'var(--ink-soft)' }}
              aria-expanded={moreOpen}
            >
              <span
                className="relative flex h-8 w-8 items-center justify-center rounded-xl"
                style={moreOpen || moreActive ? { background: `${accent}1a` } : undefined}
              >
                <Menu size={20} strokeWidth={moreOpen || moreActive ? 2.25 : 1.75} />
                <NavCountBadge count={moreCount} compact />
              </span>
              <span className="max-w-full truncate text-[10px] font-semibold leading-tight">{t('More')}</span>
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}
