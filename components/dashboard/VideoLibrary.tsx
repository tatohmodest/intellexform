'use client';

import { useState } from 'react';
import { Clock, PlayCircle, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { VIDEO_CATEGORIES, VIDEO_TUTORIALS, type VideoTutorial } from '@/lib/learn/videos';

export default function VideoLibrary() {
  const [category, setCategory] = useState<string>('All');
  const [playing, setPlaying] = useState<VideoTutorial | null>(null);

  const videos =
    category === 'All'
      ? VIDEO_TUTORIALS
      : VIDEO_TUTORIALS.filter((v) => v.category === category);

  return (
    <>
      {/* Category filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        {VIDEO_CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className="rounded-full px-4 py-2 text-[12.5px] font-semibold transition-colors"
            style={
              c === category
                ? { background: 'var(--ink)', color: '#fff' }
                : { background: 'var(--paper-dim)', color: 'var(--ink-soft)' }
            }
          >
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {videos.map((v) => (
          <button
            key={v.id}
            onClick={() => setPlaying(v)}
            className="group overflow-hidden rounded-2xl border text-left transition-shadow hover:shadow-card"
            style={{ borderColor: 'var(--line)' }}
          >
            <div className="relative aspect-video overflow-hidden" style={{ background: '#0C1116' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`}
                alt={v.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                loading="lazy"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 transition-opacity group-hover:opacity-100">
                <PlayCircle size={46} className="text-white" />
              </span>
              <span className="mono absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-0.5 text-[11px] text-white">
                {v.duration}
              </span>
            </div>
            <div className="p-4">
              <div className="line-clamp-2 text-[14px] font-semibold leading-snug">{v.title}</div>
              <div className="mt-1.5 flex items-center gap-2 text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                <span>{v.channel}</span>
                <span>·</span>
                <span
                  className="rounded-full px-2 py-0.5 text-[10.5px] font-semibold"
                  style={{ background: 'var(--paper-dim)' }}
                >
                  {v.level}
                </span>
              </div>
              <p className="mt-2 line-clamp-2 text-[12.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                {v.description}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Player modal */}
      <AnimatePresence>
        {playing && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPlaying(null)}
          >
            <motion.div
              className="w-full max-w-[900px]"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-3 flex items-center justify-between text-white">
                <div>
                  <div className="text-[15px] font-semibold">{playing.title}</div>
                  <div className="flex items-center gap-2 text-[12.5px] text-white/60">
                    {playing.channel} <Clock size={11} /> {playing.duration}
                  </div>
                </div>
                <button
                  onClick={() => setPlaying(null)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10"
                  aria-label="Close player"
                >
                  <X size={17} />
                </button>
              </div>
              <div className="aspect-video overflow-hidden rounded-2xl bg-black">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${playing.youtubeId}?autoplay=1&rel=0`}
                  title={playing.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
