/**
 * Client-side intro-video shrink: re-encode via canvas + MediaRecorder at
 * capped resolution/bitrate so Cloudinary storage stays lean without a soft picture.
 */

const MAX_W = 1280;
const MAX_H = 720;
const TARGET_FPS = 24;
const VIDEO_BPS = 900_000;
const AUDIO_BPS = 96_000;

function pickMime(): string {
  const candidates = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm',
    'video/mp4',
  ];
  for (const type of candidates) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }
  return 'video/webm';
}

function waitEvent(el: EventTarget, event: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const onOk = () => {
      cleanup();
      resolve();
    };
    const onErr = () => {
      cleanup();
      reject(new Error('media_event_failed'));
    };
    const cleanup = () => {
      el.removeEventListener(event, onOk);
      el.removeEventListener('error', onErr);
    };
    el.addEventListener(event, onOk, { once: true });
    el.addEventListener('error', onErr, { once: true });
  });
}

/** Re-encode a recorded blob to ~720p @ ~0.9 Mbps. Falls back to input on failure. */
export async function compressIntroVideo(input: Blob): Promise<{
  blob: Blob;
  bytesBefore: number;
  bytesAfter: number;
}> {
  const bytesBefore = input.size;
  if (typeof document === 'undefined' || typeof MediaRecorder === 'undefined') {
    return { blob: input, bytesBefore, bytesAfter: bytesBefore };
  }

  try {
    const url = URL.createObjectURL(input);
    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.src = url;

    await waitEvent(video, 'loadedmetadata');
    if (!Number.isFinite(video.duration) || video.duration <= 0) {
      URL.revokeObjectURL(url);
      return { blob: input, bytesBefore, bytesAfter: bytesBefore };
    }

    const vw = video.videoWidth || MAX_W;
    const vh = video.videoHeight || MAX_H;
    const scale = Math.min(1, MAX_W / vw, MAX_H / vh);
    const width = Math.max(2, Math.round((vw * scale) / 2) * 2);
    const height = Math.max(2, Math.round((vh * scale) / 2) * 2);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) {
      URL.revokeObjectURL(url);
      return { blob: input, bytesBefore, bytesAfter: bytesBefore };
    }

    const canvasStream = canvas.captureStream(TARGET_FPS);
    let combined: MediaStream = canvasStream;

    // Prefer original audio track when available (keeps speech clear).
    try {
      const media = (video as HTMLVideoElement & { captureStream?: () => MediaStream }).captureStream?.();
      const audio = media?.getAudioTracks()?.[0];
      if (audio) {
        combined = new MediaStream([...canvasStream.getVideoTracks(), audio]);
      }
    } catch {
      /* no audio track - still fine for compression */
    }

    const mimeType = pickMime();
    const recorder = new MediaRecorder(combined, {
      mimeType,
      videoBitsPerSecond: VIDEO_BPS,
      audioBitsPerSecond: AUDIO_BPS,
    });

    const chunks: BlobPart[] = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    const done = new Promise<Blob>((resolve, reject) => {
      recorder.onstop = () => resolve(new Blob(chunks, { type: mimeType }));
      recorder.onerror = () => reject(new Error('recorder_failed'));
    });

    recorder.start(250);
    video.currentTime = 0;
    await video.play();

    let raf = 0;
    const draw = () => {
      if (video.paused || video.ended) return;
      ctx.drawImage(video, 0, 0, width, height);
      raf = requestAnimationFrame(draw);
    };
    draw();

    await waitEvent(video, 'ended');
    cancelAnimationFrame(raf);
    ctx.drawImage(video, 0, 0, width, height);

    if (recorder.state !== 'inactive') recorder.stop();
    combined.getTracks().forEach((t) => t.stop());
    URL.revokeObjectURL(url);

    const blob = await done;
    // Keep the smaller of original vs re-encode (never inflate storage).
    if (blob.size > 0 && blob.size < bytesBefore) {
      return { blob, bytesBefore, bytesAfter: blob.size };
    }
    return { blob: input, bytesBefore, bytesAfter: bytesBefore };
  } catch {
    return { blob: input, bytesBefore, bytesAfter: bytesBefore };
  }
}

export const INTRO_VIDEO_MAX_SECONDS = 60;
export const INTRO_VIDEO_CONSTRAINTS: MediaStreamConstraints = {
  audio: true,
  video: {
    facingMode: 'user',
    width: { ideal: 1280, max: 1280 },
    height: { ideal: 720, max: 720 },
    frameRate: { ideal: 24, max: 30 },
  },
};

export function createIntroRecorder(stream: MediaStream): MediaRecorder {
  const mimeType = pickMime();
  return new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: VIDEO_BPS,
    audioBitsPerSecond: AUDIO_BPS,
  });
}
