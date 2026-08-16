import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft, Building2, Compass, Mail, MessageCircle } from 'lucide-react';
import TopNav from '@/components/landing/TopNav';
import Footer from '@/components/landing/Footer';
import ContactWizard from '@/components/landing/ContactWizard';
import BrandLogo from '@/components/BrandLogo';
import {
  PLATFORM_CONTACT,
  integrationWhatsappLink,
  orientationWhatsappLink,
  platformMailto,
} from '@/lib/contact';

export const metadata = {
  title: 'Contact - InTelleX',
  description:
    'Contact InTelleX for student path orientation, mentorship quotes, or organization platform & integration questions. WhatsApp +237 650 318 856 · intellexplatform@gmail.com',
};

export default function ContactPage() {
  return (
    <>
      <TopNav />
      <section className="py-16">
        <div className="wrap grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm" style={{ color: 'var(--ink-soft)' }}>
              <ArrowLeft size={15} /> Back to home
            </Link>
            <BrandLogo href="/" height={32} className="mb-5" />
            <div className="tab mb-4">Contact us</div>
            <h1 className="mb-3.5 text-[26px] leading-[1.15] sm:text-[34px] sm:leading-[1.1]">
              Chat with the InTelleX team
            </h1>
            <p className="text-base leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              Students who need orientation on which path to follow, organizations that want to know
              how the platform and integration work, mentors, and campuses — tell us who you are. We
              save your message and continue on WhatsApp or email.
            </p>

            <div className="mt-6 grid gap-3">
              <a
                href={orientationWhatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-3 border p-3.5 transition-colors hover:border-[var(--ink)]"
                style={{ borderColor: 'var(--line)' }}
              >
                <Compass size={18} className="mt-0.5 shrink-0" style={{ color: 'var(--green-deep)' }} />
                <span>
                  <span className="block text-[14px] font-semibold">Student orientation</span>
                  <span className="text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
                    WhatsApp us for help choosing a path
                  </span>
                </span>
              </a>
              <a
                href={integrationWhatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-3 border p-3.5 transition-colors hover:border-[var(--ink)]"
                style={{ borderColor: 'var(--line)' }}
              >
                <Building2 size={18} className="mt-0.5 shrink-0" style={{ color: 'var(--ink)' }} />
                <span>
                  <span className="block text-[14px] font-semibold">Organizations</span>
                  <span className="text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
                    Platform walkthrough & how integration works
                  </span>
                </span>
              </a>
            </div>

            <ul className="mt-6 space-y-2 text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>
              <li className="flex items-center gap-2">
                <MessageCircle size={14} style={{ color: 'var(--green-deep)' }} />
                WhatsApp {PLATFORM_CONTACT.phoneDisplay}
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} style={{ color: 'var(--green-deep)' }} />
                <a href={platformMailto()} className="font-semibold" style={{ color: 'var(--ink)' }}>
                  {PLATFORM_CONTACT.email}
                </a>
              </li>
            </ul>
            <p className="mt-4 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
              Prefer the form? Fill it on the right — or use the{' '}
              <span className="font-semibold" style={{ color: 'var(--ink)' }}>Chat with us</span>{' '}
              button anywhere on the site.
            </p>
          </div>
          <Suspense
            fallback={
              <div
                className="min-h-[480px] animate-pulse rounded-[22px] border"
                style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}
              />
            }
          >
            <ContactWizard />
          </Suspense>
        </div>
      </section>
      <Footer />
    </>
  );
}
