import { PROGRAMMES } from '@/lib/programmes';
import { STUDENT_MONTHLY_XAF } from '@/lib/learn/studentMembership';

/**
 * The InTelleX story, shared by the homepage, /why-intellex and /pricing.
 * Every line here must be something a learner can check after enrolling: no invented numbers.
 * Strategy behind it: docs/REPOSITIONING.md.
 */

/** "Why pay when YouTube is free?" - three ways to learn the same skill. */
export const COMPARE_COLUMNS = ['Free tutorials', 'A recorded course', 'An InTelleX programme'] as const;

export const COMPARE_ROWS: { label: string; values: [string, string, string] }[] = [
  {
    label: 'Who decides what you learn next?',
    values: ['You, every evening', 'The course outline', 'A syllabus built for the job, taught in order'],
  },
  {
    label: 'Who checks your work?',
    values: ['Nobody', 'An automated quiz', 'Your instructor, line by line'],
  },
  {
    label: 'What happens when you are stuck?',
    values: ['Search, scroll, give up', 'A comment section', 'Ask in class or message your instructor'],
  },
  {
    label: 'Who notices if you stop?',
    values: ['Nobody', 'Nobody', 'Your instructor and your cohort'],
  },
  {
    label: 'What you finish with',
    values: ['Bookmarks', 'A completion badge', 'Reviewed projects, a portfolio and a certificate'],
  },
];

export type JourneyPhase = {
  id: string;
  when: string;
  title: string;
  body: string;
  /** What the learner sees in their dashboard during this phase (rendered as a sample card). */
  artefact: {
    kind: 'schedule' | 'review' | 'project' | 'help' | 'certificate';
    heading: string;
    lines: string[];
  };
};

/** A Full Stack Web Development programme, week by week. Sample content, clearly labelled as such. */
export const JOURNEY: JourneyPhase[] = [
  {
    id: 'start',
    when: 'Before week 1',
    title: 'We talk before you pay',
    body: 'You tell us your goal, your level and when you are free. We recommend a programme, confirm your cohort start date and class times, then you enrol.',
    artefact: {
      kind: 'schedule',
      heading: 'Your class times',
      lines: ['Tue · 19:00 Live class', 'Thu · 19:00 Live class', 'Sat · 10:00 Q&A and help'],
    },
  },
  {
    id: 'learn',
    when: 'Weeks 1–8',
    title: 'You learn live, in order',
    body: 'Live classes with your instructor and cohort, notes and exercises in your dashboard, and the AI tutor for questions at 11pm. Nobody makes you guess what comes next.',
    artefact: {
      kind: 'help',
      heading: 'Tonight, 23:04',
      lines: ['“Why does my fetch return undefined?”', 'AI tutor: you are returning before the promise resolves…', 'Flagged for Thursday’s class'],
    },
  },
  {
    id: 'build',
    when: 'Weeks 9–18',
    title: 'You build, and someone checks',
    body: 'Every module ends with something you build. Your instructor reviews it and tells you what to fix, the way a senior colleague would.',
    artefact: {
      kind: 'review',
      heading: 'Review on “Login page”',
      lines: ['✓ Form validation works', '✎ Hash the password before saving it', '✎ Move this logic out of the component'],
    },
  },
  {
    id: 'capstone',
    when: 'Weeks 19–24',
    title: 'You ship something real',
    body: 'A capstone project you plan, build and deploy, with your instructor as mentor. It goes into your portfolio with a link anyone can open.',
    artefact: {
      kind: 'project',
      heading: 'Capstone · deployed',
      lines: ['Booking app for a local salon', 'Next.js · Node · PostgreSQL', 'Live link · Code on GitHub'],
    },
  },
  {
    id: 'finish',
    when: 'Finish',
    title: 'You leave with proof',
    body: 'Complete the programme requirements and its projects, and you earn your InTelleX certificate. The projects are the real proof; the certificate says you finished them.',
    artefact: {
      kind: 'certificate',
      heading: 'InTelleX Certificate',
      lines: ['Full Stack Web Development', 'Programme and projects completed', 'Verifiable online'],
    },
  },
];

export type Benefit = { title: string; body: string };

/** The benefits, grouped so they read as one experience instead of a buzzword list. */
export const BENEFIT_GROUPS: { id: string; title: string; lead: string; bg: string; items: Benefit[] }[] = [
  {
    id: 'structure',
    title: 'A path, not a pile',
    lead: 'You stop deciding what to watch next.',
    bg: 'var(--pastel-sky)',
    items: [
      { title: 'Structured learning paths', body: 'A syllabus with a fixed order and a fixed duration. You always know what this week is for.' },
      { title: 'Flexible online and onsite options', body: 'Live online classes by default, at set times. Onsite sessions where available: ask us what exists near you.' },
      { title: 'Continued learning', body: 'Your materials and the self-paced library stay useful after your programme ends.' },
    ],
  },
  {
    id: 'people',
    title: 'People who notice you',
    lead: 'The part a video can never give you.',
    bg: 'var(--pastel-mint)',
    items: [
      { title: 'Instructors we chose', body: 'You do not pick a stranger from a list. InTelleX reviews, approves and manages every instructor.' },
      { title: 'Mentorship and feedback', body: 'Your instructor reviews your work and tells you exactly what to improve.' },
      { title: 'A cohort to learn with', body: 'Other learners at your stage, so you are not the only one stuck on week 6.' },
    ],
  },
  {
    id: 'proof',
    title: 'Proof you can show',
    lead: 'Something real at the end, not just a badge.',
    bg: 'var(--pastel-butter)',
    items: [
      { title: 'Practical skills', body: 'You practise the actual work: building, analysing, defending, marketing.' },
      { title: 'Real projects and a portfolio', body: 'Projects you can open, demo and explain in an interview or to a client.' },
      { title: 'Certificates with requirements', body: 'Awarded when you complete the programme and its projects. Not for watching.' },
    ],
  },
  {
    id: 'support',
    title: 'Help at any hour',
    lead: 'People for the hard questions, AI for the small ones.',
    bg: 'var(--pastel-lilac)',
    items: [
      { title: 'AI-assisted learning', body: 'An AI tutor in your dashboard for the 11pm questions, so small blockers do not wait a week.' },
      { title: 'Access to professionals', body: 'Instructors who do this work, and a network of learners who are doing it too.' },
    ],
  },
];

function range(values: number[]) {
  return { min: Math.min(...values), max: Math.max(...values) };
}

const career = PROGRAMMES.filter((p) => !p.short);
const foundations = PROGRAMMES.filter((p) => p.short);

export const CAREER_PRICE = range(career.map((p) => p.priceXAF));
export const CAREER_MONTHLY_FROM = Math.min(...career.map((p) => p.monthlyXAF || p.priceXAF));
export const FOUNDATIONS_PRICE = range(foundations.map((p) => p.priceXAF));
export const REGISTRATION_FEE = Math.max(...PROGRAMMES.map((p) => p.registrationFee || 0));

export type Tier = {
  id: 'library' | 'foundations' | 'career';
  level: string;
  name: string;
  price: string;
  priceNote: string;
  duration: string;
  forWho: string;
  includes: string[];
  excludes: string[];
  href: string;
  cta: string;
  bg: string;
  featured?: boolean;
};

const n = (x: number) => new Intl.NumberFormat('en-US').format(x);

/** Priced by how much human attention you get - the gap in price is a gap in support. */
export const TIERS: Tier[] = [
  {
    id: 'library',
    level: 'Learn on your own',
    name: 'Library membership',
    price: `${n(STUDENT_MONTHLY_XAF)} XAF`,
    priceNote: 'per month',
    duration: 'Cancel any time',
    forWho: 'Self-starters who already know what to learn and only need the material.',
    includes: ['Self-paced course library', 'Free tutorials and books', 'AI tutor', 'Certificates of completion'],
    excludes: ['No instructor checks your work', 'No live classes or cohort'],
    href: '/membership',
    cta: 'Join the library',
    bg: 'var(--paper-dim)',
  },
  {
    id: 'foundations',
    level: 'Learn with a teacher',
    name: 'Foundations programmes',
    price: `${n(FOUNDATIONS_PRICE.min)}–${n(FOUNDATIONS_PRICE.max)} XAF`,
    priceNote: 'one payment',
    duration: '4–6 weeks',
    forWho: 'Complete beginners who want to try learning with an instructor first.',
    includes: ['Live beginner classes', 'Class notes and exercises', 'A first small project', 'Programme materials in your dashboard'],
    excludes: ['Short: no long mentorship', 'Not a full portfolio'],
    href: '/programmes?category=foundations',
    cta: 'See Foundations',
    bg: 'var(--pastel-sky)',
  },
  {
    id: 'career',
    level: 'Get trained',
    name: 'Career programmes',
    price: `${n(CAREER_PRICE.min)}–${n(CAREER_PRICE.max)} XAF`,
    priceNote: `or monthly from ${n(CAREER_MONTHLY_FROM)} XAF`,
    duration: '3–6 months',
    forWho: 'People who want to be able to do the work, and want someone making sure they can.',
    includes: [
      'Live classes with your instructor and cohort',
      'Mentorship and reviews of your work',
      'Real projects and a portfolio',
      'AI tutor and all materials',
      'Certificate on completing programme requirements',
    ],
    excludes: ['No job guarantee. We teach the skill; you do the work.'],
    href: '/programmes',
    cta: 'Choose a programme',
    bg: 'var(--pastel-mint)',
    featured: true,
  },
];

/** Who InTelleX is not for. Saying it is how people believe who it is for. */
export const NOT_FOR = [
  { title: 'You want a job guarantee', body: 'We do not offer one, and you should be careful of anyone who does. We teach the skill and help you prove it.' },
  { title: 'You only want to watch', body: 'Programmes are built around doing the work. If you only want videos, the library is far cheaper.' },
  { title: 'You cannot give it a few hours a week', body: 'Live classes and projects need regular time. Tell us your schedule first and we will be honest about fit.' },
];
