'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  BookOpen,
  Building2,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Briefcase,
  GraduationCap,
  Home,
  Users,
  Video,
  X,
  type LucideIcon,
} from 'lucide-react';
import { campusNavItems, type ModuleId } from '@/lib/eduos/capabilities';
import { NAV_GROUPS } from '@/components/dashboard/navConfig';
import { isNavBadgeHref } from '@/lib/learn/navCountTypes';
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
      p.startsWith('/dashboard/library') ||
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

/** Fixed bottom tab bar - mobile / tablet only. Campus-aware when in institution context. */
export default function MobileBottomNav({
  accent = '#00b369',
  isMentor = false,
  isStaff = false,
  campusSlug = null,
  campusModules = [],
  campusRole = 'student',
  counts = ZERO_NAV_COUNTS,
  onSignOut,
  contextSlot = null,
}: {
  accent?: string;
  isMentor?: boolean;
  isStaff?: boolean;
  campusSlug?: string | null;
  campusModules?: string[];
  campusRole?: string;
  counts?: NavCounts;
  onSignOut?: () => void;
  contextSlot?: ReactNode;
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

  type SheetLink = { href: string; label: string; icon: LucideIcon; exact?: boolean };
  type SheetGroup = { label: string; items: SheetLink[] };

  const groups: SheetGroup[] = (() => {
    if (campusSlug) {
      const items = campusNavItems({
        slug: campusSlug,
        role: campusRole,
        modules: campusModules as ModuleId[],
      });
      const out: SheetGroup[] = [
        { label: 'Campus', items: items.map((i) => ({ href: i.href, label: i.label, icon: Building2 })) },
        { label: 'Account', items: [{ href: '/dashboard', label: 'Home', icon: Home, exact: true }] },
      ];
      if (isStaff) out[1].items.push({ href: '/dashboard/staff', label: 'Staff', icon: Briefcase });
      return out;
    }
    const out: SheetGroup[] = NAV_GROUPS.map((g) => ({ label: g.label, items: [...g.items] }));
    const teach: SheetLink[] = [
      isMentor
        ? { href: '/dashboard/teach', label: 'Teaching home', icon: GraduationCap }
        : { href: '/dashboard/mentor', label: 'Apply to mentor', icon: GraduationCap },
    ];
    if (isMentor) {
      teach.push(
        { href: '/dashboard/teach/courses', label: 'Course studio', icon: Video },
        { href: '/dashboard/students', label: 'My Students', icon: Users },
      );
    }
    if (isStaff) teach.push({ href: '/dashboard/staff', label: 'Staff', icon: Briefcase });
    out.push({ label: isMentor ? 'Teaching' : 'Teach', items: teach });
    return out;
  })();

  const allHrefs = groups.flatMap((g) => g.items.map((i) => i.href));
  const moreActive = !tabs.some((tab) => (tab.match ? tab.match(pathname) : pathname.startsWith(tab.href)))
    ? allHrefs.some((h) => pathname.startsWith(h))
    : false;

  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!moreOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [moreOpen]);

  const isActive = (l: SheetLink) =>
    l.exact
      ? pathname === l.href
      : l.href.includes('?')
        ? false
        : pathname === l.href || pathname.startsWith(`${l.href}/`);

  return (
    <>
      {moreOpen ? (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMoreOpen(false)}
          aria-hidden
        />
      ) : null}
      {moreOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t('Menu')}
          className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[86dvh] max-w-lg flex-col rounded-t-[28px] bg-[#fbfaf7] shadow-[0_-20px_60px_-20px_rgba(18,50,79,0.45)] lg:hidden"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          <div className="flex shrink-0 items-center justify-between px-5 pb-2 pt-4">
            <p className="font-display text-[20px] font-extrabold text-[var(--navy)]">{t('Menu')}</p>
            <button
              type="button"
              onClick={() => setMoreOpen(false)}
              aria-label={t('Close')}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--paper-dim)]"
            >
              <X size={18} />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-4 [-webkit-overflow-scrolling:touch]">
            {contextSlot ? <div className="mb-3">{contextSlot}</div> : null}
            {groups.map((group) => (
              <section key={group.label} className="mb-4">
                <h3
                  className="mono mb-2 px-1 text-[10px] uppercase tracking-[0.16em]"
                  style={{ color: 'var(--ink-soft)' }}
                >
                  {t(group.label)}
                </h3>
                <ul className="grid grid-cols-2 gap-2">
                  {group.items.map((l) => {
                    const Icon = l.icon;
                    const active = isActive(l);
                    const badge = isNavBadgeHref(l.href) ? counts[l.href] : 0;
                    return (
                      <li key={l.href + l.label}>
                        <Link
                          href={l.href}
                          onClick={() => setMoreOpen(false)}
                          className="flex items-center gap-2.5 rounded-2xl px-3 py-3 text-[13.5px] font-semibold"
                          style={{
                            background: active ? `${accent}1f` : '#fff',
                            color: active ? 'var(--navy)' : 'var(--ink)',
                            boxShadow: active ? `inset 0 0 0 1.5px ${accent}` : 'inset 0 0 0 1px var(--line)',
                          }}
                        >
                          <Icon size={17} style={{ color: active ? accent : 'var(--ink-soft)' }} />
                          <span className="min-w-0 flex-1 truncate">{t(l.label)}</span>
                          {badge > 0 ? <NavCountBadge count={badge} /> : null}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
            <Link
              href={campusSlug ? `/site/${campusSlug}` : '/'}
              onClick={() => setMoreOpen(false)}
              className="mb-2 flex items-center gap-2.5 rounded-2xl bg-white px-3 py-3 text-[13.5px] font-semibold"
              style={{ boxShadow: 'inset 0 0 0 1px var(--line)', color: 'var(--ink)' }}
            >
              <Home size={17} style={{ color: 'var(--ink-soft)' }} />
              {t(campusSlug ? 'Campus home' : 'Back to site')}
            </Link>
            {onSignOut ? (
              <button
                type="button"
                onClick={() => {
                  setMoreOpen(false);
                  onSignOut();
                }}
                className="flex w-full items-center gap-2.5 rounded-2xl px-3 py-3 text-left text-[13.5px] font-semibold"
                style={{ background: '#fdecec', color: '#b42318' }}
              >
                <LogOut size={17} />
                {t('Sign out')}
              </button>
            ) : null}
          </div>
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
              <span className="max-w-full truncate text-[10px] font-semibold leading-tight">{t('Menu')}</span>
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}
