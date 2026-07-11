'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useAnimationFrame } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Quote, Star, Volume2, X } from 'lucide-react';
import { TESTIMONIALS } from '@/lib/data/testimonials';
import Reveal from '@/components/Reveal';

type T = (typeof TESTIMONIALS)[number];

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14} style={{ fill: i < n ? 'var(--amber)' : 'transparent', color: i < n ? 'var(--amber)' : 'var(--line)' }} />
      ))}
    </div>
  );
}

function initials(name: string) {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
}

/* ── Ambient autoplay preview card ───────────────────────────────────────── */
function PreviewCard({ t, index, onOpen }: { t: T; index: number; onOpen: () => void }) {
  return (
    <motion.button
      onClick={onOpen}
      aria-label={`Watch ${t.name}'s story`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -6 }}
      className="group relative aspect-[9/16] w-[78%] flex-shrink-0 snap-center overflow-hidden rounded-[24px] text-left shadow-book sm:aspect-[3/4] sm:w-full"
      style={{ background: 'var(--ink)', border: '1px solid var(--line)' }}
    >
      {/* gradient ring accent */}
      <span className="pointer-events-none absolute inset-0 z-20 rounded-[24px]" style={{ boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.08)' }} />
      {t.video ? (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video
          src={t.video}
          poster={t.photo || undefined}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : t.photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={t.photo} alt={t.name} className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center font-display text-6xl" style={{ background: 'linear-gradient(135deg,#00b369,#009a5a)', color: '#fff' }}>
          {initials(t.name)}
        </div>
      )}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(12,17,22,0.92) 4%, rgba(12,17,22,0.05) 55%)' }} />

      <span className="absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide backdrop-blur" style={{ background: 'rgba(12,17,22,0.5)', color: '#fff' }}>
        <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: 'var(--green)' }} /> Video story
      </span>

      {/* play affordance */}
      <span className="absolute left-1/2 top-1/2 z-10 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full shadow-lg transition-transform duration-300 group-hover:scale-110" style={{ background: 'rgba(255,255,255,0.92)' }}>
        <Play size={22} className="ml-0.5" style={{ color: 'var(--ink)' }} fill="currentColor" />
      </span>

      <div className="absolute inset-x-0 bottom-0 z-10 p-5 text-white">
        <div className="mb-1.5"><Stars n={t.rating} /></div>
        <p className="font-display text-lg leading-tight">{t.name}</p>
        <p className="font-mono text-[11px] uppercase tracking-wide" style={{ color: 'var(--green)' }}>{t.fieldOfInterest}</p>
        <p className="mt-2 inline-flex items-center gap-1.5 text-[11px]" style={{ color: 'rgba(255,255,255,0.7)' }}>
          <Volume2 size={12} /> Tap to watch with sound
        </p>
      </div>
    </motion.button>
  );
}

/* ── Immersive full-screen reels player ──────────────────────────────────── */
function ReelsPlayer({ items, index, setIndex, onClose }: { items: T[]; index: number; setIndex: (i: number) => void; onClose: () => void }) {
  const t = items[index];
  const go = (dir: number) => setIndex((index + dir + items.length) % items.length);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    }
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6"
      style={{ background: 'rgba(8,11,15,0.9)', backdropFilter: 'blur(10px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full" style={{ background: 'rgba(255,255,255,0.14)', color: '#fff' }}>
        <X size={20} />
      </button>

      {/* desktop nav arrows */}
      <button onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label="Previous" className="absolute left-4 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full md:flex" style={{ background: 'rgba(255,255,255,0.14)', color: '#fff' }}>
        <ChevronLeft size={24} />
      </button>
      <button onClick={(e) => { e.stopPropagation(); go(1); }} aria-label="Next" className="absolute right-4 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full md:flex" style={{ background: 'rgba(255,255,255,0.14)', color: '#fff' }}>
        <ChevronRight size={24} />
      </button>

      <motion.div
        key={t.id}
        className="relative w-full max-w-[380px] overflow-hidden rounded-[24px] shadow-book"
        style={{ background: '#000' }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 24 }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={(_, info) => {
          if (info.offset.x < -80) go(1);
          else if (info.offset.x > 80) go(-1);
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {t.video ? (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video src={t.video} poster={t.photo || undefined} controls autoPlay playsInline className="max-h-[74vh] w-full bg-black object-contain" />
        ) : (
          <div className="flex aspect-[9/16] items-center justify-center font-display text-6xl text-white">{initials(t.name)}</div>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)' }}>
          <div className="mb-1"><Stars n={t.rating} /></div>
          <p className="font-display text-lg text-white">{t.name}</p>
          <p className="font-mono text-[11px] uppercase tracking-wide" style={{ color: 'var(--green)' }}>{t.fieldOfInterest}</p>
        </div>
      </motion.div>

      {/* progress dots */}
      <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {items.map((it, i) => (
          <button
            key={it.id}
            onClick={(e) => { e.stopPropagation(); setIndex(i); }}
            aria-label={`Go to story ${i + 1}`}
            className="h-2 rounded-full transition-all"
            style={{ width: i === index ? 22 : 8, background: i === index ? 'var(--green)' : 'rgba(255,255,255,0.4)' }}
          />
        ))}
      </div>
    </motion.div>
  );
}

/* ── Draggable, auto-scrolling marquee of quote cards ────────────────────── */
function QuoteMarquee({ quotes }: { quotes: T[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const paused = useRef(false);
  const drag = useRef<{ active: boolean; startX: number; startScroll: number }>({ active: false, startX: 0, startScroll: 0 });

  useAnimationFrame((_, delta) => {
    const el = ref.current;
    if (!el || paused.current) return;
    el.scrollLeft += (32 * delta) / 1000;
    const half = el.scrollWidth / 2;
    if (half > 0 && el.scrollLeft >= half) el.scrollLeft -= half;
  });

  function onPointerDown(e: React.PointerEvent) {
    const el = ref.current;
    if (!el) return;
    drag.current = { active: true, startX: e.clientX, startScroll: el.scrollLeft };
    paused.current = true;
    el.setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent) {
    const el = ref.current;
    if (!el || !drag.current.active) return;
    el.scrollLeft = drag.current.startScroll - (e.clientX - drag.current.startX);
  }
  function onPointerUp() {
    drag.current.active = false;
    paused.current = false;
  }

  const items = [...quotes, ...quotes];

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 sm:w-16" style={{ background: 'linear-gradient(to right, var(--paper), transparent)' }} />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 sm:w-16" style={{ background: 'linear-gradient(to left, var(--paper), transparent)' }} />
      <div
        ref={ref}
        className="no-scrollbar flex cursor-grab gap-4 overflow-x-auto pb-2 active:cursor-grabbing sm:gap-5"
        onMouseEnter={() => (paused.current = true)}
        onMouseLeave={() => { if (!drag.current.active) paused.current = false; }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {items.map((t, i) => (
          <div
            key={`${t.id}-${i}`}
            className="flex w-[280px] flex-shrink-0 flex-col rounded-[18px] border p-6 transition-transform duration-300 hover:-translate-y-1 sm:w-[320px]"
            style={{ background: 'var(--paper)', borderColor: 'var(--line)' }}
          >
            <Quote size={22} className="mb-3" style={{ color: 'var(--green)' }} />
            <p className="mb-5 flex-1 text-sm leading-relaxed line-clamp-3" style={{ color: 'var(--ink-soft)' }}>{t.testimonial}</p>
            <div className="flex items-center gap-3">
              {t.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={t.photo} alt={t.name} className="h-10 w-10 rounded-full object-cover" draggable={false} />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full font-display text-sm" style={{ background: 'var(--green-deep)', color: 'var(--paper)' }}>{initials(t.name)}</div>
              )}
              <div>
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs" style={{ color: 'var(--ink-soft)' }}>{t.fieldOfInterest}</p>
              </div>
              <div className="ml-auto"><Stars n={t.rating} /></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Testimonials() {
  const videos = TESTIMONIALS.filter((t) => t.video);
  const quotes = TESTIMONIALS.filter((t) => !t.video);
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="testimonials" className="overflow-hidden py-16 sm:py-24" style={{ background: 'var(--paper-dim)' }}>
      <div className="wrap">
        <Reveal className="mb-8 max-w-2xl sm:mb-10">
          <div className="tab mb-4">Student stories</div>
          <h2 className="mb-3 text-[27px] leading-[1.15] sm:text-[38px]">Real learners. Real outcomes.</h2>
          <p className="text-base" style={{ color: 'var(--ink-soft)' }}>
            Hear it straight from students — in their own voices. The stories play live; tap any to watch full-screen.
          </p>
        </Reveal>

        <div className="mb-4 flex items-center gap-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: 'var(--green-deep)' }}>Watch their stories</span>
          <span className="h-px flex-1" style={{ background: 'var(--line)' }} />
        </div>

        {/* mobile: swipeable reel carousel · desktop: grid */}
        <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible sm:px-0">
          {videos.map((t, i) => (
            <PreviewCard key={t.id} t={t} index={i} onOpen={() => setActive(i)} />
          ))}
        </div>
      </div>

      {/* written testimonials band */}
      <div className="mt-12 border-y py-8 sm:mt-16 sm:py-10" style={{ borderColor: 'var(--line)', background: 'var(--paper)' }}>
        <div className="wrap mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="font-display text-[20px] sm:text-[22px]">In their own words</div>
            <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>A live scroll of what the community is saying — swipe to explore.</p>
          </div>
          <span className="pill inline-flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full" style={{ background: 'var(--green)' }} /> Live from the community
          </span>
        </div>
        <QuoteMarquee quotes={quotes} />
      </div>

      <AnimatePresence>
        {active !== null && (
          <ReelsPlayer items={videos} index={active} setIndex={setActive} onClose={() => setActive(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
