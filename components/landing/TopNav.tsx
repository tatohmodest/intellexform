'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, ArrowRight, MessageCircle, ChevronDown } from 'lucide-react';
import { buildWhatsappLink } from '@/lib/whatsapp';
import { EXPLORE_NAV, LEARN_NAV, TUTORIAL_NAV } from '@/lib/tutorials/nav';
import HeaderSearch from '@/components/landing/HeaderSearch';

type NavItem = {
  href: string;
  label: string;
  desc?: string;
  tag?: string;
};

type NavGroup = {
  id: string;
  label: string;
  href: string;
  items: readonly NavItem[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    id: 'learn',
    label: 'Learn',
    href: '/courses',
    items: LEARN_NAV,
  },
  {
    id: 'tutorials',
    label: 'Tutorials',
    href: '/tutorials',
    items: TUTORIAL_NAV.map((t) => ({
      href: t.href,
      label: t.label,
      desc: t.tag,
    })),
  },
  {
    id: 'explore',
    label: 'Explore',
    href: '/#ecosystem',
    items: EXPLORE_NAV,
  },
];

const FLAT_LINKS = [
  { href: '/certifications', label: 'Certificates' },
  { href: '/#pricing', label: 'Pricing' },
];

export default function TopNav() {
  const [open, setOpen] = useState(false);
  const [desktopMenu, setDesktopMenu] = useState<string | null>(null);
  const [mobileSection, setMobileSection] = useState<string | null>('tutorials');
  const [authed, setAuthed] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => setAuthed(r.ok))
      .catch(() => setAuthed(false));
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!navRef.current?.contains(event.target as Node)) {
        setDesktopMenu(null);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setDesktopMenu(null);
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return (
    <>
      <nav
        ref={navRef}
        className="sticky top-0 z-[100] overflow-visible border-b backdrop-blur"
        style={{ background: 'rgba(255,255,255,0.95)', borderColor: 'var(--line)' }}
        aria-label="Primary"
      >
        <div className="mx-auto flex w-full max-w-[1140px] items-center justify-between gap-3 overflow-visible px-5 py-3 sm:gap-4 sm:px-6 sm:py-4 md:pl-12">
          <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
            <Link href="/" className="flex shrink-0 items-center" aria-label="Intellex home" onClick={() => setOpen(false)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/image.png" alt="Intellex" className="h-8 w-auto sm:h-9" />
            </Link>
            <HeaderSearch />
          </div>

          {/* Always extreme-right: Register + Menu (and desktop nav) */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-1 lg:flex">
              {NAV_GROUPS.map((group) => {
                const isOpen = desktopMenu === group.id;
                return (
                  <div
                    key={group.id}
                    className="relative"
                    onMouseEnter={() => setDesktopMenu(group.id)}
                    onMouseLeave={() => setDesktopMenu(null)}
                  >
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm opacity-75 transition-opacity hover:opacity-100"
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                      onClick={() => setDesktopMenu(isOpen ? null : group.id)}
                    >
                      {group.label}
                      <ChevronDown
                        size={14}
                        className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        style={{ color: 'var(--ink-soft)' }}
                      />
                    </button>

                    <AnimatePresence>
                      {isOpen ? (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 4 }}
                          transition={{ duration: 0.16, ease: 'easeOut' }}
                          className="absolute left-0 top-full z-[120] pt-2"
                        >
                          <div
                            className="w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border shadow-card"
                            style={{ background: 'var(--paper)', borderColor: 'var(--line)' }}
                          >
                            <Link
                              href={group.href}
                              className="block border-b px-4 py-3 text-sm font-semibold transition-colors hover:bg-[var(--paper-dim)]"
                              style={{ borderColor: 'var(--line)', color: 'var(--green-deep)' }}
                              onClick={() => setDesktopMenu(null)}
                            >
                              All {group.label} →
                            </Link>
                            <ul
                              className={`grid gap-0.5 p-2 ${
                                group.id === 'tutorials' ? 'max-h-[22rem] overflow-y-auto' : ''
                              }`}
                            >
                              {group.items.map((item) => (
                                <li key={item.href}>
                                  <Link
                                    href={item.href}
                                    className="block rounded-xl px-3 py-2.5 transition-colors hover:bg-[var(--paper-dim)]"
                                    onClick={() => setDesktopMenu(null)}
                                  >
                                    <span className="block text-sm font-medium">{item.label}</span>
                                    {item.desc || item.tag ? (
                                      <span className="mt-0.5 block text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                                        {item.desc || item.tag}
                                      </span>
                                    ) : null}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                );
              })}

              {FLAT_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-full px-3 py-2 text-sm opacity-75 transition-opacity hover:opacity-100"
                >
                  {l.label}
                </Link>
              ))}
            </div>

            {authed ? (
              <Link
                href="/dashboard"
                className="hidden whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold text-white sm:inline-block"
                style={{ background: 'var(--green)' }}
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-semibold opacity-80 transition-opacity hover:opacity-100 sm:inline-block"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="hidden whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold text-paper sm:inline-block"
                  style={{ background: 'var(--ink)' }}
                >
                  Sign up
                </Link>
              </>
            )}
            <button
              className="flex h-10 w-10 items-center justify-center rounded-full lg:hidden"
              style={{ background: 'var(--paper-dim)' }}
              onClick={() => setOpen((o) => !o)}
              aria-label="Menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* App-like full-screen mobile menu - rendered outside <nav> so the nav's
          backdrop-blur doesn't trap this fixed overlay in a containing block. */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[10000] flex flex-col lg:hidden"
            style={{ background: 'var(--paper)' }}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <div className="flex items-center justify-between border-b px-5 py-3" style={{ borderColor: 'var(--line)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/image.png" alt="Intellex" className="h-8 w-auto" />
              <button
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{ background: 'var(--paper-dim)' }}
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-5 py-4">
              {NAV_GROUPS.map((group, i) => {
                const isOpen = mobileSection === group.id;
                return (
                  <motion.div
                    key={group.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i + 0.05 }}
                    className="rounded-2xl border"
                    style={{ borderColor: 'var(--line)' }}
                  >
                    <button
                      type="button"
                      className="flex w-full items-center justify-between px-4 py-3.5 text-left font-display text-[20px]"
                      aria-expanded={isOpen}
                      onClick={() => setMobileSection(isOpen ? null : group.id)}
                    >
                      {group.label}
                      <ChevronDown
                        size={18}
                        className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        style={{ color: 'var(--ink-soft)' }}
                      />
                    </button>
                    {isOpen ? (
                      <div className="border-t px-2 py-2" style={{ borderColor: 'var(--line)' }}>
                        <Link
                          href={group.href}
                          onClick={() => setOpen(false)}
                          className="block rounded-xl px-3 py-2.5 text-sm font-semibold"
                          style={{ color: 'var(--green-deep)' }}
                        >
                          All {group.label} →
                        </Link>
                        {group.items.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className="flex items-center justify-between rounded-xl px-3 py-2.5 text-[15px]"
                          >
                            <span>
                              <span className="block">{item.label}</span>
                              {item.desc || item.tag ? (
                                <span className="block text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                                  {item.desc || item.tag}
                                </span>
                              ) : null}
                            </span>
                            <ArrowRight size={16} style={{ color: 'var(--ink-soft)' }} />
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </motion.div>
                );
              })}

              {FLAT_LINKS.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * (NAV_GROUPS.length + i) + 0.05 }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between border-b py-4 font-display text-[22px]"
                    style={{ borderColor: 'var(--line)' }}
                  >
                    {l.label}
                    <ArrowRight size={18} style={{ color: 'var(--ink-soft)' }} />
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col gap-3 border-t p-5" style={{ borderColor: 'var(--line)' }}>
              {authed ? (
                <Link href="/dashboard" onClick={() => setOpen(false)} className="btn btn-primary w-full">
                  Go to Dashboard <ArrowRight size={18} />
                </Link>
              ) : (
                <>
                  <Link href="/signup" onClick={() => setOpen(false)} className="btn btn-primary w-full">
                    Sign up with LoopingBinary <ArrowRight size={18} />
                  </Link>
                  <Link href="/login" onClick={() => setOpen(false)} className="btn btn-ghost w-full">
                    Sign in
                  </Link>
                </>
              )}
              <a
                href={buildWhatsappLink('Hello Intellex! I have a question about the platform.')}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="btn btn-ghost w-full"
              >
                <MessageCircle size={18} /> Chat on WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
