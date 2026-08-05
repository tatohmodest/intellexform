'use client';

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
} from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';

const NAV = [
  { href: '/admin/overview', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/institutions', label: 'Institutions', icon: Building2 },
  { href: '/admin/personnel', label: 'Personnel', icon: Users },
  { href: '/admin/finance', label: 'Finance', icon: Wallet },
  { href: '/admin/applications', label: 'Applications', icon: ClipboardCheck },
  { href: '/admin/onboarding', label: 'Onboarding', icon: ClipboardCheck },
  { href: '/admin/connections', label: 'Connections', icon: Network },
  { href: '/admin/content', label: 'Content pricing', icon: Tags },
  { href: '/admin/library', label: 'Library', icon: BookOpen },
  { href: '/admin/catalogue', label: 'Catalogue', icon: Trash2 },
  { href: '/admin/legacy/learning', label: 'Learning', icon: GraduationCap },
  { href: '/admin/legacy/requests', label: 'Requests', icon: MessageSquare },
  { href: '/admin/legacy/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/legacy/courses', label: 'Mongo courses', icon: BookOpen },
  { href: '/admin/subscriptions', label: 'Subscriptions', icon: Wallet },
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

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--paper)' }}>
      {/* Sidebar */}
      <aside className="hidden md:flex md:w-64 flex-col border-r" style={{ borderColor: 'var(--line)', background: 'rgba(251,248,240,0.92)' }}>
        <div className="px-4 py-4">
          <BrandLogo href="/" height={28} variant="full" />
          <div className="mt-3 text-sm" style={{ color: 'var(--ink-soft)' }}>{email || 'admin'}</div>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 py-4">
          {NAV.map((n) => {
            const active = pathname === n.href || pathname.startsWith(`${n.href}/`);
            const Icon = n.icon;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 mb-1 text-sm font-medium ${active ? 'bg-[rgba(0,179,105,0.06)] text-[var(--green-deep)]' : 'text-[var(--ink-soft)] hover:bg-black/5'}`}
              >
                <Icon size={16} />
                <span>{n.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="px-4 py-4 border-t" style={{ borderColor: 'var(--line)' }}>
          <button type="button" onClick={onLogout} className="btn w-full" style={{ padding: '8px 12px', background: 'rgba(220,38,38,0.04)', color: '#b91c1c' }}>
            <LogOut size={14} />
            <span className="ml-2">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1">
        <header className="md:hidden border-b" style={{ borderColor: 'var(--line)', background: 'rgba(251,248,240,0.92)' }}>
          <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <BrandLogo href="/" height={26} variant="full" />
            <button type="button" onClick={onLogout} className="btn" style={{ padding: '8px 14px', background: 'rgba(220,38,38,0.1)', color: '#b91c1c' }}>
              <LogOut size={14} /> Logout
            </button>
          </div>
          <nav className="mx-auto flex max-w-[1280px] gap-1 overflow-x-auto px-4 sm:px-6">
            {NAV.map((n) => {
              const active = pathname === n.href || pathname.startsWith(`${n.href}/`);
              const Icon = n.icon;
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className="flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-2.5 text-[13px] font-medium"
                  style={{ borderColor: active ? 'var(--green-deep)' : 'transparent', color: active ? 'var(--green-deep)' : 'var(--ink-soft)' }}
                >
                  <Icon size={14} /> {n.label}
                </Link>
              );
            })}
          </nav>
        </header>

        <main className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6">
          {title ? (
            <h1 className="mb-6 font-display text-[28px] leading-tight">{title}</h1>
          ) : null}
          {children}
        </main>
      </div>
    </div>
  );
}
