'use client';

import HeroCarousel, { type HeroSlide } from '@/components/landing/HeroCarousel';

/** Learner-first hero - institution / EduOS marketing lives on /enterprise. */
const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'learn',
    image: '/hero_illustration.webp',
    alt: 'InTelleX learning platform',
    headline: (
      <>
        Learn skills that{' '}
        <em className="not-italic text-green-deep" style={{ fontStyle: 'italic' }}>
          actually ship.
        </em>
      </>
    ),
    body: 'Self-paced courses, live mentors, and an AI Tutor on one account - so you finish what you start.',
    ctaLabel: 'Start learning',
    ctaHref: '/signup',
    secondaryLabel: 'Browse courses',
    secondaryHref: '/courses',
  },
  {
    id: 'career',
    image: '/hero_career.webp',
    alt: 'Career-ready skills',
    headline: (
      <>
        From first lesson to{' '}
        <em className="not-italic text-green-deep" style={{ fontStyle: 'italic' }}>
          certificate
        </em>
        .
      </>
    ),
    body: 'Web, data, design, marketing, and more - priced for students, built to help you complete.',
    ctaLabel: 'See pricing',
    ctaHref: '/#pricing',
    secondaryLabel: 'Free tutorials',
    secondaryHref: '/tutorials',
  },
  {
    id: 'mentor',
    image: '/hero_mentor.webp',
    alt: 'Mentor guiding a student in a live tutoring session',
    headline: (
      <>
        Sometimes you need a{' '}
        <em className="not-italic text-green-deep" style={{ fontStyle: 'italic' }}>
          person
        </em>
        , not a playlist.
      </>
    ),
    body: 'Live tutoring online or onsite - mentors are approved, accountable, and priced for real guidance.',
    ctaLabel: 'Contact us',
    ctaHref: '/contact?type=mentorship',
    secondaryLabel: 'Ways to learn',
    secondaryHref: '/#learn',
  },
  {
    id: 'ai',
    image: '/hero_ai.webp',
    alt: 'Student learning with an AI tutor',
    headline: (
      <>
        An AI that knows{' '}
        <em className="not-italic text-green-deep" style={{ fontStyle: 'italic' }}>
          InTelleX
        </em>{' '}
        - and your next lesson.
      </>
    ),
    body: 'Grounded in free tutorials and the live catalogue - ask about a skill, a course, or what to learn next.',
    ctaLabel: 'Try AI Tutor',
    ctaHref: '/signup',
    secondaryLabel: 'Browse courses',
    secondaryHref: '/courses',
  },
];

export default function HomeHero() {
  return <HeroCarousel slides={HERO_SLIDES} />;
}
