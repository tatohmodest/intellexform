'use client';

import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';
import { ArrowLeft, ArrowRight, Check, Loader2, X } from 'lucide-react';

/**
 * Shared step-form kit (enrolment + contact): a stacked card, segmented progress,
 * one question per step, pill/radio options and Back / Next.
 */

export function StepCard({
  step,
  total,
  onClose,
  children,
}: {
  /** Zero-based current step; pass `total` when finished. */
  step: number;
  total: number;
  onClose?: () => void;
  children: ReactNode;
}) {
  return (
    <div className="relative mx-auto w-full max-w-[560px]">
      {/* Stacked card behind, as in the reference */}
      <div
        aria-hidden
        className="absolute inset-x-3 -bottom-3 top-4 -rotate-[3deg] rounded-[34px] bg-white/70 shadow-[0_20px_50px_-30px_rgba(18,50,79,0.35)] sm:inset-x-0 sm:-rotate-[4deg]"
      />
      <div className="relative flex min-h-[520px] flex-col rounded-[32px] bg-white p-6 shadow-[0_30px_70px_-34px_rgba(18,50,79,0.45)] sm:p-10">
        <div className="flex items-center gap-4">
          <div className="flex flex-1 gap-1.5" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={Math.min(step, total)}>
            {Array.from({ length: total }).map((_, i) => (
              <span key={i} className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#e7e9ee]">
                <span
                  className="block h-full rounded-full bg-[var(--navy)] transition-all duration-500"
                  style={{ width: i < step ? '100%' : i === step ? '45%' : '0%' }}
                />
              </span>
            ))}
          </div>
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#b9bdb6] text-white transition-colors hover:bg-[var(--navy)]"
            >
              <X size={16} strokeWidth={3} />
            </button>
          ) : null}
        </div>
        <div className="mt-9 flex flex-1 flex-col">{children}</div>
      </div>
    </div>
  );
}

export function StepHeading({ label, title, hint }: { label: string; title: string; hint?: string }) {
  return (
    <div className="mb-7">
      <div className="font-mono text-[12.5px] font-semibold uppercase tracking-[0.12em] text-[var(--navy)]">{label}</div>
      <h2 className="mt-4 text-[28px] font-bold leading-[1.15] text-[var(--navy)] sm:text-[34px]">{title}</h2>
      {hint ? <p className="mt-3 text-[15px] leading-relaxed text-[#8a909a]">{hint}</p> : null}
    </div>
  );
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return <div className="mb-2.5 text-[14px] font-medium text-[var(--navy)]">{children}</div>;
}

/** Pill choice with a green check when selected (reference 1). */
export function PillOption({
  label,
  hint,
  selected,
  onClick,
}: {
  label: string;
  hint?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 rounded-full border px-5 py-3 text-left text-[15px] transition-all ${
        selected
          ? 'border-[var(--green)] bg-[var(--pastel-mint)] text-[var(--navy)]'
          : 'border-[#d9dce3] bg-white text-[var(--navy)] hover:border-[var(--navy)]/40'
      }`}
    >
      {selected ? (
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--green)] text-white">
          <Check size={12} strokeWidth={3} />
        </span>
      ) : null}
      <span>
        <span className="block font-medium leading-tight">{label}</span>
        {hint ? <span className="mt-0.5 block text-[12.5px] text-[#8a909a]">{hint}</span> : null}
      </span>
    </button>
  );
}

/** Single-choice row with a round radio (reference 2). */
export function RadioOption({
  label,
  hint,
  aside,
  selected,
  onClick,
}: {
  label: string;
  hint?: string;
  aside?: ReactNode;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={`flex w-full items-center gap-4 rounded-2xl px-4 py-3.5 text-left transition-colors ${
        selected ? 'bg-[var(--pastel-mint)]' : 'hover:bg-[#f5f6f8]'
      }`}
    >
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          selected ? 'border-[var(--green)] bg-[var(--green)] text-white' : 'border-[var(--navy)]'
        }`}
      >
        {selected ? <Check size={13} strokeWidth={3} /> : null}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[17px] font-medium text-[var(--navy)]">{label}</span>
        {hint ? <span className="mt-0.5 block text-[13.5px] text-[#8a909a]">{hint}</span> : null}
      </span>
      {aside ? <span className="shrink-0">{aside}</span> : null}
    </button>
  );
}

const inputCls =
  'w-full rounded-2xl border border-[#d9dce3] bg-[#f8f9fb] px-4 py-3.5 text-[15.5px] text-[var(--navy)] outline-none transition-colors placeholder:text-[#a3a8b1] focus:border-[var(--green)] focus:bg-white focus:ring-4 focus:ring-[var(--green)]/10';

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputCls} ${props.className || ''}`} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputCls} min-h-[120px] resize-y ${props.className || ''}`} />;
}

export function StepNav({
  onBack,
  onNext,
  nextLabel = 'Next',
  backLabel = 'Back',
  disabled,
  loading,
  final,
}: {
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  backLabel?: string;
  disabled?: boolean;
  loading?: boolean;
  final?: boolean;
}) {
  return (
    <div className="mt-auto flex items-center justify-end gap-3 pt-10">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-2xl px-5 py-3.5 text-[16px] font-medium text-[var(--navy)] transition-colors hover:bg-[#f1f2f5]"
        >
          <ArrowLeft size={17} /> {backLabel}
        </button>
      ) : null}
      <button
        type="button"
        onClick={onNext}
        disabled={disabled || loading}
        className="inline-flex min-w-[140px] items-center justify-center gap-2 rounded-2xl bg-[var(--green)] px-7 py-3.5 text-[16px] font-semibold text-white shadow-[0_10px_24px_-14px_rgba(0,140,80,0.8)] transition-all hover:bg-[var(--green-deep)] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : null}
        {nextLabel}
        {!loading && !final ? <ArrowRight size={17} /> : null}
        {!loading && final ? <Check size={17} /> : null}
      </button>
    </div>
  );
}
