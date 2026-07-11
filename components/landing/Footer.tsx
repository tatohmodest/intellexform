import Link from 'next/link';
import { buildWhatsappLink } from '@/lib/whatsapp';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--ink)', color: 'rgba(251,248,240,0.7)' }} className="pb-8 pt-14">
      <div className="wrap">
        <div className="mb-9 flex flex-wrap justify-between gap-8">
          <div className="max-w-[260px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Intellex" className="h-7 w-auto" />

            <p className="mt-3 text-[13.5px]">
              A Looping Binary platform. Skills to income, one level at a time. Built in Douala, Cameroon.
            </p>
          </div>
          <div>
            <h5 className="mb-3.5 text-[12.5px] uppercase tracking-[0.08em]" style={{ color: 'rgba(251,248,240,0.5)' }}>
              Ways to learn
            </h5>
            <Link href="/#learn" className="mb-2 block text-sm text-paper/80">Self-paced</Link>
            <Link href="/#learn" className="mb-2 block text-sm text-paper/80">Live tutoring</Link>
            <Link href="/#ai" className="mb-2 block text-sm text-paper/80">AI Tutor</Link>
          </div>
          <div>
            <h5 className="mb-3.5 text-[12.5px] uppercase tracking-[0.08em]" style={{ color: 'rgba(251,248,240,0.5)' }}>
              Explore
            </h5>
            <Link href="/courses" className="mb-2 block text-sm text-paper/80">All courses</Link>
            <Link href="/#pricing" className="mb-2 block text-sm text-paper/80">Pricing</Link>
            <Link href="/#testimonials" className="mb-2 block text-sm text-paper/80">Student stories</Link>
          </div>
          <div>
            <h5 className="mb-3.5 text-[12.5px] uppercase tracking-[0.08em]" style={{ color: 'rgba(251,248,240,0.5)' }}>
              Contact
            </h5>
            <a
              href={buildWhatsappLink('Hello Intellex! I have a question about the platform.')}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-2 block text-sm text-paper/80"
            >
              WhatsApp
            </a>
            <a href="mailto:tatohmodest@gmail.com" className="mb-2 block text-sm text-paper/80">Email</a>
            <Link href="/#register" className="mb-2 block text-sm text-paper/80">Register</Link>
          </div>
        </div>
        <div
          className="flex flex-wrap justify-between gap-2.5 border-t pt-5 text-[12.5px]"
          style={{ borderColor: 'rgba(251,248,240,0.14)' }}
        >
          <span>© 2026 Intellex, a Looping Binary platform.</span>
          <span>Douala, Cameroon · +237 650 318 856</span>
        </div>
      </div>
    </footer>
  );
}
