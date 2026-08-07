'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Award, ExternalLink, Loader2, Lock, ShieldCheck } from 'lucide-react';
import { Course } from '@/lib/types';
import { formatXAF } from '@/lib/format';
import ShareCourseButton from '@/components/ShareCourseButton';

export default function PurchasePanel({
  course,
  shareUrl,
  isSubscribed = false,
}: {
  course: Course;
  shareUrl: string;
  isSubscribed?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseSlug: course.slug, fullName, whatsapp, email, phone }),
      });
      const data = await res.json();
      if (!res.ok || !data.transactionUrl) throw new Error(data.error || 'Could not start payment');
      // Redirect to the PayUnit checkout (or local sandbox when keys are absent).
      window.location.href = data.transactionUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not start payment');
      setLoading(false);
    }
  }

  const discount =
    course.originalPrice > course.currentPrice && course.originalPrice > 0
      ? Math.round((1 - course.currentPrice / course.originalPrice) * 100)
      : 0;

  const isExternal = Boolean(course.courseLink) || course.courseOrigin === 'Udemy';

  return (
    <div className="rounded-[20px] border bg-paper p-6 shadow-card" style={{ borderColor: 'var(--line)' }}>
      <div className="mb-1 flex items-baseline gap-2">
        <span className="font-display text-[32px] font-semibold">
          {course.currentPrice > 0 ? formatXAF(course.currentPrice) : 'Included / External'}
        </span>
        {discount > 0 && (
          <span className="font-mono text-sm line-through" style={{ color: 'var(--ink-soft)' }}>
            {course.originalPrice.toLocaleString('en-US')}
          </span>
        )}
      </div>
      {discount > 0 && (
        <div className="mb-4 inline-block rounded-full px-2.5 py-1 font-mono text-[11px]" style={{ background: 'var(--amber-soft)', color: 'var(--blue-ink)' }}>
          {discount}% off
        </div>
      )}

      {isExternal ? (
        isSubscribed ? (
          <a
            href={course.courseLink || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary w-full inline-flex items-center justify-center gap-2"
          >
            <ExternalLink size={18} /> Launch on {course.courseOrigin || 'Udemy'}
          </a>
        ) : (
          <div className="flex flex-col gap-2.5">
            <button
              disabled
              className="btn btn-secondary w-full cursor-not-allowed opacity-60 inline-flex items-center justify-center gap-2"
              title="Subscribe to unlock 1,000+ Udemy courses"
            >
              <Lock size={17} /> Launch on {course.courseOrigin || 'Udemy'} (Locked)
            </button>
            <Link
              href="/membership"
              className="btn btn-g w-full inline-flex items-center justify-center gap-2 text-[13.5px]"
            >
              <Award size={15} /> Subscribe to Unlock
            </Link>
          </div>
        )
      ) : !open ? (
        <button onClick={() => setOpen(true)} className="btn btn-primary w-full">
          <Lock size={17} /> Buy &amp; pay on the platform
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-3">
          <p className="text-xs" style={{ color: 'var(--ink-soft)' }}>
            Enter your details to pay securely with MTN MoMo, Orange Money or card.
          </p>
          <input className="form-input" placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          <input className="form-input" placeholder="WhatsApp number" type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} required />
          <input className="form-input" placeholder="Phone to pay with (MoMo/OM)" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <input className="form-input" placeholder="Email (optional)" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          {error && (
            <p className="rounded-lg px-3 py-2 text-sm" style={{ background: 'rgba(220,38,38,0.08)', color: '#b91c1c' }}>{error}</p>
          )}
          <button type="submit" disabled={loading} className="btn btn-primary w-full">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
            {loading ? 'Redirecting to payment…' : `Pay ${formatXAF(course.currentPrice)}`}
          </button>
          <p className="text-center text-[11px]" style={{ color: 'var(--ink-soft)' }}>
            Powered by PayUnit · MTN MoMo · Orange Money · Card
          </p>
        </form>
      )}

      <ShareCourseButton
        url={shareUrl}
        title={course.name}
        text={course.shortDescription || `Learn ${course.name} on InTelleX.`}
        className="mt-3 w-full"
        label="Share course"
      />

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
