import type { TutorialLesson } from '../types';

export const beginnerLessons: TutorialLesson[] = [
  {
    slug: 'what-is-nextjs',
    title: 'What is Next.js?',
    description: 'Learn what Next.js is, what it adds to React, and why it is popular for modern web apps.',
    level: 'beginner',
    section: 'Getting Started',
    order: 1,
    minutes: 8,
    content: [
      { type: 'p', text: 'Next.js is a framework for building websites and web apps with React. It gives you a ready-made project structure, routing, performance features, and server-side tools so you can build real apps faster.' },
      { type: 'h2', text: 'Next.js in simple words' },
      { type: 'p', text: 'React helps you build user interfaces from components. Next.js takes React and adds the things most apps need: pages, layouts, navigation, image optimization, metadata, server rendering, and API-friendly patterns.' },
      {
        type: 'table',
        headers: ['Need', 'How Next.js helps'],
        rows: [
          ['Pages', 'Create files inside the app folder'],
          ['Navigation', 'Use the built-in Link component'],
          ['Performance', 'Render on the server and optimize assets'],
          ['SEO', 'Add metadata for titles and descriptions'],
        ],
      },
      { type: 'h2', text: 'A tiny Next.js page' },
      { type: 'p', text: 'In the App Router, a page is usually a file named page.tsx inside the app folder. The file exports a component, and Next.js turns it into a route.' },
      {
        type: 'code',
        title: 'app/page.tsx',
        language: 'tsx',
        code: `export default function HomePage() {
  return (
    <main>
      <h1>Welcome to my Next.js app</h1>
      <p>This page is rendered by Next.js.</p>
    </main>
  );
}`,
      },
      { type: 'h2', text: 'Why developers choose it' },
      { type: 'ul', items: ['File-based routing keeps routes easy to find.', 'Server Components help send less JavaScript to the browser.', 'Built-in tools handle images, fonts, links, and metadata.', 'You can start small and grow into a full-stack app.'] },
      {
        type: 'code',
        title: 'A component inside a page',
        language: 'tsx',
        code: `function WelcomeCard() {
  return <section>Learn Next.js step by step.</section>;
}

export default function HomePage() {
  return <WelcomeCard />;
}`,
      },
      { type: 'note', text: 'This tutorial uses the App Router, the modern routing system used in Next.js 14 and newer projects.' },
      { type: 'try', text: 'Describe one website you use often. List which parts could be pages, which parts could be shared components, and which parts need fast loading.' },
      { type: 'keypoints', items: ['Next.js is a React framework for production apps.', 'The App Router uses the app folder for routes and layouts.', 'Next.js includes routing, rendering, image, font, and SEO tools.', 'You will learn React concepts inside the Next.js workflow.'] },
    ],
  },
  {
    slug: 'next-without-react-first',
    title: 'Learn Next.js Without a React Course First',
    description: 'Understand why you can learn React concepts directly while learning Next.js.',
    level: 'beginner',
    section: 'Getting Started',
    order: 2,
    minutes: 8,
    content: [
      { type: 'p', text: 'You do not need to finish a separate React course before learning Next.js. Next.js uses React, but you can learn each React idea exactly when it becomes useful.' },
      { type: 'h2', text: 'React pieces appear naturally' },
      { type: 'p', text: 'A Next.js page is a React component. When a page needs reusable UI, you learn components. When a component needs information, you learn props. When a button needs to change the screen, you learn state. When browser-only code is needed, you learn hooks.' },
      {
        type: 'table',
        headers: ['React concept', 'When you learn it in Next.js'],
        rows: [
          ['JSX', 'When writing page markup in page.tsx'],
          ['Components', 'When splitting a page into smaller UI pieces'],
          ['Props', 'When passing data into components'],
          ['State', 'When adding interactive Client Components'],
          ['Hooks', 'When using features like useState or useEffect'],
        ],
      },
      { type: 'h2', text: 'A page already teaches React' },
      {
        type: 'code',
        title: 'app/page.tsx',
        language: 'tsx',
        code: `export default function HomePage() {
  return (
    <main>
      <h1>Learning Next.js</h1>
      <p>This function returns JSX, so you are already using React.</p>
    </main>
  );
}`,
      },
      { type: 'p', text: 'This example teaches three React ideas without leaving Next.js: components are functions, JSX looks like HTML in JavaScript, and returning UI creates what users see.' },
      { type: 'h2', text: 'Add concepts only when needed' },
      {
        type: 'code',
        title: 'React concepts inside a Next.js component',
        language: 'tsx',
        code: `type FeatureCardProps = {
  title: string;
  description: string;
};

function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <article>
      <h2>{title}</h2>
      <p>{description}</p>
    </article>
  );
}

export default function HomePage() {
  return <FeatureCard title="Routing" description="Pages come from files." />;
}`,
      },
      { type: 'tip', text: 'Treat React as the UI language of Next.js. You will learn components, props, state, and hooks as part of building Next.js pages.' },
      { type: 'note', text: 'This course introduces useState and useEffect after Server Components and Client Components, because that is how modern Next.js apps are designed.' },
      { type: 'try', text: 'Look at the code above and identify the component name, the prop names, and the JSX elements. Then explain what each part does in plain words.' },
      { type: 'keypoints', items: ['A separate React course is not required before Next.js.', 'React concepts can be learned inside real Next.js files.', 'Components, props, state, and hooks appear when the app needs them.', 'Modern Next.js starts with server-first UI and adds client interactivity only where needed.'] },
    ],
  },
  {
    slug: 'nextjs-setup',
    title: 'Install & Create a Next.js App',
    description: 'Set up your tools and create a new Next.js app with the official starter command.',
    level: 'beginner',
    section: 'Getting Started',
    order: 3,
    minutes: 9,
    content: [
      { type: 'p', text: 'To build a Next.js app, you need Node.js, a package manager, and a code editor. The official create-next-app command makes a working project for you.' },
      { type: 'h2', text: 'What you need first' },
      { type: 'ul', items: ['Install the current long-term support version of Node.js.', 'Use a terminal to run commands.', 'Use a code editor such as VS Code or Cursor.', 'Know how to open a folder and edit files.'] },
      { type: 'h2', text: 'Create the app' },
      {
        type: 'code',
        title: 'Create a new Next.js project',
        language: 'bash',
        code: `npx create-next-app@latest my-next-app`,
      },
      { type: 'p', text: 'The setup questions may ask about TypeScript, ESLint, Tailwind CSS, the app directory, and import aliases. For this tutorial, TypeScript and the App Router are a good default.' },
      {
        type: 'code',
        title: 'Move into the project and start it',
        language: 'bash',
        code: `cd my-next-app
npm run dev`,
      },
      { type: 'h2', text: 'Open the local site' },
      { type: 'p', text: 'After the dev server starts, open http://localhost:3000 in your browser. You should see the starter page. When you edit files, the browser updates quickly.' },
      {
        type: 'code',
        title: 'A first edit',
        language: 'tsx',
        code: `export default function HomePage() {
  return <h1>My first Next.js app</h1>;
}`,
      },
      { type: 'tip', text: 'If the command asks whether to use the App Router, choose yes. The lessons in this tutorial use the app folder.' },
      { type: 'warning', text: 'If npm run dev fails, check that Node.js is installed and that you are inside the project folder that contains package.json.' },
      { type: 'try', text: 'Create a new Next.js app, start the dev server, and change the home page heading to your own message.' },
      { type: 'keypoints', items: ['create-next-app creates a ready-to-run project.', 'Use npm run dev to start local development.', 'The app folder is the home of App Router pages and layouts.', 'Browser updates during development make learning faster.'] },
    ],
  },
  {
    slug: 'nextjs-project-structure',
    title: 'Project Structure (App Router)',
    description: 'Learn the important files and folders in a modern Next.js App Router project.',
    level: 'beginner',
    section: 'Getting Started',
    order: 4,
    minutes: 10,
    content: [
      { type: 'p', text: 'A Next.js project has a few important folders. Beginners should focus first on app, public, package.json, and configuration files.' },
      { type: 'h2', text: 'The app folder' },
      { type: 'p', text: 'The app folder contains your routes, layouts, loading screens, error screens, and route-specific files. A file named page.tsx creates a page for that folder path.' },
      {
        type: 'code',
        title: 'Common App Router files',
        language: 'bash',
        code: `app/
  layout.tsx
  page.tsx
  about/
    page.tsx
public/
  logo.png
package.json`,
      },
      {
        type: 'table',
        headers: ['File or folder', 'Purpose'],
        rows: [
          ['app/page.tsx', 'The home page at /'],
          ['app/layout.tsx', 'Shared wrapper for pages'],
          ['app/about/page.tsx', 'The about page at /about'],
          ['public', 'Static files such as images and icons'],
          ['package.json', 'Scripts and dependencies'],
        ],
      },
      { type: 'h2', text: 'Layout and page work together' },
      {
        type: 'code',
        title: 'app/layout.tsx',
        language: 'tsx',
        code: `export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}`,
      },
      {
        type: 'code',
        title: 'app/page.tsx',
        language: 'tsx',
        code: `export default function HomePage() {
  return <main>Home page content</main>;
}`,
      },
      { type: 'note', text: 'The children prop in a layout means the page content will be placed inside the layout. You will learn composition more deeply later.' },
      { type: 'tip', text: 'Keep route folders small and readable. Put shared components in a components folder when several routes need the same UI.' },
      { type: 'try', text: 'Sketch a small app structure with Home, About, and Products pages. Write the folder path and page.tsx file for each route.' },
      { type: 'keypoints', items: ['The app folder controls routes in the App Router.', 'page.tsx creates a route page.', 'layout.tsx wraps pages and can be nested.', 'The public folder stores static files served from the site root.'] },
    ],
  },
  {
    slug: 'nextjs-dev-workflow',
    title: 'Dev Server, Files & Hot Reload',
    description: 'Learn the daily workflow for editing files and seeing changes in a Next.js app.',
    level: 'beginner',
    section: 'Getting Started',
    order: 5,
    minutes: 8,
    content: [
      { type: 'p', text: 'The development server runs your app locally and watches for file changes. When you save a file, Next.js updates the browser so you can see the result quickly.' },
      { type: 'h2', text: 'Start and stop the dev server' },
      {
        type: 'code',
        title: 'Start local development',
        language: 'bash',
        code: `npm run dev`,
      },
      { type: 'p', text: 'The terminal shows the local address, usually http://localhost:3000. To stop the server, click the terminal and press Ctrl+C.' },
      { type: 'h2', text: 'Edit, save, refresh less' },
      {
        type: 'code',
        title: 'app/page.tsx',
        language: 'tsx',
        code: `export default function HomePage() {
  return (
    <main>
      <h1>Hot reload is working</h1>
      <p>Save this file and watch the browser update.</p>
    </main>
  );
}`,
      },
      { type: 'p', text: 'Hot reload tries to preserve the current browser state while updating your code. This makes small UI changes feel immediate.' },
      { type: 'h2', text: 'Common development files' },
      {
        type: 'table',
        headers: ['What you edit', 'Where it often lives'],
        rows: [
          ['Pages', 'app/**/page.tsx'],
          ['Layouts', 'app/**/layout.tsx'],
          ['Global CSS', 'app/globals.css'],
          ['Images', 'public or imported files'],
        ],
      },
      {
        type: 'code',
        title: 'A useful package.json script',
        language: 'javascript',
        code: `"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start"
}`,
      },
      { type: 'tip', text: 'Keep the terminal visible while learning. Error messages often tell you the exact file and line to fix.' },
      { type: 'warning', text: 'Do not edit files inside node_modules. That folder contains installed packages and will be replaced during installs.' },
      { type: 'try', text: 'Run the dev server, edit app/page.tsx three times, and notice how quickly the browser updates after each save.' },
      { type: 'keypoints', items: ['npm run dev starts the local development server.', 'Hot reload updates the browser after saving files.', 'Terminal errors are part of the normal development workflow.', 'Most beginner edits happen in app/page.tsx, app/layout.tsx, components, and CSS files.'] },
    ],
  },
  {
    slug: 'nextjs-jsx',
    title: 'JSX: The Language of Next.js Pages',
    description: 'Learn how JSX lets you write page UI with HTML-like syntax inside TypeScript files.',
    level: 'beginner',
    section: 'React Essentials Inside Next.js',
    order: 6,
    minutes: 10,
    content: [
      { type: 'p', text: 'JSX is the HTML-like syntax you write inside Next.js page and component files. It lets JavaScript or TypeScript return user interface elements.' },
      { type: 'h2', text: 'JSX looks like HTML, but it is JavaScript' },
      { type: 'p', text: 'JSX uses tags like h1, p, and button. It also lets you place JavaScript values inside curly braces.' },
      {
        type: 'code',
        title: 'app/page.tsx',
        language: 'tsx',
        code: `export default function HomePage() {
  const name = 'Maya';

  return (
    <main>
      <h1>Hello, {name}</h1>
      <p>Welcome to Next.js JSX.</p>
    </main>
  );
}`,
      },
      { type: 'h2', text: 'Rules that beginners should know' },
      { type: 'ul', items: ['Return one parent element from a component.', 'Use className instead of class for CSS classes.', 'Close every tag, including img-like custom elements.', 'Put JavaScript expressions inside curly braces.'] },
      {
        type: 'code',
        title: 'JSX attributes',
        language: 'tsx',
        code: `export default function HomePage() {
  const isPrimary = true;

  return (
    <main className="page">
      <button disabled={!isPrimary}>Continue</button>
    </main>
  );
}`,
      },
      { type: 'h2', text: 'Curly braces add values' },
      { type: 'p', text: 'Curly braces can show strings, numbers, variables, calculations, and function results. They cannot contain full statements like if blocks directly inside JSX.' },
      {
        type: 'table',
        headers: ['JSX pattern', 'Meaning'],
        rows: [
          ['{name}', 'Show the value of a variable'],
          ['{price * quantity}', 'Show a calculated value'],
          ['className="card"', 'Add a CSS class'],
          ['<Component />', 'Render another component'],
        ],
      },
      { type: 'note', text: 'JSX is part of React, and React is the UI foundation used by Next.js. You are learning React syntax while writing Next.js pages.' },
      { type: 'try', text: 'Create a page with your name, a favorite number, and a button. Use curly braces to show at least one JavaScript value.' },
      { type: 'keypoints', items: ['JSX is HTML-like UI syntax inside JavaScript or TypeScript.', 'Next.js pages return JSX from components.', 'Use curly braces to show JavaScript values in JSX.', 'Use className for CSS classes and return one parent element.'] },
    ],
  },
  {
    slug: 'nextjs-first-page',
    title: 'Your First Page',
    description: 'Create a home page and understand how App Router turns files into routes.',
    level: 'beginner',
    section: 'React Essentials Inside Next.js',
    order: 7,
    minutes: 9,
    content: [
      { type: 'p', text: 'In the App Router, a page is created by adding a page.tsx file inside the app folder. The default export from that file becomes the page component.' },
      { type: 'h2', text: 'The home page route' },
      { type: 'p', text: 'The file app/page.tsx creates the route at /. This is the first page users see when they visit the root of your site.' },
      {
        type: 'code',
        title: 'app/page.tsx',
        language: 'tsx',
        code: `export default function HomePage() {
  return (
    <main>
      <h1>Home</h1>
      <p>This is my first Next.js page.</p>
    </main>
  );
}`,
      },
      { type: 'h2', text: 'A page is a component' },
      { type: 'p', text: 'The function name can be descriptive, such as HomePage. Next.js cares that the page file has a default export that returns JSX.' },
      {
        type: 'code',
        title: 'A page with variables',
        language: 'tsx',
        code: `export default function HomePage() {
  const course = 'Next.js Beginner';
  const lessonCount = 25;

  return (
    <main>
      <h1>{course}</h1>
      <p>This course has {lessonCount} lessons.</p>
    </main>
  );
}`,
      },
      { type: 'h2', text: 'Add another route' },
      {
        type: 'code',
        title: 'app/about/page.tsx',
        language: 'tsx',
        code: `export default function AboutPage() {
  return (
    <main>
      <h1>About</h1>
      <p>This page lives at /about.</p>
    </main>
  );
}`,
      },
      { type: 'tip', text: 'Use clear component names like HomePage, AboutPage, and ContactPage. Good names make error messages easier to understand.' },
      { type: 'note', text: 'A route folder can contain more than page.tsx. Later you will see layout.tsx, loading.tsx, error.tsx, and not-found.tsx.' },
      { type: 'try', text: 'Create an app/contact/page.tsx file and return a heading, short paragraph, and email link.' },
      { type: 'keypoints', items: ['app/page.tsx creates the / route.', 'A page file must default export a component.', 'A page component returns JSX.', 'Nested folders create nested routes such as /about and /contact.'] },
    ],
  },
  {
    slug: 'nextjs-components',
    title: 'Components',
    description: 'Split a Next.js page into reusable React components.',
    level: 'beginner',
    section: 'React Essentials Inside Next.js',
    order: 8,
    minutes: 10,
    content: [
      { type: 'p', text: 'Components are reusable pieces of UI. A button, card, header, product tile, and page section can all be components.' },
      { type: 'h2', text: 'Why components matter' },
      { type: 'p', text: 'Components help you avoid repeating code. They also make pages easier to read because each part has a clear name.' },
      {
        type: 'code',
        title: 'Component in the same file',
        language: 'tsx',
        code: `function Hero() {
  return (
    <section>
      <h1>Build faster with Next.js</h1>
      <p>Learn pages, routing, and components together.</p>
    </section>
  );
}

export default function HomePage() {
  return (
    <main>
      <Hero />
    </main>
  );
}`,
      },
      { type: 'h2', text: 'Move shared components to a folder' },
      { type: 'p', text: 'When a component is used in several places, put it in a shared folder such as components. Then import it where needed.' },
      {
        type: 'code',
        title: 'components/SiteHeader.tsx',
        language: 'tsx',
        code: `export function SiteHeader() {
  return (
    <header>
      <strong>Intellex</strong>
      <nav>Home Courses About</nav>
    </header>
  );
}`,
      },
      {
        type: 'code',
        title: 'app/page.tsx',
        language: 'tsx',
        code: `import { SiteHeader } from '@/components/SiteHeader';

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>Welcome back.</main>
    </>
  );
}`,
      },
      { type: 'h3', text: 'Component naming' },
      { type: 'p', text: 'React component names start with a capital letter. Lowercase names are treated like normal HTML elements.' },
      { type: 'tip', text: 'Start by creating components in the same file. Move them to a separate file when the page becomes crowded or the component is reused.' },
      { type: 'try', text: 'Make a CourseCard component and render it from app/page.tsx. Include a title, description, and Start button.' },
      { type: 'keypoints', items: ['Components are reusable UI functions.', 'Component names should start with a capital letter.', 'Pages can render components with JSX tags.', 'Shared components often live in a components folder.'] },
    ],
  },
  {
    slug: 'nextjs-props',
    title: 'Props',
    description: 'Pass information into components with props and TypeScript types.',
    level: 'beginner',
    section: 'React Essentials Inside Next.js',
    order: 9,
    minutes: 11,
    content: [
      { type: 'p', text: 'Props are values passed into a component. They let one component reuse the same layout with different text, numbers, links, or other data.' },
      { type: 'h2', text: 'A component with props' },
      {
        type: 'code',
        title: 'components/LessonCard.tsx',
        language: 'tsx',
        code: `type LessonCardProps = {
  title: string;
  minutes: number;
};

export function LessonCard({ title, minutes }: LessonCardProps) {
  return (
    <article>
      <h2>{title}</h2>
      <p>{minutes} minutes</p>
    </article>
  );
}`,
      },
      { type: 'p', text: 'The type describes what values the component expects. The component receives those values and places them in JSX.' },
      { type: 'h2', text: 'Pass props from a page' },
      {
        type: 'code',
        title: 'app/page.tsx',
        language: 'tsx',
        code: `import { LessonCard } from '@/components/LessonCard';

export default function HomePage() {
  return (
    <main>
      <LessonCard title="JSX Basics" minutes={10} />
      <LessonCard title="Components" minutes={12} />
    </main>
  );
}`,
      },
      {
        type: 'table',
        headers: ['Prop value', 'How it is written'],
        rows: [
          ['String', 'title="Components"'],
          ['Number', 'minutes={12}'],
          ['Boolean true', 'featured={true}'],
          ['Array or object', 'Use curly braces with a JavaScript value'],
        ],
      },
      { type: 'h2', text: 'Props are read-only' },
      { type: 'p', text: 'A component should treat props as values it receives, not values it changes. If UI needs to change after a click, you will use state in a Client Component later.' },
      {
        type: 'code',
        title: 'Optional props',
        language: 'tsx',
        code: `type BadgeProps = {
  label: string;
  featured?: boolean;
};

export function Badge({ label, featured = false }: BadgeProps) {
  return <span>{featured ? 'Featured: ' : ''}{label}</span>;
}`,
      },
      { type: 'note', text: 'Props are one of the first React ideas you need in Next.js because components become useful when they can receive data.' },
      { type: 'try', text: 'Create a ProfileCard component with name, role, and location props. Render it twice with different values.' },
      { type: 'keypoints', items: ['Props pass data into components.', 'TypeScript types document expected props.', 'Use quotes for string props and curly braces for JavaScript values.', 'Props should be treated as read-only.'] },
    ],
  },
  {
    slug: 'nextjs-children',
    title: 'children & Composition',
    description: 'Use children to place content inside reusable wrapper components and layouts.',
    level: 'beginner',
    section: 'React Essentials Inside Next.js',
    order: 10,
    minutes: 10,
    content: [
      { type: 'p', text: 'The children prop represents content placed between opening and closing component tags. It is how React and Next.js compose UI.' },
      { type: 'h2', text: 'A wrapper component' },
      {
        type: 'code',
        title: 'components/Card.tsx',
        language: 'tsx',
        code: `type CardProps = {
  children: React.ReactNode;
};

export function Card({ children }: CardProps) {
  return <section className="card">{children}</section>;
}`,
      },
      { type: 'p', text: 'The Card component does not need to know exactly what content it will wrap. It simply renders children inside a section.' },
      { type: 'h2', text: 'Use the wrapper' },
      {
        type: 'code',
        title: 'app/page.tsx',
        language: 'tsx',
        code: `import { Card } from '@/components/Card';

export default function HomePage() {
  return (
    <main>
      <Card>
        <h1>Beginner Next.js</h1>
        <p>Composition keeps UI flexible.</p>
      </Card>
    </main>
  );
}`,
      },
      { type: 'h2', text: 'Layouts use children too' },
      {
        type: 'code',
        title: 'app/layout.tsx',
        language: 'tsx',
        code: `export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header>My Site</header>
        {children}
      </body>
    </html>
  );
}`,
      },
      { type: 'p', text: 'In a layout, children is the page or nested layout that belongs inside the wrapper. This is a major idea in the App Router.' },
      { type: 'tip', text: 'Use children when the wrapper controls the outside shape, but the caller should control the inside content.' },
      { type: 'note', text: 'Composition means building larger UI by combining smaller components instead of making one huge component.' },
      { type: 'try', text: 'Create a Panel component that accepts children. Use it to wrap a heading, paragraph, and button on a page.' },
      { type: 'keypoints', items: ['children is content placed inside component tags.', 'Wrapper components use children for flexible layouts.', 'Next.js layouts receive children automatically.', 'Composition helps you build pages from small reusable pieces.'] },
    ],
  },
  {
    slug: 'nextjs-styling',
    title: 'Styling in Next.js',
    description: 'Learn beginner-friendly ways to style Next.js pages and components.',
    level: 'beginner',
    section: 'Building the UI',
    order: 11,
    minutes: 11,
    content: [
      { type: 'p', text: 'Next.js supports several styling methods. Beginners usually start with global CSS and CSS Modules, then add other tools when a project needs them.' },
      { type: 'h2', text: 'Global CSS' },
      { type: 'p', text: 'Global CSS affects the whole app. In App Router projects, it is commonly imported from app/layout.tsx.' },
      {
        type: 'code',
        title: 'app/layout.tsx',
        language: 'tsx',
        code: `import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}`,
      },
      {
        type: 'code',
        title: 'app/globals.css',
        language: 'css',
        code: `body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #f7f7fb;
  color: #1f2937;
}

main {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem;
}`,
      },
      { type: 'h2', text: 'CSS Modules' },
      { type: 'p', text: 'CSS Modules scope class names to one component. This helps prevent class name conflicts in larger apps.' },
      {
        type: 'code',
        title: 'components/CourseCard.module.css',
        language: 'css',
        code: `.card {
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 1rem;
  background: white;
}

.title {
  margin-top: 0;
}`,
      },
      {
        type: 'code',
        title: 'components/CourseCard.tsx',
        language: 'tsx',
        code: `import styles from './CourseCard.module.css';

export function CourseCard() {
  return (
    <article className={styles.card}>
      <h2 className={styles.title}>Next.js Beginner</h2>
      <p>Build pages with the App Router.</p>
    </article>
  );
}`,
      },
      {
        type: 'table',
        headers: ['Method', 'Good for'],
        rows: [
          ['Global CSS', 'Base styles, resets, typography'],
          ['CSS Modules', 'Component-specific styles'],
          ['Utility CSS', 'Fast styling with classes when the project uses it'],
          ['Inline styles', 'Small dynamic values only'],
        ],
      },
      { type: 'tip', text: 'Use global CSS for site-wide defaults and CSS Modules for component styles that should not leak.' },
      { type: 'try', text: 'Create a CourseCard component with a CSS Module. Add a border, padding, rounded corners, and a hover style.' },
      { type: 'keypoints', items: ['Next.js supports global CSS and CSS Modules.', 'Import global CSS from a layout.', 'CSS Modules keep class names scoped to a component.', 'Use className in JSX, not class.'] },
    ],
  },
  {
    slug: 'nextjs-images',
    title: 'Images with next/image',
    description: 'Use the Next.js Image component for optimized, responsive images.',
    level: 'beginner',
    section: 'Building the UI',
    order: 12,
    minutes: 10,
    content: [
      { type: 'p', text: 'Images can slow down a website if they are too large. Next.js provides the Image component from next/image to help optimize images automatically.' },
      { type: 'h2', text: 'Use a local image' },
      { type: 'p', text: 'Place static images in the public folder. A file at public/hero.png can be used with src="/hero.png".' },
      {
        type: 'code',
        title: 'app/page.tsx',
        language: 'tsx',
        code: `import Image from 'next/image';

export default function HomePage() {
  return (
    <main>
      <Image
        src="/hero.png"
        alt="Student learning Next.js"
        width={800}
        height={400}
      />
      <h1>Learn Next.js visually</h1>
    </main>
  );
}`,
      },
      { type: 'h2', text: 'Why width, height, and alt matter' },
      { type: 'ul', items: ['width and height help the browser reserve space before the image loads.', 'alt text helps screen readers and improves accessibility.', 'The Image component can serve optimized sizes for different devices.', 'Good image names make assets easier to manage.'] },
      {
        type: 'code',
        title: 'Image inside a card',
        language: 'tsx',
        code: `import Image from 'next/image';

export function CoursePreview() {
  return (
    <article>
      <Image
        src="/nextjs-course.jpg"
        alt="Laptop showing a Next.js project"
        width={320}
        height={180}
      />
      <h2>Next.js Beginner Course</h2>
    </article>
  );
}`,
      },
      { type: 'h2', text: 'Remote images need configuration' },
      { type: 'p', text: 'If an image comes from another domain, Next.js needs that domain in next.config.js. This keeps image optimization predictable and safe.' },
      {
        type: 'code',
        title: 'next.config.js',
        language: 'javascript',
        code: `const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.example.com',
      },
    ],
  },
};

module.exports = nextConfig;`,
      },
      { type: 'tip', text: 'Write alt text that describes the image purpose. If the image is only decoration, an empty alt value can be appropriate.' },
      { type: 'try', text: 'Add an image to a page using next/image. Give it useful alt text and set width and height.' },
      { type: 'keypoints', items: ['Use next/image for optimized images.', 'Images in public are referenced from the site root.', 'Always think about alt text.', 'Remote image domains must be configured before optimization.'] },
    ],
  },
  {
    slug: 'nextjs-fonts',
    title: 'Fonts with next/font',
    description: 'Load fonts with the built-in Next.js font system.',
    level: 'beginner',
    section: 'Building the UI',
    order: 13,
    minutes: 9,
    content: [
      { type: 'p', text: 'Fonts affect how your site feels and how quickly text appears. Next.js includes next/font to load and optimize fonts with a simple import.' },
      { type: 'h2', text: 'Use a Google font' },
      { type: 'p', text: 'The next/font/google package lets you use Google fonts without adding a separate link tag to the page.' },
      {
        type: 'code',
        title: 'app/layout.tsx',
        language: 'tsx',
        code: `import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}`,
      },
      { type: 'h2', text: 'Use a font variable' },
      { type: 'p', text: 'A font variable gives you a CSS custom property that can be used in your styles.' },
      {
        type: 'code',
        title: 'app/layout.tsx',
        language: 'tsx',
        code: `import { Roboto } from 'next/font/google';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-roboto',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={roboto.variable}>{children}</body>
    </html>
  );
}`,
      },
      {
        type: 'code',
        title: 'app/globals.css',
        language: 'css',
        code: `body {
  font-family: var(--font-roboto), Arial, sans-serif;
}`,
      },
      {
        type: 'table',
        headers: ['Font option', 'Meaning'],
        rows: [
          ['subsets', 'Character sets to include'],
          ['weight', 'Font weights your app needs'],
          ['className', 'Class applied directly to an element'],
          ['variable', 'CSS variable for more styling control'],
        ],
      },
      { type: 'note', text: 'next/font helps reduce layout shift by preparing font files in a Next.js-friendly way.' },
      { type: 'try', text: 'Add a font to app/layout.tsx and apply it to the body. Then change your global heading style to use the same font.' },
      { type: 'keypoints', items: ['next/font is the built-in font system in Next.js.', 'Google fonts can be imported from next/font/google.', 'Apply a font with className or a CSS variable.', 'Load only the font weights and subsets your app needs.'] },
    ],
  },
  {
    slug: 'nextjs-linking',
    title: 'Links & Navigation',
    description: 'Navigate between App Router pages with the Next.js Link component.',
    level: 'beginner',
    section: 'Routing Foundations',
    order: 14,
    minutes: 10,
    content: [
      { type: 'p', text: 'Next.js uses file-based routes, and the Link component lets users move between those routes without a full page reload.' },
      { type: 'h2', text: 'Use Link for internal navigation' },
      {
        type: 'code',
        title: 'components/MainNav.tsx',
        language: 'tsx',
        code: `import Link from 'next/link';

export function MainNav() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/courses">Courses</Link>
      <Link href="/about">About</Link>
    </nav>
  );
}`,
      },
      { type: 'p', text: 'Use Link when moving to another route inside your Next.js app. Use a normal anchor tag for external websites or special links like mailto.' },
      {
        type: 'code',
        title: 'Internal and external links',
        language: 'tsx',
        code: `import Link from 'next/link';

export default function AboutPage() {
  return (
    <main>
      <Link href="/courses">View courses</Link>
      <a href="https://nextjs.org">Visit Next.js docs</a>
    </main>
  );
}`,
      },
      { type: 'h2', text: 'Navigation belongs in layouts' },
      {
        type: 'code',
        title: 'app/layout.tsx',
        language: 'tsx',
        code: `import { MainNav } from '@/components/MainNav';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <MainNav />
        {children}
      </body>
    </html>
  );
}`,
      },
      {
        type: 'table',
        headers: ['Use', 'For'],
        rows: [
          ['Link', 'Routes inside your Next.js app'],
          ['a', 'External websites'],
          ['href="/"', 'The home page'],
          ['href="/blog/first-post"', 'A nested route'],
        ],
      },
      { type: 'tip', text: 'Place repeated navigation in a layout or shared component so every page stays consistent.' },
      { type: 'try', text: 'Create Home, Courses, and About pages. Add a shared navigation component with Link elements for all three routes.' },
      { type: 'keypoints', items: ['Use next/link for internal navigation.', 'The href should match an App Router path.', 'Use regular anchor tags for external links.', 'Shared navigation often belongs in a layout.'] },
    ],
  },
  {
    slug: 'nextjs-layouts',
    title: 'Layouts & Nested Layouts',
    description: 'Use App Router layouts to share UI across pages and route groups.',
    level: 'beginner',
    section: 'Routing Foundations',
    order: 15,
    minutes: 11,
    content: [
      { type: 'p', text: 'A layout wraps pages with shared UI. In Next.js, layouts are powerful because they can be placed at the root or inside nested route folders.' },
      { type: 'h2', text: 'Root layout' },
      { type: 'p', text: 'Every App Router app needs a root layout. It returns the html and body tags and renders children inside them.' },
      {
        type: 'code',
        title: 'app/layout.tsx',
        language: 'tsx',
        code: `export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header>Intellex</header>
        {children}
        <footer>Keep learning</footer>
      </body>
    </html>
  );
}`,
      },
      { type: 'h2', text: 'Nested layout' },
      { type: 'p', text: 'A nested layout only wraps routes inside its folder. This is useful for dashboards, course areas, account pages, and docs sections.' },
      {
        type: 'code',
        title: 'app/courses/layout.tsx',
        language: 'tsx',
        code: `export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <aside>Course menu</aside>
      <div>{children}</div>
    </section>
  );
}`,
      },
      {
        type: 'code',
        title: 'app/courses/page.tsx',
        language: 'tsx',
        code: `export default function CoursesPage() {
  return <h1>All courses</h1>;
}`,
      },
      {
        type: 'table',
        headers: ['Layout file', 'Wraps'],
        rows: [
          ['app/layout.tsx', 'Every route in the app'],
          ['app/courses/layout.tsx', '/courses and routes below it'],
          ['app/account/layout.tsx', '/account and routes below it'],
        ],
      },
      { type: 'note', text: 'Layouts stay mounted when users move between pages inside the same layout area. This helps preserve shared UI and improves navigation feel.' },
      { type: 'try', text: 'Create a courses layout with a sidebar and then add app/courses/page.tsx and app/courses/beginner/page.tsx to see the shared wrapper.' },
      { type: 'keypoints', items: ['Layouts wrap pages with shared UI.', 'The root layout includes html and body.', 'Nested layouts apply only to routes inside their folder.', 'Layouts receive children automatically from Next.js.'] },
    ],
  },
  {
    slug: 'nextjs-routing',
    title: 'File-based Routing',
    description: 'Learn how folders and page.tsx files create routes in the App Router.',
    level: 'beginner',
    section: 'Routing Foundations',
    order: 16,
    minutes: 10,
    content: [
      { type: 'p', text: 'File-based routing means your URL paths come from files and folders. In the App Router, a route exists when a folder contains a page.tsx file.' },
      { type: 'h2', text: 'Folders become URL segments' },
      {
        type: 'code',
        title: 'Routes from files',
        language: 'bash',
        code: `app/
  page.tsx              # /
  about/
    page.tsx            # /about
  courses/
    page.tsx            # /courses
    beginner/
      page.tsx          # /courses/beginner`,
      },
      { type: 'p', text: 'The folder names become parts of the URL. The page.tsx file provides the content for that route.' },
      { type: 'h2', text: 'Create a nested page' },
      {
        type: 'code',
        title: 'app/courses/beginner/page.tsx',
        language: 'tsx',
        code: `export default function BeginnerCoursePage() {
  return (
    <main>
      <h1>Beginner Courses</h1>
      <p>Start with friendly lessons and small examples.</p>
    </main>
  );
}`,
      },
      { type: 'h2', text: 'Route files have special names' },
      {
        type: 'table',
        headers: ['File name', 'Purpose'],
        rows: [
          ['page.tsx', 'Creates a visible route'],
          ['layout.tsx', 'Wraps pages in a route segment'],
          ['loading.tsx', 'Shows loading UI for a route segment'],
          ['error.tsx', 'Handles errors for a route segment'],
          ['not-found.tsx', 'Shows a 404-style page'],
        ],
      },
      {
        type: 'code',
        title: 'Link to a nested route',
        language: 'tsx',
        code: `import Link from 'next/link';

export function CourseLink() {
  return <Link href="/courses/beginner">Beginner courses</Link>;
}`,
      },
      { type: 'tip', text: 'When a route does not appear, check the folder name and confirm that it contains page.tsx.' },
      { type: 'try', text: 'Create a /pricing route and a /pricing/student route. Add links between them using next/link.' },
      { type: 'keypoints', items: ['Routes come from folders inside app.', 'A folder needs page.tsx to become a visible page.', 'Nested folders create nested URL paths.', 'Special route files add layouts, loading states, errors, and not-found pages.'] },
    ],
  },
  {
    slug: 'nextjs-dynamic-routes',
    title: 'Dynamic Routes',
    description: 'Use bracket folders to create pages for changing values like slugs and IDs.',
    level: 'beginner',
    section: 'Routing Foundations',
    order: 17,
    minutes: 11,
    content: [
      { type: 'p', text: 'A dynamic route uses part of the URL as a value. This is useful for blog posts, products, courses, user profiles, and anything with many detail pages.' },
      { type: 'h2', text: 'Use square brackets' },
      {
        type: 'code',
        title: 'Dynamic route file',
        language: 'bash',
        code: `app/
  courses/
    [slug]/
      page.tsx`,
      },
      { type: 'p', text: 'The route /courses/nextjs-beginner matches the [slug] folder and gives the page a slug value of nextjs-beginner.' },
      {
        type: 'code',
        title: 'app/courses/[slug]/page.tsx',
        language: 'tsx',
        code: `type CoursePageProps = {
  params: {
    slug: string;
  };
};

export default function CoursePage({ params }: CoursePageProps) {
  return (
    <main>
      <h1>Course: {params.slug}</h1>
      <p>This page was created from a dynamic route.</p>
    </main>
  );
}`,
      },
      { type: 'h2', text: 'Use the value to find data' },
      {
        type: 'code',
        title: 'Simple lookup example',
        language: 'tsx',
        code: `const courses = {
  'nextjs-beginner': 'Next.js Beginner',
  'javascript-beginner': 'JavaScript Beginner',
};

type CoursePageProps = {
  params: {
    slug: keyof typeof courses;
  };
};

export default function CoursePage({ params }: CoursePageProps) {
  const title = courses[params.slug];

  return <h1>{title}</h1>;
}`,
      },
      {
        type: 'table',
        headers: ['Folder', 'Matches'],
        rows: [
          ['[slug]', 'One URL segment such as nextjs-beginner'],
          ['[id]', 'One URL segment such as 42'],
          ['[category]/[slug]', 'Two URL segments such as courses/nextjs'],
        ],
      },
      { type: 'note', text: 'The name inside brackets becomes the key on params. A folder named [slug] gives you params.slug.' },
      { type: 'try', text: 'Create app/products/[id]/page.tsx and show the product ID from params.id on the page.' },
      { type: 'keypoints', items: ['Dynamic routes use bracket folder names.', 'params contains values from the URL.', 'Dynamic routes are ideal for detail pages.', 'The bracket name controls the params property name.'] },
    ],
  },
  {
    slug: 'nextjs-not-found',
    title: 'not-found & error.js',
    description: 'Show friendly 404 and error UI in App Router routes.',
    level: 'beginner',
    section: 'Routing Foundations',
    order: 18,
    minutes: 11,
    content: [
      { type: 'p', text: 'Real apps need friendly messages when a page is missing or something goes wrong. The App Router gives you special files for these cases.' },
      { type: 'h2', text: 'not-found.tsx for missing content' },
      {
        type: 'code',
        title: 'app/not-found.tsx',
        language: 'tsx',
        code: `import Link from 'next/link';

export default function NotFound() {
  return (
    <main>
      <h1>Page not found</h1>
      <p>The page you requested does not exist.</p>
      <Link href="/">Go home</Link>
    </main>
  );
}`,
      },
      { type: 'p', text: 'You can also call notFound from a page when data does not exist. Next.js will show the closest not-found.tsx file.' },
      {
        type: 'code',
        title: 'app/courses/[slug]/page.tsx',
        language: 'tsx',
        code: `import { notFound } from 'next/navigation';

const courses = ['nextjs-beginner', 'javascript-beginner'];

type CoursePageProps = {
  params: {
    slug: string;
  };
};

export default function CoursePage({ params }: CoursePageProps) {
  if (!courses.includes(params.slug)) {
    notFound();
  }

  return <h1>{params.slug}</h1>;
}`,
      },
      { type: 'h2', text: 'error.tsx for route errors' },
      { type: 'p', text: 'An error file catches unexpected errors in its route segment. It must be a Client Component because it can include a reset button for retrying.' },
      {
        type: 'code',
        title: 'app/courses/error.tsx',
        language: 'tsx',
        code: `'use client';

export default function CoursesError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main>
      <h1>Something went wrong</h1>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </main>
  );
}`,
      },
      {
        type: 'table',
        headers: ['File', 'Use it for'],
        rows: [
          ['not-found.tsx', 'Missing routes or missing data'],
          ['error.tsx', 'Unexpected errors in a route segment'],
          ['global-error.tsx', 'Rare app-wide error boundaries'],
        ],
      },
      { type: 'warning', text: 'Do not show private error details to regular users in production. Use friendly messages and log technical details safely.' },
      { type: 'try', text: 'Add app/not-found.tsx with a message and a Link back home. Then call notFound from a dynamic route when a value is unknown.' },
      { type: 'keypoints', items: ['not-found.tsx shows UI for missing pages or missing data.', 'Call notFound from next/navigation when data is not found.', 'error.tsx catches route errors and must use use client.', 'Friendly error UI helps users recover.'] },
    ],
  },
  {
    slug: 'nextjs-server-client',
    title: 'Server Components vs Client Components',
    description: 'Understand the modern Next.js component model and when to use use client.',
    level: 'beginner',
    section: 'Interactivity',
    order: 19,
    minutes: 14,
    content: [
      { type: 'p', text: 'Next.js App Router uses Server Components by default. This means most components render on the server unless you mark a file as a Client Component.' },
      { type: 'h2', text: 'Most UI can stay on the server' },
      { type: 'p', text: 'Server Components are great for pages, layouts, static content, data loading, and UI that does not need browser-only features. Keeping UI on the server can reduce the JavaScript sent to the browser.' },
      {
        type: 'code',
        title: 'A Server Component page',
        language: 'tsx',
        code: `export default async function CoursesPage() {
  const courses = ['Next.js Beginner', 'JavaScript Beginner'];

  return (
    <main>
      <h1>Courses</h1>
      <ul>
        {courses.map((course) => (
          <li key={course}>{course}</li>
        ))}
      </ul>
    </main>
  );
}`,
      },
      { type: 'h2', text: 'When to use use client' },
      { type: 'p', text: 'Add the use client directive at the top of a component file only when that component needs browser interactivity or browser APIs. Common reasons include useState, useEffect, click handlers, form input state, focus management, localStorage, window, and third-party browser widgets.' },
      {
        type: 'code',
        title: 'components/LikeButton.tsx',
        language: 'tsx',
        code: `'use client';

import { useState } from 'react';

export function LikeButton() {
  const [likes, setLikes] = useState(0);

  return (
    <button onClick={() => setLikes(likes + 1)}>
      Likes: {likes}
    </button>
  );
}`,
      },
      { type: 'h2', text: 'Combine server and client pieces' },
      { type: 'p', text: 'A common pattern is to keep the page as a Server Component and place only the interactive button, form, or widget in a Client Component.' },
      {
        type: 'code',
        title: 'app/page.tsx',
        language: 'tsx',
        code: `import { LikeButton } from '@/components/LikeButton';

export default function HomePage() {
  return (
    <main>
      <h1>Server-rendered page</h1>
      <p>This text can stay on the server.</p>
      <LikeButton />
    </main>
  );
}`,
      },
      {
        type: 'table',
        headers: ['Feature needed', 'Component type'],
        rows: [
          ['Read files, fetch data, render static UI', 'Server Component'],
          ['Use onClick or onChange', 'Client Component'],
          ['Use useState or useEffect', 'Client Component'],
          ['Use window or localStorage', 'Client Component'],
          ['Page metadata and layout shell', 'Usually Server Component'],
        ],
      },
      { type: 'note', text: 'The use client directive affects the file where it appears and components imported by that file. Keep it as low in the component tree as you can.' },
      { type: 'tip', text: 'Start with Server Components. Add Client Components only for the parts that truly need browser interactivity.' },
      { type: 'try', text: 'Take a page with a heading, paragraph, and button. Keep the page as a Server Component, then move only the button into a separate use client component.' },
      { type: 'keypoints', items: ['App Router components are Server Components by default.', 'Most Next.js UI can stay on the server.', 'Use use client for state, effects, event handlers, and browser APIs.', 'A strong pattern is a Server Component page with small Client Component islands.'] },
    ],
  },
  {
    slug: 'nextjs-use-state',
    title: 'useState for Interactive UI',
    description: 'Use React state in a Client Component to update the screen after user actions.',
    level: 'beginner',
    section: 'Interactivity',
    order: 20,
    minutes: 12,
    content: [
      { type: 'p', text: 'State is data that can change while a user interacts with the page. In Next.js App Router, state belongs in Client Components.' },
      { type: 'h2', text: 'Create a Client Component' },
      { type: 'p', text: 'To use useState, put use client at the top of the file and import useState from react.' },
      {
        type: 'code',
        title: 'components/Counter.tsx',
        language: 'tsx',
        code: `'use client';

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Add one</button>
    </div>
  );
}`,
      },
      { type: 'h2', text: 'Use the Client Component from a page' },
      {
        type: 'code',
        title: 'app/page.tsx',
        language: 'tsx',
        code: `import { Counter } from '@/components/Counter';

export default function HomePage() {
  return (
    <main>
      <h1>Interactive counter</h1>
      <Counter />
    </main>
  );
}`,
      },
      { type: 'h2', text: 'How useState works' },
      {
        type: 'table',
        headers: ['Part', 'Meaning'],
        rows: [
          ['count', 'The current state value'],
          ['setCount', 'The function that updates the value'],
          ['useState(0)', 'The starting value is 0'],
          ['onClick', 'Runs code when the button is clicked'],
        ],
      },
      {
        type: 'code',
        title: 'State with text',
        language: 'tsx',
        code: `'use client';

import { useState } from 'react';

export function GreetingSwitcher() {
  const [message, setMessage] = useState('Welcome');

  return (
    <section>
      <h2>{message}</h2>
      <button onClick={() => setMessage('Great job learning Next.js!')}>
        Change message
      </button>
    </section>
  );
}`,
      },
      { type: 'warning', text: 'Do not put useState in a default Server Component page. Move the interactive part into a Client Component instead.' },
      { type: 'try', text: 'Build a ShowMore component with state. It should show a short message first and reveal a longer message when a button is clicked.' },
      { type: 'keypoints', items: ['useState stores values that change in the browser.', 'Files that use useState need use client.', 'State updates cause React to show the new value.', 'Keep state close to the interactive UI that needs it.'] },
    ],
  },
  {
    slug: 'nextjs-events-forms',
    title: 'Events & Controlled Forms',
    description: 'Handle user events and build a controlled form in a Client Component.',
    level: 'beginner',
    section: 'Interactivity',
    order: 21,
    minutes: 13,
    content: [
      { type: 'p', text: 'Events are things users do, such as clicking, typing, submitting, focusing, or changing a selection. In Next.js, event handlers belong in Client Components.' },
      { type: 'h2', text: 'Handle a click' },
      {
        type: 'code',
        title: 'components/SaveButton.tsx',
        language: 'tsx',
        code: `'use client';

export function SaveButton() {
  function handleClick() {
    alert('Saved!');
  }

  return <button onClick={handleClick}>Save</button>;
}`,
      },
      { type: 'p', text: 'The onClick prop receives a function. React runs that function when the user clicks the button.' },
      { type: 'h2', text: 'Controlled form inputs' },
      { type: 'p', text: 'A controlled input stores its current value in state. The input displays the state value, and onChange updates that state as the user types.' },
      {
        type: 'code',
        title: 'components/SignupForm.tsx',
        language: 'tsx',
        code: `'use client';

import { useState } from 'react';

export function SignupForm() {
  const [email, setEmail] = useState('');

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    alert('Signing up: ' + email);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <button type="submit">Join</button>
    </form>
  );
}`,
      },
      {
        type: 'table',
        headers: ['Event', 'Common use'],
        rows: [
          ['onClick', 'Buttons, menus, toggles'],
          ['onChange', 'Inputs and selects'],
          ['onSubmit', 'Forms'],
          ['onFocus', 'Input focus states'],
        ],
      },
      { type: 'h2', text: 'Use the form from a page' },
      {
        type: 'code',
        title: 'app/page.tsx',
        language: 'tsx',
        code: `import { SignupForm } from '@/components/SignupForm';

export default function HomePage() {
  return (
    <main>
      <h1>Join the course waitlist</h1>
      <SignupForm />
    </main>
  );
}`,
      },
      { type: 'tip', text: 'Name event handler functions by what they handle, such as handleSubmit, handleChange, or handleClick.' },
      { type: 'warning', text: 'Forms that store typed values with useState must be Client Components, so remember the use client directive.' },
      { type: 'try', text: 'Build a ContactForm with name and message fields. Show an alert with both values when the form is submitted.' },
      { type: 'keypoints', items: ['Events run functions after user actions.', 'Event handlers require Client Components in the App Router.', 'Controlled inputs store their value in state.', 'Use event.preventDefault to stop the browser from reloading on form submit.'] },
    ],
  },
  {
    slug: 'nextjs-lists-keys',
    title: 'Lists & Keys',
    description: 'Render arrays of data in JSX and use keys correctly.',
    level: 'beginner',
    section: 'Interactivity',
    order: 22,
    minutes: 10,
    content: [
      { type: 'p', text: 'Most apps show lists: lessons, products, posts, messages, menu items, or search results. In JSX, you usually render a list with the JavaScript map method.' },
      { type: 'h2', text: 'Render an array' },
      {
        type: 'code',
        title: 'app/page.tsx',
        language: 'tsx',
        code: `const lessons = ['JSX', 'Components', 'Props'];

export default function HomePage() {
  return (
    <main>
      <h1>Lessons</h1>
      <ul>
        {lessons.map((lesson) => (
          <li key={lesson}>{lesson}</li>
        ))}
      </ul>
    </main>
  );
}`,
      },
      { type: 'p', text: 'map creates a new JSX element for every item in the array. Each top-level item needs a key.' },
      { type: 'h2', text: 'Lists of objects' },
      {
        type: 'code',
        title: 'Render course cards',
        language: 'tsx',
        code: `const courses = [
  { id: 'nextjs', title: 'Next.js Beginner', minutes: 250 },
  { id: 'js', title: 'JavaScript Beginner', minutes: 220 },
];

export default function CoursesPage() {
  return (
    <main>
      <h1>Courses</h1>
      {courses.map((course) => (
        <article key={course.id}>
          <h2>{course.title}</h2>
          <p>{course.minutes} minutes</p>
        </article>
      ))}
    </main>
  );
}`,
      },
      { type: 'h2', text: 'Why keys matter' },
      {
        type: 'table',
        headers: ['Key choice', 'Quality'],
        rows: [
          ['Stable database ID', 'Best'],
          ['Unique slug', 'Good'],
          ['Item title', 'Okay only if unique and stable'],
          ['Array index', 'Avoid when items can move, change, or be removed'],
        ],
      },
      {
        type: 'code',
        title: 'A reusable list component',
        language: 'tsx',
        code: `type Lesson = {
  slug: string;
  title: string;
};

export function LessonList({ lessons }: { lessons: Lesson[] }) {
  return (
    <ul>
      {lessons.map((lesson) => (
        <li key={lesson.slug}>{lesson.title}</li>
      ))}
    </ul>
  );
}`,
      },
      { type: 'note', text: 'A key is for React, not for your visible UI. Users do not see it, but React uses it to track list items.' },
      { type: 'try', text: 'Create an array of three products with id, name, and price. Render them as cards with key={product.id}.' },
      { type: 'keypoints', items: ['Use map to render arrays in JSX.', 'Every repeated top-level element needs a key.', 'Use stable unique values for keys, such as IDs or slugs.', 'Lists can be rendered in Server Components or Client Components depending on whether they need browser interactivity.'] },
    ],
  },
  {
    slug: 'nextjs-conditional',
    title: 'Conditional Rendering',
    description: 'Show different UI based on data, state, route values, or loading conditions.',
    level: 'beginner',
    section: 'Interactivity',
    order: 23,
    minutes: 10,
    content: [
      { type: 'p', text: 'Conditional rendering means showing different JSX depending on a value. It is how apps display empty states, login buttons, alerts, badges, and feature sections.' },
      { type: 'h2', text: 'Use an if statement before return' },
      {
        type: 'code',
        title: 'app/courses/page.tsx',
        language: 'tsx',
        code: `const courses: string[] = [];

export default function CoursesPage() {
  if (courses.length === 0) {
    return (
      <main>
        <h1>No courses yet</h1>
        <p>Check back soon.</p>
      </main>
    );
  }

  return <main>Course list goes here.</main>;
}`,
      },
      { type: 'h2', text: 'Use a ternary inside JSX' },
      {
        type: 'code',
        title: 'Conditional message',
        language: 'tsx',
        code: `export function WelcomeMessage({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <section>
      <h2>{isLoggedIn ? 'Welcome back!' : 'Please sign in'}</h2>
    </section>
  );
}`,
      },
      { type: 'h2', text: 'Use && for optional pieces' },
      {
        type: 'code',
        title: 'Optional badge',
        language: 'tsx',
        code: `type CourseCardProps = {
  title: string;
  featured: boolean;
};

export function CourseCard({ title, featured }: CourseCardProps) {
  return (
    <article>
      {featured && <strong>Featured</strong>}
      <h2>{title}</h2>
    </article>
  );
}`,
      },
      {
        type: 'table',
        headers: ['Pattern', 'Good for'],
        rows: [
          ['if before return', 'Different whole page states'],
          ['condition ? a : b', 'Choose between two values or elements'],
          ['condition && element', 'Show something only when true'],
          ['Early return', 'Empty, loading, or not allowed states'],
        ],
      },
      { type: 'tip', text: 'Keep conditions easy to read. If JSX becomes crowded, move a section into a named component.' },
      { type: 'note', text: 'Conditional rendering is a React idea you will use constantly in Next.js pages and components.' },
      { type: 'try', text: 'Build a CourseStatus component that shows Open, Full, or Coming soon based on a status prop.' },
      { type: 'keypoints', items: ['Conditional rendering shows UI based on values.', 'Use if statements for larger branches.', 'Use ternaries for choosing between two pieces.', 'Use && for optional elements that appear only when a condition is true.'] },
    ],
  },
  {
    slug: 'nextjs-use-effect',
    title: 'useEffect (When You Need the Browser)',
    description: 'Use useEffect carefully for browser-only side effects in Client Components.',
    level: 'beginner',
    section: 'Interactivity',
    order: 24,
    minutes: 12,
    content: [
      { type: 'p', text: 'useEffect runs code after a Client Component renders in the browser. In Next.js, you use it when you truly need browser-only work.' },
      { type: 'h2', text: 'When useEffect is useful' },
      { type: 'ul', items: ['Read from localStorage after the page loads.', 'Subscribe to browser events such as resize.', 'Work with browser-only libraries.', 'Send simple analytics events from the browser.'] },
      { type: 'warning', text: 'Do not use useEffect for everything. In Next.js, server data loading often belongs in Server Components, not in useEffect.' },
      {
        type: 'code',
        title: 'components/ThemeMessage.tsx',
        language: 'tsx',
        code: `'use client';

import { useEffect, useState } from 'react';

export function ThemeMessage() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('theme');

    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  return <p>Current theme: {theme}</p>;
}`,
      },
      { type: 'p', text: 'The empty dependency array means the effect runs after the component first appears in the browser.' },
      { type: 'h2', text: 'Clean up subscriptions' },
      {
        type: 'code',
        title: 'components/WindowWidth.tsx',
        language: 'tsx',
        code: `'use client';

import { useEffect, useState } from 'react';

export function WindowWidth() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <p>Window width: {width}px</p>;
}`,
      },
      {
        type: 'table',
        headers: ['Need', 'Usually use'],
        rows: [
          ['Fetch data for a page', 'Server Component'],
          ['Respond to a click', 'Event handler'],
          ['Read localStorage', 'useEffect in a Client Component'],
          ['Listen to window resize', 'useEffect with cleanup'],
        ],
      },
      { type: 'tip', text: 'If code mentions window, document, localStorage, or a browser event listener, it probably belongs in a Client Component and may need useEffect.' },
      { type: 'try', text: 'Create a Client Component that reads a saved username from localStorage in useEffect and displays a friendly message.' },
      { type: 'keypoints', items: ['useEffect runs after rendering in the browser.', 'Files using useEffect need use client.', 'Use it for browser-only side effects, not normal server data loading.', 'Return a cleanup function for subscriptions and event listeners.'] },
    ],
  },
  {
    slug: 'nextjs-metadata',
    title: 'Metadata & SEO Basics',
    description: 'Add page titles and descriptions with the App Router metadata API.',
    level: 'beginner',
    section: 'Shipping Basics',
    order: 25,
    minutes: 10,
    content: [
      { type: 'p', text: 'Metadata describes a page for browsers, search engines, and social previews. Good metadata helps users understand what a page is about before they open it.' },
      { type: 'h2', text: 'Add metadata to a page' },
      { type: 'p', text: 'In the App Router, you can export a metadata object from a page or layout. Next.js uses it to create tags in the document head.' },
      {
        type: 'code',
        title: 'app/page.tsx',
        language: 'tsx',
        code: `import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Next.js Beginner Course',
  description: 'Learn Next.js with friendly App Router lessons.',
};

export default function HomePage() {
  return (
    <main>
      <h1>Next.js Beginner Course</h1>
      <p>Start building modern web apps step by step.</p>
    </main>
  );
}`,
      },
      { type: 'h2', text: 'Default metadata in a layout' },
      {
        type: 'code',
        title: 'app/layout.tsx',
        language: 'tsx',
        code: `import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Intellex',
    template: '%s | Intellex',
  },
  description: 'Friendly tutorials for modern web development.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}`,
      },
      { type: 'h2', text: 'Dynamic metadata' },
      { type: 'p', text: 'Dynamic routes can generate metadata from route params or loaded data. This is useful for blog posts, courses, and product detail pages.' },
      {
        type: 'code',
        title: 'app/courses/[slug]/page.tsx',
        language: 'tsx',
        code: `import type { Metadata } from 'next';

type CoursePageProps = {
  params: {
    slug: string;
  };
};

export function generateMetadata({ params }: CoursePageProps): Metadata {
  return {
    title: params.slug,
    description: 'Course details and lessons.',
  };
}

export default function CoursePage({ params }: CoursePageProps) {
  return <h1>{params.slug}</h1>;
}`,
      },
      {
        type: 'table',
        headers: ['Metadata field', 'Purpose'],
        rows: [
          ['title', 'Browser tab and search result title'],
          ['description', 'Short summary for search previews'],
          ['openGraph', 'Social sharing previews'],
          ['robots', 'Search engine crawling instructions'],
        ],
      },
      { type: 'tip', text: 'Write titles for humans first. A clear title and useful description are better than keyword stuffing.' },
      { type: 'try', text: 'Add metadata to an About page. Use a title that includes the page name and a description under 160 characters.' },
      { type: 'keypoints', items: ['Metadata helps browsers, search engines, and social previews.', 'Export metadata from App Router pages or layouts.', 'Root layout metadata can provide defaults and title templates.', 'Use generateMetadata when metadata depends on route values or data.'] },
    ],
  },
];
