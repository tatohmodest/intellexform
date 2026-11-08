'use client';

import Link from 'next/link';
import {
  Award,
  BookOpen,
  Check,
  Clock,
  GraduationCap,
  Radio,
} from 'lucide-react';
import TrackLogo from '@/components/TrackLogo';
import EnrollButton from '@/components/dashboard/EnrollButton';
import { getTrackLogo } from '@/lib/techLogos';
import type { MyCourseCard } from '@/lib/learn/myCourses';

export default function MyCourseCardView({ course: c }: { course: MyCourseCard }) {
  const hours = Math.max(1, Math.round((c.totalMinutes || 60) / 60));
  const logoSrc = c.source === 'tutorial' ? getTrackLogo(c.slug) : c.thumbnailUrl;
  const live = c.liveSession;
  const compactTagline = (live ? `Class in progress with ${live.instructorName}` : c.tagline || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 170);

  return (
    <article
      className={`group flex h-full min-w-0 flex-col overflow-hidden rounded-3xl bg-white p-2.5 transition-shadow hover:shadow-[0_18px_40px_-26px_rgba(18,50,79,0.5)] ${
        live ? 'ring-2 ring-[#e5484d]' : ''
      }`}
    >
      <Link
        href={c.href}
        className="relative block aspect-[16/10] overflow-hidden rounded-2xl"
        style={{ background: `${c.color}1f` }}
      >
        {c.source !== 'tutorial' && c.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={c.thumbnailUrl}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span
              className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-[0_10px_24px_-14px_rgba(18,50,79,0.45)] transition-transform duration-300 group-hover:-translate-y-1"
            >
              {c.source === 'tutorial' ? (
                <TrackLogo slug={c.slug} color={c.color} size={36} className="!rounded-xl !bg-transparent" />
              ) : logoSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoSrc} alt="" className="h-9 w-9 object-contain" />
              ) : (
                <BookOpen size={26} style={{ color: c.color }} />
              )}
            </span>
          </div>
        )}
        <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-semibold text-[var(--navy)]">{c.tag}</span>
          {live ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#e5484d] px-2.5 py-0.5 text-[11px] font-semibold text-white">
              <Radio size={10} className="animate-pulse" /> Live now
            </span>
          ) : null}
          {c.enrolled && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--green)] px-2.5 py-0.5 text-[11px] font-semibold text-white">
              <Check size={10} /> Enrolled
            </span>
          )}
          {c.pricingType === 'FREE' ? (
            <span className="rounded-full bg-[var(--navy)] px-2.5 py-0.5 text-[11px] font-semibold text-white">Free</span>
          ) : typeof c.priceXaf === 'number' && c.priceXaf > 0 ? (
            <span className="rounded-full bg-[var(--navy)] px-2.5 py-0.5 text-[11px] font-semibold text-white">
              {c.priceXaf.toLocaleString()} XAF
            </span>
          ) : null}
        </div>
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5 px-1.5 pb-1.5 pt-3 sm:gap-2">
        <Link href={c.href} className="min-w-0">
          <h3 className="line-clamp-2 text-[15px] font-bold leading-snug text-[var(--navy)] sm:text-[16.5px]">{c.title}</h3>
          <p className="mt-1 line-clamp-2 hidden break-words text-[13px] leading-relaxed text-[var(--ink-soft)] sm:block">
            {compactTagline}
          </p>
        </Link>

        <div className="mt-0.5 hidden flex-wrap gap-1.5 text-[12px] text-[var(--navy)]/75 sm:flex">
          {c.totalLessons > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--paper-dim)] px-2.5 py-1">
              <BookOpen size={12} /> {c.totalLessons} lessons
            </span>
          )}
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--paper-dim)] px-2.5 py-1">
            <Clock size={12} /> ~{hours}h
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--paper-dim)] px-2.5 py-1">
            <GraduationCap size={12} />
            {c.source === 'tutorial'
              ? 'Track'
              : c.source === 'instructor'
                ? c.deliveryMode === 'live' || c.deliveryMode === 'hybrid'
                  ? 'Live'
                  : 'Self-paced'
                : 'Catalogue'}
          </span>
          {c.certificate && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--paper-dim)] px-2.5 py-1">
              <Award size={12} /> Certificate
            </span>
          )}
        </div>

        {c.instructorName && <p className="hidden text-[12.5px] text-[var(--ink-soft)] sm:block">Taught by {c.instructorName}</p>}

        {c.enrolled && c.pct > 0 && (
          <div className="mt-1">
            <div className="flex justify-between text-[12px]">
              <span className="text-[var(--ink-soft)]">Progress</span>
              <span className="font-bold text-[var(--green-deep)]">{Math.round(c.pct)}%</span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[var(--paper-dim)]">
              <div className="h-full rounded-full bg-[var(--green)]" style={{ width: `${Math.min(100, Math.max(c.pct, 2))}%` }} />
            </div>
          </div>
        )}

        <div className="mt-auto flex flex-col gap-2 pt-3">
          {live ? (
            <Link
              href={`/dashboard/sessions/${live.channel}`}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#e5484d] px-3 py-2.5 text-[13px] font-semibold text-white"
            >
              <Radio size={13} className="animate-pulse" /> Join live class
            </Link>
          ) : null}
          {c.source === 'tutorial' ? (
            <EnrollButton courseSlug={c.slug} enrolled={c.enrolled} continueHref={c.continueHref} editorial />
          ) : !live ? (
            <Link
              href={c.href}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-[var(--green)] px-3 py-2.5 text-[13px] font-semibold text-white hover:bg-[var(--green-deep)]"
            >
              {c.pricingType === 'FREE' ? 'Open course' : 'Get access'}
            </Link>
          ) : null}
          <Link
            href={c.href}
            className="inline-flex w-full items-center justify-center rounded-xl bg-[var(--paper-dim)] px-3 py-2.5 text-[13px] font-semibold text-[var(--navy)] hover:bg-[var(--pastel-sky)]"
          >
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}
