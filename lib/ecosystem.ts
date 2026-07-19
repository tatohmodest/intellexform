export type EcosystemItem = {
  slug: string;
  href: string;
  tab: string;
  title: string;
  short: string;
  body: string;
  image: string;
  alt: string;
  bullets: string[];
  primaryCta: { label: string; href: string; external?: boolean };
  secondaryCta?: { label: string; href: string; external?: boolean };
};

export const ECOSYSTEM: EcosystemItem[] = [
  {
    slug: 'certifications',
    href: '/certifications',
    tab: 'Certifications',
    title: 'Finish the work. Earn the certificate.',
    short: 'Proof you completed the course — not a participation trophy.',
    body: 'Every Intellex course you finish comes with a certificate of completion. It records the skill path you actually worked through, so you can show employers, mentors, or your next opportunity what you put in.',
    image: '/eco_cert.webp',
    alt: 'Certificate and achievement badges illustration',
    bullets: [
      'Certificate after each completed course',
      'Tied to real coursework, not just signup',
      'CEH and other certification-prep tracks available in the catalogue',
    ],
    primaryCta: { label: 'Browse courses', href: '/courses' },
    secondaryCta: { label: 'Join Intellex', href: '/register' },
  },
  {
    slug: 'internships',
    href: '/internships',
    tab: 'Internships',
    title: 'Turn skills into real Looping Binary work.',
    short: 'Internships that put what you learn into production.',
    body: 'Looping Binary runs internship programs where you ship client and product work — web, data, and cybersecurity — alongside mentors who build for a living. Intellex gets you ready; the internship lets you prove it.',
    image: '/eco_intern.webp',
    alt: 'Internship career path and briefcase illustration',
    bullets: [
      'Hands-on projects with Looping Binary teams',
      'Mentorship from people shipping real software',
      'A natural next step after Intellex courses',
    ],
    primaryCta: {
      label: 'Explore internships',
      href: 'https://intern.loopingbinary.com',
      external: true,
    },
    secondaryCta: { label: 'Build skills first', href: '/courses' },
  },
  {
    slug: 'junior-dev',
    href: '/junior-dev',
    tab: 'Junior Dev',
    title: 'Compete. Level up. Earn your Intellex edge.',
    short: "Tournaments and tiers from Looping Binary's Junior Dev.",
    body: "Junior Dev is Looping Binary's competitive learning arena — tournaments, tiers, and accountability that keep you shipping. Builder tier and above already includes Intellex course access, and tournament champions get 30% off their first Intellex plan.",
    image: '/eco_junior.webp',
    alt: 'Tournament trophy and coding competition illustration',
    bullets: [
      'Tournaments that push you to ship',
      'Builder tier+ includes Intellex access',
      'Champions earn 30% off their first Intellex plan',
    ],
    primaryCta: {
      label: 'Go to Junior Dev',
      href: 'https://juniordev.loopingbinary.com',
      external: true,
    },
    secondaryCta: { label: 'Claim my Intellex plan', href: '/register' },
  },
  {
    slug: 'books',
    href: '/books',
    tab: 'Books',
    title: 'Free Amazon books. Subscribe when you want more.',
    short: "Start with free titles — unlock the fuller library when you're ready.",
    body: 'We share Amazon book picks so you can start reading without friction. Browse free recommendations first; subscribe when you want the expanded list, curated paths, and titles that pair with Intellex courses and the AI Tutor.',
    image: '/eco_books.webp',
    alt: 'Stack of books and open reading illustration',
    bullets: [
      'Free book picks to get you started',
      'Subscribe for the fuller curated list',
      'Pairs with AI Tutor book-trained learning',
    ],
    primaryCta: { label: 'Join to unlock more', href: '/register' },
    secondaryCta: { label: 'See AI Tutor', href: '/#ai' },
  },
  {
    slug: 'resources',
    href: '/resources',
    tab: 'Free resources',
    title: 'Guides, checklists, and tools — free to use.',
    short: 'Practical resources that help you keep moving when you get stuck.',
    body: "From step-by-step checklists to starter guides and downloadable helpers, our free resources exist so learning doesn't stall. Use them alongside self-paced courses, live mentoring, or the AI Tutor.",
    image: '/eco_resources.webp',
    alt: 'Free learning resources and downloads illustration',
    bullets: [
      'Checklists and guides for every stage',
      'Downloadable helpers you can keep',
      'Built to complement Intellex courses',
    ],
    primaryCta: { label: 'Get started free', href: '/register' },
    secondaryCta: { label: 'Browse courses', href: '/courses' },
  },
  {
    slug: 'learning',
    href: '/learning',
    tab: 'Learning environment',
    title: 'Your online classroom, without the chaos.',
    short: 'A focused learning environment for courses, progress, and follow-through.',
    body: 'Intellex is built as an online learning environment — courses, progress, certificates, and the paths that connect self-paced study, live mentors, and AI tutoring. Learn from anywhere in Cameroon and beyond, at a pace that actually sticks.',
    image: '/eco_learning.webp',
    alt: 'Online learning dashboard and course modules illustration',
    bullets: [
      'Self-paced, live, and AI paths in one place',
      'Progress you can see — and finish',
      'Mobile-friendly access wherever you are',
    ],
    primaryCta: { label: 'Enter Intellex', href: '/register' },
    secondaryCta: { label: 'How learning works', href: '/#learn' },
  },
];

export function getEcosystem(slug: string) {
  return ECOSYSTEM.find((e) => e.slug === slug);
}

export const LOOPING_BINARY = {
  home: 'https://loopingbinary.com',
  intern: 'https://intern.loopingbinary.com',
  juniorDev: 'https://juniordev.loopingbinary.com',
};
