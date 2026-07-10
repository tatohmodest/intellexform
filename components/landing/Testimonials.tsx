'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useAnimationFrame, useInView } from 'framer-motion';
import { Play, Quote, Star, X } from 'lucide-react';
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

/* ── Blooming flower video stack ─────────────────────────────────────────── */
function VideoBloom({ videos, onOpen }: { videos: T[]; onOpen: (t: T) => void }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-120px' });

  // Fan angles for a "blooming from a plant" arrangement.
  const positions = [
    { angle: -26, x: -230, y: 24 },
    { angle: 0, x: 0, y: -10 },
    { angle: 26, x: 230, y: 24 },
  ];

  return (
    <div
      ref={ref}
      className="relative mx-auto mb-6 flex h-[440px] w-full max-w-3xl items-end justify-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* stem / plant base */}
      <motion.div
        aria-hidden
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        initial={{ scaleY: 0, opacity: 0 }}
        whileInView={{ scaleY: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{ transformOrigin: 'bottom center' }}
      >
        <div className="mx-auto h-24 w-1.5 rounded-full" style={{ background: 'linear-gradient(to top, var(--green-deep), var(--green))' }} />
        <div className="mx-auto -mt-1 h-4 w-16 rounded-b-full" style={{ background: 'var(--green-deep)' }} />
      </motion.div>

      {videos.slice(0, 3).map((t, i) => {
        const p = positions[i] ?? positions[1];
        const spread = hovered ? 1 : 0.62;
        return (
          <motion.button
            key={t.id}
            onClick={() => onOpen(t)}
            aria-label={`Play ${t.name}'s video testimonial`}
            className="group absolute bottom-16 overflow-hidden rounded-[18px] border shadow-book"
            style={{ width: 190, height: 300, transformOrigin: 'bottom center', borderColor: 'var(--line-soft)', background: 'var(--ink)', zIndex: i === 1 ? 3 : 2 }}
            initial={{ opacity: 0, y: 60, rotate: 0, x: 0 }}
            animate={inView ? { opacity: 1, x: p.x * spread, y: p.y - (hovered ? 20 : 0), rotate: p.angle * spread } : { opacity: 0, y: 60 }}
            transition={{ type: 'spring', stiffness: 120, damping: 16, delay: i * 0.08 }}
            whileHover={{ scale: 1.06, y: p.y - 44, zIndex: 5 }}
          >
            {t.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={t.photo} alt={t.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-display text-5xl" style={{ background: 'linear-gradient(135deg,#1F6B48,#17553a)', color: 'var(--paper)' }}>
                {initials(t.name)}
              </div>
            )}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(19,32,25,0.9) 0%, rgba(19,32,25,0.05) 60%)' }} />
            <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full shadow-lg transition-transform duration-300 group-hover:scale-110" style={{ background: 'var(--amber)' }}>
              <Play size={22} className="ml-0.5 text-ink" fill="currentColor" />
            </span>
            <div className="absolute inset-x-0 bottom-0 p-3 text-left text-paper">
              <p className="font-display text-[15px] leading-tight">{t.name}</p>
              <p className="font-mono text-[10px] uppercase tracking-wide" style={{ color: 'var(--amber)' }}>{t.fieldOfInterest}</p>
            </div>
          </motion.button>
        );
      })}

      <div className="pointer-events-none absolute -bottom-2 left-1/2 -translate-x-1/2 font-mono text-[11px] uppercase tracking-wide" style={{ color: 'var(--ink-soft)' }}>
        {hovered ? 'Tap a card to play' : 'Hover to bloom · tap to play'}
      </div>
    </div>
  );
}

/* ── Lightbox video player ───────────────────────────────────────────────── */
function Lightbox({ t, onClose }: { t: T; onClose: () => void }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(19,32,25,0.82)', backdropFilter: 'blur(6px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-sm overflow-hidden rounded-[20px] shadow-book"
        style={{ background: 'var(--ink)' }}
        initial={{ scale: 0.85, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 22 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} aria-label="Close" className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full" style={{ background: 'rgba(251,248,240,0.15)', color: 'var(--paper)' }}>
          <X size={18} />
        </button>
        {t.video ? (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video src={t.video} poster={t.photo || undefined} controls autoPlay playsInline className="max-h-[76vh] w-full bg-black object-contain" />
        ) : (
          <div className="flex aspect-[9/16] items-center justify-center font-display text-6xl text-paper">{initials(t.name)}</div>
        )}
        <div className="p-5 text-paper">
          <div className="mb-1"><Stars n={t.rating} /></div>
          <p className="font-display text-lg">{t.name}</p>
          <p className="font-mono text-[11px] uppercase tracking-wide" style={{ color: 'var(--amber)' }}>{t.fieldOfInterest}</p>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: 'rgba(251,248,240,0.82)' }}>{t.testimonial}</p>
        </div>
      </motion.div>
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
    el.scrollLeft += (28 * delta) / 1000;
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
    <div
      ref={ref}
      className="no-scrollbar flex cursor-grab gap-5 overflow-x-auto pb-2 active:cursor-grabbing"
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
          className="flex w-[320px] flex-shrink-0 flex-col rounded-[18px] border p-6 transition-transform duration-300 hover:-translate-y-1"
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
  );
}

export default function Testimonials() {
  const videos = TESTIMONIALS.filter((t) => t.video);
  const quotes = TESTIMONIALS.filter((t) => !t.video);
  const [active, setActive] = useState<T | null>(null);

  return (
    <section id="testimonials" className="overflow-hidden py-24" style={{ background: 'var(--paper-dim)' }}>
      <div className="wrap">
        <Reveal className="mb-12 max-w-2xl">
          <div className="tab mb-4">Student stories</div>
          <h2 className="mb-3 text-[38px] leading-[1.12]">Real learners. Real outcomes.</h2>
          <p className="text-base" style={{ color: 'var(--ink-soft)' }}>
            Hundreds of students have built skills and confidence with Intellex. Hear it in their own
            voices — the video stories below bloom open, tap any to play.
          </p>
        </Reveal>

        <VideoBloom videos={videos} onOpen={setActive} />
      </div>

      {/* Full-bleed marquee */}
      <div className="mt-6">
        <QuoteMarquee quotes={quotes} />
      </div>

      <AnimatePresence>
        {active && <Lightbox t={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </section>
  );
}
