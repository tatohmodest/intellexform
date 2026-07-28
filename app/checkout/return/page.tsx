'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Loader2, MessageCircle, XCircle } from 'lucide-react';
import TopNav from '@/components/landing/TopNav';
import Footer from '@/components/landing/Footer';
import { formatXAF } from '@/lib/format';

interface VerifyResult {
  status: string;
  paid: boolean;
  courseName: string;
  amountXAF: number;
  fullName: string;
  whatsappUrl: string | null;
  kind?: string;
  continueHref?: string;
  isTrial?: boolean;
}

function ReturnInner() {
  const params = useSearchParams();
  const transactionId = params.get('transaction_id');
  const outcome = params.get('outcome');
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!transactionId) {
      setError('Missing transaction reference.');
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const res = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transactionId, outcome }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Verification failed');
        setResult(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Verification failed');
      } finally {
        setLoading(false);
      }
    })();
  }, [transactionId, outcome]);

  const kind = result?.kind || 'catalogue';
  const continueHref = result?.continueHref || '/courses';

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-[20px] border p-8 text-center shadow-card" style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}>
        {loading && (
          <div className="py-8">
            <Loader2 size={30} className="mx-auto mb-4 animate-spin" style={{ color: 'var(--green-deep)' }} />
            <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>Confirming your payment…</p>
          </div>
        )}

        {!loading && result?.paid && (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full" style={{ background: 'rgba(0,179,105,0.15)' }}>
              <CheckCircle size={34} style={{ color: 'var(--green-deep)' }} />
            </div>
            <h1 className="mb-2 font-display text-[26px]">
              {kind === 'session_booking' ? 'Session booked!' : 'Payment confirmed!'}
            </h1>
            <p className="mb-1 text-sm" style={{ color: 'var(--ink-soft)' }}>
              {result.fullName}, your payment of <strong>{formatXAF(result.amountXAF)}</strong> for
            </p>
            <p className="mb-5 font-display text-lg">{result.courseName}</p>
            <p className="mb-6 text-sm" style={{ color: 'var(--ink-soft)' }}>
              {kind === 'teacher_course'
                ? 'You are enrolled. Open the course and start learning on InTelleX.'
                : kind === 'session_booking'
                  ? 'Your session is on your Mentorship dashboard. Join from there when it starts.'
                  : 'is confirmed and saved to your account. Message us on WhatsApp to receive your course access.'}
            </p>
            {kind === 'catalogue' && result.whatsappUrl && (
              <a href={result.whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full">
                <MessageCircle size={18} /> Contact us on WhatsApp for the course
              </a>
            )}
            {kind !== 'catalogue' && (
              <Link href={continueHref} className="btn btn-primary w-full">
                {kind === 'session_booking' ? 'Open Mentorship' : 'Open your course'}
              </Link>
            )}
            <Link href="/dashboard/courses" className="mt-3 inline-block text-sm" style={{ color: 'var(--green-deep)' }}>
              Go to My Courses →
            </Link>
          </>
        )}

        {!loading && result && !result.paid && (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full" style={{ background: 'rgba(220,38,38,0.1)' }}>
              <XCircle size={34} style={{ color: '#b91c1c' }} />
            </div>
            <h1 className="mb-2 font-display text-[24px]">Payment not completed</h1>
            <p className="mb-6 text-sm" style={{ color: 'var(--ink-soft)' }}>
              Your payment is <strong>{result.status}</strong>. If you were charged, please contact us and
              we&apos;ll sort it out.
            </p>
            <Link href={continueHref} className="btn btn-primary w-full">Try again</Link>
          </>
        )}

        {!loading && error && (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full" style={{ background: 'rgba(220,38,38,0.1)' }}>
              <XCircle size={34} style={{ color: '#b91c1c' }} />
            </div>
            <h1 className="mb-2 font-display text-[24px]">Something went wrong</h1>
            <p className="mb-6 text-sm" style={{ color: 'var(--ink-soft)' }}>{error}</p>
            <Link href="/courses" className="btn btn-primary w-full">Back to courses</Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function CheckoutReturnPage() {
  return (
    <>
      <TopNav />
      <Suspense fallback={<div className="py-24 text-center" style={{ color: 'var(--ink-soft)' }}>Loading…</div>}>
        <ReturnInner />
      </Suspense>
      <Footer />
    </>
  );
}
