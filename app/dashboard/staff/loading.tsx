export default function StaffLoading() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 w-48" style={{ background: 'var(--line)' }} />
      <div className="h-24" style={{ background: 'var(--line)' }} />
      <div className="h-24" style={{ background: 'var(--line)' }} />
    </div>
  );
}
