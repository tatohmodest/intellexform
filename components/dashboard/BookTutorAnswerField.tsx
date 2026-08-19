'use client';

import { useRef, type KeyboardEvent } from 'react';

export type TutorUiType = 'text_input' | 'code_editor' | 'multiple_choice';

export default function BookTutorAnswerField({
  uiType,
  language,
  choices,
  value,
  disabled,
  practice,
  onChange,
}: {
  uiType: TutorUiType;
  language?: string;
  choices?: string[];
  value: string;
  disabled?: boolean;
  practice?: boolean;
  onChange: (v: string) => void;
}) {
  if (uiType === 'multiple_choice' && choices && choices.length >= 2) {
    return (
      <div className="mt-4 grid gap-2">
        {choices.map((choice) => {
          const selected = value === choice;
          return (
            <button
              key={choice}
              type="button"
              disabled={disabled}
              onClick={() => onChange(choice)}
              className="rounded-xl border px-4 py-3 text-left text-[14.5px] leading-relaxed disabled:opacity-60"
              style={{
                borderColor: selected ? 'var(--green-deep)' : 'var(--line)',
                background: selected ? 'rgba(0,179,105,0.08)' : 'var(--paper)',
                color: 'var(--ink)',
              }}
            >
              {choice}
            </button>
          );
        })}
      </div>
    );
  }

  if (uiType === 'code_editor') {
    return (
      <CodeEditor
        value={value}
        language={language}
        disabled={disabled}
        onChange={onChange}
      />
    );
  }

  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={practice ? 5 : 4}
      placeholder={practice ? 'Paste the output, result, or what you saw…' : 'Answer in your own words…'}
      className="mt-4 w-full border px-3 py-2.5 text-[14px]"
      style={{ borderColor: 'var(--line)', background: 'transparent' }}
      disabled={disabled}
    />
  );
}

function CodeEditor({
  value,
  language,
  disabled,
  onChange,
}: {
  value: string;
  language?: string;
  disabled?: boolean;
  onChange: (v: string) => void;
}) {
  const area = useRef<HTMLTextAreaElement>(null);
  const lines = (value || ' ').split('\n');
  const label = language && language !== 'other' ? language : 'code';

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key !== 'Tab') return;
    e.preventDefault();
    const el = e.currentTarget;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const next = `${value.slice(0, start)}  ${value.slice(end)}`;
    onChange(next);
    requestAnimationFrame(() => {
      el.selectionStart = el.selectionEnd = start + 2;
    });
  }

  return (
    <div className="mt-4 overflow-hidden rounded-xl" style={{ background: '#0C1116' }}>
      <div
        className="flex items-center justify-between border-b px-3 py-1.5"
        style={{ borderColor: 'rgba(255,255,255,0.08)' }}
      >
        <span className="font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: '#8aa0b2' }}>
          {label}
        </span>
        <span className="text-[11px]" style={{ color: '#6b8090' }}>
          Tab inserts spaces
        </span>
      </div>
      <div className="flex min-h-[160px]">
        <pre
          className="select-none py-3 pl-3 pr-2 text-right font-mono text-[12px] leading-[1.7]"
          style={{ color: '#5d7180', background: '#0a0e12' }}
        >
          {lines.map((_, i) => (
            <span key={i} className="block">
              {i + 1}
            </span>
          ))}
        </pre>
        <textarea
          ref={area}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          spellCheck={false}
          disabled={disabled}
          placeholder="// write or paste your code here"
          className="min-h-[160px] w-full resize-y bg-transparent px-3 py-3 font-mono text-[13px] leading-[1.7] text-[#d7e2ec] outline-none"
          rows={Math.max(6, lines.length + 1)}
        />
      </div>
    </div>
  );
}
