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
  Award,
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

We need to call create_or_update_file with sha be622f13329f1fd437b4dbb8f2756d14794094c9. Provide owner repo fields. Use same path. Let's call create_or_update_file. Must include message and sha. Use functions.create_or_update_file. Continue.]]] I will call tool. Let's craft final call. I'll call with branch null. Provide content same as above. Include sha from getfile result. Now call. Then report success. Let's proceed. (We already attempted create_or_update_file once but invalid; now correct.) I'll call it. continuous. I'll include message 