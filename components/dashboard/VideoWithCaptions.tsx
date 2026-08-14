'use client';

import { useEffect, useRef } from 'react';

/** HTML5 video with optional VTT captions + resume + progress callback. */
export default function VideoWithCaptions({
  src,
  captionsUrl,
  startAt = 0,
  onProgress,
  className = 'h-full w-full',
}: {
  src: string;
  captionsUrl?: string | null;
  startAt?: number;
  onProgress?: (sec: number) => void;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMeta = () => {
      if (startAt > 0 && startAt < (el.duration || Infinity)) {
        el.currentTime = startAt;
      }
    };
    el.addEventListener('loadedmetadata', onMeta);
    return () => el.removeEventListener('loadedmetadata', onMeta);
  }, [startAt, src]);

  return (
    <video
      ref={ref}
      src={src}
      controls
      playsInline
      crossOrigin={captionsUrl ? 'anonymous' : undefined}
      className={className}
      onTimeUpdate={(e) => onProgress?.(Math.floor(e.currentTarget.currentTime))}
    >
      {captionsUrl ? (
        <track kind="captions" srcLang="en" label="Captions" src={captionsUrl} default />
      ) : null}
    </video>
  );
}
