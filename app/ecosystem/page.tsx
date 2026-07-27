import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import TopNav from '@/components/landing/TopNav';
import Footer from '@/components/landing/Footer';
import Reveal from '@/components/Reveal';
import BrandLogo from '@/components/BrandLogo';
import { ECOSYSTEM } from '@/lib/ecosystem';

export const metadata = {
  title: 'Ecosystem — InTelleX',
  description:
    'The InTelleX Education OS ecosystem: certifications, internships, Junior Dev, books, resources, learning environment, and the federated institution network.',
};

export default function EcosystemHubPage() {
  const items = [
    ...ECOSYSTEM,
    {
      slug: 'network',
      href: '/network',
      tab: 'Network',
      title: 'Federated institution network',
      short: 'Campuses connect through InTelleX. Schools own their academic data.',
      body: '',
      image: '/eco_learning.webp',
      alt: 'Institution network',
      bullets: [] as string[],
      primaryCta: { label: 'Explore network', href: '/network' },
    },
    {
      slug: 'tutorials',
      href: '/tutorials',
      tab: 'Tutorials',
      title: 'Free tutorials',
      short: '26 beginner-to-pro tracks — HTML to Kubernetes, C++, Rust, and more.',
      body: '',
      image: '/eco_resources.webp',
      alt: 'Tutorials',
      bullets: [] as string[],
      primaryCta: { label: 'Start a tutorial', href: '/tutorials' },
    },
  ];

  return (
    <>
      <TopNav />
      <section className="border-b py-14 sm:py-18" style={{ borderColor: 'var(--line)' }}>
        <div className="wrap">
          <BrandLogo href="/" height={34} className="mb-6" />
          <Reveal className="max-w-[640px]">
            <div className="tab mb-3">Ecosystem</div>
            <h1 className="mb-3 text-[32px] leading-[1.08] sm:text-[44px]">
              How InTelleX fits together
            </h1>
            <p className="text-[16px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              Learning, campuses, mentorship, careers, and AI — one Education Operating System,
              not a pile of disconnected products.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="wrap grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link
              key={item.slug}
              href={item.href}
              className="group overflow-hidden rounded-[20px] border transition-shadow hover:shadow-card"
              style={{ borderColor: 'var(--line)' }}
            >
              <div className="aspect-[16/10] overflow-hidden" style={{ background: 'var(--paper-dim)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt={item.alt || ''} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
              </div>
              <div className="p-5">
                <div className="mb-1 font-mono text-[10.5px] uppercase tracking-[0.12em]" style={{ color: 'var(--green-deep)' }}>
                  {item.tab}
                </div>
                <h2 className="mb-1.5 font-display text-[18px] leading-snug">{item.title}</h2>
                <p className="text-[13.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                  {item.short}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold" style={{ color: 'var(--green-deep)' }}>
                  Open <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
}
