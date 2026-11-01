import type { ReactNode } from 'react';

/** Shared dashboard page header: optional eyebrow, title, one-line description, actions. */
export default function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  children,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="mb-6 rounded-[28px] bg-[var(--pastel-sky)] px-5 py-6 sm:mb-8 sm:px-8 sm:py-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          {eyebrow ? <div className="mb-2 text-[13px] font-semibold text-[var(--green-deep)]">{eyebrow}</div> : null}
          <h1 className="font-display text-[26px] font-extrabold leading-[1.1] text-[var(--navy)] sm:text-[32px]">{title}</h1>
          {description ? <p className="mt-1.5 text-[14.5px] text-[var(--navy)]/70">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
      {children}
    </header>
  );
}
