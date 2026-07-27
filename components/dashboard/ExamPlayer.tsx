'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import type { AssessmentView } from '@/lib/learn/assessments';

/**
 * EC-Council style exam player:
 * - one question at a time
 * - no going back
 * - leaving the tab / window terminates the attempt
 */
export default function ExamPlayer({
  assessment,
  accent = '#00b369',
  onFinished,
}: {
  assessment: AssessmentView;
  accent?: string;
  onFinished?: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [started, setStarted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<{ status: string; score?: number | null; maxScore?: number | null; reason?: string } | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(
    assessment.durationMinutes ? assessment.durationMinutes * 60 : null,
  );
  const answersRef = useRef(answers);
  answersRef.current = answers;
  const closedRef = useRef(false);

  const questions = assessment.questions || [];
  const q = questions[index];

  const finish = useCallback(
    async (action: 'submit' | 'terminate', reason?: string) => {
      if (closedRef.current) return;
      closedRef.current = true;
      setBusy(true);
      try {
        const res = await fetch(`/api/learn/assessments/${assessment.id}/submissions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action,
            answers: answersRef.current,
            reason,
          }),
        });
        const data = await res.json();
        setDone({
          status: data.submission?.status || action,
          score: data.submission?.score,
          maxScore: data.submission?.maxScore,
          reason,
        });
        onFinished?.();
      } catch {
        setDone({ status: 'terminated', reason: reason || 'error' });
      } finally {
        setBusy(false);
      }
    },
    [assessment.id, onFinished],
  );

  useEffect(() => {
    if (!started || done) return;
    async function boot() {
      await fetch(`/api/learn/assessments/${assessment.id}/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start' }),
      });
    }
    boot();
  }, [started, done, assessment.id]);

  useEffect(() => {
    if (!started || done || secondsLeft === null) return;
    if (secondsLeft <= 0) {
      finish('submit', 'time_up');
      return;
    }
    const t = window.setTimeout(() => setSecondsLeft((s) => (s === null ? s : s - 1)), 1000);
    return () => window.clearTimeout(t);
  }, [started, done, secondsLeft, finish]);

  useEffect(() => {
    if (!started || done || !assessment.terminateOnLeave) return;
    function onVis() {
      if (document.visibilityState === 'hidden') {
        finish('terminate', 'left_tab');
      }
    }
    document.addEventListener('visibilitychange', onVis);
    return () => {
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [started, done, assessment.terminateOnLeave, finish]);

  function setAnswer(value: string | number) {
    if (!q) return;
    setAnswers((prev) => ({ ...prev, [q.id]: value }));
  }

  function next() {
    if (!q) return;
    if (answers[q.id] === undefined || answers[q.id] === '') return;
    if (index >= questions.length - 1) {
      finish('submit');
      return;
    }
    setIndex((i) => i + 1);
  }

  if (done) {
    return (
      <div className="mx-auto max-w-lg border py-12 text-center" style={{ borderColor: 'var(--line)' }}>
        <AlertTriangle className="mx-auto mb-3" size={28} style={{ color: done.status === 'terminated' ? '#b91c1c' : accent }} />
        <h2 className="font-display text-[26px]">
          {done.status === 'terminated' ? 'Exam terminated' : 'Exam submitted'}
        </h2>
        <p className="mt-2 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
          {done.status === 'terminated'
            ? `Attempt closed (${done.reason || 'policy'}). Leaving the tab or window ends a locked exam — same integrity model used by professional certifiers.`
            : 'Your answers are saved. MCQ portions may be auto-graded; structural answers await instructor review.'}
        </p>
        {typeof done.score === 'number' && (
          <p className="mt-4 font-display text-[22px]">
            Score {done.score}
            {typeof done.maxScore === 'number' ? ` / ${done.maxScore}` : ''}
          </p>
        )}
      </div>
    );
  }

  if (!started) {
    return (
      <div className="mx-auto max-w-xl border p-8" style={{ borderColor: 'var(--line)' }}>
        <p className="font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: 'var(--ink-soft)' }}>
          Locked exam
        </p>
        <h1 className="mt-2 font-display text-[30px] leading-tight">{assessment.title}</h1>
        <p className="mt-3 text-[14.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
          {assessment.instructions || 'Read each question carefully.'}
        </p>
        <ul className="mt-5 space-y-2 text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>
          <li>• One question at a time — you cannot go back.</li>
          <li>• Leaving this tab or window terminates the exam immediately.</li>
          {assessment.durationMinutes ? <li>• Timed: {assessment.durationMinutes} minutes.</li> : null}
          <li>• {questions.length} questions.</li>
        </ul>
        <p className="mt-4 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
          {assessment.studentTips}
        </p>
        <button
          type="button"
          onClick={() => setStarted(true)}
          className="mt-6 px-5 py-3 text-[14px] font-semibold text-white"
          style={{ background: accent }}
        >
          Begin exam
        </button>
      </div>
    );
  }

  if (!q) {
    return <p style={{ color: 'var(--ink-soft)' }}>No questions configured.</p>;
  }

  const progress = ((index + 1) / questions.length) * 100;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: 'var(--ink-soft)' }}>
          Question {index + 1} / {questions.length}
        </span>
        {secondsLeft !== null && (
          <span className="font-mono text-[13px] font-semibold" style={{ color: secondsLeft < 60 ? '#b91c1c' : 'var(--ink)' }}>
            {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, '0')}
          </span>
        )}
      </div>
      <div className="mb-6 h-1" style={{ background: 'var(--paper-dim)' }}>
        <div className="h-full transition-all" style={{ width: `${progress}%`, background: accent }} />
      </div>

      <h2 className="mb-6 font-display text-[24px] leading-snug">{q.prompt}</h2>

      {q.type === 'mcq' ? (
        <div className="space-y-2">
          {(q.options || []).map((opt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setAnswer(i)}
              className="block w-full border px-4 py-3 text-left text-[14.5px]"
              style={{
                borderColor: answers[q.id] === i ? accent : 'var(--line)',
                background: answers[q.id] === i ? `${accent}12` : 'transparent',
              }}
            >
              <span className="mr-2 font-mono text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                {String.fromCharCode(65 + i)}.
              </span>
              {opt}
            </button>
          ))}
        </div>
      ) : (
        <textarea
          className="form-input !rounded-none min-h-[160px]"
          placeholder="Type your answer…"
          value={String(answers[q.id] ?? '')}
          onChange={(e) => setAnswer(e.target.value)}
        />
      )}

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          disabled={busy || answers[q.id] === undefined || answers[q.id] === ''}
          onClick={next}
          className="px-5 py-3 text-[14px] font-semibold text-white disabled:opacity-40"
          style={{ background: accent }}
        >
          {busy ? <Loader2 className="animate-spin" size={16} /> : null}
          {index >= questions.length - 1 ? 'Submit exam' : 'Next question →'}
        </button>
      </div>
      <p className="mt-4 text-center text-[12px]" style={{ color: 'var(--ink-soft)' }}>
        Navigation is locked. Stay on this page until you finish.
      </p>
    </div>
  );
}
