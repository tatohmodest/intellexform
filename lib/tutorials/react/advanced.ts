import type { TutorialLesson } from '../types';

export const advancedLessons: TutorialLesson[] = [
  {
    slug: 'usememo-usecallback',
    title: 'useMemo and useCallback',
    description: 'Apply useMemo and useCallback correctly for expensive calculations and stable references.',
    level: 'advanced',
    section: 'Performance',
    order: 35,
    minutes: 16,
    content: [
      { type: 'p', text: 'useMemo and useCallback are performance hooks that cache values and functions between renders. They are not free: they add memory and comparison overhead. Use them when you have measured a problem or when a stable reference is required by a child API.' },
      { type: 'h2', text: 'useMemo caches a computed value' },
      {
        type: 'code',
        title: 'Expensive filter memoized',
        language: 'jsx',
        code: `import { useMemo, useState } from 'react';

function LessonCatalog({ lessons }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(
    () => lessons.filter((l) => l.title.toLowerCase().includes(query.toLowerCase())),
    [lessons, query],
  );

  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <LessonList lessons={filtered} />
    </>
  );
}`,
      },
      { type: 'p', text: 'useMemo recalculates only when lessons or query changes. For a 20-item list, this is unnecessary. For 10,000 items with complex filtering, it can help.' },
      { type: 'h2', text: 'useCallback caches a function' },
      {
        type: 'code',
        title: 'Stable handler for memoized child',
        language: 'jsx',
        code: `import { useCallback, memo } from 'react';

const LessonRow = memo(function LessonRow({ lesson, onSelect }) {
  return (
    <li>
      <button onClick={() => onSelect(lesson.id)}>{lesson.title}</button>
    </li>
  );
});

function LessonList({ lessons, onSelect }) {
  const handleSelect = useCallback(
    (id) => onSelect(id),
    [onSelect],
  );

  return lessons.map((l) => (
    <LessonRow key={l.id} lesson={l} onSelect={handleSelect} />
  ));
}`,
      },
      { type: 'h2', text: 'When NOT to use them' },
      {
        type: 'table',
        headers: ['Situation', 'Recommendation'],
        rows: [
          ['Cheap calculation on small data', 'Compute during render'],
          ['Child is not memoized', 'useCallback alone helps nothing'],
          ['Premature optimization', 'Profile first with React DevTools'],
          ['Every render creates new deps anyway', 'Fix the root cause in parent'],
        ],
      },
      { type: 'h3', text: 'Object and array literals in deps' },
      {
        type: 'code',
        title: 'New object every render breaks memo',
        language: 'jsx',
        code: `// Parent creates new config every render
<Chart config={{ color: 'blue', height: 200 }} />

// Fix: memoize config or pass primitives
const config = useMemo(() => ({ color: 'blue', height: 200 }), []);`,
      },
      { type: 'warning', text: 'Do not wrap every function in useCallback by default. It clutters code and can slow down simple apps.' },
      { type: 'note', text: 'React Compiler (experimental) can auto-memoize in some setups. Manual hooks remain essential knowledge for most teams today.' },
      { type: 'try', text: 'Profile a list filter with 5,000 items. Add useMemo only if the filter block shows up in the profiler.' },
      { type: 'keypoints', items: ['useMemo caches expensive derived values.', 'useCallback caches function references for stable deps.', 'Only optimize after measuring or when APIs require stable refs.', 'Fix unnecessary re-renders in parents before adding memo hooks.'] },
    ],
  },
  {
    slug: 'react-memo',
    title: 'React.memo',
    description: 'Skip re-renders of pure components when props are shallowly equal.',
    level: 'advanced',
    section: 'Performance',
    order: 36,
    minutes: 14,
    content: [
      { type: 'p', text: 'React.memo wraps a component and skips re-rendering if props are shallowly equal to the previous render. It pairs with useCallback and useMemo when a parent re-renders often but a pure child receives the same props.' },
      { type: 'h2', text: 'Basic memo usage' },
      {
        type: 'code',
        title: 'Memoized row component',
        language: 'jsx',
        code: `import { memo } from 'react';

const LessonRow = memo(function LessonRow({ lesson }) {
  console.log('render', lesson.id);
  return <li>{lesson.title}</li>;
});

function LessonList({ lessons, selectedId }) {
  return (
    <ul>
      {lessons.map((l) => (
        <LessonRow key={l.id} lesson={l} />
      ))}
    </ul>
  );
}`,
      },
      { type: 'p', text: 'When selectedId changes, LessonList re-renders. Memoized LessonRow components skip re-render if their lesson prop is the same reference.' },
      { type: 'h2', text: 'Custom comparison function' },
      {
        type: 'code',
        title: 'Compare specific fields',
        language: 'jsx',
        code: `const LessonRow = memo(
  function LessonRow({ lesson }) {
    return <li>{lesson.title}</li>;
  },
  (prev, next) => prev.lesson.id === next.lesson.id && prev.lesson.title === next.lesson.title,
);`,
      },
      { type: 'h2', text: 'When memo helps and hurts' },
      {
        type: 'table',
        headers: ['Helps', 'Hurts'],
        rows: [
          ['Large lists of pure rows', 'Components that always get new props'],
          ['Expensive render in child', 'Cheap renders on tiny trees'],
          ['Stable props from memoized parent', 'Deep prop objects that change often'],
        ],
      },
      { type: 'h3', text: 'memo does not help if props change every time' },
      {
        type: 'code',
        title: 'Broken memo pattern',
        language: 'jsx',
        code: `// New function every parent render - memo is useless
<LessonRow lesson={lesson} onClick={() => select(lesson.id)} />

// Fix: stable callback via useCallback or pass id only
<LessonRow lesson={lesson} lessonId={lesson.id} onSelect={handleSelect} />`,
      },
      { type: 'tip', text: 'Extract slow subtrees into memoized components only after React DevTools Profiler shows they re-render unnecessarily.' },
      { type: 'warning', text: 'memo compares props shallowly. A new object with identical values still fails the check.' },
      { type: 'try', text: 'Enable highlight updates in DevTools. Add memo to a list row only if rows flash on unrelated parent state changes.' },
      { type: 'keypoints', items: ['React.memo skips render when props are shallow-equal.', 'Pair with stable callbacks from useCallback.', 'Custom comparators compare specific fields when needed.', 'Profile before memoizing; memo has its own cost.'] },
    ],
  },
  {
    slug: 'use-transition-deferred-value',
    title: 'useTransition and useDeferredValue',
    description: 'Keep the UI responsive during expensive updates with React concurrent features.',
    level: 'advanced',
    section: 'Performance',
    order: 37,
    minutes: 15,
    content: [
      { type: 'p', text: 'React 18 introduced concurrent rendering: the ability to interrupt low-priority updates so urgent ones (like typing) stay smooth. useTransition and useDeferredValue mark updates as non-urgent.' },
      { type: 'h2', text: 'useTransition' },
      {
        type: 'code',
        title: 'Defer heavy filter while typing',
        language: 'jsx',
        code: `import { useState, useTransition } from 'react';

function Search({ items }) {
  const [text, setText] = useState('');
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();

  function onChange(e) {
    const next = e.target.value;
    setText(next); // urgent: keep input responsive
    startTransition(() => setQuery(next)); // non-urgent filter
  }

  const visible = items.filter((i) => i.includes(query));

  return (
    <>
      <input value={text} onChange={onChange} />
      {isPending && <span>Updating...</span>}
      <List items={visible} />
    </>
  );
}`,
      },
      { type: 'h2', text: 'useDeferredValue' },
      { type: 'p', text: 'When you do not control the state setter (e.g. props drive the value), useDeferredValue lags behind the urgent value so expensive derived UI can catch up.' },
      {
        type: 'code',
        title: 'Deferred prop value',
        language: 'jsx',
        code: `import { useDeferredValue, useMemo } from 'react';

function SearchResults({ query, items }) {
  const deferredQuery = useDeferredValue(query);

  const results = useMemo(
    () => heavyFilter(items, deferredQuery),
    [items, deferredQuery],
  );

  const isStale = query !== deferredQuery;
  return <List items={results} dimmed={isStale} />;
}`,
      },
      {
        type: 'table',
        headers: ['API', 'Use when'],
        rows: [
          ['startTransition', 'You control the state update'],
          ['useDeferredValue', 'Value comes from props or external store'],
          ['isPending', 'Show subtle loading during transition'],
          ['Both', 'Large lists, charts, or complex filters on user input'],
        ],
      },
      { type: 'h3', text: 'What transitions do not fix' },
      { type: 'ul', items: ['Slow network requests (use loading states and caching).', 'Layout thrashing from massive DOM (virtualize lists).', 'Blocking main thread work (move to Web Worker).'] },
      { type: 'note', text: 'Transitions work best with Suspense boundaries and memoized expensive children. The deferred update still runs on the main thread.' },
      { type: 'try', text: 'Build a search over 3,000 items. Without transitions, notice input lag. Add startTransition and compare.' },
      { type: 'keypoints', items: ['useTransition marks state updates as non-urgent.', 'useDeferredValue lags a value for expensive derived UI.', 'Keep input state urgent; defer heavy filtering or rendering.', 'Show isPending feedback for long transitions.'] },
    ],
  },
  {
    slug: 'error-boundaries',
    title: 'Error Boundaries',
    description: 'Catch render errors and show fallback UI so one broken widget does not crash the app.',
    level: 'advanced',
    section: 'Quality',
    order: 38,
    minutes: 14,
    content: [
      { type: 'p', text: 'Error boundaries catch JavaScript errors in their child component tree during rendering, in lifecycle methods, and in constructors. They do not catch errors in event handlers, async code, or server-side rendering unless you add separate handling.' },
      { type: 'h2', text: 'Class component boundary' },
      { type: 'p', text: 'There is no useErrorBoundary hook built into React yet. The standard pattern is still a class component with getDerivedStateFromError and optionally componentDidCatch.' },
      {
        type: 'code',
        title: 'ErrorBoundary class',
        language: 'jsx',
        code: `import { Component } from 'react';

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Boundary caught:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <p>Something went wrong.</p>;
    }
    return this.props.children;
  }
}`,
      },
      { type: 'h2', text: 'Granular boundaries' },
      {
        type: 'code',
        title: 'Wrap risky widgets only',
        language: 'jsx',
        code: `function LessonPage() {
  return (
    <article>
      <LessonHeader />
      <ErrorBoundary fallback={<p>Chart failed to load.</p>}>
        <ProgressChart />
      </ErrorBoundary>
      <LessonContent />
    </article>
  );
}`,
      },
      { type: 'h2', text: 'What boundaries do not catch' },
      {
        type: 'table',
        headers: ['Caught', 'Not caught'],
        rows: [
          ['Render errors in children', 'Errors in event handlers'],
          ['Errors in child lifecycle methods', 'Async errors in useEffect (use try/catch)'],
          ['Errors in constructors of children', 'Errors in the boundary itself'],
        ],
      },
      { type: 'h3', text: 'Event handler errors' },
      {
        type: 'code',
        title: 'try/catch in handlers',
        language: 'jsx',
        code: `async function handleSave() {
  try {
    await saveLesson(data);
  } catch (error) {
    setError('Save failed. Try again.');
  }
}`,
      },
      { type: 'tip', text: 'Libraries like react-error-boundary provide a functional API and reset keys. The class pattern above is enough to understand the concept.' },
      { type: 'warning', text: 'Do not wrap your entire app in one boundary without logging. Users need a recovery path; developers need error telemetry.' },
      { type: 'try', text: 'Wrap a component that throws when a prop is missing. Confirm the fallback renders while siblings still work.' },
      { type: 'keypoints', items: ['Error boundaries catch render-time errors in child trees.', 'Use class components or a library wrapper today.', 'Place boundaries around risky subtrees, not only at the root.', 'Event and async errors need try/catch separately.'] },
    ],
  },
  {
    slug: 'accessibility-react',
    title: 'Accessibility in React',
    description: 'Build inclusive UIs with semantic HTML, ARIA, keyboard support, and focus management.',
    level: 'advanced',
    section: 'Quality',
    order: 39,
    minutes: 15,
    content: [
      { type: 'p', text: 'Accessible React apps work for keyboard users, screen reader users, and people with low vision or motor differences. Most accessibility comes from correct HTML semantics, not from ARIA sprinkled on divs.' },
      { type: 'h2', text: 'Semantic HTML first' },
      {
        type: 'code',
        title: 'Prefer native elements',
        language: 'jsx',
        code: `// Better: native button is focusable and announces role
<button type="button" onClick={onClose}>Close</button>

// Avoid: div pretending to be a button
<div onClick={onClose}>Close</div>`,
      },
      { type: 'h2', text: 'Labels and form fields' },
      {
        type: 'code',
        title: 'Accessible form',
        language: 'jsx',
        code: `<label htmlFor="email">Email</label>
<input
  id="email"
  type="email"
  autoComplete="email"
  aria-invalid={!!errors.email}
  aria-describedby={errors.email ? 'email-error' : undefined}
/>
{errors.email && (
  <p id="email-error" role="alert">{errors.email}</p>
)}`,
      },
      { type: 'h2', text: 'Keyboard and focus' },
      {
        type: 'table',
        headers: ['Requirement', 'Implementation'],
        rows: [
          ['All interactive elements focusable', 'Use button, a, input, or tabIndex={0} sparingly'],
          ['Visible focus styles', 'Do not remove outline without a replacement'],
          ['Modal traps focus', 'Focus first element on open; restore on close'],
          ['Escape closes overlays', 'onKeyDown handler on modal'],
        ],
      },
      { type: 'h3', text: 'Modal accessibility' },
      {
        type: 'code',
        title: 'Dialog attributes',
        language: 'jsx',
        code: `<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="dialog-title"
>
  <h2 id="dialog-title">Confirm delete</h2>
  <button onClick={onConfirm}>Delete</button>
  <button onClick={onClose}>Cancel</button>
</div>`,
      },
      { type: 'h2', text: 'Live regions for dynamic content' },
      {
        type: 'code',
        title: 'Announce async status',
        language: 'jsx',
        code: `<div aria-live="polite" aria-atomic="true">
  {status === 'loading' && 'Loading lessons...'}
  {status === 'error' && 'Failed to load lessons.'}
</div>`,
      },
      { type: 'note', text: 'Test with keyboard only (Tab, Enter, Escape) and with a screen reader (VoiceOver, NVDA). Automated tools like axe catch about 30-40% of issues.' },
      { type: 'try', text: 'Audit your todo app: every input has a label, buttons are real button elements, and error messages use role="alert".' },
      { type: 'keypoints', items: ['Use semantic HTML before reaching for ARIA.', 'Wire labels with htmlFor and id.', 'Manage focus in modals and route changes.', 'Announce dynamic updates with aria-live regions.'] },
    ],
  },
  {
    slug: 'testing-vitest-rtl',
    title: 'Testing with Vitest and Testing Library',
    description: 'Write user-centric component tests with Vitest, React Testing Library, and user-event.',
    level: 'advanced',
    section: 'Quality',
    order: 40,
    minutes: 16,
    content: [
      { type: 'p', text: 'React Testing Library (RTL) encourages tests that resemble how users interact with your app. Vitest is a fast test runner that works well with Vite projects. Together they form a modern testing stack for React.' },
      { type: 'h2', text: 'Setup in Vite' },
      {
        type: 'code',
        title: 'Install testing dependencies',
        language: 'bash',
        code: `npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom`,
      },
      {
        type: 'code',
        title: 'vitest.config.ts snippet',
        language: 'typescript',
        code: `/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
});`,
      },
      { type: 'h2', text: 'Testing behavior, not implementation' },
      {
        type: 'code',
        title: 'Counter test',
        language: 'tsx',
        code: `import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import Counter from './Counter';

describe('Counter', () => {
  it('increments on click', async () => {
    const user = userEvent.setup();
    render(<Counter />);
    await user.click(screen.getByRole('button', { name: /count/i }));
    expect(screen.getByRole('button')).toHaveTextContent('Count: 1');
  });
});`,
      },
      { type: 'h2', text: 'Query priority' },
      {
        type: 'table',
        headers: ['Priority', 'Query'],
        rows: [
          ['1 (best)', 'getByRole'],
          ['2', 'getByLabelText'],
          ['3', 'getByPlaceholderText / getByText'],
          ['Avoid', 'getByTestId (unless no better option)'],
        ],
      },
      { type: 'h3', text: 'Testing async UI' },
      {
        type: 'code',
        title: 'Wait for loaded content',
        language: 'tsx',
        code: `import { render, screen, waitFor } from '@testing-library/react';

it('shows lessons after load', async () => {
  render(<LessonCatalog />);
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
  await waitFor(() => {
    expect(screen.getByText('JSX Deep Dive')).toBeInTheDocument();
  });
});`,
      },
      { type: 'warning', text: 'Do not test internal state variables or component instances. Assert on what the user sees and can do.' },
      { type: 'tip', text: 'Mock fetch or API modules at the boundary. Test components, not implementation details of your data layer.' },
      { type: 'try', text: 'Write tests for your SearchBox: type a query, submit the form, and assert the results region updates.' },
      { type: 'keypoints', items: ['Vitest runs fast unit and component tests in Vite projects.', 'Query by role, label, and accessible name.', 'Use userEvent for realistic interactions.', 'Test outcomes visible to users, not internal state.'] },
    ],
  },
  {
    slug: 'typescript-with-react',
    title: 'TypeScript with React',
    description: 'Type components, props, events, hooks, and context for safer React codebases.',
    level: 'advanced',
    section: 'Quality',
    order: 41,
    minutes: 16,
    content: [
      { type: 'p', text: 'TypeScript catches prop mismatches, missing fields, and incorrect event types before runtime. Modern React types ship with @types/react. Vite React TS templates include them by default.' },
      { type: 'h2', text: 'Typing component props' },
      {
        type: 'code',
        title: 'Props interface',
        language: 'tsx',
        code: `type LessonCardProps = {
  title: string;
  minutes: number;
  locked?: boolean;
  onSelect: (slug: string) => void;
};

export function LessonCard({ title, minutes, locked = false, onSelect }: LessonCardProps) {
  return (
    <article>
      <h3>{title}</h3>
      <p>{minutes} min</p>
      {!locked && <button onClick={() => onSelect(title)}>Open</button>}
    </article>
  );
}`,
      },
      { type: 'h2', text: 'Children and component props' },
      {
        type: 'code',
        title: 'PropsWithChildren',
        language: 'tsx',
        code: `import type { PropsWithChildren } from 'react';

type PanelProps = PropsWithChildren<{
  title: string;
}>;

function Panel({ title, children }: PanelProps) {
  return (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  );
}`,
      },
      { type: 'h2', text: 'Event types' },
      {
        type: 'code',
        title: 'Form events',
        language: 'tsx',
        code: `import type { FormEvent, ChangeEvent } from 'react';

function LoginForm() {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
  }

  return <form onSubmit={handleSubmit}>...</form>;
}`,
      },
      { type: 'h2', text: 'Typing hooks and context' },
      {
        type: 'code',
        title: 'Generic useState and context',
        language: 'tsx',
        code: `const [lessons, setLessons] = useState<Lesson[]>([]);

type AuthContextValue = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);`,
      },
      {
        type: 'table',
        headers: ['Pattern', 'Type tool'],
        rows: [
          ['Component props', 'type or interface'],
          ['Children', 'PropsWithChildren or React.ReactNode'],
          ['DOM events', 'ChangeEvent, FormEvent, MouseEvent'],
          ['Ref to input', 'useRef<HTMLInputElement>(null)'],
        ],
      },
      { type: 'note', text: 'Start strict: enable strict mode in tsconfig. Loosen with any only at integration boundaries when needed.' },
      { type: 'try', text: 'Convert a JavaScript component to TypeScript. Add prop types and fix any errors the compiler reports.' },
      { type: 'keypoints', items: ['Define prop types with type or interface.', 'Use React event types for handlers.', 'Type useState and context values explicitly.', 'Prefer strict TypeScript for new React projects.'] },
    ],
  },
  {
    slug: 'compound-components-patterns',
    title: 'Compound Components and Modern Patterns',
    description: 'Design flexible APIs with compound components, render props, and controlled/uncontrolled patterns.',
    level: 'advanced',
    section: 'Architecture',
    order: 42,
    minutes: 15,
    content: [
      { type: 'p', text: 'Compound components share implicit state through context so consumers compose a flexible API without prop drilling through every layer. Libraries like Radix, Headless UI, and Reach use these patterns extensively.' },
      { type: 'h2', text: 'Compound component example' },
      {
        type: 'code',
        title: 'Tabs compound API',
        language: 'tsx',
        code: `const TabsContext = createContext(null);

function Tabs({ defaultValue, children }) {
  const [value, setValue] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

function TabsList({ children }) {
  return <div role="tablist">{children}</div>;
}

function TabsTrigger({ value, children }) {
  const ctx = useContext(TabsContext);
  return (
    <button
      role="tab"
      aria-selected={ctx.value === value}
      onClick={() => ctx.setValue(value)}
    >
      {children}
    </button>
  );
}

function TabsContent({ value, children }) {
  const ctx = useContext(TabsContext);
  if (ctx.value !== value) return null;
  return <div role="tabpanel">{children}</div>;
}`,
      },
      { type: 'h2', text: 'Usage' },
      {
        type: 'code',
        title: 'Composed tabs',
        language: 'jsx',
        code: `<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="lessons">Lessons</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">Track summary...</TabsContent>
  <TabsContent value="lessons">Lesson list...</TabsContent>
</Tabs>`,
      },
      { type: 'h2', text: 'Controlled vs uncontrolled' },
      {
        type: 'table',
        headers: ['Pattern', 'When'],
        rows: [
          ['Uncontrolled (defaultValue)', 'Simple forms, internal state enough'],
          ['Controlled (value + onChange)', 'Parent must sync or validate state'],
          ['Compound + context', 'Flexible layout, shared implicit state'],
          ['Render props', 'Parent needs full control over rendering'],
        ],
      },
      { type: 'h3', text: 'Slot-style composition' },
      { type: 'p', text: 'Export subcomponents as static properties for discoverability: Tabs.List = TabsList. TypeScript namespace merging or object assignment both work.' },
      {
        type: 'code',
        title: 'Attach subcomponents',
        language: 'tsx',
        code: `Tabs.List = TabsList;
Tabs.Trigger = TabsTrigger;
Tabs.Content = TabsContent;`,
      },
      { type: 'tip', text: 'Reach for compound components when users need layout flexibility. Reach for a single component with props when the UI is fixed.' },
      { type: 'try', text: 'Build a simple Accordion with Accordion, AccordionItem, AccordionHeader, and AccordionPanel subcomponents.' },
      { type: 'keypoints', items: ['Compound components share state via context.', 'Consumers compose flexible markup from subcomponents.', 'Support controlled and uncontrolled modes where appropriate.', 'Static subcomponent attachment improves API discoverability.'] },
    ],
  },
  {
    slug: 'state-management-beyond-context',
    title: 'State Management: When to Leave Context',
    description: 'Recognize when Context is not enough and evaluate lightweight stores and data libraries.',
    level: 'advanced',
    section: 'Architecture',
    order: 43,
    minutes: 14,
    content: [
      { type: 'p', text: 'Context plus useReducer works well for theme, auth, and medium-sized feature state. When many components update frequently, need time-travel debugging, or fetch and cache server data, dedicated tools often fit better.' },
      { type: 'h2', text: 'Signs you have outgrown Context' },
      { type: 'ul', items: ['Unrelated components re-render when any slice of context changes.', 'You are splitting context into many providers to avoid renders.', 'Server cache, stale times, and background refetch are manual and buggy.', 'DevTools and middleware would help your team debug state flows.'] },
      { type: 'h2', text: 'Categories of solutions' },
      {
        type: 'table',
        headers: ['Tool', 'Best for'],
        rows: [
          ['Context + useReducer', 'Theme, auth, small feature state'],
          ['Zustand / Jotai', 'Client UI state with minimal boilerplate'],
          ['Redux Toolkit', 'Large teams, strict patterns, middleware'],
          ['TanStack Query', 'Server state: fetch, cache, invalidate'],
          ['URL / search params', 'Shareable, bookmarkable UI state'],
        ],
      },
      { type: 'h2', text: 'Separate client and server state' },
      { type: 'p', text: 'A common mistake is storing API responses in global client stores when a data library would handle caching, deduplication, and refetch. Keep server data in TanStack Query or similar; keep UI toggles in Zustand or local state.' },
      {
        type: 'code',
        title: 'Zustand sketch',
        language: 'tsx',
        code: `import { create } from 'zustand';

type PlayerStore = {
  activeSlug: string | null;
  setActive: (slug: string) => void;
};

export const usePlayerStore = create<PlayerStore>((set) => ({
  activeSlug: null,
  setActive: (slug) => set({ activeSlug: slug }),
}));`,
      },
      {
        type: 'code',
        title: 'TanStack Query sketch',
        language: 'tsx',
        code: `import { useQuery } from '@tanstack/react-query';

function useLessons() {
  return useQuery({
    queryKey: ['lessons'],
    queryFn: () => fetch('/api/lessons').then((r) => r.json()),
  });
}`,
      },
      { type: 'note', text: 'There is no single best store. Teams succeed with different choices when they document conventions and stay consistent.' },
      { type: 'warning', text: 'Do not adopt Redux or Query on day one of a todo app. Add complexity when pain is real and measured.' },
      { type: 'try', text: 'List every piece of state in your notes app. Label each as local, URL, server, or global client. Justify one migration to a store or query library.' },
      { type: 'keypoints', items: ['Context suits stable, moderately shared state.', 'Split server cache from client UI state.', 'Reach for Zustand, Redux, or Query when Context causes pain.', 'URL state is underrated for filters and selections.'] },
    ],
  },
  {
    slug: 'folder-architecture',
    title: 'Folder Architecture for React Apps',
    description: 'Organize growing codebases by feature, enforce boundaries, and keep components maintainable.',
    level: 'advanced',
    section: 'Architecture',
    order: 44,
    minutes: 14,
    content: [
      { type: 'p', text: 'Folder structure is about discoverability and team alignment. As apps grow, organizing only by type (all components in one folder) breaks down. Feature-based folders scale better for product teams.' },
      { type: 'h2', text: 'Feature-first layout' },
      {
        type: 'code',
        title: 'Recommended structure',
        language: 'text',
        code: `src/
  app/                  # routes, providers, root layout
    routes.tsx
    providers.tsx
  features/
    lessons/
      components/
      hooks/
      api.ts
      types.ts
      LessonsPage.tsx
    player/
      LessonPlayer.tsx
      usePlayerState.ts
  components/
    ui/                 # shared Button, Input, Modal
  lib/                  # pure helpers, no React
  styles/
  test/`,
      },
      { type: 'h2', text: 'Layer responsibilities' },
      {
        type: 'table',
        headers: ['Folder', 'Contains'],
        rows: [
          ['features/*', 'Pages, feature hooks, feature-specific components'],
          ['components/ui', 'Design system primitives reused everywhere'],
          ['lib/', 'Formatters, validators, constants with zero React imports'],
          ['app/', 'Router, global providers, error boundaries'],
        ],
      },
      { type: 'h2', text: 'Colocation principle' },
      { type: 'p', text: 'Keep tests, styles, and subcomponents near the feature that owns them. Move to shared folders only when a second feature genuinely needs the same code.' },
      {
        type: 'code',
        title: 'Feature module exports',
        language: 'typescript',
        code: `// features/lessons/index.ts - public API
export { LessonsPage } from './LessonsPage';
export { useLessons } from './hooks/useLessons';
export type { Lesson } from './types';`,
      },
      { type: 'h3', text: 'Barrel files with care' },
      { type: 'p', text: 'index.ts re-exports can slow builds and create circular imports. Export only the public surface of each feature; import internals via relative paths inside the feature.' },
      { type: 'tip', text: 'Mirror your route structure in features/ when using React Router. One feature folder per major route group.' },
      { type: 'note', text: 'Next.js App Router uses app/ for routes by convention. The feature folder pattern still applies inside src/features or alongside app/.' },
      { type: 'try', text: 'Sketch a folder tree for a lesson player feature with sidebar, content pane, progress API hook, and paywall modal.' },
      { type: 'keypoints', items: ['Organize by feature, not only by file type.', 'Keep shared UI primitives in components/ui.', 'Put pure logic in lib/ without React imports.', 'Expose a small public API per feature module.'] },
    ],
  },
  {
    slug: 'profiling-react-performance',
    title: 'Profiling React Performance',
    description: 'Use React DevTools Profiler and browser tools to find and fix real bottlenecks.',
    level: 'advanced',
    section: 'Performance',
    order: 45,
    minutes: 14,
    content: [
      { type: 'p', text: 'Performance work should be driven by measurement, not guesses. The React DevTools Profiler records why components rendered and how long they took. Browser Performance tab shows main-thread work, layout, and paint.' },
      { type: 'h2', text: 'Using the Profiler' },
      { type: 'ol', items: ['Open React DevTools and go to the Profiler tab.', 'Click record, interact with your app, stop recording.', 'Inspect flame graph: wide bars mean slow renders.', 'Check "Why did this render?" for each component.'] },
      { type: 'h2', text: 'Common causes of slow renders' },
      {
        type: 'table',
        headers: ['Cause', 'Fix'],
        rows: [
          ['Huge lists rendered at once', 'Virtualize with react-window or similar'],
          ['Expensive work every render', 'useMemo or move outside component'],
          ['Context value changes often', 'Split context or use selectors'],
          ['Unstable props to memo children', 'useCallback, memoize objects, or restructure'],
          ['Large unmemoized child trees', 'React.memo on pure subtrees'],
        ],
      },
      {
        type: 'code',
        title: 'Profiler API in tests',
        language: 'jsx',
        code: `import { Profiler } from 'react';

function onRender(id, phase, actualDuration) {
  console.log(id, phase, actualDuration);
}

<Profiler id="LessonList" onRender={onRender}>
  <LessonList lessons={lessons} />
</Profiler>`,
      },
      { type: 'h2', text: 'Browser Performance tab' },
      { type: 'p', text: 'Record a session while interacting. Look for long tasks over 50ms, forced synchronous layouts, and excessive paint. Network tab complements render profiling for data-heavy pages.' },
      { type: 'h3', text: 'Production vs development' },
      { type: 'p', text: 'Development builds are slower due to StrictMode and extra warnings. Validate critical paths with production builds (npm run build && npm run preview).' },
      { type: 'warning', text: 'Do not ship memo, useMemo, and useCallback everywhere after one slow interaction. Fix the largest bar in the profiler first.' },
      { type: 'try', text: 'Profile your lesson list with 500 items. Identify the slowest component and apply one targeted fix. Re-profile to confirm improvement.' },
      { type: 'keypoints', items: ['Measure with React Profiler before optimizing.', 'Virtualize long lists; memoize only proven bottlenecks.', 'Split context to reduce broad re-renders.', 'Validate performance in production builds.'] },
    ],
  },
  {
    slug: 'suspense-data-patterns',
    title: 'Suspense Data Patterns Overview',
    description: 'Understand Suspense for data fetching, streaming, and how frameworks integrate async UI.',
    level: 'advanced',
    section: 'Architecture',
    order: 46,
    minutes: 14,
    content: [
      { type: 'p', text: 'Suspense lets components "wait" for something before rendering, showing a fallback boundary meanwhile. React.lazy uses Suspense for code. Newer patterns extend Suspense to data fetching, especially in frameworks like Next.js App Router and Relay.' },
      { type: 'h2', text: 'Suspense with lazy code' },
      {
        type: 'code',
        title: 'Code splitting fallback',
        language: 'jsx',
        code: `const LessonPlayer = lazy(() => import('./LessonPlayer'));

function App() {
  return (
    <Suspense fallback={<PlayerSkeleton />}>
      <LessonPlayer />
    </Suspense>
  );
}`,
      },
      { type: 'h2', text: 'Suspense for data (concept)' },
      { type: 'p', text: 'A Suspense-enabled data source throws a promise while loading. React catches it at the nearest Suspense boundary and shows fallback. When the promise resolves, React retries rendering.' },
      {
        type: 'code',
        title: 'Conceptual read function',
        language: 'javascript',
        code: `// Simplified mental model - frameworks wrap this for you
function read(resource) {
  if (resource.status === 'pending') throw resource.promise;
  if (resource.status === 'error') throw resource.error;
  return resource.result;
}`,
      },
      { type: 'h2', text: 'Where this shows up in practice' },
      {
        type: 'table',
        headers: ['Environment', 'Suspense data support'],
        rows: [
          ['Plain Vite + useEffect', 'Manual loading states, not throw-on-fetch'],
          ['React Router loaders', 'defer() + Await component patterns'],
          ['Next.js App Router', 'async Server Components, streaming HTML'],
          ['Relay / experimental APIs', 'Full Suspense cache integration'],
        ],
      },
      { type: 'h3', text: 'Nested Suspense boundaries' },
      { type: 'p', text: 'Place granular boundaries so one slow widget does not blank the entire page. A sidebar can load independently from main content.' },
      {
        type: 'code',
        title: 'Nested fallbacks',
        language: 'jsx',
        code: `<Suspense fallback={<PageSkeleton />}>
  <Header />
  <Suspense fallback={<ChartSkeleton />}>
    <ProgressChart />
  </Suspense>
  <LessonContent />
</Suspense>`,
      },
      { type: 'note', text: 'For client-only Vite apps today, useEffect plus explicit loading states remain the default. Suspense data patterns matter most as you adopt Next.js or React Router data APIs.' },
      { type: 'try', text: 'Add nested Suspense boundaries around two lazy components. Confirm each shows its own fallback independently.' },
      { type: 'keypoints', items: ['Suspense shows fallback while children are not ready.', 'React.lazy uses Suspense for code splitting.', 'Data Suspense throws promises caught by boundaries.', 'Next.js App Router extends these patterns with server streaming.'] },
    ],
  },
  {
    slug: 'capstone-lesson-player',
    title: 'Capstone: Lesson Player UI',
    description: 'Build an InTelleX-style lesson player with sidebar curriculum, content pane, progress, and locks.',
    level: 'advanced',
    section: 'Capstone',
    order: 47,
    minutes: 25,
    content: [
      { type: 'p', text: 'This capstone integrates the full React track: components, state, effects, custom hooks, routing, context, performance awareness, and accessible UI. You will build a lesson player similar to InTelleX course dashboards.' },
      { type: 'h2', text: 'Requirements' },
      { type: 'ol', items: ['Sidebar lists lessons grouped by level (beginner, intermediate, advanced).', 'Clicking a lesson shows title, description, and content in the main pane.', 'Mark Complete toggles completion stored in a Set persisted via useLocalStorage.', 'Progress bar shows completed count divided by total lessons.', 'Locked lessons show a paywall panel instead of content.', 'Active lesson reflected in URL with React Router /player/:slug.', 'Keyboard accessible navigation between lessons.'] },
      { type: 'h2', text: 'Component architecture' },
      {
        type: 'code',
        title: 'Component tree',
        language: 'text',
        code: `LessonPlayerPage
├── PlayerLayout
│   ├── ProgressBar
│   ├── Sidebar
│   │   └── LessonNavItem (per lesson)
│   └── MainPane
│       ├── Paywall (if locked)
│       └── LessonArticle (if unlocked)
│           └── MarkCompleteButton`,
      },
      { type: 'h2', text: 'Core state' },
      {
        type: 'code',
        title: 'Player state sketch',
        language: 'tsx',
        code: `function LessonPlayerPage({ lessons }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [completed, setCompleted] = useLocalStorage<string[]>('completed', []);

  const active = lessons.find((l) => l.slug === slug) ?? lessons[0];
  const doneSet = new Set(completed);
  const pct = Math.round((doneSet.size / lessons.length) * 100);

  function markComplete(slug: string) {
    setCompleted((prev) =>
      doneSet.has(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  }

  // render sidebar, main, progress...
}`,
      },
      { type: 'h2', text: 'Sidebar navigation' },
      {
        type: 'code',
        title: 'Grouped lessons',
        language: 'jsx',
        code: `function Sidebar({ lessons, activeSlug, completed, onSelect }) {
  const levels = ['beginner', 'intermediate', 'advanced'];

  return (
    <aside aria-label="Curriculum">
      {levels.map((level) => (
        <section key={level}>
          <h3>{level}</h3>
          <ul>
            {lessons
              .filter((l) => l.level === level)
              .map((l) => (
                <li key={l.slug}>
                  <button
                    aria-current={l.slug === activeSlug ? 'true' : undefined}
                    onClick={() => onSelect(l.slug)}
                  >
                    {completed.has(l.slug) ? '[x]' : '[ ]'} {l.title}
                  </button>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </aside>
  );
}`,
      },
      { type: 'h3', text: 'Milestone checklist' },
      { type: 'ul', items: ['Phase 1: Static layout with hard-coded data.', 'Phase 2: Active lesson state and sidebar clicks.', 'Phase 3: Completion + progress + localStorage.', 'Phase 4: Router integration and locked paywall.', 'Phase 5: Styles, a11y pass, and basic tests.'] },
      { type: 'tip', text: 'Compare your player to the React tutorial on InTelleX. Match the information hierarchy before chasing pixel-perfect design.' },
      { type: 'try', text: 'Implement phases 1-3 in a Vite project using your React tutorial lesson data as the source.' },
      { type: 'keypoints', items: ['Compose sidebar, main content, and progress components.', 'Persist completion with a custom useLocalStorage hook.', 'Use routing for shareable active lesson URLs.', 'Treat locked content as conditional rendering, not a separate app.'] },
    ],
  },
  {
    slug: 'capstone-polish-deploy',
    title: 'Capstone Polish and Deploy Checklist',
    description: 'Production checklist: performance, accessibility, error handling, build, and static deploy.',
    level: 'advanced',
    section: 'Capstone',
    order: 48,
    minutes: 18,
    content: [
      { type: 'p', text: 'Shipping a capstone means more than feature-complete code. This lesson walks through polish, hardening, and deploying a Vite React SPA to production.' },
      { type: 'h2', text: 'Pre-deploy checklist' },
      { type: 'ol', items: ['Run npm run build with zero TypeScript errors.', 'Test production build locally with npm run preview.', 'Verify all routes work (SPA fallback configured on host).', 'Run Lighthouse for performance and accessibility scores.', 'Confirm environment variables use import.meta.env, not hard-coded secrets.', 'Add favicon, meta title, and Open Graph tags in index.html.'] },
      { type: 'h2', text: 'Error and loading hardening' },
      {
        type: 'code',
        title: 'Route-level error boundary',
        language: 'jsx',
        code: `<Route
  path="/player/:slug"
  element={
    <ErrorBoundary fallback={<PlayerError />}>
      <Suspense fallback={<PlayerSkeleton />}>
        <LessonPlayerPage />
      </Suspense>
    </ErrorBoundary>
  }
/>`,
      },
      { type: 'h2', text: 'Build and deploy' },
      {
        type: 'code',
        title: 'Production build',
        language: 'bash',
        code: `npm run build
# Output in dist/ - static files ready to host`,
      },
      {
        type: 'table',
        headers: ['Host', 'SPA fallback note'],
        rows: [
          ['Netlify', '_redirects: /* /index.html 200'],
          ['Vercel', 'vercel.json rewrites to index.html'],
          ['GitHub Pages', 'Set base in vite.config.ts'],
          ['S3 + CloudFront', 'Custom error response to index.html'],
        ],
      },
      { type: 'h2', text: 'Performance polish' },
      { type: 'ul', items: ['Lazy load heavy routes.', 'Compress images and SVGs.', 'Audit bundle with rollup-plugin-visualizer or Vite build --mode analyze.', 'Remove console.log and dead code.'] },
      { type: 'h3', text: 'Accessibility final pass' },
      { type: 'p', text: 'Tab through the entire player: sidebar, content, mark complete, paywall CTA. Run axe DevTools. Fix missing labels and contrast issues before sharing the demo link.' },
      { type: 'warning', text: 'Never commit API keys or tokens. Client bundles are public. Use server endpoints for secrets.' },
      { type: 'try', text: 'Deploy your lesson player to Netlify or Vercel. Share the URL and verify deep links like /player/jsx-basics work on refresh.' },
      { type: 'keypoints', items: ['Always test npm run preview before deploying.', 'Configure SPA fallback on your static host.', 'Wrap risky routes in ErrorBoundary and Suspense.', 'Run Lighthouse and keyboard audits as final polish.'] },
    ],
  },
  {
    slug: 'next-steps-nextjs',
    title: 'Next Steps toward Next.js',
    description: 'Bridge from client React to Next.js: routing, server components, data fetching, and deployment.',
    level: 'advanced',
    section: 'Capstone',
    order: 49,
    minutes: 14,
    content: [
      { type: 'p', text: 'You now have a strong client React foundation. Next.js is the natural next step for production apps that need SEO, server rendering, API routes, and optimized deployment on Vercel or similar platforms.' },
      { type: 'h2', text: 'What you already know transfers' },
      {
        type: 'table',
        headers: ['React skill', 'Next.js equivalent'],
        rows: [
          ['Components and hooks', 'Same in Client Components'],
          ['React Router routes', 'File-based app/ directory routes'],
          ['useEffect data fetch', 'async Server Components or server actions'],
          ['Vite build', 'next build with automatic optimization'],
          ['Code splitting', 'Automatic per-route splitting'],
        ],
      },
      { type: 'h2', text: 'New concepts in Next.js' },
      { type: 'ul', items: ['Server Components render on the server by default (no useState in server files).', 'Client Components marked with "use client" for interactivity.', 'Layouts and nested routes via folder structure.', 'Server Actions for form mutations without manual API routes.', 'Metadata API for SEO titles and descriptions.'] },
      {
        type: 'code',
        title: 'Client component in Next.js',
        language: 'tsx',
        code: `'use client';

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}`,
      },
      {
        type: 'code',
        title: 'Server component fetch',
        language: 'tsx',
        code: `// app/tutorials/react/page.tsx - Server Component by default
export default async function ReactHubPage() {
  const lessons = await getLessons('react');
  return <LessonGrid lessons={lessons} />;
}`,
      },
      { type: 'h2', text: 'Suggested learning path' },
      { type: 'ol', items: ['Complete the Next.js tutorial on InTelleX.', 'Migrate your lesson player sidebar to a Server Component page with a Client player shell.', 'Replace useEffect fetches with server-side data loading.', 'Deploy to Vercel and compare DX to static Vite hosting.'] },
      { type: 'note', text: 'You do not need Next.js for every project. SPAs with Vite remain valid for dashboards, internal tools, and apps behind login without SEO needs.' },
      { type: 'tip', text: 'Keep your Vite capstone as a portfolio piece. Build the Next.js version to show you understand both client and full-stack React.' },
      { type: 'try', text: 'Create a Next.js app with one static lesson page and one Client Component counter. Note which file runs on server vs client.' },
      { type: 'keypoints', items: ['Next.js adds routing, SSR, and data patterns on top of React.', 'Client Components use the hooks you learned; Server Components fetch on the server.', 'File-based routing replaces manual React Router setup.', 'Continue to the Next.js track when you need SEO or full-stack features.'] },
    ],
  },
];
