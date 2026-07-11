'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const LINKS = [
  { href: '/#learn', label: 'Ways to learn' },
  { href: '/#fields', label: 'Fields' },
  { href: '/courses', label: 'Courses' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/#ai', label: 'AI Tutor' },
  { href: '/#testimonials', label: 'Stories' },
];

export default function TopNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-30 border-b backdrop-blur"
      style={{ background: 'rgba(255,255,255,0.88)', borderColor: 'var(--line)' }}
    >
      <div className="mx-auto flex max-w-[1140px] items-center justify-between px-6 py-4 md:pl-12">
        <Link href="/" className="flex items-center" aria-label="Intellex home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Intellex" className="h-6 w-auto sm:h-7" />
        </Link>

        <div className="hidden items-center gap-7 text-sm md:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="opacity-75 transition-opacity hover:opacity-100">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/#register"
            className="whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold text-paper"
            style={{ background: 'var(--ink)' }}
          >
            Register
          </Link>
          <button className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t px-6 py-3 md:hidden" style={{ borderColor: 'var(--line)' }}>
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-2.5 text-sm opacity-80"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
