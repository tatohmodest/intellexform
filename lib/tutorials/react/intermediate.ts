import type { TutorialLesson } from '../types';

export const intermediateLessons: TutorialLesson[] = [
  {
    slug: 'useeffect-fundamentals',
    title: 'useEffect Fundamentals',
    description: 'Learn what useEffect does, when to use it, and how it differs from rendering logic.',
    level: 'intermediate',
    section: 'Effects & Data',
    order: 19,
    minutes: 16,
    content: [
      { type: 'p', text: 'useEffect lets function components synchronize with external systems: APIs, browser APIs, timers, subscriptions, and third-party libraries. It runs after React paints the screen, so it does not block the user from seeing the initial UI.' },
      { type: 'p', text: 'Effects are for side effects - work that reaches outside React. If you can compute something from props and state during render, do that instead of useEffect.' },
      { type: 'h2', text: 'Basic effect structure' },
      {
        type: 'code',
        title: 'Document title effect',
        language: 'jsx',
        code: `import { useEffect, useState } from 'react';

export default function LessonPage({ title }) {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return <h1>{title}</h1>;
}`,
      },
      { type: 'h2', text: 'When to use useEffect' },
      {
        type: 'table',
        headers: ['Use effect for', 'Do NOT use effect for'],
        rows: [
          ['Fetching data from an API', 'Filtering a list from props (compute in render)'],
          ['Setting up subscriptions or listeners', 'Deriving display values from state'],
          ['Syncing with localStorage or DOM APIs', 'Responding to button clicks (use handlers)'],
          ['Starting timers or intervals', 'Transforming data that props already provide'],
        ],
      },
      { type: 'h2', text: 'Effect lifecycle' },
      { type: 'ol', items: ['Component renders with current props and state.', 'React updates the DOM.', 'useEffect runs after paint.', 'If dependencies changed, cleanup from the previous effect runs first.', 'The new effect function runs.'] },
      {
        type: 'code',
        title: 'Effect with cleanup',
        language: 'jsx',
        code: `useEffect(() => {
  const id = setInterval(() => {
    console.log('tick');
  }, 1000);

  return () => clearInterval(id);
}, []);`,
      },
      { type: 'h3', text: 'Mount, update, unmount' },
      { type: 'p', text: 'An empty dependency array [] means the effect runs once after mount and cleanup runs on unmount. This pattern suits one-time setup like subscribing to a channel or focusing an input.' },
      {
        type: 'code',
        title: 'Fetch on mount',
        language: 'jsx',
        code: `useEffect(() => {
  let cancelled = false;

  fetch('/api/lessons')
    .then((r) => r.json())
    .then((data) => {
      if (!cancelled) setLessons(data);
    });

  return () => {
    cancelled = true;
  };
}, []);`,
      },
      { type: 'note', text: 'React StrictMode in development runs effects twice on mount to help you find missing cleanup. Your cleanup function should handle that safely.' },
      { type: 'warning', text: 'Never make the effect callback async directly (useEffect(async () => {})). Define an async function inside and call it.' },
      { type: 'try', text: 'Write an effect that logs "mounted" on mount and "unmounted" on cleanup. Toggle the component with state to see both messages.' },
      { type: 'keypoints', items: ['useEffect syncs components with external systems after paint.', 'Use effects for side effects, not for deriving render data.', 'Return a cleanup function to undo subscriptions and timers.', 'Empty deps [] runs once on mount; cleanup on unmount.'] },
    ],
  },
  {
    slug: 'useeffect-dependencies',
    title: 'useEffect Dependencies',
    description: 'Master the dependency array, exhaustive-deps rules, and avoiding infinite effect loops.',
    level: 'intermediate',
    section: 'Effects & Data',
    order: 20,
    minutes: 15,
    content: [
      { type: 'p', text: 'The dependency array tells React when to re-run an effect. Include every value from the component scope that the effect reads and that can change between renders. Missing dependencies cause stale bugs; wrong dependencies cause infinite loops.' },
      { type: 'h2', text: 'Three dependency patterns' },
      {
        type: 'table',
        headers: ['Array', 'Behavior'],
        rows: [
          ['No array (omitted)', 'Runs after every render - almost never what you want'],
          ['[] empty', 'Runs once on mount; cleanup on unmount'],
          ['[a, b, c]', 'Runs on mount and whenever a, b, or c changes'],
        ],
      },
      {
        type: 'code',
        title: 'Re-fetch when userId changes',
        language: 'jsx',
        code: `function Profile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch(\`/api/users/\${userId}\`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setUser(data);
      });
    return () => { cancelled = true; };
  }, [userId]);

  if (!user) return <p>Loading...</p>;
  return <h1>{user.name}</h1>;
}`,
      },
      { type: 'h2', text: 'The exhaustive-deps rule' },
      { type: 'p', text: 'The eslint-plugin-react-hooks exhaustive-deps rule warns when your effect uses a variable not listed in the dependency array. Treat warnings seriously - they usually indicate a real stale closure bug.' },
      {
        type: 'code',
        title: 'Stale closure bug',
        language: 'jsx',
        code: `// Bug: count is stale inside the interval
useEffect(() => {
  const id = setInterval(() => {
    console.log(count); // always logs initial count
  }, 1000);
  return () => clearInterval(id);
}, []); // missing count

// Fix: include count, or use functional state updates
useEffect(() => {
  const id = setInterval(() => {
    setCount((c) => c + 1);
  }, 1000);
  return () => clearInterval(id);
}, []);`,
      },
      { type: 'h2', text: 'Avoiding infinite loops' },
      { type: 'p', text: 'If an effect sets state that is also in its dependency array, you can loop forever. Restructure: derive data in render, debounce updates, or split into separate effects with narrower deps.' },
      {
        type: 'code',
        title: 'Loop trap and fix',
        language: 'jsx',
        code: `// Infinite loop: effect sets user, user is a dependency
useEffect(() => {
  setUser({ ...user, lastSeen: Date.now() });
}, [user]);

// Better: update only on a specific event, not in an effect on user`,
      },
      { type: 'h3', text: 'Stable function dependencies' },
      { type: 'p', text: 'Functions defined in the component body are new every render. If an effect depends on a function, either include it in deps (and accept re-runs), move logic into the effect, or stabilize with useCallback.' },
      { type: 'tip', text: 'When in doubt, list the dependency. React compares deps with Object.is. Primitives compare by value; objects and functions compare by reference.' },
      { type: 'try', text: 'Write an effect that fetches lessons when a filter string changes. Verify cleanup cancels the previous request when filter changes quickly.' },
      { type: 'keypoints', items: ['List every reactive value the effect reads in the dependency array.', 'Missing deps cause stale closures; wrong deps cause loops.', 'Follow exhaustive-deps lint warnings.', 'Prefer functional state updates to avoid stale values in effects.'] },
    ],
  },
  {
    slug: 'useeffect-cleanup-stale-closures',
    title: 'useEffect Cleanup and Stale Closures',
    description: 'Write correct cleanup functions and understand stale closures in effects and event handlers.',
    level: 'intermediate',
    section: 'Effects & Data',
    order: 21,
    minutes: 16,
    content: [
      { type: 'p', text: 'Cleanup functions undo what an effect set up: remove listeners, cancel requests, clear timers. Stale closures happen when a callback captures old state or props. Both topics are central to writing reliable effects.' },
      { type: 'h2', text: 'Why cleanup matters' },
      {
        type: 'code',
        title: 'Window resize listener',
        language: 'jsx',
        code: `useEffect(() => {
  function handleResize() {
    setWidth(window.innerWidth);
  }

  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);`,
      },
      { type: 'p', text: 'Without cleanup, navigating away leaves a listener attached. The callback may call setState on an unmounted component, causing memory leaks and React warnings.' },
      { type: 'h2', text: 'Race conditions in fetch' },
      {
        type: 'code',
        title: 'Ignore stale fetch results',
        language: 'jsx',
        code: `useEffect(() => {
  let cancelled = false;

  async function load() {
    const res = await fetch(\`/api/lessons?q=\${query}\`);
    const data = await res.json();
    if (!cancelled) setResults(data);
  }

  load();
  return () => { cancelled = true; };
}, [query]);`,
      },
      { type: 'p', text: 'If the user types quickly, request A might finish after request B. Without the cancelled flag, stale data overwrites fresh results.' },
      { type: 'h2', text: 'Stale closures explained' },
      { type: 'p', text: 'A closure captures variables from the scope where it was created. If an effect runs once with [] but references count, it forever sees the count from the first render.' },
      {
        type: 'table',
        headers: ['Problem', 'Solution'],
        rows: [
          ['Effect sees old state', 'Add state to dependency array or use functional updates'],
          ['Effect sees old props', 'Add props to dependency array'],
          ['Unstable function in deps causes re-runs', 'useCallback or move function inside effect'],
          ['Need latest value without re-running effect', 'useRef to hold latest value'],
        ],
      },
      {
        type: 'code',
        title: 'useRef for latest callback',
        language: 'jsx',
        code: `const onMessageRef = useRef(onMessage);
onMessageRef.current = onMessage;

useEffect(() => {
  const socket = connect();
  socket.on('message', (msg) => onMessageRef.current(msg));
  return () => socket.disconnect();
}, []);`,
      },
      { type: 'h3', text: 'AbortController for fetch' },
      {
        type: 'code',
        title: 'Modern fetch cancellation',
        language: 'jsx',
        code: `useEffect(() => {
  const controller = new AbortController();

  fetch(url, { signal: controller.signal })
    .then((r) => r.json())
    .then(setData)
    .catch((err) => {
      if (err.name !== 'AbortError') setError(err);
    });

  return () => controller.abort();
}, [url]);`,
      },
      { type: 'warning', text: 'Cleanup must be synchronous. Do not return a Promise from cleanup - React will not await it.' },
      { type: 'try', text: 'Build a live search that fetches on each keystroke. Add cleanup so only the latest query result updates state.' },
      { type: 'keypoints', items: ['Always clean up listeners, timers, and subscriptions.', 'Use cancelled flags or AbortController for async work.', 'Stale closures capture old values from past renders.', 'useRef can hold the latest callback without re-running effects.'] },
    ],
  },
  {
    slug: 'fetching-data-patterns',
    title: 'Fetching Data Patterns',
    description: 'Implement robust data fetching with useEffect, handle race conditions, and structure API calls.',
    level: 'intermediate',
    section: 'Effects & Data',
    order: 22,
    minutes: 16,
    content: [
      { type: 'p', text: 'Fetching data is one of the most common effect use cases. A professional pattern separates loading logic, handles errors gracefully, and avoids updating state after unmount or after a superseded request.' },
      { type: 'h2', text: 'Basic fetch effect' },
      {
        type: 'code',
        title: 'Fetch lessons on mount',
        language: 'jsx',
        code: `function LessonCatalog() {
  const [lessons, setLessons] = useState([]);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');

    fetch('/api/lessons')
      .then((res) => {
        if (!res.ok) throw new Error('Request failed');
        return res.json();
      })
      .then((data) => {
        if (!cancelled) {
          setLessons(data);
          setStatus('success');
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });

    return () => { cancelled = true; };
  }, []);

  // render based on status...
}`,
      },
      { type: 'h2', text: 'Extracting a data hook' },
      {
        type: 'code',
        title: 'useFetch sketch',
        language: 'jsx',
        code: `function useFetch(url) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetch(url, { signal: controller.signal })
      .then((r) => r.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [url]);

  return { data, error, loading };
}`,
      },
      { type: 'h2', text: 'Where to fetch' },
      {
        type: 'table',
        headers: ['Location', 'Best for'],
        rows: [
          ['Component effect', 'Simple pages, learning, prototypes'],
          ['Custom hook', 'Reusable fetch logic across components'],
          ['Route loader (React Router)', 'Fetch before render, parallel routes'],
          ['Server / Next.js', 'Production apps, SEO, caching'],
        ],
      },
      { type: 'h3', text: 'POST and mutations' },
      { type: 'p', text: 'GET requests often live in effects. POST, PUT, and DELETE usually belong in event handlers, not effects. Call fetch inside handleSubmit, then update local state or refetch.' },
      {
        type: 'code',
        title: 'Mutation in event handler',
        language: 'jsx',
        code: `async function handleSave(lesson) {
  setSaving(true);
  try {
    const res = await fetch('/api/lessons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lesson),
    });
    if (!res.ok) throw new Error('Save failed');
    const saved = await res.json();
    setLessons((prev) => [...prev, saved]);
  } finally {
    setSaving(false);
  }
}`,
      },
      { type: 'note', text: 'Libraries like TanStack Query automate caching, retries, and deduplication. Learn the manual pattern first so you understand what they solve.' },
      { type: 'try', text: 'Fetch a public JSON API (e.g. JSONPlaceholder posts). Display the list and refetch when a Refresh button is clicked.' },
      { type: 'keypoints', items: ['Fetch in useEffect for load-on-mount data.', 'Cancel or ignore stale requests on cleanup.', 'Mutations belong in event handlers, not effects.', 'Extract repeated fetch logic into custom hooks.'] },
    ],
  },
  {
    slug: 'loading-error-empty-states',
    title: 'Loading, Error, and Empty States',
    description: 'Model async UI states explicitly and build polished loading, error, and empty experiences.',
    level: 'intermediate',
    section: 'Effects & Data',
    order: 23,
    minutes: 14,
    content: [
      { type: 'p', text: 'Every async UI has at least four states: idle, loading, success, and error. Empty success (zero results) deserves its own treatment. Modeling these explicitly prevents blank screens and confused users.' },
      { type: 'h2', text: 'Status enum pattern' },
      {
        type: 'code',
        title: 'Explicit status state',
        language: 'tsx',
        code: `type Status = 'idle' | 'loading' | 'success' | 'error';

const [status, setStatus] = useState<Status>('idle');
const [data, setData] = useState<Lesson[]>([]);
const [error, setError] = useState<string | null>(null);`,
      },
      { type: 'h2', text: 'Rendering each state' },
      {
        type: 'code',
        title: 'State-driven UI',
        language: 'jsx',
        code: `function LessonPanel() {
  if (status === 'loading') return <SkeletonList />;
  if (status === 'error') {
    return (
      <div className="error-panel">
        <p>{error ?? 'Something went wrong.'}</p>
        <button onClick={retry}>Try again</button>
      </div>
    );
  }
  if (data.length === 0) {
    return <p>No lessons match your filter.</p>;
  }
  return <LessonList lessons={data} />;
}`,
      },
      {
        type: 'table',
        headers: ['State', 'What to show'],
        rows: [
          ['idle', 'Nothing or a prompt to load'],
          ['loading', 'Skeleton, spinner, or progress text'],
          ['error', 'Message + retry action'],
          ['success + empty', 'Helpful empty state with next step'],
          ['success + data', 'The actual content'],
        ],
      },
      { type: 'h2', text: 'Skeleton screens' },
      { type: 'p', text: 'Skeleton placeholders that mirror the final layout feel faster than a lone spinner. They set expectations about what content is coming.' },
      {
        type: 'code',
        title: 'Simple skeleton row',
        language: 'jsx',
        code: `function SkeletonRow() {
  return (
    <div className="skeleton-row" aria-hidden="true">
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-text" />
    </div>
  );
}`,
      },
      { type: 'h3', text: 'Retry pattern' },
      {
        type: 'code',
        title: 'Retry with a key or callback',
        language: 'jsx',
        code: `const [retryCount, setRetryCount] = useState(0);

useEffect(() => {
  loadLessons();
}, [retryCount]);

<button onClick={() => setRetryCount((c) => c + 1)}>
  Retry
</button>`,
      },
      { type: 'tip', text: 'Use aria-live="polite" on error messages so screen readers announce failures.' },
      { type: 'warning', text: 'Do not show loading and data at the same time unless you are doing incremental/pagination loading with a clear indicator.' },
      { type: 'try', text: 'Build a lessons loader with skeleton loading, error + retry, and an empty state when the API returns [].' },
      { type: 'keypoints', items: ['Model idle, loading, success, and error explicitly.', 'Empty results are not errors - design a dedicated empty UI.', 'Offer retry on failures.', 'Skeletons improve perceived performance over spinners alone.'] },
    ],
  },
  {
    slug: 'custom-hooks',
    title: 'Custom Hooks',
    description: 'Extract reusable stateful logic into custom hooks that compose built-in hooks.',
    level: 'intermediate',
    section: 'Hooks Toolkit',
    order: 24,
    minutes: 15,
    content: [
      { type: 'p', text: 'Custom hooks let you share stateful logic between components without duplicating useState and useEffect blocks. A custom hook is a JavaScript function that calls one or more hooks and returns values or setters.' },
      { type: 'h2', text: 'Naming and rules' },
      { type: 'ul', items: ['Name must start with use (useLocalStorage, useToggle).', 'Follow the Rules of Hooks: only call hooks at the top level.', 'Custom hooks can call other custom hooks.'] },
      {
        type: 'code',
        title: 'useToggle',
        language: 'jsx',
        code: `function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  const toggle = () => setOn((v) => !v);
  return { on, toggle, setOn };
}

function Sidebar() {
  const { on, toggle } = useToggle(false);
  return (
  <>
    <button onClick={toggle}>{on ? 'Close' : 'Open'}</button>
    {on && <nav>...</nav>}
  </>
  );
}`,
      },
      { type: 'h2', text: 'useLocalStorage' },
      {
        type: 'code',
        title: 'Persist state to localStorage',
        language: 'jsx',
        code: `function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : initial;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}`,
      },
      { type: 'h2', text: 'useDebounce' },
      {
        type: 'code',
        title: 'Debounce a value',
        language: 'jsx',
        code: `function useDebounce(value, delayMs = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);

  return debounced;
}

// Usage: fetch when debouncedQuery changes, not every keystroke
const debouncedQuery = useDebounce(query, 400);`,
      },
      {
        type: 'table',
        headers: ['Hook', 'Purpose'],
        rows: [
          ['useToggle', 'Boolean on/off state'],
          ['useLocalStorage', 'Persist state across sessions'],
          ['useDebounce', 'Delay rapid value changes'],
          ['useFetch', 'Shared data loading logic'],
          ['useMediaQuery', 'Responsive layout breakpoints'],
        ],
      },
      { type: 'tip', text: 'One concern per hook. A useLessonPlayer hook is fine; a useEverything hook is not.' },
      { type: 'note', text: 'Custom hooks share logic, not state. Each component calling useToggle gets its own independent on/off state.' },
      { type: 'try', text: 'Write useWindowWidth that returns innerWidth and updates on resize with proper cleanup.' },
      { type: 'keypoints', items: ['Custom hooks extract reusable stateful logic.', 'Names must start with use.', 'Each call site gets independent state.', 'Compose useState, useEffect, useRef, and other hooks inside.'] },
    ],
  },
  {
    slug: 'useref-dom-and-mutable',
    title: 'useRef: DOM Access and Mutable Values',
    description: 'Use useRef for DOM nodes, imperative focus, and mutable values that do not trigger re-renders.',
    level: 'intermediate',
    section: 'Hooks Toolkit',
    order: 25,
    minutes: 14,
    content: [
      { type: 'p', text: 'useRef returns a mutable object { current: value } that persists across renders. Updating ref.current does not cause a re-render. This makes refs ideal for DOM access and storing values that effects need without adding dependencies.' },
      { type: 'h2', text: 'DOM refs' },
      {
        type: 'code',
        title: 'Focus an input on mount',
        language: 'jsx',
        code: `import { useEffect, useRef } from 'react';

function SearchField() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return <input ref={inputRef} placeholder="Search tutorials" />;
}`,
      },
      { type: 'h2', text: 'Measuring and scrolling' },
      {
        type: 'code',
        title: 'Scroll chat to bottom',
        language: 'jsx',
        code: `function Chat({ messages }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  return (
    <div className="chat">
      {messages.map((m) => <Message key={m.id} msg={m} />)}
      <div ref={bottomRef} />
    </div>
  );
}`,
      },
      { type: 'h2', text: 'Mutable instance values' },
      { type: 'p', text: 'Store timer IDs, previous prop values, or any value that should survive renders but should not trigger updates when changed.' },
      {
        type: 'code',
        title: 'Track previous value',
        language: 'jsx',
        code: `function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}`,
      },
      {
        type: 'table',
        headers: ['Use ref for', 'Use state for'],
        rows: [
          ['DOM node references', 'Values that affect rendered output'],
          ['Timer and interval IDs', 'Form field values shown on screen'],
          ['Latest callback without effect deps', 'Toggle and selection UI'],
          ['Previous render values', 'Anything the user should see update'],
        ],
      },
      { type: 'h3', text: 'Ref forwarding' },
      {
        type: 'code',
        title: 'forwardRef pattern',
        language: 'jsx',
        code: `import { forwardRef } from 'react';

const TextInput = forwardRef(function TextInput(props, ref) {
  return <input ref={ref} {...props} />;
});

// Parent can now pass ref to the inner input
const ref = useRef(null);
<TextInput ref={ref} />`,
      },
      { type: 'warning', text: 'Do not read or write ref.current during render to decide what JSX to return. That belongs in state or derived render logic.' },
      { type: 'try', text: 'Build a modal with an autofocused close button using useRef and useEffect.' },
      { type: 'keypoints', items: ['useRef holds a mutable .current across renders.', 'Attach refs to DOM elements with the ref prop.', 'Updating ref.current does not re-render.', 'Use forwardRef when parent needs access to child DOM nodes.'] },
    ],
  },
  {
    slug: 'usereducer',
    title: 'useReducer',
    description: 'Manage complex state transitions with reducers, actions, and dispatch.',
    level: 'intermediate',
    section: 'Hooks Toolkit',
    order: 26,
    minutes: 15,
    content: [
      { type: 'p', text: 'useReducer is an alternative to useState for state with multiple sub-values or when the next state depends on a complex previous state. You define a reducer function (state, action) => newState and dispatch actions to trigger updates.' },
      { type: 'h2', text: 'Basic reducer' },
      {
        type: 'code',
        title: 'Counter reducer',
        language: 'jsx',
        code: `const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return initialState;
    default:
      throw new Error('Unknown action: ' + action.type);
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      <p>{state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
    </>
  );
}`,
      },
      { type: 'h2', text: 'When to prefer useReducer' },
      {
        type: 'table',
        headers: ['useState', 'useReducer'],
        rows: [
          ['Simple independent values', 'Many related fields updated together'],
          ['Few update paths', 'Complex transitions with named actions'],
          ['No shared update logic', 'Same update logic reused in multiple places'],
          ['Beginner-friendly', 'Easier to test reducer in isolation'],
        ],
      },
      { type: 'h2', text: 'Todo list reducer' },
      {
        type: 'code',
        title: 'Actions for todos',
        language: 'jsx',
        code: `function todosReducer(state, action) {
  switch (action.type) {
    case 'added':
      return [...state, { id: action.id, text: action.text, done: false }];
    case 'toggled':
      return state.map((t) =>
        t.id === action.id ? { ...t, done: !t.done } : t,
      );
    case 'deleted':
      return state.filter((t) => t.id !== action.id);
    default:
      return state;
  }
}`,
      },
      { type: 'h3', text: 'Lazy initialization' },
      {
        type: 'code',
        title: 'useReducer with init function',
        language: 'jsx',
        code: `function init(initialCount) {
  return { count: initialCount };
}

const [state, dispatch] = useReducer(reducer, 0, init);`,
      },
      { type: 'tip', text: 'Keep action types as string constants or a union type in TypeScript. Payload goes on the action object: { type: "added", id, text }.' },
      { type: 'try', text: 'Refactor your todo app from multiple useState calls to a single useReducer with added, toggled, and deleted actions.' },
      { type: 'keypoints', items: ['useReducer manages state via (state, action) => newState.', 'Dispatch actions instead of calling many setters.', 'Reducers must be pure: no side effects inside.', 'Prefer useReducer for complex or interrelated state.'] },
    ],
  },
  {
    slug: 'context-api',
    title: 'Context API',
    description: 'Share theme, auth, and locale data across the tree without prop drilling.',
    level: 'intermediate',
    section: 'Hooks Toolkit',
    order: 27,
    minutes: 15,
    content: [
      { type: 'p', text: 'Context lets a provider component supply a value to any descendant without passing props through every intermediate layer. It solves prop drilling for broadly used, relatively stable data like theme, locale, or current user.' },
      { type: 'h2', text: 'Creating and consuming context' },
      {
        type: 'code',
        title: 'Theme context',
        language: 'jsx',
        code: `import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const value = { theme, setTheme };
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme requires ThemeProvider');
  return ctx;
}`,
      },
      { type: 'h2', text: 'Wrapping the app' },
      {
        type: 'code',
        title: 'Provider at the root',
        language: 'jsx',
        code: `// main.tsx
<ThemeProvider>
  <AuthProvider>
    <App />
  </AuthProvider>
</ThemeProvider>

// Any deep child
function SettingsPage() {
  const { theme, setTheme } = useTheme();
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Toggle theme
    </button>
  );
}`,
      },
      { type: 'h2', text: 'Auth context pattern' },
      {
        type: 'code',
        title: 'Auth provider sketch',
        language: 'jsx',
        code: `const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const value = {
    user,
    login: setUser,
    logout: () => setUser(null),
    isAuthenticated: !!user,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}`,
      },
      {
        type: 'table',
        headers: ['Good for context', 'Poor for context'],
        rows: [
          ['Theme, locale, auth user', 'High-frequency form field values'],
          ['Feature flags', 'Large lists that change often'],
          ['Router/layout config', 'Derived data you can compute locally'],
        ],
      },
      { type: 'warning', text: 'All consumers re-render when the context value changes. Split contexts or memoize value objects to avoid unnecessary renders.' },
      { type: 'note', text: 'Always guard useContext with a custom hook that throws if the provider is missing. Fail fast with a clear error message.' },
      { type: 'try', text: 'Add a ThemeProvider with light/dark mode. Style a card component using the current theme from context.' },
      { type: 'keypoints', items: ['Context avoids prop drilling for shared data.', 'Wrap the tree in a Provider with a value object.', 'Export a useX hook that wraps useContext.', 'Avoid putting fast-changing data in a single large context.'] },
    ],
  },
  {
    slug: 'context-plus-reducer',
    title: 'Context + Reducer Pattern',
    description: 'Combine useReducer with Context for predictable global state without external libraries.',
    level: 'intermediate',
    section: 'Hooks Toolkit',
    order: 28,
    minutes: 16,
    content: [
      { type: 'p', text: 'Pairing useReducer with Context gives you a lightweight global state pattern similar to Redux, built into React. The reducer centralizes update logic; context distributes state and dispatch to the tree.' },
      { type: 'h2', text: 'Cart state example' },
      {
        type: 'code',
        title: 'Reducer + context',
        language: 'jsx',
        code: `const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case 'add':
      return { items: [...state.items, action.item] };
    case 'remove':
      return { items: state.items.filter((i) => i.id !== action.id) };
    case 'clear':
      return { items: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}`,
      },
      { type: 'h2', text: 'Dispatch-only context split' },
      { type: 'p', text: 'If consumers only need to dispatch actions, split state and dispatch into separate contexts. Components that only dispatch will not re-render when state changes.' },
      {
        type: 'code',
        title: 'Split state and dispatch',
        language: 'jsx',
        code: `const CartStateContext = createContext(null);
const CartDispatchContext = createContext(null);

export function useCartState() {
  return useContext(CartStateContext);
}

export function useCartDispatch() {
  return useContext(CartDispatchContext);
}

// Provider passes state and dispatch to separate contexts`,
      },
      { type: 'h2', text: 'Memoizing the provider value' },
      { type: 'p', text: 'A new object literal every render ({ state, dispatch }) forces all consumers to re-render. Wrap the value in useMemo when state is stable enough, or split contexts as shown above.' },
      {
        type: 'code',
        title: 'Stable dispatch with useCallback',
        language: 'jsx',
        code: `// dispatch from useReducer is already stable in React 18+
// Memoize derived value objects:
const value = useMemo(
  () => ({ items: state.items, total: computeTotal(state.items) }),
  [state.items],
);`,
      },
      {
        type: 'table',
        headers: ['Pattern', 'Benefit'],
        rows: [
          ['Reducer in provider', 'Centralized, testable update logic'],
          ['Custom useCart hook', 'Hides context details from consumers'],
          ['Split state/dispatch contexts', 'Fewer re-renders for action-only components'],
          ['useMemo on value', 'Avoids re-renders from new object identity'],
        ],
      },
      { type: 'tip', text: 'This pattern scales to medium apps. For very large apps with many slices, consider Zustand, Jotai, or Redux Toolkit.' },
      { type: 'try', text: 'Build a notes context with add, edit, and delete actions via useReducer. Consume it in a sidebar list and an editor panel.' },
      { type: 'keypoints', items: ['useReducer + Context replaces many useState calls at the root.', 'Export custom hooks for state and dispatch.', 'Split contexts to reduce unnecessary re-renders.', 'Memoize provider values when passing object literals.'] },
    ],
  },
  {
    slug: 'state-colocation-lifting',
    title: 'State Colocation vs Lifting State Up',
    description: 'Decide where state belongs as features grow and avoid premature global state.',
    level: 'intermediate',
    section: 'Hooks Toolkit',
    order: 29,
    minutes: 14,
    content: [
      { type: 'p', text: 'Colocation means keeping state as close as possible to where it is used. Lifting state up means moving it to the nearest parent shared by components that need it. Good architecture balances both.' },
      { type: 'h2', text: 'Start local, lift when needed' },
      {
        type: 'code',
        title: 'Lifted filter state',
        language: 'jsx',
        code: `function CourseHub({ lessons }) {
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState('beginner');

  const visible = lessons.filter(
    (l) => l.level === level && l.title.includes(query),
  );

  return (
    <>
      <SearchBar value={query} onChange={setQuery} />
      <LevelTabs value={level} onChange={setLevel} />
      <LessonList lessons={visible} />
    </>
  );
}`,
      },
      { type: 'h2', text: 'Decision guide' },
      {
        type: 'table',
        headers: ['Situation', 'Where state lives'],
        rows: [
          ['One component uses it', 'Local useState in that component'],
          ['Sibling components need it', 'Lift to shared parent'],
          ['Many distant descendants need it', 'Context or dedicated store'],
          ['Server data shared app-wide', 'Context, React Query, or route loaders'],
          ['URL should reflect state', 'Lift to router (search params)'],
        ],
      },
      { type: 'h2', text: 'Avoid lifting too early' },
      { type: 'p', text: 'Not every piece of state belongs in context or Redux. A modal open flag usually stays in the component that opens it unless multiple distant triggers need it.' },
      {
        type: 'code',
        title: 'Colocated modal state',
        language: 'jsx',
        code: `function LessonCard({ lesson }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <button onClick={() => setShowDetails(true)}>Details</button>
      {showDetails && (
        <Modal onClose={() => setShowDetails(false)}>
          {lesson.description}
        </Modal>
      )}
    </>
  );
}`,
      },
      { type: 'h3', text: 'Derived state anti-pattern' },
      { type: 'p', text: 'Do not store values you can compute during render. If filteredLessons depends on lessons and query, compute it in the parent instead of syncing with useEffect.' },
      {
        type: 'code',
        title: 'Derive, do not duplicate',
        language: 'jsx',
        code: `// Good: derived during render
const visible = lessons.filter((l) => l.title.includes(query));

// Bad: effect syncs filtered list into separate state
useEffect(() => {
  setFiltered(lessons.filter((l) => l.title.includes(query)));
}, [lessons, query]);`,
      },
      { type: 'warning', text: 'Prop drilling three levels is often fine. Context for everything creates hidden dependencies and harder-to-trace updates.' },
      { type: 'try', text: 'Refactor a parent that holds both filter text and selected lesson id. Pass only the props each child actually needs.' },
      { type: 'keypoints', items: ['Colocate state with the UI that uses it.', 'Lift state when siblings must stay in sync.', 'Use context or a store only when drilling becomes painful.', 'Derive values in render instead of duplicating state.'] },
    ],
  },
  {
    slug: 'react-router-basics',
    title: 'React Router: Routes and Setup',
    description: 'Set up client-side routing with React Router, map URLs to components, and structure a multi-page SPA.',
    level: 'intermediate',
    section: 'Routing & Structure',
    order: 30,
    minutes: 15,
    content: [
      { type: 'p', text: 'Single-page applications need client-side routing so different URLs show different screens without full page reloads. React Router is the standard routing library for Vite and CRA React apps.' },
      { type: 'h2', text: 'Installation and setup' },
      {
        type: 'code',
        title: 'Install React Router',
        language: 'bash',
        code: `npm install react-router-dom`,
      },
      {
        type: 'code',
        title: 'Basic app routes',
        language: 'jsx',
        code: `import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ReactHub from './pages/ReactHub';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tutorials/react" element={<ReactHub />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}`,
      },
      { type: 'h2', text: 'Route matching rules' },
      {
        type: 'table',
        headers: ['Path pattern', 'Matches'],
        rows: [
          ['/', 'Exactly the root'],
          ['/about', 'Exactly /about'],
          ['/lessons/:slug', 'Dynamic segment, e.g. /lessons/jsx-basics'],
          ['*', 'Catch-all for 404 pages'],
        ],
      },
      { type: 'h2', text: 'Programmatic navigation' },
      {
        type: 'code',
        title: 'useNavigate hook',
        language: 'jsx',
        code: `import { useNavigate } from 'react-router-dom';

function SaveButton() {
  const navigate = useNavigate();

  async function handleSave() {
    await saveLesson();
    navigate('/tutorials/react');
  }

  return <button onClick={handleSave}>Save and return</button>;
}`,
      },
      { type: 'h3', text: 'BrowserRouter vs HashRouter' },
      { type: 'p', text: 'BrowserRouter uses clean URLs (/about) and requires server config to serve index.html for all routes. HashRouter uses /#/about and works on static hosts without server rewrites.' },
      { type: 'note', text: 'Next.js has its own file-based router. The concepts (paths, dynamic segments, layouts) transfer directly when you move to the Next.js tutorial.' },
      { type: 'try', text: 'Add routes for Home, React tutorial hub, and a NotFound page. Navigate between them and confirm the URL changes without a full reload.' },
      { type: 'keypoints', items: ['BrowserRouter wraps the app for HTML5 history routing.', 'Routes and Route map paths to elements.', 'useNavigate imperatively changes the URL.', 'Add a catch-all * route for 404 pages.'] },
    ],
  },
  {
    slug: 'nested-routes-links-params',
    title: 'Nested Routes, Links, and Params',
    description: 'Build layouts with Outlet, navigate with Link and NavLink, and read dynamic URL parameters.',
    level: 'intermediate',
    section: 'Routing & Structure',
    order: 31,
    minutes: 16,
    content: [
      { type: 'p', text: 'Production apps combine nested layouts, declarative navigation, and dynamic URL segments. This lesson covers Outlet for shared chrome, Link and NavLink for navigation, and hooks for reading params and search strings.' },
      { type: 'h2', text: 'Layout route with Outlet' },
      {
        type: 'code',
        title: 'Dashboard layout',
        language: 'jsx',
        code: `import { Outlet } from 'react-router-dom';

function DashboardLayout() {
  return (
    <div className="dashboard">
      <Sidebar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

<Routes>
  <Route path="/dashboard" element={<DashboardLayout />}>
    <Route index element={<Overview />} />
    <Route path="courses" element={<Courses />} />
  </Route>
</Routes>`,
      },
      { type: 'h2', text: 'Link and NavLink' },
      {
        type: 'code',
        title: 'Navigation components',
        language: 'jsx',
        code: `import { Link, NavLink } from 'react-router-dom';

<Link to="/tutorials/react">React Track</Link>

<NavLink
  to="/tutorials/react"
  className={({ isActive }) => (isActive ? 'nav active' : 'nav')}
>
  React
</NavLink>`,
      },
      { type: 'h2', text: 'Dynamic params and search' },
      {
        type: 'code',
        title: 'useParams and useSearchParams',
        language: 'jsx',
        code: `function LessonPage() {
  const { slug } = useParams();
  const [params, setParams] = useSearchParams();
  const level = params.get('level') ?? 'beginner';

  const lesson = getLessonBySlug(slug);
  if (!lesson) return <p>Lesson not found.</p>;

  return <LessonView lesson={lesson} level={level} />;
}`,
      },
      {
        type: 'table',
        headers: ['URL', 'Renders'],
        rows: [
          ['/tutorials/react', 'ReactLayout + overview (index route)'],
          ['/tutorials/react/jsx-basics', 'ReactLayout + LessonPage'],
          ['?level=advanced', 'Filter state from search params'],
        ],
      },
      { type: 'h3', text: 'Relative paths in nested routes' },
      {
        type: 'code',
        title: 'Relative Link paths',
        language: 'jsx',
        code: `// Inside /tutorials/react layout
<Link to="jsx-basics">JSX lesson</Link>
<Link to="..">All tutorials</Link>`,
      },
      { type: 'warning', text: 'URL params are always strings. Parse numbers with Number() when needed.' },
      { type: 'try', text: 'Create a CourseLayout with NavLink sidebar and a :slug lesson route. Add level filter via search params.' },
      { type: 'keypoints', items: ['Outlet renders matched child routes inside a layout.', 'Link navigates without reload; NavLink adds active styling.', 'useParams reads :dynamic segments; useSearchParams handles query strings.', 'Index routes render at the parent path exactly.'] },
    ],
  },
  {
    slug: 'lazy-loading-suspense',
    title: 'Lazy Loading with React.lazy and Suspense',
    description: 'Code-split routes and components to reduce initial bundle size and improve load time.',
    level: 'intermediate',
    section: 'Routing & Structure',
    order: 32,
    minutes: 14,
    content: [
      { type: 'p', text: 'Large apps should not ship every page in the first JavaScript bundle. React.lazy lets you dynamically import components. Suspense shows a fallback while the chunk loads.' },
      { type: 'h2', text: 'Lazy component import' },
      {
        type: 'code',
        title: 'React.lazy syntax',
        language: 'jsx',
        code: `import { lazy, Suspense } from 'react';

const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const LessonPlayer = lazy(() => import('./features/LessonPlayer'));

function App() {
  return (
    <Suspense fallback={<PageSpinner />}>
      <Routes>
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/play/:id" element={<LessonPlayer />} />
      </Routes>
    </Suspense>
  );
}`,
      },
      { type: 'h2', text: 'Route-level splitting' },
      { type: 'p', text: 'The most common pattern is one lazy import per route. Users download admin code only when they visit /admin.' },
      {
        type: 'code',
        title: 'Lazy route modules',
        language: 'jsx',
        code: `const ReactHub = lazy(() => import('./pages/ReactHub'));
const NextHub = lazy(() => import('./pages/NextHub'));

<Route
  path="/tutorials/react"
  element={
    <Suspense fallback={<HubSkeleton />}>
      <ReactHub />
    </Suspense>
  }
/>`,
      },
      { type: 'h2', text: 'Fallback UI best practices' },
      {
        type: 'table',
        headers: ['Fallback type', 'When to use'],
        rows: [
          ['Spinner', 'Short loads, unknown duration'],
          ['Skeleton layout', 'Route with known structure'],
          ['Previous route visible', 'With startTransition for smoother UX'],
          ['Error boundary nearby', 'Catch failed chunk loads'],
        ],
      },
      { type: 'h3', text: 'Named exports with lazy' },
      {
        type: 'code',
        title: 'Lazy load named export',
        language: 'jsx',
        code: `const Chart = lazy(() =>
  import('./Chart').then((mod) => ({ default: mod.Chart })),
);`,
      },
      { type: 'note', text: 'Vite and webpack automatically create separate chunks for dynamic import(). No extra config needed for basic route splitting.' },
      { type: 'warning', text: 'lazy only works with default exports unless you map named exports manually. Plan your module exports accordingly.' },
      { type: 'try', text: 'Lazy load one heavy page in your app. Open Network tab and confirm a separate chunk loads on navigation.' },
      { type: 'keypoints', items: ['React.lazy dynamic-imports components on demand.', 'Suspense wraps lazy components with a fallback.', 'Split at route boundaries for the biggest wins.', 'Design meaningful fallbacks, not blank screens.'] },
    ],
  },
  {
    slug: 'form-validation-keys-portals',
    title: 'Form Validation, Keys, and Portals',
    description: 'Validate forms in React, understand key remounting behavior, and render modals with portals.',
    level: 'intermediate',
    section: 'Routing & Structure',
    order: 33,
    minutes: 16,
    content: [
      { type: 'p', text: 'This lesson covers three intermediate topics that appear constantly in production apps: validating user input, controlling remounting with keys, and rendering modals outside the DOM hierarchy with portals.' },
      { type: 'h2', text: 'Form validation patterns' },
      {
        type: 'code',
        title: 'Client-side validation',
        language: 'jsx',
        code: `function SignupForm() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});

  function validate() {
    const next = {};
    if (!email.includes('@')) next.email = 'Enter a valid email';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    // submit...
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      {errors.email && <p className="error">{errors.email}</p>}
      <button type="submit">Sign up</button>
    </form>
  );
}`,
      },
      { type: 'h2', text: 'Validation strategies' },
      {
        type: 'table',
        headers: ['Approach', 'Tradeoff'],
        rows: [
          ['Manual state + errors object', 'Full control, more boilerplate'],
          ['Validate on blur/submit', 'Less noisy than per-keystroke'],
          ['Schema library (Zod + react-hook-form)', 'Scales to large forms'],
          ['Server validation', 'Always required for security'],
        ],
      },
      { type: 'h2', text: 'Keys and remounting' },
      { type: 'p', text: 'Changing a component key forces React to unmount the old instance and mount a fresh one. Use this to reset internal state when switching items.' },
      {
        type: 'code',
        title: 'Reset form when user changes',
        language: 'jsx',
        code: `function UserEditor({ userId, user }) {
  return <ProfileForm key={userId} defaultUser={user} />;
}
// New userId = new key = form state resets`,
      },
      { type: 'h2', text: 'Portals for modals' },
      {
        type: 'code',
        title: 'createPortal',
        language: 'jsx',
        code: `import { createPortal } from 'react-dom';

function Modal({ open, onClose, children }) {
  if (!open) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.getElementById('modal-root'),
  );
}`,
      },
      { type: 'h3', text: 'Why portals matter' },
      { type: 'ul', items: ['Modals render at document body, escaping overflow:hidden parents.', 'Event bubbling still works through the React tree.', 'Focus trap and aria-modal attributes improve accessibility.'] },
      { type: 'tip', text: 'Add a div id="modal-root" in index.html for portal targets.' },
      { type: 'try', text: 'Build a modal dialog with createPortal. Open it from a card and close on overlay click or Escape key.' },
      { type: 'keypoints', items: ['Validate on submit or blur; show field-level errors.', 'Changing key remounts a component and resets its state.', 'Portals render UI outside the parent DOM hierarchy.', 'Use portals for modals, tooltips, and dropdowns that must escape layout constraints.'] },
    ],
  },
  {
    slug: 'intermediate-project-notes-app',
    title: 'Intermediate Project: Notes App',
    description: 'Build a notes app combining routing, context, reducer, effects, and localStorage persistence.',
    level: 'intermediate',
    section: 'Routing & Structure',
    order: 34,
    minutes: 25,
    content: [
      { type: 'p', text: 'This capstone for the intermediate section brings together effects, custom hooks, useReducer, Context, React Router, and form validation. You will build a notes app with multiple notes, routing to individual notes, and persisted storage.' },
      { type: 'h2', text: 'Requirements' },
      { type: 'ol', items: ['List all notes with title preview and updated date.', 'Create a new note from a form with title and body validation.', 'Route to /notes/:id for editing a single note.', 'Edit and delete notes with confirmation for delete.', 'Persist notes to localStorage via a custom hook or effect.', 'Show empty state when no notes exist.'] },
      { type: 'h2', text: 'Suggested architecture' },
      {
        type: 'code',
        title: 'Folder structure',
        language: 'text',
        code: `src/
  features/notes/
    NotesProvider.tsx    (reducer + context)
    useNotes.ts          (consumer hook)
    notesReducer.ts
    NotesListPage.tsx
    NoteEditorPage.tsx
    NoteForm.tsx
  App.tsx                (routes)`,
      },
      { type: 'h2', text: 'Notes reducer' },
      {
        type: 'code',
        title: 'Reducer actions',
        language: 'tsx',
        code: `type Note = { id: string; title: string; body: string; updatedAt: string };

function notesReducer(state: Note[], action) {
  switch (action.type) {
    case 'add':
      return [...state, action.note];
    case 'update':
      return state.map((n) =>
        n.id === action.id ? { ...n, ...action.patch, updatedAt: new Date().toISOString() } : n,
      );
    case 'delete':
      return state.filter((n) => n.id !== action.id);
    case 'hydrate':
      return action.notes;
    default:
      return state;
  }
}`,
      },
      { type: 'h2', text: 'Routing setup' },
      {
        type: 'code',
        title: 'Note routes',
        language: 'jsx',
        code: `<Route path="/notes" element={<NotesLayout />}>
  <Route index element={<NotesListPage />} />
  <Route path="new" element={<NewNotePage />} />
  <Route path=":id" element={<NoteEditorPage />} />
</Route>`,
      },
      {
        type: 'code',
        title: 'Load note by param',
        language: 'jsx',
        code: `function NoteEditorPage() {
  const { id } = useParams();
  const { notes, dispatch } = useNotes();
  const note = notes.find((n) => n.id === id);

  if (!note) return <Navigate to="/notes" replace />;
  return <NoteForm note={note} onSave={(patch) => dispatch({ type: 'update', id, patch })} />;
}`,
      },
      { type: 'h3', text: 'Stretch goals' },
      { type: 'ul', items: ['Search/filter notes by title.', 'Markdown preview toggle.', 'Lazy load the editor page.', 'Autosave with debounced dispatch.'] },
      { type: 'tip', text: 'Build the reducer and list view first without routing. Add routes and persistence once CRUD works in memory.' },
      { type: 'try', text: 'Implement the notes app in your Vite project. Deploy the static build to verify routes work with a SPA fallback.' },
      { type: 'keypoints', items: ['Combine reducer + context for shared notes state.', 'Use routes for list, new, and edit views.', 'Persist to localStorage with effects or a custom hook.', 'Validate forms and handle empty and not-found states.'] },
    ],
  },
];
