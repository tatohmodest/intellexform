import type { TutorialLesson } from '../types';

export const beginnerLessons: TutorialLesson[] = [
  {
    slug: 'what-is-react',
    title: 'What is React?',
    description: 'Understand React as a UI library, its declarative model, and why teams choose it for modern web apps.',
    level: 'beginner',
    section: 'Getting Started',
    order: 1,
    minutes: 10,
    content: [
      { type: 'p', text: 'React is a JavaScript library for building user interfaces. It was created at Facebook and is now maintained by Meta and a large open-source community. React focuses on one job: helping you describe what the screen should look like and keeping it in sync with your data.' },
      { type: 'p', text: 'Unlike a full framework, React does not ship routing, data fetching, or build tools by default. You combine React with tools like Vite, React Router, and eventually Next.js to build complete applications.' },
      { type: 'h2', text: 'Why React exists' },
      { type: 'p', text: 'Before component libraries, developers often wrote imperative DOM code: find an element, change its text, attach listeners, and repeat that logic across the app. As apps grew, that approach became hard to reason about and easy to break.' },
      { type: 'ul', items: ['React encourages reusable UI pieces called components.', 'You describe UI declaratively from data instead of manually patching the DOM.', 'A virtual DOM diffing algorithm updates only what changed, which keeps large UIs fast.'] },
      { type: 'h2', text: 'Where you will see React' },
      {
        type: 'table',
        headers: ['Context', 'Example use'],
        rows: [
          ['Marketing sites', 'Interactive landing pages with forms and animations'],
          ['Dashboards', 'Admin panels with tables, filters, and charts'],
          ['Learning platforms', 'Lesson players, progress tracking, and course catalogs'],
          ['Mobile apps', 'React Native uses the same component mental model'],
        ],
      },
      {
        type: 'code',
        title: 'A tiny React idea',
        language: 'jsx',
        code: `function Welcome({ name }) {
  return <h1>Hello, {name}</h1>;
}

// React renders this to the page
<Welcome name="Ada" />`,
      },
      { type: 'h2', text: 'React vs vanilla JavaScript' },
      { type: 'p', text: 'Vanilla JavaScript can absolutely build interactive UIs. React adds structure: predictable data flow, reusable components, and a rendering model that scales when many parts of the screen update together.' },
      {
        type: 'code',
        title: 'Vanilla DOM update (imperative)',
        language: 'javascript',
        code: `const heading = document.querySelector('h1');
heading.textContent = 'Hello, Ada';`,
      },
      {
        type: 'code',
        title: 'React update (declarative)',
        language: 'jsx',
        code: `function Page({ name }) {
  return <h1>Hello, {name}</h1>;
}
// Change name in state and React re-renders`,
      },
      { type: 'note', text: 'React is a library, not a language. You still write JavaScript (or TypeScript). JSX is syntax sugar that looks like HTML inside JavaScript.' },
      { type: 'tip', text: 'If you are comfortable with HTML, CSS, and JavaScript basics, you are ready for this track. You do not need to be an expert in all three first.' },
      { type: 'try', text: 'Open any modern web app you use daily. List five UI pieces that could be React components (navbar, search box, card, modal, footer).' },
      { type: 'keypoints', items: ['React is a JavaScript library for building user interfaces.', 'It uses a component-based, declarative model.', 'React handles efficient DOM updates when your data changes.', 'You will combine React with ecosystem tools for routing, data, and deployment.'] },
    ],
  },
  {
    slug: 'ui-equals-f-state',
    title: 'The Mental Model: UI = f(state)',
    description: 'Learn the core React idea: your UI is a function of state, and re-renders follow data changes.',
    level: 'beginner',
    section: 'Getting Started',
    order: 2,
    minutes: 12,
    content: [
      { type: 'p', text: 'The single most important idea in React is that your user interface is a function of state. If you know the current state, you can describe exactly what should appear on screen. When state changes, React runs your component again and updates the DOM to match.' },
      { type: 'h2', text: 'State drives the screen' },
      { type: 'p', text: 'Think of state as the memory of a component: whether a menu is open, what text is in a search field, which lesson is selected, or how many items are in a cart. The component reads state and returns JSX that reflects it.' },
      {
        type: 'code',
        title: 'UI as a function of state',
        language: 'jsx',
        code: `function LessonBadge({ completed }) {
  if (completed) {
    return <span className="badge done">Completed</span>;
  }
  return <span className="badge pending">In progress</span>;
}`,
      },
      { type: 'h2', text: 'Same input, same output' },
      { type: 'p', text: 'React components should behave like pure functions with respect to props and state: given the same inputs, they should return the same UI. That predictability makes debugging easier because you can trace what state produced what screen.' },
      {
        type: 'table',
        headers: ['Concept', 'Meaning'],
        rows: [
          ['State', 'Data that can change over time inside a component'],
          ['Props', 'Read-only inputs passed from a parent component'],
          ['Render', 'Calling your component function to produce JSX'],
          ['Re-render', 'Running the component again after state or props change'],
        ],
      },
      { type: 'h3', text: 'A practical example' },
      {
        type: 'code',
        title: 'Counter mental model',
        language: 'jsx',
        code: `import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  // UI = f(state): count is 0, button shows "0"
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}`,
      },
      { type: 'p', text: 'When the user clicks, state updates from 0 to 1. React calls Counter again with the new state. The button text updates to show 1. You did not manually find and edit the button in the DOM.' },
      { type: 'h2', text: 'Unidirectional data flow' },
      { type: 'p', text: 'Data flows down through props. Events flow up through callbacks. Parents own shared state; children receive values and notify parents when something should change. This one-way flow reduces surprises in large apps.' },
      {
        type: 'code',
        title: 'Data down, events up',
        language: 'jsx',
        code: `function Parent() {
  const [level, setLevel] = useState('beginner');
  return <LevelTabs value={level} onChange={setLevel} />;
}

function LevelTabs({ value, onChange }) {
  return (
    <button onClick={() => onChange('intermediate')}>
      Current: {value}
    </button>
  );
}`,
      },
      { type: 'warning', text: 'Do not mutate state directly. Always create a new value or use a setter so React knows something changed and can re-render.' },
      { type: 'try', text: 'Draw a simple login form on paper. Circle every piece of state (email, password, error message, loading). Write one sentence for each describing what UI it controls.' },
      { type: 'keypoints', items: ['UI = f(state): the screen reflects current data.', 'When state changes, React re-renders the component.', 'Props flow down; events flow up to parents.', 'Treat components as predictable functions of their inputs.'] },
    ],
  },
  {
    slug: 'vite-react-setup',
    title: 'Setting Up Vite + React',
    description: 'Create a modern React project with Vite, understand the folder structure, and run your first dev server.',
    level: 'beginner',
    section: 'Getting Started',
    order: 3,
    minutes: 14,
    content: [
      { type: 'p', text: 'Vite is a fast build tool and dev server for modern front-end projects. It is the recommended way to start a client-side React app before you move to full-stack frameworks like Next.js.' },
      { type: 'h2', text: 'Prerequisites' },
      { type: 'ul', items: ['Node.js 18 or newer installed on your machine.', 'A terminal and a code editor (VS Code is common).', 'Basic comfort running npm commands.'] },
      { type: 'h2', text: 'Create a new project' },
      { type: 'p', text: 'Run the official scaffolding command. Vite will ask you to pick a framework and variant. Choose React and TypeScript if you want types from day one (recommended for professional work).' },
      {
        type: 'code',
        title: 'Scaffold with Vite',
        language: 'bash',
        code: `npm create vite@latest my-react-app -- --template react-ts
cd my-react-app
npm install
npm run dev`,
      },
      { type: 'p', text: 'Open the URL shown in the terminal (usually http://localhost:5173). You should see the default Vite + React welcome page with a counter button.' },
      { type: 'h2', text: 'Key files and folders' },
      {
        type: 'table',
        headers: ['Path', 'Purpose'],
        rows: [
          ['index.html', 'Entry HTML shell; loads your JavaScript bundle'],
          ['src/main.tsx', 'Mounts the React app into the DOM'],
          ['src/App.tsx', 'Root component you edit first'],
          ['src/App.css', 'Component-scoped styles (can be replaced)'],
          ['vite.config.ts', 'Vite configuration (plugins, aliases)'],
          ['package.json', 'Dependencies and npm scripts'],
        ],
      },
      {
        type: 'code',
        title: 'main.tsx mounts React',
        language: 'tsx',
        code: `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);`,
      },
      {
        type: 'code',
        title: 'Your first edit in App.tsx',
        language: 'tsx',
        code: `export default function App() {
  return (
    <main>
      <h1>My React App</h1>
      <p>Built with Vite.</p>
    </main>
  );
}`,
      },
      { type: 'h2', text: 'npm scripts you will use' },
      { type: 'ol', items: ['npm run dev - start the dev server with hot module replacement.', 'npm run build - produce an optimized production bundle in dist/.', 'npm run preview - serve the production build locally for testing.'] },
      { type: 'note', text: 'StrictMode in development runs some checks twice to help you find unsafe side effects. That double render is intentional and only happens in dev.' },
      { type: 'tip', text: 'Install the React Developer Tools browser extension now. You will use it throughout this track.' },
      { type: 'try', text: 'Change the heading in App.tsx to your name, save the file, and confirm the browser updates instantly without a full page reload.' },
      { type: 'keypoints', items: ['Use npm create vite@latest to scaffold a React project.', 'src/main.tsx mounts your app; App.tsx is the root component.', 'npm run dev starts local development with fast refresh.', 'Vite handles JSX compilation and bundling for the browser.'] },
    ],
  },
  {
    slug: 'jsx-deep-dive',
    title: 'JSX Deep Dive',
    description: 'Master JSX syntax: expressions, attributes, rules, and how it compiles to JavaScript.',
    level: 'beginner',
    section: 'JSX & Components',
    order: 4,
    minutes: 15,
    content: [
      { type: 'p', text: 'JSX (JavaScript XML) lets you write markup that looks like HTML inside JavaScript. Browsers cannot run JSX directly. Vite uses a compiler (esbuild or Babel) to transform JSX into React.createElement calls.' },
      { type: 'h2', text: 'Expressions in curly braces' },
      { type: 'p', text: 'Anything inside { } is JavaScript. You can embed variables, function calls, arithmetic, and ternary expressions. You cannot embed statements like if or for directly inside JSX.' },
      {
        type: 'code',
        title: 'Embedding JavaScript in JSX',
        language: 'jsx',
        code: `const title = 'React Tutorial';
const minutes = 15;
const tags = ['frontend', 'hooks'];

export default function LessonHeader() {
  return (
    <header>
      <h1>{title}</h1>
      <p>About {minutes} minutes</p>
      <span>{tags.join(' · ')}</span>
    </header>
  );
}`,
      },
      { type: 'h2', text: 'JSX attribute rules' },
      {
        type: 'table',
        headers: ['HTML', 'JSX'],
        rows: [
          ['class', 'className'],
          ['for', 'htmlFor'],
          ['onclick', 'onClick'],
          ['tabindex', 'tabIndex'],
          ['style="color: red"', 'style={{ color: "red" }}'],
        ],
      },
      { type: 'p', text: 'Event handlers use camelCase. Inline style objects use camelCase CSS properties and double curly braces: the outer braces enter JavaScript mode; the inner object is a plain JavaScript object.' },
      {
        type: 'code',
        title: 'Attributes and inline styles',
        language: 'jsx',
        code: `<label htmlFor="email">Email</label>
<input
  id="email"
  className="input-field"
  style={{ padding: '8px', borderRadius: '4px' }}
  onChange={(e) => console.log(e.target.value)}
/>`,
      },
      { type: 'h2', text: 'Self-closing tags' },
      { type: 'p', text: 'In JSX, every tag must be explicitly closed. Elements with no children must self-close: <img />, <input />, <br />. Forgetting the slash is a common syntax error.' },
      {
        type: 'code',
        title: 'Valid self-closing elements',
        language: 'jsx',
        code: `<img src="/logo.svg" alt="Logo" />
<input type="search" placeholder="Find a lesson" />
<hr />`,
      },
      { type: 'h2', text: 'What JSX compiles to' },
      {
        type: 'code',
        title: 'JSX and createElement',
        language: 'javascript',
        code: `// JSX you write:
<h1 className="title">Hello</h1>

// Roughly compiles to:
React.createElement('h1', { className: 'title' }, 'Hello');`,
      },
      { type: 'warning', text: 'You cannot use if statements inside JSX braces. Compute values above the return, use a ternary, or use && for simple conditions.' },
      { type: 'h3', text: 'Returning multiple elements' },
      { type: 'p', text: 'A component return must have a single parent element. You will learn about Fragments in the next lesson as the lightweight wrapper when you do not want an extra div.' },
      { type: 'h2', text: 'Fragments: grouping without extra DOM' },
      { type: 'p', text: 'Components must return one parent element. Fragments let you group siblings without adding a wrapper div to the DOM.' },
      {
        type: 'code',
        title: 'Fragment short and long syntax',
        language: 'jsx',
        code: `import { Fragment } from 'react';

// Short syntax
export default function Profile() {
  return (
    <>
      <h1>Ada Lovelace</h1>
      <p>Computer science pioneer.</p>
    </>
  );
}

// Long syntax with key (required in lists)
rows.map((row) => (
  <Fragment key={row.id}>
    <td>{row.name}</td>
    <td>{row.score}</td>
  </Fragment>
))`,
      },
      { type: 'h3', text: 'JSX comments and common mistakes' },
      {
        type: 'table',
        headers: ['Mistake', 'Fix'],
        rows: [
          ['class instead of className', 'Use className for CSS classes'],
          ['Unclosed <img> or <input>', 'Self-close: <img />'],
          ['HTML comments <!-- -->', 'Use {/* comment */} inside JSX'],
          ['Two siblings without wrapper', 'Wrap in Fragment or parent element'],
        ],
      },
      { type: 'try', text: 'Convert a static HTML card (title, description, button) into a JSX function component that reads title and description from variables.' },
      { type: 'keypoints', items: ['JSX embeds JavaScript expressions inside curly braces.', 'Use className, camelCase events, and self-closing tags.', 'Fragments group elements without extra DOM nodes.', 'JSX compiles to React.createElement calls.'] },
    ],
  },
  {
    slug: 'function-components',
    title: 'Function Components',
    description: 'Build reusable UI with function components, exports, and component composition basics.',
    level: 'beginner',
    section: 'JSX & Components',
    order: 5,
    minutes: 14,
    content: [
      { type: 'p', text: 'A React component is a function that returns JSX. Modern React uses function components exclusively for new code. Each component should do one job well and have a clear, descriptive name in PascalCase.' },
      { type: 'h2', text: 'Defining and using components' },
      {
        type: 'code',
        title: 'A simple function component',
        language: 'jsx',
        code: `function Greeting({ name }) {
  return <h1>Hello, {name}</h1>;
}

export default function App() {
  return (
    <main>
      <Greeting name="Maya" />
      <Greeting name="Kai" />
    </main>
  );
}`,
      },
      { type: 'p', text: 'Component names must start with a capital letter. React treats lowercase tags as HTML elements (<div>) and capitalized tags as components (<Greeting>).' },
      { type: 'h2', text: 'Default vs named exports' },
      {
        type: 'code',
        title: 'Named and default exports',
        language: 'tsx',
        code: `// Button.tsx
export function Button({ children }) {
  return <button className="btn">{children}</button>;
}

// App.tsx
import { Button } from './Button';

// Card.tsx - one default export per file is common
export default function Card({ title }) {
  return <article><h2>{title}</h2></article>;
}`,
      },
      {
        type: 'table',
        headers: ['Pattern', 'When to use'],
        rows: [
          ['Default export', 'One main component per file (App, Layout)'],
          ['Named export', 'Multiple utilities or small components in one file'],
          ['index.ts barrel', 'Re-export public API of a feature folder'],
        ],
      },
      { type: 'h2', text: 'Composing components' },
      { type: 'p', text: 'Build complex UIs by nesting simple components. A page might compose a Header, Sidebar, and MainContent. Each piece can be developed and tested independently.' },
      {
        type: 'code',
        title: 'Page composition',
        language: 'jsx',
        code: `function CoursePage() {
  return (
    <div className="layout">
      <Header title="React Tutorial" />
      <Sidebar />
      <LessonContent />
    </div>
  );
}`,
      },
      { type: 'h3', text: 'Keep components focused' },
      { type: 'ul', items: ['If a component file exceeds roughly 150 lines, consider splitting it.', 'Extract repeated JSX into its own component.', 'Name components after what they render, not how they work internally.'] },
      { type: 'tip', text: 'Use one component per file for anything non-trivial. It makes imports, search, and code review easier.' },
      { type: 'try', text: 'Create three components: Avatar, UserName, and UserCard. Compose them so UserCard shows an avatar and name together.' },
      { type: 'keypoints', items: ['Components are functions that return JSX.', 'Use PascalCase names; lowercase tags are HTML.', 'Compose small components into larger UIs.', 'Choose default or named exports based on how the file is consumed.'] },
    ],
  },
  {
    slug: 'props-and-data-flow',
    title: 'Props and Data Flow',
    description: 'Pass read-only data from parent to child with props and understand one-way data flow.',
    level: 'beginner',
    section: 'JSX & Components',
    order: 6,
    minutes: 14,
    content: [
      { type: 'p', text: 'Props (short for properties) are how parents pass data to children. They are read-only: a child must never mutate props directly. Think of props as function arguments for your component.' },
      { type: 'h2', text: 'Passing and reading props' },
      {
        type: 'code',
        title: 'Props in action',
        language: 'jsx',
        code: `function TrackCard({ title, lessons, tag }) {
  return (
    <article className="card">
      <span className="tag">{tag}</span>
      <h3>{title}</h3>
      <p>{lessons} lessons</p>
    </article>
  );
}

export default function Catalog() {
  return (
    <TrackCard title="React" lessons={24} tag="Frontend" />
  );
}`,
      },
      { type: 'h2', text: 'Destructuring props' },
      { type: 'p', text: 'Destructure props in the parameter list for clarity. You can also set default values for optional props.' },
      {
        type: 'code',
        title: 'Defaults and destructuring',
        language: 'tsx',
        code: `type BadgeProps = {
  label: string;
  variant?: 'primary' | 'muted';
};

function Badge({ label, variant = 'primary' }: BadgeProps) {
  return <span className={\`badge badge-\${variant}\`}>{label}</span>;
}`,
      },
      { type: 'h2', text: 'Passing any JavaScript value' },
      { type: 'p', text: 'Strings can use quotes or braces. Numbers, booleans, objects, arrays, and functions must use braces.' },
      {
        type: 'code',
        title: 'Different prop types',
        language: 'jsx',
        code: `<LessonCard
  title="JSX Basics"
  minutes={12}
  locked={false}
  tags={['jsx', 'basics']}
  onSelect={() => console.log('selected')}
/>`,
      },
      {
        type: 'table',
        headers: ['Prop type', 'Syntax example'],
        rows: [
          ['String', 'title="Hello" or title={"Hello"}'],
          ['Number', 'count={42}'],
          ['Boolean', 'disabled={true} or just disabled for true shorthand'],
          ['Object', 'user={{ name: "Ada", id: 1 }}'],
          ['Function', 'onClick={() => handleClick()}'],
        ],
      },
      { type: 'h2', text: 'The spread props pattern' },
      {
        type: 'code',
        title: 'Forwarding props',
        language: 'jsx',
        code: `function Input({ label, ...inputProps }) {
  return (
    <label>
      {label}
      <input {...inputProps} />
    </label>
  );
}

<Input label="Email" type="email" placeholder="you@example.com" />`,
      },
      { type: 'warning', text: 'Never do props.items.push(newItem) or props.user.name = "x". Mutating props breaks React assumptions and causes subtle bugs.' },
      { type: 'try', text: 'Build Avatar({ name, size }) that renders initials in a circle. Render three avatars with different sizes on one page.' },
      { type: 'keypoints', items: ['Props are read-only inputs from parent to child.', 'Destructure props for cleaner component signatures.', 'Pass functions as props to let children notify parents.', 'Data flows one way: down through props, up through callbacks.'] },
    ],
  },
  {
    slug: 'children-and-composition',
    title: 'Children and Composition',
    description: 'Use the children prop and composition patterns to build flexible layout components.',
    level: 'beginner',
    section: 'JSX & Components',
    order: 7,
    minutes: 13,
    content: [
      { type: 'p', text: 'When you nest JSX between a component opening and closing tags, React passes that content as props.children. This composition pattern is how you build flexible wrappers like cards, panels, and layouts without hard-coding inner content.' },
      { type: 'h2', text: 'The children prop' },
      {
        type: 'code',
        title: 'Layout wrapper with children',
        language: 'jsx',
        code: `function Panel({ title, children }) {
  return (
    <section className="panel">
      <h2>{title}</h2>
      <div className="panel-body">{children}</div>
    </section>
  );
}

<Panel title="Getting Started">
  <p>Welcome to the React track.</p>
  <button>Start lesson 1</button>
</Panel>`,
      },
      { type: 'h2', text: 'Composition over configuration' },
      { type: 'p', text: 'Instead of a Card component with twelve boolean props (showHeader, showFooter, headerAlign, etc.), accept children and let callers compose what they need.' },
      {
        type: 'code',
        title: 'Flexible Card via composition',
        language: 'jsx',
        code: `function Card({ children }) {
  return <article className="card">{children}</article>;
}

function CardHeader({ children }) {
  return <header className="card-header">{children}</header>;
}

function CardBody({ children }) {
  return <div className="card-body">{children}</div>;
}

<Card>
  <CardHeader>React Tutorial</CardHeader>
  <CardBody>48 lessons from JSX to architecture.</CardBody>
</Card>`,
      },
      { type: 'h3', text: 'Rendering children conditionally' },
      {
        type: 'code',
        title: 'Optional children',
        language: 'jsx',
        code: `function Alert({ variant, children }) {
  if (!children) return null;
  return <div className={\`alert alert-\${variant}\`}>{children}</div>;
}`,
      },
      { type: 'h2', text: 'Specialization through composition' },
      { type: 'p', text: 'You can wrap a generic component to create a specialized one. A PrimaryButton can be a Button with preset variant props rather than a completely separate implementation.' },
      {
        type: 'code',
        title: 'Specializing a generic Button',
        language: 'jsx',
        code: `function Button({ variant = 'default', children, ...props }) {
  return (
    <button className={\`btn btn-\${variant}\`} {...props}>
      {children}
    </button>
  );
}

function PrimaryButton(props) {
  return <Button variant="primary" {...props} />;
}`,
      },
      {
        type: 'table',
        headers: ['Pattern', 'Use when'],
        rows: [
          ['children', 'Wrapper does not care about inner structure'],
          ['Named slots (header, footer props)', 'Specific regions with known roles'],
          ['Render props', 'Parent needs to control rendering with child data'],
        ],
      },
      { type: 'tip', text: 'If you find yourself passing many React elements as separate props, consider using children or a single children tree with subcomponents.' },
      { type: 'try', text: 'Create a PageLayout with Header, Main, and Footer subcomponents. Compose a sample course page using all three.' },
      { type: 'keypoints', items: ['Nested JSX becomes props.children.', 'Composition builds flexible layouts without prop explosion.', 'Specialize generic components instead of duplicating markup.', 'Prefer composition when the wrapper should not own inner content.'] },
    ],
  },
  {
    slug: 'conditional-rendering',
    title: 'Conditional Rendering',
    description: 'Show different UI with if/return, ternaries, logical AND, and switch patterns.',
    level: 'beginner',
    section: 'JSX & Components',
    order: 8,
    minutes: 13,
    content: [
      { type: 'p', text: 'Real interfaces change based on state: loading spinners, empty lists, locked content, error messages. React has no special template syntax for conditions. You use plain JavaScript inside and around your JSX.' },
      { type: 'h2', text: 'Early return' },
      { type: 'p', text: 'When a condition should replace the entire component output, return early before the main JSX. This keeps the happy path unindented and readable.' },
      {
        type: 'code',
        title: 'Guard clauses',
        language: 'jsx',
        code: `function LessonGate({ locked, title }) {
  if (locked) {
    return (
      <div className="paywall">
        <p>Unlock {title} to continue.</p>
        <button>Upgrade</button>
      </div>
    );
  }

  return (
    <article>
      <h1>{title}</h1>
      <p>Lesson content here.</p>
    </article>
  );
}`,
      },
      { type: 'h2', text: 'Ternary operator' },
      { type: 'p', text: 'Use condition ? <A /> : <B /> when you need one of two elements inline. Keep ternaries short; nested ternaries become hard to read.' },
      {
        type: 'code',
        title: 'Inline ternary',
        language: 'jsx',
        code: `{isSaving ? (
  <span className="spinner">Saving...</span>
) : (
  <button type="submit">Save</button>
)}`,
      },
      { type: 'h2', text: 'Logical AND (&&)' },
      { type: 'p', text: 'When you only need to show something or nothing, && is concise: {showBanner && <Banner />}.' },
      {
        type: 'code',
        title: 'AND pattern and the zero trap',
        language: 'jsx',
        code: `// Good: boolean condition
{items.length > 0 && <ItemList items={items} />}

// Risky: if count is 0, React renders "0" on screen
{count && <Badge count={count} />}

// Safe alternative
{count > 0 && <Badge count={count} />}`,
      },
      { type: 'h2', text: 'Storing UI in a variable' },
      {
        type: 'code',
        title: 'Compute before return',
        language: 'jsx',
        code: `function StatusMessage({ status }) {
  let message;
  if (status === 'loading') message = <Spinner />;
  else if (status === 'error') message = <ErrorBanner />;
  else message = <Content />;

  return <div className="status">{message}</div>;
}`,
      },
      {
        type: 'table',
        headers: ['Pattern', 'Best for'],
        rows: [
          ['Early return', 'Entire component should change'],
          ['Ternary', 'Two alternatives inline'],
          ['&&', 'Show or hide a single element'],
          ['Variable before return', 'Three or more branches'],
        ],
      },
      { type: 'warning', text: 'Do not put side effects inside condition expressions. Call functions and set state in event handlers or effects, not inside JSX conditionals.' },
      { type: 'try', text: 'Build a PricingBadge component that shows "Free", "Pro", or "Enterprise" based on a plan prop using a switch or object lookup.' },
      { type: 'keypoints', items: ['Use if/return, ternary, &&, or variables for conditions.', 'Early returns simplify components with guard states.', 'Never let 0 render accidentally with &&.', 'Keep complex branching out of nested JSX ternaries.'] },
    ],
  },
  {
    slug: 'lists-and-keys',
    title: 'Lists and Keys',
    description: 'Render collections with map, choose stable keys, and avoid common list rendering bugs.',
    level: 'beginner',
    section: 'JSX & Components',
    order: 9,
    minutes: 14,
    content: [
      { type: 'p', text: 'Most screens show lists: lessons, messages, products, table rows. In React you transform an array into an array of JSX elements with .map(). Each item needs a key so React can track identity across updates.' },
      { type: 'h2', text: 'Rendering with map' },
      {
        type: 'code',
        title: 'Basic list',
        language: 'jsx',
        code: `const lessons = [
  { id: 'jsx', title: 'JSX Deep Dive', minutes: 15 },
  { id: 'props', title: 'Props and Data Flow', minutes: 14 },
  { id: 'state', title: 'useState Deep Dive', minutes: 16 },
];

export default function LessonList() {
  return (
    <ul>
      {lessons.map((lesson) => (
        <li key={lesson.id}>
          {lesson.title} ({lesson.minutes} min)
        </li>
      ))}
    </ul>
  );
}`,
      },
      { type: 'h2', text: 'Extracting a list item component' },
      {
        type: 'code',
        title: 'List item component',
        language: 'jsx',
        code: `function LessonRow({ lesson, onSelect }) {
  return (
    <li>
      <button onClick={() => onSelect(lesson.id)}>
        {lesson.title}
      </button>
    </li>
  );
}

function LessonList({ lessons, onSelect }) {
  return (
    <ul>
      {lessons.map((lesson) => (
        <LessonRow key={lesson.id} lesson={lesson} onSelect={onSelect} />
      ))}
    </ul>
  );
}`,
      },
      { type: 'h2', text: 'Why keys matter' },
      { type: 'p', text: 'Keys tell React which item corresponds to which DOM node when the list reorders, items are inserted, or items are deleted. Without stable keys, React may reuse the wrong DOM node and preserve incorrect internal state.' },
      {
        type: 'table',
        headers: ['Key source', 'Recommendation'],
        rows: [
          ['Database id or slug', 'Best choice - stable and unique'],
          ['UUID assigned at creation', 'Good for client-generated lists'],
          ['Array index', 'Avoid when list can reorder or filter'],
          ['Random per render', 'Never - causes full remount every render'],
        ],
      },
      { type: 'h3', text: 'Filtering before mapping' },
      {
        type: 'code',
        title: 'Filtered list',
        language: 'jsx',
        code: `function FrontendLessons({ lessons }) {
  const visible = lessons.filter((l) => l.tag === 'Frontend');
  return (
    <ul>
      {visible.map((lesson) => (
        <li key={lesson.id}>{lesson.title}</li>
      ))}
    </ul>
  );
}`,
      },
      { type: 'warning', text: 'Do not use key as a regular prop inside the child. If you need the id in the child, pass it as a separate prop: <Row id={item.id} key={item.id} />.' },
      { type: 'note', text: 'Keys only need to be unique among siblings in the same list, not globally across the entire app.' },
      { type: 'try', text: 'Render a list of tutorial cards filtered by level. Include an empty state message when the filter returns zero results.' },
      { type: 'keypoints', items: ['Use .map to transform data arrays into JSX lists.', 'Keys must be stable, unique among siblings, and never random.', 'Prefer database ids over array indices.', 'Filter or sort data before mapping when possible.'] },
    ],
  },
  {
    slug: 'usestate-deep-dive',
    title: 'useState Deep Dive',
    description: 'Master useState: initial state, functional updates, batching, and multiple state variables.',
    level: 'beginner',
    section: 'State & Forms',
    order: 10,
    minutes: 16,
    content: [
      { type: 'p', text: 'useState is the hook that adds local state to function components. It returns a value and a setter function. Calling the setter schedules a re-render with the new state.' },
      { type: 'h2', text: 'Basic usage' },
      {
        type: 'code',
        title: 'Counter with useState',
        language: 'jsx',
        code: `import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}`,
      },
      { type: 'h2', text: 'Lazy initial state' },
      { type: 'p', text: 'If computing initial state is expensive, pass a function to useState. React calls it only on the first render.' },
      {
        type: 'code',
        title: 'Lazy initializer',
        language: 'jsx',
        code: `function ExpensiveStart() {
  const [items, setItems] = useState(() => {
    return JSON.parse(localStorage.getItem('items') ?? '[]');
  });
  // ...
}`,
      },
      { type: 'h2', text: 'Functional updates' },
      { type: 'p', text: 'When the next state depends on the previous state, pass a function to the setter: setCount(c => c + 1). This avoids stale values when multiple updates happen in the same event or async callback.' },
      {
        type: 'code',
        title: 'Functional setter form',
        language: 'jsx',
        code: `// Risky in rapid clicks - may use stale count
setCount(count + 1);

// Safe - always uses latest state
setCount((c) => c + 1);

// Works for objects and arrays too
setUser((prev) => ({ ...prev, name: 'Ada' }));`,
      },
      { type: 'h2', text: 'Multiple state variables' },
      { type: 'p', text: 'Split unrelated state into separate useState calls. A form might have email, password, and error as three variables rather than one big object, unless they always change together.' },
      {
        type: 'code',
        title: 'Separate state slices',
        language: 'jsx',
        code: `function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Each field updates independently
}`,
      },
      {
        type: 'table',
        headers: ['Situation', 'Approach'],
        rows: [
          ['Independent values', 'Multiple useState calls'],
          ['Always updated together', 'Single object state or useReducer'],
          ['Derived from other state', 'Compute during render, do not store separately'],
          ['Expensive initial value', 'Lazy initializer function'],
        ],
      },
      { type: 'h3', text: 'State is asynchronous' },
      { type: 'p', text: 'After calling setCount(count + 1), count still holds the old value until the next render. Do not read state immediately expecting it to update. Use the functional form or useEffect when you need to react to changes.' },
      { type: 'tip', text: 'React batches multiple setState calls in the same event handler into one re-render for performance.' },
      { type: 'try', text: 'Build a like button that toggles between liked and not liked, updating both an icon and a count using functional updates.' },
      { type: 'keypoints', items: ['useState returns [value, setter].', 'Use functional updates when next state depends on previous.', 'Split unrelated state into multiple useState calls.', 'State updates are asynchronous; expect new values on the next render.'] },
    ],
  },
  {
    slug: 'immutable-state-updates',
    title: 'Immutable State Updates',
    description: 'Update objects and arrays in state correctly by creating new values instead of mutating.',
    level: 'beginner',
    section: 'State & Forms',
    order: 11,
    minutes: 15,
    content: [
      { type: 'p', text: 'React compares state by reference for objects and arrays. If you mutate an existing object in place, React may not detect a change and skip re-rendering. Always create a new object or array when updating state.' },
      { type: 'h2', text: 'Updating objects' },
      {
        type: 'code',
        title: 'Spread operator for objects',
        language: 'jsx',
        code: `const [user, setUser] = useState({ name: 'Ada', role: 'student' });

// Wrong - mutates existing object
user.role = 'admin';
setUser(user);

// Correct - new object
setUser({ ...user, role: 'admin' });`,
      },
      { type: 'h2', text: 'Updating arrays' },
      {
        type: 'code',
        title: 'Common array updates',
        language: 'jsx',
        code: `const [todos, setTodos] = useState([]);

// Add item
setTodos((prev) => [...prev, { id: '1', text: 'Learn JSX' }]);

// Remove item
setTodos((prev) => prev.filter((t) => t.id !== '1'));

// Update one item
setTodos((prev) =>
  prev.map((t) => (t.id === '1' ? { ...t, done: true } : t)),
);`,
      },
      { type: 'h2', text: 'Nested structures' },
      { type: 'p', text: 'For nested objects, spread at each level you need to change. For deep trees, consider flattening state, using useReducer, or a library like Immer with useImmer.' },
      {
        type: 'code',
        title: 'Nested update',
        language: 'jsx',
        code: `setProfile((prev) => ({
  ...prev,
  address: {
    ...prev.address,
    city: 'London',
  },
}));`,
      },
      {
        type: 'table',
        headers: ['Operation', 'Immutable pattern'],
        rows: [
          ['Add to array', '[...arr, newItem]'],
          ['Remove from array', 'arr.filter(...)'],
          ['Update array item', 'arr.map(...)'],
          ['Update object field', '{ ...obj, field: newValue }'],
          ['Toggle boolean', 'setOn((v) => !v)'],
        ],
      },
      { type: 'h3', text: 'Why immutability helps' },
      { type: 'ul', items: ['React can quickly check if state changed by comparing references.', 'Time-travel debugging and undo features are easier with immutable history.', 'Derived data with useMemo can skip work when inputs are unchanged.'] },
      { type: 'warning', text: 'Array methods like .sort() and .reverse() mutate in place. Copy first: [...arr].sort(...).' },
      { type: 'try', text: 'Implement a shopping cart: add item, remove item, and update quantity using only immutable array/object updates.' },
      { type: 'keypoints', items: ['Never mutate state directly; create new objects and arrays.', 'Use spread and map/filter for common updates.', 'Spread each nested level you modify.', 'Copy arrays before calling mutating methods like sort.'] },
    ],
  },
  {
    slug: 'event-handlers',
    title: 'Event Handlers in React',
    description: 'Handle user interactions with synthetic events, handler patterns, and passing arguments.',
    level: 'beginner',
    section: 'State & Forms',
    order: 12,
    minutes: 14,
    content: [
      { type: 'p', text: 'React wraps browser events in SyntheticEvent objects for cross-browser consistency. You attach handlers with camelCase props like onClick, onChange, and onSubmit.' },
      { type: 'h2', text: 'Basic click handler' },
      {
        type: 'code',
        title: 'Inline vs named handler',
        language: 'jsx',
        code: `function SaveButton() {
  function handleClick() {
    console.log('Saved');
  }

  return (
    <>
      <button onClick={handleClick}>Save</button>
      <button onClick={() => console.log('Quick action')}>
        Quick
      </button>
    </>
  );
}`,
      },
      { type: 'h2', text: 'The event object' },
      {
        type: 'code',
        title: 'Reading event.target',
        language: 'jsx',
        code: `function SearchInput() {
  const [query, setQuery] = useState('');

  function handleChange(event) {
    setQuery(event.target.value);
  }

  return <input value={query} onChange={handleChange} />;
}`,
      },
      { type: 'h2', text: 'Passing arguments to handlers' },
      { type: 'p', text: 'If you call the handler immediately in JSX (onClick={handleClick(id)}), it runs during render. Wrap in an arrow function so it runs on click.' },
      {
        type: 'code',
        title: 'Handler with item id',
        language: 'jsx',
        code: `function LessonList({ lessons, onDelete }) {
  return (
    <ul>
      {lessons.map((lesson) => (
        <li key={lesson.id}>
          {lesson.title}
          <button onClick={() => onDelete(lesson.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}`,
      },
      { type: 'h2', text: 'preventDefault and stopPropagation' },
      {
        type: 'code',
        title: 'Form submit',
        language: 'jsx',
        code: `function LoginForm() {
  function handleSubmit(event) {
    event.preventDefault();
    // handle login without full page reload
  }

  return <form onSubmit={handleSubmit}>...</form>;
}`,
      },
      {
        type: 'table',
        headers: ['Method', 'Purpose'],
        rows: [
          ['event.preventDefault()', 'Stop default browser behavior (form submit, link navigation)'],
          ['event.stopPropagation()', 'Stop event from bubbling to parent elements'],
          ['event.target', 'The DOM element that triggered the event'],
        ],
      },
      { type: 'note', text: 'In React 17+, events delegate to the root container, not document. You rarely need to worry about this, but it explains consistent behavior across React versions.' },
      { type: 'warning', text: 'Do not forget preventDefault on forms unless you want a full page reload.' },
      { type: 'try', text: 'Build a color picker with three buttons. Each button calls a shared handler with a different color argument.' },
      { type: 'keypoints', items: ['Use camelCase event props: onClick, onChange, onSubmit.', 'Pass function references, not function calls, unless wrapping arguments.', 'Call preventDefault on forms to avoid page reloads.', 'Read input values from event.target in change handlers.'] },
    ],
  },
  {
    slug: 'controlled-forms',
    title: 'Controlled Forms',
    description: 'Build forms where React state is the single source of truth for every field value.',
    level: 'beginner',
    section: 'State & Forms',
    order: 13,
    minutes: 16,
    content: [
      { type: 'p', text: 'A controlled input has its value driven by React state. Every keystroke flows through onChange into state, and the input re-renders with the new value. React owns the field, which makes validation and submission predictable.' },
      { type: 'h2', text: 'Text input' },
      {
        type: 'code',
        title: 'Controlled text field',
        language: 'jsx',
        code: `import { useState } from 'react';

export default function SearchBox() {
  const [query, setQuery] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    console.log('Search:', query);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Find a lesson"
      />
      <button type="submit">Search</button>
    </form>
  );
}`,
      },
      { type: 'h2', text: 'Checkbox and select' },
      {
        type: 'code',
        title: 'Other controlled inputs',
        language: 'jsx',
        code: `const [agreed, setAgreed] = useState(false);
const [level, setLevel] = useState('beginner');

<input
  type="checkbox"
  checked={agreed}
  onChange={(e) => setAgreed(e.target.checked)}
/>

<select value={level} onChange={(e) => setLevel(e.target.value)}>
  <option value="beginner">Beginner</option>
  <option value="intermediate">Intermediate</option>
</select>`,
      },
      { type: 'h2', text: 'Multiple fields' },
      {
        type: 'code',
        title: 'Form with several fields',
        language: 'jsx',
        code: `function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    console.log({ email, password });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Sign up</button>
    </form>
  );
}`,
      },
      { type: 'h2', text: 'Controlled vs uncontrolled' },
      {
        type: 'table',
        headers: ['Approach', 'When to use'],
        rows: [
          ['Controlled (value + onChange)', 'Most forms, validation, instant feedback'],
          ['Uncontrolled (useRef)', 'Simple one-off fields, file inputs, integrating non-React libs'],
          ['Default value only', 'Rare; hard to reset or validate programmatically'],
        ],
      },
      { type: 'h3', text: 'Resetting a form' },
      { type: 'p', text: 'To clear controlled fields, reset state to initial values. For example, setEmail("") and setPassword("") after successful submit.' },
      { type: 'tip', text: 'Disable the submit button while isSubmitting is true to prevent double submissions.' },
      { type: 'try', text: 'Create a login form with email, password, and inline error message state. Log credentials on submit and show an error if email is empty.' },
      { type: 'keypoints', items: ['Controlled inputs bind value and onChange to state.', 'React state is the single source of truth for field values.', 'Use preventDefault on submit handlers.', 'Reset forms by resetting state, not by manipulating the DOM.'] },
    ],
  },
  {
    slug: 'styling-classname-css-modules',
    title: 'Styling with className and CSS Modules',
    description: 'Apply styles with className, CSS files, and CSS Modules for scoped component styles.',
    level: 'beginner',
    section: 'State & Forms',
    order: 14,
    minutes: 14,
    content: [
      { type: 'p', text: 'React does not prescribe a styling solution. Common approaches include plain CSS files, CSS Modules, utility frameworks like Tailwind, and CSS-in-JS libraries. This lesson covers className and CSS Modules, which work well in Vite projects.' },
      { type: 'h2', text: 'className instead of class' },
      {
        type: 'code',
        title: 'Static classes',
        language: 'jsx',
        code: `import './Card.css';

function Card({ title, children }) {
  return (
    <article className="card">
      <h2 className="card-title">{title}</h2>
      {children}
    </article>
  );
}`,
      },
      { type: 'h2', text: 'Dynamic class names' },
      {
        type: 'code',
        title: 'Conditional classes',
        language: 'jsx',
        code: `function Alert({ type, children }) {
  const className = type === 'error' ? 'alert alert-error' : 'alert alert-info';
  return <div className={className}>{children}</div>;
}

// Or template literals
<button className={\`btn \${isActive ? 'btn-active' : ''}\`}>
  Toggle
</button>`,
      },
      { type: 'h2', text: 'CSS Modules' },
      { type: 'p', text: 'CSS Modules scope class names to a file. Vite supports them out of the box with the .module.css extension. Imported class names become unique at build time, preventing accidental global collisions.' },
      {
        type: 'code',
        title: 'Card.module.css + component',
        language: 'tsx',
        code: `// Card.module.css
// .card { border: 1px solid #ddd; padding: 1rem; }

import styles from './Card.module.css';

export function Card({ children }) {
  return <article className={styles.card}>{children}</article>;
}`,
      },
      {
        type: 'table',
        headers: ['Approach', 'Pros', 'Cons'],
        rows: [
          ['Global CSS', 'Simple, familiar', 'Name collisions at scale'],
          ['CSS Modules', 'Scoped, no runtime cost', 'Slightly more boilerplate'],
          ['Tailwind utilities', 'Fast iteration', 'Verbose class strings in JSX'],
          ['CSS-in-JS', 'Co-located styles', 'Runtime or build complexity'],
        ],
      },
      { type: 'h3', text: 'Organizing styles' },
      { type: 'ul', items: ['Keep global resets and typography in index.css.', 'Colocate Card.module.css next to Card.tsx.', 'Use a small set of design tokens (colors, spacing) for consistency.'] },
      { type: 'note', text: 'You can combine multiple classes with a utility like clsx or classnames, but template literals are enough for small projects.' },
      { type: 'try', text: 'Style a profile card with CSS Modules: avatar circle, name, bio, and a primary button. Add a modifier class for a compact variant.' },
      { type: 'keypoints', items: ['Use className, not class, in JSX.', 'CSS Modules scope styles per component file.', 'Build dynamic class strings with template literals or helpers.', 'Choose a styling approach that fits your team and project scale.'] },
    ],
  },
  {
    slug: 'thinking-in-react',
    title: 'Thinking in React',
    description: 'Break UIs into component trees, identify state, and decide where data should live.',
    level: 'beginner',
    section: 'First Projects',
    order: 15,
    minutes: 15,
    content: [
      { type: 'p', text: 'Thinking in React is a design process: start with a mock or description, break the UI into components, build a static version, identify state, determine where state lives, and add interactivity. This method prevents over-engineering and messy data flow.' },
      { type: 'h2', text: 'Step 1: Break the UI into components' },
      { type: 'p', text: 'Draw boxes around every major UI region and label them with PascalCase names. If a region repeats, it is probably one component used multiple times.' },
      {
        type: 'code',
        title: 'Course hub component tree',
        language: 'text',
        code: `CourseHub
├── Header (title, progress)
├── LevelTabs (beginner | intermediate | advanced)
├── SearchBar
└── LessonList
    └── LessonCard (title, minutes, locked icon)`,
      },
      { type: 'h2', text: 'Step 2: Build a static version first' },
      { type: 'p', text: 'Render the UI with props and hard-coded data. No state yet. This confirms your component boundaries before you add complexity.' },
      { type: 'h2', text: 'Step 3: Identify minimal state' },
      {
        type: 'ul',
        items: [
          'Does it change over time? If no, it is not state.',
          'Can you compute it from other state or props? If yes, do not store it.',
          'Does only one component need it? Keep it local.',
          'Do siblings need the same value? Lift state to their parent.',
        ],
      },
      { type: 'h2', text: 'Step 4: Lift state up' },
      {
        type: 'code',
        title: 'Shared filter state in parent',
        language: 'jsx',
        code: `function CourseHub({ lessons }) {
  const [level, setLevel] = useState('beginner');
  const [query, setQuery] = useState('');

  const visible = lessons.filter(
    (l) => l.level === level && l.title.includes(query),
  );

  return (
    <>
      <LevelTabs value={level} onChange={setLevel} />
      <SearchBar value={query} onChange={setQuery} />
      <LessonList lessons={visible} />
    </>
  );
}`,
      },
      {
        type: 'table',
        headers: ['Question', 'Action'],
        rows: [
          ['Is it props from parent?', 'Not state in this component'],
          ['Is it computed from props/state?', 'Derive during render'],
          ['Used by one component only?', 'Local useState'],
          ['Shared by siblings?', 'Lift to common parent'],
        ],
      },
      { type: 'h3', text: 'Single source of truth' },
      { type: 'p', text: 'Every piece of state should live in exactly one component. Pass it down as props and pass setters or callbacks up. Duplicating state in multiple places leads to sync bugs.' },
      { type: 'try', text: 'Sketch a chat UI: message list, composer, user list. Mark which pieces are state and which component owns each piece.' },
      { type: 'keypoints', items: ['Break UIs into a hierarchy of components.', 'Build static UI before adding state.', 'Keep state minimal; derive values when possible.', 'Lift shared state to the closest common parent.'] },
    ],
  },
  {
    slug: 'debugging-react-devtools',
    title: 'Debugging with React DevTools',
    description: 'Inspect component trees, props, state, and re-renders using React Developer Tools.',
    level: 'beginner',
    section: 'First Projects',
    order: 16,
    minutes: 13,
    content: [
      { type: 'p', text: 'React Developer Tools is a browser extension that lets you inspect the component tree, view props and state, and profile performance. It is essential for professional React development.' },
      { type: 'h2', text: 'Install and open' },
      { type: 'ol', items: ['Install React Developer Tools for Chrome, Firefox, or Edge.', 'Open your app with npm run dev.', 'Open browser DevTools and find the Components (or React) tab.'] },
      { type: 'h2', text: 'Inspecting components' },
      { type: 'p', text: 'Click the picker icon and select an element on the page. DevTools highlights the component that rendered it. You can walk up the tree to see parents and children.' },
      {
        type: 'table',
        headers: ['Panel', 'Shows'],
        rows: [
          ['Components tree', 'Hierarchy of React components'],
          ['Props', 'Read-only inputs for selected component'],
          ['Hooks / State', 'useState values and other hooks'],
          ['Rendered by', 'Which parent rendered this component'],
        ],
      },
      { type: 'h2', text: 'Debugging workflow' },
      { type: 'ol', items: ['Reproduce the bug in the browser.', 'Find the component responsible using the picker.', 'Check props and state - is data what you expect?', 'Add console.log or breakpoints in the component source.', 'Fix state or props, confirm re-render shows correct values.'] },
      {
        type: 'code',
        title: 'Strategic console.log',
        language: 'jsx',
        code: `function LessonCard({ lesson }) {
  console.log('LessonCard render', lesson.slug, lesson);
  return <article>{lesson.title}</article>;
}`,
      },
      { type: 'h2', text: 'Common issues to spot' },
      { type: 'ul', items: ['State not updating: check if you mutated instead of replacing.', 'Unexpected re-renders: check if parent passes new object/function each render.', 'Missing UI: check conditional rendering and early returns.', 'Wrong list behavior: verify keys are stable.'] },
      { type: 'h3', text: 'Highlight updates' },
      { type: 'p', text: 'In DevTools settings, enable Highlight updates when components render. Flashing borders show which components re-render when you interact. Helpful for spotting unnecessary renders early.' },
      { type: 'tip', text: 'Name your components (function LessonCard, not anonymous) so they appear clearly in the tree.' },
      { type: 'warning', text: 'console.log in render runs every re-render. Remove debug logs before committing or gate them behind import.meta.env.DEV.' },
      { type: 'try', text: 'Open your Vite app in DevTools, select a component, edit a useState value in the hooks panel, and watch the UI update.' },
      { type: 'keypoints', items: ['React DevTools shows the component tree, props, and state.', 'Use the element picker to find which component rendered UI.', 'Verify state and props when debugging unexpected UI.', 'Enable highlight updates to see re-render behavior.'] },
    ],
  },
  {
    slug: 'mini-project-todo-list',
    title: 'Mini Project: Todo List',
    description: 'Build a complete todo list app applying components, state, events, lists, and immutable updates.',
    level: 'beginner',
    section: 'First Projects',
    order: 17,
    minutes: 20,
    content: [
      { type: 'p', text: 'This mini project combines everything from the beginner section: components, useState, events, lists, keys, conditional rendering, and immutable updates. You will build a functional todo list with add, toggle complete, and delete.' },
      { type: 'h2', text: 'Requirements' },
      { type: 'ol', items: ['Display a list of todos with text and completed status.', 'Add a new todo from a text input and submit button.', 'Toggle a todo between done and not done.', 'Delete a todo from the list.', 'Show count of remaining items.', 'Show an empty state when there are no todos.'] },
      { type: 'h2', text: 'Component structure' },
      {
        type: 'code',
        title: 'Suggested component tree',
        language: 'text',
        code: `TodoApp
├── NewTodoForm (input + add button)
├── TodoStats (remaining count)
└── TodoList
    └── TodoItem (checkbox, text, delete button)`,
      },
      { type: 'h2', text: 'State shape' },
      {
        type: 'code',
        title: 'Todo type and initial state',
        language: 'tsx',
        code: `type Todo = {
  id: string;
  text: string;
  done: boolean;
};

const [todos, setTodos] = useState<Todo[]>([]);`,
      },
      { type: 'h2', text: 'Core operations' },
      {
        type: 'code',
        title: 'Add, toggle, delete',
        language: 'jsx',
        code: `function addTodo(text) {
  setTodos((prev) => [
    ...prev,
    { id: crypto.randomUUID(), text, done: false },
  ]);
}

function toggleTodo(id) {
  setTodos((prev) =>
    prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
  );
}

function deleteTodo(id) {
  setTodos((prev) => prev.filter((t) => t.id !== id));
}`,
      },
      {
        type: 'code',
        title: 'TodoList with keys',
        language: 'jsx',
        code: `function TodoList({ todos, onToggle, onDelete }) {
  if (todos.length === 0) {
    return <p>No todos yet. Add one above.</p>;
  }

  return (
    <ul>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}`,
      },
      { type: 'h3', text: 'Stretch goals' },
      { type: 'ul', items: ['Filter: All / Active / Completed.', 'Persist todos to localStorage (preview of custom hooks).', 'Add basic CSS Modules styling.'] },
      { type: 'tip', text: 'Build the static list first with hard-coded todos, then add state and handlers one at a time.' },
      { type: 'try', text: 'Implement the todo app in your Vite project. Test add, toggle, delete, and the empty state before adding stretch features.' },
      { type: 'keypoints', items: ['Break the app into focused components.', 'Store todos as an array of objects with stable ids.', 'Use immutable map/filter for updates.', 'Handle empty state explicitly in the UI.'] },
    ],
  },
  {
    slug: 'mini-project-profile-card',
    title: 'Mini Project: Profile Card',
    description: 'Build a polished profile card with props, composition, conditional UI, and CSS Modules.',
    level: 'beginner',
    section: 'First Projects',
    order: 18,
    minutes: 18,
    content: [
      { type: 'p', text: 'This second mini project focuses on presentation and composition rather than complex state. You will build a reusable profile card suitable for a team page, course instructor list, or social dashboard.' },
      { type: 'h2', text: 'Requirements' },
      { type: 'ol', items: ['Show avatar (image or initials fallback), name, role, and short bio.', 'Accept props for name, role, bio, avatarUrl, and isOnline.', 'Show an online/offline indicator based on isOnline.', 'Support a compact variant via a size prop.', 'Use CSS Modules for scoped styles.', 'Compose smaller pieces: Avatar, Badge, ProfileCard.'] },
      { type: 'h2', text: 'Avatar with fallback' },
      {
        type: 'code',
        title: 'Initials fallback',
        language: 'jsx',
        code: `function Avatar({ name, imageUrl, size = 'md' }) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  if (imageUrl) {
    return <img src={imageUrl} alt={name} className={styles.avatar} />;
  }

  return <div className={styles.initials}>{initials}</div>;
}`,
      },
      { type: 'h2', text: 'ProfileCard composition' },
      {
        type: 'code',
        title: 'Main card component',
        language: 'jsx',
        code: `function ProfileCard({ name, role, bio, avatarUrl, isOnline, size = 'md' }) {
  return (
    <article className={\`\${styles.card} \${styles[size]}\`}>
      <Avatar name={name} imageUrl={avatarUrl} size={size} />
      <div className={styles.body}>
        <div className={styles.header}>
          <h2>{name}</h2>
          <StatusBadge online={isOnline} />
        </div>
        <p className={styles.role}>{role}</p>
        <p className={styles.bio}>{bio}</p>
      </div>
    </article>
  );
}`,
      },
      {
        type: 'code',
        title: 'Status badge',
        language: 'jsx',
        code: `function StatusBadge({ online }) {
  return (
    <span className={online ? styles.online : styles.offline}>
      {online ? 'Online' : 'Offline'}
    </span>
  );
}`,
      },
      { type: 'h2', text: 'Rendering a grid' },
      {
        type: 'code',
        title: 'Profile grid page',
        language: 'jsx',
        code: `const team = [
  { id: '1', name: 'Ada Lovelace', role: 'Instructor', bio: '...', isOnline: true },
  { id: '2', name: 'Grace Hopper', role: 'Mentor', bio: '...', isOnline: false },
];

export default function TeamPage() {
  return (
    <div className={styles.grid}>
      {team.map((person) => (
        <ProfileCard key={person.id} {...person} />
      ))}
    </div>
  );
}`,
      },
      { type: 'h3', text: 'Polish checklist' },
      { type: 'ul', items: ['Consistent spacing and border radius.', 'Hover state on the card.', 'Accessible alt text on images.', 'Readable contrast for online/offline badges.'] },
      { type: 'try', text: 'Build the profile card, render a grid of three team members, and add a compact variant for a sidebar widget.' },
      { type: 'keypoints', items: ['Compose ProfileCard from smaller presentational components.', 'Use props for all variable content.', 'Conditional classes handle variants and status.', 'CSS Modules keep styles scoped and maintainable.'] },
    ],
  },
];
