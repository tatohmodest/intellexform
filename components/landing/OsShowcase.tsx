import Link from 'next/link';
import { Check, Mail } from 'lucide-react';
import Reveal from '@/components/Reveal';
import {
  CAPABILITY_PACKS,
  MODULE_CATALOG,
  type ModuleId,
} from '@/lib/eduos/capabilities';
import {
  PLATFORM_CONTACT,
  institutionMailto,
  institutionWhatsappLink,
} from '@/lib/contact';

const CORE_INCLUDED = [
  'Institution portal & branding',
  'Students, teachers & departments',
  'Course management (basic)',
  'Announcements, events & calendar',
  'Notifications & basic library',
  'Roles, identity & basic analytics',
  'API connectivity · Powered by InTelleX',
];

const PACK_HIGHLIGHTS: Record<
  keyof typeof CAPABILITY_PACKS,
  { priceNote: string; bestFor: string; extras: string[] }
> = {
  foundation: {
    priceNote: 'Talk to Platform Team',
    bestFor: 'Schools starting their digital campus',
    extras: ['Everything in Core', 'Campus branding', 'Member dashboards'],
  },
  professional: {
    priceNote: 'Talk to Platform Team',
    bestFor: 'Academies running online learning + AI',
    extras: [
      'Digital Learning (video courses)',
      'Assessment & assignments',
      'AI Learning (campus-scoped)',
      'Digital Library',
      'InTelleX free resources embed',
    ],
  },
  enterprise: {
    priceNote: 'Custom enterprise agreement',
    bestFor: 'Universities & large networks',
    extras: [
      'Everything in Professional',
      'Live Teaching',
      'Community & Career',
      'Research & Marketplace',
      'Dedicated infrastructure options',
      'Priority support & custom AI models',
    ],
  },
};

const PRODUCT_SHOTS = [
  {
    image: '/mockups/mockup-phone-campus.webp',
    alt: 'Student campus app on a phone',
    title: 'Your campus in their pocket',
    body: 'Students open a branded campus — courses, calendar, announcements — and only the capabilities their institution unlocked. Same InTelleX identity everywhere.',
  },
  {
    image: '/mockups/mockup-dashboard-instructor.webp',
    alt: 'Instructor dashboard on a laptop',
    title: 'Instructor dashboards that stay clean',
    body: 'Course studio, assessments, AI assistant, analytics. If Live Teaching is not provisioned, it simply does not appear. No overwhelm.',
  },
  {
    image: '/mockups/mockup-phone-student-ai.webp',
    alt: 'AI tutor on a phone',
    title: 'AI that knows the campus',
    body: 'Answers from approved lecture notes, regulations, and public InTelleX resources — never leaking private knowledge to other institutions.',
  },
];

function moduleName(id: ModuleId) {
  return MODULE_CATALOG.find((m) => m.id === id)?.name ?? id;
}

export default function OsShowcase() {
  return (
    <>
      <section id="os" className="scroll-mt-24 py-16 sm:py-20">
        <div className="wrap">
          <Reveal className="mb-10 max-w-[720px]">
            <div className="tab mb-3">The Education OS</div>
            <h2 className="mb-3 text-[26px] leading-[1.12] sm:text-[36px]">
              One platform. Unlimited campus configurations.
            </h2>
            <p className="text-[15.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              InTelleX is not selling another LMS license. It is education infrastructure as a
              service — Core for every partner institution, then modular capabilities that match
              how they actually teach.
            </p>
          </Reveal>

          <div
            className="mb-12 overflow-hidden rounded-[24px] border"
            style={{ borderColor: 'var(--line)' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/mockups/mockup-core-modules.webp"
              alt="InTelleX Core with modular capability cards"
              className="aspect-[16/9] w-full object-cover object-center"
            />
          </div>

          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <h3 className="mb-3 font-display text-[22px]">InTelleX Core</h3>
              <p className="mb-5 text-[14.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                Enough to operate a digital campus on day one — identity through Looping Binary,
                branding, people, courses, calendar, and a home that says Powered by InTelleX.
              </p>
              <ul className="space-y-2.5">
                {CORE_INCLUDED.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[14px]">
                    <Check size={16} className="mt-0.5 shrink-0" style={{ color: 'var(--green-deep)' }} />
                    <span style={{ color: 'var(--ink-soft)' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-3 font-display text-[22px]">Capability modules</h3>
              <p className="mb-5 text-[14.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                Think apps on an operating system. Activate what you need — online classes, AI
                tutor, digital library, career portal — without changing platforms.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {MODULE_CATALOG.map((m) => (
                  <div
                    key={m.id}
                    className="rounded-[14px] border p-3.5"
                    style={{ borderColor: 'var(--line)', background: 'var(--paper)' }}
                  >
                    <div className="text-[13.5px] font-semibold">{m.name}</div>
                    <p className="mt-1 text-[12.5px] leading-snug" style={{ color: 'var(--ink-soft)' }}>
                      {m.tagline}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="product"
        className="scroll-mt-24 border-t py-16 sm:py-20"
        style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}
      >
        <div className="wrap">
          <Reveal className="mb-12 max-w-[680px]">
            <div className="tab mb-3">Product</div>
            <h2 className="mb-3 text-[26px] leading-[1.12] sm:text-[34px]">
              How InTelleX feels in the hand — and on the desk
            </h2>
            <p className="text-[15.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              Dynamic dashboards for students and instructors. Mockups below show the direction:
              campus-branded experiences assembled from Core + unlocked capabilities.
            </p>
          </Reveal>

          <div className="space-y-14">
            {PRODUCT_SHOTS.map((shot, i) => (
              <div
                key={shot.title}
                className={`grid items-center gap-8 lg:grid-cols-2 ${i % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''}`}
              >
                <div className="overflow-hidden rounded-[22px] border bg-paper" style={{ borderColor: 'var(--line)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={shot.image}
                    alt={shot.alt}
                    className="aspect-[16/10] w-full object-cover object-center"
                  />
                </div>
                <div>
                  <h3 className="mb-3 font-display text-[24px] leading-snug">{shot.title}</h3>
                  <p className="text-[15px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                    {shot.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="pricing"
        className="scroll-mt-24 border-t py-16 sm:py-20"
        style={{ borderColor: 'var(--line)' }}
      >
        <div className="wrap">
          <Reveal className="mb-4 max-w-[720px]">
            <div className="tab mb-3">Capabilities & access</div>
            <h2 className="mb-3 text-[26px] leading-[1.12] sm:text-[34px]">
              Assemble what your institution needs
            </h2>
            <p className="text-[15.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              Pricing is provisioned with the Platform Team — not a self-serve checkout. Below is
              what each pack unlocks today. Exact commercial terms (and à-la-carte modules) are
              discussed when you partner.
            </p>
          </Reveal>

          <p className="mb-10 text-[13px] font-medium" style={{ color: 'var(--green-deep)' }}>
            Provisional capability map · final pricing on request
          </p>

          <div className="grid gap-5 lg:grid-cols-3">
            {(Object.keys(CAPABILITY_PACKS) as Array<keyof typeof CAPABILITY_PACKS>).map((key) => {
              const pack = CAPABILITY_PACKS[key];
              const meta = PACK_HIGHLIGHTS[key];
              const featured = key === 'professional';
              return (
                <div
                  key={key}
                  className="flex flex-col rounded-[20px] border p-6 sm:p-7"
                  style={{
                    borderColor: featured ? 'var(--green-deep)' : 'var(--line)',
                    background: featured ? 'rgba(0,179,105,0.04)' : 'var(--paper)',
                    boxShadow: featured ? '0 0 0 1px var(--green-deep)' : undefined,
                  }}
                >
                  <div
                    className="font-mono text-[10.5px] uppercase tracking-[0.14em]"
                    style={{ color: 'var(--green-deep)' }}
                  >
                    {key}
                  </div>
                  <h3 className="mt-2 font-display text-[24px]">{pack.name}</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                    {pack.summary}
                  </p>
                  <div className="mt-4 text-[15px] font-semibold">{meta.priceNote}</div>
                  <p className="mt-1 text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
                    {meta.bestFor}
                  </p>
                  <ul className="mt-5 flex-1 space-y-2 border-t pt-5" style={{ borderColor: 'var(--line)' }}>
                    {meta.extras.map((line) => (
                      <li key={line} className="flex items-start gap-2 text-[13px]">
                        <Check size={14} className="mt-0.5 shrink-0" style={{ color: 'var(--green-deep)' }} />
                        <span style={{ color: 'var(--ink-soft)' }}>{line}</span>
                      </li>
                    ))}
                  </ul>
                  {pack.modules.length > 0 && key === 'professional' && (
                    <p className="mt-4 text-[11.5px]" style={{ color: 'var(--ink-soft)' }}>
                      Modules: {pack.modules.map(moduleName).join(' · ')}
                    </p>
                  )}
                  <a href={institutionMailto(`InTelleX ${pack.name} partnership`)} className="btn btn-ghost mt-6 !justify-center text-[13px]">
                    Request {pack.name}
                  </a>
                </div>
              );
            })}
          </div>

          <div
            className="mt-8 rounded-[18px] border p-5 sm:p-6"
            style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}
          >
            <h3 className="font-display text-[18px]">Custom & à-la-carte</h3>
            <p className="mt-2 text-[14px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              Large institutions can activate individual capabilities without jumping an entire pack
              — for example Live Teaching only, or Research + Library. Learners on InTelleX still get
              free tutorials, personal AI Tutor access, and the public catalogue separately from
              campus provisioning.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href={institutionMailto()} className="btn btn-primary">
                <Mail size={15} /> {PLATFORM_CONTACT.email}
              </a>
              <a
                href={institutionWhatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                WhatsApp {PLATFORM_CONTACT.phoneDisplay}
              </a>
              <Link href="/network#capabilities" className="btn btn-ghost">
                Full capability list
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
