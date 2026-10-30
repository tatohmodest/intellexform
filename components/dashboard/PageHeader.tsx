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
    <header className="mb-6 sm:mb-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          {eyebrow ? <div className="eyebrow mb-2">{eyebrow}</div> : null}
          <h1 className="font-display text-[26px] leading-[1.1] tracking-tight sm:text-[32px]">{title}</h1>
          {description ? <p className="muted mt-1.5 text-[14.5px]">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
      {children}
    </header>
  );
}
