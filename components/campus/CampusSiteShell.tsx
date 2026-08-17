'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import CampusPwaBrand from '@/components/CampusPwaBrand';

export type CampusShellBrand = {
  slug: string;
  platformName: string;
  accent: string;
  logoUrl?: string | null;
  navLinks: { label: string; href: string }[];
  homeHref: string;
  loginHref: string;
  signupHref: string;
  enrollmentOpen?: boolean;
  footerNote?: string;
  email?: string | null;
  website?: string | null;
};

/**
 * White-label chrome for academy public pages.
 * Logo always returns to the campus home — never the InTelleX marketing site.
 */
export default function CampusSiteShell({
  brand,
  children,
  active = 'home',
}: {
  brand: CampusShellBrand;
  children: React.ReactNode;
  active?: 'home' | 'login' | 'signup';
}) {
  const [open, setOpen] = useState(false);
  const accent = brand.accent || '#00B369';

  return (
    <div className="min-h-screen" style={{ background: 'var(--paper)', color: 'var(--ink)' }}>
      <CampusPwaBrand
        brand={{
          slug: brand.slug,
          name: brand.platformName,
          accent,
          logoUrl: brand.logoUrl,
        }}
      />

      <header
        className="sticky top-0 z-40 border-b backdrop-blur-md"
        style={{
          borderColor: 'var(--line)',
          background: 'rgba(255,255,255,0.92)',
        }}
      >
        <div className="mx-auto flex h-[64px] max-w-[1100px] items-center gap-4 px-5 sm:px-8">
          <Link href={brand.homeHref} className="flex min-w-0 items-center gap-2.5">
            {brand.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={brand.logoUrl}
                alt={brand.platformName}
                className="h-9 w-9 object-contain"
              />
            ) : (
              <span
                className="flex h-9 w-9 items-center justify-center font-display text-[16px] font-bold text-white"
                style={{ background: accent }}
              >
                {brand.platformName.charAt(0)}
              </span>
            )}
            <span className="truncate font-display text-[18px] leading-none tracking-tight">
              {brand.platformName}
            </span>
          </Link>

          <nav className="ml-auto hidden items-center gap-5 md:flex">
            {brand.navLinks.map((l) => (
              <a
                key={`${l.label}-${l.href}`}
                href={l.href.startsWith('#') ? `${brand.homeHref}${l.href}` : l.href}
                className="text-[13px] font-semibold"
                style={{ color: 'var(--ink-soft)' }}
              >
                {l.label}
              </a>
            ))}
            {active !== 'login' && (
              <Link
                href={brand.loginHref}
                className="text-[13px] font-semibold"
                style={{ color: 'var(--ink)' }}
              >
                Sign in
              </Link>
            )}
            {active !== 'signup' && (
              <Link
                href={brand.enrollmentOpen ? brand.signupHref : brand.loginHref}
                className="px-3.5 py-2 text-[13px] font-semibold text-white"
                style={{ background: accent }}
              >
                {brand.enrollmentOpen ? 'Join' : 'Sign in'}
              </Link>
            )}
          </nav>

          <button
            type="button"
            className="ml-auto flex h-10 w-10 items-center justify-center md:hidden"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            style={{ color: 'var(--ink)' }}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {open ? (
          <div
            className="border-t px-5 py-4 md:hidden"
            style={{ borderColor: 'var(--line)', background: 'var(--paper)' }}
          >
            <div className="flex flex-col gap-3">
              {brand.navLinks.map((l) => (
                <a
                  key={`m-${l.label}-${l.href}`}
                  href={l.href.startsWith('#') ? `${brand.homeHref}${l.href}` : l.href}
                  className="py-1 text-[15px] font-semibold"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </a>
              ))}
              <Link href={brand.loginHref} className="py-1 text-[15px] font-semibold" onClick={() => setOpen(false)}>
                Sign in
              </Link>
              <Link
                href={brand.enrollmentOpen ? brand.signupHref : brand.loginHref}
                className="mt-1 inline-flex justify-center px-4 py-2.5 text-[14px] font-semibold text-white"
                style={{ background: accent }}
                onClick={() => setOpen(false)}
              >
                {brand.enrollmentOpen ? 'Create account' : 'Enter campus'}
              </Link>
            </div>
          </div>
        ) : null}
      </header>

      {children}

      <footer
        className="border-t px-5 py-10 sm:px-8"
        style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}
      >
        <div className="mx-auto flex max-w-[1100px] flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link href={brand.homeHref} className="inline-flex items-center gap-2.5">
              {brand.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={brand.logoUrl} alt="" className="h-8 w-8 object-contain" />
              ) : (
                <span
                  className="flex h-8 w-8 items-center justify-center text-[13px] font-bold text-white"
                  style={{ background: accent }}
                >
                  {brand.platformName.charAt(0)}
                </span>
              )}
              <span className="font-display text-[18px]">{brand.platformName}</span>
            </Link>
            <p className="mt-2 max-w-md text-[13px]" style={{ color: 'var(--ink-soft)' }}>
              {brand.footerNote || `${brand.platformName} learning campus`}
            </p>
          </div>
          <div className="text-[12px]" style={{ color: 'var(--ink-soft)' }}>
            {brand.email ? (
              <a href={`mailto:${brand.email}`} className="block font-semibold" style={{ color: accent }}>
                {brand.email}
              </a>
            ) : null}
            {brand.website ? (
              <a
                href={brand.website}
                target="_blank"
                rel="noreferrer"
                className="mt-1 block font-semibold"
                style={{ color: accent }}
              >
                Website
              </a>
            ) : null}
            <p className="mt-3">Powered by InTelleX</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
