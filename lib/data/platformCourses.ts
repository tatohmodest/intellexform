import { Course } from '@/lib/types';

const now = '2026-01-01';

function base(overrides: Partial<Course> & { id: string; name: string }): Course {
  return {
    slug: overrides.id,
    instructor: 'Intellex Mentors',
    courseDetails: '',
    prerequisites: 'No prior experience required',
    whatYouWillLearn: [],
    type: 'Web Development',
    originalPrice: 0,
    currentPrice: 0,
    aboutInstructor:
      'Taught by the Intellex mentor team — working developers and designers from the Looping Binary studio.',
    courseRating: 4.9,
    courseNumberOfVotes: 360,
    courseOrigin: 'Intellex',
    courseDuration: 'Self-paced',
    language: 'English',
    bestSeller: true,
    shortDescription: '',
    courseImage: '',
    certificateOfCompletion: true,
    accessOnMobileAndTV: true,
    downloadable: true,
    articleType: 'Video',
    instructorRating: 4.9,
    courseLink: null,
    featured: true,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

/**
 * The platform's own highlighted programs (from the Intellex landing design).
 * Prices are in XAF. These are marked `featured` so they surface first on the
 * landing page and courses catalogue.
 */
export const PLATFORM_COURSES: Course[] = [
  base({
    id: 'fullstack-web-development',
    name: 'Full-Stack Web Development',
    type: 'Web Development',
    originalPrice: 14999,
    currentPrice: 9999,
    courseDuration: '9 modules',
    shortDescription:
      'Go from static pages to full apps with a database and a live backend — the complete path, not a fragment of it.',
    courseDetails:
      'The complete journey from zero to full-stack developer: master the frontend, the backend, databases, authentication, APIs and deployment while building real, deployable web applications.',
    prerequisites: 'No prior experience required',
    whatYouWillLearn: [
      'HTML, CSS and modern JavaScript',
      'React and Next.js for the frontend',
      'Node.js, Express and REST APIs',
      'Databases with MongoDB and PostgreSQL',
      'Authentication, deployment and Git',
    ],
    bestSeller: true,
  }),
  base({
    id: 'python-from-zero',
    name: 'Python, from Zero',
    type: 'Programming',
    originalPrice: 9999,
    currentPrice: 6999,
    courseDuration: '7 modules',
    shortDescription:
      'The most requested starting point on Intellex. Clean fundamentals now, so Data Science or automation later isn\u2019t starting over.',
    courseDetails:
      'Learn to program with Python the right way — from variables and control flow to functions, OOP, files and automation — a foundation you can take into Data Science, AI or web development.',
    whatYouWillLearn: [
      'Python syntax and data types',
      'Control flow, loops and functions',
      'Object-oriented programming',
      'Working with files and APIs',
      'Scripting and automation projects',
    ],
  }),
  base({
    id: 'data-analysis-data-science',
    name: 'Data Analysis & Data Science',
    type: 'Data Science',
    originalPrice: 12999,
    currentPrice: 8999,
    courseDuration: '8 modules',
    shortDescription:
      'Clean data, find the story in it, present it well. The skill every field is quietly hiring for right now.',
    courseDetails:
      'Turn raw data into insight: master Python analytics, SQL querying, statistics and interactive dashboards used by companies worldwide, then build a portfolio of real data projects.',
    whatYouWillLearn: [
      'Pandas and NumPy for analysis',
      'Data visualization and dashboards',
      'SQL for business intelligence',
      'Statistics and hypothesis testing',
      'End-to-end data projects',
    ],
  }),
  base({
    id: 'web-dev-fundamentals',
    name: 'Web Dev Fundamentals',
    type: 'Web Development',
    originalPrice: 7999,
    currentPrice: 4999,
    courseDuration: '5 modules',
    shortDescription: 'HTML, CSS and how the web actually works, before any framework.',
    courseDetails:
      'Your very first step into web development: build real, responsive websites with HTML and CSS and understand how the web works before touching a framework.',
    bestSeller: false,
    whatYouWillLearn: ['HTML5 fundamentals', 'CSS3 and layouts', 'Flexbox and Grid', 'Responsive design'],
  }),
  base({
    id: 'javascript',
    name: 'JavaScript',
    type: 'Web Development',
    originalPrice: 8999,
    currentPrice: 5999,
    courseDuration: '6 modules',
    shortDescription: 'The language the entire web runs on — and half of Full-Stack too.',
    courseDetails:
      'Deep-dive into the language that powers the web: from fundamentals to closures, async/await and modern ES6+, with a mini project in every module.',
    whatYouWillLearn: ['Modern ES6+ JavaScript', 'DOM manipulation', 'Async and promises', 'Fetch and APIs'],
  }),
  base({
    id: 'java',
    name: 'Java',
    type: 'Programming',
    originalPrice: 9999,
    currentPrice: 6999,
    courseDuration: '7 modules',
    shortDescription: 'Strict, structured, and still the backbone of enterprise software.',
    courseDetails:
      'Learn Java the structured way: object-oriented design, collections, exceptions and the fundamentals that power enterprise systems.',
    whatYouWillLearn: ['Java syntax and OOP', 'Collections and generics', 'Exceptions and files', 'Building console apps'],
  }),
  base({
    id: 'mern-stack',
    name: 'MERN Stack',
    type: 'Web Development',
    originalPrice: 12999,
    currentPrice: 8999,
    courseDuration: '8 modules',
    shortDescription: 'MongoDB, Express, React, Node — one JavaScript stack, start to finish.',
    courseDetails:
      'Build modern, scalable apps end-to-end with the MERN stack: MongoDB, Express, React and Node.js, plus authentication and deployment.',
    whatYouWillLearn: ['React frontends', 'Express and Node APIs', 'MongoDB and Mongoose', 'JWT authentication'],
  }),
  base({
    id: 'pern-stack',
    name: 'PERN Stack',
    type: 'Web Development',
    originalPrice: 12999,
    currentPrice: 8999,
    courseDuration: '8 modules',
    shortDescription: 'Same idea as MERN, swapped to PostgreSQL for relational data.',
    courseDetails:
      'Build data-driven applications with PostgreSQL, Express, React and Node.js — master relational data modelling and advanced SQL.',
    whatYouWillLearn: ['Relational database design', 'Advanced SQL', 'Express and Node APIs', 'React frontends'],
  }),
  base({
    id: 'machine-learning',
    name: 'Machine Learning',
    type: 'Machine Learning',
    originalPrice: 14999,
    currentPrice: 9999,
    courseDuration: '9 modules',
    shortDescription: 'Where the models come from, not just how to call an API for one.',
    courseDetails:
      'Understand machine learning from the ground up: regression, classification, model evaluation and the maths behind the models — not just calling an API.',
    whatYouWillLearn: ['Supervised learning', 'Model evaluation', 'Scikit-learn', 'Practical ML projects'],
  }),
  base({
    id: 'cybersecurity',
    name: 'Cybersecurity',
    type: 'Cybersecurity',
    originalPrice: 12999,
    currentPrice: 8499,
    courseDuration: '8 modules',
    shortDescription: 'Think like an attacker first, so you know exactly what you\u2019re defending.',
    courseDetails:
      'Master ethical hacking, network security and digital defense: learn to think like an attacker so you can defend like a pro, with hands-on Kali Linux labs.',
    whatYouWillLearn: ['Network security', 'Ethical hacking basics', 'OWASP Top 10', 'Hands-on Kali Linux labs'],
  }),
  base({
    id: 'digital-marketing',
    name: 'Digital Marketing',
    type: 'Marketing',
    originalPrice: 7999,
    currentPrice: 5499,
    courseDuration: '6 modules',
    shortDescription: 'Get a product in front of the right people, on a real budget.',
    courseDetails:
      'Learn to grow a product with real, measurable marketing: content, social, ads and analytics — on a budget that makes sense.',
    bestSeller: false,
    whatYouWillLearn: ['Content and social strategy', 'Paid ads basics', 'SEO fundamentals', 'Analytics and funnels'],
  }),
  base({
    id: 'branding',
    name: 'Branding',
    type: 'Design',
    originalPrice: 7999,
    currentPrice: 4999,
    courseDuration: '5 modules',
    shortDescription: 'Build something that looks like it belongs in the market you\u2019re entering.',
    courseDetails:
      'Design a brand that looks like it belongs: identity, typography, colour and voice that make a product feel real and trustworthy.',
    bestSeller: false,
    whatYouWillLearn: ['Brand identity', 'Typography and colour', 'Logo systems', 'Brand voice'],
  }),
  base({
    id: 'fullstack-3-weeks-ai',
    name: 'Special Program — Build a Full-Stack App in 3 Weeks (AI-assisted)',
    type: 'Special Program',
    originalPrice: 200000,
    currentPrice: 150000,
    courseDuration: '3 weeks · cohort',
    courseOrigin: 'Intellex',
    bestSeller: true,
    shortDescription:
      'Ship a working, deployed full-stack application in three weeks, coding alongside Claude Code & Cursor AI the way working developers do.',
    courseDetails:
      'Not a theory course. In a small, live-guided cohort you ship a working, deployed full-stack application in three weeks, using AI coding tools (Claude Code & Cursor) as a pair-programmer, not a crutch. Week 1: frontend & app structure. Week 2: backend, database and auth. Week 3: deploy, polish and ship a portfolio project.',
    prerequisites: 'Basic web development familiarity recommended',
    whatYouWillLearn: [
      'Frontend & app structure, AI-assisted',
      'Backend, database and auth with Cursor / Claude Code',
      'Deploying a real full-stack application',
      'Working with AI coding tools like a professional',
      'Shipping a portfolio-ready project',
    ],
  }),
];
