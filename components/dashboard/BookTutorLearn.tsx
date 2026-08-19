'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { AlertTriangle, ArrowRight, CheckCircle2, FlaskConical, Lightbulb, ListChecks, Loader2, StickyNote } from 'lucide-react';
import MarkdownLite from '@/components/dashboard/MarkdownLite';

type Check = { id: string; prompt: string; placement: 'mid' | 'end' };

type Lesson = {
  id: string;
  chapterTitle: string;
  title: string;
  explanation: string;
  example: string;
  question: string;
  kind?: 'teach' | 'practice';
  keypoints?: string[];
  practiceTask?: string;
  note?: string;
  watchOut?: string;
  analogy?: string;
  checks?: Check[];
  index: number;
  total: number;
};

type Session = {
  path: {
    id: string;
    title: string;
    authorName: string;
    status: string;
    error: string | null;
    engine: string;
    lessonCount: number;
    chapterCount: number;
  };
  progress: {
    currentLessonIndex: number;
    phase: string;
    completedCount: number;
    lastFeedback: string;
    lastCorrect: boolean | null;
    attemptsOnCurrent: number;
    checkpointPassed: number;
  } | null;
  lesson: Lesson | null;
};

function Callout({
  icon,
  label,
  text,
  tone,
}: {
  icon: ReactNode;
  label: string;
  text: string;
  tone: 'note' | 'tip' | 'warning' | 'try';
}) {
  const styles = {
    note: { bg: 'var(--paper-dim)', border: 'var(--line)', accent: 'var(--blue-ink)' },
    tip: { bg: 'rgba(0,179,105,0.08)', border: 'rgba(0,179,105,0.22)', accent: 'var(--green-deep)' },
    warning: { bg: 'rgba(196, 98, 42, 0.08)', border: 'rgba(196, 98, 42, 0.25)', accent: '#a14d18' },
    try: { bg: 'var(--amber-soft)', border: 'rgba(74,144,226,0.28)', accent: 'var(--blue-ink)' },
  }[tone];

  return (
    <aside
      className="mt-6 rounded-xl border px-4 py-4 sm:px-5"
      style={{ background: styles.bg, borderColor: styles.border }}
    >
      <div
        className="mb-1.5 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.08em]"
        style={{ color: styles.accent }}
      >
        {icon}
        {label}
      </div>
      <div className="text-[14.5px] leading-relaxed" style={{ color: 'var(--ink)' }}>
        <MarkdownLite text={text} />
      </div>
    </aside>
  );
}

function YesNo({
  prompt,
  busy,
  feedback,
  onPick,
}: {
  prompt: string;
  busy: boolean;
  feedback: string;
  onPick: (yes: boolean) => void;
}) {
  return (
    <div className="mt-8 rounded-2xl border p-5" style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}>
      <p className="font-display text-[18px] leading-snug">{prompt}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={busy}
          onClick={() => onPick(true)}
          className="btn btn-primary !px-6 !py-2.5 text-[13.5px]"
        >
          {busy ? <Loader2 size={15} className="animate-spin" /> : null}
          Yes
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => onPick(false)}
          className="btn !px-6 !py-2.5 text-[13.5px]"
          style={{ background: 'var(--paper)', border: '1px solid var(--line)', color: 'var(--ink)' }}
        >
          No
        </button>
      </div>
      {feedback ? (
        <p className="mt-3 text-[14px]" style={{ color: '#b91c1c' }}>
          {feedback}
        </p>
      ) : (
        <p className="mt-3 text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
          Click Yes or No. The written check stays locked until this is right.
        </p>
      )}
    </div>
  );
}

export default function BookTutorLearn({ initial }: { initial: Session }) {
  const [session, setSession] = useState(initial);
  const [answer, setAnswer] = useState('');
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [checkFeedback, setCheckFeedback] = useState('');

  const lesson = session.lesson;
  const progress = session.progress;
  const passed = progress?.phase === 'passed' || progress?.lastCorrect === true;
  const complete = progress?.phase === 'complete';
  const practice = lesson?.kind === 'practice';
  const checks = lesson?.checks || [];
  const checkpointPassed = progress?.checkpointPassed || 0;
  const currentCheck = passed ? undefined : checks[checkpointPassed];
  const revealRest = !currentCheck || currentCheck.placement === 'end';
  const revealWrite = passed || !currentCheck;
  const pct = useMemo(() => {
    const total = session.path.lessonCount || 1;
    const done = progress?.phase === 'complete' ? total : progress?.completedCount || 0;
    return Math.round((done / total) * 100);
  }, [session.path.lessonCount, progress]);

  useEffect(() => {
    if (session.path.status === 'ready' || session.path.status === 'failed') return undefined;
    const timer = window.setInterval(async () => {
      const res = await fetch(`/api/learn/book-tutor/${session.path.id}`);
      const data = await res.json().catch(() => null);
      if (data?.path) setSession(data);
    }, 3000);
    return () => window.clearInterval(timer);
  }, [session.path.id, session.path.status]);

  async function pickCheck(yes: boolean) {
    if (!currentCheck) return;
    setBusy('check');
    setError('');
    setCheckFeedback('');
    try {
      const res = await fetch(`/api/learn/book-tutor/${session.path.id}/checkpoint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkId: currentCheck.id, yes }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not record that check.');
      if (!data.isCorrect) {
        setCheckFeedback(data.feedback || 'Not quite — try the other one.');
        return;
      }
      setCheckFeedback('');
      setSession((cur) => ({
        ...cur,
        progress: cur.progress
          ? { ...cur.progress, checkpointPassed: data.checkpointPassed, lastFeedback: '' }
          : cur.progress,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not record that check.');
    } finally {
      setBusy('');
    }
  }

  async function grade(e: React.FormEvent) {
    e.preventDefault();
    if (!answer.trim()) return;
    setBusy('grade');
    setError('');
    try {
      const res = await fetch(`/api/learn/book-tutor/${session.path.id}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not grade that answer.');
      setSession((cur) => ({
        ...cur,
        progress: cur.progress
          ? {
              ...cur.progress,
              phase: data.phase,
              lastFeedback: data.feedback,
              lastCorrect: data.isCorrect,
              completedCount: data.isCorrect
                ? Math.max(
                    cur.progress.completedCount,
                    (cur.progress.completedCount || 0) + (cur.progress.lastCorrect ? 0 : 1),
                  )
                : cur.progress.completedCount,
            }
          : cur.progress,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not grade that answer.');
    } finally {
      setBusy('');
    }
  }

  async function next() {
    setBusy('next');
    setError('');
    setCheckFeedback('');
    try {
      const res = await fetch(`/api/learn/book-tutor/${session.path.id}/advance`, { method: 'POST' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not open the next step.');
      setSession(data);
      setAnswer('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not open the next step.');
    } finally {
      setBusy('');
    }
  }

  if (session.path.status !== 'ready') {
    return (
      <div className="rounded-2xl border border-dashed px-4 py-10 text-center" style={{ borderColor: 'var(--line)' }}>
        <p className="font-display text-[22px]">{session.path.status === 'failed' ? 'Could not build this tutor' : 'Studying the book'}</p>
        <p className="mt-2 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
          {session.path.error || 'The tutor is reading the text and writing a compact teaching path — not storing the file. This can take a minute on a long book.'}
        </p>
        {session.path.status !== 'failed' ? <Loader2 size={18} className="mx-auto mt-4 animate-spin" /> : null}
      </div>
    );
  }

  if (complete || (!lesson && progress?.phase === 'complete')) {
    return (
      <div className="rounded-2xl border px-5 py-10 text-center" style={{ borderColor: 'var(--line)' }}>
        <CheckCircle2 size={28} className="mx-auto" style={{ color: 'var(--green-deep)' }} />
        <h2 className="mt-3 font-display text-[26px]">You finished this book</h2>
        <p className="mt-2 text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
          {session.path.lessonCount} steps with {session.path.title}.
        </p>
        <Link href="/dashboard/library/learn" className="btn btn-primary mt-6 !px-5 !py-2.5 text-[13.5px]">
          More book tutors
        </Link>
      </div>
    );
  }

  if (!lesson) {
    return <p style={{ color: 'var(--ink-soft)' }}>No lesson to show yet.</p>;
  }

  return (
    <div>
      <div className="mb-6">
        <div className="h-1.5" style={{ background: 'var(--paper-dim)' }}>
          <div style={{ width: `${pct}%`, background: 'var(--green-deep)', height: '100%' }} />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em]" style={{ color: 'var(--ink-soft)' }}>
            Step {lesson.index + 1} of {lesson.total} · {lesson.chapterTitle}
          </p>
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]"
            style={{
              background: practice ? 'var(--amber-soft)' : 'rgba(0,179,105,0.12)',
              color: practice ? 'var(--blue-ink)' : 'var(--green-deep)',
            }}
          >
            {practice ? 'Try it' : 'Author'}
          </span>
        </div>
      </div>

      <article>
        <h2
          className="border-b pb-3 font-display text-[26px] leading-tight sm:text-[30px]"
          style={{ borderColor: 'var(--line)' }}
        >
          {lesson.title}
        </h2>
        <div className="mt-5 tutorial-prose">
          <MarkdownLite text={lesson.explanation} />
        </div>

        {currentCheck?.placement === 'mid' ? (
          <YesNo prompt={currentCheck.prompt} busy={busy === 'check'} feedback={checkFeedback} onPick={pickCheck} />
        ) : null}

        {revealRest ? (
          <>
            {lesson.analogy ? (
              <Callout tone="tip" label="Analogy" text={lesson.analogy} icon={<Lightbulb size={14} />} />
            ) : null}

            {lesson.note ? (
              <Callout tone="note" label="From the writer" text={lesson.note} icon={<StickyNote size={14} />} />
            ) : null}

            {lesson.watchOut ? (
              <Callout tone="warning" label="Watch out" text={lesson.watchOut} icon={<AlertTriangle size={14} />} />
            ) : null}

            {lesson.keypoints && lesson.keypoints.length > 0 ? (
              <div
                className="mt-8 rounded-xl border p-5"
                style={{ borderColor: 'rgba(0,179,105,0.25)', background: 'rgba(0,179,105,0.06)' }}
              >
                <div className="mb-3 flex items-center gap-2 font-display text-[18px]">
                  <ListChecks size={18} style={{ color: 'var(--green-deep)' }} />
                  Key points
                </div>
                <ul className="space-y-2 text-[14.5px] leading-relaxed" style={{ color: 'var(--ink)' }}>
                  {lesson.keypoints.map((item) => (
                    <li key={item} className="flex gap-2.5">
                      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: 'var(--green)' }} />
                      <span>
                        <MarkdownLite text={item} />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {lesson.example ? (
              <Callout tone="tip" label="Worked example" text={lesson.example} icon={<Lightbulb size={14} />} />
            ) : null}

            {practice && lesson.practiceTask ? (
              <Callout tone="try" label="Your turn — go do this" text={lesson.practiceTask} icon={<FlaskConical size={14} />} />
            ) : null}

            {currentCheck?.placement === 'end' ? (
              <YesNo prompt={currentCheck.prompt} busy={busy === 'check'} feedback={checkFeedback} onPick={pickCheck} />
            ) : null}
          </>
        ) : null}
      </article>

      {revealWrite ? (
        <form onSubmit={grade} className="mt-8 rounded-2xl border p-5" style={{ borderColor: 'var(--line)' }}>
          <h3 className="font-display text-[20px]">{practice ? 'What did you get?' : 'Now, in your words'}</h3>
          <p className="mt-2 text-[14.5px] leading-relaxed">{lesson.question}</p>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={practice ? 5 : 4}
            placeholder={practice ? 'Paste the output, result, or what you saw…' : 'Answer in your own words…'}
            className="mt-4 w-full border px-3 py-2.5 text-[14px]"
            style={{ borderColor: 'var(--line)', background: 'transparent' }}
            disabled={passed}
          />
          {progress?.lastFeedback ? (
            <p
              className="mt-3 text-[14px]"
              style={{ color: progress.lastCorrect ? 'var(--green-deep)' : '#b91c1c' }}
            >
              {progress.lastFeedback}
            </p>
          ) : null}
          {error ? (
            <p className="mt-2 text-[13px]" style={{ color: '#b91c1c' }}>
              {error}
            </p>
          ) : null}
          <div
            className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4"
            style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}
          >
            <button
              type="submit"
              disabled={busy === 'grade' || passed || !answer.trim()}
              className="btn !px-5 !py-2.5 text-[13.5px]"
              style={{ background: 'var(--paper)', border: '1px solid var(--line)', color: 'var(--ink)' }}
            >
              {busy === 'grade' ? <Loader2 size={15} className="animate-spin" /> : null}
              {passed ? 'Checked' : practice ? 'Submit result' : 'Check answer'}
            </button>
            <button
              type="button"
              onClick={next}
              disabled={!passed || busy === 'next'}
              className="btn btn-primary !px-5 !py-2.5 text-[13.5px]"
            >
              {busy === 'next' ? <Loader2 size={15} className="animate-spin" /> : null}
              {lesson.index + 1 >= lesson.total ? 'Finish' : 'Next'}
              <ArrowRight size={15} />
            </button>
          </div>
          {!passed ? (
            <p className="mt-3 text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
              {practice
                ? 'Next stays locked until you paste a real result from the try-it. You can retry.'
                : 'Next stays locked until this written check is correct. You can retry.'}
            </p>
          ) : null}
        </form>
      ) : error ? (
        <p className="mt-4 text-[13px]" style={{ color: '#b91c1c' }}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
