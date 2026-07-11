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

  // ── SPECIAL SELF-PACED TRACK ──────────────────────────────────────
  // Hand-picked, in-demand skills you can learn fast. Intellex selects the
  // course for you, monitors your progress and gives you step-by-step guides.
  // Prices start from 50,000 XAF.
  base({
    id: 'wordpress-website-in-a-weekend',
    name: 'WordPress Website in a Weekend',
    type: 'WordPress',
    selfPaced: true,
    currentPrice: 50000,
    originalPrice: 80000,
    courseDuration: '1 weekend · self-paced',
    shortDescription: 'Launch a real, professional WordPress website — no code — in a single weekend.',
    courseDetails:
      'A hand-picked, guided WordPress track: from hosting and themes to pages, plugins, forms and going live. We monitor your progress and hand you checklists so you actually ship a site, fast.',
    whatYouWillLearn: [
      'Set up hosting, domain and WordPress',
      'Design pages with a modern theme & builder',
      'Add plugins, forms and SEO basics',
      'Publish and maintain a live website',
    ],
  }),
  base({
    id: 'digital-marketing-fast-track',
    name: 'Digital Marketing Fast-Track',
    type: 'Marketing',
    selfPaced: true,
    currentPrice: 55000,
    originalPrice: 90000,
    courseDuration: '2 weeks · self-paced',
    shortDescription: 'Get a product in front of the right people — content, ads and analytics, fast.',
    courseDetails:
      'A curated, guided path through the digital marketing skills employers and founders want now: content, social, paid ads and measuring what works. Progress-monitored with weekly guides.',
    whatYouWillLearn: [
      'Content & social media strategy',
      'Run paid ads on a real budget',
      'SEO and funnels fundamentals',
      'Track results with analytics',
    ],
  }),
  base({
    id: 'web-fundamentals-guided',
    name: 'Web Fundamentals — Guided Track',
    type: 'Web Development',
    selfPaced: true,
    currentPrice: 50000,
    originalPrice: 75000,
    courseDuration: '2 weeks · self-paced',
    shortDescription: 'HTML, CSS and how the web works — hand-held, so you never get stuck.',
    courseDetails:
      'The fastest guided way into web development: build real, responsive pages with HTML and CSS. We pick the exact lessons for you, track your progress and unblock you with guides.',
    whatYouWillLearn: [
      'HTML5 structure & semantics',
      'CSS styling, Flexbox & Grid',
      'Responsive, mobile-first design',
      'Publish your first web pages',
    ],
  }),
  base({
    id: 'canva-brand-design',
    name: 'Canva & Brand Design',
    type: 'Design',
    selfPaced: true,
    currentPrice: 50000,
    originalPrice: 70000,
    courseDuration: '10 days · self-paced',
    shortDescription: 'Design logos, posts and brand kits people take seriously — using Canva.',
    courseDetails:
      'A guided design sprint: master Canva to produce a full brand kit — logo, colours, social templates and marketing graphics. Curated lessons with progress checks and feedback guides.',
    whatYouWillLearn: [
      'Canva from basics to pro',
      'Logo & brand identity design',
      'Social media & marketing templates',
      'Export-ready brand assets',
    ],
  }),
  base({
    id: 'excel-spreadsheets-mastery',
    name: 'Excel & Spreadsheets Mastery',
    type: 'Data',
    selfPaced: true,
    currentPrice: 55000,
    originalPrice: 85000,
    courseDuration: '2 weeks · self-paced',
    shortDescription: 'The spreadsheet skills every job quietly requires — formulas, charts, dashboards.',
    courseDetails:
      'A hand-picked, guided Excel/Google Sheets track that takes you from formulas to pivot tables and dashboards. We monitor progress and give you templates and cheat-sheets.',
    whatYouWillLearn: [
      'Core & advanced formulas',
      'Data cleaning and lookups',
      'Pivot tables and charts',
      'Build a real dashboard',
    ],
  }),
  base({
    id: 'ai-chatgpt-for-productivity',
    name: 'AI & ChatGPT for Productivity',
    type: 'Artificial Intelligence',
    selfPaced: true,
    currentPrice: 60000,
    originalPrice: 95000,
    courseDuration: '10 days · self-paced',
    shortDescription: 'Use ChatGPT and AI tools to work 10x faster — with real prompt engineering.',
    courseDetails:
      'A curated, guided crash course on using AI day-to-day: prompt engineering, automating tasks, writing, research and building simple AI workflows. Progress-monitored with prompt playbooks.',
    whatYouWillLearn: [
      'Practical prompt engineering',
      'Automate writing & research',
      'AI tools for real workflows',
      'Build simple AI-assisted tasks',
    ],
  }),
  base({
    id: 'shopify-ecommerce-store',
    name: 'Shopify E-commerce Store',
    type: 'E-commerce',
    selfPaced: true,
    currentPrice: 65000,
    originalPrice: 100000,
    courseDuration: '2 weeks · self-paced',
    shortDescription: 'Build and launch an online store that can actually take orders and payments.',
    courseDetails:
      'A guided path to launching a real Shopify store: products, payments, shipping, branding and your first marketing. We select the lessons and track you to launch day.',
    whatYouWillLearn: [
      'Set up a Shopify store',
      'Products, payments & shipping',
      'Store branding & theme',
      'Launch & first marketing',
    ],
  }),
  base({
    id: 'social-media-management',
    name: 'Social Media Management',
    type: 'Marketing',
    selfPaced: true,
    currentPrice: 55000,
    originalPrice: 85000,
    courseDuration: '2 weeks · self-paced',
    shortDescription: 'Grow and manage brand pages that gain followers and clients — a real, hireable skill.',
    courseDetails:
      'A curated, guided track to becoming a social media manager: content calendars, growth tactics, scheduling tools and reporting. Progress-monitored with templates and guides.',
    whatYouWillLearn: [
      'Content calendars & planning',
      'Growth & engagement tactics',
      'Scheduling & management tools',
      'Reporting to clients',
    ],
  }),
];

