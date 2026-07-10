'use client';

import { useState } from 'react';
import { CheckCircle, Loader2, MessageCircle, ShieldCheck } from 'lucide-react';
import { Course } from '@/lib/types';
import { formatXAF } from '@/lib/format';

const PAYMENT_METHODS = ['MTN MoMo', 'Orange Money', 'Flutterwave (card)'];

export default function PurchasePanel({ course }: { course: Course }) {
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState<{ whatsappUrl: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, whatsapp, email, courseSlug: course.slug, paymentMethod }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setDone({ whatsappUrl: data.whatsappUrl });
      window.open(data.whatsappUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  const discount =
    course.originalPrice > course.currentPrice && course.originalPrice > 0
      ? Math.round((1 - course.currentPrice / course.originalPrice) * 100)
      : 0;

  return (
    <div className="rounded-[20px] border bg-paper p-6 shadow-card" style={{ borderColor: 'var(--line)' }}>
      <div className="mb-1 flex items-baseline gap-2">
        <span className="font-display text-[32px] font-semibold">{formatXAF(course.currentPrice)}</span>
        {discount > 0 && (
          <span className="font-mono text-sm line-through" style={{ color: 'var(--ink-soft)' }}>
            {course.originalPrice.toLocaleString('en-US')}
          </span>
        )}
      </div>
      {discount > 0 && (
        <div className="mb-4 inline-block rounded-full px-2.5 py-1 font-mono text-[11px]" style={{ background: 'var(--amber-soft)', color: '#7a5417' }}>
          {discount}% off
        </div>
      )}

      {!done ? (
        <>
          {!open ? (
            <button onClick={() => setOpen(true)} className="btn btn-primary w-full">
              Buy &amp; pay on the platform
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-3">
              <input className="form-input" placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              <input className="form-input" placeholder="WhatsApp number" type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} required />
              <input className="form-input" placeholder="Email (optional)" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <select className="form-input" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                {PAYMENT_METHODS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              {error && (
                <p className="rounded-lg px-3 py-2 text-sm" style={{ background: 'rgba(220,38,38,0.08)', color: '#b91c1c' }}>{error}</p>
              )}
              <button type="submit" disabled={loading} className="btn btn-primary w-full">
                {loading ? <Loader2 size={18} className="animate-spin" /> : <MessageCircle size={18} />}
                {loading ? 'Placing order…' : 'Place order & confirm on WhatsApp'}
              </button>
            </form>
          )}
        </>
      ) : (
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full" style={{ background: 'rgba(47,143,99,0.15)' }}>
            <CheckCircle className="text-green-deep" size={24} />
          </div>
          <p className="mb-1 font-display text-lg">Order placed!</p>
          <p className="mb-4 text-sm" style={{ color: 'var(--ink-soft)' }}>
            We&apos;ve recorded your order and opened WhatsApp so you can confirm and pay.
          </p>
          <a href={done.whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full">
            <MessageCircle size={18} /> Continue on WhatsApp
          </a>
        </div>
      )}

      <ul className="mt-5 flex flex-col gap-2 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
        {course.certificateOfCompletion && (
          <li className="flex items-center gap-2"><ShieldCheck size={14} style={{ color: 'var(--green-deep)' }} /> Certificate of completion</li>
        )}
        {course.accessOnMobileAndTV && (
          <li className="flex items-center gap-2"><ShieldCheck size={14} style={{ color: 'var(--green-deep)' }} /> Access on mobile and TV</li>
        )}
        {course.downloadable && (
          <li className="flex items-center gap-2"><ShieldCheck size={14} style={{ color: 'var(--green-deep)' }} /> Downloadable resources</li>
        )}
      </ul>
    </div>
  );
}
