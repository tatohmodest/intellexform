export type CurriculumTopic = { title: string; detail: string };

export type ProgrammeModule = {
  title: string;
  /** e.g. "Weeks 1-3" */
  weeks: string;
  summary: string;
  topics: CurriculumTopic[];
  /** What the learner builds or delivers at the end of the module. */
  project?: string;
};

type T = [string, string];

function mod(title: string, weeks: string, summary: string, topics: T[], project?: string): ProgrammeModule {
  return { title, weeks, summary, topics: topics.map(([t, d]) => ({ title: t, detail: d })), project };
}

export const PROGRAMME_CURRICULA: Record<string, ProgrammeModule[]> = {
  fullstack: [
    mod('Web foundations: HTML & CSS', 'Weeks 1-4', 'Learn how the web works and build clean, responsive pages from a blank file.', [
      ['How the web works', 'Browsers, servers, HTTP, domains and hosting explained with live examples.'],
      ['Semantic HTML5', 'Structure pages for accessibility and SEO using the right elements, forms and media.'],
      ['Modern CSS', 'Box model, Flexbox, Grid, variables, transitions and typography for polished interfaces.'],
      ['Responsive design', 'Mobile-first layouts, breakpoints and testing across real devices.'],
    ], 'A multi-page responsive portfolio website.'),
    mod('JavaScript that works', 'Weeks 5-8', 'Master the language of the web, from variables to asynchronous code.', [
      ['Core language', 'Types, functions, scope, arrays, objects, closures and modern ES6+ syntax.'],
      ['The DOM & events', 'Select, create and update page elements and respond to user actions.'],
      ['Async JavaScript', 'Promises, async/await and fetching data from public APIs with error handling.'],
      ['Tooling', 'npm, modules, debugging with DevTools and clean code habits.'],
    ], 'An interactive app consuming a live API (weather, movies or currency).'),
    mod('Git, GitHub & professional workflow', 'Weeks 9-10', 'Work like a team from day one.', [
      ['Version control', 'Commits, branches, merges, pull requests and resolving conflicts.'],
      ['Collaboration', 'Code reviews, issues and project boards the way real teams run.'],
      ['Deployment basics', 'Publish sites with continuous deployment and custom domains.'],
    ]),
    mod('Frontend with React & Next.js', 'Weeks 11-15', 'Build fast, component-driven interfaces used by modern companies.', [
      ['React fundamentals', 'Components, props, state, hooks and rendering patterns.'],
      ['Routing & data fetching', 'Next.js App Router, server and client components, loading and error states.'],
      ['Forms & state management', 'Validation, controlled inputs and sharing state cleanly.'],
      ['UI craft', 'Design systems, Tailwind CSS, accessibility and performance.'],
    ], 'A polished multi-page web application.'),
    mod('Backend with Node.js & Express', 'Weeks 16-19', 'Create the server side that powers real products.', [
      ['Server fundamentals', 'Node runtime, Express routing, middleware and REST API design.'],
      ['Databases', 'MongoDB and PostgreSQL: modelling, queries, relations and migrations.'],
      ['Authentication & security', 'Password hashing, sessions/JWT, authorisation and common vulnerabilities.'],
      ['Testing & documentation', 'API testing, validation and clear API docs.'],
    ], 'A secure REST API with user accounts and a database.'),
    mod('Capstone & career launch', 'Weeks 20-24', 'Ship a complete product and get ready for the job market.', [
      ['Full-stack capstone', 'Plan, build and deploy an end-to-end application with mentor reviews.'],
      ['Deployment & monitoring', 'Environment variables, production databases, logging and uptime.'],
      ['Career preparation', 'Portfolio, GitHub profile, CV, interview practice and freelancing basics.'],
    ], 'A deployed full-stack product presented to the cohort.'),
  ],

  mern: [
    mod('Modern JavaScript & TypeScript', 'Weeks 1-3', 'Lock in the language features every MERN project relies on.', [
      ['ES6+ in depth', 'Destructuring, modules, higher-order functions and immutability.'],
      ['Async patterns', 'Promises, async/await, error handling and API design thinking.'],
      ['TypeScript essentials', 'Types, interfaces and generics for safer code.'],
    ]),
    mod('Node.js & Express APIs', 'Weeks 4-6', 'Design and build robust REST APIs.', [
      ['Express architecture', 'Routing, controllers, middleware and project structure.'],
      ['MongoDB & Mongoose', 'Schema design, indexing, aggregation and relationships.'],
      ['Auth & security', 'JWT, cookies, role-based access, rate limiting and validation.'],
    ], 'A production-style API with authentication.'),
    mod('React in depth', 'Weeks 7-10', 'Build interfaces that scale.', [
      ['Hooks & composition', 'useState, useEffect, custom hooks and component design.'],
      ['State management', 'Context, reducers and server-state caching.'],
      ['Forms, UX & accessibility', 'Validation, loading states, error handling and a11y.'],
    ]),
    mod('Next.js & deployment', 'Weeks 11-13', 'Server rendering, routing and shipping to production.', [
      ['App Router & rendering', 'Server components, SSR, SSG and caching strategies.'],
      ['Integrating the API', 'Server actions, route handlers and secure data access.'],
      ['Deploy & observe', 'CI/CD, environment config, logging and performance budgets.'],
    ]),
    mod('Capstone project', 'Weeks 14-16', 'A complete MERN product reviewed by your mentor.', [
      ['Product planning', 'User stories, wireframes and a delivery roadmap.'],
      ['Build & review', 'Weekly code reviews and pair sessions.'],
      ['Demo day', 'Present your live product and get feedback.'],
    ], 'A deployed MERN application for your portfolio.'),
  ],

  pern: [
    mod('Relational database mastery', 'Weeks 1-4', 'Think in tables, relations and queries.', [
      ['SQL fundamentals', 'SELECT, joins, grouping, subqueries and window functions.'],
      ['Schema design', 'Normalisation, keys, constraints and indexing.'],
      ['Transactions & performance', 'ACID, query plans and optimisation.'],
    ], 'A fully modelled business database.'),
    mod('Node.js, Express & PostgreSQL', 'Weeks 5-8', 'Connect an API to a production-grade database.', [
      ['API design', 'REST conventions, versioning and error handling.'],
      ['Data access', 'Parameterised queries, ORMs and migrations.'],
      ['Auth & security', 'Sessions, JWT, hashing and protecting against injection.'],
    ]),
    mod('React & Next.js frontend', 'Weeks 9-13', 'Build the interface for data-driven apps.', [
      ['Components & state', 'React hooks and reusable UI.'],
      ['Data-heavy UI', 'Tables, filters, pagination and dashboards.'],
      ['Next.js rendering', 'Server components, caching and routing.'],
    ]),
    mod('Capstone & deployment', 'Weeks 14-16', 'Ship an enterprise-style application.', [
      ['Build the product', 'Roles, reports and real business workflows.'],
      ['Deploy', 'Managed Postgres, CI/CD and monitoring.'],
    ], 'A deployed data-driven application.'),
  ],

  'data-analysis': [
    mod('Spreadsheets & data thinking', 'Weeks 1-3', 'Ask good questions and answer them with Excel.', [
      ['Data types & cleaning', 'Fix messy data: duplicates, missing values and formats.'],
      ['Formulas & pivot tables', 'Lookups, conditional logic and summaries that drive decisions.'],
      ['Intro to analytical thinking', 'Frame business questions and choose the right metric.'],
    ]),
    mod('Python for analysis', 'Weeks 4-8', 'Automate and scale analysis with code.', [
      ['Python essentials', 'Variables, loops, functions and working in Jupyter.'],
      ['Pandas', 'Load, filter, group, merge and reshape real datasets.'],
      ['NumPy', 'Fast numerical operations and arrays.'],
    ], 'A cleaned and analysed real-world dataset.'),
    mod('SQL for business intelligence', 'Weeks 9-12', 'Query databases like an analyst.', [
      ['Core SQL', 'SELECT, WHERE, GROUP BY, joins and aggregates.'],
      ['Advanced queries', 'CTEs, window functions and cohort analysis.'],
      ['Reporting queries', 'Build KPIs and recurring reports.'],
    ]),
    mod('Visualisation & dashboards', 'Weeks 13-17', 'Tell the story behind the numbers.', [
      ['Charts that communicate', 'Matplotlib and Seaborn with design principles.'],
      ['Power BI', 'Data models, DAX basics and interactive dashboards.'],
      ['Data storytelling', 'Present findings to non-technical stakeholders.'],
    ], 'An interactive executive dashboard.'),
    mod('Statistics & capstone', 'Weeks 18-20', 'Back your insights with evidence.', [
      ['Descriptive & inferential stats', 'Distributions, confidence intervals and hypothesis tests.'],
      ['Capstone', 'A full analysis from raw data to recommendations.'],
    ], 'A portfolio case study presented to the cohort.'),
  ],

  'data-science': [
    mod('Python & data foundations', 'Weeks 1-4', 'Build a strong base in the Python data stack.', [
      ['Python for data', 'Functions, comprehensions, files and Jupyter workflows.'],
      ['Pandas & NumPy', 'Cleaning, transforming and exploring tabular data.'],
      ['SQL for data scientists', 'Extract and join data from relational databases.'],
    ], 'An exploratory data analysis report.'),
    mod('Statistics & probability', 'Weeks 5-8', 'The mathematics behind trustworthy models.', [
      ['Probability & distributions', 'Random variables, sampling and the central limit theorem.'],
      ['Inference', 'Hypothesis tests, confidence intervals and A/B testing.'],
      ['Correlation vs causation', 'Avoid the traps that mislead decision makers.'],
    ]),
    mod('Machine learning fundamentals', 'Weeks 9-15', 'Train, tune and evaluate predictive models.', [
      ['Supervised learning', 'Linear/logistic regression, trees, random forests and boosting.'],
      ['Unsupervised learning', 'Clustering and dimensionality reduction.'],
      ['Feature engineering', 'Encode, scale and create features that improve models.'],
      ['Model evaluation', 'Cross-validation, metrics, bias/variance and overfitting.'],
    ], 'A predictive model solving a real business problem.'),
    mod('Applied data science', 'Weeks 16-20', 'Work with real-world, messy problems.', [
      ['Time series & forecasting', 'Trends, seasonality and forecasting demand.'],
      ['Text & NLP basics', 'Clean text, vectorise and classify.'],
      ['Responsible AI', 'Fairness, privacy and explaining model decisions.'],
    ]),
    mod('Deployment & capstone', 'Weeks 21-24', 'Ship a model and tell its story.', [
      ['Model deployment', 'Serve a model through a simple API or app.'],
      ['Data storytelling', 'Communicate results to executives.'],
      ['Capstone', 'End-to-end project with mentor reviews and demo day.'],
    ], 'A deployed ML project and portfolio case study.'),
  ],

  django: [
    mod('Python & web fundamentals', 'Weeks 1-2', 'Get fluent in the Python you will use daily.', [
      ['Python recap', 'Functions, OOP and virtual environments.'],
      ['HTTP & the request cycle', 'How Django handles a request end to end.'],
    ]),
    mod('Django core', 'Weeks 3-6', 'Models, views, templates and the admin.', [
      ['Models & ORM', 'Design schemas, run migrations and query efficiently.'],
      ['Views & templates', 'Class-based views, forms and template inheritance.'],
      ['Django admin', 'Customise a powerful back office for free.'],
    ], 'A complete content-managed web application.'),
    mod('APIs with Django REST Framework', 'Weeks 7-9', 'Serve data to web and mobile apps.', [
      ['Serializers & viewsets', 'Clean, consistent API endpoints.'],
      ['Auth & permissions', 'Token auth, roles and object-level permissions.'],
      ['Testing', 'Write tests that protect your API.'],
    ]),
    mod('Production & deployment', 'Weeks 10-12', 'Take it live securely.', [
      ['Security best practices', 'CSRF, XSS, secrets management and hardening.'],
      ['Background tasks', 'Celery basics for emails and scheduled work.'],
      ['Deploy', 'PostgreSQL, static files and CI/CD.'],
    ], 'A deployed Django + API project.'),
  ],

  python: [
    mod('Python foundations', 'Weeks 1-4', 'Write confident, readable Python.', [
      ['Syntax & data types', 'Numbers, strings, lists, dicts, tuples and sets.'],
      ['Control flow & functions', 'Conditions, loops, functions and error handling.'],
      ['Problem solving', 'Break problems down and test your solutions.'],
    ]),
    mod('Object-oriented Python', 'Weeks 5-7', 'Structure larger programs.', [
      ['Classes & objects', 'Encapsulation, inheritance and composition.'],
      ['Modules & packages', 'Organise, reuse and share code.'],
      ['Data structures & algorithms', 'Stacks, queues, recursion, sorting and searching.'],
    ]),
    mod('Real-world Python', 'Weeks 8-10', 'Automate and integrate.', [
      ['File I/O & scripting', 'Read, write and automate files and tasks.'],
      ['APIs & requests', 'Consume web APIs and process JSON.'],
      ['Standard library tour', 'datetime, collections, itertools and more.'],
    ], 'A useful automation tool or API-driven script.'),
    mod('Capstone', 'Weeks 11-12', 'Combine everything into one project.', [
      ['Plan & build', 'Design, implement and test a Python application.'],
      ['Present', 'Demo and code review with your mentor.'],
    ]),
  ],

  javascript: [
    mod('JavaScript foundations', 'Weeks 1-4', 'The language, properly.', [
      ['Core syntax', 'Types, operators, functions, scope and closures.'],
      ['Arrays & objects', 'Methods like map, filter and reduce.'],
      ['Debugging', 'DevTools, breakpoints and reading errors.'],
    ]),
    mod('Browser programming', 'Weeks 5-7', 'Make pages come alive.', [
      ['DOM & events', 'Query, create and update elements.'],
      ['Storage & forms', 'localStorage, validation and user input.'],
      ['Fetch & APIs', 'Async JavaScript with real data.'],
    ], 'An interactive web app with live data.'),
    mod('Modern JavaScript', 'Weeks 8-10', 'Write code like a professional.', [
      ['ES modules & tooling', 'npm, bundlers and linting.'],
      ['Classes & patterns', 'OOP, functional patterns and error handling.'],
      ['Testing intro', 'Unit tests with a modern test runner.'],
    ]),
    mod('Capstone', 'Weeks 11-12', 'Build and present a project.', [
      ['Build', 'A feature-rich JavaScript application.'],
      ['Review', 'Mentor code review and refactor.'],
    ]),
  ],

  'flutter-mobile-design': [
    mod('Dart & Flutter basics', 'Weeks 1-3', 'Learn the language and the widget mindset.', [
      ['Dart language', 'Types, null safety, classes and async programming.'],
      ['Widgets & layouts', 'Rows, columns, stacks, lists and responsive design.'],
      ['Design with Material 3', 'Themes, typography and consistent UI.'],
    ]),
    mod('State & navigation', 'Weeks 4-7', 'Make apps feel alive.', [
      ['State management', 'Provider/Riverpod patterns for scalable apps.'],
      ['Navigation & forms', 'Routing, validation and user flows.'],
      ['Animations', 'Implicit and explicit animations for polish.'],
    ], 'A multi-screen app with smooth navigation.'),
    mod('Data & backend', 'Weeks 8-11', 'Connect to the real world.', [
      ['REST APIs', 'Fetch, parse and cache remote data.'],
      ['Local storage', 'SQLite and shared preferences for offline use.'],
      ['Firebase', 'Authentication, Firestore and push notifications.'],
    ]),
    mod('Publish & capstone', 'Weeks 12-14', 'Ship to the stores.', [
      ['Testing & performance', 'Widget tests and profiling.'],
      ['App store release', 'Signing, builds and store listings.'],
      ['Capstone', 'A complete, published mobile app.'],
    ], 'A real app ready for Google Play.'),
  ],

  'react-native-mobile-design': [
    mod('React & React Native foundations', 'Weeks 1-3', 'Components for mobile.', [
      ['React refresher', 'Components, props, state and hooks.'],
      ['Native components', 'View, Text, FlatList, styling with Flexbox.'],
      ['Expo workflow', 'Run on real devices from day one.'],
    ]),
    mod('Navigation & state', 'Weeks 4-7', 'Build real app flows.', [
      ['React Navigation', 'Stacks, tabs and deep links.'],
      ['State & data', 'Context, reducers and server-state libraries.'],
      ['Forms & validation', 'Reliable user input handling.'],
    ], 'A multi-screen mobile app.'),
    mod('Device features & backend', 'Weeks 8-11', 'Use the phone and the cloud.', [
      ['Camera, location & notifications', 'Access native capabilities.'],
      ['APIs & auth', 'Secure login and remote data.'],
      ['Offline support', 'Persist and sync data.'],
    ]),
    mod('Release & capstone', 'Weeks 12-14', 'Ship it.', [
      ['Build & publish', 'EAS builds and store submission.'],
      ['Capstone', 'A complete app with mentor reviews.'],
    ], 'A published cross-platform app.'),
  ],

  cybersecurity: [
    mod('Security foundations', 'Weeks 1-3', 'The concepts and mindset of security.', [
      ['CIA triad & threat modelling', 'Confidentiality, integrity, availability and attacker thinking.'],
      ['Networking essentials', 'TCP/IP, DNS, HTTP and common protocols.'],
      ['Operating systems', 'Linux and Windows security basics and the command line.'],
    ]),
    mod('Defensive security', 'Weeks 4-7', 'Protect systems and detect attacks.', [
      ['Hardening', 'Secure configuration, patching and least privilege.'],
      ['Identity & access', 'Authentication, MFA and access control.'],
      ['Monitoring & detection', 'Logs, SIEM concepts and alert triage.'],
    ], 'A hardening and monitoring plan for a small business.'),
    mod('Web & application security', 'Weeks 8-10', 'Understand how apps get attacked.', [
      ['OWASP Top 10', 'Injection, XSS, broken auth and more.'],
      ['Secure development', 'Validation, secrets and dependency hygiene.'],
      ['Hands-on labs', 'Practice safely in intentionally vulnerable apps.'],
    ]),
    mod('Incident response & governance', 'Weeks 11-12', 'Handle the bad day well.', [
      ['Incident response', 'Prepare, detect, contain and recover.'],
      ['Risk & compliance', 'Policies, frameworks and awareness training.'],
      ['Capstone', 'A security assessment report for a realistic scenario.'],
    ], 'A professional security assessment report.'),
  ],

  'cybersecurity-ceh': [
    mod('Ethical hacking foundations', 'Weeks 1-3', 'Legal, ethical and methodological grounding.', [
      ['Ethics & legal frameworks', 'Scope, authorisation and reporting.'],
      ['Footprinting & reconnaissance', 'Gather intelligence passively and actively.'],
      ['Scanning & enumeration', 'Nmap, service discovery and vulnerability scanning.'],
    ]),
    mod('System hacking & attacks', 'Weeks 4-8', 'Understand attacker techniques to defend against them.', [
      ['Vulnerability analysis', 'Prioritise and validate weaknesses.'],
      ['System hacking', 'Password attacks, privilege escalation and persistence.'],
      ['Malware & social engineering', 'Threat types and human-factor attacks.'],
      ['Sniffing & denial of service', 'Network-level attacks and defences.'],
    ], 'A lab-based penetration test of a practice network.'),
    mod('Web, wireless & cloud', 'Weeks 9-12', 'Modern attack surfaces.', [
      ['Web application attacks', 'SQL injection, XSS and session attacks.'],
      ['Wireless & mobile', 'Wi-Fi security and mobile threats.'],
      ['Cloud & IoT security', 'Misconfigurations and device risks.'],
      ['Cryptography', 'Encryption, hashing and PKI.'],
    ]),
    mod('Exam preparation', 'Weeks 13-14', 'Get certification-ready.', [
      ['Exam strategy', 'Blueprint walkthrough and time management.'],
      ['Practice exams', 'Timed mock tests with review of weak areas.'],
      ['Reporting', 'Write findings the way clients expect.'],
    ], 'A professional pen-test report and exam readiness check.'),
  ],

  'digital-marketing': [
    mod('Marketing foundations', 'Weeks 1-2', 'Understand customers before spending a franc.', [
      ['Audience & positioning', 'Personas, value propositions and competitor research.'],
      ['Funnels & metrics', 'Awareness to conversion, KPIs and goal setting.'],
    ]),
    mod('Content & social media', 'Weeks 3-5', 'Create content people share and act on.', [
      ['Content strategy', 'Calendars, formats and storytelling.'],
      ['Platform playbooks', 'Facebook, Instagram, TikTok, LinkedIn and WhatsApp Business.'],
      ['Design & video basics', 'Create on-brand visuals with accessible tools.'],
    ], 'A 30-day content plan with produced assets.'),
    mod('SEO & email marketing', 'Weeks 6-8', 'Earn traffic and nurture customers.', [
      ['SEO essentials', 'Keywords, on-page, technical basics and link building.'],
      ['Email & automation', 'Lists, sequences and measuring open and click rates.'],
      ['Analytics', 'Google Analytics, UTM tracking and dashboards.'],
    ]),
    mod('Paid ads & capstone', 'Weeks 9-12', 'Turn budget into results.', [
      ['Paid advertising', 'Meta and Google Ads: targeting, creatives and budgets.'],
      ['Optimisation', 'A/B testing and improving cost per result.'],
      ['Capstone', 'Plan and run a campaign for a real or simulated business.'],
    ], 'A full campaign report with results.'),
  ],

  webfundamentals: [
    mod('Build your first web page', 'Weeks 1-2', 'From blank file to live page.', [
      ['HTML basics', 'Headings, text, links, images and lists.'],
      ['CSS basics', 'Colours, fonts, spacing and layout.'],
    ]),
    mod('Make it responsive & interactive', 'Weeks 3-4', 'Works on every screen.', [
      ['Flexbox & responsive design', 'Layouts that adapt to phones and laptops.'],
      ['First JavaScript', 'Buttons, forms and small interactions.'],
    ]),
    mod('Publish your site', 'Weeks 5-6', 'Share it with the world.', [
      ['Hosting & domains', 'Put your site online.'],
      ['Final project', 'A personal or small business website.'],
    ], 'A published website.'),
  ],

  htmlcss: [
    mod('HTML essentials', 'Weeks 1-2', 'Structure content correctly.', [
      ['Semantic elements', 'Headings, sections, forms and media.'],
      ['Accessibility basics', 'Alt text, labels and keyboard use.'],
    ]),
    mod('CSS layout & design', 'Weeks 3-5', 'Make it look professional.', [
      ['Box model & typography', 'Spacing, fonts and colour systems.'],
      ['Flexbox & Grid', 'Modern layout techniques.'],
      ['Responsive design', 'Mobile-first breakpoints.'],
    ], 'A responsive multi-section landing page.'),
  ],

  jsessentials: [
    mod('JavaScript basics', 'Weeks 1-3', 'Think and code in JavaScript.', [
      ['Variables, types & operators', 'The building blocks.'],
      ['Functions & control flow', 'Decisions, loops and reusable code.'],
      ['Arrays & objects', 'Store and process data.'],
    ]),
    mod('JavaScript in the browser', 'Weeks 4-6', 'Interact with the page.', [
      ['DOM & events', 'React to clicks and input.'],
      ['Fetching data', 'Call a public API and show results.'],
    ], 'A small interactive app.'),
  ],

  'react-basics': [
    mod('React fundamentals', 'Weeks 1-3', 'Think in components.', [
      ['JSX & components', 'Build UI from reusable pieces.'],
      ['Props & state', 'Pass data and manage changes.'],
      ['Hooks', 'useState and useEffect in practice.'],
    ]),
    mod('Build a React app', 'Weeks 4-6', 'Apply it.', [
      ['Lists, forms & routing', 'Typical app patterns.'],
      ['Fetching data', 'Load and display API data.'],
    ], 'A small React application.'),
  ],

  'python-basics': [
    mod('Python starter', 'Weeks 1-3', 'Your first programs.', [
      ['Variables & data types', 'Numbers, text and collections.'],
      ['Conditions & loops', 'Make programs decide and repeat.'],
      ['Functions', 'Write reusable code.'],
    ]),
    mod('Practical Python', 'Weeks 4-6', 'Use it for something real.', [
      ['Files & modules', 'Read data and reuse code.'],
      ['Mini project', 'Build a small tool that solves a problem.'],
    ], 'A working Python mini project.'),
  ],
};

/** Reasonable fallback when a programme has no hand-written curriculum yet. */
export function getProgrammeModules(id: string, technologies: string[], duration: string): ProgrammeModule[] {
  const known = PROGRAMME_CURRICULA[id];
  if (known) return known;
  return [
    mod('Tools and topics you will cover', duration, 'Taught live with hands-on practice.',
      technologies.map((t): T => [t, `Guided lessons and exercises on ${t}.`])),
  ];
}
