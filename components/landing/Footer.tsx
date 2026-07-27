import Link from 'next/link';
import { buildWhatsappLink } from '@/lib/whatsapp';
import BrandLogo from '@/components/BrandLogo';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--ink)', color: 'rgba(251,248,240,0.7)' }} className="pb-8 pt-14">
      <div className="wrap">
        <div className="mb-9 flex flex-wrap justify-between gap-8">
          <div className="max-w-[260px]">
            <BrandLogo href="/" height={36} variant="footer" className="brightness-0 invert" />

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
            <Link href="/tutorials" className="mb-2 block text-sm text-paper/80">Free tutorials</Link>
            <Link href="/tutorials/computer-architecture" className="mb-2 block text-sm text-paper/80">Computer Architecture tutorial</Link>
            <Link href="/tutorials/html" className="mb-2 block text-sm text-paper/80">HTML tutorial</Link>
            <Link href="/tutorials/css" className="mb-2 block text-sm text-paper/80">CSS tutorial</Link>
            <Link href="/tutorials/javascript" className="mb-2 block text-sm text-paper/80">JavaScript tutorial</Link>
            <Link href="/tutorials/nextjs" className="mb-2 block text-sm text-paper/80">Next.js tutorial</Link>
            <Link href="/tutorials/python" className="mb-2 block text-sm text-paper/80">Python tutorial</Link>
            <Link href="/tutorials/django" className="mb-2 block text-sm text-paper/80">Django tutorial</Link>
            <Link href="/tutorials/flask" className="mb-2 block text-sm text-paper/80">Flask tutorial</Link>
            <Link href="/tutorials/postgresql" className="mb-2 block text-sm text-paper/80">PostgreSQL tutorial</Link>
            <Link href="/tutorials/mongodb" className="mb-2 block text-sm text-paper/80">MongoDB tutorial</Link>
            <Link href="/tutorials/flutter" className="mb-2 block text-sm text-paper/80">Flutter tutorial</Link>
            <Link href="/tutorials/data-analysis" className="mb-2 block text-sm text-paper/80">Data Analysis tutorial</Link>
            <Link href="/tutorials/digital-marketing" className="mb-2 block text-sm text-paper/80">Digital Marketing tutorial</Link>
            <Link href="/tutorials/golang" className="mb-2 block text-sm text-paper/80">Go (Golang) tutorial</Link>
            <Link href="/tutorials/docker" className="mb-2 block text-sm text-paper/80">Docker tutorial</Link>
            <Link href="/tutorials/kubernetes" className="mb-2 block text-sm text-paper/80">Kubernetes tutorial</Link>
            <Link href="/tutorials/linux-administration" className="mb-2 block text-sm text-paper/80">Linux Administration tutorial</Link>
            <Link href="/tutorials/bash-scripting" className="mb-2 block text-sm text-paper/80">Bash Scripting tutorial</Link>
            <Link href="/tutorials/nodejs-express" className="mb-2 block text-sm text-paper/80">Node.js & Express tutorial</Link>
            <Link href="/tutorials/nestjs" className="mb-2 block text-sm text-paper/80">NestJS tutorial</Link>
            <Link href="/tutorials/pygame" className="mb-2 block text-sm text-paper/80">Pygame tutorial</Link>
            <Link href="/tutorials/cpp" className="mb-2 block text-sm text-paper/80">C++ tutorial</Link>
            <Link href="/tutorials/java" className="mb-2 block text-sm text-paper/80">Java tutorial</Link>
            <Link href="/tutorials/rust" className="mb-2 block text-sm text-paper/80">Rust tutorial</Link>
            <Link href="/tutorials/ruby-on-rails" className="mb-2 block text-sm text-paper/80">Ruby on Rails tutorial</Link>
            <Link href="/tutorials/arduino" className="mb-2 block text-sm text-paper/80">Arduino tutorial</Link>
            <Link href="/certifications" className="mb-2 block text-sm text-paper/80">Certificates</Link>
            <Link href="/#pricing" className="mb-2 block text-sm text-paper/80">Pricing</Link>
            <Link href="/#testimonials" className="mb-2 block text-sm text-paper/80">Student stories</Link>
            <Link href="/#ecosystem" className="mb-2 block text-sm text-paper/80">Ecosystem</Link>
          </div>
          <div>
            <h5 className="mb-3.5 text-[12.5px] uppercase tracking-[0.08em]" style={{ color: 'rgba(251,248,240,0.5)' }}>
              Ecosystem
            </h5>
            <Link href="/certifications" className="mb-2 block text-sm text-paper/80">Certifications</Link>
            <Link href="/internships" className="mb-2 block text-sm text-paper/80">Internships</Link>
            <Link href="/junior-dev" className="mb-2 block text-sm text-paper/80">Junior Dev</Link>
            <Link href="/books" className="mb-2 block text-sm text-paper/80">Books</Link>
            <Link href="/resources" className="mb-2 block text-sm text-paper/80">Free resources</Link>
            <Link href="/learning" className="mb-2 block text-sm text-paper/80">Learning environment</Link>
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
            <Link href="/register" className="mb-2 block text-sm text-paper/80">Register</Link>
            <a href="https://loopingbinary.com" target="_blank" rel="noopener noreferrer" className="mb-2 block text-sm text-paper/80">
              Looping Binary
            </a>
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
