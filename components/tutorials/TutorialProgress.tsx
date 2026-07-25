export default function TutorialProgress({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const pct = Math.round((current / total) * 100);

  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center justify-between text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
        <span>
          Lesson {current} of {total}
        </span>
        <span className="font-mono">{pct}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full" style={{ background: 'var(--paper-dim)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: 'linear-gradient(90deg, var(--green), var(--blue))' }}
        />
      </div>
    </div>
  );
}
