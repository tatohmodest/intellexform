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
  compressIntroVideo,
  createIntroRecorder,
} from '@/lib/learn/compressVideo';

type Props = {
  onReady: (blob: Blob | null, durationSec: number) => void;
  value: Blob | null;
};

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
  }

  async function startRecording() {
    setError('');
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
    recorder.onstop = async () => {
      setBusy(true);
      try {
        const duration = secondsRef.current;
        const raw = new Blob(chunksRef.current, { type: recorder.mimeType || 'video/webm' });
        const { blob, bytesAfter } = await compressIntroVideo(raw);
        setSizeLabel(`${(bytesAfter / (1024 * 1024)).toFixed(2)} MB`);
        onReady(blob, duration);
      } catch {
        setError('Could not process the recording. Please try again.');
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
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setRecording(false);
        if (recorderRef.current && recorderRef.current.state !== 'inactive') {
          recorderRef.current.stop();
        }
      }
    }, 1000);
  }

  function stopRecording() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setRecording(false);
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop();
    }
  }

  const mm = String(Math.floor(seconds / 60)).padStart(1, '0');
  const ss = String(seconds % 60).padStart(2, '0');

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
            {mm}:{ss} / 1:00
          </div>
        )}
      </div>

      <p className="text-[13px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
        Record up to <strong>1 minute</strong> introducing who you are and what you teach.
        We compress the clip before upload so it stays sharp without filling storage.
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
          <button type="button" onClick={stopRecording} className="btn !py-2.5 text-[13px]" style={{ background: 'rgba(220,38,38,0.12)', color: '#b91c1c' }}>
            <Square size={14} className="fill-current" /> Stop
          </button>
        )}
        {value && !recording && (
          <button type="button" onClick={clearRecording} className="btn btn-ghost !py-2.5 text-[13px]">
            <Trash2 size={14} /> Clear
          </button>
        )}
        {busy && (
          <span className="inline-flex items-center gap-2 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
            <Loader2 size={14} className="animate-spin" /> Compressing video…
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
