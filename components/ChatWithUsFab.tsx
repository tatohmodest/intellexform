'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Building2,
  Compass,
  Mail,
  MessageCircle,
  X,
} from 'lucide-react';
import {
  PLATFORM_CONTACT,
  generalWhatsappLink,
  integrationWhatsappLink,
  orientationWhatsappLink,
  platformMailto,
} from '@/lib/contact';

const HIDDEN_PREFIXES = ['/admin', '/platform-admin', '/api'];

export default function ChatWithUsFab() {
  const pathname = usePathname() || '';
  const [open, setOpen] = useState(false);

  const hidden = HIDDEN_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const onDashboard = pathname.startsWith('/dashboard');

  if (hidden) return null;

  return (
    <div
      className={`pointer-events-none fixed right-4 z-[90] flex flex-col items-end gap-3 sm:right-6 ${
        onDashboard ? 'bottom-20 sm:bottom-7' : 'bottom-5 sm:bottom-7'
      }`}
    >
      {open ? (
        <div
          className="pointer-events-auto w-[min(100vw-2rem,340px)] border shadow-book"
          style={{ borderColor: 'var(--line)', background: 'var(--paper)', color: 'var(--ink)' }}
          role="dialog"
          aria-label="Chat with InTelleX"
        >
          <div
            className="flex items-start justify-between gap-3 border-b px-4 py-3.5"
            style={{ borderColor: 'var(--line)', background: 'var(--ink)', color: 'var(--paper)' }}
          >
            <div>
              <p className="font-display text-[18px] leading-tight">Chat with us</p>
              <p className="mt-1 text-[12.5px]" style={{ color: 'rgba(251,248,240,0.72)' }}>
                Students, campuses, and orgs — we reply on WhatsApp & email.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-8 w-8 items-center justify-center"
              aria-label="Close"
              style={{ color: 'rgba(251,248,240,0.8)' }}
            >
              <X size={18} />
            </button>
          </div>

          <ul className="p-2">
            <li>
              <a
                href={orientationWhatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-3 px-3 py-3 transition-colors hover:bg-black/[0.03]"
                onClick={() => setOpen(false)}
              >
                <span
                  className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center"
                  style={{ background: 'rgba(0,179,105,0.12)', color: 'var(--green-deep)' }}
                >
                  <Compass size={16} />
                </span>
                <span>
                  <span className="block text-[14px] font-semibold">Student orientation</span>
                  <span className="mt-0.5 block text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
                    Not sure which path to follow? Chat on WhatsApp.
                  </span>
                </span>
              </a>
            </li>
            <li>
              <a
                href={integrationWhatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-3 px-3 py-3 transition-colors hover:bg-black/[0.03]"
                onClick={() => setOpen(false)}
              >
                <span
                  className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center"
                  style={{ background: 'rgba(15,23,42,0.06)', color: 'var(--ink)' }}
                >
                  <Building2 size={16} />
                </span>
                <span>
                  <span className="block text-[14px] font-semibold">Organizations</span>
                  <span className="mt-0.5 block text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
                    How the platform works & how integration works.
                  </span>
                </span>
              </a>
            </li>
            <li>
              <a
                href={platformMailto()}
                className="flex gap-3 px-3 py-3 transition-colors hover:bg-black/[0.03]"
                onClick={() => setOpen(false)}
              >
                <span
                  className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center"
                  style={{ background: 'rgba(15,23,42,0.06)', color: 'var(--ink)' }}
                >
                  <Mail size={16} />
                </span>
                <span>
                  <span className="block text-[14px] font-semibold">Email us</span>
                  <span className="mt-0.5 block text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
                    {PLATFORM_CONTACT.email}
                  </span>
                </span>
              </a>
            </li>
            <li>
              <Link
                href="/contact"
                className="flex gap-3 px-3 py-3 transition-colors hover:bg-black/[0.03]"
                onClick={() => setOpen(false)}
              >
                <span
                  className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center"
                  style={{ background: 'rgba(0,179,105,0.12)', color: 'var(--green-deep)' }}
                >
                  <MessageCircle size={16} />
                </span>
                <span>
                  <span className="block text-[14px] font-semibold">Full contact form</span>
                  <span className="mt-0.5 block text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
                    Leave details — we follow up on WhatsApp or email.
                  </span>
                </span>
              </Link>
            </li>
          </ul>

          <div
            className="border-t px-4 py-3 text-[12px]"
            style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}
          >
            WhatsApp {PLATFORM_CONTACT.phoneDisplay}
            <span className="mx-1.5">·</span>
            <a
              href={generalWhatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold"
              style={{ color: 'var(--green-deep)' }}
            >
              Open chat
            </a>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="pointer-events-auto inline-flex items-center gap-2 px-4 py-3 text-[13.5px] font-semibold text-white shadow-book"
        style={{ background: 'var(--green)' }}
        aria-expanded={open}
        aria-label={open ? 'Close chat' : 'Chat with us'}
      >
        {open ? <X size={18} /> : <MessageCircle size={18} />}
        {open ? 'Close' : 'Chat with us'}
      </button>
    </div>
  );
}
