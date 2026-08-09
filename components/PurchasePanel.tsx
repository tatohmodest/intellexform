'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Award, ExternalLink, Loader2, Lock, Play, ShieldCheck } from 'lucide-react';
import { Course } from '@/lib/types';
import { formatXAF } from '@/lib/format';
import ShareCourseButton from '@/components/ShareCourseButton';
import { isIntellexCourse } from '@/lib/googleDrive';

export default function PurchasePanel({
  course,
  shareUrl,
  isSubscribed = false,
  hasAccess = false,
  user = null,
}: {
  course: Course;
  shareUrl: string;
  isSubscribed?: boolean;
  hasAccess?: boolean;
  user?: { uid: string; email?: string | null; name?: string | null } | null;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleCheckout() {
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
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.transactionUrl) throw new Error(data.error || 'Could not start payment');
      // Redirect directly to PayUnit checkout (or mock gateway in sandbox).
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
  const userUnlocked = hasAccess || (isIntellex && isSubscribed);

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
          {userUnlocked ? 'Purchased / Unlocked' : course.currentPrice > 0 ? formatXAF(course.currentPrice) : isIntellex ? 'Included in Subscription' : 'Paid Course'}
        </span>
        {discount > 0 && !userUnlocked && (
          <span className="font-mono text-sm line-through" style={{ color: 'var(--ink-soft)' }}>
            {course.originalPrice.toLocaleString('en-US')}
          </span>
        )}
      </div>
      {discount > 0 && !userUnlocked && (
        <div className="mb-4 inline-block rounded-full px-2.5 py-1 font-mono text-[11px]" style={{ background: 'var(--amber-soft)', color: 'var(--blue-ink)' }}>
          {discount}% off
        </div>
      )}

      {!isIntellex && !userUnlocked && (
        <p className="mb-4 text-xs leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
          This course is not part of the subscription plan and must be bought individually.
        </p>
      )}

      {userUnlocked ? (
        <Link
          href={`/dashboard/drive-player/${course.slug}`}
          className="btn btn-primary w-full inline-flex items-center justify-center gap-2"
        >
          <Play size={18} /> Enter Course (Launch Player)
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
      ) : (
        <div className="flex flex-col gap-2.5">
          {error && (
            <p className="rounded-lg px-3 py-2 text-sm" style={{ background: 'rgba(220,38,38,0.08)', color: '#b91c1c' }}>{error}</p>
          )}
          <button
            type="button"
            onClick={handleCheckout}
            disabled={loading}
            className="btn btn-primary w-full inline-flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Lock size={17} />}
            {loading ? 'Redirecting to PayUnit…' : `Buy Course (${formatXAF(course.currentPrice)})`}
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
