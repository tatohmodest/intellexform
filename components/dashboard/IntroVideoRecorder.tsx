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
  const previewRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const secondsRef = useRef(0);

  const [live, setLive] = useState(false);
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [sizeLabel, setSizeLabel] = useState('');

  useEffect(() => {
    if (value) {
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);
      setSizeLabel(`${(value.size / (1024 * 1024)).toFixed(2)} MB`);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(null);
    setSizeLabel('');
  }, [value]);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setLive(false);
  }, []);

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
    stopStream();
  }, [stopStream]);

  async function startCamera() {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia(INTRO_VIDEO_CONSTRAINTS);
      streamRef.current = stream;
      setLive(true);
      if (previewRef.current) {
        previewRef.current.srcObject = stream;
        await previewRef.current.play().catch(() => {});
      }
    } catch {
      setError('Camera/mic access is required to record your intro. Allow permissions and try again.');
    }
  }

  function clearRecording() {
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
    if (!streamRef.current) {
      await startCamera();
    }
    const stream = streamRef.current;
    if (!stream) return;

    // Clear any prior clip before a new take.
    onReady(null, 0);
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
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'video/webm' });
        if (!blob.size) {
          setError('Recording was empty. Please try again.');
          onReady(null, 0);
          return;
        }
        setSizeLabel(`${(blob.size / (1024 * 1024)).toFixed(2)} MB`);
        onReady(blob, Math.min(duration, INTRO_VIDEO_MAX_SECONDS));
      } catch {
        setError('Could not save the recording. Please try again.');
        onReady(null, 0);
      } finally {
        setBusy(false);
        stopStream();
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

  return (
    <div className="space-y-4">
      <div
        className="relative overflow-hidden rounded-2xl border bg-black/90"
        style={{ borderColor: 'var(--line)', aspectRatio: '16 / 9' }}
      >
        {previewUrl && !live ? (
          <video src={previewUrl} controls playsInline className="h-full w-full object-contain" />
        ) : (
          <video
            ref={previewRef}
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
          <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 text-[12.5px] font-semibold text-white">
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
        {!live && !recording && !value && (
          <button type="button" onClick={startCamera} className="btn btn-ghost !py-2.5 text-[13px]">
            <Video size={15} /> Enable camera
          </button>
        )}
        {!recording && !busy && (
          <button
            type="button"
            onClick={startRecording}
            className="btn btn-primary !py-2.5 text-[13px]"
            disabled={busy}
          >
            <Circle size={14} className="fill-current" />
            {value ? 'Re-record' : 'Start recording'}
          </button>
        )}
        {recording && (
          <button
            type="button"
            onClick={stopRecording}
            disabled={!canStop}
            className="btn !py-2.5 text-[13px] disabled:opacity-50"
            style={{ background: 'rgba(220,38,38,0.12)', color: '#b91c1c' }}
            title={canStop ? 'Stop recording' : `Record at least ${INTRO_VIDEO_MIN_SECONDS}s`}
          >
            <Square size={14} className="fill-current" />
            {canStop ? 'Stop' : `Stop in ${INTRO_VIDEO_MIN_SECONDS - seconds}s`}
          </button>
        )}
        {value && !recording && (
          <button type="button" onClick={clearRecording} className="btn btn-ghost !py-2.5 text-[13px]">
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
        <p className="rounded-xl px-4 py-3 text-[13px]" style={{ background: 'rgba(196,98,42,0.08)', color: '#a14d18' }}>
          {error}
        </p>
      )}
    </div>
  );
}
