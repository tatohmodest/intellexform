'use client';

import Link from 'next/link';
import { ShieldCheck, UserPlus } from 'lucide-react';
import { Course } from '@/lib/types';
import { formatXAF } from '@/lib/format';
import ShareCourseButton from '@/components/ShareCourseButton';

export default function PurchasePanel({
  course,
  shareUrl,
}: {
  course: Course;
  shareUrl: string;
}) {
  const discount =
    course.originalPrice > course.currentPrice && course.originalPrice > 0
      ? Math.round((1 - course.currentPrice / course.originalPrice) * 100)
      : 0;

  return (
    <div className="rounded-[20px] border bg-paper p-6 shadow-card" style={{ borderColor: 'var(--line)' }}>
      <div className="mb-1 flex items-baseline gap-2">
        <span className="font-display text-[32px] font-semibold">
          {course.currentPrice > 0 ? formatXAF(course.currentPrice) : 'Programme'}
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

      <Link
        href={`/contact?type=learner&course=${encodeURIComponent(course.name)}`}
        className="btn btn-primary w-full inline-flex items-center justify-center gap-2"
      >
        <UserPlus size={18} /> Register for this programme
      </Link>
      <p className="mt-3 text-xs leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
        Taught in live classes - no recorded videos. Register and our team will confirm your cohort.
      </p>

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
