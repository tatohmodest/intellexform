'use client';

import HeroCarousel, { type HeroSlide } from '@/components/landing/HeroCarousel';

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'eduos',
    image: '/hero_illustration.webp',
    alt: 'InTelleX Education Operating System',
    headline: (
      <>
        Not another LMS.{' '}
        <em className="not-italic text-green-deep" style={{ fontStyle: 'italic' }}>
          An Education OS.
        </em>
      </>
    ),
    body: 'InTelleX is the network schools plug into — identity, trust, courses, mentors, and AI.',
    ctaLabel: 'Enter InTelleX',
    secondaryLabel: 'See the ecosystem',
    secondaryHref: '/ecosystem',
  },
  {
    id: 'network',
    image: '/hero_career.webp',
    alt: 'Federated institution network',
    headline: (
      <>
        Schools own their data.{' '}
        <em className="not-italic text-green-deep" style={{ fontStyle: 'italic' }}>
          You own the network.
        </em>
      </>
    ),
    body: 'Federated campuses, verified institutions, one learner identity across the ecosystem.',
    ctaLabel: 'Explore the network',
    secondaryLabel: 'How governance works',
    secondaryHref: '/network',
  },
  {
    id: 'mentor',
    image: '/hero_mentor.webp',
    alt: 'Mentor guiding a student in a live tutoring session',
    headline: (
      <>
        Mentors and campuses are{' '}
        <em className="not-italic text-green-deep" style={{ fontStyle: 'italic' }}>
          approved
        </em>
        , not assumed.
      </>
    ),
    body: 'Live tutoring with accountability — privileges earned through review, not a toggle.',
    ctaLabel: 'Get a quote',
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
        </em>
        — and your catalogue.
      </>
    ),
    body: 'Grounded in free tutorials, Mongo courses, and how the platform actually works.',
    ctaLabel: 'Try AI Tutor',
    secondaryLabel: 'Browse courses',
    secondaryHref: '/courses',
  },
];

export default function HomeHero() {
  return <HeroCarousel slides={HERO_SLIDES} />;
}
