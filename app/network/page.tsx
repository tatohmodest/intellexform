import Link from 'next/link';
import { Building2, Lock, Mail, MessageCircle, Network, ShieldCheck, Layers } from 'lucide-react';
import TopNav from '@/components/landing/TopNav';
import Footer from '@/components/landing/Footer';
import Reveal from '@/components/Reveal';
import BrandLogo from '@/components/BrandLogo';
import { GOLDEN_RULE } from '@/lib/eduos/governance';
import { DEPLOYMENT_CHOICES } from '@/lib/eduos/federation';
import {
  CAPABILITY_PACKS,
  MODULE_CATALOG,
} from '@/lib/eduos/capabilities';
import {
  PLATFORM_CONTACT,
  institutionMailto,
  institutionWhatsappLink,
} from '@/lib/contact';

export const metadata = {
  title: 'Institution Network — InTelleX',
  description:
    'Build your digital campus with InTelleX: Core infrastructure plus modular capabilities for learning, AI, library, career, and more.',
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
              Build your digital campus with InTelleX
            </h1>
            <p className="text-[16px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              One platform. Unlimited configurations. Every institution receives the InTelleX Core,
              then unlocks capabilities — not gold tiers — based on how they teach, learn, and grow.
              Dashboards stay clean because people only see what their campus actually owns.
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

      <section id="capabilities" className="scroll-mt-24 border-t py-12 sm:py-16" style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}>
        <div className="wrap">
          <div className="mb-8 max-w-[720px]">
            <Layers size={26} style={{ color: 'var(--green-deep)' }} />
            <h2 className="mt-3 font-display text-[24px] sm:text-[30px]">
              Core + capabilities
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              Institutions subscribe to capabilities, not software versions. Start with Foundation
              (Core), grow into Professional or Enterprise, or assemble a custom set — online classes,
              AI tutor, digital library, career portal — provisioned by the Platform Team.
            </p>
          </div>

          <div className="mb-10 grid gap-4 md:grid-cols-3">
            {(Object.keys(CAPABILITY_PACKS) as Array<keyof typeof CAPABILITY_PACKS>).map((key) => {
              const pack = CAPABILITY_PACKS[key];
              return (
                <div key={key} className="rounded-[16px] border bg-paper p-5" style={{ borderColor: 'var(--line)' }}>
                  <div className="font-mono text-[10.5px] uppercase tracking-[0.12em]" style={{ color: 'var(--green-deep)' }}>
                    {key}
                  </div>
                  <h3 className="mt-1.5 font-display text-[18px]">{pack.name}</h3>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                    {pack.summary}
                  </p>
                  {pack.modules.length > 0 && (
                    <p className="mt-3 text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                      {pack.modules.length} capabilities included
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <h3 className="mb-4 font-display text-[20px]">Capability modules</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {MODULE_CATALOG.map((m) => (
              <div key={m.id} className="rounded-[14px] border bg-paper p-4" style={{ borderColor: 'var(--line)' }}>
                <div className="font-semibold text-[14.5px]">{m.name}</div>
                <p className="mt-1 text-[13px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                  {m.tagline}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t py-12 sm:py-16" style={{ borderColor: 'var(--line)' }}>
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
            Partner with the InTelleX Platform Team
          </h2>
          <p className="mt-3 text-[15.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
            There is no self-serve “create institution” button. Want your university, academy, or
            training center on the network? Contact us. We help you register, connect systems,
            configure auth, customize branding, provision Core plus the capabilities you need, and
            train administrators.
          </p>
          <p className="mt-4 text-[14.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
            {GOLDEN_RULE}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/contact?type=institution" className="btn btn-primary">
              Contact us — partner form
            </Link>
            <a href={institutionMailto()} className="btn btn-ghost">
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
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
