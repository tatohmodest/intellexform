import Link from 'next/link';
import { Building2, Lock, Mail, MessageCircle, Network, ShieldCheck } from 'lucide-react';
import TopNav from '@/components/landing/TopNav';
import Footer from '@/components/landing/Footer';
import Reveal from '@/components/Reveal';
import BrandLogo from '@/components/BrandLogo';
import { GOLDEN_RULE } from '@/lib/eduos/governance';
import { DEPLOYMENT_CHOICES } from '@/lib/eduos/federation';
import {
  PLATFORM_CONTACT,
  institutionMailto,
  institutionWhatsappLink,
} from '@/lib/contact';

export const metadata = {
  title: 'Institution Network — InTelleX',
  description:
    'InTelleX federated institution network: schools own their data, InTelleX owns trust, identity, and the Education Cloud.',
};

export default function NetworkPage() {
  return (
    <>
      <TopNav />
      <section className="border-b py-14 sm:py-20" style={{ borderColor: 'var(--line)' }}>
        <div className="wrap">
          <BrandLogo href="/" height={34} className="mb-6" />
          <Reveal className="max-w-[720px]">
            <div className="tab mb-3">Federated network</div>
            <h1 className="mb-4 text-[32px] leading-[1.08] sm:text-[44px]">
              Many digital campuses. One education network.
            </h1>
            <p className="text-[16px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              InTelleX is not one LMS with many schools bolted on. It is a curated ecosystem of
              independent campuses connected by shared identity, trust, and opportunity — while each
              institution keeps its branding, academic data, and authority.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="wrap grid gap-6 lg:grid-cols-3">
          {[
            {
              icon: Network,
              title: 'Core layer',
              body: 'Identity, verification, discovery, API gateway, marketplace, AI — never grades or private exams.',
            },
            {
              icon: Building2,
              title: 'Institution layer',
              body: 'Teachers, students, courses, grades, finance, and research stay under campus ownership.',
            },
            {
              icon: Lock,
              title: 'Isolation by design',
              body: 'Campus A never sees Campus B’s students or analytics. Cross-checks go through the gateway.',
            },
          ].map((c) => (
            <div key={c.title} className="rounded-[18px] border p-6" style={{ borderColor: 'var(--line)' }}>
              <c.icon size={22} style={{ color: 'var(--green-deep)' }} />
              <h2 className="mt-4 font-display text-[20px]">{c.title}</h2>
              <p className="mt-2 text-[14px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t py-12 sm:py-16" style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}>
        <div className="wrap">
          <h2 className="mb-6 font-display text-[24px] sm:text-[28px]">Deployment models</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(DEPLOYMENT_CHOICES).map(([key, val]) => (
              <div key={key} className="rounded-[16px] border bg-paper p-5" style={{ borderColor: 'var(--line)' }}>
                <div className="font-mono text-[10.5px] uppercase tracking-[0.12em]" style={{ color: 'var(--green-deep)' }}>
                  {key}
                </div>
                <h3 className="mt-1.5 font-display text-[17px]">{val.label}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>{val.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="partner" className="scroll-mt-24 py-12 sm:py-16">
        <div className="wrap max-w-[720px]">
          <ShieldCheck size={28} style={{ color: 'var(--green-deep)' }} />
          <h2 className="mt-4 font-display text-[24px] sm:text-[28px]">
            Bring your institution to InTelleX
          </h2>
          <p className="mt-3 text-[15.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
            There is no self-serve “create institution” button. Want your university, academy, or
            training center on the network? Contact the InTelleX Platform Team. We help you register,
            connect systems, configure auth, customize branding, provision your environment, and
            train administrators.
          </p>
          <p className="mt-4 text-[14.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
            {GOLDEN_RULE}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={institutionMailto()} className="btn btn-primary">
              <Mail size={15} /> {PLATFORM_CONTACT.email}
            </a>
            <a
              href={institutionWhatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              <MessageCircle size={15} /> WhatsApp {PLATFORM_CONTACT.phoneDisplay}
            </a>
            <Link href="/ecosystem" className="btn btn-ghost">
              Back to ecosystem
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
