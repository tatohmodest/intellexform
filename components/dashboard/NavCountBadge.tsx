'use client';

export default function NavCountBadge({
  count,
  compact = false,
}: {
  count: number;
  compact?: boolean;
}) {
  const n = Math.max(0, Number(count) || 0);
  const label = n > 99 ? '99+' : String(n);
  const on = n > 0;
  return (
    <span
      className={
        compact
          ? 'absolute -right-1 -top-1 flex h-[16px] min-w-[16px] items-center justify-center rounded-full px-1 text-[9px] font-bold leading-none'
          : 'ml-auto flex h-[18px] min-w-[18px] shrink-0 items-center justify-center rounded-full px-1.5 text-[10px] font-bold leading-none'
      }
      style={{
        background: on ? 'var(--green)' : 'var(--paper-dim)',
        color: on ? '#fff' : 'var(--ink-soft)',
      }}
      aria-label={`${label} ${on ? 'new' : ''}`}
    >
      {label}
    </span>
  );
}
