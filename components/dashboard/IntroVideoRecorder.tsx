'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Circle,
  Loader2,
  Square,
  Trash2,
  Video,
} from 'lucide-react';
import {
  INTRO_VIDEO_CONSTRAINTS,
  INTRO_VIDEO_MAX_SECONDS,
  INTRO_VIDEO_MIN_SECONDS,
  createIntroRecorder,
} from '@/lib/learn/compressVideo';

type Props = {
  onReady: (blob: Blob | null, durationSec: number) => void;
  value: Blob | null;
};

function fmtClock(total: number) {
  const mm = String(Math.floor(total / 60)).padStart(1, '0');
  const ss = String(total % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

export default function IntroVideoRecorder({ onReady, value }: Props) {
  const liveRef = useRef<HTMLVideoElement>(null);
  const playbackRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const secondsRef = useRef(0);
  const previewUrlRef = useRef<string | null>(null);

  const [live, setLive] = useState(false);
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [sizeLabel, setSizeLabel] = useState('');

  const revokePreview = useCallback(() => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setPreviewUrl(null);
  }, []);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (liveRef.current) liveRef.current.srcObject = null;
    setLive(false);
  }, []);

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
    stopStream();
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
  }, [stopStream]);

  // Keep size label in sync if parent clears the clip.
  useEffect(() => {
    if (!value) {
      setSizeLabel('');
      if (!recording && !busy) revokePreview();
    }
  }, [value, recording, busy, revokePreview]);

  async function startCamera() {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia(INTRO_VIDEO_CONSTRAINTS);
      streamRef.current = stream;
      setLive(true);
      if (liveRef.current) {
        liveRef.current.srcObject = stream;
        await liveRef.current.play().catch(() => {});
      }
    } catch {
      setError('Camera/mic access is required to record your intro. Allow permissions and try again.');
    }
  }

  function clearRecording() {
    revokePreview();
    onReady(null, 0);
    setSeconds(0);
    setSizeLabel('');
    setError('');
  }

  function finishRecorder() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setRecording(false);
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop();
    }
  }

  async function startRecording() {
    setError('');
    revokePreview();
    onReady(null, 0);

    if (!streamRef.current) {
      await startCamera();
    }
    const stream = streamRef.current;
    if (!stream) return;

    chunksRef.current = [];
    const recorder = createIntroRecorder(stream);
    recorderRef.current = recorder;
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.onstop = () => {
      setBusy(true);
      try {
        const duration = secondsRef.current;
        if (duration < INTRO_VIDEO_MIN_SECONDS) {
          setError(`Intro video must be at least ${INTRO_VIDEO_MIN_SECONDS} seconds.`);
          onReady(null, 0);
          return;
        }
        const mime = recorder.mimeType || 'video/webm';
        const blob = new Blob(chunksRef.current, { type: mime });
        if (!blob.size) {
          setError('Recording was empty. Please try again.');
          onReady(null, 0);
          return;
        }

        // Create preview URL immediately so the clip shows before parent re-renders.
        const url = URL.createObjectURL(blob);
        if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = url;
        setPreviewUrl(url);
        setSizeLabel(`${(blob.size / (1024 * 1024)).toFixed(2)} MB`);
        onReady(blob, Math.min(duration, INTRO_VIDEO_MAX_SECONDS));

        // Kick a poster frame so the first paint isn't black.
        requestAnimationFrame(() => {
          const el = playbackRef.current;
          if (!el) return;
          el.muted = true;
          el.play()
            .then(() => {
              el.pause();
              el.currentTime = 0;
              el.muted = false;
            })
            .catch(() => {
              el.muted = false;
            });
        });
      } catch {
        setError('Could not save the recording. Please try again.');
        onReady(null, 0);
      } finally {
        stopStream();
        setBusy(false);
      }
    };

    recorder.start(250);
    setRecording(true);
    secondsRef.current = 0;
    setSeconds(0);
    timerRef.current = setInterval(() => {
      secondsRef.current += 1;
      const next = secondsRef.current;
      setSeconds(next);
      if (next >= INTRO_VIDEO_MAX_SECONDS) {
        finishRecorder();
      }
    }, 1000);
  }

  function stopRecording() {
    if (secondsRef.current < INTRO_VIDEO_MIN_SECONDS) {
      setError(`Keep recording — at least ${INTRO_VIDEO_MIN_SECONDS} seconds required (max ${INTRO_VIDEO_MAX_SECONDS}s).`);
      return;
    }
    setError('');
    finishRecorder();
  }

  const canStop = seconds >= INTRO_VIDEO_MIN_SECONDS;
  const showPlayback = Boolean(previewUrl && !live && !recording);

  return (
    <div className="space-y-4">
      <div
        className="relative overflow-hidden border bg-black"
        style={{ borderColor: 'var(--line)', aspectRatio: '16 / 9' }}
      >
        {showPlayback ? (
          <video
            key={previewUrl}
            ref={playbackRef}
            src={previewUrl!}
            controls
            playsInline
            preload="auto"
            className="h-full w-full object-contain"
          />
        ) : (
          <video
            ref={liveRef}
            muted
            playsInline
            autoPlay
            className="h-full w-full object-cover"
          />
        )}
        {!live && !previewUrl && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/80">
            <Video size={28} />
            <p className="text-[13px]">Camera preview</p>
          </div>
        )}
        {recording && (
          <div className="absolute left-3 top-3 flex items-center gap-2 bg-black/60 px-3 py-1.5 text-[12.5px] font-semibold text-white">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
            {fmtClock(seconds)} / {fmtClock(INTRO_VIDEO_MAX_SECONDS)}
          </div>
        )}
      </div>

      <p className="text-[13px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
        Record <strong>{INTRO_VIDEO_MIN_SECONDS}–{INTRO_VIDEO_MAX_SECONDS} seconds</strong> introducing
        who you are and what you teach.
        {sizeLabel ? ` Current clip: ${sizeLabel}.` : ''}
      </p>

      <div className="flex flex-wrap gap-2">
        {!live && !recording && !value && !previewUrl && (
          <button type="button" onClick={startCamera} className="btn btn-ghost !rounded-none !py-2.5 text-[13px]">
            <Video size={15} /> Enable camera
          </button>
        )}
        {!recording && !busy && (
          <button
            type="button"
            onClick={startRecording}
            className="btn btn-primary !rounded-none !py-2.5 text-[13px]"
            disabled={busy}
          >
            <Circle size={14} className="fill-current" />
            {value || previewUrl ? 'Re-record' : 'Start recording'}
          </button>
        )}
        {recording && (
          <button
            type="button"
            onClick={stopRecording}
            disabled={!canStop}
            className="btn !rounded-none !py-2.5 text-[13px] disabled:opacity-50"
            style={{ background: 'rgba(220,38,38,0.12)', color: '#b91c1c' }}
            title={canStop ? 'Stop recording' : `Record at least ${INTRO_VIDEO_MIN_SECONDS}s`}
          >
            <Square size={14} className="fill-current" />
            {canStop ? 'Stop' : `Stop in ${INTRO_VIDEO_MIN_SECONDS - seconds}s`}
          </button>
        )}
        {(value || previewUrl) && !recording && (
          <button type="button" onClick={clearRecording} className="btn btn-ghost !rounded-none !py-2.5 text-[13px]">
            <Trash2 size={14} /> Clear
          </button>
        )}
        {busy && (
          <span className="inline-flex items-center gap-2 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
            <Loader2 size={14} className="animate-spin" /> Saving recording…
          </span>
        )}
      </div>

      {error && (
        <p className="border px-4 py-3 text-[13px]" style={{ borderColor: 'rgba(196,98,42,0.35)', background: 'rgba(196,98,42,0.08)', color: '#a14d18' }}>
          {error}
        </p>
      )}
    </div>
  );
}
