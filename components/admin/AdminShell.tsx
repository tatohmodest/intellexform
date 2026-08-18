'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Building2,
  ClipboardCheck,
  LayoutDashboard,
  LogOut,
  Network,
  Trash2,
  Users,
  Wallet,
  BookOpen,
  GraduationCap,
  MessageSquare,
  ShoppingBag,
  Tags,
  Menu,
  X,
  Award,
} from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';

const NAV = [
  { href: '/admin/overview', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/institutions', label: 'Organizations', icon: Building2 },
  { href: '/admin/intellex-institution', label: 'Intellex Institution', icon: GraduationCap },
  { href: '/admin/personnel', label: 'Personnel', icon: Users },
  { href: '/admin/staff', label: 'Staff posts', icon: Users },
  { href: '/admin/finance', label: 'Finance', icon: Wallet },
  { href: '/admin/applications', label: 'Applications', icon: ClipboardCheck },
  { href: '/admin/onboarding', label: 'Onboarding', icon: ClipboardCheck },
  { href: '/admin/plans', label: 'Plans & pricing', icon: Tags },
  { href: '/admin/connections', label: 'Connections', icon: Network },
  { href: '/admin/content', label: 'Content pricing', icon: Tags },
  { href: '/admin/library', label: 'Library', icon: BookOpen },
  { href: '/admin/catalogue', label: 'Catalogue', icon: Trash2 },
  { href: '/admin/legacy/learning', label: 'Learning', icon: GraduationCap },
  { href: '/admin/legacy/requests', label: 'Requests', icon: MessageSquare },
  { href: '/admin/legacy/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/legacy/courses', label: 'Mongo courses', icon: BookOpen },
  { href: '/admin/subscriptions', label: 'Subscriptions', icon: Award },
];

export default function AdminShell({
  email,
  onLogout,
  children,
  title,
}: {
  email?: string;
  onLogout: () => void;
  children: React.ReactNode;
  title?: string;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="px-4 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--line)' }}>
        <div>
          <BrandLogo href="/" height={28} variant="full" />
          <div className="mt-1 text-xs truncate max-w-[170px]" style={{ color: 'var(--ink-soft)' }}>
            {email || 'admin'}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="md:hidden p-1 rounded-md text-[var(--ink-soft)] hover:bg-black/5"
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
        {NAV.map((n) => {
          const active = pathname === n.href || pathname.startsWith(`${n.href}/`);
          const Icon = n.icon;
          return (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? 'bg-[rgba(0,179,105,0.08)] text-[var(--green-deep)] font-semibold'
                  : 'text-[var(--ink-soft)] hover:bg-black/5'
              }`}
            >
              <Icon size={17} />
              <span>{n.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t" style={{ borderColor: 'var(--line)' }}>
        <button
          type="button"
          onClick={onLogout}
          className="btn w-full inline-flex items-center justify-center gap-2"
          style={{ padding: '9px 12px', background: 'rgba(220,38,38,0.06)', color: '#b91c1c' }}
        >
          <LogOut size={15} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--paper)' }}>
      {/* Desktop Sidebar (Always Visible) */}
      <aside
        className="hidden md:flex md:w-64 shrink-0 flex-col border-r sticky top-0 h-screen"
        style={{ borderColor: 'var(--line)', background: 'rgba(251,248,240,0.95)' }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-[100] w-72 transform border-r transition-transform duration-200 ease-in-out md:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ borderColor: 'var(--line)', background: 'var(--paper)' }}
      >
        {sidebarContent}
      </aside>

      {/* Main Container */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile Header Bar with Hamburger */}
        <header
          className="md:hidden sticky top-0 z-20 flex items-center justify-between border-b px-4 py-3"
          style={{ borderColor: 'var(--line)', background: 'rgba(251,248,240,0.95)' }}
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="p-1.5 rounded-lg border text-[var(--ink)]"
              style={{ borderColor: 'var(--line)' }}
              aria-label="Open sidebar navigation"
            >
              <Menu size={20} />
            </button>
            <BrandLogo href="/" height={26} variant="full" />
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="btn text-xs font-semibold px-3 py-1.5"
            style={{ background: 'rgba(220,38,38,0.08)', color: '#b91c1c' }}
          >
            Logout
          </button>
        </header>

        <main className="mx-auto w-full max-w-[1280px] px-4 py-8 sm:px-6">
          {title ? (
            <h1 className="mb-6 font-display text-[28px] leading-tight">{title}</h1>
          ) : null}
          {children}
        </main>
      </div>
    </div>
  );
}
