'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Quote, Star } from 'lucide-react';
import { TESTIMONIALS } from '@/lib/data/testimonials';

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < n ? 'text-amber' : ''}
          style={{ fill: i < n ? 'var(--amber)' : 'transparent', color: i < n ? 'var(--amber)' : 'var(--line)' }}
        />
      ))}
    </div>
  );
}

function initials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function VideoCard({
  t,
  index,
}: {
  t: (typeof TESTIMONIALS)[number];
  index: number;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      className="group relative overflow-hidden rounded-[20px] border shadow-book"
      style={{ borderColor: 'var(--line-soft)', background: 'var(--ink)' }}
    >
      <div className="relative aspect-[9/13] w-full overflow-hidden">
        {playing ? (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video
            src={t.video}
            poster={t.photo || undefined}
            controls
            autoPlay
            playsInline
            className="h-full w-full object-cover"
          />
        ) : (
          <>
            {t.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={t.photo}
                alt={t.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center font-display text-6xl"
                style={{ background: 'linear-gradient(135deg,#1F6B48,#17553a)', color: 'var(--paper)' }}
              >
                {initials(t.name)}
              </div>
            )}
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(19,32,25,0.85) 0%, rgba(19,32,25,0.05) 55%)' }}
            />
            <button
              onClick={() => setPlaying(true)}
              aria-label={`Play ${t.name}'s testimonial`}
              className="absolute inset-0 flex items-center justify-center"
            >
              <span
                className="flex h-16 w-16 items-center justify-center rounded-full shadow-lg transition-transform duration-300 group-hover:scale-110"
                style={{ background: 'var(--amber)' }}
              >
                <Play size={26} className="ml-1 text-ink" fill="currentColor" />
              </span>
            </button>
            <div className="absolute inset-x-0 bottom-0 p-5 text-paper">
              <div className="mb-1.5">
                <Stars n={t.rating} />
              </div>
              <p className="font-display text-lg leading-tight">{t.name}</p>
              <p className="font-mono text-[11px] uppercase tracking-wide" style={{ color: 'var(--amber)' }}>
                {t.fieldOfInterest}
              </p>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

export default function Testimonials() {
  const videos = TESTIMONIALS.filter((t) => t.video);
  const quotes = TESTIMONIALS.filter((t) => !t.video);

  return (
    <section id="testimonials" className="section-pad py-24" style={{ background: 'var(--paper-dim)' }}>
      <div className="wrap">
        <div className="mb-12 max-w-2xl">
          <div className="tab mb-4">Student stories</div>
          <h2 className="mb-3 text-[38px] leading-[1.12]">
            Real learners. Real outcomes.
          </h2>
          <p className="text-base" style={{ color: 'var(--ink-soft)' }}>
            Hundreds of students have built skills and confidence with Intellex. Hear it straight from
            them — in their own words, and in their own voices.
          </p>
        </div>

        {/* Video wall */}
        <div className="mb-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((t, i) => (
            <VideoCard key={t.id} t={t} index={i} />
          ))}
        </div>

        {/* Quote grid */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {quotes.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}
              className="flex flex-col rounded-[18px] border p-6"
              style={{ background: 'var(--paper)', borderColor: 'var(--line)' }}
            >
              <Quote size={22} className="mb-3" style={{ color: 'var(--green)' }} />
              <p className="mb-5 flex-1 text-sm leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                {t.testimonial}
              </p>
              <div className="flex items-center gap-3">
                {t.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.photo} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full font-display text-sm"
                    style={{ background: 'var(--green-deep)', color: 'var(--paper)' }}
                  >
                    {initials(t.name)}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs" style={{ color: 'var(--ink-soft)' }}>{t.fieldOfInterest}</p>
                </div>
                <div className="ml-auto">
                  <Stars n={t.rating} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
