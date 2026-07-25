import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { TutorialLesson } from '@/lib/tutorials/types';

export default function LessonNav({
  courseSlug,
  prev,
  next,
}: {
  courseSlug: string;
  prev: TutorialLesson | null;
  next: TutorialLesson | null;
}) {
  return (
    <div className="mt-10 grid gap-3 border-t pt-6 sm:grid-cols-2" style={{ borderColor: 'var(--line)' }}>
      {prev ? (
        <Link
          href={`/tutorials/${courseSlug}/${prev.slug}`}
          className="group rounded-xl border p-4 transition-colors hover:bg-[var(--paper-dim)]"
          style={{ borderColor: 'var(--line)' }}
        >
          <div className="mb-1 flex items-center gap-1.5 text-[12px] font-medium" style={{ color: 'var(--ink-soft)' }}>
            <ArrowLeft size={13} /> Previous
          </div>
          <div className="font-display text-[17px] leading-snug group-hover:underline">{prev.title}</div>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          href={`/tutorials/${courseSlug}/${next.slug}`}
          className="group rounded-xl border p-4 text-right transition-colors hover:bg-[var(--paper-dim)] sm:justify-self-end sm:text-left"
          style={{ borderColor: 'var(--line)', background: 'rgba(0,179,105,0.06)' }}
        >
          <div className="mb-1 flex items-center justify-end gap-1.5 text-[12px] font-medium sm:justify-start" style={{ color: 'var(--green-deep)' }}>
            Next <ArrowRight size={13} />
          </div>
          <div className="font-display text-[17px] leading-snug group-hover:underline">{next.title}</div>
        </Link>
      ) : (
        <Link
          href={`/tutorials/${courseSlug}`}
          className="rounded-xl border p-4 transition-colors hover:bg-[var(--paper-dim)]"
          style={{ borderColor: 'var(--line)' }}
        >
          <div className="mb-1 text-[12px] font-medium" style={{ color: 'var(--ink-soft)' }}>
            Finished
          </div>
          <div className="font-display text-[17px]">Back to curriculum</div>
        </Link>
      )}
    </div>
  );
}
