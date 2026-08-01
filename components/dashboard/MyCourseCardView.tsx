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
      className="group flex h-full min-w-0 flex-col overflow-hidden border bg-paper transition-shadow hover:shadow-card"
      style={{ borderColor: live ? '#b91c1c' : 'var(--ink)' }}
    >
      <Link href={c.href} className="relative block aspect-[16/10] overflow-hidden">
        {c.source !== 'tutorial' && c.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={c.thumbnailUrl}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <>
            <div
              className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.03]"
              style={{
                background: `linear-gradient(145deg, ${c.color} 0%, ${c.color}bb 42%, #0C1116 100%)`,
              }}
            />
            {logoSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoSrc}
                alt=""
                aria-hidden
                className="pointer-events-none absolute -left-6 bottom-[-18%] h-[125%] w-auto max-w-[78%] object-contain opacity-[0.16] brightness-0 invert"
              />
            ) : null}
          </>
        )}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span className="bg-white/95 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--ink)]">
            {c.tag}
          </span>
          {live ? (
            <span className="inline-flex items-center gap-1 bg-[#b91c1c] px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-white">
              <Radio size={10} className="animate-pulse" /> Live now
            </span>
          ) : null}
          {c.enrolled && (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-white"
              style={{ background: 'var(--green-deep)' }}
            >
              <Check size={10} /> Enrolled
            </span>
          )}
          {c.pricingType === 'FREE' ? (
            <span className="bg-black/55 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-white">
              Free
            </span>
          ) : typeof c.priceXaf === 'number' && c.priceXaf > 0 ? (
            <span className="bg-black/55 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-white">
              {c.priceXaf.toLocaleString()} XAF
            </span>
          ) : null}
        </div>
        {c.enrolled && c.pct > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/25">
            <div
              className="h-full bg-white"
              style={{ width: `${Math.min(100, Math.max(c.pct, 2))}%` }}
            />
          </div>
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5 p-2.5 sm:gap-2 sm:p-4">
        <Link href={c.href} className="min-w-0">
          <div className="flex items-start gap-2 sm:gap-2.5">
            {c.source === 'tutorial' ? (
              <span
                className="mt-0.5 hidden h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border sm:flex"
                style={{ borderColor: 'var(--line)', background: '#fff' }}
              >
                <TrackLogo
                  slug={c.slug}
                  color={c.color}
                  size={24}
                  className="!rounded-full !bg-transparent"
                />
              </span>
            ) : null}
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-[14px] font-semibold leading-snug line-clamp-2 sm:text-[17px]">
                {c.title}
              </h3>
              <p
                className="mt-1 line-clamp-2 hidden break-words text-[13px] leading-relaxed sm:block"
                style={{ color: 'var(--ink-soft)' }}
              >
                {compactTagline}
              </p>
            </div>
          </div>
        </Link>

        <div
          className="mt-0.5 hidden flex-wrap gap-x-3 gap-y-1 text-[12px] sm:mt-1 sm:flex"
          style={{ color: 'var(--ink-soft)' }}
        >
          {c.totalLessons > 0 && (
            <span className="inline-flex items-center gap-1">
              <BookOpen size={12} /> {c.totalLessons} lessons
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Clock size={12} /> ~{hours}h
          </span>
          <span className="inline-flex items-center gap-1">
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
            <span className="inline-flex items-center gap-1">
              <Award size={12} /> Certificate
            </span>
          )}
          {c.level && <span className="capitalize">{c.level}</span>}
        </div>

        {c.instructorName && (
          <p className="hidden text-[12px] sm:block" style={{ color: 'var(--ink-soft)' }}>
            Taught by {c.instructorName}
          </p>
        )}

        <div className="mt-auto flex flex-col gap-1.5 pt-2 sm:gap-2 sm:pt-3">
          {live ? (
            <Link
              href={`/dashboard/sessions/${live.channel}`}
              className="inline-flex w-full items-center justify-center gap-1.5 px-2 py-2 text-[11.5px] font-semibold text-white sm:px-3 sm:py-2.5 sm:text-[13px]"
              style={{ background: '#b91c1c' }}
            >
              <Radio size={13} className="animate-pulse" /> Join live class
            </Link>
          ) : null}
          <Link
            href={c.href}
            className="inline-flex w-full items-center justify-center border px-2 py-2 text-[11.5px] font-semibold sm:px-3 sm:py-2.5 sm:text-[13px]"
            style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
          >
            View details
          </Link>
          {c.source === 'tutorial' ? (
            <EnrollButton
              courseSlug={c.slug}
              enrolled={c.enrolled}
              continueHref={c.continueHref}
              editorial
            />
          ) : !live ? (
            <Link
              href={c.href}
              className="inline-flex w-full items-center justify-center gap-1.5 px-2 py-2 text-[11.5px] font-semibold text-white sm:px-3 sm:py-2.5 sm:text-[13px]"
              style={{ background: 'var(--green)' }}
            >
              {c.pricingType === 'FREE' ? 'Open course' : 'Get access'}
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}
