'use client';

import { useCallback, useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export type HeroSlide = {
  id: string;
  image: string;
  alt: string;
  headline: ReactNode;
  body: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

const AUTO_MS = 5600;

export default function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dir, setDir] = useState(1);

  const go = useCallback(
    (next: number, d: number) => {
      setDir(d);
      setIndex(((next % slides.length) + slides.length) % slides.length);
    },
    [slides.length],
  );

  const prev = () => go(index - 1, -1);
  const next = () => go(index + 1, 1);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const t = window.setTimeout(() => go(index + 1, 1), AUTO_MS);
    return () => window.clearTimeout(t);
  }, [index, paused, go, slides.length]);

  const slide = slides[index];

  return (
    <header
      className="relative"
      style={{ background: 'var(--paper)' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false);
      }}
    >
      {/* ── Mobile: illustration on top, matching card below ── */}
      <div className="sm:hidden">
        <div className="relative h-[220px] w-full overflow-hidden">
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.img
              key={slide.id + '-m-img'}
              src={slide.image}
              alt={slide.alt}
              custom={dir}
              initial={{ opacity: 0, x: dir * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -40 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          </AnimatePresence>
        </div>
        <div className="wrap py-7">
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.div
              key={slide.id + '-m-card'}
              custom={dir}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <h1 className="mb-3 font-display text-[26px] leading-[1.15]">{slide.headline}</h1>
              <p className="mb-5 text-[15px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                {slide.body}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href={slide.ctaHref || '/register'} className="btn btn-primary">
                  {slide.ctaLabel || 'Get started'}
                </Link>
                <Link href={slide.secondaryHref || '/#pricing'} className="btn btn-ghost">
                  {slide.secondaryLabel || 'See pricing'}
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
          <Dots slides={slides} index={index} onSelect={(i) => go(i, i > index ? 1 : -1)} className="mt-6" />
        </div>
      </div>

      {/* ── Desktop / tablet: illustration + near-square card carousel ── */}
      <div className="relative hidden overflow-hidden sm:block">
        <div className="absolute inset-0">
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.img
              key={slide.id + '-d-img'}
              src={slide.image}
              alt={slide.alt}
              custom={dir}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              className="absolute inset-0 h-full w-full object-cover object-right"
            />
          </AnimatePresence>
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(90deg, rgba(251,248,240,0.9) 0%, rgba(251,248,240,0.55) 36%, rgba(251,248,240,0.08) 66%, rgba(251,248,240,0) 100%)',
            }}
          />
        </div>

        <div className="wrap relative flex items-center py-12 lg:min-h-[400px] lg:py-14">
          <div className="relative w-full max-w-[360px]">
            <AnimatePresence mode="wait" custom={dir} initial={false}>
              <motion.div
                key={slide.id + '-d-card'}
                custom={dir}
                initial={{ opacity: 0, x: dir * -28, y: 8 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: dir * 24, y: -6 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="flex aspect-[1/0.95] flex-col justify-center rounded-2xl border p-7 shadow-book lg:p-8"
                style={{ background: 'rgba(255,255,255,0.96)', borderColor: 'var(--line)' }}
              >
                <h1 className="mb-3 font-display text-[28px] leading-[1.12] lg:text-[32px]">{slide.headline}</h1>
                <p className="mb-6 text-[15px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                  {slide.body}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href={slide.ctaHref || '/register'} className="btn btn-primary">
                    {slide.ctaLabel || 'Get started'}
                  </Link>
                  <Link href={slide.secondaryHref || '/#pricing'} className="btn btn-ghost">
                    {slide.secondaryLabel || 'See pricing'}
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* controls */}
          <div className="absolute bottom-6 right-0 flex items-center gap-2 md:bottom-8">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous slide"
              className="flex h-10 w-10 items-center justify-center rounded-full border bg-white/90 transition hover:-translate-y-0.5"
              style={{ borderColor: 'var(--line)' }}
            >
              <ChevronLeft size={18} />
            </button>
            <Dots slides={slides} index={index} onSelect={(i) => go(i, i > index ? 1 : -1)} />
            <button
              type="button"
              onClick={next}
              aria-label="Next slide"
              className="flex h-10 w-10 items-center justify-center rounded-full border bg-white/90 transition hover:-translate-y-0.5"
              style={{ borderColor: 'var(--line)' }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* autoplay progress */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ background: 'rgba(12,17,22,0.06)' }}>
          <motion.div
            key={slide.id + '-bar'}
            className="h-full origin-left"
            style={{ background: 'var(--green)' }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: paused ? undefined : 1 }}
            transition={paused ? { duration: 0 } : { duration: AUTO_MS / 1000, ease: 'linear' }}
          />
        </div>
      </div>
    </header>
  );
}

function Dots({
  slides,
  index,
  onSelect,
  className = '',
}: {
  slides: HeroSlide[];
  index: number;
  onSelect: (i: number) => void;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`} role="tablist" aria-label="Hero slides">
      {slides.map((s, i) => (
        <button
          key={s.id}
          type="button"
          role="tab"
          aria-selected={i === index}
          aria-label={`Show slide ${i + 1}`}
          onClick={() => onSelect(i)}
          className="h-2 rounded-full transition-all"
          style={{
            width: i === index ? 22 : 8,
            background: i === index ? 'var(--green)' : 'rgba(12,17,22,0.18)',
          }}
        />
      ))}
    </div>
  );
}
