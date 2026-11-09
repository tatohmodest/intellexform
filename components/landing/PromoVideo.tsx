'use client';

import { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';

/**
 * "Stop learning the hard way", the 96-second promo. Nothing downloads until the visitor presses play (data is expensive
 * on mobile), and phones get the vertical cut while wider screens get 16:9.
 */
function Player({ src, poster, className, label }: { src: string; poster: string; className: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  // Until the page is interactive, show the browser's own controls so the video can play
  // even if the script never loads; the custom play button only appears once it has.
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  return (
    <div className={`relative overflow-hidden rounded-[20px] border border-[#e7e9ec] bg-white ${className}`}>
      <video
        ref={ref}
        poster={poster}
        preload="none"
        playsInline
        controls={!ready || started}
        className="block h-full w-full object-cover"
        onPlay={() => setStarted(true)}
      >
        <source src={src} type="video/mp4" />
      </video>
      {ready && !started && (
        <button
          type="button"
          aria-label={label}
          onClick={() => {
            const video = ref.current;
            if (!video) return;
            setStarted(true);
            video.play().catch(() => {
              // Some browsers refuse play() before data loads; load and retry once.
              video.load();
              void video.play().catch(() => undefined);
            });
          }}
          className="group absolute inset-0 flex items-center justify-center bg-white/10"
        >
          <span className="flex items-center gap-3 rounded-full border border-[#3fd283] bg-[#5ce39a] py-3 pl-3 pr-6 text-[15px] font-medium text-[var(--ink)] shadow-[inset_0_-3px_0_rgba(0,120,70,0.18),0_18px_40px_-16px_rgba(0,179,105,0.7)] transition-transform group-hover:scale-105">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white">
              <Play size={18} className="ml-0.5" fill="currentColor" />
            </span>
            Watch · 1:36
          </span>
        </button>
      )}
    </div>
  );
}

export default function PromoVideo() {
  return (
    <>
      <Player
        src="/video/intellex-story-9x16.mp4"
        poster="/video/story-poster-9x16.jpg"
        label="Play the InTelleX video"
        className="mx-auto aspect-[9/16] w-full max-w-[380px] md:hidden"
      />
      <Player
        src="/video/intellex-story-16x9.mp4"
        poster="/video/story-poster-16x9.jpg"
        label="Play the InTelleX video"
        className="hidden aspect-video w-full md:block"
      />
    </>
  );
}
