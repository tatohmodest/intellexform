'use client';

import HeroCarousel, { type HeroSlide } from '@/components/landing/HeroCarousel';

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'eduos',
    image: '/mockups/mockup-core-modules.webp',
    alt: 'InTelleX Core plus modular capabilities',
    headline: (
      <>
        Not another LMS.{' '}
        <em className="not-italic text-green-deep" style={{ fontStyle: 'italic' }}>
          An Education OS.
        </em>
      </>
    ),
    body: 'InTelleX is education infrastructure as a service. Every institution gets the Core. Capabilities unlock based on how you teach, learn, and grow.',
    ctaLabel: 'Enter InTelleX',
    secondaryLabel: 'See the OS',
    secondaryHref: '/#os',
  },
  {
    id: 'campus',
    image: '/mockups/mockup-phone-campus.webp',
    alt: 'Campus app on a phone mockup',
    headline: (
      <>
        Build your{' '}
        <em className="not-italic text-green-deep" style={{ fontStyle: 'italic' }}>
          digital campus
        </em>
        .
      </>
    ),
    body: 'Branded portal, students, teachers, calendar, announcements — then add video classes, AI, library, live teaching, and more when you are ready.',
    ctaLabel: 'Partner with us',
    ctaHref: '/network#partner',
    secondaryLabel: 'Capabilities',
    secondaryHref: '/#pricing',
  },
  {
    id: 'teach',
    image: '/mockups/mockup-dashboard-instructor.webp',
    alt: 'Instructor campus dashboard mockup',
    headline: (
      <>
        Instructors see only what the{' '}
        <em className="not-italic text-green-deep" style={{ fontStyle: 'italic' }}>
          campus owns
        </em>
        .
      </>
    ),
    body: 'Course studio, assessments, AI assistant, analytics — dashboards assemble from role, permissions, and enabled capabilities. No clutter.',
    ctaLabel: 'Explore teaching',
    secondaryLabel: 'How campuses work',
    secondaryHref: '/#os',
  },
  {
    id: 'ai',
    image: '/mockups/mockup-phone-student-ai.webp',
    alt: 'Student AI tutor on a phone mockup',
    headline: (
      <>
        Campus AI that{' '}
        <em className="not-italic text-green-deep" style={{ fontStyle: 'italic' }}>
          respects knowledge boundaries
        </em>
        .
      </>
    ),
    body: 'Private lecture notes stay private. Public InTelleX resources strengthen every learner. Institutions control what the AI may learn from.',
    ctaLabel: 'Try AI Tutor',
    ctaHref: '/signup',
    secondaryLabel: 'Browse courses',
    secondaryHref: '/courses',
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
    body: 'One learner identity across campuses, mentors, certificates, and careers — without a giant shared academic database.',
    ctaLabel: 'Explore the network',
    ctaHref: '/network',
    secondaryLabel: 'Ecosystem map',
    secondaryHref: '/ecosystem',
  },
];

export default function HomeHero() {
  return <HeroCarousel slides={HERO_SLIDES} />;
}
