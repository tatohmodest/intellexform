'use client';

import HeroCarousel, { type HeroSlide } from '@/components/landing/HeroCarousel';
import { useT } from '@/components/i18n/I18nRoot';

/** Learner-first hero - institution / EduOS marketing lives on /enterprise. */
export default function HomeHero() {
  const t = useT();
  const slides: HeroSlide[] = [
    {
      id: 'learn',
      image: '/hero_illustration.webp',
      alt: t('InTelleX learning platform'),
      headline: (
        <>
          {t('Learn skills that')}{' '}
          <em className="not-italic text-green-deep" style={{ fontStyle: 'italic' }}>
            {t('actually ship.')}
          </em>
        </>
      ),
      body: t(
        'Self-paced courses, live mentors, and an AI Tutor on one account - so you finish what you start.',
      ),
      ctaLabel: t('Start learning'),
      ctaHref: '/signup',
      secondaryLabel: t('Browse courses'),
      secondaryHref: '/courses',
    },
    {
      id: 'career',
      image: '/hero_career.webp',
      alt: t('Career-ready skills'),
      headline: (
        <>
          {t('From first lesson to')}{' '}
          <em className="not-italic text-green-deep" style={{ fontStyle: 'italic' }}>
            {t('certificate')}
          </em>
          .
        </>
      ),
      body: t('Web, data, design, marketing, and more - priced for students, built to help you complete.'),
      ctaLabel: t('See pricing'),
      ctaHref: '/#pricing',
      secondaryLabel: t('Student tutorials'),
      secondaryHref: '/tutorials',
    },
    {
      id: 'mentor',
      image: '/hero_mentor.webp',
      alt: t('Mentor guiding a student in a live tutoring session'),
      headline: (
        <>
          {t('Sometimes you need a')}{' '}
          <em className="not-italic text-green-deep" style={{ fontStyle: 'italic' }}>
            {t('person')}
          </em>
          {t(', not a playlist.')}
        </>
      ),
      body: t(
        'Live tutoring online or onsite - mentors are approved, accountable, and priced for real guidance.',
      ),
      ctaLabel: t('Contact us'),
      ctaHref: '/contact?type=mentorship',
      secondaryLabel: t('Ways to learn'),
      secondaryHref: '/#learn',
    },
    {
      id: 'ai',
      image: '/hero_ai.webp',
      alt: t('Student learning with an AI tutor'),
      headline: (
        <>
          {t('An AI that knows')}{' '}
          <em className="not-italic text-green-deep" style={{ fontStyle: 'italic' }}>
            InTelleX
          </em>{' '}
          {t('- and your next lesson.')}
        </>
      ),
      body: t(
        'Grounded in free tutorials and the live catalogue - ask about a skill, a course, or what to learn next.',
      ),
      ctaLabel: t('Try AI Tutor'),
      ctaHref: '/signup',
      secondaryLabel: t('Browse courses'),
      secondaryHref: '/courses',
    },
  ];

  return <HeroCarousel slides={slides} />;
}
