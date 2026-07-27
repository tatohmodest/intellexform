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
    body: 'Courses, mentors, campuses, and AI on one trustworthy spine - so you actually finish what you start.',
    ctaLabel: 'Enter InTelleX',
    ctaHref: '/signup',
    secondaryLabel: 'See what you get',
    secondaryHref: '/#learn',
  },
  {
    id: 'network',
    image: '/hero_career.webp',
    alt: 'Federated institution network',
    headline: (
      <>
        Schools own their data.{' '}
        <em className="not-italic text-green-deep" style={{ fontStyle: 'italic' }}>
          InTelleX owns the network.
        </em>
      </>
    ),
    body: 'Federated campuses, verified institutions, and one learner identity - without a giant shared academic database.',
    ctaLabel: 'Explore the network',
    ctaHref: '/network',
    secondaryLabel: 'Contact us',
    secondaryHref: '/contact?type=institution',
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
    body: 'Grounded in free tutorials, the live catalogue, and how this Education OS actually works.',
    ctaLabel: 'Try AI Tutor',
    ctaHref: '/signup',
    secondaryLabel: 'Browse courses',
    secondaryHref: '/courses',
  },
];

export default function HomeHero() {
  return <HeroCarousel slides={HERO_SLIDES} />;
}
