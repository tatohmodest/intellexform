'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, ArrowRight, MessageCircle } from 'lucide-react';
import { buildWhatsappLink } from '@/lib/whatsapp';

const LINKS = [
  { href: '/#learn', label: 'Ways to learn' },
  { href: '/#fields', label: 'Fields' },
  { href: '/courses', label: 'Courses' },
  { href: '/#self-paced', label: 'Self-paced' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/#ai', label: 'AI Tutor' },
  { href: '/#testimonials', label: 'Stories' },
];

export default function TopNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
    <nav
      className="sticky top-0 z-40 border-b backdrop-blur"
      style={{ background: 'rgba(255,255,255,0.9)', borderColor: 'var(--line)' }}
    >
      <div className="mx-auto flex max-w-[1140px] items-center justify-between px-5 py-3 sm:px-6 sm:py-4 md:pl-12">
        <Link href="/" className="flex items-center" aria-label="Intellex home" onClick={() => setOpen(false)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/image.png" alt="Intellex" className="h-8 w-auto sm:h-9" />
        </Link>

        <div className="hidden items-center gap-7 text-sm md:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="opacity-75 transition-opacity hover:opacity-100">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/#register"
            className="hidden whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold text-paper sm:inline-block"
            style={{ background: 'var(--ink)' }}
          >
            Register
          </Link>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full md:hidden"
            style={{ background: 'var(--paper-dim)' }}
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>
      </nav>

      {/* App-like full-screen mobile menu — rendered outside <nav> so the nav's
          backdrop-blur doesn't trap this fixed overlay in a containing block. */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col md:hidden"
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

            <div className="flex flex-1 flex-col gap-1 overflow-y-auto px-5 py-4">
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i + 0.05 }}
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
              <Link href="/#register" onClick={() => setOpen(false)} className="btn btn-primary w-full">
                Register <ArrowRight size={18} />
              </Link>
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
