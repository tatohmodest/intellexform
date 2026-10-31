/** Lightweight tutorial links for client nav - no lesson content imports. */
export const TUTORIAL_NAV = [
  { href: '/tutorials/computer-architecture', label: 'Computer Architecture', tag: 'CS Foundations' },
  { href: '/tutorials/html', label: 'HTML', tag: 'Frontend' },
  { href: '/tutorials/css', label: 'CSS', tag: 'Frontend' },
  { href: '/tutorials/javascript', label: 'JavaScript', tag: 'Frontend' },
  { href: '/tutorials/react', label: 'React', tag: 'Frontend' },
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
  { href: '/tutorials/kubernetes', label: 'Kubernetes', tag: 'DevOps' },
  { href: '/tutorials/linux-administration', label: 'Linux Administration', tag: 'DevOps' },
  { href: '/tutorials/bash-scripting', label: 'Bash Scripting', tag: 'DevOps' },
  { href: '/tutorials/flutter', label: 'Flutter', tag: 'Mobile' },
  { href: '/tutorials/data-analysis', label: 'Data Analysis', tag: 'Data' },
  { href: '/tutorials/digital-marketing', label: 'Digital Marketing', tag: 'Marketing' },
  { href: '/tutorials/microsoft-suite', label: 'Microsoft 365', tag: 'Productivity' },
  { href: '/tutorials/pygame', label: 'Pygame', tag: 'Game Dev' },
  { href: '/tutorials/cpp', label: 'C++', tag: 'Systems' },
  { href: '/tutorials/java', label: 'Java', tag: 'Backend' },
  { href: '/tutorials/rust', label: 'Rust', tag: 'Systems' },
  { href: '/tutorials/ruby-on-rails', label: 'Ruby on Rails', tag: 'Full-stack' },
  { href: '/tutorials/arduino', label: 'Arduino', tag: 'Embedded' },
] as const;

export const PROGRAMMES_NAV = [
  { href: '/programmes?category=software', label: 'Software Development', desc: 'Web, backend and mobile' },
  { href: '/programmes?category=data', label: 'Data & AI', desc: 'Analysis and visualisation' },
  { href: '/programmes?category=security', label: 'Cybersecurity', desc: 'Fundamentals and CEH prep' },
  { href: '/programmes?category=foundations', label: 'Foundations', desc: 'Short starter programmes' },
  { href: '/#how-it-works', label: 'How enrolment works', desc: 'Choose, enrol, pay, learn' },
] as const;

export const LEARN_NAV = [
  { href: '/courses', label: 'Self-paced library', desc: 'Recorded courses to study alone' },
  { href: '/tutorials', label: 'Free tutorials', desc: 'Step-by-step learning paths' },
  { href: '/books', label: 'Books', desc: 'AI-guided book learning' },
  { href: '/certifications', label: 'Certificates', desc: 'Certification tracks' },
  { href: '/resources', label: 'Free resources', desc: 'Guides and checklists' },
  { href: '/membership', label: 'Library membership', desc: '1,999 XAF/mo · library & AI Tutor' },
] as const;

export const EXPLORE_NAV = [
  { href: '/about', label: 'About InTelleX', desc: 'Who we are · Looping Binary' },
  { href: '/junior-dev', label: 'Junior Dev', desc: 'Community tournaments' },
  { href: '/internships', label: 'Internships', desc: 'Real-world experience' },
  { href: '/enterprise', label: 'For institutions', desc: 'InTelleX for schools and campuses' },
  { href: '/ecosystem', label: 'Ecosystem', desc: 'How everything fits together' },
  { href: '/contact', label: 'Contact us', desc: 'Learners, instructors & institutions' },
] as const;
