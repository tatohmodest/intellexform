'use client';

import { useCallback, useEffect, useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';

type SafeQuestion = { id: string; prompt: string; choices: string[] };

type SafeQuiz = {
  id: string;
  title: string;
  questions: SafeQuestion[];
  passed: boolean;
  triggerAtSec: number | null;
};

export default function LessonQuizPanel({
  courseKey,
  lessonKey,
  lessonTitle,
  accent = '#00b369',
  allowDefault = true,
  onPassed,
}: {
  courseKey: string;
  lessonKey: string;
  lessonTitle: string;
  accent?: string;
  allowDefault?: boolean;
  onPassed?: () => void;
}) {
  const [quiz, setQuiz] = useState<SafeQuiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ passed: boolean; score: number; total: number } | null>(
    null,
  );

  const load = useCallback(async () => {
    setLoading(true);
    setResult(null);
    setAnswers({});
    try {
      const qs = new URLSearchParams({
        courseKey,
        lessonKey,
        title: lessonTitle,
      });
      if (allowDefault) qs.set('default', '1');
      const res = await fetch(`/api/learn/lesson-quizzes?${qs}`);
      const data = await res.json();
      setQuiz(data.quiz || null);
      if (data.quiz?.passed) onPassed?.();
    } finally {
      setLoading(false);
    }
  }, [courseKey, lessonKey, lessonTitle, allowDefault, onPassed]);

  useEffect(() => {
    void load();
  }, [load]);

  async function submit() {
    if (!quiz) return;
    setBusy(true);
    try {
      const res = await fetch('/api/learn/lesson-quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit',
          courseKey,
          lessonKey,
          quizId: quiz.id,
          title: lessonTitle,
          answers,
        }),
      });
      const data = await res.json();
      setResult({ passed: Boolean(data.passed), score: data.score || 0, total: data.total || 0 });
      if (data.passed) {
        setQuiz((q) => (q ? { ...q, passed: true } : q));
        onPassed?.();
      }
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
        Loading quiz…
      </p>
    );
  }

  if (!quiz) {
    return (
      <p className="text-[14px]" style={{ color: 'var(--ink-soft)' }}>
        No in-lesson quiz for this lesson yet.
      </p>
    );
  }

  if (quiz.passed) {
    return (
      <div className="flex items-center gap-2 text-[14px] font-semibold" style={{ color: accent }}>
        <CheckCircle2 size={16} /> Quiz passed — you can mark the lesson complete.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-display text-[18px]">{quiz.title}</h3>
        <p className="text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
          Pass the check to unlock Mark complete
          {quiz.triggerAtSec != null ? ` · appears around ${quiz.triggerAtSec}s` : ''}.
        </p>
      </div>
      {quiz.questions.map((q) => (
        <fieldset key={q.id} className="space-y-2">
          <legend className="text-[14px] font-semibold">{q.prompt}</legend>
          <ul className="space-y-1.5">
            {q.choices.map((c, i) => (
              <li key={i}>
                <label className="flex items-start gap-2 text-[13.5px]">
                  <input
                    type="radio"
                    name={q.id}
                    className="mt-1"
                    checked={answers[q.id] === i}
                    onChange={() => setAnswers((a) => ({ ...a, [q.id]: i }))}
                  />
                  <span>{c}</span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
      ))}
      {result && !result.passed ? (
        <p className="text-[13px]" style={{ color: '#b91c1c' }}>
          Score {result.score}/{result.total}. Review the lesson and try again.
        </p>
      ) : null}
      <button
        type="button"
        disabled={busy || Object.keys(answers).length < quiz.questions.length}
        onClick={submit}
        className="inline-flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-white disabled:opacity-50"
        style={{ background: accent }}
      >
        {busy ? <Loader2 size={14} className="animate-spin" /> : null}
        Submit check
      </button>
    </div>
  );
}
