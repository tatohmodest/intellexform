'use client';

import HeroCarousel, { type HeroSlide } from '@/components/landing/HeroCarousel';

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'chapter',
    image: '/hero_illustration.webp',
    alt: 'Learner studying at a desk with floating course icons',
    headline: (
      <>
        A course is only the <em className="not-italic text-green-deep" style={{ fontStyle: 'italic' }}>first chapter.</em>
      </>
    ),
    body: 'Self-paced courses, live mentors, and an AI tutor — so you actually finish.',
  },
  {
    id: 'mentor',
    image: '/hero_mentor.webp',
    alt: 'Mentor guiding a student in a live tutoring session',
    headline: (
      <>
        Sometimes you need a <em className="not-italic text-green-deep" style={{ fontStyle: 'italic' }}>person</em>, not a playlist.
      </>
    ),
    body: 'Live tutoring online or onsite — a real mentor keeping you accountable.',
    ctaLabel: 'Get a quote',
    secondaryLabel: 'See how it works',
    secondaryHref: '/#learn',
  },
  {
    id: 'ai',
    image: '/hero_ai.webp',
    alt: 'Student learning with an AI tutor trained on a real textbook',
    headline: (
      <>
        We teach the AI the book, so it can <em className="not-italic text-green-deep" style={{ fontStyle: 'italic' }}>teach you.</em>
      </>
    ),
    body: "Unlock levels one by one — or everything at once — in the author's voice.",
    ctaLabel: 'Try AI Tutor',
    secondaryLabel: 'How AI works',
    secondaryHref: '/#ai',
  },
  {
    id: 'career',
    image: '/hero_career.webp',
    alt: 'Graduate celebrating skills-to-income progress',
    headline: (
      <>
        Skills to income, at <em className="not-italic text-green-deep" style={{ fontStyle: 'italic' }}>your</em> pace.
      </>
    ),
    body: 'Cameroon-built learning that sticks — certificates when you finish the work.',
    ctaLabel: 'Start learning',
    secondaryLabel: 'Browse courses',
    secondaryHref: '/courses',
  },
];

export default function HomeHero() {
  return <HeroCarousel slides={HERO_SLIDES} />;
}
