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
      className="section"
    >
      <div className="wrap">
        <div className="mb-8 max-w-[560px] sm:mb-10">
          <div className="eyebrow mb-2.5">Contact us</div>
          <h2 className="text-[28px] leading-[1.12] sm:text-[36px]">Talk to the team</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <a
            href={orientationWhatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="card group p-6"
          >
            <span
              className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl"
              style={{ background: 'rgba(0,179,105,0.12)', color: 'var(--green-deep)' }}
            >
              <Compass size={20} />
            </span>
            <h3 className="font-display text-[20px]">Student orientation</h3>
            <p className="mt-2 text-[14px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              Help choosing the right path.
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
            className="card group p-6"
          >
            <span
              className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl"
              style={{ background: 'rgba(15,23,42,0.06)', color: 'var(--ink)' }}
            >
              <Building2 size={20} />
            </span>
            <h3 className="font-display text-[20px]">Organizations & campuses</h3>
            <p className="mt-2 text-[14px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              How institutions join and integrate.
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
          className="card mt-4 flex flex-wrap items-center justify-between gap-4 px-5 py-4"
          style={{ background: 'var(--paper-dim)' }}
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
          <Link href="/contact" className="btn btn-ghost shrink-0 bg-paper">
            Open contact form
          </Link>
        </div>
      </div>
    </section>
  );
}
