'use client';

import type { ReactNode } from 'react';
import { OPEN_ADVISOR_EVENT } from '@/lib/advisor';

/** Opens the AI advisor panel, optionally sending a first question. */
export default function AskAdvisorButton({
  question,
  className,
  children,
}: {
  question?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new CustomEvent(OPEN_ADVISOR_EVENT, { detail: question }))}
    >
      {children}
    </button>
  );
}
