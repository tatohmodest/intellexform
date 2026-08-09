'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
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
} from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';
import MobileBottomNav from '@/components/dashboard/MobileBottomNav';
import NotificationBell from '@/components/dashboard/NotificationBell';
import OngoingClassBanner from '@/components/dashboard/OngoingClassBanner';
import type { ActiveContext, Affiliation, CampusBrand, PrimaryIntent } from '@/lib/learn/identity';
import { campusNavItems, type ModuleId } from '@/lib/eduos/capabilities';

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
}

const NAV = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/courses', label: 'My Courses', icon: BookOpen },
  { href: '/dashboard/my-learning', label: 'My Learning', icon: Sparkles },
  { href: '/dashboard/assignments', label: 'Assignments', icon: ClipboardList },
  { href: '/dashboard/classroom', label: 'My Classroom', icon: School },
  { href: '/dashboard/mentorship', label: 'Mentorship', icon: Users },
  { href: '/dashboard/library', label: 'Library', icon: BookMarked },
  { href: '/dashboard/notes', label: 'Notes', icon: FileText },
  { href: '/dashboard/videos', label: 'Video Hall', icon: Youtube },
  { href: '/dashboard/tutor', label: 'InTelleX AI', icon: Bot },
  { href: '/dashboard/institutions', label: 'Institutions', icon: Building2 },
  { href: '/dashboard/achievements', label: 'Achievements', icon: Trophy },
  { href: '/dashboard/notifications', label: 'Notifications', icon: Bell },
  { href: '/dashboard/subscription', label: 'Subscription', icon: Award },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
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
  onNavigate,
}: {
  pathname: string;
  isMentor: boolean;
  context?: ActiveContext;
  accent: string;
  campusBrand?: CampusBrand | null;
  campusRole?: string;
  onNavigate?: () => void;
}) {
  const searchParams = useSearchParams();
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
              {item.label}
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
          Personal InTelleX
        </Link>
        <div className="mt-4 border-t pt-4" style={{ borderColor: 'var(--line)' }}>
          <div className="mono mb-1.5 px-3.5 text-[10px] uppercase tracking-[0.16em]" style={{ color: 'var(--ink-soft)' }}>
            Network
          </div>
          <Link
            href="/dashboard/institutions"
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] font-medium"
            style={{ color: 'var(--ink-soft)' }}
          >
            <Sparkles size={17} />
            All institutions
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
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
            {item.label}
          </Link>
        );
      })}

      <div className="mt-4 border-t pt-4" style={{ borderColor: 'var(--line)' }}>
        <div className="mono mb-1.5 px-3.5 text-[10px] uppercase tracking-[0.16em]" style={{ color: 'var(--ink-soft)' }}>
          {isMentor ? 'Teaching' : 'Teach'}
        </div>
        <Link
          href="/dashboard/mentor"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] font-medium transition-colors"
          style={
            mentorActive
              ? { background: 'rgba(74,144,226,0.12)', color: 'var(--blue-ink)' }
              : { color: 'var(--ink-soft)' }
          }
        >
          <GraduationCap size={17} strokeWidth={mentorActive ? 2.4 : 2} />
          {isMentor ? 'Mentor Studio' : 'Apply to mentor'}
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
              Course Studio
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
              My Students
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
              My Classroom
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
              Assessment Studio
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
              Notes Studio
            </Link>
          </>
        )}
      </div>
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
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const active = user.activeContext ?? { kind: 'personal' as const };
  const affiliations = user.affiliations ?? [];

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
            Workspace
          </span>
          <span className="block truncate text-[13.5px] font-semibold">{label}</span>
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
            subtitle="Personal learning home"
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
            title="Teaching"
            subtitle={user.roles?.includes('mentor') ? 'Mentor Studio' : 'Apply to teach'}
            accent={accent}
            onClick={() => switchTo({ kind: 'teaching', institutionSlug: null })}
          />
          <Link
            href="/dashboard/institutions"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 border-t px-3 py-2.5 text-[12.5px] font-semibold"
            style={{ borderColor: 'var(--line)', color: accent }}
          >
            <Building2 size={14} /> Find more institutions
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
}: {
  user: ShellUser;
  children: React.ReactNode;
  minimal?: boolean;
  campusBrand?: CampusBrand | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

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
    router.push('/');
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
          <div className="flex items-center gap-2.5">
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
                Powered by InTelleX
              </div>
            </div>
          </div>
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
          onNavigate={() => setMobileOpen(false)}
        />
      </div>

      <div
        className="shrink-0 space-y-1 border-t pt-3"
        style={{ borderColor: 'var(--line)' }}
      >
        {inCampus && (
          <p className="mono px-3.5 pb-2 text-[9.5px] uppercase tracking-[0.14em]" style={{ color: 'var(--ink-soft)' }}>
            Powered by InTelleX
          </p>
        )}
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] font-medium"
          style={{ color: 'var(--ink-soft)' }}
        >
          <Home size={17} />
          Back to site
        </Link>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-[14px] font-medium"
          style={{ color: 'var(--ink-soft)' }}
        >
          <LogOut size={17} />
          Sign out
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
          aria-label="Toggle navigation"
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
              {campusBrand.tagline || 'Digital campus'} · Powered by InTelleX
            </div>
          </div>
        )}

        <div className="ml-auto flex min-w-0 items-center gap-1.5 sm:gap-4">
          <NotificationBell accent={accent} />
          <div
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-semibold"
            style={{ background: 'rgba(255,122,0,0.1)', color: '#c2570a' }}
            title="Learning streak"
          >
            <Flame size={14} />
            {user.streakCount}
            <span className="hidden sm:inline">day{user.streakCount === 1 ? '' : 's'}</span>
          </div>
          <div
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-semibold"
            style={{ background: `${accent}1a`, color: accent }}
            title="Experience points"
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

      <main className="px-4 pb-28 pt-6 sm:px-6 lg:pb-16 lg:pl-[268px] lg:pr-10">
        <OngoingClassBanner accent={accent} />
        {children}
      </main>
      <MobileBottomNav accent={accent} />
    </div>
  );
}
