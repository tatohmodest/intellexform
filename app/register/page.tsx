import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import TopNav from '@/components/landing/TopNav';
import Footer from '@/components/landing/Footer';
import ContactForm from '@/components/landing/ContactForm';

export const metadata = {
  title: 'Register — Intellex',
  description: 'Pick a plan, tell us how to reach you, and continue on WhatsApp.',
};

export default function RegisterPage() {
  return (
    <>
      <TopNav />
      <section className="py-16">
        <div className="wrap grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm" style={{ color: 'var(--ink-soft)' }}>
              <ArrowLeft size={15} /> Back to home
            </Link>
            <div className="tab mb-4">Register</div>
            <h1 className="mb-3.5 text-[26px] leading-[1.15] sm:text-[34px] sm:leading-[1.1]">Pick a plan, tell us how to reach you</h1>
            <p className="text-base leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              Fill this in and we&apos;ll follow up on WhatsApp with payment details for MTN MoMo or Orange
              Money. Your choices are saved to our admin and sent straight to us on WhatsApp.
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {['MTN MoMo', 'Orange Money', 'Flutterwave (card)'].map((p) => (
                <span key={p} className="pill">{p}</span>
              ))}
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
      <Footer />
    </>
  );
}
