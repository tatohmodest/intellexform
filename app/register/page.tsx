import Link from 'next/link';
import { Suspense } from 'react';
import RegistrationForm from '@/components/RegistrationForm';
import { Loader2, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Register , Intellex Early Access',
  description: 'Join Intellex. Fill the form, download your invoice, and start your tech journey.',
};

function FormSkeleton() {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 space-y-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="glass-card p-6 animate-pulse">
          <div className="h-6 bg-white/5 rounded-lg w-1/3 mb-4" />
          <div className="space-y-3">
            <div className="h-12 bg-white/5 rounded-xl" />
            <div className="h-12 bg-white/5 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-navy-900 relative overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-grid-pattern opacity-100 pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-gold-500/4 blur-[100px] pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-50 flex items-center justify-between px-6 md:px-12 py-5 border-b border-gold-500/10">
        <Link
          href="/"
          className="flex items-center gap-2 text-intellex-muted hover:text-gold-400 transition-colors text-sm"
        >
          <ArrowLeft size={15} />
          Back to home
        </Link>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Intellex" className="h-7 w-auto object-contain" />
        <div className="w-20" />
      </nav>

      {/* Header */}
      <div className="relative z-10 text-center pt-12 pb-6 px-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-400 text-xs font-semibold tracking-wider uppercase mb-5">
          Early Access Registration
        </div>
        <h1 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold leading-tight mb-3">
          Your journey starts <span className="gradient-text">here.</span>
        </h1>
        <p className="text-intellex-muted text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
          Fill the form below. At the end, your personalized invoice will be generated
          automatically , download it, pay, and you&apos;re in.
        </p>
      </div>

      {/* Form */}
      <div className="relative z-10">
        <Suspense fallback={<FormSkeleton />}>
          <RegistrationForm />
        </Suspense>
      </div>

      {/* Footer */}
      <footer className="relative z-10 mt-10 border-t border-gold-500/10 px-6 py-6 text-center">
        <p className="text-xs text-intellex-muted">
          Questions? WhatsApp us at{' '}
          <a href="https://wa.me/237650318856" target="_blank" rel="noopener noreferrer" className="text-gold-400 hover:underline">
            +237 650 318 856
          </a>
        </p>
      </footer>
    </main>
  );
}
