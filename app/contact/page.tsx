import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft, Building2, Compass, Mail, MessageCircle } from 'lucide-react';
import TopNav from '@/components/landing/TopNav';
import Footer from '@/components/landing/Footer';
import ContactWizard from '@/components/landing/ContactWizard';
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
    <div className="site">
      <TopNav />
      <section className="px-3 pt-3 sm:px-5 sm:pt-4">
        <div className="relative mx-auto max-w-[1360px] overflow-hidden rounded-[32px] bg-[#e3e6da]">
          {/* Faint vertical lines, as in the step-form reference */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: 'linear-gradient(90deg, rgba(18,50,79,0.06) 1px, transparent 1px)',
              backgroundSize: '25% 100%',
            }}
          />
          <div className="relative grid items-center gap-12 px-5 py-12 sm:px-10 sm:py-16 lg:grid-cols-[0.85fr_1.15fr] lg:px-16">
            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3.5 py-1.5 text-[13px] font-semibold text-[var(--navy)] hover:bg-white"
              >
                <ArrowLeft size={14} /> Back to home
              </Link>
              <h1 className="mt-6 text-[36px] font-extrabold leading-[1.08] text-[var(--navy)] sm:text-[48px]">
                Chat with the InTelleX team
              </h1>
              <p className="mt-4 max-w-[460px] text-[16px] leading-relaxed text-[var(--navy)]/75">
                Learners choosing a path, institutions exploring the platform, mentors and campuses. Tell us
                who you are and we will continue on WhatsApp or email.
              </p>

              <div className="mt-7 grid gap-3 sm:max-w-[420px]">
                <a
                  href={orientationWhatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 rounded-2xl bg-white p-4 transition-transform hover:-translate-y-0.5"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--pastel-mint)] text-[var(--green-deep)]">
                    <Compass size={19} />
                  </span>
                  <span>
                    <span className="block text-[15px] font-bold text-[var(--navy)]">Student orientation</span>
                    <span className="text-[13px] text-[var(--ink-soft)]">WhatsApp us for help choosing a path</span>
                  </span>
                </a>
                <a
                  href={integrationWhatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 rounded-2xl bg-white p-4 transition-transform hover:-translate-y-0.5"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--pastel-sky)] text-[var(--navy)]">
                    <Building2 size={19} />
                  </span>
                  <span>
                    <span className="block text-[15px] font-bold text-[var(--navy)]">Organizations</span>
                    <span className="text-[13px] text-[var(--ink-soft)]">Platform walkthrough & how integration works</span>
                  </span>
                </a>
              </div>

              <ul className="mt-6 space-y-2 text-[14px] text-[var(--navy)]/75">
                <li className="flex items-center gap-2">
                  <MessageCircle size={15} className="text-[var(--green-deep)]" />
                  WhatsApp {PLATFORM_CONTACT.phoneDisplay}
                </li>
                <li className="flex items-center gap-2">
                  <Mail size={15} className="text-[var(--green-deep)]" />
                  <a href={platformMailto()} className="font-semibold text-[var(--navy)]">
                    {PLATFORM_CONTACT.email}
                  </a>
                </li>
              </ul>
            </div>
            <Suspense fallback={<div className="mx-auto min-h-[520px] w-full max-w-[560px] animate-pulse rounded-[32px] bg-white/60" />}>
              <ContactWizard />
            </Suspense>
          </div>
        </div>
      </section>
      <div className="h-16" />
      <Footer />
    </div>
  );
}
