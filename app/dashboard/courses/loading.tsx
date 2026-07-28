import type { CSSProperties } from 'react';

function Bone({ className = '', style }: { className?: string; style?: CSSProperties }) {
  return (
    <div
      className={`courses-skeleton-bone ${className}`}
      style={style}
      aria-hidden
    />
  );
}

function CourseCardSkeleton({ delayMs = 0 }: { delayMs?: number }) {
  return (
    <div
      className="w-[min(78vw,280px)] flex-shrink-0 sm:w-[280px]"
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <article
        className="flex h-full flex-col overflow-hidden border bg-paper"
        style={{ borderColor: 'var(--ink)' }}
      >
        <Bone className="aspect-[16/10] w-full" />
        <div className="flex flex-1 flex-col gap-2.5 p-3.5 sm:p-4">
          <Bone className="h-2.5 w-16" />
          <Bone className="h-4 w-[92%]" />
          <Bone className="h-4 w-[70%]" />
          <Bone className="mt-1 h-3 w-full" />
          <Bone className="h-3 w-[80%]" />
          <div className="mt-auto flex items-center gap-3 pt-2">
            <Bone className="h-3 w-14" />
            <Bone className="h-3 w-12" />
          </div>
          <Bone className="mt-2 h-10 w-full" />
        </div>
      </article>
    </div>
  );
}

function SectionSkeleton({
  titleWidth,
  cardCount = 4,
  stagger = 0,
}: {
  titleWidth: string;
  cardCount?: number;
  stagger?: number;
}) {
  return (
    <section className="mb-10 sm:mb-12">
      <div className="mb-3.5 flex items-end justify-between gap-3 sm:mb-4">
        <div className="min-w-0 space-y-2">
          <Bone className="h-6 sm:h-7" style={{ width: titleWidth }} />
          <Bone className="h-3 w-48 sm:w-64" />
        </div>
        <div className="hidden shrink-0 gap-2 sm:flex">
          <Bone className="h-9 w-9" />
          <Bone className="h-9 w-9" />
        </div>
      </div>
      <div className="no-scrollbar -mx-4 flex gap-3 overflow-hidden px-4 pb-2 sm:mx-0 sm:gap-4 sm:px-0">
        {Array.from({ length: cardCount }).map((_, i) => (
          <CourseCardSkeleton key={i} delayMs={stagger + i * 70} />
        ))}
      </div>
    </section>
  );
}

export default function CoursesLoading() {
  return (
    <div className="mx-auto max-w-[1080px] overflow-x-hidden" aria-busy="true" aria-live="polite">
      <style>{`
        @keyframes courses-skeleton-shimmer {
          0% { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
        .courses-skeleton-bone {
          background: linear-gradient(
            100deg,
            var(--paper-dim) 0%,
            var(--paper-dim) 35%,
            rgba(255,255,255,0.72) 50%,
            var(--paper-dim) 65%,
            var(--paper-dim) 100%
          );
          background-size: 220% 100%;
          animation: courses-skeleton-shimmer 1.35s ease-in-out infinite;
        }
      `}</style>

      <header className="mb-2 border-b pb-8" style={{ borderColor: 'var(--line)' }}>
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: 'var(--ink-soft)' }}>
          Learning paths
        </p>
        <h1 className="font-display text-[40px] leading-[0.95] tracking-tight sm:text-[52px]">
          My
          <br />
          courses
        </h1>
        <p className="mt-4 max-w-[420px] text-[15px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
          Gathering your enrolled paths and suggestions…
        </p>
        <div
          className="mt-5 h-[2px] w-full overflow-hidden"
          style={{ background: 'var(--line)' }}
          aria-hidden
        >
          <div
            className="h-full w-1/3"
            style={{
              background: 'var(--green)',
              animation: 'courses-skeleton-shimmer 1.1s linear infinite',
              backgroundImage:
                'linear-gradient(90deg, transparent, var(--green), transparent)',
              backgroundSize: '200% 100%',
            }}
          />
        </div>
      </header>

      <div
        className="mb-8 flex flex-col gap-6 border-b pb-8 sm:flex-row sm:items-end sm:justify-between"
        style={{ borderColor: 'var(--line)' }}
      >
        <div className="max-w-[520px] space-y-2.5">
          <Bone className="h-2.5 w-40" />
          <Bone className="h-3.5 w-full max-w-[420px]" />
          <Bone className="h-3.5 w-[85%] max-w-[360px]" />
        </div>
        <div className="flex gap-3">
          <Bone className="h-3 w-24" />
          <Bone className="h-3 w-20" />
        </div>
      </div>

      <div className="mb-10 max-w-md">
        <Bone className="h-10 w-full" />
      </div>

      <SectionSkeleton titleWidth="9.5rem" cardCount={4} stagger={0} />
      <SectionSkeleton titleWidth="11rem" cardCount={3} stagger={120} />

      <span className="sr-only">Loading your courses</span>
    </div>
  );
}
