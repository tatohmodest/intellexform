/**
 * Intellex wordmark in the brand colours: green "INTE", ink/white "LL", blue "EX".
 * `onDark` flips the middle segment to white for dark backgrounds.
 */
export default function Logo({
  onDark = false,
  className = '',
}: {
  onDark?: boolean;
  className?: string;
}) {
  const mid = onDark ? '#FFFFFF' : 'var(--ink)';
  return (
    <span
      className={`font-mono font-semibold uppercase tracking-[0.18em] ${className}`}
      aria-label="Intellex"
    >
      <span style={{ color: 'var(--green)' }}>INTE</span>
      <span style={{ color: mid }}>LL</span>
      <span style={{ color: 'var(--blue)' }}>EX</span>
    </span>
  );
}
