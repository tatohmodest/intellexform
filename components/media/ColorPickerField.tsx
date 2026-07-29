'use client';

import { normalizeHexColor } from '@/lib/imageColor';

export default function ColorPickerField({
  label = 'Brand color',
  value,
  onChange,
  hint,
}: {
  label?: string;
  value: string;
  onChange: (hex: string) => void;
  hint?: string;
}) {
  const hex = normalizeHexColor(value);

  return (
    <div className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--ink-soft)' }}>
        {label}
      </span>
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="color"
          value={hex}
          onChange={(e) => onChange(normalizeHexColor(e.target.value))}
          className="h-11 w-14 cursor-pointer rounded-lg border bg-transparent p-1"
          style={{ borderColor: 'var(--line)' }}
          aria-label={label}
        />
        <input
          className="form-input max-w-[140px] font-mono uppercase"
          value={hex}
          onChange={(e) => onChange(normalizeHexColor(e.target.value, hex))}
          placeholder="#00b369"
          maxLength={7}
        />
        <span
          className="inline-flex h-11 min-w-[72px] items-center justify-center rounded-lg border px-3 text-[12px] font-semibold text-white"
          style={{ background: hex, borderColor: 'var(--line)' }}
        >
          Preview
        </span>
      </div>
      <p className="mt-1 text-[12px]" style={{ color: 'var(--ink-soft)' }}>
        {hint || 'Pick a color visually - no need to memorize hex codes. Uploading a logo/cover can auto-fill this.'}
      </p>
    </div>
  );
}
