'use client';

import { Loader2 } from 'lucide-react';
import MarkdownLite from '@/components/dashboard/MarkdownLite';
import BookTutorAnswerField, { type TutorUiType } from '@/components/dashboard/BookTutorAnswerField';

export type LiveTurn = { role: 'tutor' | 'student'; text: string; example?: string };

export default function BookTutorLive({
  turns,
  ask,
  prompt,
  passed,
  uiType,
  language,
  choices,
  answer,
  busy,
  error,
  onChange,
  onCheck,
}: {
  turns: LiveTurn[];
  ask: boolean;
  prompt: string;
  passed: boolean;
  uiType: TutorUiType;
  language?: string;
  choices?: string[];
  answer: string;
  busy: boolean;
  error: string;
  onChange: (v: string) => void;
  onCheck: () => void;
}) {
  return (
    <section
      className="mt-5 rounded-2xl border p-5 sm:p-6"
      style={{ borderColor: 'var(--line)', background: 'var(--paper)' }}
      aria-label="Tutor"
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.12em]" style={{ color: 'var(--ink-soft)' }}>
        Tutor
      </p>
      <div className="mt-4 grid gap-5">
        {turns.map((turn, i) =>
          turn.role === 'student' ? (
            <div
              key={`${i}-you`}
              className="rounded-xl border px-4 py-3"
              style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.08em]" style={{ color: 'var(--ink-soft)' }}>
                You
              </p>
              <p className="mt-1 whitespace-pre-wrap text-[14.5px] leading-relaxed">{turn.text}</p>
            </div>
          ) : (
            <div key={`${i}-tutor`}>
              <div className="tutorial-prose text-[15px] leading-relaxed" style={{ color: 'var(--ink)' }}>
                <MarkdownLite text={turn.text} />
              </div>
              {turn.example ? (
                /```/.test(turn.example) ? (
                  <div className="mt-3">
                    <MarkdownLite text={turn.example} />
                  </div>
                ) : (
                  <p
                    className="mt-3 rounded-xl border px-4 py-3 text-[14.5px] leading-relaxed"
                    style={{ borderColor: 'rgba(0,179,105,0.22)', background: 'rgba(0,179,105,0.08)' }}
                  >
                    <MarkdownLite text={turn.example} />
                  </p>
                )
              ) : null}
            </div>
          ),
        )}
      </div>

      {ask && !passed ? (
        <form
          className="mt-6 border-t pt-5"
          style={{ borderColor: 'var(--line)' }}
          onSubmit={(e) => {
            e.preventDefault();
            onCheck();
          }}
        >
          {prompt ? (
            <p className="font-display text-[18px] leading-snug" style={{ color: 'var(--ink)' }}>
              {prompt}
            </p>
          ) : null}
          <BookTutorAnswerField
            uiType={uiType}
            language={language}
            choices={choices}
            value={answer}
            disabled={busy}
            practice={uiType === 'code_editor'}
            onChange={onChange}
          />
          {error ? (
            <p className="mt-2 text-[13px]" style={{ color: '#b91c1c' }}>
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={busy || !answer.trim()}
            className="btn btn-primary mt-4 !px-5 !py-2.5 text-[13.5px]"
          >
            {busy ? <Loader2 size={15} className="animate-spin" /> : null}
            Check answer
          </button>
        </form>
      ) : null}
    </section>
  );
}
