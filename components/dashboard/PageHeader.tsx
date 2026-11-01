import type { ReactNode } from 'react';

export type HeaderTone = 'sky' | 'mint' | 'butter' | 'lilac' | 'peach';

const TONE_BG: Record<HeaderTone, string> = {
  sky: 'var(--pastel-sky)',
  mint: 'var(--pastel-mint)',
  butter: 'var(--pastel-butter)',
  lilac: 'var(--pastel-lilac)',
  peach: '#ffe6d9',
};

/**
 * Shared dashboard page header: a calm pastel banner with title, one-line description,
 * actions and an optional flat illustration on the right (hidden on small screens).
 */
export default function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  children,
  art,
  tone = 'sky',
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
  /** Path to a flat illustration in /public (blends into the tone via multiply). */
  art?: string;
  tone?: HeaderTone;
}) {
  return (
    <header
      className="relative mb-6 overflow-hidden rounded-[28px] px-5 py-6 sm:mb-8 sm:px-8 sm:py-8"
      style={{ background: TONE_BG[tone] }}
    >
      {art ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={art}
          alt=""
          aria-hidden
          className="illo pointer-events-none absolute -bottom-3 right-2 hidden h-[118%] max-w-[44%] object-contain object-bottom md:block"
        />
      ) : null}
      <div className={`relative flex flex-wrap items-end justify-between gap-4 ${art ? 'md:max-w-[58%]' : ''}`}>
        <div className="min-w-0">
          {eyebrow ? <div className="mb-2 text-[13px] font-semibold text-[var(--green-deep)]">{eyebrow}</div> : null}
          <h1 className="font-display text-[26px] font-extrabold leading-[1.1] text-[var(--navy)] sm:text-[34px]">{title}</h1>
          {description ? <p className="mt-2 max-w-[520px] text-[15px] leading-relaxed text-[var(--navy)]/70">{description}</p> : null}
        </div>
        {actions ? <div className={`flex flex-wrap gap-2 ${art ? 'w-full' : ''}`}>{actions}</div> : null}
      </div>
      {children ? <div className={`relative ${art ? 'md:max-w-[62%]' : ''}`}>{children}</div> : null}
    </header>
  );
}
