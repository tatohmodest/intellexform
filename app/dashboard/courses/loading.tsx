import { Loader2 } from 'lucide-react';

export default function CoursesLoading() {
  return (
    <div className="mx-auto flex max-w-[1080px] items-center gap-3 py-20 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
      <Loader2 size={18} className="animate-spin" />
      Loading your courses…
    </div>
  );
}
