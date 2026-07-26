'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
} from 'lucide-react';

export interface ShellUser {
  name: string;
  email: string;
  avatar: string | null;
  xp: number;
  streakCount: number;
  roles?: string[];
}

const NAV = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/courses', label: 'My Courses', icon: BookOpen },
  { href: '/dashboard/mentorship', label: 'Mentorship', icon: Users },
  { href: '/dashboard/library', label: 'Library', icon: BookMarked },
  { href: '/dashboard/videos', label: 'Video Hall', icon: Youtube },
  { href: '/dashboard/tutor', label: 'AI Tutor', icon: Bot },
  { href: '/dashboard/institutions', label: 'Institutions', icon: Building2 },
  { href: '/dashboard/achievements', label: 'Achievements', icon: Trophy },
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
  onNavigate,
}: {
  pathname: string;
  isMentor: boolean;
  onNavigate?: () => void;
}) {
  const mentorActive = pathname.startsWith('/dashboard/mentor') && !pathname.startsWith('/dashboard/mentorship');
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : item.href === '/dashboard/mentorship'
            ? pathname.startsWith('/dashboard/mentorship')
            : pathname.startsWith(item.href) && !(item.href === '/dashboard/courses' && mentorActive);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] font-medium transition-colors"
            style={
              active
                ? { background: 'rgba(0,179,105,0.1)', color: 'var(--green-deep)' }
                : { color: 'var(--ink-soft)' }
            }
          >
            <Icon size={17} strokeWidth={active ? 2.4 : 2} />
            {item.label}
          </Link>
        );
      })}

      {/* Progressive disclosure: teaching tools appear when you're a mentor. */}
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
          {isMentor ? 'Mentor Studio' : 'Become a mentor'}
        </Link>
      </div>
    </nav>
  );
}

export default function DashboardShell({
  user,
  children,
}: {
  user: ShellUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  }

  const sidebarInner = (
    <>
      <div className="mb-8 flex items-center gap-2 px-2">
        <Link href="/" className="font-display text-[20px] font-semibold">
          Intellex
        </Link>
        <span className="mono rounded-full border px-2 py-0.5 text-[9.5px] uppercase tracking-[0.14em]" style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}>
          Learn
        </span>
      </div>

      <NavLinks
        pathname={pathname}
        isMentor={Boolean(user.roles?.includes('mentor'))}
        onNavigate={() => setMobileOpen(false)}
      />

      <div className="mt-auto space-y-1 pt-6">
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
    </>
  );

  return (
    <div className="min-h-screen bg-paper">
      {/* Desktop sidebar */}
      <aside
        className="fixed inset-y-0 left-0 z-30 hidden w-[240px] flex-col border-r px-4 py-6 lg:flex"
        style={{ borderColor: 'var(--line)', background: 'var(--paper)' }}
      >
        {sidebarInner}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside
            className="absolute inset-y-0 left-0 flex w-[260px] flex-col px-4 py-6"
            style={{ background: 'var(--paper)' }}
          >
            {sidebarInner}
          </aside>
        </div>
      )}

      {/* Topbar */}
      <header
        className="sticky top-0 z-20 flex h-[64px] items-center gap-3 border-b px-4 backdrop-blur lg:pl-[264px] lg:pr-8"
        style={{ borderColor: 'var(--line)', background: 'rgba(255,255,255,0.92)' }}
      >
        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg border lg:hidden"
          style={{ borderColor: 'var(--line)' }}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <div className="lg:hidden">
          <span className="font-display text-[17px] font-semibold">Intellex</span>
        </div>

        <div className="ml-auto flex items-center gap-2.5 sm:gap-4">
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
            style={{ background: 'rgba(0,179,105,0.1)', color: 'var(--green-deep)' }}
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
                style={{ background: 'linear-gradient(135deg, #00b369, #1f5fa8)' }}
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

      {/* Content */}
      <main className="px-4 pb-16 pt-6 sm:px-6 lg:pl-[268px] lg:pr-10">{children}</main>
    </div>
  );
}
