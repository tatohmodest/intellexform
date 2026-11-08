import type { ReactNode } from 'react';

export type HeaderTone = 'sky' | 'mint' | 'butter' | 'lilac' | 'peach';

/**
 * Pages still pass the old flat illustrations; each maps to the Open Doodles line drawing
 * that replaced it, so the dashboard matches the public site without touching every page.
 */
const ART_DOODLE: Record<string, string> = {
  '/eco_cert.webp': 'unboxing',
  '/illustrations/launching.png': 'jumping',
  '/join_cta.webp': 'selfie',
  '/eco_learning.webp': 'sittingreading',
  '/illustrations/multitasking.png': 'levitate',
  '/way_live.webp': 'sitting',
  '/mentor_session.webp': 'doggie',
  '/hero_illustration.webp': 'sleek',
  '/hero_career.webp': 'sprinting',
  '/eco_books.webp': 'reading',
  '/hero_mentor.webp': 'loving',
  '/way_selfpaced.webp': 'readingside',
  '/illustrations/reading.png': 'laying',
  '/illustrations/studying.png': 'plant',
  '/eco_intern.webp': 'float',
  '/illustrations/teaching.png': 'coffee',
};

export function doodleFor(art: string) {
  if (art.startsWith('/doodles/')) return art;
  return `/doodles/${ART_DOODLE[art] || 'meditating'}.svg`;
}

/**
 * Shared dashboard page header: a white hairline banner with title, one-line description,
 * actions and a line-art doodle on the right (hidden on small screens).
 * `tone` is kept for existing callers; the airy system uses one surface everywhere.
 */
export default function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  children,
  art,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
  /** Old illustration path or a /doodles/*.svg path; rendered as a line-art doodle. */
  art?: string;
  tone?: HeaderTone;
}) {
  return (
    <header className="relative mb-6 overflow-hidden rounded-[20px] border border-[#e7e9ec] bg-white px-5 py-6 sm:mb-8 sm:px-8 sm:py-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[46%] opacity-70 md:block"
        style={{
          backgroundImage: 'radial-gradient(#e7e9ec 1px, transparent 1px)',
          backgroundSize: '18px 18px',
          maskImage: 'linear-gradient(to left, #000 40%, transparent)',
          WebkitMaskImage: 'linear-gradient(to left, #000 40%, transparent)',
        }}
      />
      {art ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={doodleFor(art)}
          alt=""
          aria-hidden
          className="pointer-events-none absolute bottom-2 right-6 hidden h-[88%] max-h-[190px] max-w-[36%] select-none object-contain object-bottom md:block"
        />
      ) : null}
      <div className={`relative flex flex-wrap items-end justify-between gap-4 ${art ? 'md:max-w-[60%]' : ''}`}>
        <div className="min-w-0">
          {eyebrow ? (
            <div className="mb-2 inline-flex items-center gap-2 text-[13px] font-medium text-[#4b5563]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--green)]" />
              {eyebrow}
            </div>
          ) : null}
          <h1 className="text-[26px] leading-[1.1] text-[var(--ink)] sm:text-[34px]">{title}</h1>
          {description ? <p className="mt-2 max-w-[520px] text-[15px] leading-relaxed text-[#4b5563]">{description}</p> : null}
        </div>
        {actions ? <div className={`flex flex-wrap gap-2 ${art ? 'w-full' : ''}`}>{actions}</div> : null}
      </div>
      {children ? <div className={`relative ${art ? 'md:max-w-[62%]' : ''}`}>{children}</div> : null}
    </header>
  );
}
