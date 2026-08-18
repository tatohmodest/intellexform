/**
 * Curated YouTube tutorial library - hand-picked, high-quality, free video
 * courses that complement the Intellex tracks. Embedded with youtube-nocookie.
 */

export type VideoLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type VideoSource = 'curated' | 'admin' | 'search';

export interface VideoTutorial {
  id: string;
  /** YouTube video id. */
  youtubeId: string;
  title: string;
  channel: string;
  category: string;
  duration: string;
  level: VideoLevel;
  description: string;
  source?: VideoSource;
}

export const VIDEO_CATEGORIES = [
  'All',
  'Web Development',
  'Python',
  'JavaScript',
  'Backend',
  'Databases',
  'DevOps',
  'Data & AI',
  'Mobile',
  'Digital Marketing',
  'Video Editing',
  'Design',
  'Product & No-Code',
  'Career',
] as const;

export const VIDEO_TUTORIALS: VideoTutorial[] = [
  {
    id: 'html-full',
    youtubeId: 'kUMe1FH4CHE',
    title: 'HTML Full Course for Beginners',
    channel: 'freeCodeCamp',
    category: 'Web Development',
    duration: '4h',
    level: 'Beginner',
    description: 'Everything you need to write your first real web pages - elements, forms, semantic HTML and accessibility.',
  },
  {
    id: 'css-full',
    youtubeId: 'OXGznpKZ_sA',
    title: 'CSS Full Course - Zero to Hero',
    channel: 'freeCodeCamp',
    category: 'Web Development',
    duration: '11h',
    level: 'Beginner',
    description: 'Selectors, flexbox, grid, animations and responsive design in one deep course.',
  },
  {
    id: 'js-full',
    youtubeId: 'PkZNo7MFNFg',
    title: 'Learn JavaScript - Full Course for Beginners',
    channel: 'freeCodeCamp',
    category: 'JavaScript',
    duration: '3.5h',
    level: 'Beginner',
    description: 'The classic JavaScript foundation course - variables, functions, objects, arrays and ES6.',
  },
  {
    id: 'js-dom',
    youtubeId: '5fb2aPlgoys',
    title: 'JavaScript DOM Manipulation',
    channel: 'freeCodeCamp',
    category: 'JavaScript',
    duration: '2h',
    level: 'Intermediate',
    description: 'Make pages interactive: selecting elements, events, and building small UI widgets from scratch.',
  },
  {
    id: 'react-course',
    youtubeId: 'bMknfKXIFA8',
    title: 'React Course - Beginner Tutorial',
    channel: 'freeCodeCamp',
    category: 'Web Development',
    duration: '12h',
    level: 'Intermediate',
    description: 'Components, props, state, hooks and building complete React projects.',
  },
  {
    id: 'nextjs-course',
    youtubeId: 'ZVnjOPwW4ZA',
    title: 'Next.js Full Course',
    channel: 'JavaScript Mastery',
    category: 'Web Development',
    duration: '5h',
    level: 'Intermediate',
    description: 'App router, server components, API routes and deploying a production Next.js app.',
  },
  {
    id: 'python-full',
    youtubeId: 'rfscVS0vtbw',
    title: 'Learn Python - Full Course for Beginners',
    channel: 'freeCodeCamp',
    category: 'Python',
    duration: '4.5h',
    level: 'Beginner',
    description: 'The most-watched Python course on the internet - syntax, functions, and your first programs.',
  },
  {
    id: 'python-oop',
    youtubeId: 'Ej_02ICOIgs',
    title: 'Object Oriented Programming with Python',
    channel: 'freeCodeCamp',
    category: 'Python',
    duration: '2h',
    level: 'Intermediate',
    description: 'Classes, inheritance, and designing clean Python programs the OOP way.',
  },
  {
    id: 'node-express',
    youtubeId: 'Oe421EPjeBE',
    title: 'Node.js and Express.js - Full Course',
    channel: 'freeCodeCamp',
    category: 'Backend',
    duration: '8h',
    level: 'Intermediate',
    description: 'Build real REST APIs with Node and Express - routing, middleware, MongoDB and deployment.',
  },
  {
    id: 'django-course',
    youtubeId: 'F5mRW0jo-U4',
    title: 'Python Django Web Framework',
    channel: 'freeCodeCamp',
    category: 'Backend',
    duration: '4h',
    level: 'Intermediate',
    description: 'Full Django walkthrough: models, views, templates, admin and a complete project.',
  },
  {
    id: 'sql-course',
    youtubeId: 'HXV3zeQKqGY',
    title: 'SQL Tutorial - Full Database Course',
    channel: 'freeCodeCamp',
    category: 'Databases',
    duration: '4h',
    level: 'Beginner',
    description: 'Relational databases from scratch - queries, joins, keys and database design.',
  },
  {
    id: 'mongodb-course',
    youtubeId: 'c2M-rlkkT5o',
    title: 'MongoDB Full Course',
    channel: 'Bro Code',
    category: 'Databases',
    duration: '1h',
    level: 'Beginner',
    description: 'Documents, collections, CRUD and aggregation - NoSQL fundamentals fast.',
  },
  {
    id: 'docker-course',
    youtubeId: 'fqMOX6JJhGo',
    title: 'Docker Tutorial for Beginners',
    channel: 'freeCodeCamp',
    category: 'DevOps',
    duration: '2h',
    level: 'Beginner',
    description: 'Containers explained properly - images, volumes, networks and docker-compose.',
  },
  {
    id: 'git-course',
    youtubeId: 'RGOj5yH7evk',
    title: 'Git and GitHub for Beginners',
    channel: 'freeCodeCamp',
    category: 'DevOps',
    duration: '1h',
    level: 'Beginner',
    description: 'Version control every developer must know - commits, branches, merges and pull requests.',
  },
  {
    id: 'ml-course',
    youtubeId: 'i_LwzRVP7bg',
    title: 'Machine Learning for Everybody',
    channel: 'freeCodeCamp',
    category: 'Data & AI',
    duration: '4h',
    level: 'Intermediate',
    description: 'A practical, code-first introduction to machine learning with Python.',
  },
  {
    id: 'data-analysis',
    youtubeId: 'r-uOLxNrNk8',
    title: 'Data Analysis with Python',
    channel: 'freeCodeCamp',
    category: 'Data & AI',
    duration: '10h',
    level: 'Intermediate',
    description: 'NumPy, pandas, visualization and real datasets - the full data analysis toolkit.',
  },
  {
    id: 'flutter-course',
    youtubeId: 'VPvVD8t02U8',
    title: 'Flutter Course for Beginners',
    channel: 'freeCodeCamp',
    category: 'Mobile',
    duration: '37h',
    level: 'Beginner',
    description: 'A complete journey to building cross-platform mobile apps with Flutter and Dart.',
  },
  {
    id: 'coding-interview',
    youtubeId: '8hly31xKli0',
    title: 'Algorithms and Data Structures Crash Course',
    channel: 'freeCodeCamp',
    category: 'Career',
    duration: '5h',
    level: 'Intermediate',
    description: 'The data structures and algorithms you need for technical interviews.',
  },
  {
    id: 'digital-marketing-full',
    youtubeId: 'bixR-KIJKYM',
    title: 'Digital Marketing Course',
    channel: 'Simplilearn',
    category: 'Digital Marketing',
    duration: '11h',
    level: 'Beginner',
    description: 'SEO, SEM, social, email, and content marketing fundamentals for builders and brands.',
  },
  {
    id: 'seo-full',
    youtubeId: 'xsVTqzuit1o',
    title: 'SEO Full Course for Beginners',
    channel: 'Ahrefs',
    category: 'Digital Marketing',
    duration: '3h',
    level: 'Beginner',
    description: 'How search engines work, keyword research, on-page SEO, and building pages that rank.',
  },
  {
    id: 'social-media-marketing',
    youtubeId: 'FRiFS1kTwUY',
    title: 'Social Media Marketing Full Course',
    channel: 'Simplilearn',
    category: 'Digital Marketing',
    duration: '5h',
    level: 'Beginner',
    description: 'Platform strategy, content calendars, ads basics, and measuring what works.',
  },
  {
    id: 'premiere-pro',
    youtubeId: 'f6cH-JzZw4s',
    title: 'Premiere Pro Full Course for Beginners',
    channel: 'Envato Tuts+',
    category: 'Video Editing',
    duration: '4h',
    level: 'Beginner',
    description: 'Cut, grade, and export videos for YouTube, courses, and client work in Premiere Pro.',
  },
  {
    id: 'davinci-resolve',
    youtubeId: 'y3klHU63xT0',
    title: 'DaVinci Resolve Beginner Tutorial',
    channel: 'Casey Faris',
    category: 'Video Editing',
    duration: '2h',
    level: 'Beginner',
    description: 'Free-pro editing: timeline, color, audio, and delivering polished cuts.',
  },
  {
    id: 'capcut-editing',
    youtubeId: 'o_XVt5rdpFY',
    title: 'CapCut Editing for Creators',
    channel: 'CapCut Tutorials',
    category: 'Video Editing',
    duration: '1h',
    level: 'Beginner',
    description: 'Fast social edits, captions, effects, and exports for Reels, TikTok, and Shorts.',
  },
  {
    id: 'figma-ui',
    youtubeId: 'FTFaQWZBqQ8',
    title: 'Figma UI Design Tutorial',
    channel: 'freeCodeCamp',
    category: 'Design',
    duration: '4h',
    level: 'Beginner',
    description: 'Interface design, components, auto-layout, and shipping a portfolio-ready UI kit.',
  },
  {
    id: 'graphic-design',
    youtubeId: 'WONZVnlam6U',
    title: 'Graphic Design Full Course',
    channel: 'Envato Tuts+',
    category: 'Design',
    duration: '7h',
    level: 'Beginner',
    description: 'Typography, color, layout, and brand basics for digital creatives.',
  },
  {
    id: 'canva-design',
    youtubeId: 'yqwHxAM1z5I',
    title: 'Canva for Beginners',
    channel: 'Canva',
    category: 'Design',
    duration: '1.5h',
    level: 'Beginner',
    description: 'Brand kits, social creatives, presentations, and fast visual systems without Photoshop.',
  },
  {
    id: 'notion-product',
    youtubeId: 'O_9J1WEgQJY',
    title: 'Notion for Productivity & Product Ops',
    channel: 'Notion',
    category: 'Product & No-Code',
    duration: '2h',
    level: 'Beginner',
    description: 'Databases, docs, and workflows to run learning projects and small teams.',
  },
  {
    id: 'no-code-webflow',
    youtubeId: 'HYme9dJZVuM',
    title: 'Webflow Crash Course',
    channel: 'Webflow',
    category: 'Product & No-Code',
    duration: '3h',
    level: 'Intermediate',
    description: 'Ship marketing sites and product landing pages without writing every line by hand.',
  },
  {
    id: 'excel-data',
    youtubeId: 'Vl0H-qTclOg',
    title: 'Excel for Data Analysis',
    channel: 'freeCodeCamp',
    category: 'Data & AI',
    duration: '4h',
    level: 'Beginner',
    description: 'Spreadsheets, pivots, charts, and analysis skills every digital professional needs.',
  },
];

const YT_ID = /^[a-zA-Z0-9_-]{11}$/;

export function isYoutubeId(value: string): boolean {
  return YT_ID.test(value);
}

export function extractYoutubeId(input: string): string | null {
  const s = String(input || '').trim();
  if (!s) return null;
  if (YT_ID.test(s)) return s;
  try {
    const u = new URL(s);
    const host = u.hostname.replace(/^www\./, '');
    if (host === 'youtu.be') {
      const id = u.pathname.replace(/^\//, '').slice(0, 11);
      return YT_ID.test(id) ? id : null;
    }
    if (host.endsWith('youtube.com') || host.endsWith('youtube-nocookie.com')) {
      const v = u.searchParams.get('v');
      if (v && YT_ID.test(v)) return v;
      const embed = u.pathname.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
      if (embed) return embed[1];
      const shorts = u.pathname.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
      if (shorts) return shorts[1];
      const live = u.pathname.match(/\/live\/([a-zA-Z0-9_-]{11})/);
      if (live) return live[1];
    }
  } catch {
    /* not a URL */
  }
  return null;
}


