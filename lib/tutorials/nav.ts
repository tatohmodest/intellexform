/** Lightweight tutorial links for client nav — no lesson content imports. */
export const TUTORIAL_NAV = [
  { href: '/tutorials/javascript', label: 'JavaScript', tag: 'Frontend' },
  { href: '/tutorials/nextjs', label: 'Next.js', tag: 'Full-stack' },
  { href: '/tutorials/nodejs-express', label: 'Node.js & Express', tag: 'Backend' },
  { href: '/tutorials/nestjs', label: 'NestJS', tag: 'Backend' },
  { href: '/tutorials/python', label: 'Python', tag: 'Programming' },
  { href: '/tutorials/django', label: 'Django', tag: 'Backend' },
  { href: '/tutorials/flask', label: 'Flask', tag: 'Backend' },
  { href: '/tutorials/golang', label: 'Go (Golang)', tag: 'Programming' },
  { href: '/tutorials/postgresql', label: 'PostgreSQL', tag: 'Database' },
  { href: '/tutorials/mongodb', label: 'MongoDB', tag: 'Database' },
  { href: '/tutorials/docker', label: 'Docker', tag: 'DevOps' },
  { href: '/tutorials/flutter', label: 'Flutter', tag: 'Mobile' },
  { href: '/tutorials/data-analysis', label: 'Data Analysis', tag: 'Data' },
  { href: '/tutorials/digital-marketing', label: 'Digital Marketing', tag: 'Marketing' },
] as const;

export const LEARN_NAV = [
  { href: '/courses', label: 'All courses', desc: 'Browse the full catalogue' },
  { href: '/tutorials', label: 'Free tutorials', desc: 'Step-by-step learning paths' },
  { href: '/certifications', label: 'Certificates', desc: 'Certification tracks' },
  { href: '/junior-dev', label: 'Junior Dev', desc: 'Career pathway program' },
  { href: '/#learn', label: 'Ways to learn', desc: 'Self-paced, live, AI tutor' },
  { href: '/#pricing', label: 'Pricing', desc: 'Plans that fit your pace' },
] as const;

export const EXPLORE_NAV = [
  { href: '/#ecosystem', label: 'Ecosystem', desc: 'How Intellex fits together' },
  { href: '/internships', label: 'Internships', desc: 'Real-world experience' },
  { href: '/books', label: 'Books', desc: 'AI-powered book learning' },
  { href: '/resources', label: 'Free resources', desc: 'Guides and checklists' },
  { href: '/learning', label: 'Learning environment', desc: 'Finish what you start' },
  { href: '/register', label: 'Register', desc: 'Join the platform' },
] as const;
