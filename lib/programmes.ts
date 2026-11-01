import { PROGRAMS, formatPrice } from '@/lib/programs';
import type { Program } from '@/lib/types';

/**
 * Public programme catalogue - the core InTelleX product.
 * Source of truth for titles, prices and syllabus topics stays in `lib/programs.ts`;
 * this layer adds the grouping and delivery details the public pages need.
 */

export type ProgrammeCategory = 'software' | 'data' | 'security' | 'foundations';

export const PROGRAMME_CATEGORIES: { id: ProgrammeCategory; label: string; blurb: string }[] = [
  {
    id: 'software',
    label: 'Software Development',
    blurb: 'Web, backend and mobile engineering.',
  },
  { id: 'data', label: 'Data & AI', blurb: 'Analysis, visualisation and statistics.' },
  { id: 'security', label: 'Cybersecurity', blurb: 'Defensive security and certification prep.' },
  {
    id: 'foundations',
    label: 'Foundations',
    blurb: 'Short starter programmes for complete beginners.',
  },
];

const CATEGORY_BY_ID: Record<string, ProgrammeCategory> = {
  'data-analysis': 'data',
  cybersecurity: 'security',
  'cybersecurity-ceh': 'security',
};

/** How every programme is delivered: live group classes + mentorship + self-paced materials. */
export const DELIVERY = [
  {
    id: 'live',
    title: 'Live online classes',
    body: 'Scheduled sessions with your instructor and cohort. Ask questions as you go.',
  },
  {
    id: 'mentorship',
    title: 'Mentorship',
    body: 'Code reviews and guidance from an instructor who knows your progress.',
  },
  {
    id: 'materials',
    title: 'Self-paced materials',
    body: 'Notes, exercises and class materials in your dashboard, available any time.',
  },
  {
    id: 'projects',
    title: 'Practical projects',
    body: 'You build real work for your portfolio, not quizzes for a score.',
  },
] as const;

export type Programme = Program & {
  category: ProgrammeCategory;
  categoryLabel: string;
  /** True for the short "partial" starter programmes. */
  short: boolean;
  format: string;
  prerequisites: string;
  equipment: string[];
};

function prerequisitesFor(p: Program): string {
  const level = p.level.toLowerCase();
  if (level.includes('absolute') || level.startsWith('beginner')) {
    return 'None. You only need to be comfortable using a computer and the internet.';
  }
  return 'Basic programming knowledge (variables, functions, loops). Not sure? Start with a Foundations programme or ask us.';
}

function toProgramme(p: Program): Programme {
  const short = p.type === 'partial';
  const category: ProgrammeCategory = short ? 'foundations' : CATEGORY_BY_ID[p.id] || 'software';
  return {
    ...p,
    category,
    categoryLabel: PROGRAMME_CATEGORIES.find((c) => c.id === category)!.label,
    short,
    format: short ? 'Live classes + self-paced materials' : 'Live classes + mentorship + projects',
    prerequisites: prerequisitesFor(p),
    equipment: [
      'A laptop or desktop computer (Windows, macOS or Linux)',
      'A stable internet connection for live classes',
    ],
  };
}

export const PROGRAMMES: Programme[] = PROGRAMS.map(toProgramme);

export const FLAGSHIP_PROGRAMMES = PROGRAMMES.filter((p) => !p.short);

export function getProgramme(id: string): Programme | undefined {
  return PROGRAMMES.find((p) => p.id === id);
}

export function programmeHref(p: Pick<Program, 'id'>) {
  return `/programmes/${p.id}`;
}

/** Step-by-step enrolment for this programme; the team then confirms cohort and payment on WhatsApp. */
export function enrolHref(p: Pick<Program, 'id'>) {
  return `/programmes/${encodeURIComponent(p.id)}/enrol`;
}

export function priceLabel(xaf: number) {
  return formatPrice(xaf).replace(/ | /g, ' ');
}

/** Roughly what a monthly plan works out to per day, rounded to the nearest 50 XAF. */
export function dailyXaf(monthlyXaf: number) {
  return Math.round(monthlyXaf / 30 / 50) * 50;
}

/** Short numeric form for cards, e.g. "320,000". */
export function priceNumber(xaf: number) {
  return new Intl.NumberFormat('en-US').format(xaf);
}

export const ENROL_STEPS = [
  { title: 'Choose a programme', body: 'Compare syllabus, duration and price. Ask us if you are unsure.' },
  { title: 'Enrol', body: 'Send your enrolment request. We confirm your cohort start date on WhatsApp.' },
  {
    title: 'Invest in yourself',
    body: 'Pay in full or spread it monthly with MTN MoMo, Orange Money or card. Registration fee applies.',
  },
  { title: 'Learn live', body: 'Join classes, get mentorship and work through projects in your dashboard.' },
  { title: 'Finish with proof', body: 'Complete your projects and earn your InTelleX certificate.' },
] as const;

export const PROGRAMME_FAQ = [
  {
    q: 'When does the next cohort start?',
    a: 'Cohorts open regularly. When you enrol, we confirm the next start date and class schedule with you before you pay.',
  },
  {
    q: 'Can I pay monthly?',
    a: 'Yes. Programmes with a monthly price can be paid month by month instead of in full. Mobile money (MTN MoMo, Orange Money) and card are accepted.',
  },
  {
    q: 'What if I miss a live class?',
    a: 'Session materials are shared in your dashboard, and you can raise questions with your instructor at the next session or in messages.',
  },
  {
    q: 'Do I get a certificate?',
    a: 'Yes. You receive an InTelleX certificate when you complete the programme and its projects.',
  },
  {
    q: 'I am not sure which programme fits me.',
    a: 'Message us on WhatsApp or through the contact form. We will ask about your goals and current level and recommend a starting point.',
  },
] as const;
