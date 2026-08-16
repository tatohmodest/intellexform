import Link from 'next/link';
import { Building2, Compass, Mail, MessageCircle } from 'lucide-react';
import {
  PLATFORM_CONTACT,
  integrationWhatsappLink,
  orientationWhatsappLink,
  platformMailto,
} from '@/lib/contact';

export default function ContactUsSection() {
  return (
    <section
      id="contact-us"
      className="border-t py-16 sm:py-24"
      style={{ borderColor: 'var(--line)', background: 'var(--paper)' }}
    >
      <div className="wrap">
        <div className="mb-10 max-w-[560px]">
          <div className="tab mb-4">Contact us</div>
          <h2 className="font-display text-[28px] leading-tight sm:text-[34px]">
            Talk to the Platform Team
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
            Students who need an orientation on which path to follow, and organizations that want to
            understand how InTelleX works and how integration works — reach us on WhatsApp or email.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <a
            href={orientationWhatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="group border p-6 transition-colors hover:border-[var(--ink)]"
            style={{ borderColor: 'var(--line)' }}
          >
            <span
              className="mb-4 inline-flex h-11 w-11 items-center justify-center"
              style={{ background: 'rgba(0,179,105,0.12)', color: 'var(--green-deep)' }}
            >
              <Compass size={20} />
            </span>
            <h3 className="font-display text-[20px]">Student orientation</h3>
            <p className="mt-2 text-[14px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              Get help choosing a learning path — courses, tutorials, mentorship, or membership —
              before you commit.
            </p>
            <span
              className="mt-4 inline-flex items-center gap-1.5 text-[13.5px] font-semibold"
              style={{ color: 'var(--green-deep)' }}
            >
              <MessageCircle size={15} /> Chat on WhatsApp
            </span>
          </a>

          <a
            href={integrationWhatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="group border p-6 transition-colors hover:border-[var(--ink)]"
            style={{ borderColor: 'var(--line)' }}
          >
            <span
              className="mb-4 inline-flex h-11 w-11 items-center justify-center"
              style={{ background: 'rgba(15,23,42,0.06)', color: 'var(--ink)' }}
            >
              <Building2 size={20} />
            </span>
            <h3 className="font-display text-[20px]">Organizations & campuses</h3>
            <p className="mt-2 text-[14px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              Ask how the platform works, how institutions join, and how integration (capabilities,
              roster, teaching) is set up.
            </p>
            <span
              className="mt-4 inline-flex items-center gap-1.5 text-[13.5px] font-semibold"
              style={{ color: 'var(--green-deep)' }}
            >
              <MessageCircle size={15} /> Chat on WhatsApp
            </span>
          </a>
        </div>

        <div
          className="mt-6 flex flex-wrap items-center justify-between gap-4 border px-5 py-4"
          style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}
        >
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13.5px]">
            <a
              href={platformMailto()}
              className="inline-flex items-center gap-1.5 font-semibold"
              style={{ color: 'var(--ink)' }}
            >
              <Mail size={14} /> {PLATFORM_CONTACT.email}
            </a>
            <span style={{ color: 'var(--ink-soft)' }}>
              WhatsApp {PLATFORM_CONTACT.phoneDisplay}
            </span>
          </div>
          <Link href="/contact" className="btn btn-g shrink-0 text-[13px]">
            Open contact form
          </Link>
        </div>
      </div>
    </section>
  );
}
