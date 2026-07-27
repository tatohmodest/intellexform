import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import TopNav from '@/components/landing/TopNav';
import Footer from '@/components/landing/Footer';
import ContactWizard from '@/components/landing/ContactWizard';
import BrandLogo from '@/components/BrandLogo';
import { PLATFORM_CONTACT } from '@/lib/contact';

export const metadata = {
  title: 'Contact - InTelleX',
  description:
    'Contact InTelleX for learning questions, mentorship quotes, or institution partnership inquiries.',
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
            <div className="tab mb-4">Contact</div>
            <h1 className="mb-3.5 text-[26px] leading-[1.15] sm:text-[34px] sm:leading-[1.1]">
              Talk to the InTelleX team
            </h1>
            <p className="text-base leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              Learners, mentors, and institutions use this form. Tell us who you are - we save your
              message and can continue the conversation on WhatsApp. To start learning right away,{' '}
              <Link href="/signup" className="font-semibold" style={{ color: 'var(--green-deep)' }}>
                sign up
              </Link>
              .
            </p>
            <ul className="mt-6 space-y-2.5 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
              <li>
                <span className="font-semibold" style={{ color: 'var(--ink)' }}>Learners</span>
                {' - '}plans, courses, AI tutor questions
              </li>
              <li>
                <span className="font-semibold" style={{ color: 'var(--ink)' }}>Institutions</span>
                {' - '}campus partnership & capability provisioning
              </li>
              <li>
                <span className="font-semibold" style={{ color: 'var(--ink)' }}>Mentorship</span>
                {' - '}live online or onsite quotes
              </li>
            </ul>
            <p className="mt-6 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
              Platform Team · {PLATFORM_CONTACT.email} · WhatsApp {PLATFORM_CONTACT.phoneDisplay}
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
