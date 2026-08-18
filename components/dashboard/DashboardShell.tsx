'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Bot,
  Trophy,
  Settings,
  LogOut,
  Flame,
  Zap,
  Menu,
  X,
  Home,
  BookMarked,
  Youtube,
  Building2,
  GraduationCap,
  ChevronDown,
  Check,
  Bell,
  Sparkles,
  ClipboardList,
  FileText,
  Video,
  School,
  Award,
  CalendarDays,
  CheckSquare,
  MessageSquare,
  Briefcase,
  Wallet,
  Megaphone,
} from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';
import MobileBottomNav from '@/components/dashboard/MobileBottomNav';
import CampusReturnBanner from '@/components/dashboard/CampusReturnBanner';
import NotificationBell from '@/components/dashboard/NotificationBell';
import OngoingClassBanner from '@/components/dashboard/OngoingClassBanner';
import PushAlertsBanner from '@/components/dashboard/PushAlertsBanner';
import type { ActiveContext, Affiliation, CampusBrand, PrimaryIntent } from '@/lib/learn/identity';
import { campusNavItems, type ModuleId } from '@/lib/eduos/capabilities';
import { staffNavFor } from '@/lib/staff/nav';
import type { StaffDesk, StaffPermission } from '@/lib/staff/permissions';
import NavCountBadge from '@/components/dashboard/NavCountBadge';
import { useT } from '@/components/i18n/I18nRoot';
import {
  NAV_SEEN_HREFS,
  ZERO_NAV_COUNTS,
  isNavBadgeHref,
  isNavSeenHref,
  type NavCounts,
} from '@/lib/learn/navCountTypes';

export interface ShellUser {
  name: string;
  email: string;
  avatar: string | null;
  xp: number;
  streakCount: number;
  roles?: string[];
  primaryIntent?: PrimaryIntent | null;
  affiliations?: Affiliation[];
  activeContext?: ActiveContext;
  onboardingComplete?: boolean;
  isStudent?: boolean;
  matricule?: string | null;
}

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};

type NavGroup = { label: string; items: NavItem[] };

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Home',
    items: [
      { href: '/dashboard', label: 'Today', icon: LayoutDashboard, exact: true },
      { href: '/dashboard/announcements', label: 'Announcements', icon: Megaphone },
    ],
  },
  {
    label: 'Learn',
    items: [
      { href: '/dashboard/my-learning', label: 'My Learning', icon: Sparkles },
      { href: '/dashboard/courses', label: 'My Courses', icon: BookOpen },
      { href: '/dashboard/library', label: 'Library', icon: BookMarked },
      { href: '/dashboard/classroom', label: 'Classroom', icon: School },
    ],
  },
  {
    label: 'Academic',
    items: [
      { href: '/dashboard/academic', label: 'Overview', icon: GraduationCap },
      { href: '/dashboard/calendar', label: 'Calendar', icon: CalendarDays },
      { href: '/dashboard/assignments', label: 'Assignments', icon: ClipboardList },
      { href: '/dashboard/todos', label: 'Tasks', icon: CheckSquare },
      { href: '/dashboard/fees', label: 'School fees', icon: Wallet },
    ],
  },
  {
    label: 'Community',
    items: [
      { href: '/dashboard/messages', label: 'Messages', icon: MessageSquare },
      { href: '/dashboard/community', label: 'Community', icon: Users },
      { href: '/dashboard/study-groups', label: 'Groups', icon: Users },
      { href: '/dashboard/mentorship', label: 'Mentorship', icon: Users },
      { href: '/dashboard/notes', label: 'Notes', icon: FileText },
    ],
  },
  {
    label: 'Career',
    items: [
      { href: '/dashboard/portfolio', label: 'Portfolio', icon: Award },
      { href: '/dashboard/opportunities', label: 'Opportunities', icon: Sparkles },
      { href: '/dashboard/achievements', label: 'Progress', icon: Trophy },
    ],
  },
  {
    label: 'Personal',
    items: [
      { href: '/dashboard/tutor', label: 'AI Tutor', icon: Bot },
      { href: '/dashboard/videos', label: 'Video Hall', icon: Youtube },
      { href: '/dashboard/notifications', label: 'Notifications', icon: Bell },
      { href: '/dashboard/subscription', label: 'Subscription', icon: Award },
      { href: '/dashboard/settings', label: 'Settings', icon: Settings },
    ],
  },
];

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');
}

function NavLinks({
  pathname,
  isMentor,
  context,
  accent,
  campusBrand,
  campusRole,
  staffPermissions,
  counts,
  onNavigate,
}: {
  pathname: string;
  isMentor: boolean;
  context?: ActiveContext;
  accent: string;
  campusBrand?: CampusBrand | null;
  campusRole?: string;
  staffPermissions?: StaffPermission[] | null;
  counts: NavCounts;
  onNavigate?: () => void;
}) {
  const searchParams = useSearchParams();
  const t = useT();
  const campusSlug =
    context?.kind === 'institution' ? context.institutionSlug : null;
  const mentorActive =
    pathname.startsWith('/dashboard/mentor') &&
    !pathname.startsWith('/dashboard/mentorship');
  const activeBg = `${accent}1a`;
  const activeColor = accent;
  const currentTab = searchParams.get('tab');

  if (campusSlug) {
    const modules = (campusBrand?.enabledModules ?? []) as ModuleId[];
    const items = campusNavItems({
      slug: campusSlug,
      role: campusRole || 'student',
      modules,
    });
    return (
      <nav className="flex flex-col gap-1">
        {items.map((item) => {
          const itemTab = item.href.includes('tab=')
            ? item.href.split('tab=')[1]?.split('&')[0]
            : null;
          const active = itemTab
            ? currentTab === itemTab
            : !currentTab && pathname.startsWith(`/dashboard/institutions/${campusSlug}`);
          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={onNavigate}
              className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] font-medium"
              style={
                active
                  ? { background: activeBg, color: activeColor }
                  : { color: 'var(--ink-soft)' }
              }
            >
              <Building2 size={17} />
              {t(item.label)}
            </Link>
          );
        })}
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className="mt-2 flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] font-medium"
          style={{ color: 'var(--ink-soft)' }}
        >
          <Home size={17} />
          {t('Home')}
        </Link>
        {staffPermissions?.includes('staff.access') ? (
          <Link
            href="/dashboard/staff"
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] font-medium"
            style={
              pathname.startsWith('/dashboard/staff')
                ? { background: activeBg, color: activeColor }
                : { color: 'var(--ink-soft)' }
            }
          >
            <Briefcase size={17} />
            {t('Staff')}
          </Link>
        ) : null}
      </nav>
    );
  }

  return (
    <nav className="flex flex-col gap-1">
      {NAV_GROUPS.map((group) => (
        <div key={group.label} className={group.label === 'Home' ? '' : 'mt-3'}>
          {group.label !== 'Home' ? (
            <div
              className="mono mb-1.5 px-3.5 text-[10px] uppercase tracking-[0.16em]"
              style={{ color: 'var(--ink-soft)' }}
            >
              {t(group.label)}
            </div>
          ) : null}
          {group.items.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : item.href === '/dashboard/mentorship'
                ? pathname.startsWith('/dashboard/mentorship')
                : pathname.startsWith(item.href) &&
                  !(item.href === '/dashboard/courses' && mentorActive);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] font-medium transition-colors"
                style={
                  active
                    ? { background: activeBg, color: activeColor }
                    : { color: 'var(--ink-soft)' }
                }
              >
                <Icon size={17} strokeWidth={active ? 2.4 : 2} />
                <span className="min-w-0 flex-1 truncate">{t(item.label)}</span>
                {isNavBadgeHref(item.href) ? <NavCountBadge count={counts[item.href]} /> : null}
              </Link>
            );
          })}
        </div>
      ))}

      <div className="mt-4 border-t pt-4" style={{ borderColor: 'var(--line)' }}>
        <div className="mono mb-1.5 px-3.5 text-[10px] uppercase tracking-[0.16em]" style={{ color: 'var(--ink-soft)' }}>
          {isMentor ? t('Teaching') : t('Teach')}
        </div>
        <Link
          href={isMentor ? '/dashboard/teach' : '/dashboard/mentor'}
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] font-medium transition-colors"
          style={
            mentorActive || pathname.startsWith('/dashboard/teach')
              ? { background: 'rgba(74,144,226,0.12)', color: 'var(--blue-ink)' }
              : { color: 'var(--ink-soft)' }
          }
        >
          <GraduationCap
            size={17}
            strokeWidth={mentorActive || pathname.startsWith('/dashboard/teach') ? 2.4 : 2}
          />
          {isMentor ? t('Teaching home') : t('Apply to mentor')}
        </Link>
        {isMentor && (
          <>
            <Link
              href="/dashboard/teach/courses"
              onClick={onNavigate}
              className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] font-medium transition-colors"
              style={
                pathname.startsWith('/dashboard/teach/courses')
                  ? { background: activeBg, color: activeColor }
                  : { color: 'var(--ink-soft)' }
              }
            >
              <Video
                size={17}
                strokeWidth={pathname.startsWith('/dashboard/teach/courses') ? 2.4 : 2}
              />
              {t('Course studio')}
            </Link>
            <Link
              href="/dashboard/students"
              onClick={onNavigate}
              className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] font-medium transition-colors"
              style={
                pathname.startsWith('/dashboard/students')
                  ? { background: activeBg, color: activeColor }
                  : { color: 'var(--ink-soft)' }
              }
            >
              <Users
                size={17}
                strokeWidth={pathname.startsWith('/dashboard/students') ? 2.4 : 2}
              />
              {t('My Students')}
            </Link>
            <Link
              href="/dashboard/classroom"
              onClick={onNavigate}
              className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] font-medium transition-colors"
              style={
                pathname.startsWith('/dashboard/classroom')
                  ? { background: activeBg, color: activeColor }
                  : { color: 'var(--ink-soft)' }
              }
            >
              <School
                size={17}
                strokeWidth={pathname.startsWith('/dashboard/classroom') ? 2.4 : 2}
              />
              {t('My Classroom')}
            </Link>
            <Link
              href="/dashboard/teach/grading"
              onClick={onNavigate}
              className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] font-medium transition-colors"
              style={
                pathname.startsWith('/dashboard/teach/grading')
                  ? { background: activeBg, color: activeColor }
                  : { color: 'var(--ink-soft)' }
              }
            >
              <ClipboardList
                size={17}
                strokeWidth={pathname.startsWith('/dashboard/teach/grading') ? 2.4 : 2}
              />
              {t('Grading center')}
            </Link>
            <Link
              href="/dashboard/teach/monitoring"
              onClick={onNavigate}
              className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] font-medium transition-colors"
              style={
                pathname.startsWith('/dashboard/teach/monitoring')
                  ? { background: activeBg, color: activeColor }
                  : { color: 'var(--ink-soft)' }
              }
            >
              <Users
                size={17}
                strokeWidth={pathname.startsWith('/dashboard/teach/monitoring') ? 2.4 : 2}
              />
              {t('Monitoring')}
            </Link>
            <Link
              href="/dashboard/teach/assessments"
              onClick={onNavigate}
              className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] font-medium transition-colors"
              style={
                pathname.startsWith('/dashboard/teach/assessments')
                  ? { background: activeBg, color: activeColor }
                  : { color: 'var(--ink-soft)' }
              }
            >
              <ClipboardList
                size={17}
                strokeWidth={pathname.startsWith('/dashboard/teach/assessments') ? 2.4 : 2}
              />
              {t('Assessment Studio')}
            </Link>
            <Link
              href="/dashboard/teach/notes"
              onClick={onNavigate}
              className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] font-medium transition-colors"
              style={
                pathname.startsWith('/dashboard/teach/notes')
                  ? { background: activeBg, color: activeColor }
                  : { color: 'var(--ink-soft)' }
              }
            >
              <FileText
                size={17}
                strokeWidth={pathname.startsWith('/dashboard/teach/notes') ? 2.4 : 2}
              />
              {t('Notes Studio')}
            </Link>
          </>
        )}
      </div>

      {staffPermissions?.includes('staff.access') ? (
        <div className="mt-4 border-t pt-4" style={{ borderColor: 'var(--line)' }}>
          <div className="mono mb-1.5 px-3.5 text-[10px] uppercase tracking-[0.16em]" style={{ color: 'var(--ink-soft)' }}>
            {t('Institution')}
          </div>
          {staffNavFor(staffPermissions || []).map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] font-medium transition-colors"
                style={
                  active
                    ? { background: activeBg, color: activeColor }
                    : { color: 'var(--ink-soft)' }
                }
              >
                {item.href.includes('/fees') ? (
                  <Wallet size={17} strokeWidth={active ? 2.4 : 2} />
                ) : (
                  <Briefcase size={17} strokeWidth={active ? 2.4 : 2} />
                )}
                {t(item.label)}
              </Link>
            );
          })}
        </div>
      ) : null}
    </nav>
  );
}

function ContextSwitcher({
  user,
  accent = '#00b369',
  onSwitched,
}: {
  user: ShellUser;
  accent?: string;
  onSwitched?: () => void;
}) {
  const router = useRouter();
  const t = useT();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const active = user.activeContext ?? { kind: 'personal' as const };
  const affiliations = useMemo(() => user.affiliations ?? [], [user.affiliations]);

  const label = useMemo(() => {
    if (active.kind === 'institution') {
      const a = affiliations.find((x) => x.institutionSlug === active.institutionSlug);
      return a?.institutionName || active.institutionSlug || 'Campus';
    }
    if (active.kind === 'teaching') return 'Teaching';
    if (active.kind === 'mentorship') return 'Mentorship';
    if (active.kind === 'intellex') return 'InTelleX Academy';
    return 'Personal';
  }, [active.kind, active.institutionSlug, affiliations]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  async function switchTo(ctx: ActiveContext) {
    setBusy(true);
    try {
      const res = await fetch('/api/learn/context', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ctx),
      });
      if (!res.ok) return;
      setOpen(false);
      onSwitched?.();
      if (ctx.kind === 'institution' && ctx.institutionSlug) {
        router.push(`/dashboard/institutions/${ctx.institutionSlug}`);
      } else if (ctx.kind === 'teaching') {
        router.push('/dashboard/mentor');
      } else {
        router.push('/dashboard');
      }
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative mb-5 px-1" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={busy}
        className="flex w-full items-center gap-2 rounded-2xl border px-3 py-2.5 text-left transition-colors"
        style={{ borderColor: 'var(--line)' }}
      >
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-[11px] font-bold text-white"
          style={{ background: accent }}
        >
          {active.kind === 'institution' ? 'U' : 'IX'}
        </span>
        <span className="min-w-0 flex-1">
          <span className="mono block text-[9.5px] uppercase tracking-[0.14em]" style={{ color: 'var(--ink-soft)' }}>
            {t('Workspace')}
          </span>
          <span className="block truncate text-[13.5px] font-semibold">{t(label)}</span>
        </span>
        <ChevronDown size={15} style={{ color: 'var(--ink-soft)' }} />
      </button>

      {open && (
        <div
          className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-2xl border shadow-lg"
          style={{ borderColor: 'var(--line)', background: 'var(--paper)' }}
        >
          <ContextItem
            active={active.kind === 'personal' || active.kind === 'intellex'}
            title="InTelleX"
            subtitle={t('Personal learning home')}
            accent={accent}
            onClick={() => switchTo({ kind: 'personal', institutionSlug: null })}
          />
          {affiliations.map((a) => (
            <ContextItem
              key={a.institutionSlug}
              active={
                active.kind === 'institution' &&
                active.institutionSlug === a.institutionSlug
              }
              title={a.institutionName}
              subtitle={`${a.role} · ${a.status}`}
              accent={accent}
              onClick={() =>
                switchTo({
                  kind: 'institution',
                  institutionSlug: a.institutionSlug,
                })
              }
            />
          ))}
          <ContextItem
            active={active.kind === 'teaching'}
            title={t('Teaching')}
            subtitle={user.roles?.includes('mentor') ? t('Mentor Studio') : t('Apply to teach')}
            accent={accent}
            onClick={() => switchTo({ kind: 'teaching', institutionSlug: null })}
          />
          <Link
            href={user.isStudent ? '/dashboard/academic' : '/dashboard/apply'}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 border-t px-3 py-2.5 text-[12.5px] font-semibold"
            style={{ borderColor: 'var(--line)', color: accent }}
          >
            <GraduationCap size={14} />
            {user.isStudent ? t('Academic record') : t('Become a student')}
          </Link>
        </div>
      )}
    </div>
  );
}

function ContextItem({
  title,
  subtitle,
  active,
  accent,
  onClick,
}: {
  title: string;
  subtitle: string;
  active?: boolean;
  accent: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-2 px-3 py-2.5 text-left hover:bg-black/[0.03]"
    >
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13.5px] font-semibold">{title}</span>
        <span className="block truncate text-[11.5px]" style={{ color: 'var(--ink-soft)' }}>
          {subtitle}
        </span>
      </span>
      {active && <Check size={14} style={{ color: accent }} />}
    </button>
  );
}

export default function DashboardShell({
  user,
  children,
  minimal = false,
  campusBrand = null,
  staff = null,
}: {
  user: ShellUser;
  children: React.ReactNode;
  minimal?: boolean;
  campusBrand?: CampusBrand | null;
  staff?: { desks: StaffDesk[]; permissions: StaffPermission[] } | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useT();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navCounts, setNavCounts] = useState<NavCounts>(ZERO_NAV_COUNTS);

  const loadNavCounts = useCallback(async () => {
    try {
      const res = await fetch('/api/learn/nav-counts');
      if (!res.ok) return;
      const data = await res.json();
      if (data.counts) setNavCounts({ ...ZERO_NAV_COUNTS, ...data.counts });
    } catch {
      /* keep zeros */
    }
  }, []);

  useEffect(() => {
    void loadNavCounts();
    const id = window.setInterval(() => void loadNavCounts(), 20_000);
    const onVisible = () => {
      if (document.visibilityState === 'visible') void loadNavCounts();
    };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', onVisible);
    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', onVisible);
    };
  }, [loadNavCounts]);

  useEffect(() => {
    const href = NAV_SEEN_HREFS.find(
      (h) => pathname === h || pathname.startsWith(`${h}/`),
    );
    if (!href || !isNavSeenHref(href)) return;
    void fetch('/api/learn/nav-counts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ href }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.counts) setNavCounts({ ...ZERO_NAV_COUNTS, ...data.counts });
      })
      .catch(() => undefined);
  }, [pathname]);

  const inCampus =
    user.activeContext?.kind === 'institution' && Boolean(campusBrand);
  const accent = inCampus && campusBrand ? campusBrand.color : '#00b369';
  const campusRole =
    inCampus && campusBrand
      ? user.affiliations?.find((a) => a.institutionSlug === campusBrand.slug)?.role ||
        'member'
      : undefined;

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push(inCampus && campusBrand ? `/site/${campusBrand.slug}` : '/');
    router.refresh();
  }

  if (minimal) {
    return (
      <div className="min-h-screen bg-paper">
        <header
          className="sticky top-0 z-20 flex h-[64px] items-center gap-3 border-b px-4 backdrop-blur sm:px-8"
          style={{ borderColor: 'var(--line)', background: 'rgba(255,255,255,0.92)' }}
        >
          <BrandLogo href="/" height={30} variant="full" />
          <span className="mono ml-2 rounded-full border px-2 py-0.5 text-[9.5px] uppercase tracking-[0.14em]" style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}>
            Identity
          </span>
          <div className="ml-auto text-[13px] font-medium" style={{ color: 'var(--ink-soft)' }}>
            {user.email}
          </div>
        </header>
        <main className="px-4 pb-16 pt-6 sm:px-6">{children}</main>
      </div>
    );
  }

  const sidebarInner = (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-4 shrink-0 px-1">
        {inCampus && campusBrand ? (
          <Link href={`/site/${campusBrand.slug}`} className="flex items-center gap-2.5">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl text-[14px] font-bold text-white"
              style={{ background: accent }}
            >
              {campusBrand.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={campusBrand.logoUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                campusBrand.name.slice(0, 1)
              )}
            </span>
            <div className="min-w-0">
              <div className="truncate text-[14px] font-semibold leading-tight">{campusBrand.name}</div>
              <div className="mono text-[9px] uppercase tracking-[0.14em]" style={{ color: 'var(--ink-soft)' }}>
                {t('Powered by InTelleX')}
              </div>
            </div>
          </Link>
        ) : (
          <div className="flex items-center gap-2.5 px-1">
            <BrandLogo href="/" height={32} variant="full" />
          </div>
        )}
      </div>

      {user.onboardingComplete !== false && (
        <div className="shrink-0">
          <ContextSwitcher user={user} accent={accent} onSwitched={() => setMobileOpen(false)} />
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch] py-1 pr-0.5">
        <NavLinks
          pathname={pathname}
          isMentor={Boolean(user.roles?.includes('mentor'))}
          context={user.activeContext}
          accent={accent}
          campusBrand={campusBrand}
          campusRole={campusRole}
          staffPermissions={staff?.permissions || null}
          counts={navCounts}
          onNavigate={() => setMobileOpen(false)}
        />
      </div>

      <div
        className="shrink-0 space-y-1 border-t pt-3"
        style={{ borderColor: 'var(--line)' }}
      >
        {inCampus && (
          <p className="mono px-3.5 pb-2 text-[9.5px] uppercase tracking-[0.14em]" style={{ color: 'var(--ink-soft)' }}>
            {t('Powered by InTelleX')}
          </p>
        )}
        {inCampus && campusBrand ? (
          <Link
            href={`/site/${campusBrand.slug}`}
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] font-medium"
            style={{ color: 'var(--ink-soft)' }}
          >
            <Home size={17} />
            {t('Campus home')}
          </Link>
        ) : (
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] font-medium"
            style={{ color: 'var(--ink-soft)' }}
          >
            <Home size={17} />
            {t('Back to site')}
          </Link>
        )}
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-[14px] font-medium"
          style={{ color: 'var(--ink-soft)' }}
        >
          <LogOut size={17} />
          {t('Sign out')}
        </button>
      </div>
    </div>
  );

  const themeStyle = inCampus
    ? ({
        ['--green' as string]: accent,
        ['--green-deep' as string]: accent,
        ['--campus-accent' as string]: accent,
      } as React.CSSProperties)
    : undefined;

  return (
    <div className="min-h-screen bg-paper" style={themeStyle}>
      <aside
        className="fixed inset-y-0 left-0 z-30 hidden h-dvh max-h-dvh w-[240px] flex-col overflow-hidden border-r px-4 py-6 lg:flex"
        style={{
          borderColor: 'var(--line)',
          background: inCampus ? `${accent}08` : 'var(--paper)',
        }}
      >
        {sidebarInner}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside
            className="absolute inset-y-0 left-0 flex h-dvh max-h-dvh w-[min(280px,88vw)] flex-col overflow-hidden px-4 py-6 shadow-xl"
            style={{ background: 'var(--paper)' }}
          >
            {sidebarInner}
          </aside>
        </div>
      )}

      <header
        className="sticky top-0 z-20 flex h-[64px] items-center gap-3 border-b px-4 backdrop-blur lg:pl-[264px] lg:pr-8"
        style={{
          borderColor: 'var(--line)',
          background: inCampus ? `${accent}0d` : 'rgba(255,255,255,0.92)',
        }}
      >
        <button
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border lg:hidden"
          style={{ borderColor: 'var(--line)' }}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={t('Toggle navigation')}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        {inCampus && campusBrand ? (
          <div className="min-w-0 truncate lg:hidden">
            <span className="text-[14px] font-semibold" style={{ color: accent }}>
              {campusBrand.name}
            </span>
          </div>
        ) : null}

        {inCampus && campusBrand && (
          <div className="hidden min-w-0 lg:block">
            <div className="truncate text-[14px] font-semibold">{campusBrand.name}</div>
            <div className="text-[11.5px]" style={{ color: 'var(--ink-soft)' }}>
              {t(campusBrand.tagline || 'Digital campus')} · {t('Powered by InTelleX')}
            </div>
          </div>
        )}

        <div className="ml-auto flex min-w-0 items-center gap-1.5 sm:gap-4">
          <NotificationBell accent={accent} />
          <div
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-semibold"
            style={{ background: 'rgba(255,122,0,0.1)', color: '#c2570a' }}
            title={t('Learning streak')}
          >
            <Flame size={14} />
            {user.streakCount}
            <span className="hidden sm:inline">{t(user.streakCount === 1 ? 'day' : 'days')}</span>
          </div>
          <div
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-semibold"
            style={{ background: `${accent}1a`, color: accent }}
            title={t('Experience points')}
          >
            <Zap size={14} />
            {user.xp.toLocaleString()} XP
          </div>
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-2.5"
            title={user.email}
          >
            {user.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatar}
                alt={user.name}
                className="h-9 w-9 rounded-full object-cover"
              />
            ) : (
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-bold text-white"
                style={{ background: `linear-gradient(135deg, ${accent}, #1f5fa8)` }}
              >
                {initials(user.name) || 'IX'}
              </span>
            )}
            <span className="hidden max-w-[140px] truncate text-[13.5px] font-semibold md:block">
              {user.name}
            </span>
          </Link>
        </div>
      </header>
      <PushAlertsBanner accent={accent} />

      <main className="px-4 pb-28 pt-6 sm:px-6 lg:pb-16 lg:pl-[268px] lg:pr-10">
        <OngoingClassBanner accent={accent} />
        <CampusReturnBanner accent={accent} />
        {children}
      </main>
      <MobileBottomNav
        accent={accent}
        isMentor={Boolean(user.roles?.includes('mentor'))}
        isStaff={Boolean(staff?.permissions.includes('staff.access'))}
        campusSlug={inCampus && campusBrand ? campusBrand.slug : null}
        campusModules={(campusBrand?.enabledModules as string[]) || []}
        campusRole={campusRole || 'student'}
        counts={navCounts}
      />
    </div>
  );
}
