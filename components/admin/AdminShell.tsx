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
  { href: '/admin/catalogue', label: 'Catalogue', icon: Trash2 },
  { href: '/admin/legacy/learning', label: 'Learning', icon: GraduationCap },
  { href: '/admin/legacy/requests', label: 'Requests', icon: MessageSquare },
  { href: '/admin/legacy/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/legacy/courses', label: 'Mongo courses', icon: BookOpen },
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
    <div className="min-h-screen" style={{ background: 'var(--paper)' }}>
      <header
        className="sticky top-0 z-40 border-b backdrop-blur"
        style={{ borderColor: 'var(--line)', background: 'rgba(251,248,240,0.92)' }}
      >
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <BrandLogo href="/" height={26} variant="full" />
            <div>
              <p className="font-display text-[15px] font-bold">Platform Admin</p>
              <p className="text-[11px]" style={{ color: 'var(--ink-soft)' }}>
                {email || 'admin'} · Supabase control plane
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="btn"
            style={{ padding: '8px 14px', background: 'rgba(220,38,38,0.1)', color: '#b91c1c' }}
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
        <nav className="mx-auto flex max-w-[1280px] gap-1 overflow-x-auto px-4 sm:px-6">
          {NAV.map((n) => {
            const active = pathname === n.href || pathname.startsWith(`${n.href}/`);
            return (
              <Link
                key={n.href}
                href={n.href}
                className="flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-2.5 text-[13px] font-medium"
                style={{
                  borderColor: active ? 'var(--green-deep)' : 'transparent',
                  color: active ? 'var(--green-deep)' : 'var(--ink-soft)',
                }}
              >
                <n.icon size={14} /> {n.label}
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
  );
}
