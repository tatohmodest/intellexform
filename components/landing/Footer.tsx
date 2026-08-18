'use client';

import Link from 'next/link';
import { PLATFORM_CONTACT, generalWhatsappLink, platformMailto } from '@/lib/contact';
import BrandLogo from '@/components/BrandLogo';
import { useT } from '@/components/i18n/I18nRoot';

export default function Footer() {
  const tr = useT();
  return (
    <footer style={{ background: 'var(--ink)', color: 'rgba(251,248,240,0.7)' }} className="pb-8 pt-14">
      <div className="wrap">
        <div className="mb-9 flex flex-wrap justify-between gap-8">
          <div className="max-w-[260px]">
            <BrandLogo href="/" height={36} variant="footer" className="brightness-0 invert" />

            <p className="mt-3 text-[13.5px]">
              {tr('A Looping Binary platform. Skills to income, one level at a time. Built in Douala, Cameroon.')}
            </p>
          </div>
          <div>
            <h5 className="mb-3.5 text-[12.5px] uppercase tracking-[0.08em]" style={{ color: 'rgba(251,248,240,0.5)' }}>
              {tr('Ways to learn')}
            </h5>
            <Link href="/#learn" className="mb-2 block text-sm text-paper/80">{tr('Self-paced')}</Link>
            <Link href="/#learn" className="mb-2 block text-sm text-paper/80">{tr('Live tutoring')}</Link>
            <Link href="/#ai" className="mb-2 block text-sm text-paper/80">{tr('AI Tutor')}</Link>
          </div>
          <div>
            <h5 className="mb-3.5 text-[12.5px] uppercase tracking-[0.08em]" style={{ color: 'rgba(251,248,240,0.5)' }}>
              {tr('Explore')}
            </h5>
            <Link href="/courses" className="mb-2 block text-sm text-paper/80">{tr('All courses')}</Link>
            <Link href="/ecosystem" className="mb-2 block text-sm text-paper/80">{tr('Ecosystem')}</Link>
            <Link href="/enterprise" className="mb-2 block text-sm text-paper/80">{tr('For institutions')}</Link>
            <Link href="/tutorials" className="mb-2 block text-sm text-paper/80">{tr('Student tutorials')}</Link>
            <Link href="/tutorials/computer-architecture" className="mb-2 block text-sm text-paper/80">{tr('Computer Architecture tutorial')}</Link>
            <Link href="/tutorials/html" className="mb-2 block text-sm text-paper/80">{tr('HTML tutorial')}</Link>
            <Link href="/tutorials/css" className="mb-2 block text-sm text-paper/80">{tr('CSS tutorial')}</Link>
            <Link href="/tutorials/javascript" className="mb-2 block text-sm text-paper/80">{tr('JavaScript tutorial')}</Link>
            <Link href="/tutorials/nextjs" className="mb-2 block text-sm text-paper/80">{tr('Next.js tutorial')}</Link>
            <Link href="/tutorials/python" className="mb-2 block text-sm text-paper/80">{tr('Python tutorial')}</Link>
            <Link href="/tutorials/django" className="mb-2 block text-sm text-paper/80">{tr('Django tutorial')}</Link>
            <Link href="/tutorials/flask" className="mb-2 block text-sm text-paper/80">{tr('Flask tutorial')}</Link>
            <Link href="/tutorials/postgresql" className="mb-2 block text-sm text-paper/80">{tr('PostgreSQL tutorial')}</Link>
            <Link href="/tutorials/mongodb" className="mb-2 block text-sm text-paper/80">{tr('MongoDB tutorial')}</Link>
            <Link href="/tutorials/flutter" className="mb-2 block text-sm text-paper/80">{tr('Flutter tutorial')}</Link>
            <Link href="/tutorials/data-analysis" className="mb-2 block text-sm text-paper/80">{tr('Data Analysis tutorial')}</Link>
            <Link href="/tutorials/digital-marketing" className="mb-2 block text-sm text-paper/80">{tr('Digital Marketing tutorial')}</Link>
            <Link href="/tutorials/microsoft-suite" className="mb-2 block text-sm text-paper/80">{tr('Microsoft 365 tutorial')}</Link>
            <Link href="/tutorials/golang" className="mb-2 block text-sm text-paper/80">{tr('Go (Golang) tutorial')}</Link>
            <Link href="/tutorials/docker" className="mb-2 block text-sm text-paper/80">{tr('Docker tutorial')}</Link>
            <Link href="/tutorials/kubernetes" className="mb-2 block text-sm text-paper/80">{tr('Kubernetes tutorial')}</Link>
            <Link href="/tutorials/linux-administration" className="mb-2 block text-sm text-paper/80">{tr('Linux Administration tutorial')}</Link>
            <Link href="/tutorials/bash-scripting" className="mb-2 block text-sm text-paper/80">{tr('Bash Scripting tutorial')}</Link>
            <Link href="/tutorials/nodejs-express" className="mb-2 block text-sm text-paper/80">{tr('Node.js & Express tutorial')}</Link>
            <Link href="/tutorials/nestjs" className="mb-2 block text-sm text-paper/80">{tr('NestJS tutorial')}</Link>
            <Link href="/tutorials/pygame" className="mb-2 block text-sm text-paper/80">{tr('Pygame tutorial')}</Link>
            <Link href="/tutorials/cpp" className="mb-2 block text-sm text-paper/80">{tr('C++ tutorial')}</Link>
            <Link href="/tutorials/java" className="mb-2 block text-sm text-paper/80">{tr('Java tutorial')}</Link>
            <Link href="/tutorials/rust" className="mb-2 block text-sm text-paper/80">{tr('Rust tutorial')}</Link>
            <Link href="/tutorials/ruby-on-rails" className="mb-2 block text-sm text-paper/80">{tr('Ruby on Rails tutorial')}</Link>
            <Link href="/tutorials/arduino" className="mb-2 block text-sm text-paper/80">{tr('Arduino tutorial')}</Link>
            <Link href="/certifications" className="mb-2 block text-sm text-paper/80">{tr('Certificates')}</Link>
            <Link href="/#pricing" className="mb-2 block text-sm text-paper/80">{tr('Pricing')}</Link>
            <Link href="/#testimonials" className="mb-2 block text-sm text-paper/80">{tr('Student stories')}</Link>
            <Link href="/#ecosystem" className="mb-2 block text-sm text-paper/80">{tr('Ecosystem')}</Link>
          </div>
          <div>
            <h5 className="mb-3.5 text-[12.5px] uppercase tracking-[0.08em]" style={{ color: 'rgba(251,248,240,0.5)' }}>
              {tr('Ecosystem')}
            </h5>
            <Link href="/certifications" className="mb-2 block text-sm text-paper/80">{tr('Certifications')}</Link>
            <Link href="/internships" className="mb-2 block text-sm text-paper/80">{tr('Internships')}</Link>
            <Link href="/junior-dev" className="mb-2 block text-sm text-paper/80">{tr('Junior Dev')}</Link>
            <Link href="/books" className="mb-2 block text-sm text-paper/80">{tr('Books')}</Link>
            <Link href="/resources" className="mb-2 block text-sm text-paper/80">{tr('Free resources')}</Link>
            <Link href="/learning" className="mb-2 block text-sm text-paper/80">{tr('Learning environment')}</Link>
          </div>
          <div>
            <h5 className="mb-3.5 text-[12.5px] uppercase tracking-[0.08em]" style={{ color: 'rgba(251,248,240,0.5)' }}>
              {tr('Company')}
            </h5>
            <Link href="/membership" className="mb-2 block text-sm text-paper/80">{tr('Become a Student')}</Link>
            <Link href="/about" className="mb-2 block text-sm text-paper/80">{tr('About InTelleX')}</Link>
            <Link href="/about#ceo" className="mb-2 block text-sm text-paper/80">{tr('CEO')}</Link>
            <Link href="/about#ceo" className="mb-2 block text-sm text-paper/80">Tatoh Modest Wilton</Link>
            <a href="https://loopingbinary.com" target="_blank" rel="noopener noreferrer" className="mb-2 block text-sm text-paper/80">
              Looping Binary
            </a>
            <Link href="/contact" className="mb-2 block text-sm text-paper/80">{tr('Contact us')}</Link>
            <Link href="/#contact-us" className="mb-2 block text-sm text-paper/80">{tr('Chat with us')}</Link>
            <a
              href={generalWhatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-2 block text-sm text-paper/80"
            >
              WhatsApp {PLATFORM_CONTACT.phoneDisplay}
            </a>
            <a href={platformMailto()} className="mb-2 block text-sm text-paper/80">
              {PLATFORM_CONTACT.email}
            </a>
            <a href="/sitemap.xml" className="mb-2 block text-sm text-paper/80">{tr('Sitemap')}</a>
          </div>
        </div>
        <div
          className="flex flex-wrap justify-between gap-2.5 border-t pt-5 text-[12.5px]"
          style={{ borderColor: 'rgba(251,248,240,0.14)' }}
        >
          <span>{tr('© 2026 Intellex, a Looping Binary platform. Founder & CEO: Tatoh Modest Wilton.')}</span>
          <span>{tr('Douala, Cameroon · +237 650 318 856')}</span>
        </div>
      </div>
    </footer>
  );
}
