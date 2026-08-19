'use client';

import { useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw, Square, Volume2 } from 'lucide-react';

function speakableText(opts: { title: string; explanation: string; example?: string; practiceTask?: string }) {
  const dropCode = (text: string) =>
    text
      .replace(/```[\s\S]*?```/g, ' A code example is on the screen. ')
      .replace(/`[^`]+`/g, ' ')
      .replace(/https?:\/\/\S+/gi, ' ')
      .replace(/[#*_>-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  return [opts.title, dropCode(opts.explanation), opts.example ? dropCode(opts.example) : '', opts.practiceTask || '']
    .filter(Boolean)
    .join('. ');
}

export default function BookTutorReadAloud(opts: {
  lessonId: string;
  title: string;
  explanation: string;
  example?: string;
  practiceTask?: string;
}) {
  const [state, setState] = useState<'idle' | 'playing' | 'paused'>('idle');
  const [supported, setSupported] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  function stop() {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setState('idle');
  }

  useEffect(() => {
    setSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);
  }, []);

  useEffect(() => {
    stop();
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opts.lessonId]);

  if (!supported) return null;

  function start() {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const text = speakableText(opts);
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.onend = () => setState('idle');
    utterance.onerror = () => setState('idle');
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setState('playing');
  }

  function play() {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    if (state === 'paused') {
      window.speechSynthesis.resume();
      setState('playing');
      return;
    }
    start();
  }

  function pause() {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.pause();
    setState('paused');
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      {state === 'playing' ? (
        <button type="button" onClick={pause} className="btn !px-3 !py-1.5 text-[12.5px]" style={{ background: 'var(--paper)', border: '1px solid var(--line)' }}>
          <Pause size={14} /> Pause
        </button>
      ) : (
        <button type="button" onClick={play} className="btn !px-3 !py-1.5 text-[12.5px]" style={{ background: 'var(--paper)', border: '1px solid var(--line)' }}>
          {state === 'paused' ? <Play size={14} /> : <Volume2 size={14} />}
          {state === 'paused' ? 'Resume' : 'Read aloud'}
        </button>
      )}
      {state !== 'idle' ? (
        <>
          <button type="button" onClick={stop} className="btn !px-3 !py-1.5 text-[12.5px]" style={{ background: 'transparent', border: '1px solid var(--line)' }}>
            <Square size={13} /> Stop
          </button>
          <button
            type="button"
            onClick={() => {
              stop();
              window.setTimeout(start, 40);
            }}
            className="btn !px-3 !py-1.5 text-[12.5px]"
            style={{ background: 'transparent', border: '1px solid var(--line)' }}
          >
            <RotateCcw size={13} /> Restart
          </button>
        </>
      ) : null}
    </div>
  );
}
