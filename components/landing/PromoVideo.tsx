'use client';

import { useRef, useState } from 'react';
import { Play } from 'lucide-react';

/**
 * The 40-second promo. Nothing downloads until the visitor presses play (data is expensive
 * on mobile), and phones get the vertical cut while wider screens get 16:9.
 */
function Player({ src, poster, className, label }: { src: string; poster: string; className: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  return (
    <div className={`relative overflow-hidden rounded-[20px] border border-[#e7e9ec] bg-white ${className}`}>
      <video
        ref={ref}
        src={src}
        poster={poster}
        preload="none"
        playsInline
        controls={started}
        className="block h-full w-full object-cover"
        onPlay={() => setStarted(true)}
      />
      {!started && (
        <button
          type="button"
          aria-label={label}
          onClick={() => {
            setStarted(true);
            void ref.current?.play();
          }}
          className="group absolute inset-0 flex items-center justify-center bg-white/10"
        >
          <span className="flex items-center gap-3 rounded-full border border-[#3fd283] bg-[#5ce39a] py-3 pl-3 pr-6 text-[15px] font-medium text-[var(--ink)] shadow-[inset_0_-3px_0_rgba(0,120,70,0.18),0_18px_40px_-16px_rgba(0,179,105,0.7)] transition-transform group-hover:scale-105">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white">
              <Play size={18} className="ml-0.5" fill="currentColor" />
            </span>
            Watch · 40 sec
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
        src="/video/intellex-promo-9x16.mp4"
        poster="/video/poster-9x16.jpg"
        label="Play the InTelleX video"
        className="mx-auto aspect-[9/16] w-full max-w-[380px] md:hidden"
      />
      <Player
        src="/video/intellex-promo-16x9.mp4"
        poster="/video/poster-16x9.jpg"
        label="Play the InTelleX video"
        className="hidden aspect-video w-full md:block"
      />
    </>
  );
}
