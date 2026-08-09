'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Award, ExternalLink, Loader2, Lock, ShieldCheck } from 'lucide-react';
import { Course } from '@/lib/types';
import { formatXAF } from '@/lib/format';
import ShareCourseButton from '@/components/ShareCourseButton';
import { isIntellexCourse } from '@/lib/googleDrive';

export default function PurchasePanel({
  course,
  shareUrl,
  isSubscribed = false,
  user = null,
}: {
  course: Course;
  shareUrl: string;
  isSubscribed?: boolean;
  user?: { uid: string; email?: string | null; name?: string | null } | null;
}) {
  const [open, setOpen] = useState(false);
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
        body: JSON.stringify({
          courseSlug: course.slug,
          userId: user?.uid,
          fullName: user?.name || 'Student',
          email: user?.email || '',
          whatsapp: phone || '000000000',
          phone,
        }),
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

  const isIntellex = isIntellexCourse(course.courseOrigin);

  return (
    <div className="rounded-[20px] border bg-paper p-6 shadow-card" style={{ borderColor: 'var(--line)' }}>
      <div className="mb-2">
        <span
          className="inline-block rounded-full px-2.5 py-0.5 font-mono text-[10.5px] uppercase tracking-wide"
          style={{
            background: isIntellex ? 'rgba(0,179,105,0.12)' : 'rgba(234,179,8,0.15)',
            color: isIntellex ? 'var(--green-deep)' : '#854d0e',
          }}
        >
          {isIntellex ? 'Intellex Subscription Course' : 'Individual Purchase Only'}
        </span>
      </div>

      <div className="mb-1 flex items-baseline gap-2">
        <span className="font-display text-[32px] font-semibold">
          {course.currentPrice > 0 ? formatXAF(course.currentPrice) : isIntellex ? 'Included in Subscription' : 'Paid Course'}
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

      {!isIntellex && (
        <p className="mb-4 text-xs leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
          This course is not part of the subscription plan and must be bought individually.
        </p>
      )}

      {isIntellex && isSubscribed ? (
        <Link
          href={`/dashboard/courses/${course.slug}`}
          className="btn btn-primary w-full inline-flex items-center justify-center gap-2"
        >
          <Award size={18} /> Access Course (Subscription Active)
        </Link>
      ) : !user ? (
        <div className="flex flex-col gap-2.5">
          <Link
            href={`/login?next=/courses/${course.slug}`}
            className="btn btn-primary w-full inline-flex items-center justify-center gap-2"
          >
            <Lock size={17} /> Sign in to Buy ({formatXAF(course.currentPrice)})
          </Link>
          {isIntellex && (
            <Link
              href="/membership"
              className="btn btn-g w-full inline-flex items-center justify-center gap-2 text-[13.5px]"
            >
              <Award size={15} /> Subscribe to Unlock All Intellex Courses
            </Link>
          )}
        </div>
      ) : !open ? (
        <div className="flex flex-col gap-2.5">
          <button onClick={() => setOpen(true)} className="btn btn-primary w-full inline-flex items-center justify-center gap-2">
            <Lock size={17} /> Buy Course ({formatXAF(course.currentPrice)})
          </button>
          {isIntellex && (
            <Link
              href="/membership"
              className="btn btn-g w-full inline-flex items-center justify-center gap-2 text-[13.5px]"
            >
              <Award size={15} /> Subscribe to Unlock All Intellex Courses
            </Link>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-3">
          <div className="rounded-xl border p-3 text-xs" style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}>
            <span className="block font-semibold" style={{ color: 'var(--ink)' }}>Account Linked:</span>
            <span className="truncate block" style={{ color: 'var(--ink-soft)' }}>
              {user.name || 'Student'} ({user.email || 'Signed in'})
            </span>
          </div>

          <label className="text-xs font-semibold" style={{ color: 'var(--ink-soft)' }}>
            MoMo / Orange Money Payment Phone (Optional)
          </label>
          <input
            className="form-input"
            placeholder="e.g. 670000000"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          {error && (
            <p className="rounded-lg px-3 py-2 text-sm" style={{ background: 'rgba(220,38,38,0.08)', color: '#b91c1c' }}>{error}</p>
          )}

          <button type="submit" disabled={loading} className="btn btn-primary w-full">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
            {loading ? 'Redirecting to payment…' : `Confirm & Pay ${formatXAF(course.currentPrice)}`}
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-center text-xs py-1 hover:underline"
            style={{ color: 'var(--ink-soft)' }}
          >
            Cancel
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
